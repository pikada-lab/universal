export interface CategoryLike { 
  categoryID:number;
  parent: number;
  visible: boolean;
  name: string;
  status:string;
  version:number;
  updatedAt: number;
}
export class Category {
  categoryID:number;
  parent: number;
  visible: boolean;
  name: string;
  status:string;
  version:number;
  updatedAt: number;
  constructor(category: CategoryLike) {
    this.categoryID = category.categoryID;
    this.parent = category.parent;
    this.visible = category.visible;
    this.name = category.name;
    this.status = category.status;
    this.version = category.version;
    this.updatedAt = category.updatedAt;
  }
}