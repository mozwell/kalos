import React, { useState, useCallback, useMemo } from "react";
import { Typography, Slider } from "@mui/joy";
import { utils } from "ethers";
import { useBalance, useAccount } from "wagmi";

import { Dialog } from "../../../components";
import { useKalos, useTrackTx } from "../../../hooks";
import { toastOnEthersError, toFloorDecimal } from "../../../utils";

type TipDialogProps = {
  artworkId: string;
  open: boolean;
  onClose: () => void;
  onTipConfirmed?: () => void;
};

const MIN_TIP_ETHER_AMOUNT = 0.0001;

const TipDialog = (props: TipDialogProps) => {
  const { artworkId, open, onClose, onTipConfirmed } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [tipAmount, setTipAmount] = useState(MIN_TIP_ETHER_AMOUNT);
  const { address } = useAccount();
  const { data: balanceData } = useBalance({
    addressOrName: address,
  });

  const contractInstance = useKalos();

  const { setTrackTxHash } = useTrackTx({
    confirmedToastConfig: {
      text: "Transaction confirmed. Artwork has been tipped!",
    },
    onSuccess: () => onTipConfirmed?.(),
  });

  const handleTip = useCallback(async () => {
    try {
      setIsLoading(true);
      const tipTxInfo = await contractInstance.tip(artworkId, {
        value: utils.parseUnits(String(tipAmount), "ether"),
      });
      console.log("tipTxInfo", tipTxInfo);
      setTrackTxHash(tipTxInfo.hash);
      onClose();
    } catch (error) {
      console.log("handleTip", "error", error);
      toastOnEthersError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [
    setIsLoading,
    contractInstance,
    artworkId,
    tipAmount,
    setTrackTxHash,
    onClose,
  ]);

  const handleSliderChange = useCallback(
    // Here we will never get number[];
    (e: Event, value: number | number[]) => setTipAmount(value as number),
    [setTipAmount],
  );

  const maxTipAmount = useMemo(() => {
    const defaultValue = 100;
    const currentBalance = Number(balanceData?.formatted);
    // To avoid arbitrary digits for tip amount
    return toFloorDecimal(currentBalance, 4) || defaultValue;
  }, [balanceData]);

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
          max={maxTipAmount}
          step={MIN_TIP_ETHER_AMOUNT}
          value={tipAmount}
          onChange={handleSliderChange}
        ></Slider>
      </>
    </Dialog>
  );
};

export { TipDialog };
