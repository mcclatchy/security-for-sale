<script>
  import mapbox from '../../lib/mapbox-gl@1.13.2';
  import debounce from 'underscore/modules/debounce';

	//////////////////////////
	// Mapbox+D3 Connection
	//////////////////////////
	import { getContext, onMount } from 'svelte';
	import { selectAll, range, area, path, geoPath, select, geoTransform, curveCatmullRom } from  "d3";
  import { windowWidth, windowHeight } from '../modules/store.js';
  import { execResizeCallbackWithSuspend } from '../modules/utils.js';

	export let progressStart = 0;
	export let progressEnd = 1;
	export let progressFade = null;
	export let filepath = null;
	export let maskFilepath = null;
	export let data = null;
	export let maskData = null;
	export let idPrefix = null;
	export let scrollerId = null;
	export let scrollY = 0;
	export let maskWidth = "10"
	export let pathColor = "black"
	export let maskAnimate = false;
	export let opacityAnimate = true;
	export let fadeOut = false;
	export let layer = "lines" // "points"
	export let drawn = false;
	export let mapId;

	// POINTS
	export let pointRadius = 13;
	export let pointFill = "white";
	export let pointBorderColor = "black";
	export let pointBorderWidth = 4
	export let pointIconWidth = 15

	let isActive = true;
	const { getMap } = getContext(mapId);
	const map = getMap();

	// Get Mapbox map canvas container
	var canvas = map.getCanvasContainer();

	// Projection functions
	var pointTransform = geoTransform({point:projectPoint});
	var pathTransform = geoPath().projection(pointTransform);

	// Project GeoJSON coordinate to the map's current state
	function project(d) {
	    return map.project(new mapbox.LngLat(+d[0], +d[1]));
	}

	// Project any point (lon, lat) to map's current state
	function projectPoint(lon, lat) {
	    var point = map.project(new mapbox.LngLat(lon, lat));
	    this.stream.point(point.x, point.y);
	}

	//////////////
	// D3 stuff
	//////////////

	let maskPaths = []

	function drawLines(data, maskData) {
			let featureSVG = select(canvas)
				.append("svg")
				.attr("id", `${idPrefix}-route-svg`)
				.attr("class", `${idPrefix}-svg`)
				.style("position", "absolute")
				.style("overflow", "hidden")
				.style("pointer-events", "none")
				.style("top", 0)
				.attr("height", `${$windowHeight}px`)
				.attr("width", `${$windowWidth}px`)

	  for (var i = 0; i < data.features.length; i++) {
	  	let feature = data.features[i]
	  	let featureId = `${idPrefix}-svg-${i}`

			let pathId = `${idPrefix}-path-${i}`
			if (maskData && maskAnimate) {

		  	let maskFeature = maskData.features[i]
				let featureDefs = featureSVG.append("defs")

				featureDefs.append("path")
					.attr("class", `${idPrefix}-route`)
					.attr("d", pathTransform(feature))
					.attr('id', pathId)
					.attr("fill", pathColor)
					.attr("fill-rule", "nonzero")
					.attr("stroke-width", "1000")
			
				let maskId = `${idPrefix}-mask-${i}`
				let featureMask = featureDefs.append("mask")
					.attr("id", maskId)
					.style("mask-type", "luminance")
				featureMask.append("use")
					.attr("href", `#${pathId}`)
					.attr("stroke", "white")
					.attr("fill", "none")

				let maskPath = pathTransform(maskFeature)
				let maskPathId = `${idPrefix}-mask-path-${i}`
				featureMask.append("path")
					.attr("class", `${idPrefix}-route-mask`)
					.attr("id", maskPathId)
					.attr("d", maskPath)
					.attr("stroke-width", maskWidth)
					.attr("stroke", "black")
					.attr("fill", "none")
					.attr("stroke-dasharray", maskPath.totalLength + " " + maskPath.totalLength)
	  			.attr("stroke-dashoffset", maskPath.totalLength)

				let featureUse = featureSVG.append("use")
					.attr("href", `#${pathId}`)
					.attr("mask", `url(#${maskId})`)
					.style("-webkit-mask", `url(#${maskId})`)
					.attr("fill", pathColor)
					.attr("fill-rule", "nonzero")

				maskPaths.push(document.querySelector(`#${maskPathId}`))
			} else {
				featureSVG.append("path")
					.attr("class", `${idPrefix}-route`)
					.attr("d", pathTransform(feature))
					.attr('id', pathId)
					.attr("fill", pathColor)
					.attr("fill-rule", "nonzero")
					.attr("stroke-width", "1000")
					.attr("opacity", 0)
			}
		}
	}

	function drawPoints(data) {
		let featureSVG = select(canvas)
			.append("svg")
			.attr("id", `${idPrefix}-point-svg`)
			.attr("class", `${idPrefix}-svg`)
			.style("position", "absolute")
			.style("overflow", "hidden")
			.style("pointer-events", "none")
			.style("top", 0)
			.attr("height", `${$windowHeight}px`)
			.attr("width", `${$windowWidth}px`)
			.attr("z-index", 100000)

		for (var i = 0; i < data.features.length; i++) {
	  	let feature = data.features[i]
	  	let coordinates = feature.geometry.coordinates
	  	let transformedCoordinates = map.project(new mapbox.LngLat(coordinates[0], coordinates[1]));

			// featureSVG.append("circle")
			// 	.attr("class", `${idPrefix}-point`)
			// 	.attr("id", `${idPrefix}-point-${i}`)
   //      .attr("cx", transformedCoordinates.x)
   //      .attr("cy", transformedCoordinates.y)
   //      .attr("r", pointRadius)
   //      .style("fill", pointFill)
   //      .style("stroke-width", pointBorderWidth)
   //      .style("stroke", pointBorderColor)

      if (pointIconWidth > 0){
	      featureSVG.append("svg")
	      	.attr("class", `${idPrefix}-icon`)
	      	.attr("xmlns", "http://www.w3.org/2000/svg")
	      	.attr("viewBox", "0, 0, 400,400")
	      	.attr("fill", pointBorderColor)
	  	    .attr("width", `${pointIconWidth}px`)
					.attr("height",`${pointIconWidth}px`)
					.attr("x", transformedCoordinates.x - pointIconWidth / 2)
	        .attr("y", transformedCoordinates.y - pointIconWidth / 2)
	      	.append("path")
	      		.attr("d", "M191.955 6.889 C 163.073 35.391,109.174 41.420,74.452 20.033 C 65.563 14.558,65.950 14.384,55.658 28.500 C 41.178 48.359,25.940 78.200,19.912 98.500 L 18.279 104.000 199.930 104.000 L 381.581 104.000 377.695 91.500 C 372.087 73.456,353.173 39.266,338.167 20.047 L 334.300 15.095 326.243 19.623 C 287.906 41.170,242.227 36.916,210.707 8.863 C 201.548 0.711,198.537 0.394,191.955 6.889 M9.261 142.500 C 7.043 150.775,8.107 194.815,10.903 210.498 C 26.199 296.293,85.593 360.966,178.590 393.090 L 199.771 400.407 222.324 392.892 C 335.045 355.332,406.712 251.078,391.150 147.301 L 389.755 138.000 200.111 138.000 L 10.467 138.000 9.261 142.500")
      }
    }
	}

	function drawData(data, maskData) {
			if (layer === "lines") {
				drawLines(data, maskData)
			}
	    
			if (layer === "points") {
				drawPoints(data)
			}

	    // update();
	    drawn = true;
	    map.on("viewreset", update); // resize, viewreset, move, moveend
	    map.on("zoom", update); // resize, viewreset, move, moveend
	}

	function updateLines() {
    let routes = selectAll(`.${idPrefix}-route`)
    for (var i = 0; i < routes._groups[0].length; i++) {
			let coordinateString = pathTransform(data.features[i])
    	routes._groups[0][i].setAttribute("d", coordinateString)
    }
    if (maskData && maskAnimate) {
	    let masks = selectAll(`.${idPrefix}-route-mask`)
	    for (var z = 0; z < masks._groups[0].length; z++) {
	    	let transformedMask = pathTransform(maskData.features[z])
	    	masks._groups[0][z].setAttribute("d", transformedMask)
	    }
	  }
	}

	function updatePoints() {
    // let points = selectAll(`.${idPrefix}-point`)
	  let icons = selectAll(`.${idPrefix}-icon`)

		for (var i = 0; i < data.features.length; i++) {
	  	let feature = data.features[i]
	  	let coordinates = feature.geometry.coordinates
	  	let transformedCoordinates = map.project(new mapbox.LngLat(coordinates[0], coordinates[1]));
	  	// points._groups[0][i].setAttribute("cx", transformedCoordinates.x)
	  	// points._groups[0][i].setAttribute("cy", transformedCoordinates.y)
	  	if (pointIconWidth > 0) {
	  		icons._groups[0][i].setAttribute("x", transformedCoordinates.x - pointIconWidth / 2)
	  		icons._groups[0][i].setAttribute("y", transformedCoordinates.y - pointIconWidth / 2)
			}
	  }
	}

	// Update d3 shapes' positions to the map's current state
	function update() {
		if (isActive) {
			// console.log("update", idPrefix)
			selectAll(`.${idPrefix}-svg`)
				.attr("height", `${$windowHeight}px`)
				.attr("width", `${$windowWidth}px`)
			if (layer === "lines") {
				updateLines()
			}
			if (layer === "points") {
				updatePoints()
			}
		}
	}

	onMount(async function() {
		// Load map and dataset
		if (!data) {
			const response = await fetch(filepath);
    	data = await response.json();		
		}
		if (!maskData && maskAnimate) {
			const maskResponse = await fetch(maskFilepath);
    	maskData = await maskResponse.json();
		}
		if (data && !maskAnimate) {
			drawData(data, maskData);
		} else if (data && maskData) {
			drawData(data, maskData);
		}
	})

	function progressivelyDrawPath(path, scrollPercentage) {
		const pathLength = path.getTotalLength()
		if (scrollPercentage > 0) {

			if (scrollPercentage > 1) {
				scrollPercentage = 1
			}

		  var drawLength = -pathLength * (1 - scrollPercentage);
		  path.style.strokeDashoffset = pathLength - drawLength;
		  path.style.strokeDasharray = pathLength + ' ' + pathLength;

		} else if (scrollPercentage <= 0) {
			path.style.strokeDasharray = "none";
		}
	}

	let scroller = document.querySelector(scrollerId)
	let startPixel = progressStart * (scroller.clientHeight - $windowHeight) + scroller.offsetTop 
  let endPixel = progressEnd * (scroller.clientHeight - $windowHeight) + scroller.offsetTop
  let fadePixel = progressFade * (scroller.clientHeight - $windowHeight) + scroller.offsetTop

	const resizeObserver = new ResizeObserver(entries => {
		const elements = entries.map(entry => entry.target);
  	debounce(execResizeCallbackWithSuspend(elements, resizeObserver, () => {
		  	startPixel = progressStart * (scroller.clientHeight - $windowHeight) + scroller.offsetTop
		  	endPixel = progressEnd * (scroller.clientHeight - $windowHeight) + scroller.offsetTop
		  	fadePixel = progressFade * (scroller.clientHeight - $windowHeight) + scroller.offsetTop
		  	update()
  	}), 500);
	})

	resizeObserver.observe(document.body);
	let percentage = 0;

	$: if(drawn && scrollY && (scrollY > 0.8 * startPixel) && (scrollY < 1.2 * endPixel)) {
		percentage = Math.round((scrollY - startPixel) / (endPixel - startPixel) * 1000) / 1000

		// if (percentage >= -1 && percentage <= 2) {
		// 	isActive = true
		// 	console.log(percentage, idPrefix)
		// } else {
		// 	isActive = false
		// }

		if (layer === "lines") {
			if (maskAnimate && maskPaths) {
				maskPaths.forEach(m => progressivelyDrawPath(m, percentage))
			}
			
			if (fadeOut && scrollY > fadePixel) {
				selectAll(`.${idPrefix}-route`)
				.attr("opacity", 0)
			} else {
				selectAll(`.${idPrefix}-route`)
					.attr("opacity", opacityAnimate ? percentage : 1)
			}
		}

		if (layer === "points") {
			if (fadeOut && scrollY > fadePixel) {
				selectAll(`.${idPrefix}-point`)
					.style("opacity", 0)
				if (pointIconWidth > 0) {
					selectAll(`.${idPrefix}-icon`)
						.style("opacity", 0)
				}
			} else if (percentage < 0) {
				selectAll(`.${idPrefix}-point`)
					.style("opacity", 0)
				if (pointIconWidth > 0) {
					selectAll(`.${idPrefix}-icon`)
						.style("opacity", 0)
				}

			} else if (percentage > 0) {
				selectAll(`.${idPrefix}-point`)
					.style("opacity", 1)
					.style("stroke", pointBorderColor)
				selectAll(`.${idPrefix}-icon`)
					.style("opacity", 1)
					.style("fill", pointBorderColor)
			}
		}
	}
</script>