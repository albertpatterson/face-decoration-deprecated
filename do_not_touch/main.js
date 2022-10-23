import { getExampleVideo, getCameraVideo } from './camera';
import { getModel } from './model';
import {
  initiateVideoAndCanvas,
  takepictures,
  sizeVideoAndCanvas,
} from './draw';
import { config } from '../edit/config';

const canvas = document.getElementById('decoration-canvas');

const decoration = document.getElementById('decoration');
decoration.src = config.imgSrc;

window.launchCamera = async function () {
  const exampleVideo = await getExampleVideo();
  exampleVideo.pause();

  const cameraVideo = await getCameraVideo();
  await initiateVideoAndCanvas(cameraVideo, canvas);
  const model = await getModel();
  takepictures(cameraVideo, canvas, model);
  clearLaunchButton();
};

getModel();

(async () => {
  const model = await getModel();
  const exampleImg = document.getElementById('example');
  const testCanvas = document.getElementById('test-canvas');
  const loadingTestCanvas = document.getElementById('loading-test-canvas');
  testCanvas.height = exampleImg.height;
  testCanvas.width = exampleImg.width;
  takepictures(exampleImg, testCanvas, model, false, true);
  loadingTestCanvas.parentElement.removeChild(loadingTestCanvas);
  testCanvas.style.display = 'flex';

  startVideo();
})();

async function startVideo() {
  startLoading();

  const video = await getExampleVideo();

  window.addEventListener('resize', () => sizeVideoAndCanvas(video, canvas));
  await initiateVideoAndCanvas(video, canvas);

  const model = await getModel();

  clearLoading();
  showLaunchButton();
  takepictures(video, canvas, model);
}

let extraLoadingInfoTimeout = null;
function startLoading() {
  extraLoadingInfoTimeout = setTimeout(() => {
    document.getElementById('extra-loading-info').style.display = 'block';
  }, 10e3);
}

function showLaunchButton() {
  const launchButton = document.getElementById('launch-button');
  launchButton.style.display = 'block';
}

function clearLaunchButton() {
  const launchButton = document.getElementById('launch-button');
  launchButton.style.display = 'none';
}

function clearLoading() {
  clearTimeout(extraLoadingInfoTimeout);
  const loadingIndicator = document.getElementById('loading-indicator');
  loadingIndicator.parentElement.removeChild(loadingIndicator);
}
