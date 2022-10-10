import React from "react";
import { Button, Typography, CircularProgress } from "@mui/joy";
import styled from "@emotion/styled";

import { Modal } from "../Modal";

type DialogProps = {
  size?: "small" | "medium" | "large";
  children: React.ReactElement;
  open: boolean;
  onClose: () => void;
  title: string;
  confirmText?: string;
  onConfirm?: () => void;
  confirmType?: React.ComponentProps<typeof Button>["color"];
  loading?: boolean;
  confirmDisabled?: boolean;
};

const Title = styled(Typography)`
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  position: absolute;
  width: calc(100% - 60px);
  bottom: 30px;
  display: flex;
  justify-content: flex-end;
`;

const StyledButton = styled(Button)`
  margin-left: 20px;
`;

const Dialog = (props: DialogProps) => {
  const {
    size,
    title,
    children,
    confirmText,
    onConfirm,
    open,
    onClose,
    confirmType,
    loading,
    confirmDisabled,
  } = props;

  return (
    <Modal size={size} open={open} handleClose={onClose}>
      <>
        <Title level="h3">{title}</Title>
        {children}
        <ButtonContainer>
          <StyledButton variant={"plain"} onClick={onClose} size={"lg"}>
            Cancel
          </StyledButton>
          {confirmText && (
            <StyledButton
              variant={"solid"}
              size={"lg"}
              onClick={onConfirm}
              color={confirmType}
              startDecorator={
                loading ? (
                  <CircularProgress
                    color={confirmType}
                    variant="plain"
                    thickness={2}
                  />
                ) : null
              }
              disabled={confirmDisabled || loading}
            >
              {confirmText}
            </StyledButton>
          )}
        </ButtonContainer>
      </>
    </Modal>
  );
};

export { Dialog };
