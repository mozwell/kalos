import React from "react";
import {
  toast as _toast,
  ToastOptions,
  ToastContainer as _ToastContainer,
} from "react-toastify";
import { Button } from "@mui/joy";
import styled from "@emotion/styled";

const DEFAULT_TOAST_BASE_CONFIG = {
  position: _toast.POSITION.TOP_CENTER,
  autoClose: 15000,
  draggablePercent: 60,
  closeOnClick: false,
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
  margin: 0 10px;
`;

const StyledButton = styled(Button)`
  margin-right: 5px;
`;

const toast = (
  content: string,
  userConfig?: ToastOptions & { actionText?: string; onAction?: () => void },
) => {
  const { actionText, onAction, ...cleanConfig } = userConfig || {};
  let processedContent;
  if (actionText) {
    processedContent = (
      <ToastWrapper>
        {content}
        <StyledButton size={"sm"} variant={"outlined"} onClick={onAction}>
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
    ...cleanConfig,
  });
};

const ToastContainer = styled(_ToastContainer)`
  width: fit-content;
  min-width: 500px;
  max-width: 800px;
  border-radius: 10px;
`;

export { toast, ToastContainer };
