export const addressAbbreviation = (address: string, tailLength: number) =>
  `${address.substring(0, 8)}...${address.substring(
    address.length - tailLength,
    address.length,
  )}`;
