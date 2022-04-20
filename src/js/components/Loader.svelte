<script>
  import { isMobile } from '../modules/utils.js';

  export let desktopSize = 40
  export let mobileSize = 25;
  export let color = "#b87a68"
  export let backgroundColor = "none"
  export let displayText = true
  export let bottom = 0;
  export let left = 0;
  export let shadow = false;
  export let loaderBackgroundColor = "#eee";
  export let position = "absolute";
  export let width = "190px";
  export let loaderShadow = true;
  export let softShadow = true;

</script>

<div class="loader-container" class:heavy-shadowed={shadow} class:soft-shadowed={softShadow}  style={`
  bottom: ${bottom};
  left: ${left};
  transform: translate(-${left}, 0);
  background: ${backgroundColor};
  position: ${position};
  height: 90px;
  width: ${width};
`}>
  {#if displayText}
    <div class="loader-text" style={`color: ${color};`}>Loading...</div>
  {/if}
  <div class="loader" class:loader-shadow={loaderShadow} style={`
    width: ${isMobile ? mobileSize : desktopSize}px;
    height: ${isMobile ? mobileSize : desktopSize}px;
    border: 3px solid ${loaderBackgroundColor};
    border-top: 3px solid ${color};
  `}/>
</div>

<style>
.loader-container {
  height: 92px;
  text-align: center;
  padding: 5px 30px 10px 30px;
}
.loader-text {
	padding-bottom: 10px;
	font-family:  "News Cycle";
	font-size: 14px;
	font-weight: 700;
	text-transform: uppercase;
}
.loader {
  border-radius: 50%;
  animation: spin 2s linear infinite;
  margin: 0 auto;
}

.loader-shadow {
  filter: drop-shadow( 3px 3px 25px rgba(255, 255, 255, 1))
    drop-shadow( -3px -10px 25px rgba(255, 255, 255, 1))
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media only screen and (max-width: 600px) {
  .loader-container {
    height: 89px;
    bottom: 15vh;
    padding: 0 !important;
  }
  .loader-text  { 
    font-size: 12px;
  }
}
</style>