<script>
  import throttle from 'underscore/modules/throttle';

  import { onMount } from 'svelte'
  import { isMobile, isTablet, amlToHTML } from '../modules/utils.js'
  import { windowWidth, windowHeight, storeInnerHeight, storeOuterHeight, isPortrait } from '../modules/store.js';
  // textOffset & seconds help dictate the location & timing of the appearing text
  // textOffset = window.innerHeight        seconds = 0 ---> top of scroll-box will be at the bottom of the screen at 0 seconds
  // textOffset = window.innerHeight / 2    seconds = 0 ---> top of scroll-box will be at the middle of the screen at 0 seconds

  export let videoData;
  export let scrollingText;
  export let removeBreaks = false;
  export let scrollY;
  export let progress;
  export let shouldParallaxText = false;
  
  
  function getAttribute(attr, textStyles, videoStyles, defaultValue) {
    if (textStyles.hasOwnProperty(attr)) {
      return textStyles[attr];
    }
    if (videoStyles.hasOwnProperty(attr)) {
      return videoStyles[attr];
    }
    return defaultValue;
  }

  $: stylePrefix = $isPortrait ? "portrait" : "landscape";
  $: videoStyles = stylePrefix && videoData[stylePrefix];
  $: textStyles = stylePrefix && scrollingText[stylePrefix];

  $: fontSize = getAttribute("fontSize", textStyles, videoStyles, 20);
  $: fontColor = getAttribute("fontColor", textStyles, videoStyles, "black");
  $: lineHeight = 1.5
  $: backgroundColor = getAttribute("backgroundColor", textStyles, videoStyles, "white");
  $: borderColor = getAttribute("borderColor", textStyles, videoStyles, "black");
  $: borderWidth = getAttribute("borderWidth", textStyles, videoStyles, 1);
  $: horizontalPosition = getAttribute("horizontalPosition", textStyles, videoStyles, "center");
  $: boxWidth = getAttribute("boxWidth", textStyles, videoStyles, 600);
  $: left = getAttribute("left", textStyles, videoStyles, "0%");
  $: width = getAttribute("width", textStyles, videoStyles, "100%");

  $: seconds = $isPortrait ? scrollingText.portraitSeconds : scrollingText.seconds;
  $: endSeconds = shouldParallaxText && $isPortrait ? scrollingText.portraitEndSeconds : scrollingText.endSeconds;

  $: duration = videoData[stylePrefix].duration;
  $: height = videoData[stylePrefix].height;
  $: offsetHeight = $windowHeight;

  $: startPixel = (duration && height && offsetHeight) && Math.round(offsetHeight + (height) * (seconds / duration));
  $: endPixel = shouldParallaxText && (duration && height && offsetHeight) && Math.round(offsetHeight + (height) * (endSeconds / duration));

  let pctLimit = 1.1
  $: opacity = shouldParallaxText && topPct > pctLimit ? 0 : 1

  let top;
  let topPct;
  let topPctShift;
  let topPixel;
  let progressPixel;

  $: progressPixel = shouldParallaxText && Math.round(offsetHeight + (height) * (progress));
  $: topPct = shouldParallaxText && Math.round((progressPixel - startPixel) /  (endPixel - startPixel) * 1000) / 1000;
  $: position = endPixel ? "absolute" : "absolute";

  let throttledParallaxShift;
  const updateParallaxShift = throttle(val => {
    topPctShift = topPct >= pctLimit ? pctLimit : topPct
    throttledParallaxShift = Math.round(topPctShift * ((endPixel - startPixel)) - topPctShift * ($windowHeight));;
  }, 0);
  $: shouldParallaxText && updateParallaxShift(progressPixel)

</script>

<div
  class={`scroll-box`}
  style={`
    top: ${startPixel}px;
    transition: transform .01s ease-in-out;
    transform: translate3d(0, ${shouldParallaxText ? throttledParallaxShift : 0}px, 0);
    position: ${position};
    max-width: min(100%, ${boxWidth}px) !important;
    width: ${width};
    left: ${left};
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
        opacity: ${opacity};
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
    font-weight: 400;
    margin: 0 !important;
    font-family:  'Libre Franklin';
    transition: opacity .25s ease-in-out;
    -moz-transition: opacity .25s ease-in-out;
    -webkit-transition: opacity .25s ease-in-out;
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