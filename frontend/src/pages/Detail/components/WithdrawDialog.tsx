import React, { useEffect, useState } from "react";
import { Button, Typography, Slider } from "@mui/joy";
import { BigNumber, utils } from "ethers";

import { Dialog } from "../../../components/Dialog";
import { useKalos, useKalosEvent, useTrackTx } from "../../../hooks";
import { toast, toastOnTxSent, toastOnEthersError } from "../../../utils";

type WithdrawDialogProps = {
  artworkId: string;
  open: boolean;
  onClose: () => void;
  tipBalance: string;
  onWithdrawConfirmed?: () => void;
};

const MIN_WITHDRAW_ETHER_AMOUNT = 0.0001;
const DEFAULT_WITHDRAW_MAX_AMOUNT = 100;

const WithdrawDialog = (props: WithdrawDialogProps) => {
  const { artworkId, open, onClose, tipBalance, onWithdrawConfirmed } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(
    MIN_WITHDRAW_ETHER_AMOUNT,
  );
  const contractInstance = useKalos();

  const { setTrackTxHash } = useTrackTx({
    confirmedToastConfig: {
      text: "Transaction confirmed. Tip amount has been withdrawn!",
    },
    onSuccess: () => onWithdrawConfirmed?.(),
  });

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);
      const withdrawTxInfo = await contractInstance[
        "withdraw(uint256,uint256)"
      ](
        artworkId,
        // It is safer to pass amount in string than in number to avoid overflow.
        utils.parseUnits(String(withdrawAmount), "ether").toString(),
      );
      console.log("withdrawTxInfo", withdrawTxInfo);
      setTrackTxHash(withdrawTxInfo.hash);
      onClose();
    } catch (error) {
      console.log("handleWithdraw", "error", error);
      toastOnEthersError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      size={"small"}
      title={"Withdraw from tip balance"}
      open={open}
      onClose={onClose}
      onConfirm={handleWithdraw}
      confirmText="Withdraw"
      loading={isLoading}
    >
      <>
        <Typography level={"h6"}>
          Please choose the withdraw amount: {withdrawAmount} Ethers
        </Typography>
        <Slider
          size={"lg"}
          valueLabelDisplay={"auto"}
          min={MIN_WITHDRAW_ETHER_AMOUNT}
          max={Number(tipBalance) || DEFAULT_WITHDRAW_MAX_AMOUNT}
          step={MIN_WITHDRAW_ETHER_AMOUNT}
          value={withdrawAmount}
          onChange={(e, value) => setWithdrawAmount(value as number)}
        ></Slider>
      </>
    </Dialog>
  );
};

export { WithdrawDialog };
