<script>
	import { domain } from '../modules/store.js';
	import { amlToHTML } from "../modules/utils.js";
	import { inview } from 'svelte-inview';

	export let assetPath;
	export let intro;

	let subtitle = amlToHTML(intro?.subtitle)
	let byline = amlToHTML(intro?.byline)
	let date = amlToHTML(intro?.date)

	let isInView;
  const options = {
    rootMargin: `-40%`,
    unobserveOnEnter: false,
  };
	const handleChange = ({ detail }) => {
		isInView = detail.inView
	};

	let nowEasternTime = Date.parse(new Date().toLocaleString("en-US", {timeZone: "America/New_York"}));
	let storyTwoPublishDate = Date.parse(new Date('5/2/2022, 6:00:00 AM').toLocaleString("en-US", {timeZone: "America/New_York"}));
	let storyThreePublishDate = Date.parse(new Date('5/3/2022, 6:00:00 AM').toLocaleString("en-US", {timeZone: "America/New_York"}));

	let showStoryTwo = nowEasternTime >= storyTwoPublishDate
	let showStoryThree = nowEasternTime >= storyThreePublishDate

	$: storyTwoLink = `https://www.${$domain}.com/news/business/article260606272.html`
	$: storyThreeLink = `https://www.${$domain}.com/news/business/article260606412.html`
	$: opacity = isInView ? 1 : 0
</script>

<div class="intro-container" style={`opacity: ${opacity}`} use:inview={options} on:enter={handleChange}>
	<div class="title-logo">
		<img class="contain" src={`${assetPath}/intro_logo.png`}>
	</div>
	<div class='story-link-container'>
		<p class="part current">Story &nbsp;1</p>
		{#if showStoryTwo}
			<a href={storyTwoLink} target="_blank">
				<p class="part outlink">Story &nbsp;2</p>
			</a>
		{/if}
		{#if showStoryThree}
			<a href={storyThreeLink} target="_blank">
				<p class="part outlink">Story &nbsp;3</p>
			</a>
		{/if}
	</div>
	<div class="title-pipe">
		<img class="contain" src={`${assetPath}/intro_pipe.png`}>
	</div>

	<div class="text-container">
		<p class="subtitle">{@html subtitle}</p>
		<p class="byline">{@html byline} &nbsp;&nbsp; {@html date}</p>
	</div>
</div>

<style>
	a {
		margin: 0 !important;
		color:  gray;
	}
	.current {
		font-weight: 600 !important;
		font-size: 20px;
	}
	.outlink {
		margin: auto;
		background: transparent;
		height: 30px;
		color: rgb(150,150,150) !important;
		font-size: 14px;
		font-family: 'Libre Franklin';
		font-weight: normal;
		/*letter-spacing: .3px;*/
		font-weight: 600;
		padding: 0px;
		line-height: 30px;
		text-align: center;
		border:  1px solid transparent;
		/*border-bottom:  1px solid rgb(150,150,150);*/
		border-radius: 0px;
		/*text-transform: uppercase;*/

		transition: border-bottom .2s;
		transition: font-weight .2s;
	}
	a:hover .outlink {
	  /*background-color: #D93A4C;*/
	  border-bottom:  1px solid #D93A4C;
	  text-transform: scale(1.03);
	  color: #D93A4C !important;
	  font-weight: 600;
	  font-size: 20px;
	  cursor: pointer;
	}

	a {
		margin: 0 !important;
		color:  gray;
		text-decoration: none;
	}
	.current {
		font-weight: 600 !important;
		font-size: 20px !important;
		color: #d7384c !important;
	}

	.part {
		color: white;
		font-family: "Libre Franklin";
		/*text-transform: uppercase;*/
		font-weight: 300;
		line-height: 30px;
		letter-spacing: 0.2px;
		font-size: 20px;
	}
	.intro-container {
		transition: opacity 0.4s;
  	-webkit-transition: opacity 0.4s;
	}
	.title-logo {
		min-width: min(350px, 100%);
		width: 50%;
		max-height: 500px;
	  margin: 0 auto;
	  display: flex;
	  padding: 10px;
	  padding-bottom: 0px;
	}
	.title-pipe {
		min-width: min(235px, 100%);
		width: 30%;
		max-width: 400px;
	  object-fit: contain;
	  margin: 0 auto;
	  display: flex;
	  padding: 0 20px;
	}

	.story-link-container {
		max-width: min(540px, 100%);
		margin: 0 auto;
		padding: 0 20px;
		display: flex;
		display: -webkit-flex;
		justify-content: space-evenly;
		padding-bottom: 20px;
	}

	.story-link-container p {
		font-family: 'Libre Franklin';
		text-align: center;
		margin: 0;
	}

	.text-container {
		max-width: min(640px, 100%);
		margin: 0 auto;
		padding: 0 20px;
	}

	.text-container p {
		font-family: 'Libre Franklin';
		text-align: center;
		width: 100%;
		margin: 0;
	}

	.subtitle {	
    font-weight: 700;
    font-size: 28px;
    line-height: 36px;
    padding: 30px 0 20px 0;
	}

	.byline {
		text-align: center;
		font: 0.75rem/1.1em var(--sans);
	}

	.date {
		font: 0.75rem/1.1em var(--sans);
	}

	.contain {
		margin: auto;
		object-fit: contain;
		width:100%;
		max-height: 500px;
		height:100%;
	}

	@media only screen and (max-width:  600px) {
		.title-logo {
			margin-bottom: 0;
			padding-bottom: 10px;
		}
		.subtitle {
			font-size: 22px;
  		line-height: 30px;
  		padding: 20px 0 10px 0;
		}
		.byline {
			font: 0.60rem/1.1em var(--sans);
			padding-bottom: 30px;
		}
		.current {
			font-size: 16px !important;
		}
		.outlink {
			font-size: 15px !important;
		}
	}
</style>