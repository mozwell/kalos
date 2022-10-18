import templateSet from "../config/artworkTemplates";

type TemplateArgs = {
  color: string[];
  percent: number[];
  px: number[];
  angle: number[];
};

const ARGS_SUFFIX = {
  color: "",
  percent: "%",
  px: "px",
  angle: "deg",
};

const ARG_TYPE_LIST = [
  "color",
  "percent",
  "px",
  "angle",
] as (keyof TemplateArgs)[];

const convertToPlaceholder = (argType: keyof TemplateArgs, argNo: number) => {
  return `<% ${argType}-${argNo} %>`;
};

const genArgVarName = (
  argType: keyof TemplateArgs,
  argNo: number,
  inline?: boolean,
) => {
  const basicName = `--kalos-create-${argType}-${argNo}`;
  return inline ? `var(${basicName})` : basicName;
};

const setArgVar = (
  argType: keyof TemplateArgs,
  argNo: number,
  rawVal: string,
) => {
  const varName = genArgVarName(argType, argNo);
  const val = rawVal + ARGS_SUFFIX[argType];
  document.body.style.setProperty(varName, val);
};

const getArgVar = (argType: keyof TemplateArgs, argNo: number) => {
  const varName = genArgVarName(argType, argNo);
  return document.body.style.getPropertyValue(varName);
};

const fillInTemplate = (template: string, args: TemplateArgs) => {
  let processedTemplate = template;
  ARG_TYPE_LIST.forEach((argType) => {
    const singleArgList = args[argType];
    singleArgList.forEach((item: string | number, index: number) => {
      const placeholder = convertToPlaceholder(argType, index);
      const cssVarName = genArgVarName(argType, index, true);
      setArgVar(argType, index, String(item));
      processedTemplate = processedTemplate.replaceAll(placeholder, cssVarName);
    });
  });
  return processedTemplate;
};

const loadTemplates = () => {
  return templateSet.templates;
};

// convert artwork css content with css variables into without css variables
const parseRawArtworkContent = (rawContent: string, args: TemplateArgs) => {
  let parsedContent = rawContent;
  ARG_TYPE_LIST.forEach((argType) => {
    const singleArgList = args[argType];
    singleArgList.forEach((item: string | number, index: number) => {
      const cssVarName = genArgVarName(argType, index, true);
      const cssVarVal = getArgVar(argType, index);
      parsedContent = parsedContent.replaceAll(cssVarName, cssVarVal);
    });
  });
  return parsedContent;
};

export {
  fillInTemplate,
  loadTemplates,
  setArgVar,
  getArgVar,
  parseRawArtworkContent,
};
