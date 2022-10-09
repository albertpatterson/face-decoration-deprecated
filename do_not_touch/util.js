export function getFacePoint(face, name) {
  const part = face.keypoints.find((keypoint) => keypoint.name === name);
  if (!part) {
    throw new Error(`part named "${name} not found`);
  }

  return part;
}

const pointNames = [
  'rightEye',
  'leftEye',
  'noseTip',
  'mouthCenter',
  'rightEarTragion',
  'leftEarTragion',
];

export function drawFacePoints(context, face) {
  if (!face) {
    return;
  }

  for (const keypoint of face.keypoints) {
    drawPoint(context, keypoint.x, keypoint.y);
  }
}

function drawPoint(context, x, y) {
  context.fillStyle = 'green';
  context.fillRect(x - 2, y - 2, 4, 4);
}
