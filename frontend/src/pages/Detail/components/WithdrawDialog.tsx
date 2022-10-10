import React, { useEffect, useState } from "react";
import { Button, Typography, Slider } from "@mui/joy";
import { BigNumber, utils } from "ethers";

import { Dialog } from "../../../components/Dialog";
import { useKalos, useKalosEvent } from "../../../hooks";
import { toast } from "../../../utils";

type WithdrawDialogProps = {
  artworkId: string;
  open: boolean;
  onClose: () => void;
  tipBalance: string;
};

const MIN_WITHDRAW_ETHER_AMOUNT = 0.0001;

const WithdrawDialog = (props: WithdrawDialogProps) => {
  const { artworkId, open, onClose, tipBalance } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(
    MIN_WITHDRAW_ETHER_AMOUNT,
  );
  const contractInstance = useKalos();

  useKalosEvent(
    "Withdraw",
    (event) => {
      toast("Transction confirmed. Tip amount has been withdrawn!", {
        type: "success",
      });
    },
    true,
  );

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);
      const result = await contractInstance["withdraw(uint256,uint256)"](
        artworkId,
        utils.parseUnits(String(withdrawAmount), "ether").toNumber(),
      );
      console.log("handleWithdraw", "result", result);
      toast("Transaction sent. Waiting for confirmation...");
      onClose();
    } catch (e) {
      console.log("handleWithdraw", "error", e);
      toast("Transaction failed to sent. Please retry", { type: "error" });
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
          max={Number(tipBalance) || 100}
          step={MIN_WITHDRAW_ETHER_AMOUNT}
          value={withdrawAmount}
          onChange={(e, value) => setWithdrawAmount(value as number)}
        ></Slider>
      </>
    </Dialog>
  );
};

export { WithdrawDialog };
