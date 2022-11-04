import React, { forwardRef, ForwardedRef } from "react";
import { Modal as _Modal } from "@mui/joy";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const ModalSize = {
  xlarge: {
    width: "1100px",
    height: "880px",
  },
  large: {
    width: "1000px",
    height: "680px",
  },
  medium: {
    width: "600px",
    height: "280px",
  },
  small: {
    width: "500px",
    height: "210px",
  },
};

const dialogAppears = keyframes`
  from {
    transform: translateY(50%);
    opacity: 0.5;
  }
  to {
    transform: translateY(0%);
    opacity: 1;
  }
`;

const StyledSheet = styled(Sheet)<{
  size?: "small" | "medium" | "large" | "xlarge";
  autoHeight?: boolean;
}>`
  width: ${({ size }) => ModalSize[size || "large"].width};
  height: ${({ size, autoHeight }) =>
    autoHeight ? "unset" : ModalSize[size || "large"].height};
  min-height: ${({ autoHeight }) => (autoHeight ? "fit-content" : "unset")};
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(32px);
  animation: ${dialogAppears} 100ms forwards 1 ease-in;
`;

type ModalProps = {
  size?: "small" | "medium" | "large" | "xlarge";
  autoHeight?: boolean;
  children: React.ReactElement;
  open: boolean;
  handleClose: () => void;
};

const Modal = forwardRef(
  (props: ModalProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { children, size, open, handleClose, autoHeight } = props;
    return (
      <_Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={handleClose}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <StyledSheet
          ref={ref}
          size={size}
          autoHeight={autoHeight}
          variant="outlined"
          sx={{
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            // To remove the blue outline when modal appears
            outline: "none",
          }}
        >
          <ModalClose
            variant="outlined"
            sx={{
              top: "calc(-1/4 * var(--IconButton-size))",
              right: "calc(-1/4 * var(--IconButton-size))",
              boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
              borderRadius: "50%",
              bgcolor: "background.body",
            }}
          />
          {children}
        </StyledSheet>
      </_Modal>
    );
  },
);

Modal.displayName = "Modal";

export { Modal };
