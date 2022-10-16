import { useEffect, useState } from "react";
import { Interface } from "ethers/lib/utils";
import { ethers } from "ethers";
import {
  useContractRead,
  useContract,
  useSigner,
  useContractEvent,
  useWaitForTransaction,
  useTransaction,
} from "wagmi";

import contractInfo from "../config/contractInfo.json";
import {
  toastOnTxSent,
  toastOnTxConfirmed,
  toastOnTxFailed,
  dismissToast,
} from "../utils";
import { Id } from "react-toastify";

const BASIC_CONFIG = {
  addressOrName: contractInfo.address,
  contractInterface: new Interface(contractInfo.abi),
};

const DEFAULT_MINIMAL_CONFIRMATION = 1;

const useKalos = () => {
  const { data: signerData } = useSigner();
  const kalosInstance = useContract({
    ...BASIC_CONFIG,
    signerOrProvider: signerData,
  });
  return kalosInstance;
};

const useKalosEvent = (
  eventName: string,
  listener: ethers.providers.Listener,
  once?: boolean,
) => {
  useContractEvent({
    ...BASIC_CONFIG,
    eventName,
    listener,
    once,
  });
};

// To watch change in getter's return value and update automatically
type UseKalosWatchOptions = {
  name: string;
  setter: (val: any) => void;
  args?: any;
};

const useKalosWatch = ({ name, setter, args }: UseKalosWatchOptions) => {
  const result = useContractRead({
    ...BASIC_CONFIG,
    functionName: name,
    watch: true,
    args: args || [],
  });

  const { status, data } = result;

  useEffect(() => {
    if (
      (
        ["idle", "success"] as ReturnType<typeof useContractRead>["status"][]
      ).includes(status) &&
      data
    ) {
      console.log(`useKalosWatch for ${name}`, "status", status, "data", data);
      setter(data);
    }
  }, [status, data]);
};

type UseTrackTxOptions = {
  onSuccess?: (data: any) => void;
  onError?: (data: any) => void;
  confirmedToastConfig?: any;
  failedToastConfig?: any;
};

const useTrackTx = (opts?: UseTrackTxOptions) => {
  const [txHash, setTxHash] = useState<`0x${string}`>("" as `0x${string}`);
  const [toastId, setToastId] = useState<Id>("");
  const { onSuccess, onError, confirmedToastConfig, failedToastConfig } =
    opts || {};

  useEffect(() => {
    if (txHash) {
      const currentToastId = toastOnTxSent(txHash);
      setToastId(currentToastId);
    }
  }, [txHash]);

  useWaitForTransaction({
    confirmations: DEFAULT_MINIMAL_CONFIRMATION,
    hash: txHash,
    onSuccess: (data) => {
      console.log("useWaitForTransaction", "onSuccess", "data", data);
      dismissToast(toastId);
      toastOnTxConfirmed(txHash, confirmedToastConfig);
      onSuccess?.(data);
    },
    onError: (error) => {
      console.log("useWaitForTransaction", "onError", "error", error);
      dismissToast(toastId);
      toastOnTxFailed(txHash, failedToastConfig);
      onError?.(error);
    },
  });

  return { setTrackTxHash: setTxHash };
};

export { useKalos, useKalosEvent, useKalosWatch, useTrackTx };
