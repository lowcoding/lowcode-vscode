import React, { useEffect } from 'react';
import { useMount } from 'ahooks';
import useService from './useService';
import { downloadScaffoldByVsCode, getScaffolds } from '@/webview/service';
import useCheckVankeInternal from '@/hooks/useCheckVankeInternal';

const useController = () => {
  const service = useService();
  const { model } = service;
  const isVankeInternal = useCheckVankeInternal();

  useEffect(() => {
    if (isVankeInternal !== undefined) {
      fetchScaffolds();
    }
  }, [isVankeInternal]);

  useEffect(() => {
    if (model.currentCategory) {
      model.setScaffolds(
        model.allScaffolds.filter((s) => s.category === model.currentCategory),
      );
    }
  }, [model.currentCategory]);

  const fetchScaffolds = () => {
    model.setLoading((s) => {
      s.fetch = true;
    });
    const promises: ReturnType<typeof getScaffolds>[] = [
      getScaffolds('https://cdn.jsdelivr.net/gh/lowcoding/scaffold/index.json'),
    ];
    if (isVankeInternal) {
      promises.push(
        getScaffolds(
          'https://git.vankeservice.com/v0417672/lowcode-scaffolds/raw/master/index.json',
        ),
      );
    }
    Promise.all(promises)
      .then((allRes) => {
        const res = allRes.flat();
        model.setCategories(
          res.map((s) => ({
            name: s.category,
            icon: s.icon,
            uuid: s.uuid,
          })),
        );
        const scaffolds: typeof model.allScaffolds = [];
        res.map((r) => {
          r.scaffolds.map((s) => {
            scaffolds.push({
              category: r.uuid,
              title: s.title,
              description: s.description,
              screenshot: s.screenshot,
              repository: s.repository,
              repositoryType: s.repositoryType,
              uuid: s.uuid,
            });
          });
        });
        model.setAllScaffolds(scaffolds);
        if (res.length > 0) {
          model.setCurrentCategory(res[0].uuid);
        }
      })
      .finally(() => {
        model.setLoading((s) => {
          s.fetch = false;
        });
      });
  };

  const changeCategory = (uuid: string) => {
    if (uuid === model.currentCategory) {
      return;
    }
    model.setCurrentCategory(uuid);
  };

  const downloadScaffold = (config: typeof model.scaffolds[0]) => {
    model.setLoading((s) => {
      s.download = true;
    });
    downloadScaffoldByVsCode({
      repository: config.repository,
      type: config.repositoryType,
    })
      .then((res) => {
        model.setFormModal((s) => {
          s.visible = true;
          s.config = res;
        });
      })
      .finally(() => {
        model.setLoading((s) => {
          s.download = false;
        });
      });
  };

  return {
    service,
    fetchScaffolds,
    changeCategory,
    downloadScaffold,
  };
};

export default useController;
