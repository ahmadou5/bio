export const formatAddress = (value: string) => {
  return value.substring(0, 4) + ".." + value.substring(value.length - 4);
};
