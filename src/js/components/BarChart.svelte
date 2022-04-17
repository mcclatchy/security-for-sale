<script>
  import { nearestDate } from "../modules/utils.js";

	export let progress = null;
	export let bufferWidth = 0;
	export let baselineWidth = 100;
	export let timestampsAggregate;
	export let timestampsCumulative;
	export let timestamp;
	export let orientation = "vertical"; // horizontal, vertical


	// TODO: .3 and .06 are still manually derived
	// I could derive these from the lat/lon of the points instead
	$: leftFillerWidth = 100 * (.3 * baselineWidth / 100) + bufferWidth;
	$: rightFillerWidth = 100 * (.06 * baselineWidth / 100) + bufferWidth;
	$: barContainerWidth = 100 - leftFillerWidth - rightFillerWidth;

	let data = timestampsCumulative
	let max = 26758;

	let allTimestamps = Object.keys(data);
	$: nearestTimestamp = allTimestamps[nearestDate(allTimestamps, timestamp)].toString()
	$: barChartData = data[nearestTimestamp]
	let years = ["pre-2010", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021"]
	$: barChartTotals = barChartData && years && data[allTimestamps[allTimestamps.length - 1]]

	let barStaticDimension = 100 / years.length;
	let numPerHexagon = 1000
	let numHexagons = [...Array(Math.ceil(max / numPerHexagon)).keys()]

	$: staticDimension = orientation === "vertical" ? "width" : "height"
	$: dynamicDimension = orientation === "vertical" ? "height" : "width"
	$: position = orientation === "vertical" ? "left" : "top"

</script>

<div class={`outer-container-${orientation}`}>
	<div class="left-filler" style={`${staticDimension}: ${leftFillerWidth}%`}/>
	<div class={`chart-container-${orientation}`} style={`${staticDimension}: ${barContainerWidth}%;`}>
		{#if orientation === "horizontal"}
			<div class="axis-horizontal">
				{#each years as year, i}
					<div class="axis-label-horizontal" style={`
						${staticDimension}: ${barStaticDimension}%;
						${position}: ${barStaticDimension * i}%
					`}>
					<p>
						{year}
					</p>
					</div>
				{/each}
			</div>
		{/if}


		<div class={`bar-container-${orientation}`} style={`
			${staticDimension}: 100%;
		`}>
			{#each years as year, i}
				<div class={`bar-${orientation}`} style={`
					${staticDimension}: ${barStaticDimension}%;
					${dynamicDimension}: ${(100 - barChartData[year]["total"] / barChartTotals[year]["total"] * 100 * barChartTotals[year]["total"] / max) }%;
					${position}: ${barStaticDimension * i}%
				`}>
					{#if barChartData[year]["total"] > 0}
						<div class={`bar-label-${orientation}`}>
							<p>
								{barChartData[year]["total"]}
							</p>
						</div>
					{/if}
				</div>
				<div class={`hexagon-layer-${orientation}`} style={`
					${staticDimension}: ${barStaticDimension}%;
					${position}: ${barStaticDimension * i}%
				`}>
					{#each numHexagons as numHexagon}
						<svg class={`hexagon-${orientation}`}  viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" version="1.1">
						    <polygon style="fill:#c16677;" points="148,200 52,200 4,100 52,16.8615612366939 148,16.8615612366939 200,100"/>
						</svg>
					{/each}
				</div>
			{/each}
		</div>

		{#if orientation === "vertical"}
			<div class="axis-vertical">
				{#each years as year, i}
					<div class="axis-label-vertical" style={`
						${staticDimension}: ${barStaticDimension}%;
						${position}: ${barStaticDimension * i}%
					`}>
						{year}
					</div>
				{/each}
			</div>
		{/if}
	</div>
	<div class="right-filler" style={`${staticDimension}: ${rightFillerWidth}%`}/>
</div>


<style>
	.chart-container-vertical {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.chart-container-horizontal {
		height: 100%;
		display: flex;
		flex-direction: row;
	}
	.axis-vertical {
		padding-top: 5px;
		width: 100%;
		height: 20px;
		position: relative;
	}
	.axis-horizontal {
		margin-right: 10px;
		height: 100%;
		width: 50px;
		position: relative;
		display: flex;
	  justify-content: center;
	  align-content: center;
	  flex-direction: column;
	}
	.axis-label-vertical {
		position: absolute;
		font-size: 10px;
		color: darkgray;
		text-align: center;
	}
	.axis-label-horizontal {
		width: 100%;
		position: absolute;
		
		display: flex;
	  justify-content: center;
	  align-content: center;
	  flex-direction: column;
	}
	.axis-label-horizontal p {
		font-size: 10px;
		color: darkgray;
		text-align: right;
	}

	.outer-container-vertical {
		height: 100%;
		width: 100%;
		display: flex;
		display: -webkit-flex;
		flex-direction: row;
		-webkit-flex-direction: row;
	}
	.outer-container-horizontal {
    padding: 0 20px;
		height: 100%;
		max-width: 100%;
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		-webkit-flex-direction: column;
	}
	.left-filler {
		height: 100%;
	}
	.right-filler {
		height: 100%;
	}
	.bar-container-vertical {
		position: relative;
		height: 100%;
		width: 64%;
		display: flex;
		display: -webkit-flex;
		flex-direction: row;
		-webkit-flex-direction: row;
	}
	.bar-container-horizontal {
		position: relative;
		height: 100%;
		width: 70%;
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		-webkit-flex-direction: column;
	}

	.bar-vertical {
		height: 100%;
		background:  white;
		border: 1px solid white;
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		-webkit-flex-direction: column;
		justify-content: flex-end;
		position: absolute;
		z-index: 2;
	}
	.bar-horizontal {
		height: 100%;
		background:  white;
		border: 1px solid white;
		display: flex;
		display: -webkit-flex;
		flex-direction: row;
		-webkit-flex-direction: row;
		justify-content: flex-start;
		align-self: flex-end;
		position: absolute;
		z-index: 2;
	}


	.bar-label-vertical {
    align-self: flex-end;
    margin-top: auto;
    margin: 0 auto;
    padding: 0;
	}
	.bar-label-horizontal {
    align-self: flex-start;
    margin-top: auto;
    margin: auto 0;
    padding-left: 5px;
	}
	.bar-label-vertical p {
		margin: 0 auto !important;
		font-family: sans-serif;
		font-size: 14px;
		font-weight: bold;
		color: #AA5867;
		padding-bottom: 3px;
		display: none;
	}
	.bar-label-horizontal p {
		margin: 0 auto !important;
		font-family: sans-serif;
		font-size: 14px;
		font-weight: bold;
		color: #AA5867;
		padding-right: 3px;
		display: none;
	}
	.hexagon-layer-vertical {
		position: absolute;
		top:  0;
		padding: 0 0px;
		height: 100%;
		width: 100%;
		display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
	}
	.hexagon-layer-horizontal {
		position: absolute;
		right:  0;
		padding-right: 0 0px;
		height: 100%;
		width: 100%;
		display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
	}
	.hexagon-vertical {
    margin-top: auto;
    align-self: flex-end;
    margin: 0 auto;
	}
	.hexagon-horizontal {
    margin-top: auto;
		align-self: center;
    margin: 0 auto;
    transform: rotate(90deg);
	}
</style>