<script>
  import { amlToHTML } from '../modules/utils.js'
	import { isPortrait } from '../modules/store.js';

	export let section;	
	export let assetPath;
	export let paddingBottom = 40;

	let items = section?.items;
</script>

{#each items as item}
	<div class="slide">
		<p style={`font-size: ${$isPortrait ? "16px" : "21px" }`}>{@html amlToHTML(item.text)}</p>
	</div>
{/each}

<style>
	.slide {
		width: 100%;
		height: 40vh;
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
		font-size: 21px;
		color: black;
		padding: 20px;
	}
</style>