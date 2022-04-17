<script>
	import debounce from 'underscore/modules/debounce';
	import { inview } from 'svelte-inview';
	import { amlToHTML } from '../modules/utils.js'
	import { isPortrait, windowWidth } from '../modules/store.js';

	export let section;
	export let map;
	export let speed = section?.speed ? section.speed : 0.6;
	export let bounds = section?.bounds;
	export let opacity = 1;
	export let fade = false;
	export let fixed = false;
	let boxWidth = 600;

  const options = {
    rootMargin: `-20px`,
    unobserveOnEnter: false,
  };


	// Fit map to specified min/max bounds [[xmin, ymin], [xmax, ymax]]
	function fitBounds(map, bounds, speed, animate=true) {
		if (map) {
			map.fitBounds(bounds, { speed, animate });
		}
	}

	let isInView;
	const handleChange = ({ detail }) => {
		isInView = detail.inView
		if (isInView) {
			fitBounds(map, section.bounds, speed)
		}
	};

	$: isInView && $isPortrait && $windowWidth && debounce(fitBounds(map, section.bounds, speed), 500)

	// IF POSITION IS STATIC
	$: if (fade) {
		opacity = isInView ? 1 : 0
	}
</script>

{#if fixed}
	<section class={section.horizontalPosition} id={section.id} use:inview={options} on:change={handleChange}>
		<div
		style={`
			position: fixed;
			bottom: ${$isPortrait ? "10%" : "0%"};
			left: ${$isPortrait ? "50%" : "0%"};
			width: ${boxWidth}px;
			opacity: ${opacity};
			max-width: 100%;
			transform:  ${$isPortrait ? "translate(-50%, 0%)" : "translate(0,0)"};
		`}>
			<p style={`
				background-color: rgba(255, 255, 255, 1);
				opacity: ${opacity};
				text-align: ${$isPortrait ? "center" : "left"};
			`}>
				{@html amlToHTML(section.text)}
			</p>
		</div>
	</section>
{:else}
	<section class={section.horizontalPosition} id={section.id} use:inview={options} on:change={handleChange}>
		<p style={`background-color: rgba(255, 255, 255, 1)`}>
			{@html amlToHTML(section.text)}
		</p>
	</section>
{/if}





<style>
	section {
		max-width: 100%;
		margin: 0 !important;
	}

	section p {
    font-family: 'Libre Franklin';
    line-height: 27px;
		/*border:  1px solid black;*/
    /*border-radius: 20px;*/
    color: black;
		padding: 20px;
    margin:  20px;
    pointer-events: all;
    transition: opacity 0.6s;
  	-webkit-transition: opacity 0.6s;
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