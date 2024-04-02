import { create } from 'zustand';

interface useSupportTreatyModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const donateModal = create<useSupportTreatyModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
