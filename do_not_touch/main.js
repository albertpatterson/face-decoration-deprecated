import {
  getExampleVideo,
  getCameraVideo,
  showExampleVideo,
  showCameraVideo,
  showScreenVideo,
} from './camera';
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
let currentVideo = null;

window.launchExample = async function () {
  await playExample();
};

window.launchCamera = async function () {
  await playCamera();
};

window.launchScreen = async function () {
  await playScreen();
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

  await playExample();

  window.addEventListener('resize', () =>
    sizeVideoAndCanvas(currentVideo, canvas)
  );

  clearLoading();
  showLaunchButton();
}

let extraLoadingInfoTimeout = null;
function startLoading() {
  extraLoadingInfoTimeout = setTimeout(() => {
    document.getElementById('extra-loading-info').style.display = 'block';
  }, 10e3);
}

function showLaunchButton() {
  const launchButtonRow = document.getElementById('view-button-row');
  launchButtonRow.style.display = 'flex';
}

function clearLoading() {
  clearTimeout(extraLoadingInfoTimeout);
  const loadingIndicator = document.getElementById('loading-indicator');
  loadingIndicator.parentElement.removeChild(loadingIndicator);
}

async function playExample() {
  const video = await showExampleVideo();
  currentVideo = video;
  await initiateVideoAndCanvas(video, canvas);
  const model = await getModel();
  takepictures(video, canvas, model);
}

async function playCamera() {
  const video = await showCameraVideo(); //update
  currentVideo = video;
  await initiateVideoAndCanvas(video, canvas);
  const model = await getModel();
  takepictures(video, canvas, model);
}

async function playScreen() {
  const video = await showScreenVideo(); //update
  currentVideo = video;
  await initiateVideoAndCanvas(video, canvas);
  const model = await getModel();
  takepictures(video, canvas, model);
}
