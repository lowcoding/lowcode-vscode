import useModel from './model';

const useService = () => {
  const model = useModel();

  return {
    model,
  };
};

export default useService;
