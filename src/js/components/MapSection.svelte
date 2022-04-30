<script>
	import debounce from 'underscore/modules/debounce';
	import { inview } from 'svelte-inview';
	import { amlToHTML } from '../modules/utils.js'
	import { isPortrait, windowHeight, windowWidth, droneTriggerElement, statewideZoom, activeTimelineSection } from '../modules/store.js';

	export let section;
	export let map;
	export let speed = section?.speed ? section.speed : 0.6;
	export let bounds = section?.bounds;
	export let opacity = 1;
	export let fade = false;
	export let outerFixed = false;
	export let fixed = false;
	export let top = 0;
	export let left = 0;
	export let visibility = "visible";
	export let progress = null;
	export let progressStart = null;
	export let progressEnd = null;

	let boxWidth = 600;

  const options = {
    rootMargin: `0px`,
    unobserveOnEnter: false,
  };


	// Fit map to specified min/max bounds [[xmin, ymin], [xmax, ymax]]
	function fitBounds(map, bounds, speed, padding, pitch=0, bearing=0, animate=true) {
		if (map) {
			map.fitBounds(bounds, { speed, animate, pitch, bearing, padding });
		}
		// map.on('moveend', function(){
		//     console.log('moveend')
		// });
	}

	let isInView;
	const handleChange = ({ detail }) => {
		isInView = detail.inView
		if (isInView) {
			fitBounds(map, section.bounds, speed, section?.padding, section.pitch, section.bearing)
		}
	};


	$: isInView && (section.pitch || section.bearing) && fitBounds(map, section.bounds, speed, section?.padding, section.pitch, section.bearing)

	$: isInView && !section.pitch && !section.bearing && $isPortrait && $windowWidth && debounce(fitBounds(map, section.bounds, speed, section?.padding), 500)

	// TODO: generalize some of this very specific code
	$: if (isInView) {
		statewideZoom.set(section.boundsId)
	}
	$: if (progress && progress > progressStart && progress <= progressEnd) {
		if (section && section?.text !== $activeTimelineSection?.text) {
			activeTimelineSection.set(section);
		} 
	}

	// IF POSITION IS STATIC
	$: if (fade) {
		opacity = isInView ? 1 : 0;
	}
	let element;
	$: section.id === "drone-trigger" && element && droneTriggerElement.set(element)
</script>


<div style={`
	height: ${section.id === "drone-trigger" ? 2500 - $windowHeight : section.id === "spacer" ? 0.35 * $windowHeight : 1.25 * $windowHeight}px;
	z-index: 2;
	position: ${outerFixed ? 'fixed': 'relative'};
	pointer-events: none;
`}>

{#if fixed}
	<section class:no-opacity={section.text === ""} class={section.horizontalPosition} id={section.id} bind:this={element} use:inview={options} on:change={handleChange}>
		<div
		style={`
			visibility: ${visibility};
			position: fixed;
			top: ${$isPortrait ? "unset" : top + "px"};
			bottom: ${$isPortrait ? "2vh" : "unset"};
			left: ${$isPortrait ? "50%" : left + "px"};
			width: ${boxWidth}px;
			opacity: ${opacity};
			max-width: ${$isPortrait ? "100%" : "50%"};
			transform:  ${$isPortrait ? "translate(-50%, 0%)" : "translate(0,0)"};
			height: fit-content;
		`}>
			<p style={`
				border: none;
				background-color: rgba(255, 255, 255, 1);
				opacity: ${opacity};
				text-align: ${$isPortrait ? "center" : "left"};
			`}>
				{@html amlToHTML(section.text)}
			</p>
		</div>
	</section>
{:else}
	<section class:no-opacity={section.text === ""} class={section.horizontalPosition} id={section.id} bind:this={element} use:inview={options} on:change={handleChange}>
		<p style={`background-color: rgba(255, 255, 255, 1)`}>
			{@html amlToHTML(section.text)}
		</p>
	</section>
{/if}
</div>




<style>
	.no-opacity {
		opacity: 0;
	}

	section {
		max-width: 100%;
		margin: 0 !important;
	}

	section p {
    font-family: 'Libre Franklin';
    line-height: 1.5;
    font-weight: 400;
    font-size: 16px;
		border:  1px solid #999;
    border-radius: 20px;
    color: black;
		padding: 20px;
    pointer-events: all;
    transition: opacity 0.6s;
  	-webkit-transition: opacity 0.6s;
  	margin: 20px;
	}

  .left {
  	position: absolute;
    left: 40px;
    transform: translate(0%, 0);
    width: 600px;
    max-width: 100%;
  }

	:global(.highlighter) {
  	background-color: #4B0306;
    padding: 0px 6px;
    color: white;
    margin: 0 4px;
    font-weight: bold;
	}

	@media only screen and (max-width: 700px) {
		section p {
			max-width: 100%;
			padding: 10px;
	    margin:  10px;
      font-size: 16px;
      line-height: 24px;
		}
		:global(.highlighter) {
			padding: 1px 3px;
			margin: 0 2px;
		}
		.left {
			left: 0;
		}
	}
</style>