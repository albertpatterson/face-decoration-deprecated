let model = null;
getModel();

let launched = false;
async function launchCamera() {
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
}

async function getVideoStream() {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: {
          exact: 'environment',
        },
      },
      audio: false,
    });
  } catch {
    return await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
  }
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
  const vWidth = video.videoWidth;
  const vHeight = video.videoHeight;

  const aspectRatio = vHeight / vWidth;

  const width = Math.min(vWidth, window.innerWidth);
  const height = width * aspectRatio;
  const scale = width / vWidth;

  return { height, width, scale };
}

async function takepictures(video, canvas, model) {
  const context = canvas.getContext('2d');

  const { height, width, scale } = getCanvasSize(video);
  const faces = await getPredictions(video, model);

  context.drawImage(video, 0, 0, width, height);
  drawOnFace(context, faces[0], scale);

  setTimeout(() => {
    takepictures(video, canvas, model, false);
  }, 100);
}

async function getPredictions(video, model) {
  const estimationConfig = { flipHorizontal: false };
  const faces = await model.estimateFaces(video, estimationConfig);
  return faces;
}

const sillyLips = document.getElementById('silly-lips');
const sunglasses = document.getElementById('sunglasses');
const sillySmile = document.getElementById('silly-smile');

function drawOnFace(context, face, scale) {
  if (!face) {
    return;
  }

  const smileBBox = getSmileBBox(face);

  context.drawImage(
    sillySmile,
    smileBBox.x,
    smileBBox.y,
    smileBBox.width,
    smileBBox.height
  );

  const sunglassesBBox = getSunglassesBBox(face);

  context.drawImage(
    sunglasses,
    sunglassesBBox.x,
    sunglassesBBox.y,
    sunglassesBBox.width,
    sunglassesBBox.height
  );
}

function getSunglassesBBox(face) {
  const leftEye = getfacePoint(face, 'leftEye');
  const rightEye = getfacePoint(face, 'rightEye');
  const rawWidth = rightEye.x - leftEye.x;
  const width = 2.5 * rawWidth;
  const offset = 0.5 * (width - rawWidth);

  const x = leftEye.x - offset;
  const y = leftEye.y - 20;
  const height = 40;

  return { x, y, height, width };
}

function getLipsBBox(face) {
  const leftEye = getfacePoint(face, 'leftEye');
  const rightEye = getfacePoint(face, 'rightEye');
  const mouthCenter = getfacePoint(face, 'mouthCenter');
  const rawWidth = rightEye.x - leftEye.x;
  const width = 1.25 * rawWidth;
  const offset = 0.5 * (width - rawWidth);

  const x = leftEye.x - offset;
  const y = mouthCenter.y - 20;
  const height = 40;

  return { x, y, height, width };
}

function getSmileBBox(face) {
  const leftEye = getfacePoint(face, 'leftEye');
  const rightEye = getfacePoint(face, 'rightEye');
  const mouthCenter = getfacePoint(face, 'mouthCenter');
  const rawWidth = rightEye.x - leftEye.x;
  const width = 1.25 * rawWidth;
  const offset = 0.5 * (width - rawWidth);

  const x = leftEye.x - offset;
  const y = mouthCenter.y - 20;
  const height = 40;

  return { x, y, height, width };
}

function getfacePoint(face, name) {
  const part = face.keypoints.find((keypoint) => keypoint.name === name);
  if (!part) {
    throw new Error(`part named "${name} not found`);
  }

  return part;
}

function drawPoint(context, x, y) {
  context.fillRect(x, y, 10, 10);
}

async function getModel() {
  if (model) {
    return model;
  }

  const factory = faceDetection.SupportedModels.MediaPipeFaceDetector;
  const detectorConfig = {
    runtime: 'tfjs',
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
