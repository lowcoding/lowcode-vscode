import { getConfig } from '../../utils/config';

const config = getConfig();

export const getYapiDomain = () => {
  const domian = config.yapi?.domain;
  return domian;
};

export const getYapiProjects = () => {
  const projects = config.yapi?.projects || [];
  return projects;
};
