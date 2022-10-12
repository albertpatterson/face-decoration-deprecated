import { getVideoStream } from './camera';
import { getModel } from './model';
import {
  initiateVideoAndCanvas,
  takepictures,
  sizeVideoAndCanvas,
} from './draw';

let launched = false;
window.launchCamera = async function () {
  try {
    if (launched) {
      return;
    }
    launched = true;

    startLoading();

    const app = document.getElementById('camera-app');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');

    app.style.display = 'block';

    const stream = await getVideoStream();
    video.srcObject = stream;

    window.addEventListener('resize', () => sizeVideoAndCanvas(video, canvas));
    await initiateVideoAndCanvas(video, canvas);

    const model = await getModel();

    clearLoading();
    takepictures(video, canvas, model);
  } catch (error) {
    document.getElementById('error').innerText = error.message;
  }
};
getModel();

(async () => {
  const model = await getModel();
  const rockImg = document.getElementById('the-rock');
  const testCanvas = document.getElementById('test-canvas');
  const loadingTestCanvas = document.getElementById('loading-test-canvas');
  testCanvas.height = rockImg.height;
  testCanvas.width = rockImg.width;
  takepictures(rockImg, testCanvas, model, false, true);
  loadingTestCanvas.parentElement.removeChild(loadingTestCanvas);
  testCanvas.style.display = 'flex';
})();

let extraLoadingInfoTimeout = null;
function startLoading() {
  clearLaunchButton();
  extraLoadingInfoTimeout = setTimeout(() => {
    document.getElementById('extra-loading-info').style.display = 'block';
  }, 10e3);
}

function clearLaunchButton() {
  const launchButton = document.getElementById('launch-button');
  launchButton.parentElement.removeChild(launchButton);
}

function clearLoading() {
  clearTimeout(extraLoadingInfoTimeout);
  const loadingIndicator = document.getElementById('loading-indicator');
  loadingIndicator.parentElement.removeChild(loadingIndicator);
}
