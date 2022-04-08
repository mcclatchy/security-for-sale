<script>
  import { inview } from 'svelte-inview';
  import { onMount } from 'svelte';

  import Map from './Map.svelte';
  import MapLayer from './MapLayer.svelte';
  import MapLayerType from './MapLayerType.svelte';
  import MapTimelineStyles from './MapTimelineStyles.svelte'

  // import MapLegend from './MapLegend.svelte';
  import MapSection from './MapSection.svelte';
  import MapSource from './MapSource.svelte';
  import MapTitle from './MapTitle.svelte';
  import MapTooltip from './MapTooltip.svelte';
  import Scroller from "./Scroller.svelte";
  import { windowWidth, windowHeight, isPortrait } from '../modules/store.js';
  import { getAndFormatTopojsonData, hexToRgb, getColor, isMobile, isTablet, roundNum, makeColors } from "../modules/utils.js";

  export let dataPath;
  export let scrollY;

  let styleUrl = import.meta.env.PROD ? `${dataPath}/style-osm-grey.json` : `${dataPath}/style-osm-grey-dev.json`
  
  let hovered;
  let bounds = { 
    north_carolina: [[ -84.821869, 33.842316 ], [-74.960621, 36.588117]],
    charlotte: [[ -81.090043, 35.551569], [ -80.491228, 34.958323]],
    neighborhood: [[-80.98297119140625,35.31751515265763], [-80.9691846370697,35.30852397576001]],
    raleigh: [[-79.1445,36.1579], [-78.1306,35.4883]],
    fuquay: [[-78.916888, 35.697333], [-78.687336, 35.527515]]
  };
  let investorColors = {
    "AMERICAN HOMES 4 RENT": "#2c719f", //dark blue
    "PROGRESS RESIDENTIAL": "#ffa4b1", //light pink
    "INVITATION HOMES": "#cf307a", //dark pink
    "AMHERST RESIDENTIAL": "#8dcaf0", //light blue
    "TRICON RESIDENTIAL": "#8ce38f", //light green
    "FIRSTKEY": "#1f8166", //dark green
    "" : "rgba(242,242,242,1)"
  }

  let timestamps = []
  let residences;
  let northCarolina;
  let allDataLoaded = false;
  async function getAllData() {
    residences = await getAndFormatTopojsonData(`${dataPath}/timeline.json`, "timeline", "investor", null, null, investorColors, "rgba(182,182,182,0.0)")
    northCarolina = await getAndFormatTopojsonData(`${dataPath}/north_carolina.json`, "north_carolina")
    timestamps = [...new Set(residences.features.map(item => item.properties['timestamp']))];
    allDataLoaded = true;
  }
  getAllData()


  
  

  $: sections = $windowWidth && [
    {
      text: "",
      id: "first",
      bounds: bounds.north_carolina,
      horizontalPosition: "left",
      speed: 0.7,
    },
    {
      text: "",
      id: "second",
      bounds: bounds.north_carolina,
      horizontalPosition: "left",
      speed: 0.7,
    },
    {
      text: "",
      id: "third",
      bounds: bounds.north_carolina,
      horizontalPosition: "left",
      speed: 0.7,
    },
    {
      text: "",
      id: "third",
      bounds: bounds.north_carolina,
      horizontalPosition: "left",
      speed: 0.7,
    },
    {
      text: "",
      id: "third",
      bounds: bounds.north_carolina,
      horizontalPosition: "left",
      speed: 0.7,
    },
    {
      text: "",
      id: "third",
      bounds: bounds.north_carolina,
      horizontalPosition: "left",
      speed: 0.7,
    }
  ]





  let isInView;
  let offset = 5000;
  const options = {
    rootMargin: `${offset}px`,
    unobserveOnEnter: true,
  };

  const handleChange = ({ detail }) => (isInView = detail.inView);

  let triggerPixel;
  let shouldLoad = false;
  onMount(() => {
    if (map) {
      triggerPixel = map.offsetTop - offset
    }
  })
  $: if (scrollY > triggerPixel) {
    shouldLoad = true;
  }



  let startTimestamp = 900633599
  let endTimestamp = 1615852800
  $: currentTimestamp = Math.round(startTimestamp + progress * (endTimestamp - startTimestamp))
  $: highlighted = timestamps.filter((x) => x <= currentTimestamp);
  $: currentDate = new Date(currentTimestamp * 1000);


  let map = null;
  let mapId = "choroplethMap"
  let mapLoaded = false;
  let paintStyles;
  let layoutStyles;
  let layerOrder = [
    'investor-sfrs',
    'north-carolina-outline',
    'north-carolina-fill'
  ]
  let progress = 0;
  let pointerEvents = "none";
  let customAttribution = ""

  $: console.log($windowHeight)

</script>

<MapTimelineStyles
  bind:paintStyles
  bind:layoutStyles
/>

{#if progress <= 1 && progress >= 0}
<div class="timeline">
  {`${currentDate.getFullYear()}-${("0" + (currentDate.getMonth() + 1)).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)}`}
</div>
{/if}




<div id="choropleth-scroller">
  <Scroller bind:progress>
    <div slot="background" style={`width: 100%; height: ${$windowHeight}px; pointer-events: ${pointerEvents}`}>

      <div class="map" use:inview="{options}" on:change="{handleChange}">
        {#if allDataLoaded && (isInView || shouldLoad)}

          <Map id={mapId} style={styleUrl} bind:loaded={mapLoaded} location={{bounds: bounds.north_carolina}} bind:map={map} interactive={false} controls={false} attribution={"bottom-left"} customAttribution={customAttribution}>

            {#if mapLoaded}
              <MapSource
                id="northCarolina"
                type="geojson"
                data={northCarolina}
                promoteId={"GEOID"}
                mapId={mapId}
                maxzoom={24}>
                <MapLayerType layerType="line" mapId={mapId} id="north-carolina-outline" {paintStyles} {layoutStyles} {layerOrder}/>
                <MapLayerType layerType="fill" mapId={mapId} id="north-carolina-fill" {paintStyles} {layoutStyles} {layerOrder}/>
              </MapSource>
             
              <MapSource
                mapId={mapId}
                id="residences"
                type="geojson"
                data={residences}
                promoteId={"timestamp"}
                maxzoom={24}>
                <MapLayerType layerType="circle" mapId={mapId} highlighted={highlighted} id="investor-sfrs" {paintStyles} {layoutStyles} {layerOrder}/>
              </MapSource>
            {/if}

          </Map>
        {/if}
      </div>



    </div>

    <div slot="foreground">




      <div style={`height: ${$windowHeight}px; display: flex;
      display: -webkit-flex; justify-content: center;`}/>
      {#each sections as section}

        <div style={`height: ${1.25 * $windowHeight}px; z-index: 2; position: relative; pointer-events: none;`}>
<!--           <MapSection
            {section}
            map={choroplethMap}
          /> -->
        </div>
      {/each}
      <div style={`height: ${0.5 * $windowHeight}px; display: flex;
      display: -webkit-flex; justify-content: center;`}/>
    </div>
  </Scroller>
  <div id="after-map"/>

</div>  

<style>
  .timeline {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0%);
    padding-top: 20px;
    font-size: 40px;
    font-family: monospace;
  }
</style>
