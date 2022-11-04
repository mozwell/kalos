import React, { useState, useCallback } from "react";
import { Typography, Slider } from "@mui/joy";
import { utils } from "ethers";

import { Dialog } from "../../../components";
import { useKalos, useTrackTx } from "../../../hooks";
import { toastOnEthersError } from "../../../utils";

type WithdrawDialogProps = {
  artworkId: string;
  open: boolean;
  onClose: () => void;
  tipBalance: number;
  onWithdrawConfirmed?: () => void;
};

const WITHDRAW_ETHER_DECIMAL_DIGIT = 4;
const MIN_WITHDRAW_ETHER_AMOUNT =
  1 / Math.pow(10, WITHDRAW_ETHER_DECIMAL_DIGIT);
const DEFAULT_WITHDRAW_MAX_AMOUNT = 100;

const WithdrawDialog = (props: WithdrawDialogProps) => {
  const { artworkId, open, onClose, tipBalance, onWithdrawConfirmed } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(
    MIN_WITHDRAW_ETHER_AMOUNT,
  );
  const contractInstance = useKalos();

  // A workaround to keep the dialog instance exist rather than unmount it so as to help useTrackTx work as expected.
  // TODO: To elevate useTrackTx to the top context so it could be called everywhere.
  const handleCloseWithReset = useCallback(() => {
    setWithdrawAmount(MIN_WITHDRAW_ETHER_AMOUNT);
    onClose();
  }, [setWithdrawAmount, onClose]);

  const { setTrackTxHash } = useTrackTx({
    confirmedToastConfig: {
      text: "Transaction confirmed. Tip amount has been withdrawn!",
    },
    onSuccess: () => onWithdrawConfirmed?.(),
  });

  const handleWithdraw = useCallback(async () => {
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
      handleCloseWithReset();
    } catch (error) {
      console.log("handleWithdraw", "error", error);
      toastOnEthersError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [
    setIsLoading,
    contractInstance,
    artworkId,
    withdrawAmount,
    setTrackTxHash,
    handleCloseWithReset,
  ]);

  const handleSliderChange = useCallback(
    // Here we will never get number[];
    (e: Event, value: number | number[]) => setWithdrawAmount(value as number),
    [setWithdrawAmount],
  );

  return (
    <Dialog
      size={"small"}
      title={"Withdraw from tip balance"}
      open={open}
      onClose={handleCloseWithReset}
      onConfirm={handleWithdraw}
      confirmText="Withdraw"
      loading={isLoading}
    >
      <>
        <Typography level={"h6"}>
          Please choose the withdraw amount:{" "}
          {withdrawAmount.toFixed(WITHDRAW_ETHER_DECIMAL_DIGIT)} Ethers
        </Typography>
        <Slider
          size={"lg"}
          valueLabelDisplay={"auto"}
          min={MIN_WITHDRAW_ETHER_AMOUNT}
          max={tipBalance || DEFAULT_WITHDRAW_MAX_AMOUNT}
          step={MIN_WITHDRAW_ETHER_AMOUNT}
          value={withdrawAmount}
          onChange={handleSliderChange}
        ></Slider>
      </>
    </Dialog>
  );
};

export { WithdrawDialog };
