import React from 'react';
import useController from './useController';

const View = () => {
  const controller = useController();
  const { service } = controller;
  const { model } = service;

  return <div>1212</div>;
};

export default View;
