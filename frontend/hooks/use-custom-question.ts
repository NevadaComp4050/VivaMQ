import { create } from "zustand";

interface CustomQuestionStore {
  inputVisible: { [key: string]: boolean };
  inputValue: { [key: string]: string };
  showInput: (id: string) => void;
  hideInput: (id: string) => void;
  setInputValue: (id: string, value: string) => void;
}

export const useCustomQuestionStore = create<CustomQuestionStore>((set) => ({
  inputVisible: {},
  inputValue: {},
  showInput: (id) =>
    set((state) => ({
      inputVisible: { ...state.inputVisible, [id]: true },
    })),
  hideInput: (id) =>
    set((state) => ({
      inputVisible: { ...state.inputVisible, [id]: false },
      inputValue: { ...state.inputValue, [id]: "" },
    })),
  setInputValue: (id, value) =>
    set((state) => ({
      inputValue: { ...state.inputValue, [id]: value },
    })),
}));
