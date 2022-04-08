<script>
  import first from 'underscore/modules/first';
  import { inview } from 'svelte-inview';
	import { onMount } from 'svelte';
	import Scroller from "./Scroller.svelte";
  import ScrollingVideo from './ScrollingVideo.svelte';
  import ScrollingVideoText from './ScrollingVideoText.svelte';
	import { windowWidth, windowHeight, storeInnerHeight, isPortrait } from '../modules/store.js';
	import { isMobile, isTablet, execResizeCallbackWithSuspend, addDataToVideoElement } from "../modules/utils.js";

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


	export let scrollY;
	export let videoNode;
	export let isFirstVideo = false;
	export let lazyLoad = false;
	export let lazyLoadOffset = 6000;
	export let amlFile;
	let videoData;

	$: if (amlFile) {
		const content = amlFile?.content;
		const video = first(content
      .filter(item => item.type === 'scrolling-video')
      .map(item => addDataToVideoElement(
      	item.value,
      	30,
      	20
      )));
		videoData = addDataToVideoElement(video)
	}



  let isInView;
  let videoHeight;
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
</script>

{#if videoNode}
	<div bind:this={videoElement} use:inview="{options}" on:change="{handleChange}"></div>
	<Scroller bottom={1} top={0}>
		<div slot="background" style={`height: ${$windowHeight}px; width: 100%`}>

			{#if (shouldLoad || isInView || !lazyLoad)}
		    <ScrollingVideo
		    	bind:height={videoHeight}
		      {videoNode}
		      offset={videoOffset}
		      {scrollY}
		      {isFirstVideo}
		    />
		   {/if}
		 </div>
		<div slot="foreground" style={`height: ${$isPortrait && isTablet.ipad() ? videoHeight + $storeInnerHeight : $isPortrait ? videoHeight + $windowHeight : videoHeight + $windowHeight}px; width: 100%;`}>
				<div>
					{#if amlFile && videoData}
						{#each videoData.scrollingTexts as scrollingText, j}
				      <ScrollingVideoText
				        {videoData}
				        {scrollingText}
				      />
				    {/each}
				  {/if}
			  </div>
		</div>

	</Scroller>
{/if}

<style>
	[slot="background"] {
		background-color: rgba(255,62,0,0.05);
		overflow:  hidden;
		pointer-events: all;
	}
</style>