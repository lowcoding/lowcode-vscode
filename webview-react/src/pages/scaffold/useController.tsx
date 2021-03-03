import React from 'react';
import useService from './useService';

const useController = () => {
  const service = useService();
  const { model } = service;

  return {
    service,
  };
};

export default useController;
