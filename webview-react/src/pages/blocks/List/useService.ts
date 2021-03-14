import { useDebounceFn } from 'ahooks';
import useModel from './useModel';

const useService = () => {
  const model = useModel();

  const search = useDebounceFn(
    (value: string) => {
      if (!value.trim()) {
        model.setMaterials(model.oriMaterials);
      } else {
        model.setMaterials(
          model.oriMaterials.filter(s => {
            return (
              s.name.indexOf(value) > -1 ||
              (s.preview.title && s.preview.title.indexOf(value) > -1) ||
              (s.preview.description &&
                s.preview.description.indexOf(value) > -1)
            );
          }),
        );
      }
    },
    { wait: 500 },
  );

  return {
    model,
    search,
  };
};

export default useService;
