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
    this.setCurrentArgSet(this.templates[0].defaultArgs);

    // Init artwork frame
    const initialArtworkContent = fillInTemplate(
      this.templates[0].content,
      this.templates[0].defaultArgs,
    );
    this.setArtworkContent(initialArtworkContent);
  };

  @observable currentTemplateIndex = 0;

  @observable templates: ArtworkTemplateType[] = [];

  @observable currentArgSet: ArtworkTemplateType["defaultArgs"] =
    {} as ArtworkTemplateType["defaultArgs"];

  @observable artworkContent = "";

  @action
  loadTemplate = () => {
    this.templates = loadTemplates();
  };

  @action
  setCurrentArgSet = (value: ArtworkTemplateType["defaultArgs"]) => {
    this.currentArgSet = value;
  };

  @action
  setArtworkContent = (value: string) => {
    this.artworkContent = value;
  };

  @action
  setCurrentTemplateIndex = (value: number) => {
    this.currentTemplateIndex = value;
  };

  @action
  handleTemplateSelectChange = (index: number) => {
    // When template select changes, render all inputs according to its arg type and number & set default value of every input as provided
    this.setCurrentTemplateIndex(index);
    this.setCurrentArgSet(this.templates[index].defaultArgs);
  };

  @action
  handleArgSetChange = (newArgSet: ArtworkTemplateType["defaultArgs"]) => {
    // When input changes, generate new content string and pass it to artwork frame
    this.setCurrentArgSet(newArgSet);
    const newContent = fillInTemplate(
      this.templates[this.currentTemplateIndex].content,
      newArgSet,
    );
    this.setArtworkContent(newContent);
  };

  @action
  handleRandomize = () => {
    // When click on Randomize, change template select first, and then change all its input values
    const randomTemplateIndex = pickRandomInt(0, this.templates.length - 1);
    this.handleTemplateSelectChange(randomTemplateIndex);
    const newArgSet = {
      color: this.currentArgSet.color.map(pickRandomColor),
      percent: this.currentArgSet.percent.map(pickRandomPercent),
      px: this.currentArgSet.color.map(pickRandomPx),
      angle: this.currentArgSet.color.map(pickRandomAngle),
    };
    this.handleArgSetChange(newArgSet);
  };
}

export { CreateStore };