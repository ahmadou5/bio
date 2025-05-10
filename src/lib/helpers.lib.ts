import axios, { AxiosError } from "axios";

export const formatAddress = (value: string) => {
  return value.substring(0, 4) + ".." + value.substring(value.length - 4);
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 4,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s, 8s
      await delay(delayMs * Math.pow(2, attempt - 1));
    }
  }

  throw new Error(
    `Operation failed after ${maxRetries} attempts. Last error: ${
      lastError instanceof Error ? lastError.message : "Unknown error"
    }`
  );
}

export function isValidSolanaAddress(address: string): boolean {
  return /^[0-9a-zA-Z]{32,44}$/.test(address);
}

export const getNativePrice = async (tokenId: string): Promise<number> => {
  const baseUrl = "https://api.coingecko.com/api/v3/simple/price";

  try {
    const price = await retryOperation(async () => {
      const response = await axios.get(
        `${baseUrl}?ids=${tokenId}&vs_currencies=usd`
      );

      const price = response.data[tokenId]?.usd;

      if (typeof price !== "number") {
        throw new Error(`Invalid price data received for token ${tokenId}`);
      }

      return price;
    });

    return price;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Handle specific API errors
      if (error.response?.status === 404) {
        throw new Error(`Token ${tokenId} not found on CoinGecko`);
      }
      if (error.response?.status === 429) {
        throw new Error(
          "CoinGecko API rate limit exceeded. Please try again later."
        );
      }
      throw new Error(`CoinGecko API error: ${error.message}`);
    }

    throw error;
  }
};
