<script>
	import OutLink from './OutLink.svelte';
	import { windowWidth } from '../modules/store.js';

	export let assetPath;
	export let items;

	let nowEasternTime = Date.parse(new Date().toLocaleString("en-US", {timeZone: "America/New_York"}));

	let publishDates = [
		Date.parse(new Date('5/2/2022, 6:00:00 AM').toLocaleString("en-US", {timeZone: "America/New_York"})),
		Date.parse(new Date('5/3/2022, 6:00:00 AM').toLocaleString("en-US", {timeZone: "America/New_York"}))
	]

	let activeItems = items.filter((item, i) =>  nowEasternTime >= publishDates[i])

</script>

{#if activeItems.length > 0}
	<div class="divider"/>
	<div class="next-story-container">
		{#each activeItems as item, i}

				<OutLink
					isLastOfMultiple={i === (activeItems.length - 1) && activeItems.length > 1}
					index={i + 2}
					link={item?.link}
					title={item?.title}
					summary={item?.text}
					imageFilename={item.image.filename}
					imageAlt={item.image.alt}
					{assetPath}
				/>
				{#if (i < (activeItems.length - 1) && $windowWidth < 600)}
					<div class="divider"/>
				{/if}

		{/each}
	</div>
{/if}
<div class="divider"/>

<style>
	.next-story-container {
		max-width: 570px;
		display: flex;
		display: -webkit-flex;
		flex-direction: row;
		justify-content: center;
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

	@media only screen and (max-width: 600px) {
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