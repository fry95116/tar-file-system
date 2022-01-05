import tar from './libs/custom-tar-stream';
import fs from 'fs';
// @ts-ignore
import ReadStream from 'fs-readstream-seek';
import stream from 'stream';

import { MemoryFileSystemIndex } from './MemoryFileSystemIndex';
import { FileSystemIndex } from './type';

export class TarFileSystem {
  fileSystemIndex: FileSystemIndex;
  filePath: string;
  constructor(opt: { filePath: string; index?: FileSystemIndex }) {
    this.filePath = opt.filePath;
    this.fileSystemIndex = opt.index || new MemoryFileSystemIndex();
  }

  init() {
    // TODO: reset index
    const rs = fs.createReadStream(this.filePath);
    const a = tar.extract();
    a.on('entry', ({ header, stream, offset, next }) => {
      console.log('scan entry', header.name, offset);
      this.fileSystemIndex.setEntry(header.name, offset);
      stream.once('end', next);
      stream.resume();
    });
    const ret = new Promise<void>((resolve) => {
      rs.on('end', () => {
        console.log('end');
        resolve();
      });
    });
    rs.pipe(a);
    return ret;
  }

  async read(name: string) {
    const s = new ReadStream(this.filePath);
    const offset = this.fileSystemIndex.getEntry(name);
    if (offset === -1) {
      return null;
    }
    if (offset > 0) {
      s.seek(offset);
    }

    // build tar extractor
    const a = tar.extract();

    const ret = new Promise<{
      header: tar.Headers;
      offset: number;
      headerSize: number;
      stream: stream.PassThrough;
    }>((resolve) => {
      a.once('entry', resolve);
    });

    s.pipe(a);
    return ret;
  }

  // async write(name: string) {

  // }
}
