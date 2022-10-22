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
  const mouthCenter = getFacePoint(face, 'mouthCenter');
  const rawWidth = leftEye.x - rightEye.x;
  const width = 1.75 * rawWidth;
  const height = width / 2;
  const xCenter = mouthCenter.x;
  const yCenter = mouthCenter.y;

  const eyeXDistance = rawWidth;
  const eyeYDistance = leftEye.y - rightEye.y;

  const angle = getAngle(eyeXDistance, eyeYDistance);

  return { xCenter, yCenter, width, height, angle };
}
