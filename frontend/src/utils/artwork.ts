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

// const ARTWORK_TEMPLATE_PLACEHOLDER_REGEX = /<% ([a-z]+)-([0-9]+) %>/;
// const ARTWORK_TEMPLATE_PLACEHOLDER_REGEX_GLOBAL = new RegExp(
//   ARTWORK_TEMPLATE_PLACEHOLDER_REGEX.source,
//   ARTWORK_TEMPLATE_PLACEHOLDER_REGEX.flags + "g",
// );

// const fillInTemplate = (template: string, args: TemplateArgs) => {
//   // Calculate the total count of placeholder
//   const totalCount =
//     template.match(ARTWORK_TEMPLATE_PLACEHOLDER_REGEX_GLOBAL)?.length || 0;
//   let processedTemplate = template;
//   for (let times = 0; times < totalCount; times++) {
//     // find the first arg and read its type & no.
//     const [, argType, argIndex] =
//       ARTWORK_TEMPLATE_PLACEHOLDER_REGEX.exec(processedTemplate) || [];
//     // load config value for its type & no.
//     // console.log("argType", argType, "argIndex", argIndex);
//     const value = (args as any)[argType][argIndex];
//     const suffix = (ARGS_SUFFIX as any)[argType];
//     const replacement = value + suffix;
//     // console.log("replacement", replacement);
//     // replace the current placeholder
//     processedTemplate = processedTemplate.replace(
//       ARTWORK_TEMPLATE_PLACEHOLDER_REGEX,
//       replacement,
//     );
//     // console.log("processedTemplate", processedTemplate);
//   }
//   return processedTemplate;
// };

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

export { fillInTemplate };
