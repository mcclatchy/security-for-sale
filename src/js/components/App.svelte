<script>
  import first from 'underscore/modules/first';
  import throttle from 'underscore/modules/throttle';

	import Fonts from './Fonts.svelte';
	import Intro from './Intro.svelte';
	import PageLoader from './PageLoader.svelte';
	import MapStatewide from './MapStatewide.svelte';
	import MapTimeline from './MapTimeline.svelte';
	import MultimediaSection from './MultimediaSection.svelte';
	import NextStories from './NextStories.svelte';
	import Outro from './Outro.svelte';
  import ScrollytellingVideo from './ScrollytellingVideo.svelte';
  import ScrollToContinue from './ScrollToContinue.svelte';
  import SimpleMasthead from './SimpleMasthead.svelte';
  import Slide from './Slide.svelte';

  import { onMount } from 'svelte';
	import { isMobile, isTablet, addDataToVideoElement, getArrayItemById } from "../modules/utils.js";
  import { enableScroll, disableScroll } from '../modules/scroll';
	import { windowWidth, windowHeight, storeInnerHeight, storeOuterHeight, isPortrait, isIntroLoaded, isFirstVideoLoaded, initialOrientationAngle, updatedOrientationAngle, isRotated, droneTriggerElement, statewideZoom, domain } from '../modules/store.js';
  import amlURL from '../../assets/aml-story.json?url';

  // Disable Scroll initially - once the load trigger, fires, scroll is enabled
  onMount(() => {
    window.scrollY === 0 && !$isFirstVideoLoaded && disableScroll()
  })

  $: if ($isFirstVideoLoaded) {
  	setTimeout(() => { enableScroll(); }, 500);
  }


	if (history.scrollRestoration) {
	  history.scrollRestoration = 'manual';
	}

	window.addEventListener("orientationchange", function() {
		updatedOrientationAngle.set(window.orientation)
	}, false)

	// $: $isRotated && isTablet.any() && window.location.reload();

	let projectName = "security-for-sale"
	const dataPath = import.meta.env.PROD ? `https://media.mcclatchy.com/static/2022/${projectName}/data/` : "../../src/data"
	const assetPath = import.meta.env.PROD ? `https://media.mcclatchy.com/static/2022/${projectName}/` : "../../"
	const videoPath = import.meta.env.PROD ? `https://www.${$domain}.com/static/hi/2022/${projectName}/` : "../../"

	let innerHeight = window.innerHeight;
	let innerWidth = window.innerWidth;
	let outerHeight = window.outerHeight;
	$: storeInnerHeight.set(innerHeight);
	$: storeOuterHeight.set(outerHeight);
	$: windowHeight.set(isMobile.ios() || isTablet.ipad() ? outerHeight : innerHeight);
	$: windowWidth.set(innerWidth);
	$: domain.set(window.pageInfo["marketInfo.domain"]);

	let scrollY = 0;
  let throttledY = 0;
  const updateScrollyY = throttle(val => {
    throttledY = val;
  }, 33);
  $: updateScrollyY(scrollY);
  

  async function initPage() {
    let url = amlURL;
    if (import.meta.env.PROD) {
      url = `https://media.mcclatchy.com/static/2022/${projectName}/assets/aml-story.json`;
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
          	item.value.id.startsWith('portrait') ? 5 : 10,
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
        const maps = content
          .filter(item => item.type === 'scrolling-map')
          .map(item => item.value);
       	const intro = first(
          content.filter(item => item.type === 'intro').map(item => item.value)
        );
       	const outro = first(
          content.filter(item => item.type === 'outro').map(item => item.value)
        );
        const outlink = first(
          content.filter(item => item.type === 'out-link').map(item => item.value)
        );
        const data = { videos, audio, sections, maps, slides, outro, outlink, intro };
        return data;
      });
  }

	let breakpointSE = 375
	$: introDirectionsBottom = isMobile.ios() && ($windowWidth <= breakpointSE) ? "3vh" : 	
	isTablet.any() && !$isPortrait ? "15vh" :
	isMobile.ios() || isTablet.ipad() ? "22vh" :
	isMobile.any() && !isMobile.ios() ? "3vh" : 
	"3vh"
</script>


<svelte:window bind:scrollY bind:innerHeight bind:outerHeight bind:innerWidth/>
<Fonts/>


{#await initPage()}
	<!-- <div class="bg-placeholder"/> -->
{:then data}

	<SimpleMasthead/>

  <ScrollToContinue
  	bottom={introDirectionsBottom}
  	left={"50%"}
  	highlightColor={"#D93A4C"}
  	{scrollY}
  	visibility={$isFirstVideoLoaded ? 'visible' : 'hidden'}
  />
  <PageLoader
  	{assetPath}
  	left={"50%"}
  	opacity={$isFirstVideoLoaded ? 0 : 1}
  />

	<ScrollytellingVideo
		{assetPath}
		{videoPath}
		videoData={getArrayItemById('trailer', data.videos)}
		scrollY={throttledY}
		isFirstVideo={true}
		shouldParallaxText={true}
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
		divider={false}
		paddingBottom={80}
	/>

	<MapStatewide
		mapData={getArrayItemById('statewide', data.maps)}
		{assetPath}
		{dataPath}
		{videoPath}
		{scrollY}
		videoData={getArrayItemById('drone', data.videos)}
	/>

	<MultimediaSection
		section={getArrayItemById('text-section-2', data.sections)}
		{assetPath}
	/>

	<MultimediaSection
		section={getArrayItemById('text-section-3A', data.sections)}
		{assetPath}
		divider={false}
		paddingBottom={40}
	/>

	<ScrollytellingVideo
		{assetPath}
		{videoPath}
		title="Making a rental-backed security"
		videoData={getArrayItemById('securities', data.videos)}
		scrollY={throttledY}
	/>

	<MultimediaSection
		section={getArrayItemById('text-section-3B', data.sections)}
		{assetPath}
		divider={false}
		paddingBottom={80}
	/>

	 <MapTimeline
		mapData={getArrayItemById('timeline', data.maps)}
	 	{assetPath}
		{dataPath}
		{scrollY}
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
		divider={false}
		paddingBottom={0}
	/>


	<NextStories
		items={data.outlink.items}
		{assetPath}
	/>

	<Outro
		sections={data.outro.sections}
	/>
{/await}

<style>
	:global(.fullscreen) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.transition-container {
    transition: visibility .8s;
  	-webkit-transition: visibility .8s;
	}
</style>
