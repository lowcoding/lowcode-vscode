import { useState } from '@/hooks/useImmer';

const useModel = () => {
  const [categories, setCategories] = useState<
    { name: string; icon: string; uuid: string }[]
  >([]);

  const [allScaffolds, setAllScaffolds] = useState<
    {
      category: string;
      title: string;
      description: string;
      screenshot: string;
      repository: string;
      repositoryType: 'git' | 'npm';
      uuid: string;
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
      uuid: string;
    }[]
  >([]);

  const [currentCategory, setCurrentCategory] = useState('');

  const [formModal, setFormModal] = useState<{ visible: boolean; config: any }>(
    {
      visible: false,
      config: {},
    },
  );

  const [downloadVisible, setDownloadVisible] = useState(false);

  const [localProjectModalVisible, setLocalProjectModalVisible] =
    useState(false);

  const [loading, setLoading] = useState<{ fetch: boolean; download: boolean }>(
    {
      fetch: true,
      download: false,
    },
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
    formModal,
    setFormModal,
    downloadVisible,
    setDownloadVisible,
    localProjectModalVisible,
    setLocalProjectModalVisible,
  };
};

export default useModel;
