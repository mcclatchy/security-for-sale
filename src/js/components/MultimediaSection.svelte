<script>
  import PullQuote from './PullQuote.svelte';
  import { amlToHTML } from '../modules/utils.js'

	export let section;	
	export let assetPath;
	export let paddingBottom = 0;
	export let divider = true;

	let items = section?.items;
	let sectionImage = section?.image;
	let sectionTitle = section?.title;
</script>


<div class="article-text" style={`padding-bottom: ${paddingBottom}px`}>
	<div class="section-body">
		{#if sectionImage}
			<div class="section-image">
				<img
					src={`${assetPath}/${sectionImage.filename}`}
					alt={sectionImage.alt}
				/>
			</div>
		{/if}
		{#if sectionTitle}
			<div class="section-heading">
				<div class="section-title">{@html amlToHTML(sectionTitle)}</div>
			</div>
		{/if}
		{#each items as item}
			{#if item?.class === "pull-quote"}
				<PullQuote
					{assetPath}
					text={item.text}
					}
				/>
			{:else if item?.class === "brightcove-video"}
				<div class="brightcove-outer-container">
					<figure class="brightcove-container">
						<iframe title={item.title} src={item.url} allowfullscreen="true" class="brightcove-video" allow="encrypted-media" width="100%" height="100%"></iframe>
					</figure>
					<div class="brightcove-caption">{item.text}</div>
				</div>
			{:else if item?.class === "cue-image"}
				<figure class="cue-container">
					<img src={item.url}>
					<figcaption class="cue-caption">
						{item.text}
					</figcaption>
				</figure>
			{:else}
				<p style>{@html amlToHTML(item.text)}</p>
			{/if}
		{/each}
		{#if divider}
			<div class="section-divider">
				<img class="contain" src={`${assetPath}/intro_pipe.png`}>
			</div>
		{/if}
	</div>
</div>

<style>
	:global(.mobile) {
		display: none;
	}

	:global(.italics) {
		font-style: italic;
	}

	.article-text {
		z-index: 100;
		width: 100%;
		background-color: white;
		position: relative;
		padding: 0 20px;
	}

	.section-divider {
		padding-top: 60px;
		margin: 0 auto;
		width: min(100%, 300px);
		display: flex;
		display: -webkit-flex;
		flex-direction: row;
		justify-content: center;
		padding-bottom: 20px;
	}

	.section-divider img {
		width: 100%;
		padding: 0 5%;
		filter: grayscale(100%);
	}

	.section-heading {
		color: #46000c;
		text-align: left;
		max-width: 1000px;
		margin: auto;
	}

	.section-title {
		font-size: 45px;
		font-weight: 700;
		font-family: 'News Cycle';
		text-transform: uppercase;
		letter-spacing: 3px;
		width: 100%;
		text-align: center;
		margin: auto;
	}

	.section-image {
		padding-top: 80px;
		height: 300px;
		width: 100%;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
	}

	.section-image img {
		object-fit: contain;
		height: 100%;
	}

	.section-body p {
		margin: auto;
		max-width: 600px;
		padding-top: 40px;
		font-weight: 400;
		font-size: 17px;
		line-height: 24px;
		font-family: 'Libre Franklin';
	}

	.cue-container {
		max-width: 1000px;
    margin: 0 auto;
		padding-top: 40px;
	}

	.cue-caption {
		padding: 10px 0px 0 !important;
		font-family: 'Libre Franklin';
	}

	.brightcove-outer-container {
		padding-top: 40px;
		max-width: 1000px;
		margin: 0 auto;
	}

	.brightcove-container {
	  position: relative;
	  width: 100%;
	  max-width: 1000px;
	  height: 0;
	  padding-bottom: 56.25%; /* The height of the item will now be 56.25% of the width. */
	}

	.brightcove-video {
	  position: absolute;
	  width: 100%;
	  height: 100%;
	  left: 0;
	  top: 0;
	}

	.brightcove-caption {
		padding: 10px 0px 0;
		font-family: 'Libre Franklin';
		font-size: .875rem;
		color:  #707070;
		padding-bottom: 10px;
	}
	
	@media only screen and (max-width: 600px) {
		:global(.mobile) {
			display: block;
		}

		.section-heading {
			padding: 0px 0 10px 0;
		}

		.section-title {
			font-size: 35px;
		}
		.section-image {
			height: 160px;
			padding-top: 40px;
		}
		.brightcove-outer-container {
			padding-top: 20px;
		}
		.brightcove-caption {
			padding-bottom: 10px;
		}
		.cue-container {
			padding-top: 20px;
		}

/*		.section-byline {
			font-size:  16px;
			padding-left: 20px;
			padding-right: 20px;
		}*/

		.section-body p {
			font-size: 15px;
			line-height: 24px;
			padding-top: 13px;
		}
		.section-divider {
			padding-bottom: 40px;
		}
	}
</style>