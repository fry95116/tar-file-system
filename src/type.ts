export interface FileSystemIndex {
  setEntry(name: string, offset: number): void;
  getEntry(name: string): number;
}
