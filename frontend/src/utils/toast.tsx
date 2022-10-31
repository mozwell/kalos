import React from "react";
import {
  toast as _toast,
  ToastOptions,
  ToastContainer as _ToastContainer,
} from "react-toastify";
import { Button } from "@mui/joy";
import styled from "@emotion/styled";
import { getParsedEthersError } from "@enzoferey/ethers-error-parser";

import { seeTxInfoOnGoerli } from "./ethereum";

const DEFAULT_TOAST_BASE_CONFIG = {
  position: _toast.POSITION.TOP_CENTER,
  autoClose: 15000,
  draggablePercent: 60,
  closeOnClick: false,
  hideProgressBar: true,
};

const DEFAULT_TOAST_CONFIG = {
  ...DEFAULT_TOAST_BASE_CONFIG,
  autoClose: 15000,
};

const DEFAULT_TOAST_WITH_ACTION_CONFIG = {
  ...DEFAULT_TOAST_BASE_CONFIG,
  autoClose: false,
};

const ToastWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
`;

const StyledButton = styled(Button)`
  margin-right: 5px;
  margin-left: 10px;
`;

const _genToastId = () => {
  return `kalos-toast-${Date.now()}`;
};

const toast = (
  content: string,
  userConfig?: ToastOptions & { actionText?: string; onAction?: () => void },
) => {
  const { actionText, onAction, ...cleanUserConfig } = userConfig || {};
  const defaultToastId = _genToastId();
  let processedContent;
  const onActionAndClose = () => {
    onAction?.();
    _toast.dismiss(defaultToastId);
  };
  if (actionText) {
    processedContent = (
      <ToastWrapper>
        {content}
        <StyledButton size={"sm"} variant={"solid"} onClick={onActionAndClose}>
          {actionText}
        </StyledButton>
      </ToastWrapper>
    );
  }
  const defaultConfig = actionText
    ? DEFAULT_TOAST_WITH_ACTION_CONFIG
    : DEFAULT_TOAST_CONFIG;
  return _toast.dark(processedContent || content, {
    ...(defaultConfig as any),
    toastId: defaultToastId,
    ...cleanUserConfig,
  });
};

const ToastContainer = styled(_ToastContainer)`
  width: fit-content;
  min-width: 500px;
  max-width: 800px;
  .Toastify__toast {
    border-radius: 12px;
    background-color: rgba(30, 30, 30, 0.7);
  }
`;

const TX_SENT_COPY = "Transaction sent. Waiting for confirmation...";
const TX_SENT_ACTION_COPY = "Check Transaction";

const TX_CONFIRMED_COPY = "Transaction confirmed. Congrats!";
const TX_CONFIRMED_ACTION_COPY = "Review Transaction";

const TX_FAILED_COPY = "Transaction failed. Please retry.";
const TX_FAILED_ACTION_COPY = "Review Transaction";

const toastOnTxSent = (txHash: string) => {
  const toastId = toast(TX_SENT_COPY, {
    actionText: TX_SENT_ACTION_COPY,
    onAction: () => seeTxInfoOnGoerli(txHash),
    type: _toast.TYPE.INFO,
  });

  return toastId;
};

export type OverrideToastConfig = ToastOptions & { text?: string };

const toastOnTxConfirmed = (
  txHash: string,
  overrideConfig?: OverrideToastConfig,
) => {
  const { text, ...restOverrideConfig } = overrideConfig || {};
  const toastId = toast(text || TX_CONFIRMED_COPY, {
    type: _toast.TYPE.SUCCESS,
    actionText: TX_CONFIRMED_ACTION_COPY,
    onAction: () => seeTxInfoOnGoerli(txHash),
    autoClose: 15000,
    ...restOverrideConfig,
  });
  return toastId;
};

const toastOnTxFailed = (
  txHash: string,
  overrideConfig?: OverrideToastConfig,
) => {
  const { text, ...restOverrideConfig } = overrideConfig || {};
  const toastId = toast(text || TX_FAILED_COPY, {
    type: _toast.TYPE.ERROR,
    actionText: TX_FAILED_ACTION_COPY,
    onAction: () => seeTxInfoOnGoerli(txHash),
    ...restOverrideConfig,
  });
  return toastId;
};

const dismissToast = (toastId: string | number) => {
  _toast.dismiss(toastId);
};

const toastOnEthersError = (error: Error) => {
  const { errorCode, context: errorContext } = getParsedEthersError(error);
  toast(`An error occurs: ${errorCode} (${errorContext})`, { type: "error" });
};

export {
  toast,
  ToastContainer,
  toastOnTxSent,
  toastOnTxConfirmed,
  toastOnTxFailed,
  dismissToast,
  toastOnEthersError,
};
