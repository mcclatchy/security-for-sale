<script>
  import { layersDrawn } from '../modules/store.js';
  import MapLayer from './MapLayer.svelte';

  export let id = null;
  export let layerType = null;
  export let layerOrder = [];
  export let mapId = "map";
  export let drawn = false;
  export let highlighted = null;

  export let paintStyles = {};
  export let layoutStyles = {};

  let paintStyle = {};
  if (paintStyles.hasOwnProperty(id)) {
    paintStyle = paintStyles[id]
  }


  let layoutStyle = {};
  if (layoutStyles.hasOwnProperty(id)) {
    layoutStyle = layoutStyles[id]
  }
  

  let added = false;
  $: if (drawn && !added) {
    $layersDrawn = [...$layersDrawn, id];
    added = true;
  }

  // TODO: add defaults
  const defaultPaintStyles = {
    "fill": {
      'fill-color': "white",
      'fill-opacity': 1,
      "fill-opacity-transition": {
        "duration": 300,
        "delay": 0
      }
    },
    "line": {
      'line-color': "black",
      'line-width': 1,
    },
    "circle": {
      'circle-color': "gray",
      'circle-stroke-color': "black",
      'circle-raidus': 3
    },
    "symbol": {
      "text-color": "rgba(118, 116, 108, 1)",
      "text-halo-color": "rgba(255,255,255,0.7)",
      "text-halo-width": 0.8
    },
    "heatmap": {
      // Increase the heatmap weight based on frequency and property magnitude
      'heatmap-weight': ['step',['get', 'point_count'],1,50,2,100,1],
      // Increase the heatmap color weight weight by zoom level
      // heatmap-intensity is a multiplier on top of heatmap-weight
      'heatmap-intensity': ['interpolate',['linear'],['zoom'],0,1,9,3],
      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparancy color
      // to create a blur-like effect.
      'heatmap-color': ['interpolate',['linear'],['heatmap-density'],0,"#FFFCF8",0.2,"#eecb9b",0.4,"#e7b48f",0.6,"#e09c85",0.8,"#da867b",1,"#c16677"],
      // Adjust the heatmap radius by zoom level
      'heatmap-radius': ['interpolate',['linear'],['zoom'],0,2,9,10],
      // Transition from heatmap to circle layer by zoom level
      'heatmap-opacity': ['interpolate',['linear'],['zoom'],7,1,9,0]
    }
  }

  const defaultLayoutStyles = {
    "symbol": {
        "text-font": ["Lato Regular"],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          3,
          10,
          5,
          11,
          6,
          16
        ],
        'text-field': ['format', ['upcase', ['get', 'description']]],
        "visibility": "visible",
        "text-padding": 2,
        "text-transform": "uppercase",
        "text-letter-spacing": 0.1,
        "text-allow-overlap": true
      }
    }

  function getLayerAbove(layer, layerOrder) {
    const layerIndex = layerOrder.indexOf(layer)
    if (layerIndex <= 0) {
      return null;
    }
    return layerOrder[layerIndex - 1];
  }

  let drawBelow = getLayerAbove(id, layerOrder);
</script>

{#if $layersDrawn.includes(drawBelow) || !drawBelow && layerType}
   <MapLayer
    mapId={mapId}
    id={id}
    order={drawBelow}
    type={layerType}
    bind:drawn={drawn}
    select={true}
    hover={true}
    paint={paintStyle}
    layout={layoutStyle}
    highlight={highlighted !== null}
    highlighted={highlighted}
  />
{/if}