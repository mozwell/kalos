import React from "react";
import { Modal as _Modal } from "@mui/joy";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import { useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";

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

const StyledSheet = styled(Sheet)<{
  size?: "small" | "medium" | "large" | "xlarge";
}>`
  width: ${({ size }) => ModalSize[size || "large"].width};
  height: ${({ size }) => ModalSize[size || "large"].height};
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(32px);
`;

type ModalProps = {
  size?: "small" | "medium" | "large" | "xlarge";
  children: React.ReactElement;
  open: boolean;
  handleClose: () => void;
};

const Modal = (props: ModalProps) => {
  const { children, size, open, handleClose } = props;
  return (
    <_Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={handleClose}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <StyledSheet
        size={size}
        variant="outlined"
        sx={{
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
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
};

export { Modal };
