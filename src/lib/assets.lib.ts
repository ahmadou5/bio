import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const KNOWN_TOKENS: {
  [key: string]: { name: string; symbol: string; image: string };
} = {
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: {
    name: "Tether USD",
    symbol: "USDT",
    image: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  },
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    name: "USD Coin",
    symbol: "USDC",
    image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  },
  So11111111111111111111111111111111111111112: {
    name: "Wrapped SOL",
    symbol: "SOL",
    image: "https://cryptologos.cc/logos/solana-sol-logo.png",
  },
  mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So: {
    name: "mSOL",
    symbol: "mSOL",
    image: "https://cryptologos.cc/logos/msol-logo.png",
  },
  DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: {
    name: "BONK",
    symbol: "BONK",
    image: "https://cryptologos.cc/logos/bonk-bonk-logo.png",
  },
  PAWSxhjTyNJELywYiYTxCN857utnYmWXu7Q59Vgn6ZQ: {
    name: "PAWS",
    symbol: "PAWS",
    image:
      "https://api.phantom.app/image-proxy/?image=https%3A%2F%2Fcoin-images.coingecko.com%2Fcoins%2Fimages%2F54865%2Flarge%2Fpaws.jpg%3F1742193676&anim=true&fit=cover&width=128&height=128",
  },
};

export const getUserTokens = async (address: string, rpcUrl: string) => {
  try {
    const connection = new Connection(rpcUrl, { commitment: "confirmed" });
    const publicKey = new PublicKey(address);

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId: TOKEN_PROGRAM_ID }
    );

    interface UpdatedTokenType {
      mint: string;
      amount: number;
      decimals: number;
      name: string;
      symbol: string;
      uri: string | null;
      image: string | null;
    }
    const tokens: UpdatedTokenType[] = [];

    await Promise.all(
      tokenAccounts.value
        .filter(
          (account) =>
            account.account.data.parsed.info.tokenAmount.uiAmount > 0 &&
            account.account.data.parsed.info.tokenAmount.decimals > 0
        )
        .map(async (account) => {
          const mint = account.account.data.parsed.info.mint;

          // Check if the mint address is in the known tokens list
          if (KNOWN_TOKENS[mint]) {
            const { name, symbol, image } = KNOWN_TOKENS[mint];
            tokens.push({
              mint,
              amount: account.account.data.parsed.info.tokenAmount.uiAmount,
              decimals: account.account.data.parsed.info.tokenAmount.decimals,
              name: name,
              symbol: symbol,
              uri: null,
              image: image,
            });
            return;
          }

          // If not a known token, fetch metadata
          try {
            const metadata = await getTokenMetadata(rpcUrl, mint);

            tokens.push({
              mint,
              amount: account.account.data.parsed.info.tokenAmount.uiAmount,
              decimals: account.account.data.parsed.info.tokenAmount.decimals,
              name: metadata?.name || "Unknown Token",
              symbol: metadata?.symbol || "???",
              uri: metadata?.uri || null,
              image: metadata?.json?.image || null,
            });
          } catch (err) {
            console.error(`Error fetching metadata for token ${mint}:`, err);
            // Still add the token with default values
            tokens.push({
              mint,
              amount: account.account.data.parsed.info.tokenAmount.uiAmount,
              decimals: account.account.data.parsed.info.tokenAmount.decimals,
              name: "Unknown Token",
              symbol: "???",
              uri: null,
              image: null,
            });
          }
        })
    );

    return tokens;
  } catch (error) {
    console.error("Error fetching user tokens:", error);
    return []; // Return empty array instead of undefined
  }
};

export const getUserNFTs = async (address: string, rpcUrl: string) => {
  try {
    const connection = new Connection(rpcUrl, { commitment: "confirmed" });
    const publicKey = new PublicKey(address);

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId: TOKEN_PROGRAM_ID }
    );

    const nfts = await Promise.all(
      tokenAccounts.value
        .filter(
          (account) =>
            (account.account.data.parsed.info.tokenAmount.decimals === 0 &&
              account.account.data.parsed.info.tokenAmount.amount === "1") ||
            account.account.data.parsed.info.tokenAmount.amount === 1 ||
            (account.account.data.parsed.info.tokenAmount.amount === "1" &&
              account.account.data.parsed.info.tokenAmount.decimals === 0)
        )
        .map(async (account) => {
          const mint = account.account.data.parsed.info.mint;

          try {
            // Fixed parameter order
            const metadata = await getTokenMetadata(rpcUrl, mint);
            return {
              mint,
              amount: account.account.data.parsed.info.tokenAmount.uiAmount,
              decimals: account.account.data.parsed.info.tokenAmount.decimals,
              name: metadata?.name || "Unknown NFT",
              symbol: metadata?.symbol || "???",
              uri: metadata?.uri || null,
              image: metadata?.json?.image || null,
              attributes: metadata?.json?.attributes || null, // Fixed attribute → attributes
              description: metadata?.json?.description || null,
              external_url: metadata?.json?.external_url || null,
              collection: metadata?.collection || null,
            };
          } catch (err) {
            console.error(`Error fetching metadata for NFT ${mint}:`, err);
            // Return basic info if metadata fetch fails
            return {
              mint,
              amount: account.account.data.parsed.info.tokenAmount.uiAmount,
              decimals: account.account.data.parsed.info.tokenAmount.decimals,
              name: "Unknown NFT",
              symbol: "???",
              uri: null,
              image: null,
              attributes: null,
              description: null,
              external_url: null,
              collection: null,
            };
          }
        })
    );

    return nfts.filter((nft) => nft !== null); // Filter out any null entries
  } catch (error) {
    console.error("Error fetching user NFTs:", error);
    return []; // Return empty array instead of undefined
  }
};

export const getTokenMetadata = async (rpcUrl: string, token_mint: string) => {
  try {
    // Use the provided rpcUrl instead of hardcoded URL
    const connection = new Connection(rpcUrl, "confirmed");
    const metaplex = Metaplex.make(connection);

    const token = await metaplex
      .nfts()
      .findByMint({ mintAddress: new PublicKey(token_mint) });

    return token;
  } catch (error) {
    console.error(`Failed to fetch metadata for ${token_mint}:`, error);
    // Return null instead of undefined when there's an error
    return null;
  }
};
