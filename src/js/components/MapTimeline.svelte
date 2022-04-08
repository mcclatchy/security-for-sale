<script>
  import { inview } from 'svelte-inview';
  import { onMount } from 'svelte';

  import Map from './Map.svelte';
  import MapLayer from './MapLayer.svelte';
  import MapLayerType from './MapLayerType.svelte';
  // import MapLegend from './MapLegend.svelte';
  import MapSection from './MapSection.svelte';
  import MapSource from './MapSource.svelte';
  import MapTitle from './MapTitle.svelte';
  import MapTooltip from './MapTooltip.svelte';
  import Scroller from "./Scroller.svelte";
  import { windowWidth, windowHeight, isPortrait } from '../modules/store.js';
  import { getTopo, hexToRgb, getColor, isMobile, isTablet, roundNum, makeColors } from "../modules/utils.js";

  export let dataPath;
  export let scrollY;

  let styleUrl = import.meta.env.PROD ? `${dataPath}/style-osm-grey.json` : `${dataPath}/style-osm-grey-dev.json`

  let bounds = { 
    north_carolina: [[ -84.821869, 33.842316 ], [-74.960621, 36.588117]],
    // north_carolina: [[ -83.821869, 33.842316 ], [-76.960621, 36.588117]],
    // charlotte: [[ -81.2621, 34.9688], [-80.3487, 35.5584]],
    charlotte: [[ -81.090043, 35.551569], [ -80.491228, 34.958323]],
    // neighborhood: [[-80.983599, 35.314817], [-80.963552, 35.305412]],
    neighborhood: [
          [
            -80.98297119140625,
            35.31751515265763
          ],
          [
            -80.9691846370697,
            35.30852397576001
          ]
        ],
    // raleigh: [[-78.995090999857, 35.51940899993547], [-78.25347799985875, 36.07710499993463]],
    raleigh: [[-79.1445,36.1579], [-78.1306,35.4883]],
    fuquay: [[-78.916888, 35.697333], [-78.687336, 35.527515]]
  };

  let residencesLoaded = false;
  let hovered;


  // Downloading ZIP code data
  let residences;
  const residencesBounds = {
    url: `${dataPath}/timeline.json`,
    layer: "timeline",
    code: "timestamp"
  };
  let idField = "investor"
  let allresidenceIds = []
  let investorColors = {
    "AMERICAN HOMES 4 RENT": "#2c719f", //dark blue
    "PROGRESS RESIDENTIAL": "#ffa4b1", //light pink
    "INVITATION HOMES": "#cf307a", //dark pink
    "AMHERST RESIDENTIAL": "#8dcaf0", //light blue
    "TRICON RESIDENTIAL": "#8ce38f", //light green
    "FIRSTKEY": "#1f8166", //dark green
    "" : "rgba(242,242,242,1)"
  }


  // ALL COLOR STYLING HERE
  let primaryColor = "#ffa4b1"
  let colors = makeColors(primaryColor, 1, 3, 0.1, 0.8)

  // let breaks = [1, 2, 50, 150, 1000, 2000, 2000, 10000]
  let breaks = [1, 2, 50, 150, 250, 10000]
  // let zoomedBreaks = [1, 2, 5, 10, 15, 20, 200, 100000]
  let zoomedBreaks = [1, 2, 5, 10, 15, 100000]
  let hexagonOutlineColor = "#aaaaaa"
  let hexagonFillColor = "#ffffff" //"#fefcf9"
  let stateOutlineColor = "#888888"
  let stateBackgroundColor = "white"

  let timestamps = []
  let residencesData = [];
  getTopo(residencesBounds.url, residencesBounds.layer)
  .then(res => {
    residences = res


    allresidenceIds = new Set()
    timestamps = new Set()
    res.features.forEach(d => {
      d.properties.opacity = 0.1
      d.properties.color = "#cb0076"
      let investor = d.properties[idField]
      d.properties.investorColor = investorColors.hasOwnProperty(investor) ? investorColors[investor] : "rgba(182,182,182,0.0)"
      d.properties.investorOpacity = investorColors.hasOwnProperty(investor) ? 1 : 0
      residencesData.push(d.properties)
      allresidenceIds.add(d.properties[idField])
      timestamps.add(d.properties.timestamp)
    });

    allresidenceIds = Array.from(allresidenceIds)
    timestamps = Array.from(timestamps)
  });


  let map = null;
  let progress = 0;
  let pointerEvents = "none";


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


  let customAttribution = ""

  function getUnixTimestamp() {
    const dateStr = '2022-06-22';
    const date = new Date(dateStr);
    const timestampInMs = date.getTime();
    const unixTimestamp = Math.floor(date.getTime() / 1000);
  }

  let northCarolina;
  const northCarolinaBounds = {
    url: `${dataPath}/north_carolina.json`,
    layer: "north_carolina",
    code: "GEOID"
  };
  // Get geometry for geojson maps
  getTopo(northCarolinaBounds.url, northCarolinaBounds.layer)
  .then(res => northCarolina = res);

  let northCarolinaDrawn = false;
  let northCarolinaLinesDrawn = false;
  let residencesDrawn = false;

  // let highlighted = [];
  let startTimestamp = 900633599
  let endTimestamp = 1615852800
  $: currentTimestamp = Math.round(startTimestamp + progress * (endTimestamp - startTimestamp))
  $: highlighted = timestamps.filter((x) => x <= currentTimestamp);
  $: currentDate = new Date(currentTimestamp * 1000);

  // $: console.log(Math.round(progress * 100) / 100, currentTimestamp, currentDate, highlighted.length)

  let mapId = "choroplethMap"
  let mapLoaded = false;

</script>
{#if progress <= 1 && progress >= 0}
<div class="timeline">
  {`${currentDate.getFullYear()}-${("0" + (currentDate.getMonth() + 1)).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)}`}
</div>
{/if}

<div id="choropleth-scroller">
  <Scroller bind:progress>
    <div slot="background" style={`height: ${$windowHeight}px; pointer-events: ${pointerEvents}`}>

      <div class="map" use:inview="{options}" on:change="{handleChange}">
        {#if residences && residencesData && (isInView || shouldLoad)}

        <Map id={mapId} style={styleUrl} bind:loaded={mapLoaded} location={{bounds: bounds.north_carolina}} bind:map={map} interactive={false} controls={false} attribution={"bottom-left"} customAttribution={customAttribution}>
        <!-- NORTH CAROLINA boundary -->

        {#if mapLoaded}
          <MapSource
            id="northCarolina"
            type="geojson"
            data={northCarolina}
            promoteId={northCarolinaBounds.code}
            mapId={mapId}
            maxzoom={24}>
            <MapLayerType layerType="line" mapId={mapId} id="north-carolina-outline"/>
            <MapLayerType layerType="fill" mapId={mapId} id="north-carolina-fill"  drawBelow="north-carolina-outline"/>
          </MapSource>
         
          <MapSource
            mapId={mapId}
            id="residences"
            type="geojson"
            data={residences}
            promoteId={residencesBounds.code}
            bind:loaded={residencesLoaded}
            maxzoom={24}>
            <MapLayerType layerType="circle" {progress} mapId={mapId} highlighted={highlighted} id="investor-sfrs" drawBelow="north-carolina-outline"/>
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
