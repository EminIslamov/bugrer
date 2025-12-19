import { useCallback, useState } from 'react';

/**
 * Кастомный хук для управления модальным окном
 * @returns {Object} - { isModalOpen, openModal, closeModal }
 */
export const useModal = () => {
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
