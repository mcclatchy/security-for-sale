<script>
	let hexagonFillColor = "#ffffff"

	export let paintStyles = {
		"investor-sfrs": {
	    'circle-color': ['get', 'color'],
	    'circle-opacity': ['case', ['==', ['feature-state', 'highlighted'], true], 0.7,0],
	    'circle-radius': 3,
	    "circle-opacity-transition": {"duration": 300,"delay": 0}
		},
		"investor-sfrs2": {
	    'circle-color': ['get', 'color'],
	    'circle-opacity': ['case', ['==', ['feature-state', 'highlighted'], true], 0.7,0],
	    'circle-radius': 3,
	    "circle-opacity-transition": {"duration": 300,"delay": 0}
		},
		'north-carolina-outline': {
      'line-color': "black",
      'line-width': 2,
    },
		'north-carolina-fill': {
      'fill-color': "white",
      'fill-opacity': 1
    },
    "mecklenburg-grid-fill": {
			'fill-color': hexagonFillColor,
			'fill-opacity': ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0],
			"fill-opacity-transition": {"duration": 300,"delay": 0}
    },
    "mecklenburg-grid-line": {
    	'line-color': 'rgba(230,230,230,1)',
			'line-width': 1,
			'line-opacity': ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
    },
    "the-triangle-grid-fill": {
    	'fill-color': hexagonFillColor,
			'fill-opacity':  ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0],
			"fill-opacity-transition": {"duration": 300,"delay": 0}

    },
    "the-triangle-grid-line": {
			'line-color': 'rgba(230,230,230,1)',
			'line-width': 1,
			'line-opacity': ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
    }
	}

	export let layoutStyles = {
	}


</script>