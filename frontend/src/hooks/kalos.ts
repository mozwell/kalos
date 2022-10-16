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
import { toastOnTxSent, toastOnTxConfirmed } from "../utils";

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

const useWaitKalosTx = (txHash: string) => {
  const txInfo = useWaitForTransaction({
    confirmations: DEFAULT_MINIMAL_CONFIRMATION,
    hash: txHash,
  });
  return txInfo;
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

// const useTrackTx = () => {
//   const [txHash, setTxHash] = useState<`0x${string}`>("" as `0x${string}`);
//   const [toastId, setToastId] = useState("");
//   const { data, isError, isLoading, isSuccess } = useTransaction({
//     hash: txHash,
//   });
//   useEffect(() => {
//     if (txHash) {
//       console.log(
//         "useTrackTx",
//         data,
//         isError,
//         isLoading,
//         "isSuccess",
//         isSuccess,
//       );
//       const toastId = toastOnTxSent(txHash);
//       if (isSuccess) {
//         toastOnTxConfirmed(toastId);
//       }
//     }
//   }, [txHash, isSuccess]);
//   return { setTrackTxHash: setTxHash };
// };

export { useKalos, useKalosEvent, useWaitKalosTx, useKalosWatch };
