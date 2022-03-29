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
        img: 'https://cdn.jsdelivr.net/gh/migrate-gitee/img-host/2020/11/05/1604587962875.jpg',
        category: [],
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
