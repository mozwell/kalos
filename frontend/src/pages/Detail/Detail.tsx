import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { Button, Typography } from "@mui/joy";
import { DeleteForever, Paid, ArrowUpward, People } from "@mui/icons-material";
import { useAccount, useBalance } from "wagmi";
import { BigNumber, utils } from "ethers";

import { ConnectButton } from "../../components/ConnectButton";
import { Modal } from "../../components/Modal";
import { Dialog } from "../../components/Dialog";
import { Frame } from "../../components/Frame";
import { toast, isTwoAddressEqual } from "../../utils";
import { CardData } from "../../components/Card";
import { useKalos, useKalosEvent } from "../../hooks";
import { DestroyDialog } from "./components/DestroyDialog";
import { TipDialog } from "./components/TipDialog";
import { WithdrawDialog } from "./components/WithdrawDialog";
import { TransferDialog } from "./components/TransferDialog";

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

const Detail = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: CardData };
  const { artworkId } = useParams();
  const {
    address: currentAccountAddress = "",
    connector,
    isConnected,
  } = useAccount();
  const contractInstance = useKalos();

  const {
    title,
    desc,
    createdTime,
    author,
    content,
    owner: defaultOwner,
  } = state;

  const [isDestroyOpen, setIsDestroyOpen] = useState(false);
  const [isTipOpen, setIsTipOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const [owner, setOwner] = useState(defaultOwner);
  const [tipBalance, setTipBalance] = useState("0.0");
  const { data: balanceData } = useBalance({
    addressOrName: currentAccountAddress,
  });

  const destroyEnabled = isTwoAddressEqual(currentAccountAddress, owner);
  const tipEnabled = Number(balanceData?.formatted) !== 0;
  const withdrawEnabled = isTwoAddressEqual(currentAccountAddress, owner);
  const transferEnabled = isTwoAddressEqual(currentAccountAddress, owner);

  useEffect(() => {
    contractInstance.tipBalances(artworkId).then((data: BigNumber) => {
      console.log("tipBalances", "data", data);
      const etherResult = utils.formatEther(data);
      setTipBalance(etherResult);
    });
    contractInstance.ownerOf(artworkId).then((data: string) => {
      console.log("owner", "data", data);
      setOwner(data);
    });
  }, [contractInstance]);

  const closeDetail = () => navigate(-1);

  return (
    <Modal open handleClose={closeDetail}>
      <>
        <DestroyDialog
          artworkId={artworkId!}
          open={isDestroyOpen}
          onClose={() => setIsDestroyOpen(false)}
        />
        <TipDialog
          artworkId={artworkId!}
          open={isTipOpen}
          onClose={() => setIsTipOpen(false)}
        />
        <WithdrawDialog
          artworkId={artworkId!}
          open={isWithdrawOpen}
          onClose={() => setIsWithdrawOpen(false)}
          tipBalance={tipBalance}
        />
        <TransferDialog
          artworkId={artworkId!}
          open={isTransferOpen}
          onClose={() => setIsTransferOpen(false)}
        />

        <Wrapper>
          <LeftContainer>
            <Frame content={content}></Frame>
          </LeftContainer>
          <RightContainer>
            <Title level={"h2"}>{title}</Title>
            <Typography
              sx={{ height: "210px" }}
              level={"h5"}
              textColor="neutral.500"
            >
              {desc}
            </Typography>
            <Typography sx={{ marginTop: "20px" }} level={"h6"}>
              Author:
            </Typography>
            <Typography level={"h6"}>{author}</Typography>
            <Typography sx={{ marginTop: "20px" }} level={"h6"}>
              Owner:
            </Typography>
            <Typography level={"h6"}>{owner}</Typography>
            <Typography sx={{ marginTop: "20px" }} level={"h6"}>
              Created Time: {new Date(createdTime).toLocaleString()}
            </Typography>
            <Typography sx={{ marginTop: "20px" }} level={"h6"}>
              Tip Balance: {tipBalance} Ethers
            </Typography>
          </RightContainer>
          <ButtonContainer>
            {isConnected ? (
              <>
                {tipEnabled && (
                  <StyledButton
                    startDecorator={<Paid />}
                    variant="solid"
                    size="lg"
                    onClick={() => setIsTipOpen(true)}
                  >
                    Tip
                  </StyledButton>
                )}
                {withdrawEnabled && (
                  <StyledButton
                    startDecorator={<ArrowUpward />}
                    variant="solid"
                    size="lg"
                    onClick={() => setIsWithdrawOpen(true)}
                  >
                    Withdraw
                  </StyledButton>
                )}
                {transferEnabled && (
                  <StyledButton
                    startDecorator={<People />}
                    variant="solid"
                    size="lg"
                    onClick={() => setIsTransferOpen(true)}
                  >
                    Transfer
                  </StyledButton>
                )}
                {destroyEnabled && (
                  <StyledButton
                    startDecorator={<DeleteForever />}
                    variant="solid"
                    size="lg"
                    color="danger"
                    onClick={() => setIsDestroyOpen(true)}
                  >
                    Destroy
                  </StyledButton>
                )}
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
