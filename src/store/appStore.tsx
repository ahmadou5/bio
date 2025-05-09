import { create } from "zustand";

interface UpdatedTokenType {
  mint: string;
  amount: number;
  decimals: number;
  name: string;
  symbol: string;
  uri: string | null;
  image: string | null;
}

export interface nft {
  mint: string;
  amount: number;
  decimals: number;
  name: string;
  symbol: string;
  uri: string;
  image: string;
  attribute?: {
    trait_type: string;
    value: string;
  }[];
  description: string;
  external_url: string;
  collection?: {
    family: string;
    name: string;
  };
  [key: string]: unknown;
}

interface AppStore {
  nfts: nft[];
  tokens: UpdatedTokenType[];
  isReceiveModal: boolean;
  isSendModal: boolean;
  setTokens: (tokens: UpdatedTokenType[]) => void;
  setNfts: (nfts: nft[]) => void;
  toggleSendModal: () => void;

  toggleReceiveModal: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  tokens: [],
  nfts: [],
  isSendModal: false,
  isReceiveModal: false,
  setTokens: (tokens) => set({ tokens: tokens }),
  setNfts: (nfts) => set({ nfts: nfts }),
  toggleSendModal: () => {
    set((state) => ({ isSendModal: !state.isSendModal }));
  },
  toggleReceiveModal: () => {
    set((state) => ({ isReceiveModal: !state.isReceiveModal }));
  },
}));
