<script>
	import { amlToHTML } from "../modules/utils.js"
	export let text;
	export let assetPath;
	export let attribution;

	let attributionSplit = attribution && attribution.split(',');
	let attributionName = attributionSplit && attributionSplit[0];
	let attributionSubtitle = attributionSplit && attributionSplit[1];
</script>

<div class="pull-quote">
    <div style="display: inline-block;">
        <span class="quote-text">{@html amlToHTML(text)}</span>
    </div>
<!--     <div class="section-divider">
		<img class="contain" src={`${assetPath}/intro_pipe.png`}>
	</div> -->
	<div class="" style="width: 100%;">
		<!-- <p class="attribution">&#8212; Jonathan&nbsp;&nbsp;Osman,&nbsp; Charlotte Realtor</p> -->

		<p class="attribution">{@html `&#8212; ${attributionName},&nbsp; ${attributionSubtitle}`}</p>
	</div>
</div>

<style>
	.attribution {
		width: 100%;
		font-family: 'Libre Franklin';
		text-align: center;
		color:  #D93A4C;
		text-transform: uppercase;
		font-size: 16px;
		margin: 0 !important;
		padding-bottom: 20px;
		padding-top: 15px;
		/*letter-spacing: .8px;*/
	}
	.pull-quote {		
		text-align: center;
		margin: 100px auto;
		max-width: 900px;
		margin-top: 60px;
    	margin-bottom: 0px;
	}
	.quote-text {
		font-family: 'Libre Franklin';
		font-size: 30px;
		font-weight: normal;
		line-height: 45px;
		text-align: center;
		color: #D93A4C;
	}
	:global(.quote-highlight) {
	  	color: #D93A4C;
	    /*font-weight: bold;*/
	    font-size: 45px;
	}

	.quote-text:before, .quote-text:after {
		margin: 0;
		font-size: 100px;
		padding: 5px;
		white-space: normal;
		width: 50px;
		text-align: center;
	}
	.quote-text:before {
	  content: open-quote;
	  /*padding-right: 30px;*/
	  line-height: 30px;
	}

	.quote-text:after {
	  content: close-quote;
		line-height: 0;
		position: relative;
    	vertical-align: -70px;
	}

	.section-divider {
		margin: 0 auto;
		width: min(100%, 500px);
		display: flex;
		display: -webkit-flex;
		flex-direction: row;
		justify-content: center;
		/*padding-bottom: 20px;*/
		/*padding-top: 20px;*/
	}

	.section-divider img {
		width: 100%;
		padding: 0 5%;
		/*filter: grayscale(100%);*/
	}


	@media only screen and (max-width: 600px) {
		.pull-quote {
		    width: 80vw;
		    margin: 0 auto !important;
		    margin-top: 50px !important;
		}
		.quote-text {
			font-size: 24px;
			line-height: 35px;
			text-align: center;
		}
		.quote-text:before, .quote-text:after {
			font-size: 60px;
		}
		.quote-text:before {
			 /*padding-right: 20px;*/
			 line-height: 20px;
		}
		.quote-text:after {
			line-height: 0;
			position: relative;
	    	vertical-align: -50px;
		}
		.section-divider {
			padding-bottom: 0px;
		}
		:global(.quote-highlight) {
		    font-size: 30px;
		}
		.attribution {
			text-align: center;
			padding-top: 20px;
			font-size: 13px;
		}
	}

</style>