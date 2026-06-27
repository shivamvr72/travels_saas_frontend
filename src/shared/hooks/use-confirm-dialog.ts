import { useState, useCallback } from 'react';

export interface ConfirmDialogConfig {
  title: string;
  description: React.ReactNode;
  onConfirm: () => void | Promise<void>;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ConfirmDialogConfig | null>(null);

  const openDialog = useCallback((newConfig: ConfirmDialogConfig) => {
    setConfig(newConfig);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    // don't clear config immediately so exit animation looks right
    setTimeout(() => setConfig(null), 300);
  }, []);

  return {
    isOpen,
    config,
    openDialog,
    closeDialog,
  };
}
