<script>
  import { inview } from 'svelte-inview';
  import { onMount } from 'svelte';

  import Map from './Map.svelte';
  import MapLayer from './MapLayer.svelte';
  import MapLayerType from './MapLayerType.svelte';
  // import MapLegend from './MapLegend.svelte';
  import MapSection from './MapSection.svelte';
  import MapSource from './MapSource.svelte';
  import MapStatewideTitle from './MapStatewideTitle.svelte';
  import MapTooltip from './MapTooltip.svelte';
  import MapStatewideStyles from './MapStatewideStyles.svelte'
  import Scroller from "./Scroller.svelte";
  import { windowWidth, windowHeight, isPortrait } from '../modules/store.js';
  import { getJsonData, formatTopojsonLayer, getAndFormatTopojsonData, makeColors } from "../modules/utils.js";

  export let assetPath;
  export let dataPath;
  export let scrollY;
  export let mapData;

  let styleUrl = import.meta.env.PROD ? `${dataPath}/style.json` : `${dataPath}/styleDev.json`

  let hovered;
  let bounds = { 
    // north_carolina: [[ -84.821869, 33.842316 ], [-74.960621, 36.588117]],
    north_carolina: [[ -84.521988, 33.645 ], [-75.1994, 37.2881695]],
    charlotte: [[ -81.090043, 35.551569], [ -80.491228, 34.958323]],
    // neighborhood: [[-80.98297119140625,35.31751515265763], [-80.9691846370697,35.30852397576001]],
    // neighborhood_zoom: [[-80.883012,35.295040], [-80.877740,35.295040]],
    neighborhood_zoom: [[-80.882474,35.294037], [-80.878985,35.293901]],
    neighborhood: [[-80.88741,35.29696], [-80.87243,35.28751]],
    raleigh: [[-79.1445,36.1579], [-78.1306,35.4883]],
    fuquay: [[-78.916888, 35.697333], [-78.687336, 35.527515]]
  };

  // ALL COLOR STYLING HERE
  let primaryColor = "#ffa4b1"
  let colors = makeColors(primaryColor, 1, 3, 0.1, 0.8)
  let backgroundColors = ["#FAFAFA", "#F4F4F4", "#EFEFEF", "#EAEAEA","#EAEAEA", "#EAEAEA", "#EAEAEA"]
  let breaks = [1, 2, 50, 150, 250, 10000]
  let zoomedBreaks = [1, 2, 5, 10, 15, 100000]
  let investorColors = {
    "AMERICAN HOMES 4 RENT": "#2c719f", //dark blue
    "PROGRESS RESIDENTIAL": "#ffa4b1", //light pink
    "INVITATION HOMES": "#cf307a", //dark pink
    "AMHERST RESIDENTIAL": "#8dcaf0", //light blue
    "TRICON RESIDENTIAL": "#8ce38f", //light green
    "FIRSTKEY": "#1f8166", //dark green
    "" : "rgba(242,242,242,1)"
  }

  // 485 -80.9836,35.1910 right
  // 485 -80.6208,35.1755 left
  // airport -80.9447,35.2097 center

  let labels;
  let stateNames;
  let cityNames;
  let mediumCityNames;
  let smallCityNames;
  let zoomCityNames;
  let areaNames;
  let icons;
  let homes;
  let hexagons;
  let zoomedHexagons;
  let mecklenburgHexagons;
  let mecklenburgGrid;
  let mecklenburgHighways;
  let triangleHexagons; 
  let triangleGrid;
  let triangleHighways;
  let turningCircles;
  let surroundingStates;
  let northCarolina;
  let northCarolinaHighways;
  let highways;
  let streets;
  let mecklenburg;
  let triangle;
  let allDataLoaded = false;
  async function getAllData() {
    labels = await getJsonData(`${dataPath}/labelsStatewide.json`, "state");
    stateNames = await formatTopojsonLayer(labels, "state");
    cityNames = await formatTopojsonLayer(labels, "city");
    mediumCityNames = await formatTopojsonLayer(labels, "city-medium");
    smallCityNames = await formatTopojsonLayer(labels, "city-small");
    zoomCityNames = await formatTopojsonLayer(labels, "city-zoom");
    areaNames = await formatTopojsonLayer(labels, "area");
    icons = await formatTopojsonLayer(labels, "icons");

    surroundingStates = await getAndFormatTopojsonData(`${dataPath}/surroundingStates.json`, "surroundingStates");
    northCarolina = await getAndFormatTopojsonData(`${dataPath}/northCarolina.json`, "northCarolina");
    northCarolinaHighways = await getAndFormatTopojsonData(`${dataPath}/northCarolinaHighways.json`, "northCarolinaHighways");
    hexagons = await getAndFormatTopojsonData(`${dataPath}/hexagons.json`, 'hexagons', "count", colors, breaks)
    zoomedHexagons = await getAndFormatTopojsonData(`${dataPath}/zoomedHexagons.json`, 'hexagons', "count", backgroundColors, zoomedBreaks)

    mecklenburgHexagons = await getAndFormatTopojsonData(`${dataPath}/mecklenburgHexagons.json`, 'hexagons', "count", colors, zoomedBreaks)
    mecklenburgGrid = await getAndFormatTopojsonData(`${dataPath}/mecklenburgGrid.json`, 'hexagons', "count", colors, zoomedBreaks)
    mecklenburg = await getAndFormatTopojsonData(`${dataPath}/mecklenburgOutline.json`, "mecklenburgOutline");
    mecklenburgHighways = await getAndFormatTopojsonData(`${dataPath}/mecklenburgHighways.json`, "mecklenburgHighways");
    homes = await getAndFormatTopojsonData(`${dataPath}/homes.json`, 'homes', "investor", null, null, investorColors, "#d5cc80")

    triangleHexagons = await getAndFormatTopojsonData(`${dataPath}/triangleHexagons.json`, 'hexagons', "count", colors, zoomedBreaks)
    triangleGrid = await getAndFormatTopojsonData(`${dataPath}/triangleGrid.json`, 'hexagons', "count", colors, zoomedBreaks)
    triangle = await getAndFormatTopojsonData(`${dataPath}/triangle.json`, "triangle");
    triangleHighways = await getAndFormatTopojsonData(`${dataPath}/triangleHighways.json`, "triangleHighways");

    turningCircles = await getAndFormatTopojsonData(`${dataPath}/turningCircles.json`, "turningCircles");
    highways = await getAndFormatTopojsonData(`${dataPath}/highways.json`, "highways");
    streets = await getAndFormatTopojsonData(`${dataPath}/streets.json`, "streets");
    allDataLoaded = true;
  }

  getAllData()

  let progress = 0;
  let pointerEvents = "none";

  let highlighted = ['Charlotte', 'Raleigh', 'Greensboro', 'Wilmington', 'Fayetteville', 'Asheville', 'North Carolina'];
  let hoverableIds = []
  $: if (progress >= 0.05 && progress < 0.16) {
    highlighted = ['Charlotte', 'Raleigh', 'Greensboro', 'Wilmington', 'Fayetteville', 'Asheville', 'North Carolina'];
    pointerEvents = "none"
    hoverableIds = []
  } else if (progress >= 0.16 && progress < 0.18) {
    pointerEvents = "none"
    highlighted = ['Charlotte', 'Huntersville', 'Pineville', 'Mecklenburg County', 'Raleigh', 'Durham', 'Chapel Hill']
    hoverableIds = []
  } else if (progress >= 0.18 && progress < 0.6) {
    pointerEvents = "none"
    highlighted = ['Charlotte', 'Huntersville', 'Pineville', 'Mecklenburg County', 'Raleigh', 'Durham', 'Chapel Hill']
    hoverableIds = []
  } else if (progress >= 0.6 && progress < 0.8) {
    pointerEvents = "none"
    highlighted = ['Charlotte', 'Huntersville', 'Pineville', 'Mecklenburg County', 'The Triangle', 'Raleigh', 'Durham', 'Chapel Hill']
    hoverableIds = []
  } else if (progress >= 0.8) {
    pointerEvents = "none"
    highlighted = ['Fuquay-Varina', 'Holly Springs', 'North Carolina']
    hoverableIds = []
  } else {
    highlighted = ['Charlotte', 'Raleigh', 'Greensboro', 'Wilmington', 'Fayetteville', 'Asheville', 'North Carolina'];
    pointerEvents = "none"
    hoverableIds = []
  }


  $: sections = $windowWidth && mapData && mapData.sections.map((section) => {
    return {
      text: section.text,
      id: section?.id,
      bounds: bounds[section.bounds],
      horizontalPosition: section.horizontalPosition,
      speed: section.speed,
      pitch: section?.pitch || 0,
      bearing: section?.bearing || 0
    }
  });

  let isInView;
  let offset = 3000;
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




  let map = null;
  let mapId = "statewide-map"
  let paintStyles;
  let layoutStyles;
  let topLayerDrawn = false;
  let customAttribution = ""

  let layerOrder = [
    'state-names',
    'city-names',
    'medium-city-names',
    'small-city-names',
    'zoom-city-names',
    'area-names',
    'icons',

    'mecklenburg-outline',
    'the-triangle-outline',
    'north-carolina-outline',
    'surrounding-state-line',
    'surrounding-state-fill',

    "investor-sfr-hexagon-line",
    "mecklenburg-hexagon-line",
    "the-triangle-hexagon-line",
    "home-line",


    "investor-sfr-hexagon-fill",
    "mecklenburg-hexagon-fill",
    "the-triangle-hexagon-fill",
    "home-fill",

    'mecklenburg-highway',
    'mecklenburg-highway-border',
    'triangle-highway',
    'triangle-highway-border',



    "zoomed-hexagon-line",
    "zoomed-hexagon-fill",


    "mecklenburg-grid-line",
    "the-triangle-grid-line",

    "mecklenburg-grid-fill",
    "the-triangle-grid-fill",
    
    'nc-highway',
    'highway',
    'street',
    "turning-circle-fill",

    'nc-highway-border',
    'highway-border',
    'street-border',
    'turning-circle-border',

  
    'north-carolina-fill'
  ]

  function setupIcon(filepath, imageName, width=200, height=200, sdf=false) {
    let img = new Image(width, height)
    img.crossOrigin = "Anonymous";
    img.onload = ()=>map.addImage(imageName, img, {sdf})
    img.src = filepath
  }

  $: if (map) {
    setupIcon(`${assetPath}/airport.svg`, 'airport')
    setupIcon(`${assetPath}/interstate.svg`, 'interstate')
    setupIcon(`${assetPath}/intrastate.svg`, 'intrastate', 200, 171)
  }

