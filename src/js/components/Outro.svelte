<script>
	import { amlToHTML } from "../modules/utils.js"

	export let sections;
</script>


<div class="outro" id="outro">
	{#each sections as section,i}
		<h5 style={i === 0 && "margin-top: 10px"}>
			{section.title}	
		</h5>
		<p>
			{@html amlToHTML(section.text)}
		</p>
	{/each}
</div>	

<style>
	.divider {
		height: 1px;
		background: #AAAAAA;
		width: 95%;
		max-width: 600px;
		margin:  0 auto;
		margin-top:  80px;
	}

	.outro {
		max-width: 600px;
		margin: 0 auto;
		/*margin-top:  20px;*/
		padding: 30px 0;
		/*border:  1px solid #4B0303;*/
	}

	.outro p {
		font-size: 14px;
		font-family: 'Libre Franklin';
		line-height: 20px;
	}

	.outro h5 {
		font-family: 'Libre Franklin';
		margin-bottom: 20px;
		padding-top: 20px;
		font-size: 15px;
		font-weight: 500;
	}

	@media only screen and (max-width: 600px) {
		.outro {
			padding: 10px;
			max-width: 100%;
    	margin: auto 20px;
    	padding-bottom: 50px;
		}
		.divider {
			max-width: 100%;
    	margin: auto 20px;
    	width: unset;
			margin-top: 60px;
			display: block;
		}
		.outro p {
			font-size: 14px;
			line-height: 19px;
		}
		.outro h5 {
			font-size: 16px;
		}
	}
</style>