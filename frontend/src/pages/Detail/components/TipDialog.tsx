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

const TIP_ETHER_DECIMAL_DIGIT = 4;
const MIN_TIP_ETHER_AMOUNT = 1 / Math.pow(10, TIP_ETHER_DECIMAL_DIGIT);

const TipDialog = (props: TipDialogProps) => {
  const { artworkId, open, onClose, onTipConfirmed } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [tipAmount, setTipAmount] = useState(MIN_TIP_ETHER_AMOUNT);
  const { address } = useAccount();
  const { data: balanceData } = useBalance({
    addressOrName: address,
  });

  const contractInstance = useKalos();

  // A workaround to keep the dialog instance exist rather than unmount it so as to help useTrackTx work as expected.
  // TODO: To elevate useTrackTx to the top context so it could be called everywhere.
  const handleCloseWithReset = useCallback(() => {
    setTipAmount(MIN_TIP_ETHER_AMOUNT);
    onClose();
  }, [setTipAmount, onClose]);

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
      handleCloseWithReset();
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
    handleCloseWithReset,
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
    return (
      toFloorDecimal(currentBalance, TIP_ETHER_DECIMAL_DIGIT) || defaultValue
    );
  }, [balanceData]);

  return (
    <Dialog
      size={"small"}
      title={"Tip artwork"}
      open={open}
      onClose={handleCloseWithReset}
      onConfirm={handleTip}
      confirmText="Tip"
      loading={isLoading}
    >
      <>
        <Typography level={"h6"}>
          Please choose the tip amount:{" "}
          {tipAmount.toFixed(TIP_ETHER_DECIMAL_DIGIT)} Ethers
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
