<script>
	import OutLink from './OutLink.svelte';

	export let assetPath;
	export let items;

</script>

<div class="divider"/>
<div class="next-story-container">
	{#each items as item, i}
		<OutLink
			isLastOfMultiple={i === (items.length - 1) && items.length > 1}
			index={i + 2}
			link={item?.link}
			title={item?.title}
			summary={item?.text}
			imageFilename={item.image.filename}
			imageAlt={item.image.alt}
			{assetPath}
		/>
	{/each}
</div>

<style>
	.next-story-container {
		max-width: 470px;
		display: flex;
		display: -webkit-flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 0 auto;
		padding-top: 40px;
	}
	.divider {
		height: 1px;
		background: #AAAAAA;
		width: 95%;
		max-width: 600px;
		margin:  0 auto;
		margin-top:  80px;
		margin-bottom: 30px;
	}

	@media only screen and (max-width: 500px) {
		.next-story-container {
			max-width: 100%;
			flex-direction: column;
			padding-top: 20px;
		}
		.divider {
			max-width: 100%;
	  	margin: auto 20px;
	  	width: unset;
			margin-top: 60px;
			margin-bottom: 40px;
			display: block;
		}
	}
</style>