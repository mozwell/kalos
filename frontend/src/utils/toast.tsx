import React from "react";
import {
  toast as _toast,
  ToastOptions,
  ToastContainer as _ToastContainer,
} from "react-toastify";
import { Button } from "@mui/joy";
import styled from "@emotion/styled";
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
        <StyledButton
          size={"sm"}
          variant={"outlined"}
          onClick={onActionAndClose}
        >
          {actionText}
        </StyledButton>
      </ToastWrapper>
    );
  }
  const defaultConfig = actionText
    ? DEFAULT_TOAST_WITH_ACTION_CONFIG
    : DEFAULT_TOAST_CONFIG;
  _toast.dark(processedContent || content, {
    ...(defaultConfig as any),
    defaultToastId,
    ...cleanUserConfig,
  });
};

const ToastContainer = styled(_ToastContainer)`
  width: fit-content;
  min-width: 500px;
  max-width: 800px;
  border-radius: 10px;
`;

const TX_SENT_COPY = "Transction sent. Waiting for confirmation...";
const TX_SENT_ACTION_COPY = "Check Transaction";

const toastOnTxSent = (txHash: string) => {
  toast(TX_SENT_COPY, {
    actionText: TX_SENT_ACTION_COPY,
    onAction: () => seeTxInfoOnGoerli(txHash),
  });
};

export { toast, ToastContainer, toastOnTxSent };
