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
        img?: string[];
        category?: string[];
      };
      template: string;
      privateMaterials?: boolean;
      id: number;
    }[]
  >([]);
  const [oriMaterials, setOriMaterials] = useState<typeof materials>([]);

  const [selectedMaterial, setSelectedMaterial] = useState<typeof materials[0]>(
    { schema: {}, model: {} } as any,
  );

  const [directoryModalVsible, setDirectoryModalVsible] = useState(false);

  const [categoryList, setCategoryList] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  const [searchValue, setSearchValue] = useState('');

  return {
    materials,
    setMaterials,
    oriMaterials,
    setOriMaterials,
    selectedMaterial,
    setSelectedMaterial,
    directoryModalVsible,
    setDirectoryModalVsible,
    categoryList,
    setCategoryList,
    selectedCategory,
    setSelectedCategory,
    searchValue,
    setSearchValue,
  };
};

export type Model = ReturnType<typeof useModel>;
