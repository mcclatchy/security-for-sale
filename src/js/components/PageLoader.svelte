<script>
  import { isMobile } from '../modules/utils.js';

  export let desktopSize = 120
  export let mobileSize = 120;
  export let color = "#D93A4C";
  export let backgroundColor = "none"
  export let displayText = true
  export let left = 0;
  export let shadow = false;
  export let loaderBackgroundColor = "none";
  export let position = "fixed";
  export let width = "190px";
  export let loaderShadow = false;
  export let softShadow = false;
  export let assetPath;
  export let opacity = 1;

  $: bottomBuffer = `calc(60% - ${isMobile.any() ? mobileSize * .75 : desktopSize * .75}px)`;

  let hide = false;
  

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  async function pauseThenHide() {
    await delay(2000);
    hide = true;
  }


  $: if (opacity === 0) {
    pauseThenHide();
  } else {
    hide = false;
  }

</script>

{#if !hide}
  <div class="loader-container" style={`opacity: ${opacity};`}>
    <img
      class="gear-2"
      alt=""
      src={`${assetPath}/loader_gear_2.png`}
      width={`${isMobile.any() ? mobileSize / 2 : desktopSize / 2}px;`}
      height={`${isMobile.any() ? mobileSize / 2 : desktopSize / 2}px;`}
      style={`
        left: calc(50% - ${mobileSize * .3125}px - ${mobileSize * .3125 * 1.39}px);
        bottom: ${bottomBuffer};
      `}
    >
    <img
      class="gear-1"
      alt=""
      src={`${assetPath}/loader_gear_1.png`}
      width={`${isMobile.any() ? mobileSize : desktopSize}px;`}
      height={`${isMobile.any() ? mobileSize : desktopSize}px;`}
      style={`
        left: calc(50% - ${mobileSize * .3125}px);
        bottom: ${bottomBuffer};
      `}
    >
    {#if displayText}
      <div class="loader-text" style={`
        color: ${color};
        bottom: calc(${bottomBuffer} - ${isMobile.any() ? mobileSize / 2 : desktopSize / 2}px);
      `}>
        <span class="loading">Loading</span>
      </div>
    {/if}
  </div>
{/if}


<style>
  /* SOURCE: https://stackoverflow.com/questions/13014808/is-there-anyway-to-animate-an-ellipsis-with-css-animations*/
.loading:after {
  content: "...";
  overflow: hidden;
  display: inline-block;
  vertical-align: bottom;
  animation: ellipsis-dot 2s infinite .3s;
  animation-fill-mode: forwards;
  width: 1.25em;
}

@keyframes ellipsis-dot {
  25% {
    content: "";
  }
  50% {
    content: ".";
  }
  75% {
    content: "..";
  }
  100% {
    content: "...";
  }
}

.loader-container {
  transition: opacity 1s;
  -webkit-transition: opacity 1s;
  height: 100vh;
  width:  100vw;
  position: fixed;
  z-index: 1000000;
  background: #ffffffDD; 
  pointer-events: none;
}
.loader-text {
	padding-bottom: 20px;
	font-family: "News Cycle", sans-serif;
	font-size: 16px;
	font-weight: 700;
	text-transform: uppercase;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  pointer-events: all;
}

.gear-1 {
  border-radius: 50%;
  animation: clockwise 8s linear infinite;
  margin: 0 auto;
  position: absolute;
  transform: translate(-50%, -100%);
}
.gear-2 {
  border-radius: 50%;
  animation: counterclockwise 5s linear infinite;
  margin: 0 auto;
  position: absolute;
}

.loader-shadow {
  filter: drop-shadow( 3px 3px 25px rgba(255, 255, 255, 1))
    drop-shadow( -3px -10px 25px rgba(255, 255, 255, 1))
}

@keyframes clockwise {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes counterclockwise {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
}

@media only screen and (max-width: 600px) {
  .loader-text  { 
    font-size: 14px;
  }
}
</style>