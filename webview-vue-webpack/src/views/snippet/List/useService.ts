import useModel from './useModel';
const useService = () => {
  const model = useModel();

  const search = (value: string) => {
    if (!value.trim()) {
      model.materials.list = model.oriMaterials.list;
    } else {
      model.materials.list = model.oriMaterials.list.filter(s => {
        return (
          s.name.indexOf(value) > -1 ||
          (s.preview.title && s.preview.title.indexOf(value) > -1) ||
          (s.preview.description && s.preview.description.indexOf(value) > -1)
        );
      });
    }
  };

  return {
    model,
    search,
  };
};

export default useService;
