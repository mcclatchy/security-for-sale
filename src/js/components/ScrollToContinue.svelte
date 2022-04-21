<script>
	import { tweenProgress } from "../modules/utils.js"

	// SOURCE: https://codepen.io/rightblog/pen/EagNMN/
	export let highlightColor = "black"
	export let backgroundColor = "none"
	export let bottom = 0;
	export let left = "50%";
	export let shadow = false;
	export let softShadow = false;
	export let visibility = 'hidden';

	export let start = 0
	export let end = 200;
	export let scrollY;

	$: progress = (scrollY - start) / (end - start)

	export let arrowHeight = "70px"
	$: arrowStyle = `border-right: 2px solid ${highlightColor}; border-bottom: 2px solid ${highlightColor};`
</script>

	<div class="scroll-container" class:heavy-shadowed={shadow} class:soft-shadowed={softShadow} style={`
		bottom: ${bottom};
		left: ${left};
		transform: translate(-${left}, 0);
		opacity: ${tweenProgress(0, 1, progress, 1, 0)};
		background: ${backgroundColor};
		padding: 5px 30px 10px 30px;
		height: 90px;
    width: 220px;
    visibility: ${visibility};
	`}>
		<div class="scroll-instruction" style={`color: ${highlightColor};`}>
		  Scroll to Continue
		</div>
		<div class="mouse_scroll" style={`height: ${arrowHeight}`}>
				<div>
					<span class="scroll-arrows one" style={arrowStyle}></span>
					<span class="scroll-arrows two" style={arrowStyle}></span>
					<span class="scroll-arrows three" style={arrowStyle}></span>
				</div>
		</div>
	</div>

<style>
	.scroll-container {
    position: fixed;
    z-index: 100000;
	  transition: visibility 1s;
	  -webkit-transition: visibility 1s;
	  pointer-events: none;
	}

	.scroll-instruction {
	  display: block;
		margin: 0 auto;
	  width: 100%;
	  text-align: center;
	  font-weight: 700;
	  font-family: "News Cycle";
    font-size: 14px;
    text-transform: uppercase;
    pointer-events: all;
	}


	*, *:before, *:after {
	  -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box;
	 }


	.mouse_scroll {
		display: block;
		margin: 0 auto;
		width: 24px;
		height: 70px;
		margin-top: 5px;
	}


	.scroll-arrows
	{
	  display: block;
	  -ms-transform: rotate(45deg); /* IE 9 */
	  -webkit-transform: rotate(45deg); /* Chrome, Safari, Opera */
	  transform: rotate(45deg);
	   
	  margin: 4px auto;
	  
	  width: 16px;
	  height: 16px;
	}


	.one
	{
	  margin-top: 1px;
	}

	.one, .two, .three
	{
	    -webkit-animation: mouse-scroll 1s infinite;
	    -moz-animation: mouse-scroll 1s infinite;
	    animation: mouse-scroll 1s infinite;
	  
	}

	.one
	{
	  -webkit-animation-delay: .1s;
	  -moz-animation-delay: .1s;
	  -webkit-animation-direction: alternate;
	  
	  animation-direction: alternate;
	  animation-delay: alternate;
	}

	.two
	{
	  -webkit-animation-delay: .2s;
	  -moz-animation-delay: .2s;
	  -webkit-animation-direction: alternate;
	  
	  animation-delay: .2s;
	  animation-direction: alternate;
	  
	  margin-top: -6px;
	}

	.three
	{
	  -webkit-animation-delay: .3s;
	  -moz-animation-delay: .3s;
	  -webkit-animation-direction: alternate;
	  
	  animation-delay: .3s;
	  animation-direction: alternate;
	  
	  
	  margin-top: -6px;
	}

	@-webkit-keyframes mouse-wheel{
	   0% {
	    opacity: 1;
	    -webkit-transform: translateY(0);
	    -ms-transform: translateY(0);
	    transform: translateY(0);
	  }

	  100% {
	    opacity: 0;
	    -webkit-transform: translateY(6px);
	    -ms-transform: translateY(6px);
	    transform: translateY(6px);
	  }
	}

	@-webkit-keyframes mouse-scroll {

	  0%   { opacity: 0;}
	  50%  { opacity: .5;}
	  100% { opacity: 1;}
	}
	@-moz-keyframes mouse-scroll {

	  0%   { opacity: 0; }
	  50%  { opacity: .5; }
	  100% { opacity: 1; }
	}
	@-o-keyframes mouse-scroll {

	  0%   { opacity: 0; }
	  50%  { opacity: .5; }
	  100% { opacity: 1; }
	}
	@keyframes mouse-scroll {

	  0%   { opacity: 0; }
	  50%  { opacity: .5; }
	  100% { opacity: 1; }
	}

	@media only screen and (max-width: 600px) {
		.scroll-instruction { 
			font-size: 12px;
		}
		.scroll-arrows {
		  width: 10px;
	  	height: 10px;
		}
		.scroll-container {
    	bottom: 15vh;
  	}
	}
</style>