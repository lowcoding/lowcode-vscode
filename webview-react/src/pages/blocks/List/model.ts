import { useState } from '@/hooks/useImmer';

export const useModel = () => {
  const [materials, setMaterials] = useState<
    | {
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
    | undefined
  >(undefined);
  const [oriMaterials, setOriMaterials] = useState<
    NonNullable<typeof materials>
  >([]);

  const [selectedMaterial, setSelectedMaterial] = useState<
    NonNullable<typeof materials>[0]
  >({ schema: {}, model: {} } as any);

  const [directoryModalVsible, setDirectoryModalVsible] = useState(false);

  const [projectList, setProjectList] = useState<string[]>([]);

  const [categoryList, setCategoryList] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  const [selectProject, setSelectProject] = useState('');

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
    projectList,
    setProjectList,
    categoryList,
    setCategoryList,
    selectedCategory,
    setSelectedCategory,
    selectProject,
    setSelectProject,
    searchValue,
    setSearchValue,
  };
};

export type Model = ReturnType<typeof useModel>;
