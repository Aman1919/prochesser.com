import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { pick } from "lodash";
import { TMove } from "../types/game";

type TState = {
  bestMove: TMove | null;
  loading: boolean;
};

type TAction = {
  setBestMove: (bestMove: TMove | null) => void;
  setLoading: (loading: boolean) => void;
};

const INITIAL_STATE = {
  bestMove: null,
  loading: false,
};

type TGlobalState = TAction & TState;

export const useStore = create<TGlobalState>((set) => ({
  ...INITIAL_STATE,
  setBestMove: (bestMove: TMove | null) => {
    set({ bestMove });
  },
  setLoading: (loading: boolean) => {
    set({ loading })
  }
}));

export const useBestMoveStore = (value?: Array<keyof TGlobalState>) => {
  return useStore(
    useShallow((state) => {
      if (Array.isArray(value)) {
        return pick(state, value);
      }

      return state;
    })
  );
};
