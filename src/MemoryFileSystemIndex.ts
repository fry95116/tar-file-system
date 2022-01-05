import { FileSystemIndex } from './type';

export class MemoryFileSystemIndex implements FileSystemIndex {
  dict: Record<string, number> = {};
  setEntry(name: string, offset: number) {
    this.dict[name] = offset;
  }

  getEntry(name: string) {
    return this.dict[name] ?? -1;
  }

  list() {
    return Object.keys(this.dict);
  }

  // scan(
  //   onEntry?: (entry: { name: string; offset: number }) => void,
  //   onEnd?: () => void
  // ) {

  // }
}
