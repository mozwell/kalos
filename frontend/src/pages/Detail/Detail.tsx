import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography } from "@mui/joy";
import { DeleteForever, Paid, ArrowUpward, People } from "@mui/icons-material";
import { utils } from "ethers";
import { observer } from "mobx-react-lite";

import { ConnectButton, Modal, Frame } from "../../components";
import { isTwoAddressEqual, formatAddress } from "../../utils";
import {
  DestroyDialog,
  TipDialog,
  WithdrawDialog,
  TransferDialog,
} from "./components";
import { useGlobalStore, useKalosWatch } from "../../hooks";
import {
  Wrapper,
  LeftContainer,
  RightContainer,
  ButtonContainer,
  StyledButton,
  Title,
} from "./styled";

const Detail = observer(() => {
  const navigate = useNavigate();
  const { artworkId = "0" } = useParams();
  const {
    artworkStruct,
    myAddress,
    myBalance,
    isConnected,
    setTipBalance,
    setOwner,
    fetchArtwork,
  } = useGlobalStore();

  const currentArtwork = artworkStruct[artworkId] || {};
  const {
    title,
    desc,
    createdTime,
    author,
    content,
    owner = "",
    tipBalance = 0,
  } = currentArtwork;
  console.log("tipBalance", tipBalance);

  const [isDestroyOpen, setIsDestroyOpen] = useState(false);
  const [isTipOpen, setIsTipOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const isMyArtwork = isTwoAddressEqual(myAddress, owner);
  const hasBalance = myBalance !== 0;

  const destroyEnabled = isMyArtwork;
  const tipEnabled = hasBalance;
  const withdrawEnabled = isMyArtwork && Number(tipBalance) > 0;
  const transferEnabled = isMyArtwork;

  const closeDetail = useCallback(() => navigate("/"), [navigate]);

  useKalosWatch({
    name: "tipBalances",
    setter: (tipBalanceData) => {
      const etherResult = utils.formatEther(tipBalanceData as number);
      setTipBalance(artworkId, Number(etherResult));
    },
    args: [artworkId],
  });

  useKalosWatch({
    name: "ownerOf",
    setter: (currentOwnerData) => {
      setOwner(artworkId, currentOwnerData as string);
    },
    args: [artworkId],
  });

  // Should update artwork info when user opens detail page
  useEffect(() => {
    fetchArtwork(Number(artworkId));
  }, []);

  return (
    <Modal open handleClose={closeDetail}>
      <>
        {isDestroyOpen && (
          <DestroyDialog
            artworkId={artworkId}
            open
            onClose={() => setIsDestroyOpen(false)}
          />
        )}
        {isTipOpen && (
          <TipDialog
            artworkId={artworkId}
            open
            onClose={() => setIsTipOpen(false)}
          />
        )}
        {isWithdrawOpen && (
          <WithdrawDialog
            artworkId={artworkId}
            open
            onClose={() => setIsWithdrawOpen(false)}
            tipBalance={tipBalance}
          />
        )}
        {isTransferOpen && (
          <TransferDialog
            artworkId={artworkId}
            open
            onClose={() => setIsTransferOpen(false)}
          />
        )}

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
