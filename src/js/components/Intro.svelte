<script>
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


	$: opacity = isInView ? 1 : 0
</script>

<div class="intro-container" style={`opacity: ${opacity}`} use:inview={options} on:enter={handleChange}>
	<div class="title-logo">
		<img class="contain" src={`${assetPath}/intro_logo.png`}>
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

	}
	.title-pipe {
		min-width: min(275px, 100%);
		width: 30%;
		max-width: 400px;
	  object-fit: contain;
	  margin: 0 auto;
	  display: flex;
	  padding: 0 20px;
	}

	.text-container {
		max-width: min(600px, 100%);
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
		font-weight: 500;
		font-size: 20px;
		padding: 30px 0 10px 0;
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
		.subtitle {
			font-size: 18px;
		}
		.byline {
			font: 0.60rem/1.1em var(--sans);
			padding-bottom: 30px;
		}
	}
</style>