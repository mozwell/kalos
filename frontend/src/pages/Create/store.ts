import React from "react";
import { observable, action, makeObservable, when } from "mobx";
import { NavigateFunction } from "react-router-dom";
import { ethers } from "ethers";

import { BaseStore } from "../../store";
import {
  loadTemplates,
  fillInTemplate,
  pickRandomInt,
  pickRandomPercent,
  pickRandomPx,
  pickRandomAngle,
  pickRandomColor,
  uploadNFT,
  parseRawArtworkContent,
  batchRemoveArgVar,
  setArgVar,
  toastOnEthersError,
  toast,
  shake,
} from "../../utils";
import { ArtworkTemplateType } from "../../config/artworkTemplates";
import { CardData } from "../../components";
import { Kalos } from "../../../../typechain-types";

type CreateStoreProps = {
  myAddress: string;
  contractInstance: Kalos;
  setTrackTxHash: React.Dispatch<React.SetStateAction<`0x${string}`>>;
  addArtwork: (artworkId: string, data: CardData) => void;
  navigate: NavigateFunction;
  frameRef: React.RefObject<HTMLDivElement>;
  dialogRef: React.RefObject<HTMLDivElement>;
  debugModeEnabled: boolean;
};

class CreateStore extends BaseStore<CreateStoreProps> {
  constructor(props: CreateStoreProps) {
    super(props);
    // To make sure React could re-render once attributes on store instance change
    makeObservable(this);
    // Load template set
    this.loadTemplate();
    // We only init artwork after frameEl is ready, since we need to set CSS vars on it
    when(() => Boolean(this.props.frameRef.current), this.init);
  }

  @action
  private init = () => {
    // Init artwork frame using first template
    this.initArtwork(0, this.templates[0].defaultArgs);
  };

  @observable currentTemplateIndex = 0;

  @observable templates: ArtworkTemplateType[] = [];

  @observable currentArgSet: ArtworkTemplateType["defaultArgs"] = {
    color: [],
    percent: [],
    px: [],
    angle: [],
  };

  @observable title = "";

  @observable titleError = "";

  @observable desc = "";

  @observable descError = "";

  @observable artworkContent = "";

  @observable debugContent = "";

  @observable private createdTime = 0;

  @observable saving = false;

