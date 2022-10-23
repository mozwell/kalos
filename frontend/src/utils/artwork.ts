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
  targetEl?: HTMLElement,
) => {
  const target = targetEl || document.body;
  const varName = genArgVarName(argType, argNo);
  const val = rawVal + ARGS_SUFFIX[argType];
  target.style.setProperty(varName, val);
};

const getArgVar = (
  argType: keyof TemplateArgs,
  argNo: number,
  targetEl?: HTMLElement,
) => {
  const target = targetEl || document.body;
  const varName = genArgVarName(argType, argNo);
  return target.style.getPropertyValue(varName);
};

const fillInTemplate = (
  template: string,
  args: TemplateArgs,
  targetEl?: HTMLElement,
) => {
  let processedTemplate = template;
  ARG_TYPE_LIST.forEach((argType) => {
    const singleArgList = args[argType];
    singleArgList.forEach((item: string | number, index: number) => {
      const placeholder = convertToPlaceholder(argType, index);
      const cssVarName = genArgVarName(argType, index, true);
      setArgVar(argType, index, String(item), targetEl);
      processedTemplate = processedTemplate.replaceAll(placeholder, cssVarName);
    });
  });
  return processedTemplate;
};

const loadTemplates = () => {
  return templateSet.templates;
};

// convert artwork css content with css variables into with plain values
const parseRawArtworkContent = (rawContent: string, args: TemplateArgs) => {
  let parsedContent = rawContent;
  ARG_TYPE_LIST.forEach((argType) => {
    const singleArgList = args[argType];
    singleArgList.forEach((item: string | number, index: number) => {
      const cssVarName = genArgVarName(argType, index, true);
      const replacement = item + ARGS_SUFFIX[argType];
      parsedContent = parsedContent.replaceAll(cssVarName, replacement);
    });
  });
  return parsedContent;
};

const removeArgVar = (
  argType: keyof TemplateArgs,
  argNo: number,
  targetEl?: HTMLElement,
) => {
  const target = targetEl || document.body;
  const varName = genArgVarName(argType, argNo);
  return target.style.removeProperty(varName);
};

const batchRemoveArgVar = (args: TemplateArgs, targetEl?: HTMLElement) => {
  ARG_TYPE_LIST.forEach((argType) => {
    const singleArgList = args[argType];
    singleArgList.forEach((item: string | number, index: number) => {
      removeArgVar(argType, index, targetEl);
    });
  });
};

export {
  fillInTemplate,
  loadTemplates,
  setArgVar,
  getArgVar,
  removeArgVar,
  batchRemoveArgVar,
  parseRawArtworkContent,
};
