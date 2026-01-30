import { create } from "zustand";

interface ConfirmState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  confirm: (data: {
    title?: string;
    description: string;
    onConfirm: () => void;
  }) => void;
  close: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  isOpen: false,
  title: "",
  description: "",
  onConfirm: () => {},
  confirm: ({ title = "Are you absolutely sure?", description, onConfirm }) =>
    set({ isOpen: true, title, description, onConfirm }),
  close: () => set({ isOpen: false }),
}));
