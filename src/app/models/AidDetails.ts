export class AidDetails {
  public casesEnable: number[] = [];
  public caseDefault: number = -1;

  public caseEnableIndex: Set<number> = new Set();

  constructor() {}

  init(obj: any) {
    this.casesEnable = obj.casesEnable;
    this.casesEnable.forEach(id => this.caseEnableIndex.add(id));
    this.caseDefault = obj.caseDefault;
  }

  toJSON() {
    return {
      casesEnable: this.casesEnable,
      caseDefault: this.caseDefault,
    };
  }

  hasCase(productId: number) {
    return this.caseEnableIndex.has(productId);
  }

  addCase(productId: number) {
    this.caseEnableIndex.add(productId);
    this.casesEnable.push(productId);
  }

  removeCase(productId: number) {
    this.caseEnableIndex.delete(productId);
    let index = this.casesEnable.findIndex((r) => r == productId);
    if (~index) {
      this.casesEnable.splice(index, 1);
    }
  }

  setDefault(productId: number) {
    this.caseDefault = productId;
  }

  removeDefault() {
    this.caseDefault = -1;
  }

  getCases() {
    return this.casesEnable;
  }
  getDefault() {
    return this.caseDefault;
  }
}
