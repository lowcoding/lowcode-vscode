import { useState } from '@/hooks/useImmer';

const useModel = () => {
  const [categories, setCategories] = useState<
    { name: string; icon: string }[]
  >([]);

  const [allScaffolds, setAllScaffolds] = useState<
    {
      category: string;
      title: string;
      description: string;
      screenshot: string;
      repository: string;
      repositoryType: 'git' | 'npm';
    }[]
  >([]);

  const [scaffolds, setScaffolds] = useState<
    {
      category: string;
      title: string;
      description: string;
      screenshot: string;
      repository: string;
      repositoryType: 'git' | 'npm';
    }[]
  >([]);

  const [currentCategory, setCurrentCategory] = useState('');

  const [loading, setLoading] = useState<{ fetch: boolean; download: boolean }>(
    { fetch: false, download: false },
  );
  return {
    loading,
    setLoading,
    categories,
    setCategories,
    allScaffolds,
    setAllScaffolds,
    scaffolds,
    setScaffolds,
    currentCategory,
    setCurrentCategory,
  };
};

export default useModel;
