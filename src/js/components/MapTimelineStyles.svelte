<script>
	export let mapId;
	let hexagonFillColor = "#ffffff"

	export let paintStyles = {
		[`${mapId}-state-names`]: {
			"text-color": "rgba(118, 116, 108, 1)",
      "text-halo-color": "rgba(255,255,255,0.7)",
      "text-halo-width": 0.8
		},
		[`${mapId}-city-circles`]: {
      'circle-color': 'white',
      'circle-opacity': 1,
      'circle-radius': 3,
      "circle-opacity-transition": {"duration": 300,"delay": 0},
      "circle-stroke-width": 1,
      "circle-stroke-color": 'black',
      "circle-stroke-opacity": 1
		},
    [`${mapId}-city-names`]: {
      'text-color':"#333",
      'text-halo-color':"rgba(255,255,255,0.8)",
      "text-halo-width": 2
    },
    [`${mapId}-investor-sfrs`]: {
      'icon-opacity': ['case', ['==', ['feature-state', 'highlighted'], true], 1,0]
    },
    [`${mapId}-investor-sfrs-faded`]: {
      'icon-opacity': ['case', ['==', ['feature-state', 'highlighted'], true], 1,0]
    },
		[`${mapId}-north-carolina-outline`]: {
      'line-color': "black",
      'line-width': 0.5,
    },
		[`${mapId}-county-line`]: {
      'line-color': "#d93a4c",
      'line-width': 0,
    },
		[`${mapId}-north-carolina-fill`]: {
      'fill-color': "#ffe9e9",
      'fill-opacity': 0
    },
    [`${mapId}-surrounding-state-fill`]: {
      'fill-color': '#ffffff',
      'fill-opacity': 0.8,
      "fill-opacity-transition": {
        "duration": 300,
        "delay": 0
      }
    },
    [`${mapId}-surrounding-state-line`]: {
      'line-color': "#f4f2f3", //"#E7E3E5",
      'line-opacity': 0.9,
      'line-width': 1,
    }
	}

	export let layoutStyles = {
		[`${mapId}-state-names`]: {
			"text-font": ["Lato Regular"],
      "text-size": ["interpolate", ["linear"], ["zoom"],3,10,5,11,6,16],
      'text-field': ['format', ['upcase', ['get', 'description']]],
      "visibility": "visible",
      "text-padding": 2,
      "text-transform": "uppercase",
      "text-letter-spacing": 0.1,
      "text-allow-overlap": true
    },
    [`${mapId}-city-names`]: {
      "text-font": ["Lato Regular"],
      "text-size": {
        "base": 1.2,
        "stops": [[7, 15], [11, 15]]
      },
      'text-field': ['get', 'description'],
      "text-anchor": ['get', 'anchor'],
      "text-offset": [0, 0],
      "text-max-width": 8,
      "text-allow-overlap": true
    },
    [`${mapId}-investor-sfrs`]: {
      'icon-allow-overlap': true,
      'icon-anchor': "center",
      'icon-image': 'hexagon',
      'icon-size': 0.3
    },
    [`${mapId}-investor-sfrs-faded`]: {
      'icon-allow-overlap': true,
      'icon-anchor': "center",
      'icon-image': 'hexagon_fade',
      'icon-size': 0.3
    }
	}


</script>