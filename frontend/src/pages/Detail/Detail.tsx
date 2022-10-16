import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { Button, Typography } from "@mui/joy";
import { DeleteForever, Paid, ArrowUpward, People } from "@mui/icons-material";
import { BigNumber, utils } from "ethers";
import { observer } from "mobx-react-lite";

import { ConnectButton } from "../../components/ConnectButton";
import { Modal } from "../../components/Modal";
import { Frame } from "../../components/Frame";
import { toast, isTwoAddressEqual, formatAddress } from "../../utils";
import { useKalos } from "../../hooks";
import { DestroyDialog } from "./components/DestroyDialog";
import { TipDialog } from "./components/TipDialog";
import { WithdrawDialog } from "./components/WithdrawDialog";
import { TransferDialog } from "./components/TransferDialog";
import { useGlobalStore, useKalosWatch } from "../../hooks";

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

const Detail = observer(() => {
  const navigate = useNavigate();
  const { artworkId } = useParams();
  const {
    artworkStruct,
    myAddress,
    myBalance,
    isConnected,
    setTipBalance,
    setOwner,
    fetchArtwork,
  } = useGlobalStore();

  const currentArtwork = artworkStruct[artworkId!] || {};
  const {
    title,
    desc,
    createdTime,
    author,
    content,
    owner = "",
    tipBalance,
  } = currentArtwork;
  console.log("tipBalance", tipBalance);

  const [isDestroyOpen, setIsDestroyOpen] = useState(false);
  const [isTipOpen, setIsTipOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const isMyArtwork = isTwoAddressEqual(myAddress, owner);
  const hasBalance = Number(myBalance?.formatted) !== 0;

  const destroyEnabled = isMyArtwork;
  const tipEnabled = hasBalance;
  const withdrawEnabled = isMyArtwork && Number(tipBalance) > 0;
  const transferEnabled = isMyArtwork;

  const closeDetail = () => navigate("/");

  useKalosWatch({
    name: "tipBalances",
    setter: (tipBalanceData) => {
      const etherResult = utils.formatEther(tipBalanceData);
      setTipBalance(artworkId, etherResult);
    },
    args: [artworkId],
  });

  useKalosWatch({
    name: "ownerOf",
    setter: (currentOwnerData) => {
      setOwner(artworkId, currentOwnerData);
    },
    args: [artworkId],
  });

  // Should update artwork info when user opens detail page
  useEffect(() => {
    fetchArtwork(artworkId);
  }, []);

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
            <Typography level={"h6"}>{formatAddress(author)}</Typography>
            <Typography sx={{ marginTop: "20px" }} level={"h6"}>
              Owner:
            </Typography>
            <Typography level={"h6"}>{formatAddress(owner)}</Typography>
            <Typography sx={{ marginTop: "20px" }} level={"h6"}>
              Created Time: {new Date(createdTime).toLocaleString()}
            </Typography>
            <Typography sx={{ marginTop: "20px" }} level={"h6"}>
              Tip Balance: {tipBalance || "0.0"} Ethers
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
});

export { Detail };
