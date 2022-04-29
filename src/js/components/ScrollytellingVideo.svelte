<script>
  import { inview } from 'svelte-inview';
	import { onMount } from 'svelte';
	import Scroller from "./Scroller.svelte";
  import ScrollingVideoText from './ScrollingVideoText.svelte';
  import ScrollingVideo from './ScrollingVideo.svelte';
	import { windowWidth, windowHeight, storeInnerHeight, isPortrait } from '../modules/store.js';
	import { isMobile, isTablet, execResizeCallbackWithSuspend } from "../modules/utils.js";

	// Resizing more responsively with ResizeObserver to accommodate scrolling videos
  


	export let videoData;
	export let scrollY;
	export let assetPath;
	export let videoPath;
	export let isFirstVideo = false;

	export let removeBreaks = false;
	export let lazyLoad = false;
	export let lazyLoadOffset = 6000;
	export let offsetElement = null;
	export let fade = false;
	export let pointerEvents = "all";
	export let visibility;
	export let shouldParallaxText = false;
	export let opacity = 1;

  let videoFinished = false;
	$: opacity = fade && videoOffset && (videoFinished || scrollY < videoOffset || scrollY > (videoOffset + height + $windowHeight)) ? 0 : 1
	$: visibility = fade && videoOffset && (videoFinished || scrollY < videoOffset || scrollY > (videoOffset + height + $windowHeight)) ? 'hidden' : 'visible'


	let videoElement;
  let videoOffset;
	
	$: if (!offsetElement && videoElement) {
		offsetElement = videoElement;
	}  

  onMount(() => {
  	if (!offsetElement && videoElement) {
			offsetElement = videoElement;
		}  
  	if (offsetElement) {
	  	if (videoElement !== offsetElement && offsetElement.offsetTop === 0 && offsetElement?.offsetParent) {
				videoOffset = offsetElement.offsetParent.offsetParent.offsetParent.offsetTop - 0.75 * $windowHeight
	  	} else {
	  		videoOffset = offsetElement.offsetTop
	  	}
  	}

  })
	
  $: if (offsetElement) {
  	if (videoElement !== offsetElement && offsetElement.offsetTop === 0 && offsetElement?.offsetParent) {
			videoOffset = offsetElement.offsetParent.offsetParent.offsetParent.offsetTop + offsetElement.offsetParent.offsetTop - 0.75 * $windowHeight
  	} else {
  		videoOffset = offsetElement.offsetTop
  	}
	}

	const resizeObserver = new ResizeObserver(entries => {
		const elements = entries.map(entry => entry.target);
  	execResizeCallbackWithSuspend(elements, resizeObserver, () => {
			if (videoElement !== offsetElement && offsetElement?.offsetTop === 0 && offsetElement?.offsetParent) {
				videoOffset = offsetElement.offsetParent.offsetParent.offsetParent.offsetTop + offsetElement.offsetParent.offsetTop - 0.75 * $windowHeight
	  	} else {
	  		videoOffset = offsetElement.offsetTop
	  	}
  	});
	})

	resizeObserver.observe(document.body);


  let isInView;
  let options = {
  	unobserveOnEnter: true
  }

  const handleChange = ({ detail }) => (isInView = detail.inView);



  let triggerPixel;
  let shouldLoad = false;
  onMount(() => {
    if (offsetElement) {
    	// Lazy Load Offset can be a percentage
    	if (lazyLoadOffset < 1 && lazyLoadOffset > 0) {
    		triggerPixel = offsetElement.offsetTop * lazyLoadOffset
    	} else {
    		triggerPixel = offsetElement.offsetTop - lazyLoadOffset
    	}
   	  options.rootMargin = `${triggerPixel}px`
    }
  })
  $: if (scrollY > triggerPixel) {
    shouldLoad = true;
  }
  
  $: height = 
  	$isPortrait && isTablet.ipad() ? videoData.portrait.height + $windowHeight : 
  	$isPortrait ? videoData.portrait.height + $windowHeight : 
  	videoData.landscape.height + $windowHeight;

  let progress;
</script>

<div bind:this={videoElement} use:inview="{options}" on:change="{handleChange}"></div>
<Scroller bottom={1} top={0} bind:progress >
	<div slot="background" style={`height: ${$windowHeight}px; width: 100%; opacity: ${fade ? opacity : 1}; pointer-events: ${pointerEvents};`}>

		{#if (shouldLoad || isInView || !lazyLoad)}
	    <ScrollingVideo
	      {videoData}
	      {assetPath}
	      {videoPath}
	      offset={videoOffset}
	      {scrollY}
	      {isFirstVideo}
	      bind:videoFinished
	    />
	   {/if}
	 </div>
	<div slot="foreground" style={`height: ${height}px; width: 100%;`}>
				<div id={`${videoData.id}`}>
					{#if videoData.scrollingTexts.length > 0}
						{#each videoData.scrollingTexts as scrollingText, j}
				      <ScrollingVideoText
				        {videoData}
				        {scrollingText}
						    {removeBreaks}
						    {scrollY}
						    {progress}
						    {shouldParallaxText}
				      />
				    {/each}
				  {/if}
			  </div>
		</div>
</Scroller>

<style>
	[slot="background"] {
		background-color: white;
		overflow:  hidden;
    transition: opacity .8s;
  	-webkit-transition: opacity .8s;
	}
</style>