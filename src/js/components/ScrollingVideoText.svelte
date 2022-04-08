<script>
  import { onMount } from 'svelte'
  import { isMobile, isTablet, amlToHTML } from '../modules/utils.js'
  import { windowWidth, windowHeight, storeInnerHeight, isPortrait } from '../modules/store.js';
  // textOffset & seconds help dictate the location & timing of the appearing text
  // textOffset = window.innerHeight        seconds = 0 ---> top of scroll-box will be at the bottom of the screen at 0 seconds
  // textOffset = window.innerHeight / 2    seconds = 0 ---> top of scroll-box will be at the middle of the screen at 0 seconds

  export let videoData;
  export let scrollingText;
  export let removeBreaks = false;
  
  
  function getAttribute(attr, text, video, defaultValue) {
    if (scrollingText.hasOwnProperty(attr)) {
      return scrollingText[attr];
    }
    if (videoData.hasOwnProperty(attr)) {
      return videoData[attr];
    }
    return defaultValue;
  }

  let fontSize = getAttribute("fontSize", scrollingText, videoData, 20)
  let fontColor = getAttribute("fontColor", scrollingText, videoData, "black")
  let lineHeight = 1.5
  let backgroundColor = getAttribute("backgroundColor", scrollingText, videoData, "white")
  let borderColor = getAttribute("borderColor", scrollingText, videoData, "black")
  let borderWidth = getAttribute("borderWidth", scrollingText, videoData, 1)
  let horizontalPosition = getAttribute("horizontalPosition", scrollingText, videoData, "center")
  let boxWidth = getAttribute("boxWidth", scrollingText, videoData, 600)


  
  let seconds;
  let duration;
  let height;

  $: offsetHeight = isTablet.ipad() && $isPortrait ? $storeInnerHeight : $windowHeight

</script>

<div
  class={`scroll-box ${horizontalPosition}`}
  style={`
    top: ${offsetHeight + (videoData.height) * (scrollingText.seconds / videoData.duration)}px;
    max-width: min(100%, ${boxWidth}px) !important;
    width: fit-content;
  `}
>
  {#if scrollingText?.text}
    <div class="scroll-text" style={`
      border-color: ${borderColor};
      border-width: ${borderWidth}px;
      background: ${backgroundColor};
    `}
      >
      <p class="text" style={`
        font-size: ${fontSize}px;
        color: ${fontColor};
        line-height: ${lineHeight};
      `}>
        <span>
          {@html amlToHTML(scrollingText.text, removeBreaks)}
        </span>
      </p>
    </div>
  {/if}
</div>

<style>
  .scroll-box {
    height: 1px;
    position: absolute;
    display: flex;
    display: -webkit-flex;
    align-items: flex-end;
    -webkit-align-items: flex-end;
    z-index: 1000;
  }

  .scroll-text {
    transform: translate(0%, 100%);
    pointer-events: all;
    border-style: solid;
    padding: 20px;
  }

  .scroll-text p {
    margin: 0 !important;
    font-family:  'Libre Franklin';
  }

  .subtext {
    margin-top: 30px;
  }

  .left {
    left: 0;
    transform: translate(0%, 0);
    max-width: 100%;
    padding-left: 5%;
  }

  .right {
    right: 0;
    transform: translate(0%, 0);
    max-width: 100%;
    padding-right: 5%;
  }

  .center {
    left: 50%;
    transform: translate(-50%, 0);
    max-width: 100%;
  }

  @media only screen and (max-width: 600px) {
    .scroll-box {
      margin: 0;
      padding-left: 0;
    }
    .scroll-text {
      margin: 10px;
    }
    .scroll-text p {
      padding: 0 10px;
    }
    .subtext {
      margin-top: unset;
    }
  }
</style>