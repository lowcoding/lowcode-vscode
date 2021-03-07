import React, { useEffect } from 'react';
import { useMount } from 'ahooks';
import useService from './useService';
import { getScaffolds } from '@/webview/service';

const useController = () => {
  const service = useService();
  const { model } = service;

  useMount(() => {
    fetchScaffolds();
  });

  useEffect(() => {
    if (model.currentCategory) {
      model.setScaffolds(
        model.allScaffolds.filter(s => s.category === model.currentCategory),
      );
    }
  }, [model.currentCategory]);

  const fetchScaffolds = () => {
    model.setLoading(s => {
      s.fetch = true;
    });
    getScaffolds()
      .then(res => {
        model.setCategories(
          res.map(s => {
            return {
              name: s.category,
              icon: s.icon,
            };
          }),
        );
        const scaffolds: typeof model.allScaffolds = [];
        res.map(r => {
          r.scaffolds.map(s => {
            scaffolds.push({
              category: r.category,
              title: s.title,
              description: s.description,
              screenshot: s.screenshot,
              repository: s.repository,
              repositoryType: s.repositoryType,
            });
          });
        });
        model.setAllScaffolds(scaffolds);
        if (res.length > 0) {
          model.setCurrentCategory(res[0].category);
        }
      })
      .finally(() => {
        model.setLoading(s => {
          s.fetch = false;
        });
      });
  };

  const changeCategory = (name: string) => {
    if (name === model.currentCategory) {
      return;
    }
    model.setCurrentCategory(name);
  };

  return {
    service,
    fetchScaffolds,
    changeCategory,
  };
};

export default useController;
