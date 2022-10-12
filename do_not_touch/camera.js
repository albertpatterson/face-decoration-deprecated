export async function getVideoStream() {
  return await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
}
