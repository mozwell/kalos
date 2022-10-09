import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { Button, Typography } from "@mui/joy";
import { DeleteForever, Paid, ArrowUpward, People } from "@mui/icons-material";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";

import { ConnectButton } from "../../components/ConnectButton";
import { Modal } from "../../components/Modal";
import { Dialog } from "../../components/Dialog";
import { Frame } from "../../components/Frame";
import { toast } from "../../utils";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const mockContent =
  "background-image: radial-gradient(closest-side, transparent 0%, transparent 75%, rgb(182, 204, 102) 76%, rgb(182, 204, 102) 85%, rgb(237, 255, 219) 86%, rgb(237, 255, 219) 94%, rgb(255, 255, 255) 95%, rgb(255, 255, 255) 103%, rgb(217, 230, 167) 104%, rgb(217, 230, 167) 112%, rgb(121, 139, 60) 113%, rgb(121, 139, 60) 121%, rgb(255, 255, 255) 122%, rgb(255, 255, 255) 130%, rgb(224, 234, 215) 131%, rgb(224, 234, 215) 140%), radial-gradient(closest-side, transparent 0%, transparent 75%, rgb(182, 204, 102) 76%, rgb(182, 204, 102) 85%, rgb(237, 255, 219) 86%, rgb(237, 255, 219) 94%, rgb(255, 255, 255) 95%, rgb(255, 255, 255) 103%, rgb(217, 230, 167) 104%, rgb(217, 230, 167) 112%, rgb(121, 139, 60) 113%, rgb(121, 139, 60) 121%, rgb(255, 255, 255) 122%, rgb(255, 255, 255) 130%, rgb(224, 234, 215) 131%, rgb(224, 234, 215) 140%); background-size: 110px 110px; background-color: rgb(200, 211, 167); background-position: 0px 0px, 55px 55px; --darkreader-inline-bgimage:radial-gradient(closest-side, rgba(13, 13, 13, 0) 0%, rgba(13, 13, 13, 0) 75%, #5d652d 76%, #5d652d 85%, #374e0f 86%, #374e0f 94%, #232425 95%, #232425 103%, #464b20 104%, #464b20 112%, #66713a 113%, #66713a 121%, #232425 122%, #232425 130%, #384028 131%, #384028 140%), radial-gradient(closest-side, rgba(13, 13, 13, 0) 0%, rgba(13, 13, 13, 0) 75%, #5d652d 76%, #5d652d 85%, #374e0f 86%, #374e0f 94%, #232425 95%, #232425 103%, #464b20 104%, #464b20 112%, #66713a 113%, #66713a 121%, #232425 122%, #232425 130%, #384028 131%, #384028 140%); --darkreader-inline-bgcolor:#43482b;";

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

const Detail = () => {
  const navigate = useNavigate();
  const { artworkId } = useParams();
  const [isTipShown, setIsTipShown] = useState(false);
  const { address, connector, isConnected } = useAccount();

  const closeDetail = () => navigate(-1);
  const handleTipShown = () => {
    setIsTipShown(true);
  };
  const handleTip = () => {
    // toast.success("Success Notification !");
    toast(
      "After installation, you can start building with this component using the following basic elements. You can start building with this component using the following basic elements",
      {
        actionText: "hello",
      },
    );
  };

  return (
    <Modal open handleClose={closeDetail}>
      <>
        <Dialog
          size={"medium"}
          title={"Tip"}
          open={isTipShown}
          handleClose={() => setIsTipShown(false)}
          onConfirm={handleTip}
          confirmText="Tip"
        >
          <div>{"This is a tip test, hello everyone!"}</div>
        </Dialog>

        <Wrapper>
          <LeftContainer>
            <Frame content={mockContent}></Frame>
          </LeftContainer>
          <RightContainer>
            <Title level={"h2"}>The space between us is so long</Title>
            <Typography
              level={"h5"}
              textColor="neutral.500"
            >{`Christian Krohg was born at Vestre Aker (now Oslo), Norway. He was
            one of five children born to Georg Anton Krohg (1817–1873) and
            Sophie Amalia Holst (1822–1861). He was a grandson of Christian
            Krohg (1777–1828) who had served as a government minister. His
            father was a civil servant, journalist and author.`}</Typography>
            <Typography sx={{ marginTop: "20px" }} level={"h5"}>
              Author: David Lee Amstrong Mendy
            </Typography>
            <Typography sx={{ marginTop: "20px" }} level={"h5"}>
              Owner: Hugo Lee Amstrong Mendy
            </Typography>
            <Typography sx={{ marginTop: "20px" }} level={"h5"}>
              Created Time: {new Date().toLocaleString()}
            </Typography>
            <Typography sx={{ marginTop: "20px" }} level={"h5"}>
              Tip Balance: 131435 Ether
            </Typography>
          </RightContainer>
          <ButtonContainer>
            {isConnected ? (
              <>
                <StyledButton
                  startDecorator={<Paid />}
                  variant="solid"
                  size="lg"
                  onClick={handleTipShown}
                >
                  Tip
                </StyledButton>
                <StyledButton
                  startDecorator={<ArrowUpward />}
                  variant="solid"
                  size="lg"
                  onClick={handleTipShown}
                >
                  Withdraw
                </StyledButton>
                <StyledButton
                  startDecorator={<People />}
                  variant="solid"
                  size="lg"
                  onClick={handleTipShown}
                >
                  Transfer
                </StyledButton>
                <StyledButton
                  startDecorator={<DeleteForever />}
                  variant="solid"
                  size="lg"
                  color="danger"
                  onClick={handleTipShown}
                >
                  Destroy
                </StyledButton>
              </>
            ) : (
              <ConnectButton />
            )}
          </ButtonContainer>
        </Wrapper>
      </>
    </Modal>
  );
};

export { Detail };
