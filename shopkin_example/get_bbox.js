import { getFacePoint } from '../do_not_touch/util';

// When looking face to face at a person, they are facing
// in the opposite direction from you, so their right side
// is on your left, the face keypoints from your
// perspective are arranged as follows
//
//                rightEye   leftEye
// rightEarTragion    noseTip    leftEarTragion
//                  mouthCenter

export function getBBox(face) {
  const leftEar = getFacePoint(face, 'leftEarTragion');
  const rightEar = getFacePoint(face, 'rightEarTragion');
  const rawWidth = leftEar.x - rightEar.x;
  const width = 1.75 * rawWidth;
  const offset = (width - rawWidth) / 2;

  const x = rightEar.x - offset;
  const height = width;
  const y = rightEar.y - 0.6 * height;

  const bbox = { x, y, height, width };
  console.log(bbox);

  return bbox;
}
