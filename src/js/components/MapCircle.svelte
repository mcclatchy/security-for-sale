<script>
  import MapLayer from './MapLayer.svelte';

  export let id = "fill"
  export let drawBelow = null;
  export let mapId = "map";
  export let drawn = false;
  export let data = null;
  export let highlighted = null;
  export let progress = null;

  export let paintStyles = {};
  export let layoutStyles = {};

  let opacity = null;

  let paintStyle = {
    'circle-color': "gray",
    'circle-stroke-color': "black",
    'circle-raidus': 3
  };
  if (paintStyles.hasOwnProperty(id)) {
    paintStyle = paintStyles[id]
  }

  let layoutStyle = null;
  if (layoutStyles.hasOwnProperty(id)) {
    layoutStyle = layoutStyles[id]
  }
  
  
  // ANIMATED MAP
  //   paint={{
  //   'circle-color': ['get', 'investorColor'],
  //   'circle-opacity': ['case',
  //     ['==', ['feature-state', 'highlighted'], true], 0.7,
  //     0
  //   ],
  //   'circle-radius': 3,
  //   "circle-opacity-transition": {
  //     "duration": 300,
  //     "delay": 0
  //   }
  // }}

</script>


<MapLayer
  mapId={mapId}
  id={id}
  bind:drawn={drawn}    
  highlight={true}
  {highlighted}
  clickIgnore={true}
  type="circle"
  opacity={opacity}
  opacityKey={"circle-opacity"}
  paint={paintStyle}
  layout={layoutStyle}
/>