import { useState } from '@/hooks/useImmer';

const useModel = () => {
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
    saveOption: ['package'],
  });

  return {
    formData,
    setFormDate,
  };
};

export default useModel;
