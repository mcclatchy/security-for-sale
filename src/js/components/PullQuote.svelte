<script>
	import { amlToHTML } from "../modules/utils.js"
	export let text;
	export let assetPath;
</script>

<div class="pull-quote">
    <div style="display: inline-block;">
        <span class="quote-text">{@html amlToHTML(text)}</span>
    </div>
    <div class="section-divider">
		<img class="contain" src={`${assetPath}/intro_pipe.png`}>
	</div>
</div>

<style>
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
		width: min(100%, 300px);
		display: flex;
		display: -webkit-flex;
		flex-direction: row;
		justify-content: center;
		padding-bottom: 20px;
		padding-top: 20px;
	}

	.section-divider img {
		width: 100%;
		padding: 0 5%;
	}


	@media only screen and (max-width: 600px) {
		.pull-quote {
			width: 80vw;
			margin: 30px auto;
			margin-top: 50px;
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
	}

</style>