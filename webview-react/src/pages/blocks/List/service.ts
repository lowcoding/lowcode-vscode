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
    this.model.setMaterials(filterList);
  }

  async getList() {
    const res = await getLocalMaterials('blocks');
    const categoryList: string[] = [];
    res.map((s) => {
      s.preview.category?.map((c) => {
        if (!categoryList.includes(c)) {
          categoryList.push(c);
        }
      });
    });
    this.model.setMaterials(res);
    this.model.setOriMaterials(res);
    this.model.setSelectedCategory([]);
    this.model.setCategoryList(categoryList);
  }
}
