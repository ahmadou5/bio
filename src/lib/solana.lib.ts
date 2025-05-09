import {
  Connection,
  LAMPORTS_PER_SOL,
  Keypair,
  TransactionMessage,
  VersionedTransaction,
  PublicKey,
  SystemProgram,
  ComputeBudgetProgram,
} from "@solana/web3.js";

import { apiResponse } from "@/lib/api.helpers";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  getMint,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

type ConstructTransactionParams = {
  senderPublicKey: string;
  receiveAddress: string;
  amount: number;
  connection: Connection;
};

type SignAndSendTransactionParams = {
  transaction: VersionedTransaction;
  connection: Connection;
  signer: Keypair;
};

export const constructSplTokenTransaction = async (
  connection: Connection,
  {
    amount,
    fromPubKey,
    toPubKey,
    tokenMint,
  }: {
    amount: number;
    fromPubKey: string;
    toPubKey: string;
    tokenMint: string;
  }
): Promise<VersionedTransaction> => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numericAmount) || numericAmount <= 0) {
    throw new Error("Invalid amount");
  }
  //valiadte sender pubkey
  let senderPubKey: PublicKey;
  try {
    senderPubKey = new PublicKey(fromPubKey);
  } catch (error) {
    console.error(error);
    throw new Error("Invalid receive address");
  }
  // Validate receive address
  let receivePubKey: PublicKey;
  try {
    receivePubKey = new PublicKey(toPubKey);
  } catch (error) {
    console.error(error);
    throw new Error("Invalid receive address");
  }
  let mintAddress: PublicKey;
  try {
    mintAddress = new PublicKey(tokenMint);
  } catch (error) {
    console.error(error);
    throw new Error("Invalid receive address");
  }

  // 1. Get token mint info for decimal adjustment
  const mintInfo = await getMint(connection, mintAddress);
  const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);

  // 2. Get token accounts
  const fromTokenAccount = await getAssociatedTokenAddress(
    mintAddress,
    senderPubKey,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const toTokenAccount = await getAssociatedTokenAddress(
    mintAddress,
    receivePubKey,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  // 3. Prepare instructions array
  const instructions = [];
  const computeUnitIx = ComputeBudgetProgram.setComputeUnitLimit({
    units: 300_000,
  });
  instructions.unshift(computeUnitIx);

  // 4. Check if destination account exists and create if needed
  const ifexists = await connection.getAccountInfo(toTokenAccount);
  if (!ifexists || !ifexists.data) {
    const createATAiX = createAssociatedTokenAccountInstruction(
      senderPubKey,
      toTokenAccount,
      receivePubKey,
      mintAddress,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    instructions.push(createATAiX);
  }

  const { blockhash } = await connection.getLatestBlockhash();

  // 5. Create transfer instruction with adjusted amount
  const transferInstruction = createTransferInstruction(
    fromTokenAccount,
    toTokenAccount,
    senderPubKey,
    adjustedAmount
  );
  instructions.push(transferInstruction);

  const messageV0 = new TransactionMessage({
    payerKey: senderPubKey,
    recentBlockhash: blockhash,
    instructions: [...instructions],
  }).compileToV0Message();

  return new VersionedTransaction(messageV0);
};

// Helper to construct the send sol transaction
export const constructSolTransaction = async ({
  senderPublicKey,
  receiveAddress,
  amount,
  connection,
}: ConstructTransactionParams): Promise<VersionedTransaction> => {
  try {
    // Validate amount
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error("Invalid amount");
    }
    //valiadte sender pubkey
    let senderPubKey: PublicKey;
    try {
      senderPubKey = new PublicKey(senderPublicKey);
    } catch (error) {
      console.error(error);
      throw new Error("Invalid receive address");
    }
    // Validate receive address
    let receivePubKey: PublicKey;
    try {
      receivePubKey = new PublicKey(receiveAddress);
    } catch (error) {
      console.error(error);
      throw new Error("Invalid receive address");
    }

    const { blockhash } = await connection.getLatestBlockhash();

    const instruction = SystemProgram.transfer({
      fromPubkey: senderPubKey,
      toPubkey: receivePubKey,
      lamports: numericAmount * LAMPORTS_PER_SOL,
    });

    const messageV0 = new TransactionMessage({
      payerKey: senderPubKey,
      recentBlockhash: blockhash,
      instructions: [instruction],
    }).compileToV0Message();

    return new VersionedTransaction(messageV0);
  } catch (error) {
    throw error;
  }
};

// Helper to estimate transaction fee
export const estimateTransactionFee = async (
  transaction: VersionedTransaction | null,
  connection: Connection
): Promise<number | undefined> => {
  try {
    if (!transaction) return;
    const { value } = await connection.getFeeForMessage(
      transaction.message,
      "confirmed"
    );
    if (value !== null) {
      return value / LAMPORTS_PER_SOL;
    }
    throw new Error("Failed to estimate transaction fee: value is null");
  } catch (error) {
    throw new Error(`Error estimating fee: ${error}`);
  }
};

// Helper to sign and send transaction
export const signAndSendTransaction = async ({
  transaction,
  connection,
  signer,
}: SignAndSendTransactionParams) => {
  try {
    transaction.sign([signer]);

    const txid = await connection.sendTransaction(transaction);
    await connection.confirmTransaction(txid, "confirmed");

    return apiResponse(true, "success transaction", txid);
  } catch (error) {
    if (error instanceof Error) {
      return apiResponse(false, "error sending transaction", error.message);
    }
    throw error;
  }
};
