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

const convertToPlaceholder = (argType: string, argNo: number) => {
  return `<% ${argType}-${argNo} %>`;
};

const fillInTemplate = (template: string, args: TemplateArgs) => {
  let processedTemplate = template;
  const argTypeList = ["color", "percent", "px", "angle"];
  argTypeList.forEach((argType) => {
    const singleArgList = (args as any)[argType];
    singleArgList.forEach((item: any, index: number) => {
      const placeholder = convertToPlaceholder(argType, index);
      const suffix = (ARGS_SUFFIX as any)[argType];
      const replacement = item + suffix;
      processedTemplate = processedTemplate.replaceAll(
        placeholder,
        replacement,
      );
    });
  });
  return processedTemplate;
};

const loadTemplates = () => {
  return templateSet.templates;
};

export { fillInTemplate, loadTemplates };
