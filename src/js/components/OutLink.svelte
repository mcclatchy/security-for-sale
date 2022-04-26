<script>
	import { amlToHTML } from '../modules/utils.js'

	export let assetPath;
	export let link;
	export let title;
	export let summary;
	export let imageFilename;
	export let imageAlt;
	export let index;
	export let isLastOfMultiple = false;

	let buttonText = `Read Part &nbsp;0${index} &nbsp; >`
</script>

<div class="preview-outer" class:is-last-of-mulitple={isLastOfMultiple}>
		<a href={link} target="_blank">
			<div class="preview">
				<div class="text-centered">
					<p class="preview-title">{title}</p>
				</div>
				<div class="preview-image">
					<img
						src={`${assetPath}/${imageFilename}`}
						alt={imageAlt}
					/>
				</div>
				<div class="preview-container">
					<button class="preview-outlink">{@html buttonText}</button>
				</div>
			</div>	
		</a>
</div>

<style>
	a {
		text-decoration: none;
	}

	.text-centered {
		text-align: center;
	}

	.preview {
		width: 100%;
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		align-content: center;
		justify-content: center;
	}

	.preview-container {
		width: 100%;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		padding-top: 30px;

	}

	.preview-title {
		font-family: "Libre Franklin";
		font-size: 22px;
		font-weight: 400;
		color:  #D93A4C;
		padding: 0 20px;
		padding-bottom: 15px;
		margin: 0;
	}

	.preview-summary {
		font-family: "Libre Franklin";
		font-size: 15px;
		font-weight: 300;
		margin: 20px 0 0 0;
		max-height: 145px;
		overflow: hidden;
    display: -webkit-box;
    max-width: 490px;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
	}

	.preview-image {
    margin: 0 auto;
	}

	.preview-image img {
		border-radius: 20px;
		aspect-ratio: 1;
		object-fit: cover;
		height: 200px;
		width: 200px;
		align-content: center;
		transition: transform .2s;
		border: 2px solid transparent;
	}

	.preview-outlink {
		margin: auto;
		background: #D93A4C;
		height: 40px;
		color: white;
		width: 180px;
		font-size: 14px;
		font-family: 'Libre Franklin';
		font-weight: normal;
		/*letter-spacing: .3px;*/
		font-weight: 600;
		padding: 0 15px;
		line-height: 40px;
		text-align: center;
		border:  1px solid #D93A4C;
		border-radius: 50px;
		text-transform: uppercase;
		box-shadow:0 0 0 0px white, 0 0 0 3px #D93A4C;
		transition: transform .2s;
	}

	a:hover .preview-image img {
	  border:  2px solid #A0212F;
	  transform: scale(1.02);
	}

	a:hover {
		text-decoration: none;
	}

	a:hover p {
		color: #A0212F;
	}

	a:hover .preview-outlink {
	  background-color: #A0212F;
	  border:  1px solid #A0212F;
	  box-shadow:0 0 0 0px white, 0 0 0 3px #A0212F;
	  color: white;
	  cursor: pointer;
	}

	.preview-outer.last-of-type {
		padding-top: 70px;
	}

	@media only screen and (max-width: 500px) {
		.is-last-of-mulitple {
			padding-top: 70px;
		}

	}

</style>