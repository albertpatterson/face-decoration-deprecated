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
  const leftEye = getFacePoint(face, 'leftEye');
  const rightEye = getFacePoint(face, 'rightEye');
  const rawWidth = leftEye.x - rightEye.x;
  const width = 2.5 * rawWidth;
  const offset = (width - rawWidth) / 2;

  const x = rightEye.x - offset;
  const height = width / 3;
  const y = rightEye.y - height / 2;

  return { x, y, height, width };
}
