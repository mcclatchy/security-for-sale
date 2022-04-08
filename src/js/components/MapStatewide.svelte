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
  import MapStatewideStyles from './MapStatewideStyles.svelte'
  import Scroller from "./Scroller.svelte";
  import { windowWidth, windowHeight, isPortrait } from '../modules/store.js';
  import { getJsonData, formatTopojsonLayer, getAndFormatTopojsonData, makeColors } from "../modules/utils.js";

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

  let labels;
  let stateNames;
  let cityNames;
  let areaNames;
  let homes;
  let hexagons;
  let zoomedHexagons;
  let mecklenburgHexagons;
  let mecklenburgGrid;
  let triangleHexagons; 
  let triangleGrid;
  let turningCircles;
  let surroundingStates;
  let northCarolina;
  let roads;
  let streets;
  let mecklenburg;
  let triangle;
  let allDataLoaded = false;
  async function getAllData() {
    labels = await getJsonData(`${dataPath}/labels.json`, "state");
    stateNames = await formatTopojsonLayer(labels, "state");
    cityNames = await formatTopojsonLayer(labels, "city");
    areaNames = await formatTopojsonLayer(labels, "area");

    surroundingStates = await getAndFormatTopojsonData(`${dataPath}/surrounding_states.json`, "surrounding_states");
    northCarolina = await getAndFormatTopojsonData(`${dataPath}/north_carolina.json`, "north_carolina");
    hexagons = await getAndFormatTopojsonData(`${dataPath}/hexagons.json`, 'hexagons', "count", colors, breaks)
    zoomedHexagons = await getAndFormatTopojsonData(`${dataPath}/zoomedHexagons.json`, 'hexagons', "count", backgroundColors, zoomedBreaks)

    mecklenburgHexagons = await getAndFormatTopojsonData(`${dataPath}/mecklenburgHexagons.json`, 'hexagons', "count", colors, zoomedBreaks)
    mecklenburgGrid = await getAndFormatTopojsonData(`${dataPath}/mecklenburgGrid.json`, 'hexagons', "count", colors, zoomedBreaks)
    mecklenburg = await getAndFormatTopojsonData(`${dataPath}/mecklenburgOutline.json`, "mecklenburgOutline");
    homes = await getAndFormatTopojsonData(`${dataPath}/homes.json`, 'homes', "investor", null, null, investorColors)

    triangleHexagons = await getAndFormatTopojsonData(`${dataPath}/triangleHexagons.json`, 'hexagons', "count", colors, zoomedBreaks)
    triangleGrid = await getAndFormatTopojsonData(`${dataPath}/triangleGrid.json`, 'hexagons', "count", colors, zoomedBreaks)
    triangle = await getAndFormatTopojsonData(`${dataPath}/triangle.json`, "triangle");

    turningCircles = await getAndFormatTopojsonData(`${dataPath}/turning_circles.json`, "turning_circles");
    roads = await getAndFormatTopojsonData(`${dataPath}/roads.json`, "roads");
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
    highlighted = ['Charlotte', 'Mecklenburg County', 'Raleigh', 'Durham', 'Chapel Hill']
    hoverableIds = []
  } else if (progress >= 0.18 && progress < 0.6) {
    pointerEvents = "none"
    highlighted = ['Charlotte', 'Mecklenburg County', 'Raleigh', 'Durham', 'Chapel Hill']
    hoverableIds = []
  } else if (progress >= 0.6 && progress < 0.8) {
    pointerEvents = "none"
    highlighted = ['Charlotte', 'Mecklenburg County', 'The Triangle', 'Raleigh', 'Durham', 'Chapel Hill']
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

  $: sections = $windowWidth && [
    {
      text: "Across North Carolina, just a handful of major firms own at least 37,000 single-family homes.",
      id: "first",
      bounds: bounds.north_carolina,
      horizontalPosition: "left",
      speed: 0.7,
    },
    {
      text: "Their portfolios are especially concentrated in the Charlotte metropolitan area, where at least 1 in 20 single-family houses are owned by six of these firms.",
      id: "second",
      bounds: bounds.charlotte,
      horizontalPosition: "left",
      speed: 0.7,
    },
    {
      text: "In some neighborhoods, like this one along the northwest edge of Mecklenburg County, corporations control half of all the total housing units.",
      id: "third",
      bounds: bounds.neighborhood,
      horizontalPosition: "left",
      speed: 0.7,
    },
    {
      text: "But Charlotte's not alone.",
      id: "third",
      bounds: bounds.charlotte,
      horizontalPosition: "left",
      speed: 0.7,
    },
    {
      text: "About 130 miles away in the Triangle, companies own more than 5,000 single-family homes, concentrated on the east side of Wake County.",
      id: "third",
      bounds: bounds.raleigh,
      horizontalPosition: "left",
      speed: 0.7,
    },
    {
      text: "In the suburbs and in communities like Fuquay-Varina and Holly Springs, these firms have turned some starter neighborhoods into largely rental communities.",
      id: "third",
      bounds: bounds.fuquay,
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




  let map = null;
  let mapId = "statewide-map"
  let paintStyles;
  let layoutStyles;
  let topLayerDrawn = false;
  let customAttribution = ""

  let layerOrder = [
    'state-names',
    'city-names',
    'area-names',

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

    "zoomed-hexagon-line",
    "zoomed-hexagon-fill",


    "mecklenburg-grid-line",
    "the-triangle-grid-line",


    "mecklenburg-grid-fill",
    "the-triangle-grid-fill",


    'highway',
    'street',
    "turning-circle-fill",

    
    'highway-border',
    'street-border',
    'turning-circle-border',

  
    'north-carolina-fill'
  ]
</script>

<MapStatewideStyles
  bind:paintStyles
  bind:layoutStyles
/>

<div id="choropleth-scroller">
  <Scroller bind:progress>
    <div slot="background" style={`width: 100%; height: ${$windowHeight}px; pointer-events: ${pointerEvents}`}>

      <div class="map" use:inview="{options}" on:change="{handleChange}">
        {#if allDataLoaded && (isInView || shouldLoad)}

        <Map id={mapId} style={styleUrl} location={{bounds: bounds.north_carolina}} bind:map={map} interactive={false} controls={false} attribution={"bottom-left"} customAttribution={customAttribution}>
          <!-- <MapLegend
            {progress}
          /> -->

          <!-- <MapTitle/> -->

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

            <!-- STATE OUTLINES -->
            <MapSource
              {mapId}
              id="northCarolina"
              type="geojson"
              data={northCarolina}
              promoteId={"GEOID"}
              maxzoom={24}>
              <MapLayerType {layerOrder} layerType="line" {mapId} id="north-carolina-outline" paintStyles={paintStyles}/>
              <MapLayerType {layerOrder} layerType="fill" {mapId} id="north-carolina-fill" paintStyles={paintStyles}/>
            </MapSource>

            <!-- HIGHWAYS -->
            <MapSource
              {mapId}
              id="highways"
              type="geojson"
              data={roads}
              promoteId={"highway"}
              maxzoom={24}
              >
              <MapLayerType {layerOrder} layerType="line" {mapId} id="highway" paintStyles={paintStyles}/>
              <MapLayerType {layerOrder} layerType="line" {mapId} id="highway-border" paintStyles={paintStyles}/>
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
              <MapLayerType {layerOrder} layerType="line" {mapId} {highlighted} id="mecklenburg-outline" paintStyles={paintStyles}/>
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
              <MapLayerType {layerOrder} layerType="line" {mapId} {highlighted} id="the-triangle-outline" paintStyles={paintStyles}/>
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

        <div style={`height: ${1.25 * $windowHeight}px; z-index: 2; position: relative; pointer-events: none;`}>
          <MapSection
            {section}
            map={map}
          />
        </div>
      {/each}
      <div style={`height: ${0.5 * $windowHeight}px; display: flex;
      display: -webkit-flex; justify-content: center;`}/>
    </div>
  </Scroller>
  <div id="after-map"/>
</div>  
