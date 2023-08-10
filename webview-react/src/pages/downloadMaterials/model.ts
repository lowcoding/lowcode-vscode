import { useState } from '@/hooks/useImmer';
import { IDownloadMaterialsResult } from '@/webview/service';

export const useModel = () => {
  const [tab, setTab] = useState<'blocks' | 'snippets'>('snippets');
  const [downloadMaterialsVisible, setDownloadMaterialsVisible] =
    useState(true);

  const [materials, setMaterials] = useState<IDownloadMaterialsResult>({
    blocks: [],
    snippets: [],
  });

  const [selectedMaterials, setSelectedMaterials] = useState<{
    blocks: string[];
    snippets: string[];
  }>({
    blocks: [],
    snippets: [],
  });

  return {
    tab,
    setTab,
    downloadMaterialsVisible,
    setDownloadMaterialsVisible,
    materials,
    setMaterials,
    selectedMaterials,
    setSelectedMaterials,
  };
};

export type Model = ReturnType<typeof useModel>;
