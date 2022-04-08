<script>
  import first from 'underscore/modules/first';
  import throttle from 'underscore/modules/throttle';

	import Fonts from './Fonts.svelte';
	import MapStatewide from './MapStatewide.svelte';
	import MapTimeline from './MapTimeline.svelte';
  import ScrollytellingVideo from './ScrollytellingVideo.svelte';
  import SimpleMasthead from './SimpleMasthead.svelte';

  import { onMount } from 'svelte';
	import { isMobile, isTablet, addDataToVideoElement, getArrayItemById } from "../modules/utils.js";
	import { windowWidth, windowHeight, storeInnerHeight, storeOuterHeight, isPortrait, isIntroLoaded, isFirstVideoLoaded, initialOrientationAngle, updatedOrientationAngle, isRotated } from '../modules/store.js';

	window.addEventListener("orientationchange", function() {
		updatedOrientationAngle.set(window.orientation)
	}, false)

	// $: $isRotated && isTablet.any() && window.location.reload();

	const dataPath = import.meta.env.PROD ? `https://media.mcclatchy.com/static/2022/wall-street-landlords/data/` : "../../src/data"
	const assetPath = import.meta.env.PROD ? `https://media.mcclatchy.com/static/2022/wall-street-landlords/` : "../../"
	const videoPath = import.meta.env.PROD ? `https://www.newsobserver.com/static/hi/2022/wall-street-landlords/` : "../../"

	let innerHeight = window.innerHeight;
	let innerWidth = window.innerWidth;
	let outerHeight = window.outerHeight;
	$: storeInnerHeight.set(innerHeight);
	$: storeOuterHeight.set(outerHeight);
	$: windowHeight.set(isMobile.ios() || isTablet.ipad() ? outerHeight : innerHeight);
	$: windowWidth.set(innerWidth);

  let files;
	let scrollY = 0;
  let throttledY = 0;
  const updateScrollyY = throttle(val => {
    throttledY = val;
  }, 33);
  $: updateScrollyY(scrollY);
  

</script>


<svelte:window bind:scrollY bind:innerHeight bind:outerHeight bind:innerWidth/>
<Fonts/>

 <MapTimeline
	{dataPath}
	{scrollY}
/>
<MapStatewide
	{dataPath}
	{scrollY}
/>


<style>
	:global(.fullscreen) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
