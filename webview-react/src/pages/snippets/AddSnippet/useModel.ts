import { useState } from '@/hooks/useImmer';

const useModel = () => {
  const [formData, setFormData] = useState<{
    name: string;
    template: string;
    model: string;
    schema: string;
    preview: string;
  }>({
    model: '{}',
    schema: '{}',
    preview: JSON.stringify(
      {
        title: '',
        description: '',
        img: [
          'https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg',
        ],
        category: [],
        notShowInCommand: false,
        notShowInSnippetsList: false,
        notShowInintellisense: false,
      },
      null,
      2,
    ),
  } as any);

  return {
    formData,
    setFormData,
  };
};

export default useModel;
