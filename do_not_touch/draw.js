import { config } from '../edit/config';
import { drawFacePoints } from './util';
import { getPredictions } from './model';

export function initiateVideoAndCanvas(video, canvas) {
  return video.play().then(() => {
    sizeVideoAndCanvas(video, canvas);

    const context = canvas.getContext('2d');
    context.font = '36px serif';
    context.fontWeight = 'bold';
    context.strokeStyle = 'green';
    context.fillStyle = 'green';
    context.lineWidth = 5;
  });
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

  const { xCenter, yCenter, width, height, angle } = config.getDrawProps(face);
  drawImageCenter(context, decoration, xCenter, yCenter, width, height, angle);
}

function drawImageCenter(ctx, decoration, x, y, w, h, ang) {
  ctx.rotate(ang);

  const r = Math.sqrt(x ** 2 + y ** 2);
  const b = getAng(x, y);
  const xp = r * Math.cos(b - ang);
  const yp = r * Math.sin(b - ang);

  drawImageCenterBase(ctx, decoration, xp, yp, w, h);
  ctx.rotate(-ang);
}

function drawImageCenterBase(ctx, decoration, x, y, w, h) {
  const xp = x - w / 2;
  const yp = y - h / 2;

  ctx.drawImage(decoration, xp, yp, w, h);
}

function drawRectCenter(ctx, x, y, w, h, alp) {
  ctx.rotate(alp);

  const r = Math.sqrt(x ** 2 + y ** 2);
  const b = getAng(x, y);
  const xp = r * Math.cos(b - alp);
  const yp = r * Math.sin(b - alp);

  drawRectCenterBase(ctx, xp, yp, w, h);

  ctx.rotate(-alp);
}

function drawRectCenterBase(ctx, x, y, w, h) {
  const xp = x - w / 2;
  const yp = y - h / 2;

  ctx.beginPath();
  ctx.strokeStyle = 'blue';
  ctx.rect(xp, yp, w, h);
  ctx.stroke();
}

function getAng(x, y) {
  if (y === 0) {
    return 0;
  }

  if (x === 0) {
    return Math.Pi / 2;
  }

  return Math.atan(y / x);
}
