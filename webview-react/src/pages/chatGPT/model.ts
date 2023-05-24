import { useState } from '@/hooks/useImmer';

export const useModel = () => {
  const [inputChatPrompt, setInputChatPrompt] = useState(`interface FormData {
		成本中心编码?: string;
		成本中心名称?: string;
		账套编码?: string;
		银行核算编码?: string;
		订单号?: string;
		订单金额?: string;
		确收时间?: string;
		"劳务成本-不含税"?: string;
	}
	将中文字段翻译为英文，驼峰格式，代码用代码块包裹`);

  const [chatList, setChatList] = useState<{ prompt: string; res: string }[]>(
    [],
  );

  const [current, setCurrent] = useState<typeof chatList[0]>({
    prompt: '',
    res: '',
  });

  return {
    inputChatPrompt,
    setInputChatPrompt,
    chatList,
    setChatList,
    current,
    setCurrent,
  };
};

export type Model = ReturnType<typeof useModel>;
