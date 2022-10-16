import React, { useState } from "react";
import { Button, Typography, TextField } from "@mui/joy";
import { BigNumber, utils } from "ethers";
import { useBalance, useAccount } from "wagmi";

import { Dialog } from "../../../components/Dialog";
import { useKalos, useKalosEvent } from "../../../hooks";
import {
  toast,
  toastOnTxSent,
  ZERO_ADDRESS,
  ETHEREUM_ADDRESS_PATTERN,
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

  const contractInstance = useKalos();

  useKalosEvent(
    "TransferArtwork",
    (event) => {
      toast("Transction confirmed. NFT has been transferred!", {
        type: "success",
      });
      onTransferConfirmed?.();
    },
    true,
  );

  const checkToAddress = () => {
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
  };

  const handleTransfer = async () => {
    const checkPassed = checkToAddress();
    if (!checkPassed) {
      return;
    }
    try {
      setIsLoading(true);
      const transferTxInfo = await contractInstance.transfer(
        artworkId,
        toAddress,
      );
      console.log("transferTxInfo", transferTxInfo);
      toastOnTxSent(transferTxInfo.hash);
      onClose();
    } catch (e) {
      console.log("handleTransfer", "error", e);
      toast("Transaction failed to sent. Please retry", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToAddressError("");
    setToAddress(e.currentTarget.value);
  };

  return (
    <Dialog
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
          Please input the transferee address:
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