</script>

<MapStatewideStyles
  bind:paintStyles
  bind:layoutStyles
/>

<!-- WARNING: this is only for debugging - don't deploy this actively -->
<!-- <p class="debug" style={`opacity: 1;`}>
  <br />
  {Math.round(progress * 1000) / 1000 < Math.round(progress * 1000) / 1000 ? Math.round(progress * 1000) / 1000 : Math.round(progress * 1000) / 1000}
</p> -->


<div id="statewide-scroller">
  <Scroller bind:progress>
    <div slot="background" style={`width: 100%; height: ${$windowHeight}px; pointer-events: ${pointerEvents}`}>

      <div class="map" use:inview="{options}" on:change="{handleChange}">
        {#if allDataLoaded && (isInView || shouldLoad)}

        <Map id={mapId} style={styleUrl} location={{bounds: bounds.north_carolina}} bind:map={map} interactive={false} controls={false} attribution={"bottom-left"} customAttribution={customAttribution}>
          <!-- <MapLegend
            {progress}
          /> -->

          <!-- <MapStatewideTitle/> -->

          <!-- STATE NAMES -->
          <MapSource
            {mapId}
            id="states"
            type="geojson"
            data={stateNames}
            maxzoom={24}>
            <MapLayerType {layerOrder} layerType="symbol" bind:drawn={topLayerDrawn} {mapId} {paintStyles} {layoutStyles} id="state-names"/>
          </MapSource>

          {#if topLayerDrawn}
            <!-- CITY NAMES -->
            <MapSource
              {mapId}
              id="cities"
              type="geojson"
              data={cityNames}
              promoteId={"description"}
              maxzoom={24}>
              <MapLayerType {layerOrder} layerType="symbol" {highlighted} {mapId} {paintStyles} {layoutStyles} id="city-names"/>
            </MapSource>
            
            <!-- MEDIUM CITY NAMES -->
            <MapSource
              {mapId}
              id="medium-cities"
              type="geojson"
              data={mediumCityNames}
              promoteId={"description"}
              maxzoom={24}>
              <MapLayerType {layerOrder} layerType="symbol" {mapId} {paintStyles} {layoutStyles} id="medium-city-names"/>
            </MapSource>  

            <!-- SMALL CITY NAMES -->
            <MapSource
              {mapId}
              id="small-cities"
              type="geojson"
              data={smallCityNames}
              promoteId={"description"}
              maxzoom={24}>
              <MapLayerType {layerOrder} layerType="symbol" {mapId} {paintStyles} {layoutStyles} id="small-city-names"/>
            </MapSource>  

            <!-- ZOOM CITY NAMES -->
            <MapSource
              {mapId}
              id="zoom-cities"
              type="geojson"
              data={zoomCityNames}
              promoteId={"description"}
              maxzoom={24}>
              <MapLayerType {layerOrder} layerType="symbol" {mapId} {paintStyles} {layoutStyles} id="zoom-city-names"/>
            </MapSource>

            <!-- AREA NAMES -->
            <MapSource
              {mapId}
              id="areas"
              type="geojson"
              data={areaNames}
              promoteId={"description"}
              maxzoom={24}>
              <MapLayerType {layerOrder} layerType="symbol" {highlighted} {mapId} {paintStyles} {layoutStyles} id="area-names"/>
            </MapSource>

            <!-- LANDMARK ICONS -->
            <MapSource
              {mapId}
              id="landmarks"
              type="geojson"
              data={icons}
              promoteId={"description"}
              maxzoom={24}>
              <MapLayerType {layerOrder} layerType="symbol" {highlighted} {mapId} {paintStyles} {layoutStyles} id="icons"/>
            </MapSource>

            <!-- STATE OUTLINES -->
            <MapSource
              {mapId}
              id="northCarolina"
              type="geojson"
              data={northCarolina}
              promoteId={"GEOID"}
              maxzoom={24}>
              <MapLayerType {layerOrder} layerType="line" {mapId} id="north-carolina-outline" {paintStyles}/>
              <MapLayerType {layerOrder} layerType="fill" {mapId} id="north-carolina-fill" {paintStyles}/>
            </MapSource>

            <!-- NC HIGHWAYS -->
            <MapSource
              {mapId}
              id="nc-highways"
              type="geojson"
              data={northCarolinaHighways}
              promoteId={"FULLNAME"}
              maxzoom={24}
              >
              <MapLayerType {layerOrder} layerType="line" {mapId} id="nc-highway" {paintStyles} {layoutStyles}/>
              <MapLayerType {layerOrder} layerType="line" {mapId} id="nc-highway-border" {paintStyles} {layoutStyles}/>
            </MapSource>

            <!-- HIGHWAYS -->
            <MapSource
              {mapId}
              id="highways"
              type="geojson"
              data={highways}
              promoteId={"highway"}
              maxzoom={24}
              >
              <MapLayerType {layerOrder} layerType="line" {mapId} id="highway" {paintStyles}/>
              <MapLayerType {layerOrder} layerType="line" {mapId} id="highway-border" {paintStyles}/>
            </MapSource>

            <!-- SURROUNDING STATES -->
            <MapSource
              {mapId}
              id="surrounding-states"
              type="geojson"
              data={surroundingStates}
              promoteId={"postal"}
              maxzoom={24}
            >
              <MapLayerType {layerOrder} layerType="fill" {mapId} {paintStyles} id="surrounding-state-fill"/>
              <MapLayerType {layerOrder} layerType="line" {mapId} {paintStyles} {layoutStyles} id="surrounding-state-line"/>
            </MapSource>



            <!-- MECKLENBURG -->
            <MapSource
              {mapId}
              id="mecklenburg"
              type="geojson"
              data={mecklenburg}
              promoteId={"id"}
            >
              <MapLayerType {layerOrder} layerType="line" {mapId} {highlighted} id="mecklenburg-outline" {paintStyles}/>
            </MapSource>

            <MapSource
              {mapId}
              id="mecklenburg-grid"
              type="geojson"
              data={mecklenburgGrid}
              promoteId={"bin"}
              maxzoom={24}
            >
              <MapLayerType {layerOrder} layerType="fill" {mapId} {paintStyles} id="mecklenburg-grid-fill"/>
              <MapLayerType {layerOrder} layerType="line" {mapId} {paintStyles} {layoutStyles} id="mecklenburg-grid-line"/>
            </MapSource>
   
            <MapSource
              {mapId}
              id="mecklenburg-hexagons"
              type="geojson"
              data={mecklenburgHexagons}
              promoteId={"bin"}
              maxzoom={24}
            >
              <MapLayerType {layerOrder} layerType="fill" {mapId} {paintStyles} id="mecklenburg-hexagon-fill"/>
              <MapLayerType {layerOrder} layerType="line" {mapId} {paintStyles} {layoutStyles} id="mecklenburg-hexagon-line"/>
            </MapSource>

            <MapSource
              {mapId}
              id="mecklenburg-highways"
              type="geojson"
              data={mecklenburgHighways}
              promoteId={"rsu"}
              maxzoom={24}
              >
              <MapLayerType {layerOrder} layerType="line" {mapId} id="mecklenburg-highway" {paintStyles}/>
              <MapLayerType {layerOrder} layerType="line" {mapId} id="mecklenburg-highway-border" {paintStyles}/>
            </MapSource>
            

            <!-- NEIGHBORHOOD -->
            <MapSource
              {mapId}
              id="homes"
              type="geojson"
              data={homes}
              promoteId={"investor"}
              maxzoom={24}
            >
              <MapLayerType {layerOrder} layerType="fill" {mapId} {paintStyles} id="home-fill"/>
              <MapLayerType {layerOrder} layerType="line" {mapId} {paintStyles} {layoutStyles} id="home-line"/>
            </MapSource>

            <MapSource
              {mapId}
              id="streets"
              type="geojson"
              data={streets}
              promoteId={"highway"}
              maxzoom={24}
            >
              <MapLayerType {layerOrder} layerType="line" {mapId} {paintStyles} {layoutStyles} id="street"/>
              <MapLayerType {layerOrder} layerType="line" {mapId} {paintStyles} {layoutStyles} id="street-border"/>
            </MapSource>

            <MapSource
              {mapId}
              id="turning-circles"
              type="geojson"
              data={turningCircles}
              maxzoom={24}
            >
              <MapLayerType {layerOrder} layerType="circle" {mapId} {paintStyles} {layoutStyles} id="turning-circle-fill"/>
              <MapLayerType {layerOrder} layerType="circle" {mapId} {paintStyles} {layoutStyles} id="turning-circle-border"/>
            </MapSource>


            <!-- THE TRIANGLE -->
            <MapSource
              {mapId}
              id="the-triangle"
              type="geojson"
              data={triangle}
              promoteId={"id"}
            >
              <MapLayerType {layerOrder} layerType="line" {mapId} {highlighted} id="the-triangle-outline" {paintStyles}/>
            </MapSource>

            <MapSource
              {mapId}
              id="the-triangle-grid"
              type="geojson"
              data={triangleGrid}
              promoteId={"bin"}
              maxzoom={24}
            >
              <MapLayerType {layerOrder} layerType="fill" {mapId} {paintStyles} id="the-triangle-grid-fill"/>
              <MapLayerType {layerOrder} layerType="line" {mapId} {paintStyles} {layoutStyles} id="the-triangle-grid-line"/>
            </MapSource>

            <MapSource
              {mapId}
              id="the-triangle-hexagons"
              type="geojson"
              data={triangleHexagons}
              promoteId={"bin"}
              maxzoom={24}
            >
              <MapLayerType {layerOrder} layerType="fill" {mapId} {paintStyles} id="the-triangle-hexagon-fill"/>
              <MapLayerType {layerOrder} layerType="line" {mapId} {paintStyles} {layoutStyles} id="the-triangle-hexagon-line"/>
            </MapSource>

            <MapSource
              {mapId}
              id="triangle-highways"
              type="geojson"
              data={triangleHighways}
              promoteId={"rsu"}
              maxzoom={24}
              >
              <MapLayerType {layerOrder} layerType="line" {mapId} id="triangle-highway" {paintStyles}/>
              <MapLayerType {layerOrder} layerType="line" {mapId} id="triangle-highway-border" {paintStyles}/>
            </MapSource>

            <MapSource
              {mapId}
              id="investor-sfr-hexagons"
              type="geojson"
              data={hexagons}
              promoteId={"bin"}
              maxzoom={24}
            >
              <MapLayerType {layerOrder} layerType="fill" {mapId} {paintStyles} id="investor-sfr-hexagon-fill"/>
              <MapLayerType {layerOrder} layerType="line" {mapId} {paintStyles} {layoutStyles} id="investor-sfr-hexagon-line"/>
            </MapSource>

            <MapSource
              {mapId}
              id="zoomed-hexagons"
              type="geojson"
              data={zoomedHexagons}
              promoteId={"bin"}
              maxzoom={24}
            >
              <MapLayerType {layerOrder} layerType="fill" {mapId} {paintStyles} id="zoomed-hexagon-fill"/>
              <MapLayerType {layerOrder} layerType="line" {mapId} {paintStyles} {layoutStyles} id="zoomed-hexagon-line"/>
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

        <!-- TODO - how can I inform this section length programmatically -->
          <MapSection
            {section}
            map={map}
          />

      {/each}
      <div style={`height: ${0.5 * $windowHeight}px; display: flex;
      display: -webkit-flex; justify-content: center;`}/>
    </div>
  </Scroller>
  <div id="after-map"/>
</div>  


<style>

  .debug {
    margin: 0 !important;

    text-align: right;
    position: fixed;
    top: 0;
    right: 0;
    font-size: 30px;
    padding-right: 20px;
    color: black;
    background-color: white;
    z-index: 1000000;
  }
</style>
