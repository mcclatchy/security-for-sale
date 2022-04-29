<script>
  import { onMount } from 'svelte';
  import { isMobile, isTablet } from '../modules/utils.js';
  import { windowWidth, windowHeight, isFirstVideoLoaded, isPortrait } from '../modules/store.js';
  import { enableScroll } from '../modules/scroll';
  import Loader from './Loader.svelte'

  export let videoData;
  export let scrollY = 0;
  export let offset = 0;
  export let width = "100%";
  export let isFirstVideo = false;;
  export let assetPath;
  export let videoPath;
  export let objectFit = "cover";
  export let position = "absolute";
  export let loaderEnabled = true
  export let zIndexVideo = 0;
  export let videoFinished = false;

  let video;
  let isActive = false;
  let time = 0;
  let hasUserInteractedOnMobile = false;
  let videoLoaded = false;
  let buffered;
  let isBuffered = false;
  let duration;
  let height;

  let wideDesktopBreakpoint = 1200;

  onMount(() => {
    if (isMobile.any()) {
      const userTouchedScreen = () => {
        hasUserInteractedOnMobile = true;
        document.body.removeEventListener('touchstart', userTouchedScreen);
      };
      document.body.addEventListener('touchstart', userTouchedScreen);
    }

    video.addEventListener('loadedmetadata', (event) => {
      videoLoaded = true;
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

  $: config = $isPortrait ? videoData.portrait : videoData.landscape
  $: duration = config.duration;
  $: height = config.height;
  $: filepath = `${videoPath}/${config.filename}`;
  $: posterFilepath = `${assetPath}/${config.posterFilename}`;

  $: if (isActive && video && buffered && time <= duration) {
    let bufferedLen = video.buffered.length;
    while (bufferedLen--)
    {
      let buffStart = video.buffered.start(bufferedLen)
      let buffEnd   = video.buffered.end((bufferedLen));
      if (time >= buffStart && time <= buffEnd)
      {
        isBuffered = true;
        break;
      } else {
        isBuffered  = false;
      }
    }
  }

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
      video.currentTime = time;
      videoFinished = false;
    } else {
      videoFinished = true;
    }
  }

</script>

<!-- HTML5 Videos -->
<div
  class="video-container"
  style={`opacity: ${isActive ? 1 : 1}`}
>
  {#if isFirstVideo && isMobile.any()}
    <img
      alt=""
      style={`visibility: ${
        videoLoaded && hasUserInteractedOnMobile ? 'hidden' : 'visible'
      }; object-fit: ${objectFit}; position: ${position};`}
      src={posterFilepath}
    />
  {/if}

  <video
    bind:this={video}
    bind:buffered
    id={videoData.id}
    preload="metadata"
    muted="true"
    playsinline="true"
    autoplay="true"
    poster={posterFilepath}
    src={filepath}
    type="video/mp4"
    style={`
      width: ${width};
      opacity: ${isActive ? 1 : 1};
      object-fit: ${objectFit};
      position: ${position};
      z-index: ${zIndexVideo};
    `}
  />

  {#if loaderEnabled && isActive && !isBuffered && $isFirstVideoLoaded && scrollY > 0 && scrollY < (offset + height)}
    <div class="outer-loader-container" style={`width: ${width}; position: ${position}`}> 
      <Loader
        desktopSize={100}
        mobileSize={100}
        color="#D93A4C"
        displayText={false}
        position="relative"
        width="100%"
        loaderShadow={true}
      />
    </div>
  {/if}
</div>

<!-- WARNING: this is only for debugging - don't deploy this actively -->
<!-- <p class="debug" style={`opacity: ${isActive ? 1 : 0}`}>
  {videoData?.id}
  <br />
  {Math.round(time * 100) / 100 < duration ? Math.round(time * 100) / 100 : duration}
</p> -->

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
    margin: 0 !important;

    text-align: right;
    position: fixed;
    bottom: 0;
    right: 0;
    font-size: 30px;
    padding-right: 20px;
    color: black;
    background-color: white;
    z-index: 1000000000000;
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
