export const formatPath = (path: string = '') => {
  if (
    path.startsWith('/') &&
    process.platform.toLowerCase().includes('win32')
  ) {
    path = path.substring(1);
  }
  return path;
};
