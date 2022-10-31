import styled from "@emotion/styled";
import { Button, Typography } from "@mui/joy";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const LeftContainer = styled.div`
  width: 50%;
  box-sizing: border-box;
  padding-top: 30px;
`;
const RightContainer = styled.div`
  width: 50%;
  box-sizing: border-box;
  padding: 30px;
`;
const ButtonContainer = styled.div`
  width: 100%;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  padding-top: 10px;
`;

const StyledButton = styled(Button)`
  margin: 0 10px;
`;

const Title = styled(Typography)`
  margin-bottom: 20px;
`;

export {
  Wrapper,
  LeftContainer,
  RightContainer,
  ButtonContainer,
  StyledButton,
  Title,
};
