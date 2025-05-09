import vybeApi from "@api/vybe-api";

vybeApi.auth("bgdhhghhdh");

export const getUserTokens = async (userAddress: string) => {
  try {
    const tokens = await vybeApi.get_wallet_tokens({
      ownerAddress: userAddress,
    });
    console.log(tokens);
    return tokens;
  } catch (error) {
    console.error(error);
  }
};
