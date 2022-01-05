export * from './MemoryFileSystemIndex';
export * from './type';
export * from './TarFileSystem';

// export async function main() {
//   const tfs = new TarFileSystem({ filePath: './testData/tar_packed.tar' });
//   await tfs.init();

//   const fileEntry = await tfs.read(
//     'tar_extracted/1020_eac9a5a2e6/thumbnail.jpg'
//   );

//   console.log(fileEntry?.header);
//   const ws = fs.createWriteStream('./thumbnail.jpg');
//   fileEntry?.stream.pipe(ws);
// }

// export function add(a: number, b: number) {
//   return a + b;
// }
// main();
