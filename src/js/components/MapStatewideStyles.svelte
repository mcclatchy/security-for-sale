<script>
  import { makeColors, isMobile } from "../modules/utils.js";

  let primaryColor = "#ffa4b1"
  let colors = ["#eecb9b", "#e7b48f", "#e09c85", "#da867b", "#c16677"] //makeColors(primaryColor, 1, 3, 0.1, 0.8)
  let stateOutlineColor = "rgb(150,150,150)"
	let stateBackgroundColor = "#fff" //makeColors(primaryColor, 0, 10, 0.97, 0.97)[0]
	let borderColor = 'rgb(213, 213, 213)'
	let hexagonFillColor = "#ffffff"
  let hexagonOutlineColor = "#aaaaaa"

	let highwayBorderOpacity = ["interpolate", ["linear"], ["zoom"], 3, 0, 8, 0, 11, 0.5, 14, 0]
	let highwayBorderLineWidth = ['match', ['get','highway'], 'primary', 2.5, 'motorway', 3.5, 'secondary', 2, 'tertiary', 0, 0]

	let highwayOpacity = ["interpolate", ["linear"], ["zoom"], 3, 0, 8, 0, 11, 1, 14, 1]
	let highwayLineWidth = ['match', ['get','highway'], 'primary', 1.5, 'motorway', 2.5, 'secondary', 1, 'tertiary', 0, 0]

	let streetOpacity = ["interpolate", ["linear"], ["zoom"], 3, 0, 8, 0, 14, 0, 15, 0.5]
	let streetLineWidth = ['match', ['get','highway'], 'residential', 5.5, 'turning_circle', 5.5, 'service', 4.5, 'secondary', 10.5, 1]


	// DEFAULT STYLE
	let highlightedOpacity = ['case', ['==', ['feature-state', 'highlighted'], true], 1, 0]

	export let paintStyles = {
		'state-names': {
			"text-color": "rgba(118, 116, 108, 1)",
      "text-halo-color": "rgba(255,255,255,0.7)",
      "text-halo-width": 0.8
		},
		'city-names': {
      'text-color': "#333",
      'text-halo-color': "rgba(255,255,255,0.8)",
      "text-halo-width": 2,
      'text-opacity': ["interpolate",["linear"],["zoom"],8,1,9,1,12,1,14,0]
		},
    'medium-city-names': {
      'text-color': "#333",
      'text-halo-color': "rgba(255,255,255,0.8)",
      "text-halo-width": 2,
      'text-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
    },
    'small-city-names': {
      'text-color': "#333",
      'text-halo-color': "rgba(255,255,255,0.8)",
      "text-halo-width": 2,
      'text-opacity': isMobile.any() ? 0 : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
    },
    'zoom-city-names': {
      'text-color': "#333",
      'text-halo-color': "rgba(255,255,255,0.8)",
      "text-halo-width": 2,
      'text-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
    },
		"area-names": {
      'text-color': "rgba(90,90,90,1)",
      'text-halo-color': "rgba(255,255,255,0.8)",
      "text-halo-width": 2,
      'text-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
		},
    "icons": {
      'text-color': '#b1b1b1',
      'text-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0],
      'icon-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0],
      'icon-color': ['match', ['get', 'type'], 'airport', '#b1b1b1','#b1b1b1']
    },
		'north-carolina-outline': {
      'line-color': stateOutlineColor,
      'line-width': 1,
    },
		'north-carolina-fill': {
      'fill-color': stateBackgroundColor,
      'fill-opacity': 1
    },
		'nc-highway-border': {
      'line-color': borderColor,
      'line-width': isMobile.any() ? 2 : 3.5,
      'line-opacity': ["interpolate", ["linear"], ["zoom"], 3, 1, 8, 1, 11, 0, 14, 0]
    },
    'nc-highway': {
      'line-color': "white",
      'line-width': isMobile.any() ? 1 : 2.5,
      'line-opacity': ["interpolate", ["linear"], ["zoom"], 3, 1, 8, 1, 11, 0, 14, 0]
    },
		'highway-border': {
      'line-color': borderColor,
      'line-width': highwayBorderLineWidth,
      'line-opacity': highwayBorderOpacity
    },
    'mecklenburg-highway': {
      'line-color': "white",
      'line-width': isMobile.any() ? 2 : 4.5,
      'line-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
    },
		'mecklenburg-highway-border': {
      'line-color': 'rgba(150,150,150,1)',
      'line-width': isMobile.any() ? 3 : 5.5,
      'line-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
    },
    'triangle-highway': {
      'line-color': "white",
      'line-width': isMobile.any() ? 2 : 4.5,
      'line-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
    },
		'triangle-highway-border': {
      'line-color': 'rgba(150,150,150,1)',
      'line-width': isMobile.any() ? 3 : 5.5,
      'line-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
    },
    'highway': {
      'line-color': "white",
      'line-width': highwayLineWidth,
      'line-opacity': highwayOpacity
    },
    'mecklenburg-outline': {
			'line-color': 'rgba(150,150,150,1)',
			'line-width': 2,
			'line-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
		},
    'the-triangle-outline': {
			'line-color': 'rgba(150,150,150,1)',
			'line-width': 2,
			'line-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
		},
    'street': {
    	'line-color': "white",
			'line-width': isMobile.any() ?
        ['match', ['get','highway'],'residential', 3.5,'turning_circle', 4.5,'service', 3.5,'secondary', 5.5,0] :
        ['match', ['get','highway'],'residential', 8.5,'turning_circle', 10.5,'service', 8.5,'secondary', 12.5,0],
			'line-opacity': isMobile.any() ? ["interpolate", ["linear"], ["zoom"],3,0,8,0,9,0,13,1] : ["interpolate", ["linear"], ["zoom"],3,0,8,0,14,1]
    },
    'street-border': {
      'line-color': isMobile.any() ? 'rgba(200,200,200,1)' : 'rgba(150,150,150,1)',
      'line-width': isMobile.any() ?
        ['match', ['get','highway'],'residential', 4.5,'turning_circle', 5.5,'service', 4.5,'secondary', 6.5,0] :
        ['match', ['get','highway'],'residential', 9.5,'turning_circle', 11.5,'service', 9.5,'secondary', 13.5,0],
      'line-opacity': isMobile.any() ? ["interpolate", ["linear"], ["zoom"],3,0,8,0,9,0,13,0,14,0.8] : ["interpolate", ["linear"], ["zoom"],3,0,8,0,14,0,15,0.8]
    },
    'turning-circle-border': {
    	'circle-color': isMobile.any() ? 'rgba(200,200,200,1)' : 'rgba(150,150,150,1)',
			'circle-opacity': 0,
			'circle-radius': isMobile.any() ?
        ["interpolate",["linear"],["zoom"],3,2,10,2,14,3] :
        ["interpolate",["linear"],["zoom"],3,2,10,2,14,9],
			"circle-opacity-transition": {"duration": 300,"delay": 0},
			"circle-stroke-width": 1,
			"circle-stroke-color": isMobile.any() ? 'rgba(200,200,200,1)' : 'rgba(150,150,150,1)',
			"circle-stroke-opacity": isMobile.any() ? ["interpolate", ["linear"], ["zoom"],3,0,8,0,9,0,13,0,14,0.7] : ["interpolate", ["linear"], ["zoom"],3,0,8,0,14,0,15,0.7]
    },
    "turning-circle-fill": {
    	'circle-color': "white",
			'circle-opacity': isMobile.any() ? ["interpolate", ["linear"], ["zoom"],3,0,8,0,9,0,13,1] : ["interpolate",["linear"],["zoom"],3,0,8,0,14,0,15,1],
			'circle-radius': isMobile.any() ?
        ["interpolate",["linear"],["zoom"],3,2,10,2,14,3] :
        ["interpolate",["linear"],["zoom"],3,2,10,2,14,9],
			"circle-opacity-transition": {"duration": 300, "delay": 0}
    },
    "surrounding-state-fill": {
      'fill-color': '#FCFCFC',
      'fill-opacity': 0.85,
      "fill-opacity-transition": {
        "duration": 300,
        "delay": 0
      }
    },
    "surrounding-state-line": {
      'line-color': "rgba(210,210,210,1)",
      'line-width': 0.5,
    },
    "mecklenburg-grid-fill": {
			'fill-color': hexagonFillColor,
      'fill-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,0.7,12,0.7,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,0.7,12,0.7,14,0],
			"fill-opacity-transition": {"duration": 300,"delay": 0}
    },
    "mecklenburg-grid-line": {
    	'line-color': 'rgba(230,230,230,1)',
			'line-width': 0.5,
			'line-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
    },
    "the-triangle-grid-fill": {
    	'fill-color': hexagonFillColor,
      'fill-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,0.7,12,0.3,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,0.7,12,0.3,14,0],
			"fill-opacity-transition": {"duration": 300,"delay": 0}

    },
    "the-triangle-grid-line": {
			'line-color': 'rgba(230,230,230,1)',
			'line-width': 0.5,
			'line-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
    },
    "investor-sfr-hexagon-fill": {
			'fill-color': ['get', 'color'],
			'fill-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,1,8,0,14,0] : ["interpolate",["linear"],["zoom"],8,1,9,0,14,0],
			"fill-opacity-transition": {"duration": 300,"delay": 0}
    },
    "investor-sfr-hexagon-line": {
			'line-color': hexagonOutlineColor, //'#D7D0D4',
			"line-opacity": isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0.2,8,0,10,0,14,0] : ["interpolate",["linear"],["zoom"],8,0.2,9,0,10,0,14,0],
			'line-width': 1
    },
    "home-fill": {
		  'fill-color': ["interpolate",["linear"],["zoom"],3,"rgba(125,125,125,0)",13,colors[3],14,['get', 'color'],15,['get', 'color']],
		  'fill-opacity': ["interpolate",["linear"],["zoom"],3,0,13,0,14,1,15,1],
		  "fill-opacity-transition": {"duration": 300,"delay": 0}
    },
    "home-line": {
			'line-color': ["interpolate",["linear"],["zoom"],3,"rgba(125,125,125,0)",13,colors[3],14,['get', 'color'],15,['get', 'color']],
			'line-opacity': ["interpolate",["linear"],["zoom"],3,0,13,0,14,0.7,15,1],
			"line-opacity-transition": {"duration": 300,"delay": 0}
    },
    "zoomed-hexagon-fill": {
			'fill-color': ['get', 'color'],
			'fill-opacity':  isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,0,10,1,12,1,14,0],
			"fill-opacity-transition": {"duration": 300,"delay": 0}
    },
    "zoomed-hexagon-line": {
			'line-color': 'white', //'#D7D0D4',
			"line-opacity": isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,0,10,1,12,1,14,0],
			'line-width': 0.1
    },
    "mecklenburg-hexagon-fill": {
			'fill-color': ['get', 'color'],
			'fill-opacity':  isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0],
			"fill-opacity-transition": {"duration": 300,"delay": 0}
    },
   	"mecklenburg-hexagon-line": {
			'line-color': hexagonOutlineColor, //'#D7D0D4',
			"line-opacity": isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,0.3,12,0.3,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,0.3,12,0.3,14,0],
			'line-width': 0.1
   	},
    "the-triangle-hexagon-fill": {
			'fill-color': ['get', 'color'],
			'fill-opacity':  isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0],
			"fill-opacity-transition": {"duration": 300,"delay": 0}
    },
   	"the-triangle-hexagon-line": {
			'line-color': hexagonOutlineColor, //'#D7D0D4',
			"line-opacity": isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,0.3,12,0.3,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,0.3,12,0.3,14,0],
			'line-width': 0.1
   	}
	}

	export let layoutStyles = {
		'state-names': {
			"text-font": ["Lato Regular"],
      "text-size": ["interpolate", ["linear"], ["zoom"],3,10,5,11,6,16],
      'text-field': ['format', ['upcase', ['get', 'description']]],
      "visibility": "visible",
      "text-padding": 2,
      "text-transform": "uppercase",
      "text-letter-spacing": 0.1,
      "text-allow-overlap": true
    },
    "city-names": {
      "text-font": ["step", ["zoom"], ["literal", ["Lato Regular"]], 8, ["literal", ["Lato Regular"]], 9, ["literal", ["Lato Bold"]] ],
      "text-size": {
        "base": 1.2,
        "stops": [[7, 17], [9, 22], [11, 22]]
      },
      'text-field': ['get', 'description'],
      "text-anchor": ['get', 'anchor'],
      "text-offset": [0, 0],
      "text-max-width": 8,
      "text-allow-overlap": true
    },
    "small-city-names": {
      "text-font": ["Lato Regular"],
      "text-size": {
        "base": 1.2,
        "stops": [[7, 10], [9, 14], [11, 14]]
      },
      'text-field': ['get', 'description'],
      "text-anchor": ['get', 'anchor'],
      "text-offset": [0, 0],
      "text-max-width": 8,
      "text-allow-overlap": true
    },
    "medium-city-names": {
      "text-font": ["Lato Bold"],
      "text-size": {
        "base": 1.2,
        "stops": [[7, 14], [9, 19], [11, 19]]
      },
      'text-field': ['get', 'description'],
      "text-anchor": ['get', 'anchor'],
      "text-offset": [0, 0],
      "text-max-width": 8,
      "text-allow-overlap": true
    },
    "zoom-city-names": {
      "text-font": ["Lato Regular"],
      "text-size": {
        "base": 1.2,
        "stops": [[7, 10], [9, 14], [11, 17]]
      },
      'text-field': ['get', 'description'],
      "text-anchor": ['get', 'anchor'],
      "text-offset": [0, 0],
      "text-max-width": 8,
      "text-allow-overlap": true
    },
    "area-names": {
      "text-font": ["Lato Regular"],
      "text-size": {
        "base": 1.2,
        "stops": [[7, 16], [11, 22], [11, 22]]
      },
      'text-field': ['get', 'description'],
      "text-anchor": ['get', 'anchor'],
      "text-offset": [0, 0],
      "text-max-width": 2,
      "text-transform": "uppercase",
      "text-allow-overlap": true
    },
		'street': {
			'line-cap': 'round'
		},
		'street-border': {
			'line-cap': 'round'
		},
		'nc-highway': {
			'line-cap': 'round'
		},
		'nc-highway-border': {
			'line-cap': 'round'
		},
    'icons': {
      "text-font": ["Lato Regular"],
      "text-size": isMobile.any() ? ["interpolate", ["linear"], ["zoom"],3,5,5,6,6,7] : ["interpolate", ["linear"], ["zoom"],3,5,5,6,6,10],
      'text-field': ['format', ['upcase', ['get', 'description']]],
      'text-offset': ['match', ['get', 'type'], 'interstate', ["literal", [0, 0.125]], 'intrastate', ["literal", [0, 0]], ["literal", [0, 0.25]]],
      "visibility": "visible",
      "text-padding": 2,
      "text-transform": "uppercase",
      "text-letter-spacing": 0.05,
      "text-allow-overlap": true,
      'icon-allow-overlap': true,
      'text-anchor': ['get', 'anchor'],
      'icon-anchor': ['get', 'anchor'],
      'icon-image': ['get', 'type'],
      'icon-size': isMobile.any() ? 0.08 : 0.13
    }
	}


</script>