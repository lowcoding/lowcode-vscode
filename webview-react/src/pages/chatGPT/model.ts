import { useRef } from 'react';
import { useState } from '@/hooks/useImmer';

export const useModel = () => {
  const [inputChatPrompt, setInputChatPrompt] = useState('');

  const [chatList, setChatList] = useState<
    { prompt: string; res: string; key: number }[]
  >([]);

  const [current, setCurrent] = useState<typeof chatList[0]>({
    prompt: '',
    res: '',
    key: 0,
  });

  const [loading, setLoading] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  return {
    inputChatPrompt,
    setInputChatPrompt,
    chatList,
    setChatList,
    current,
    setCurrent,
    loading,
    setLoading,
    listRef,
  };
};

export type Model = ReturnType<typeof useModel>;
