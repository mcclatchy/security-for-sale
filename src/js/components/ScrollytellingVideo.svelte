<script>
  import { inview } from 'svelte-inview';
	import { onMount } from 'svelte';
	import Scroller from "./Scroller.svelte";
  import ScrollingVideoText from './ScrollingVideoText.svelte';
  import ScrollingVideo from './ScrollingVideo.svelte';
	import { windowWidth, windowHeight, storeInnerHeight, isPortrait } from '../modules/store.js';
	import { isMobile, isTablet, execResizeCallbackWithSuspend } from "../modules/utils.js";

	// Resizing more responsively with ResizeObserver to accommodate scrolling videos
  let videoElement;
  let videoOffset;
  onMount(() => {
  	if (videoElement) {
  		videoOffset = (videoElement && videoElement.offsetTop)
  	}
  })

	const resizeObserver = new ResizeObserver(entries => {
		const elements = entries.map(entry => entry.target);
  	execResizeCallbackWithSuspend(elements, resizeObserver, () => {
			videoOffset = videoElement && videoElement.offsetTop;
  	});
	})

	resizeObserver.observe(document.body);


	export let videoData;
	export let scrollY;
	export let assetPath;
	export let videoPath;
	export let isFirstVideo = false;

	export let removeBreaks = false;
	export let lazyLoad = false;
	export let lazyLoadOffset = 6000;




  let isInView;
  let options = {
  	unobserveOnEnter: true
  }

  const handleChange = ({ detail }) => (isInView = detail.inView);



  let triggerPixel;
  let shouldLoad = false;
  onMount(() => {
    if (videoElement) {
    	// Lazy Load Offset can be a percentage
    	if (lazyLoadOffset < 1 && lazyLoadOffset > 0) {
    		triggerPixel = videoElement.offsetTop * lazyLoadOffset
    	} else {
    		triggerPixel = videoElement.offsetTop - lazyLoadOffset
    	}
   	  options.rootMargin = `${triggerPixel}px`
    }
  })
  $: if (scrollY > triggerPixel) {
    shouldLoad = true;
  }
  
  $: height = 
  	$isPortrait && isTablet.ipad() ? videoData.portrait.height + $storeInnerHeight : 
  	$isPortrait ? videoData.portrait.height + $windowHeight : 
  	videoData.landscape.height + $windowHeight;

  let progress;
</script>

<div bind:this={videoElement} use:inview="{options}" on:change="{handleChange}"></div>
<Scroller bottom={1} top={0} bind:progress>
	<div slot="background" style={`height: ${$windowHeight}px; width: 100%`}>

		{#if (shouldLoad || isInView || !lazyLoad)}
	    <ScrollingVideo
	      {videoData}
	      {assetPath}
	      {videoPath}
	      offset={videoOffset}
	      {scrollY}
	      {isFirstVideo}
	    />
	   {/if}
	 </div>
	<div slot="foreground" style={`height: ${height}px; width: 100%;`}>
				<div id={`${videoData.id}`}>
					{#each videoData.scrollingTexts as scrollingText, j}
			      <ScrollingVideoText
			        {videoData}
			        {scrollingText}
					    {removeBreaks}
					    {scrollY}
					    {progress}
			      />
			    {/each}
			  </div>
		</div>
</Scroller>

<style>
	[slot="background"] {
		background-color: white;
		overflow:  hidden;
		pointer-events: all;
	}
</style>