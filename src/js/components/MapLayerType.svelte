<script>
  import { layersDrawn } from '../modules/store.js';
  import MapLayer from './MapLayer.svelte';

  export let id = null;
  export let layerType = null;
  export let layerOrder = null;
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

  console.log(id, highlighted)
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