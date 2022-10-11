import { getBBox } from '../edit/get_bbox';
import { drawFacePoints } from './util';
let model = null;

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

async function getVideoStream() {
  return await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
}

function initiateVideoAndCanvas(video, canvas) {
  const done = new Promise((res) => {
    const handler = () => {
      const { height, width } = getCanvasSize(video);
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);

      const context = canvas.getContext('2d');
      context.font = '36px serif';
      context.fontWeight = 'bold';
      context.strokeStyle = 'green';
      context.fillStyle = 'green';
      context.lineWidth = 5;

      video.removeEventListener('canplay', handler, false);
      res();
    };

    video.addEventListener('canplay', handler, false);
  });

  video.play();

  return done;
}

function getCanvasSize(video) {
  const vWidth = video.videoWidth ?? video.width;
  const vHeight = video.videoHeight ?? video.height;

  const aspectRatio = vHeight / vWidth;

  const width = Math.min(vWidth, window.innerWidth);
  const height = width * aspectRatio;
  const scale = width / vWidth;

  return { height, width, scale };
}

async function takepictures(
  video,
  canvas,
  model,
  stream = true,
  markKeypoints = false
) {
  const context = canvas.getContext('2d');

  const { height, width, scale } = getCanvasSize(video);
  const faces = await getPredictions(video, model);

  context.drawImage(video, 0, 0, width, height);
  for (const face of faces) {
    drawOnFace(context, face, scale);
  }

  if (markKeypoints) {
    for (const face of faces) {
      drawFacePoints(context, face);
    }
  }

  if (stream) {
    requestAnimationFrame(() => {
      takepictures(video, canvas, model, stream, markKeypoints);
    });
  }
}

async function getPredictions(video, model) {
  const estimationConfig = { flipHorizontal: false };
  const faces = await model.estimateFaces(video, estimationConfig);
  return faces;
}

const decoration = document.getElementById('decoration');

function drawOnFace(context, face, scale) {
  if (!face) {
    return;
  }

  const bBox = getBBox(face);

  context.drawImage(decoration, bBox.x, bBox.y, bBox.width, bBox.height);
}

async function getModel() {
  if (model) {
    return model;
  }

  const factory = faceDetection.SupportedModels.MediaPipeFaceDetector;
  const detectorConfig = {
    runtime: 'tfjs',
    maxFaces: 10,
  };
  model = await faceDetection.createDetector(factory, detectorConfig);
  return model;
}

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
