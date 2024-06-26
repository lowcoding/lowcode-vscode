import { getLocalMaterials } from '@/webview/service';
import { Model } from './model';

export default class Service {
  private model: Model;

  constructor(model: Model) {
    this.model = model;
  }

  search() {
    const value = this.model.searchValue.toLowerCase().trim();
    let filterList = [...this.model.oriMaterials];
    if (value) {
      filterList = filterList.filter(
        (s) =>
          s.name.toLowerCase().indexOf(value) > -1 ||
          (s.preview.title &&
            s.preview.title.toLowerCase().indexOf(value) > -1) ||
          (s.preview.description &&
            s.preview.description.toLowerCase().indexOf(value) > -1),
      );
    }
    if (this.model.selectedCategory.length > 0) {
      filterList = filterList.filter((s) => {
        let flag = false;
        s.preview.category?.map((c) => {
          if (this.model.selectedCategory.includes(c)) {
            flag = true;
          }
        });
        return flag;
      });
    }
    if (this.model.selectProject) {
      filterList = filterList.filter((s) =>
        s.name.includes(this.model.selectProject),
      );
    }
    this.model.setMaterials(filterList);
  }

  async getList() {
    const res = await getLocalMaterials('blocks');
    const categoryList: string[] = [];
    const projectList: string[] = [];
    res.map((s) => {
      s.preview.category?.map((c) => {
        if (!categoryList.includes(c)) {
          categoryList.push(c);
        }
      });
      const project = s.name.split(' ')[0];
      if (!projectList.includes(project)) {
        projectList.push(project);
      }
    });
    const list: Model['materials'] = res.map((s, index) => ({
      ...s,
      id: index,
      preview: {
        ...s.preview,
        img:
          typeof s.preview.img === 'string' ? [s.preview.img] : s.preview.img,
      },
    }));

    this.model.setSelectedCategory([]);
    this.model.setSelectProject('');
    this.model.setOriMaterials(list);
    this.model.setCategoryList(categoryList);
    this.model.setProjectList(projectList);
    this.model.setMaterials(list);
  }
}
