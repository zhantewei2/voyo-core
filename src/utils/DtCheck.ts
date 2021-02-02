export class DirtyCheck {
  dirtyStore: Record<string, any> = {};
  isNew(key: string, v: any) {
    if (this.dirtyStore[key] !== v) {
      this.dirtyStore[key] = v;
      return true;
    } else {
      return false;
    }
  }
}
