import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, 'dist');
const destDir = path.resolve(__dirname, '../backend/src/main/resources/static');

async function removeOldIndexFiles() {
  const assetsDir = path.join(destDir, 'assets');

  try {
    const files = await fs.readdir(assetsDir);

    for (const file of files) {
      if (file.startsWith('index-') && (file.endsWith('.js') || file.endsWith('.css'))) {
        await fs.remove(path.join(assetsDir, file));
        console.log(`Removed old file: ${file}`);
      }
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error while removing old index files:', err);
    }
  }
}

async function copyBuildFiles() {
  try {
    // 기존 index-*.js, css 파일 삭제
    await removeOldIndexFiles();

    // index.html 복사
    await fs.copy(path.join(srcDir, 'index.html'), path.join(destDir, 'index.html'), { overwrite: true });

    // assets 디렉토리 복사
    await fs.copy(path.join(srcDir, 'assets'), path.join(destDir, 'assets'), { overwrite: true });

    console.log('Build files selectively copied to backend resources successfully!');
  } catch (err) {
    console.error('Error while copying build files:', err);
  }
}

copyBuildFiles();