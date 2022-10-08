import fs from 'fs-extra';
import { simpleGit } from 'simple-git';
const git = simpleGit();

console.log('Cloning the image capture app from the MDN repositor on Github');

(async () => {
  await git.clone('https://github.com/mdn/samples-server.git', 'temp');
  await fs.copy('temp/s/webrtc-capturestill/', 'public/');
  await fs.rm('temp', { recursive: true, force: true });
})();