import React from "react";
import { Button, Typography } from "@mui/joy";
import styled from "@emotion/styled";

import { Modal } from "../Modal";

type DialogProps = {
  size?: "small" | "medium" | "large";
  children: React.ReactElement;
  open: boolean;
  handleClose: () => void;
  title: string;
  confirmText?: string;
  onConfirm?: () => void;
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
  const { size, title, children, confirmText, onConfirm, open, handleClose } =
    props;

  return (
    <Modal size={size} open={open} handleClose={handleClose}>
      <>
        <Title level="h3">{title}</Title>
        {children}
        <ButtonContainer>
          <StyledButton variant={"plain"} onClick={handleClose}>
            Cancel
          </StyledButton>
          {confirmText && (
            <StyledButton variant={"solid"} onClick={onConfirm}>
              {confirmText}
            </StyledButton>
          )}
        </ButtonContainer>
      </>
    </Modal>
  );
};

export { Dialog };
