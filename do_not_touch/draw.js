import { getBBox } from '../edit/get_bbox';
import { drawFacePoints } from './util';
import { getPredictions } from './model';

export function initiateVideoAndCanvas(video, canvas) {
  const done = new Promise((res) => {
    const handler = () => {
      sizeVideoAndCanvas(video, canvas);

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

export function sizeVideoAndCanvas(video, canvas) {
  const { height, width } = getCanvasSize(video);
  video.setAttribute('width', width);
  video.setAttribute('height', height);
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
}

export function getCanvasSize(video) {
  const vWidth = video.videoWidth ?? video.width;
  const vHeight = video.videoHeight ?? video.height;

  const aspectRatio = vHeight / vWidth;

  const width = Math.min(vWidth, window.innerWidth);
  const height = width * aspectRatio;
  const scale = width / vWidth;

  return { height, width, scale };
}

export async function takepictures(
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

const decoration = document.getElementById('decoration');

function drawOnFace(context, face, scale) {
  if (!face) {
    return;
  }

  const bBox = getBBox(face);

  context.drawImage(decoration, bBox.x, bBox.y, bBox.width, bBox.height);
}
