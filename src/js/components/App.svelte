<script>
  import first from 'underscore/modules/first';
  import throttle from 'underscore/modules/throttle';

	import Fonts from './Fonts.svelte';
	import Intro from './Intro.svelte';
	import MapStatewide from './MapStatewide.svelte';
	import MapTimeline from './MapTimeline.svelte';
	import MultimediaSection from './MultimediaSection.svelte';
  import ScrollytellingVideo from './ScrollytellingVideo.svelte';
  import SimpleMasthead from './SimpleMasthead.svelte';
  import Slide from './Slide.svelte';

  import { onMount } from 'svelte';
	import { isMobile, isTablet, addDataToVideoElement, getArrayItemById } from "../modules/utils.js";
	import { windowWidth, windowHeight, storeInnerHeight, storeOuterHeight, isPortrait, isIntroLoaded, isFirstVideoLoaded, initialOrientationAngle, updatedOrientationAngle, isRotated } from '../modules/store.js';
  import amlURL from '../../assets/aml-story.json?url';


	if (history.scrollRestoration) {
	  history.scrollRestoration = 'manual';
	}

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

	let scrollY = 0;
  let throttledY = 0;
  const updateScrollyY = throttle(val => {
    throttledY = val;
  }, 33);
  $: updateScrollyY(scrollY);
  

  async function initPage() {
    let url = amlURL;
    if (import.meta.env.PROD) {
      url = 'https://media.mcclatchy.com/static/2022/wall-street-landlords/assets/aml-story.json';
    }
    return await fetch(url)
      .then(response => response.json())
      .then(result => {
        const content = result?.content;
        const videos = content
          .filter(item => item.type === 'scrolling-video')
          .map(item => addDataToVideoElement(
          	item.value,
          	30,
          	item.value.id.startsWith('portrait') ? 5 : 20,
          	item.value.id.startsWith('portrait') ? 5 : 13.3
          ));
        const audio = first(
          content.filter(item => item.type === 'audio').map(item => item.value)
        );
        const sections = content
          .filter(item => item.type === 'text-section')
          .map(item => item.value);
        const slides = content
          .filter(item => item.type === 'scrolling-slide')
          .map(item => item.value);
       	const intro = first(
          content.filter(item => item.type === 'intro').map(item => item.value)
        );
       	const outro = first(
          content.filter(item => item.type === 'outro').map(item => item.value)
        );
        const data = { videos, audio, sections, slides, outro, intro };
        return data;
      });
  }

</script>


<svelte:window bind:scrollY bind:innerHeight bind:outerHeight bind:innerWidth/>
<Fonts/>


{#await initPage()}
	<!-- <div class="bg-placeholder"/> -->
{:then data}

	<SimpleMasthead/>



	<ScrollytellingVideo
		{assetPath}
		{videoPath}
		videoData={getArrayItemById('trailer', data.videos)}
		scrollY={throttledY}
		isFirstVideo={true}
	/>

	<Slide
		section={getArrayItemById('text-section-0', data.sections)}
		{assetPath}
	/>

	<Intro
		intro={data.intro}
		{assetPath}
	/>

	
	<MultimediaSection
		section={getArrayItemById('text-section-1', data.sections)}
		{assetPath}
	/>

<!-- 	 <MapTimeline
	 	{assetPath}
		{dataPath}
		{scrollY}
	/> 


	<MapStatewide
		{dataPath}
		{scrollY}
	/>
 -->

	<MultimediaSection
		section={getArrayItemById('text-section-2', data.sections)}
		{assetPath}
	/>

	<MultimediaSection
		section={getArrayItemById('text-section-3', data.sections)}
		{assetPath}
	/>

	<MultimediaSection
		section={getArrayItemById('text-section-4', data.sections)}
		{assetPath}
	/>

	<MultimediaSection
		section={getArrayItemById('text-section-5', data.sections)}
		{assetPath}
	/>

	<MultimediaSection
		section={getArrayItemById('text-section-6', data.sections)}
		{assetPath}
	/>

	<MultimediaSection
		section={getArrayItemById('text-section-7', data.sections)}
		{assetPath}
	/>
{/await}

<style>
	:global(.fullscreen) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
