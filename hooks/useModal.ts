"use client";

import { useState, useCallback } from "react";

interface ModalState {
  title?: string;
  description?: string;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<ModalState>({});

  const openModal = useCallback((config: ModalState = {}) => {
    setState({
      title: config.title,
      description: config.description,
      isLoading: config.isLoading || false,
      confirmText: config.confirmText || "Confirm",
      cancelText: config.cancelText || "Cancel",
    });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setState({});
  }, []);

  const updateLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    updateLoading,
    ...state,
  };
}
