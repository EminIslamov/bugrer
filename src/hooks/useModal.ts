import { useCallback, useState } from 'react';

type UseModalResult = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

/**
 * Кастомный хук для управления модальным окном
 * @returns {UseModalResult} - { isModalOpen, openModal, closeModal }
 */
export const useModal = (): UseModalResult => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useCallback фиксирует ссылку на функцию, уменьшая количество перерисовок
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    openModal,
    closeModal,
  };
};
