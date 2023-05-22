import { useState } from '@/hooks/useImmer';

export const useModel = () => {
  const [chatRes, setChatRes] = useState('');
  const [chatPrompt, setChatPrompt] = useState('');

  return {
    chatRes,
    setChatRes,
    chatPrompt,
    setChatPrompt,
  };
};

export type Model = ReturnType<typeof useModel>;
