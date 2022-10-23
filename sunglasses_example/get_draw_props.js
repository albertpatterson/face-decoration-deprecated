import { getFacePoint, getAngle } from '../do_not_touch/util';

// keypoints pointed to on the face https://github.com/albertpatterson/face-decoration#keypoints-identified

// When looking face to face at a person, they are facing
// in the opposite direction from you, so their right side
// is on your left, the face keypoints from your
// perspective are arranged as follows
//
//                rightEye   leftEye
// rightEarTragion    noseTip    leftEarTragion
//                  mouthCenter

export function getDrawProps(face) {
  // face object has the properties shown at https://github.com/albertpatterson/face-decoration#keypoints-json
  // getFacePoint method helps to get the desired face point

  const leftEye = getFacePoint(face, 'leftEye');
  const rightEye = getFacePoint(face, 'rightEye');
  const leftEar = getFacePoint(face, 'leftEarTragion');
  const rightEar = getFacePoint(face, 'rightEarTragion');
  const rawWidth = leftEar.x - rightEar.x;
  const width = 2 * rawWidth;

  const xCenter = (rightEye.x + leftEye.x) / 2;
  const yCenter = (rightEye.y + leftEye.y) / 2;
  const height = width / 3;
  const earXDistance = rawWidth;
  const earYDistance = leftEar.y - rightEar.y;

  const angle = getAngle(earXDistance, earYDistance);

  // draw properties drawn on the face https://github.com/albertpatterson/face-decoration#draw-properties
  return { xCenter, yCenter, width, height, angle };
}
