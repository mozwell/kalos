import React from "react";
import {
  toast as _toast,
  ToastOptions,
  ToastContainer as _ToastContainer,
} from "react-toastify";
import { Button } from "@mui/joy";
import styled from "@emotion/styled";

const DEFAULT_TOAST_CONFIG = {
  position: _toast.POSITION.TOP_CENTER,
  autoClose: 15000,
  draggablePercent: 60,
  closeOnClick: false,
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
  _toast.dark(processedContent || content, {
    ...DEFAULT_TOAST_CONFIG,
    ...cleanConfig,
  });
};

const ToastContainer = styled(_ToastContainer)`
  width: fit-content;
  min-width: 500px;
  max-width: 800px;
`;

export { toast, ToastContainer };
