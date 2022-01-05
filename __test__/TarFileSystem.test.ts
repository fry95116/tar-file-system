import { MemoryFileSystemIndex, TarFileSystem } from '../src/index';
import path from 'path';
import mkdirp from 'mkdirp';
import fs from 'fs';
import md5File from 'md5-file';

const tempReadDir = path.join(__dirname, '../temp/read');
const mockDataDir = path.join(__dirname, '../mockData');

describe('read tar fs', () => {
  beforeAll(() => {
    fs.promises.rm(tempReadDir, {
      recursive: true,
      force: true,
    });
    mkdirp(tempReadDir);
  });

  test('init', async () => {
    const index = new MemoryFileSystemIndex();
    const tfs = new TarFileSystem({
      filePath: path.join(mockDataDir, 'packed.tar'),
      index,
    });
    await tfs.init();
    expect(index.dict).toMatchInlineSnapshot(`
          Object {
            "aaa_111.jpg": 0,
            "bbb_222.jpg": 13824,
            "ccc_333.jpg": 25600,
            "ddd_444.jpg": 35328,
            "eee_555.jpg": 46592,
          }
      `);
  });

  test('read', async () => {
    const tfs = new TarFileSystem({
      filePath: path.join(mockDataDir, 'packed.tar'),
    });
    await tfs.init();

    const res = await tfs.read('ccc_333.jpg');
    expect(res).not.toBeNull();
    expect(res!.header).toMatchInlineSnapshot(`
      Object {
        "devmajor": 0,
        "devminor": 0,
        "gid": 0,
        "gname": "",
        "linkname": null,
        "mode": 33279,
        "mtime": 2022-01-05T06:53:54.000Z,
        "name": "ccc_333.jpg",
        "size": 8849,
        "type": "file",
        "uid": 0,
        "uname": "",
      }
    `);
    expect(res!.offset).toMatchInlineSnapshot(`0`);
    expect(res!.headerSize).toMatchInlineSnapshot(`512`);

    const ws = fs.createWriteStream(path.join(tempReadDir, 'ccc_333.jpg'));
    res!.stream.pipe(ws);
    await new Promise((r) => res!.stream.on('end', r));

    const srcMD5 = await md5File(path.join(mockDataDir, 'img/ccc_333.jpg'));
    const dstMD5 = await md5File(path.join(tempReadDir, 'ccc_333.jpg'));

    expect(srcMD5).toBe(dstMD5);
  });
});
