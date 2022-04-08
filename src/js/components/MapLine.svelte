<script>
  import { layersDrawn } from '../modules/store.js';
  import MapLayer from './MapLayer.svelte';

  export let id = "fill"
  export let drawBelow = null;
  export let mapId = "map";
  export let drawn = false;

  export let paintStyles = {};
  export let layoutStyles = {};

  let paintStyle = 
  if (paintStyles.hasOwnProperty(id)) {
    paintStyle = paintStyles[id]
  }


  let layoutStyle = null;
  if (layoutStyles.hasOwnProperty(id)) {
    layoutStyle = layoutStyles[id]
  }
  

  let added = false;
  $: if (drawn && !added) {
    $layersDrawn = [...$layersDrawn, id];
    added = true;
  }

</script>

{#if $layersDrawn.includes(drawBelow) || !drawBelow}
   <MapLayer
    mapId={mapId}
    id={id}
    order={drawBelow}
    type="line"
    bind:drawn={drawn}
    select={true}
    hover={true}
    paint={paintStyle}
    layout={layoutStyle}
  />
{/if}