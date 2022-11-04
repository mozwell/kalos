/** To get a floor decimal with specified digits (e.g. toFloorDecimal(1.9876, 1) -> 1.9)*/
const toFloorDecimal = (num: number, digits: number) => {
  if (digits < 0) {
    return num;
  }
  const power = Math.pow(10, digits);
  return Math.trunc(num * power) / power;
};

export { toFloorDecimal };
