import React, { useState, useRef, useCallback } from "react";
import { Typography, TextField } from "@mui/joy";
import { useAccount } from "wagmi";

import { Dialog } from "../../../components";
import { useKalos, useTrackTx } from "../../../hooks";
import {
  shake,
  ZERO_ADDRESS,
  ETHEREUM_ADDRESS_PATTERN,
  toastOnEthersError,
} from "../../../utils";

type TransferDialogProps = {
  artworkId: string;
  open: boolean;
  onClose: () => void;
  onTransferConfirmed?: () => void;
};

const TransferDialog = (props: TransferDialogProps) => {
  const { artworkId, open, onClose, onTransferConfirmed } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [toAddress, setToAddress] = useState("");
  const { address: myAddress } = useAccount();
  const [toAddressError, setToAddressError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  const contractInstance = useKalos();
  const { setTrackTxHash } = useTrackTx({
    confirmedToastConfig: {
      text: "Transaction confirmed. Artwork has been transferred!",
    },
    onSuccess: () => onTransferConfirmed?.(),
  });

  const checkToAddress = useCallback(() => {
    if (!ETHEREUM_ADDRESS_PATTERN.test(toAddress)) {
      setToAddressError("The address is not a valid Ethereum address");
      return false;
    }
    if (toAddress === ZERO_ADDRESS) {
      setToAddressError("Transferee cannot be zero address");
      return false;
    }
    if (toAddress === myAddress) {
      setToAddressError("Transferee cannot be myself");
      return false;
    }
    setToAddressError("");
    return true;
  }, [toAddress, setToAddressError, myAddress]);

  const handleTransfer = useCallback(async () => {
    const checkPassed = checkToAddress();
    if (!checkPassed) {
      shake(dialogRef);
      return;
    }
    try {
      setIsLoading(true);
      const transferTxInfo = await contractInstance.transfer(
        artworkId,
        toAddress,
      );
      console.log("transferTxInfo", transferTxInfo);
      setTrackTxHash(transferTxInfo.hash);
      onClose();
    } catch (error) {
      console.log("handleTransfer", "error", error);
      toastOnEthersError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [checkToAddress, setIsLoading, contractInstance, setTrackTxHash, onClose]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setToAddressError("");
      setToAddress(e.currentTarget.value);
    },
    [setToAddressError, setToAddress],
  );

  return (
    <Dialog
      ref={dialogRef}
      size={"small"}
      title={"Transfer your artwork"}
      open={open}
      onClose={onClose}
      onConfirm={handleTransfer}
      confirmText="Transfer"
      loading={isLoading}
      confirmDisabled={Boolean(toAddressError)}
    >
      <>
        <Typography level={"h6"}>
          Please input the transferee address: (The tip balance will also be
          transferred to the transferee)
        </Typography>
        <TextField
          sx={{ marginTop: "10px" }}
          placeholder="(e.g. 0x0000000000000000000000000000000000000001)"
          variant="outlined"
          required
          size="md"
          value={toAddress}
          onChange={handleChange}
          helperText={toAddressError}
          error={Boolean(toAddressError)}
        />
      </>
    </Dialog>
  );
};

export { TransferDialog };
