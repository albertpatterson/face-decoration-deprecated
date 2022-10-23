import { config } from '../edit/config';

export async function getVideoStream() {
  return await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
}

const wrapper = document.getElementById('video-wrapper');

export async function getCameraVideo() {
  const video = document.getElementById('video-user');
  const stream = await getVideoStream();
  video.srcObject = stream;
  video.style.display = 'inline';
  wrapper.appendChild(video);

  return video;
}

export async function getExampleVideo() {
  const video = document.getElementById('video-demo');
  video.style.display = 'inline';
  return video;
}