  @action
  handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.titleError = "";
    this.title = e.currentTarget.value;
  };

  @action
  private checkTitle = () => {
    if (this.title === "") {
      this.titleError = "Title cannot be empty";
      return false;
    }
    this.titleError = "";
    return true;
  };

  @action
  handleDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.descError = "";
    this.desc = e.currentTarget.value;
  };

  @action
  handleDebugContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.debugContent = e.currentTarget.value;
  };

  @action
  private checkDesc = () => {
    if (this.desc === "") {
      this.descError = "Description cannot be empty";
      return false;
    }
    this.descError = "";
    return true;
  };

  private validate = () => {
    const isTitleValid = this.checkTitle();
    const isDescValid = this.checkDesc();
    return isTitleValid && isDescValid;
  };

  @action
  private loadTemplate = () => {
    this.templates = loadTemplates();
  };

  @action
  private setCurrentArgSet = (value: ArtworkTemplateType["defaultArgs"]) => {
    this.currentArgSet = value;
  };

  @action
  setCurrentArg = (
    argType: keyof ArtworkTemplateType["defaultArgs"],
    argNo: number,
    value: string | number,
  ) => {
    this.currentArgSet[argType][argNo] = value;
    setArgVar(
      argType,
      argNo,
      String(value),
      this.props.frameRef.current ?? undefined,
    );
  };

  @action
  private setArtworkContent = (value: string) => {
    this.artworkContent = value;
  };

  @action
  private setCurrentTemplateIndex = (value: number) => {
    this.currentTemplateIndex = value;
  };

  @action
  private stampCreatedTime = () => {
    this.createdTime = Date.now();
    return this.createdTime;
  };

  @action
  private initArtwork = (
    templateIndex: number,
    argSet: ArtworkTemplateType["defaultArgs"],
  ) => {
    // remove css variables used by last template if exists
    this.removeCurrentArgVars();
    this.setCurrentArgSet(argSet);
    const newContent = fillInTemplate(
      this.templates[templateIndex].content,
      argSet,
      this.props.frameRef.current ?? undefined,
    );
    this.setArtworkContent(newContent);
  };

  @action
  handleTemplateSelectChange = (index: number) => {
    // When template select changes, render all inputs according to its arg type and number & set default value of every input as provided
    this.setCurrentTemplateIndex(index);
    this.initArtwork(index, this.templates[index].defaultArgs);
  };

  @action
  handleRandomize = () => {
    // When click on Randomize, change template select first, and then change all its input values
    const randomTemplateIndex = pickRandomInt(0, this.templates.length - 1);
    this.setCurrentTemplateIndex(randomTemplateIndex);
    const randomTemplateArgSet =
      this.templates[randomTemplateIndex].defaultArgs;
    const newArgSet = {
      color: randomTemplateArgSet.color.map(pickRandomColor),
      percent: randomTemplateArgSet.percent.map(pickRandomPercent),
      px: randomTemplateArgSet.px.map(pickRandomPx),
      angle: randomTemplateArgSet.angle.map(pickRandomAngle),
    };
    this.initArtwork(randomTemplateIndex, newArgSet);
  };

  private getParsedContent = () => {
    return parseRawArtworkContent(this.artworkContent, this.currentArgSet);
  };

  // To remove current css variables set on body element
  private removeCurrentArgVars = () => {
    batchRemoveArgVar(
      this.currentArgSet,
      this.props.frameRef.current ?? undefined,
    );
  };

  @action
  handleSaveMint = async () => {
    if (!this.validate()) {
      shake(this.props.dialogRef);
      return;
    }
    try {
      this.saving = true;
      const uploadOptions = {
        name: this.title,
        description: this.desc,
        properties: {
          content: this.props.debugModeEnabled
            ? this.debugContent
            : this.getParsedContent(),
          createdTime: this.stampCreatedTime(),
          author: this.props.myAddress || "unknown",
        },
      };
      console.log("handleSaveMint", "uploadOptions", uploadOptions);
      const { artworkUri } = await uploadNFT(uploadOptions);
      const mintTxInfo = await this.props.contractInstance.mint(
        artworkUri,
        this.props.myAddress,
      );
      console.log("mintTxInfo", mintTxInfo);
      this.props.setTrackTxHash(mintTxInfo.hash);
    } catch (error) {
      console.log("handleSaveMint", "error", error);
      toastOnEthersError(error as Error);
      this.saving = false;
    }
  };

  @action
  handleTxSuccess = (data: ethers.providers.TransactionReceipt) => {
    console.log("create", "handleTxSuccess", "data", data);
    const hexArtworkId = data.logs[0].topics[3];
    const artworkId = parseInt(hexArtworkId, 16).toString();
    // We need to store a snapshot to provide user with what they have created since IPFS gateway is unstable.
    this.props.addArtwork(artworkId, {
      artworkId,
      title: this.title,
      desc: this.desc,
      createdTime: this.createdTime,
      author: this.props.myAddress || "unknown",
      content: this.props.debugModeEnabled
        ? this.debugContent
        : this.getParsedContent(),
      owner: this.props.myAddress || "unknown",
      tipBalance: 0,
    });
    toast("Transaction confirmed. Artwork has been created!", {
      type: "success",
      actionText: "Preview",
      onAction: () => this.props.navigate(`/detail/${artworkId}`),
    });
    this.saving = false;
    this.closeCreate();
  };

  closeCreate = () => {
    this.props.navigate("/");
  };
}

export { CreateStore };
