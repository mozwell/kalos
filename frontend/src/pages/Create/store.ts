import { observable, action, makeObservable } from "mobx";

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
} from "../../utils";
import {
  ArtworkTemplateType,
  ArtworkArgType,
} from "../../config/artworkTemplates";

class CreateStore {
  constructor() {
    makeObservable(this);
    this.init();
  }

  @action
  private init = () => {
    // Load template set
    this.loadTemplate();
    // Init artwork frame using first template
    this.initArtwork(0, this.templates[0].defaultArgs);
  };

  @observable currentTemplateIndex = 0;

  @observable templates: ArtworkTemplateType[] = [];

  @observable defaultArgSet: ArtworkTemplateType["defaultArgs"] =
    {} as ArtworkTemplateType["defaultArgs"];

  @observable artworkContent = "";

  @observable createdTime = 0;

  @action
  loadTemplate = () => {
    this.templates = loadTemplates();
  };

  @action
  setDefaultArgSet = (value: ArtworkTemplateType["defaultArgs"]) => {
    this.defaultArgSet = value;
  };

  @action
  private setArtworkContent = (value: string) => {
    this.artworkContent = value;
  };

  @action
  setCurrentTemplateIndex = (value: number) => {
    this.currentTemplateIndex = value;
  };

  @action
  stampCreatedTime = () => {
    this.createdTime = Date.now();
    return this.createdTime;
  };

  @action
  private initArtwork = (
    templateIndex: number,
    argSet: ArtworkTemplateType["defaultArgs"],
  ) => {
    this.setDefaultArgSet(argSet);
    const newContent = fillInTemplate(
      this.templates[templateIndex].content,
      argSet,
    );
    this.setArtworkContent(newContent);
  };

  @action
  handleTemplateSelectChange = (index: number) => {
    // When template select changes, render all inputs according to its arg type and number & set default value of every input as provided
    this.setCurrentTemplateIndex(index);
    this.initArtwork(index, this.templates[index].defaultArgs);
  };

  // @action
  // handleArgSetChange = (newArgSet: ArtworkTemplateType["defaultArgs"]) => {
  //   // When input changes, generate new content string and pass it to artwork frame
  //   // this.renderArtwork(this.currentTemplateIndex, newArgSet);
  // };

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
      px: randomTemplateArgSet.color.map(pickRandomPx),
      angle: randomTemplateArgSet.color.map(pickRandomAngle),
    };
    this.initArtwork(randomTemplateIndex, newArgSet);
  };

  getParsedContent = () => {
    return parseRawArtworkContent(this.artworkContent, this.defaultArgSet);
  };
}

export { CreateStore };
