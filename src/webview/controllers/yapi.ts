import { getDomain, getProjectList } from '../../config';

export const getYapiDomain = () => {
  const domian = getDomain();
  return domian;
};

export const getYapiProjects = () => {
  const projects = getProjectList();
  return projects;
};
