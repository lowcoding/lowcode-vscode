import { useState } from '@/hooks/useImmer';

export const useModel = () => {
  const [materials, setMaterials] = useState<
    {
      path: string;
      name: string;
      model: object;
      schema: object;
      preview: {
        title?: string;
        description?: string;
        img?: string;
        category?: string[];
      };
      template: string;
    }[]
  >([]);
  const [oriMaterials, setOriMaterials] = useState<typeof materials>([]);

  const [categoryList, setCategoryList] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  const [searchValue, setSearchValue] = useState('');

  return {
    materials,
    setMaterials,
    oriMaterials,
    setOriMaterials,
    categoryList,
    setCategoryList,
    selectedCategory,
    setSelectedCategory,
    searchValue,
    setSearchValue,
  };
};

export type Model = ReturnType<typeof useModel>;
