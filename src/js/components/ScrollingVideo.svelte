<script>
  import { onMount } from 'svelte';
  import { isMobile, isTablet, roundNum } from '../modules/utils.js';
  import { windowWidth, windowHeight, isFirstVideoLoaded, isPortrait } from '../modules/store.js';
  import Loader from './Loader.svelte'

  export let scrollY = 0;
  export let offset = 0;
  export let isFirstVideo = false;
  export let videoNode;
  export let duration = 0;
  export let height = 0;

  let frameRate = 30;
  let pixelsPerFrame = 20;

  let video;
  let isActive = false;
  let time = 0;
  let hasUserInteractedOnMobile = false;
  let videoLoaded = false;
  let buffered;
  let isBuffered = false;

  let wideDesktopBreakpoint = 1200;

  onMount(() => {
    document.getElementById('video-container').appendChild(videoNode);
    video = videoNode

    if (isMobile.any()) {
      const userTouchedScreen = () => {
        hasUserInteractedOnMobile = true;
        document.body.removeEventListener('touchstart', userTouchedScreen);
      };
      document.body.addEventListener('touchstart', userTouchedScreen);
    }

    video.addEventListener('loadedmetadata', (event) => {
      videoLoaded = true;
        duration = videoNode.duration
        height = duration * frameRate * pixelsPerFrame;
        video.pause();
        video.currentTime = 0;
        if (isMobile.any()) {
          const touchstartPlay = async () => {
            await video.play();
            video.pause();
            document.body.removeEventListener('touchstart', touchstartPlay);
          };
          document.body.addEventListener('touchstart', touchstartPlay);
        }
        if (video) {
          video.pause();
        }
    });

    if (isFirstVideo) {
      video.addEventListener('loadeddata', (event) => {
        setTimeout(() => { isFirstVideoLoaded.set(true); }, 1000);
      });
    }
  });

  // Split block reactive statement into two clean if statements
  $: if (
    scrollY >= offset &&
    scrollY < offset + height + $windowHeight
  ) {
    isActive = true;
  } else if (scrollY >= 0) {
    isActive = false;
  }

  $: if (isActive && videoLoaded) {
    // HTML5 video time updater
    const offsetScrollY = scrollY - offset;
    time = duration * offsetScrollY / height;
    if (time <= duration) {
      video.currentTime = roundNum(time, 2);
    }
  }

    


</script>

<!-- HTML5 Videos -->
<div
  class="video-container"
  id="video-container"
  style={`opacity: ${isActive ? 1 : 1}`}
>


</div>

<!-- WARNING: this is only for debugging - don't deploy this actively -->
<p class="debug" style={`opacity: ${isActive ? 1 : 0}; margin: 0;`}>
  time: {Math.round(time * 100) / 100 < duration ? Math.round(time * 100) / 100 : duration}
</p>

<style>
  .outer-loader-container {
    height: 100%;
    position: fixed;
    top: 0;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    z-index: 5;
  }

  .debug {
    text-align: right;
    position: fixed;
    top: 0;
    left: 0;
    font-size: 20px;
    padding: 10px;
    color: black;
    background-color: white;
    z-index: 1000000;
  }

  .video-container {
    height: 100%;
    width: 100%;
    margin-right: 0;
    margin-left: 0;
    opacity: 0.7;
    transition: opacity 400ms ease-out;
  }

  .video-container img {
    top: 0;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    pointer-events: none;
    visibility: visible;
    z-index: 2;
  }

  .video-container video {
    top: 0;
    height: 100%;
    box-sizing: border-box;
    pointer-events: none;
  }

  @media only screen and (max-width: 1120px) {
    .video-container {
      height: 100%;
      top: 0;
      transform: none;
      width: 100%;
    }
    .debug {
      font-size: 12px;
    }
  }
</style>
