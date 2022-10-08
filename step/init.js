import fs from 'fs-extra';
import path from 'path';


console.log('Cleaning up any previous solution');

const solutionItems = ['.firebaserc', 'firebase.json', 'public'];

(async () => {
  const slnName = createSlnName()

  for (const item of solutionItems) {
    moveIfExists(item, slnName);
  }

})()


function createSlnName() {
  return 'solution ' + Date.now();
}

async function moveIfExists(target, dest) {
  const exists = await fs.pathExists(target);
  if (exists) {
    await fs.move(target, path.join(dest, target))
  }
}