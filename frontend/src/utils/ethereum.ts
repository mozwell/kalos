// Since Ethereum address is case-insensitive, and representation of data sources differ, we should take a uniform approach to format it.
const formatAddress = (address: string) => {
  return address.toLowerCase();
};

const isTwoAddressEqual = (a: string, b: string) => {
  return formatAddress(a) === formatAddress(b);
};

export { formatAddress, isTwoAddressEqual };
