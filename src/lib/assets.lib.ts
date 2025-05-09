import { apiResponse } from "./api.helpers";
import axios from "axios";
export const getUserTokens = async (userAddress: string, rpcUrl: string) => {
  try {
    const origin = "https://infusewallet.xyz";
    const response = await axios.get(
      `${origin}/api/solana/tokens?rpcUrl=${rpcUrl}&address=${userAddress}`
    );
    const tokens = response?.data?.tokens;
    console.log("tokens", tokens);
    return apiResponse(true, "Succesfully fetched User Tokens", tokens);
  } catch (error) {
    console.error("Error fetching user tokens:", error);
    return apiResponse(false, "failed to fetch user Tokens", error);
  }
};

export const getUserNFTs = async (userAddress: string, rpcUrl: string) => {
  try {
    const origin = "https://infusewallet.xyz";
    const response = await axios.get(
      `${origin}/api/solana/nfts?rpcUrl=${rpcUrl}&address=${userAddress}`
    );
    const nfts = response?.data?.tokens;
    console.log("tokens", nfts);
    // Filter out NFTs with no image
    return apiResponse(true, "successfully fetched NFTs", nfts);
  } catch (error) {
    console.error("Error fetching user NFTs:", error);
    return apiResponse(false, "failed to fetch user NFTs", error);
  }
};
