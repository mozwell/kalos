import { random } from "colord";

import { ARTWORK_ARG_RANGE } from "../config/artworkTemplates";

// Pick an integer from the given range (min and max included)
const pickRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const pickRandomPercent = () => {
  const [min, max] = ARTWORK_ARG_RANGE["percent"];
  return pickRandomInt(min, max);
};

const pickRandomPx = () => {
  const [min, max] = ARTWORK_ARG_RANGE["px"];
  return pickRandomInt(min, max);
};

const pickRandomAngle = () => {
  const [min, max] = ARTWORK_ARG_RANGE["angle"];
  return pickRandomInt(min, max);
};

const pickRandomColor = () => {
  return random().toHex();
};

export {
  pickRandomInt,
  pickRandomPercent,
  pickRandomPx,
  pickRandomAngle,
  pickRandomColor,
};
