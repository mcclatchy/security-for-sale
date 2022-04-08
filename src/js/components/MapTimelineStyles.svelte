<script>
	export let paintStyles = {
		"investor-sfrs": {
	    'circle-color': ['get', 'investorColor'],
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
    }
	}

	export let layoutStyles = {
	}


</script>