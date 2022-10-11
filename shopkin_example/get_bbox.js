import { getFacePoint } from '../do_not_touch/util';

export function getBBox(face) {
  const leftEar = getFacePoint(face, 'leftEarTragion');
  const rightEar = getFacePoint(face, 'rightEarTragion');
  const rawWidth = leftEar.x - rightEar.x;
  const width = 1.75 * rawWidth;
  const offset = 0.5 * (width - rawWidth);

  const x = rightEar.x - offset;
  const y = rightEar.y - 0.6 * width;
  const height = width;

  const bbox = { x, y, height, width };
  console.log(bbox);

  return bbox;
}
