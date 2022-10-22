import { getFacePoint, getAngle } from '../do_not_touch/util';

// When looking face to face at a person, they are facing
// in the opposite direction from you, so their right side
// is on your left, the face keypoints from your
// perspective are arranged as follows
//
//                rightEye   leftEye
// rightEarTragion    noseTip    leftEarTragion
//                  mouthCenter

export function getDrawProps(face) {
  const leftEye = getFacePoint(face, 'leftEye');
  const rightEye = getFacePoint(face, 'rightEye');
  const rawWidth = leftEye.x - rightEye.x;
  const width = 2.5 * rawWidth;

  const xCenter = (rightEye.x + leftEye.x) / 2;
  const yCenter = (rightEye.y + leftEye.y) / 2;
  const height = width / 3;
  const eyeXDistance = rawWidth;
  const eyeYDistance = leftEye.y - rightEye.y;

  const angle = getAngle(eyeXDistance, eyeYDistance);

  return { xCenter, yCenter, width, height, angle };
}
