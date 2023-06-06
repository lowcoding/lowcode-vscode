import { useRef } from 'react';
import { useState } from '@/hooks/useImmer';

export const useModel = () => {
  const [inputChatPrompt, setInputChatPrompt] = useState('');

  const listRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(false);

  const [listVisible, setListVisible] = useState(false);

  return {
    inputChatPrompt,
    setInputChatPrompt,
    listRef,
    loading,
    setLoading,
    listVisible,
    setListVisible,
  };
};

export type Model = ReturnType<typeof useModel>;
