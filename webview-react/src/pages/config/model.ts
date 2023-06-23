import { useState } from '@/hooks/useImmer';

export const useModel = () => {
  const [formData, setFormDate] = useState({
    yapi: {
      domain: '',
      projects: [
        {
          name: '',
          token: '',
          domain: '',
        },
      ],
    },
    mock: {
      mockNumber: '',
      mockBoolean: '',
      mockString: '',
      mockKeyWordEqual: [
        {
          key: '',
          value: '',
        },
      ],
      mockKeyWordLike: [
        {
          key: '',
          value: '',
        },
      ],
    },
  });

  return {
    formData,
    setFormDate,
  };
};

export type Model = ReturnType<typeof useModel>;
