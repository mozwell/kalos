import React, { useState } from "react";
import { Button, Typography, Slider } from "@mui/joy";
import { BigNumber, utils } from "ethers";
import { useBalance, useAccount } from "wagmi";

import { Dialog } from "../../../components/Dialog";
import { useKalos, useKalosEvent } from "../../../hooks";
import { toast } from "../../../utils";

type TipDialogProps = {
  artworkId: string;
  open: boolean;
  onClose: () => void;
};

const MIN_TIP_ETHER_AMOUNT = 0.0001;

const TipDialog = (props: TipDialogProps) => {
  const { artworkId, open, onClose } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [tipAmount, setTipAmount] = useState(MIN_TIP_ETHER_AMOUNT);
  const { address } = useAccount();
  const { data: balanceData, isError } = useBalance({
    addressOrName: address,
  });

  // const formattedBalance = utils.formatEther(balanceData?.formatted)

  const contractInstance = useKalos();

  useKalosEvent(
    "Tip",
    (event) => {
      toast("Transction confirmed. NFT has been tipped!", {
        type: "success",
      });
    },
    true,
  );

  const handleTip = async () => {
    try {
      setIsLoading(true);
      const result = await contractInstance.tip(artworkId, {
        value: utils.parseUnits(String(tipAmount), "ether"),
      });
      console.log("handleTip", "result", result);
      toast("Transaction sent. Waiting for confirmation...");
      onClose();
    } catch (e) {
      console.log("handleTip", "error", e);
      toast("Transaction failed to sent. Please retry", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      size={"small"}
      title={"Tip artwork"}
      open={open}
      onClose={onClose}
      onConfirm={handleTip}
      confirmText="Tip"
      loading={isLoading}
    >
      <>
        <Typography level={"h6"}>
          Please choose the tip amount: {tipAmount} Ethers
        </Typography>
        <Slider
          size={"lg"}
          valueLabelDisplay={"auto"}
          min={MIN_TIP_ETHER_AMOUNT}
          max={Number(balanceData?.formatted) || 100}
          step={MIN_TIP_ETHER_AMOUNT}
          value={tipAmount}
          onChange={(e, value) => setTipAmount(value as number)}
        ></Slider>
      </>
    </Dialog>
  );
};

export { TipDialog };
