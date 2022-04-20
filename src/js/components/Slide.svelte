<script>
  import { amlToHTML } from '../modules/utils.js'
	import { isPortrait, windowHeight } from '../modules/store.js';

	export let section;	
	export let assetPath;
	export let paddingBottom = 40;

	let items = section?.items;
</script>


{#each items as item}
	<div class="slide" style={'height: ${0.4 * $windowHeight}px'}>

		<p style={`font-size: ${$isPortrait ? "18px" : "41px" }`}>{@html amlToHTML(item.text)}</p>
	</div>
{/each}

<style>
	.slide {
		width: min(90%, 800px);
		margin: 0 auto;
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		cursor: auto;
		padding-bottom: 10vh;
	}

	.slide p {
		font-family: 'Libre Franklin';
		color: black;
		padding: 20px;
		font-weight: 200;
		line-height: 1.5;
	}


	:global(.marker-highlight) {
		text-decoration:  underline;
		text-decoration-color: #f94d60;
		text-underline-offset: 5px;
	 	/*background-image: linear-gradient(-100deg, #f94d60, #f94d60 95%, #f94d60);*/
	}

</style>