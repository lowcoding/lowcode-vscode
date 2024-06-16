export const resetMaterialName = (name: string) => {
  const arrayStr = name.split('] ');
  return arrayStr[1] || name;
};
