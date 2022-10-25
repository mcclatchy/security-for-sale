<script>
  import { inview } from 'svelte-inview';
  import { onMount } from 'svelte';

  import Map from './Map.svelte';
  import MapLayer from './MapLayer.svelte';
  import MapLayerType from './MapLayerType.svelte';
  import MapTimelineStyles from './MapTimelineStyles.svelte'

  // import MapLegend from './MapLegend.svelte';
  import MapScaleBar from './MapScaleBar.svelte';
  import MapSection from './MapSection.svelte';
  import MapSource from './MapSource.svelte';
  import MapTimelineTitle from './MapTimelineTitle.svelte';
  import ProgressBar from "./ProgressBar.svelte";
  import Scroller from "./Scroller.svelte";
  import { windowWidth, windowHeight, isPortrait, aspectRatio, activeTimelineSection } from '../modules/store.js';
  import { getAndFormatTopojsonData, formatTopojsonLayer, getJsonData, getBBoxAspectRatio, getDivAspectRatio, execResizeCallbackWithSuspend, setupIcon, isTablet } from "../modules/utils.js";

  export let dataPath;
  export let assetPath;
  export let scrollY;
  export let mapData;

  let styleUrl = import.meta.env.PROD ? `${dataPath}/styleTimeline.json` : `${dataPath}/styleTimelineDev.json`
  
  let hovered;
  let outerMapContainer;
  let bounds = { 
    // north_carolina: [[ -84.821869, 33.702316 ], [-74.960621, 36.688117]],
    // north_carolina: [[ -84.421988, 33.645 ], [-75.2994, 37.2881695]],
    north_carolina: [[ -84.521988, 33.645 ], [-75.1994, 37.2881695]],
    charlotte: [[ -81.090043, 35.551569], [ -80.491228, 34.958323]],
    neighborhood: [[-80.98297119140625,35.31751515265763], [-80.9691846370697,35.30852397576001]],
    raleigh: [[-79.1445,36.3579], [-78.1306,35.4883]],
    fuquay: [[-78.916888, 35.697333], [-78.687336, 35.527515]],
    guilford: [[-80.569,36.311], [-79.5224,35.8930]]
  };

  $: if ($isPortrait) {
    bounds.north_carolina = [[-82.580,33.803 ], [-77.6351,36.547]];
  } else {
    bounds.north_carolina = [[ -84.521988, 33.645 ], [-75.1994, 37.2881695]];
  }

  let innerMapHeight = 100;
  let innerMapWidth = 100;
  $: padding = $isPortrait ? 200 : 150;
  let bufferWidth = 0;
  // $: textCoords = $isPortrait ? [-79.677,33.732] : [-84.324,34.777];
  $: textCoords = [-77.970,33.503];
  let timelineCoords = [ -75.797,36.559 ];
  let timelineCanvasCoords;
  let textCanvasCoords
  $: timelineCanvasCoords = map && map.project(timelineCoords);
  $: textCanvasCoords = map && map.project(textCoords);
  const resizeObserver = new ResizeObserver(entries => {
    const elements = entries.map(entry => entry.target);
    execResizeCallbackWithSuspend(elements, resizeObserver, () => {
      timelineCanvasCoords = map && map.project(timelineCoords)
      textCanvasCoords = map && map.project(textCoords);
    });
  })
  resizeObserver.observe(document.body);


  let timestamps = []
  let labels;
  let stateNames;
  let cityNames;
  let cityCircles;
  let counties;
  let surroundingStates;
  let residences;
  let northCarolina;
  let allDataLoaded = false;
  async function getAllData() {
    labels = await getJsonData(`${dataPath}/labelsTimeline.json`, "state");
    stateNames = await formatTopojsonLayer(labels, "state");
    cityNames = await formatTopojsonLayer(labels, "city");
    cityCircles = await formatTopojsonLayer(labels, "city-circle");
    counties = await getAndFormatTopojsonData(`${dataPath}/counties.json`, "counties");
    surroundingStates = await getAndFormatTopojsonData(`${dataPath}/surroundingStates.json`, "surroundingStates");
    residences = await getAndFormatTopojsonData(`${dataPath}/timeline.json`, "timeline")
    northCarolina = await getAndFormatTopojsonData(`${dataPath}/northCarolina.json`, "northCarolina")
    timestamps = [...new Set(residences.features.map(item => item.properties['timestamp']))];
    allDataLoaded = true;
  }
  getAllData()

  $: sections = $windowWidth && mapData && mapData.sections.map((section) => {
    return {
      text: section.text,
      id: section?.id,
      bounds: bounds[section.bounds],
      horizontalPosition: section.horizontalPosition,
      speed: section.speed,
      pitch: section?.pitch || 0,
      bearing: section?.bearing || 0,
      padding: {top: padding, bottom:padding, left: 0, right: 0}
    }
  });

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

  let startTimestamp = 1339113600
  let endTimestamp = 1615939200
  let sixMonths = 31536000 / 2
  $: currentTimestamp = Math.round(startTimestamp + progress * (endTimestamp - startTimestamp));
  $: filterTimestamp = currentTimestamp <= endTimestamp ? currentTimestamp : endTimestamp;
  $: highlighted = timestamps.filter((x) => x <= filterTimestamp && x >= (filterTimestamp - sixMonths));
  $: faded = timestamps.filter((x) => x <= (filterTimestamp - sixMonths));
  $: currentDate = new Date(currentTimestamp * 1000);


  let map = null;
  let mapId = "timeline-map"
  let mapLoaded = false;
  let topLayerDrawn = false;
  let paintStyles;
  let layoutStyles;
  let layerOrder = [
    `${mapId}-state-names`,
    `${mapId}-city-names`,
    `${mapId}-city-circles`,

    `${mapId}-north-carolina-outline`,
    `${mapId}-surrounding-state-line`,
    `${mapId}-surrounding-state-fill`,
    `${mapId}-investor-sfrs`,
    `${mapId}-investor-sfrs-faded`,
    `${mapId}-county-line`,
    `${mapId}-north-carolina-fill`
  ]
  let progress = 0;
  let pointerEvents = "none";
  $: paddingBottom = 10;
  $: customAttribution = `
    <div style=\"padding-left: 10px; padding-bottom: ${paddingBottom}px;\">
      <span style="font-weight: bold">Map:</span> <a href=\"https://www2.census.gov/geo/tiger/TIGER2021/\" target=\"_blank\">U.S. Census Bureau</a>
      <br>
      <span style="font-weight: bold">Data:</span> <a href='https://acdatacollective.org/' target='_blank'>Anti-Corruption Data Collective</a>, <a href=\"https://github.com/mcclatchy-southeast/security_for_sale\" target=\"_blank\">N&O/Observer analysis</a>
    </div>
  `

  let wideBreakpoint = 1.8;
  let portraitBreakpoint = 0.8

  let highlightedStates = []
  $: if (surroundingStates && $aspectRatio > wideBreakpoint) {
    highlightedStates = surroundingStates.features.map(item => item.properties['NAME'])
  } else {
    highlightedStates = []
  }

  $: classSuffix = $aspectRatio <= portraitBreakpoint ? "-portrait" : ""


  Date.prototype.getMonthText = function() {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[this.getMonth()];
  }

  $: month = currentDate && currentDate.getMonthText()
  $: year = currentDate && currentDate.getFullYear()

  let imageLoaded = false;
  $: if(map) {
    setupIcon(map, `${assetPath}/hexagon.svg`, 'hexagon', 20, 20)
    setupIcon(map, `${assetPath}/hexagon_fade.svg`, 'hexagon_fade', 20, 20)
  }
  let activeSection;
</script>

<MapTimelineStyles
  {mapId}
  bind:paintStyles
  bind:layoutStyles
/>

<div id="timeline-scroller">
  <Scroller bind:progress>
    <div slot="background" class={`background`} style={`width: 100%; height: ${isTablet.ipad() ? $windowHeight - 50 : $windowHeight}px; pointer-events: ${pointerEvents}; padding: 0px 0px;`}>
      <MapTimelineTitle
        {assetPath}
      />
      <ProgressBar
        {progress}
        highlightColor="#d93a4c"
      />
      {#if timelineCanvasCoords && progress >= 0 && progress < 2}
        <div class={`timeline${classSuffix}`} style={`
          top: ${timelineCanvasCoords.y}px;
          right: ${$isPortrait ? "unset" : $windowWidth - timelineCanvasCoords.x + "px"};
          left: ${$isPortrait ? "50%" : "unset"};
        `}>
        <!-- {`${currentDate.getFullYear()}-${("0" + (currentDate.getMonth() + 1)).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)}`} -->
        <span class={`month timeline-text${classSuffix}`}>{progress >= 1 ? 'Mar' : progress <= 0 ? 'Jun' : month}</span>
        <span class={`timeline-text${classSuffix}`}>&nbsp;<span>
        <span class={`year timeline-text${classSuffix}`}>{progress >= 1 ? '2021' : progress <= 0 ? '2012' : year}</span>
        </div>
      {/if}
      <div class={`map-outer-container`} bind:this={outerMapContainer}>

        {#if innerMapHeight && innerMapWidth}
          <div class={`map`} use:inview="{options}" on:change="{handleChange}">
            {#if allDataLoaded && paintStyles && layoutStyles && (isInView || shouldLoad)}
              <Map id={mapId} style={styleUrl} bind:loaded={mapLoaded} location={{bounds: bounds.north_carolina}} bind:map={map} interactive={false} controls={false} attribution={"bottom-left"} customAttribution={customAttribution} resize={true} padding={{top: padding, bottom: padding, left: 0, right: 0}}>

              <MapScaleBar
                {map}
              />

              {#if mapLoaded}

                <!-- STATE NAMES -->
                <MapSource
                  {mapId}
                  id="states"
                  type="geojson"
                  data={stateNames}
                  maxzoom={24}>
                  <MapLayerType {layerOrder} layerType="symbol" bind:drawn={topLayerDrawn} {mapId} {paintStyles} {layoutStyles} id={`${mapId}-state-names`}/>
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
                      <MapLayerType {layerOrder} layerType="symbol" {mapId} {paintStyles} {layoutStyles} id={`${mapId}-city-names`}/>
                    </MapSource>

                    <!-- CITY CIRCLES -->
                    <MapSource
                      {mapId}
                      id="cities-circles"
                      type="geojson"
                      data={cityCircles}
                      promoteId={"description"}
                      maxzoom={24}>
                      <MapLayerType {layerOrder} layerType="circle" {mapId} {paintStyles} {layoutStyles} id={`${mapId}-city-circles`}/>
                    </MapSource>

                    <!-- SURROUNDING STATES -->
                    <MapSource
                      {mapId}
                      id="surrounding-states"
                      type="geojson"
                      data={surroundingStates}
                      promoteId={"NAME"}
                      maxzoom={24}
                    >
                      <MapLayerType {layerOrder} layerType="fill" {mapId} {paintStyles} id={`${mapId}-surrounding-state-fill`}/>
                      <MapLayerType {layerOrder} layerType="line" {mapId} {paintStyles} {layoutStyles} id={`${mapId}-surrounding-state-line`}/>
                    </MapSource>

                    <!-- COUNTIES -->
                    <MapSource
                      {mapId}
                      id="counties"
                      type="geojson"
                      data={counties}
                      maxzoom={24}
                    >
                      <MapLayerType {layerOrder} layerType="line" {mapId} {paintStyles} {layoutStyles} id={`${mapId}-county-line`}/>
                    </MapSource>

                    <MapSource
                      id="northCarolina"
                      type="geojson"
                      data={northCarolina}
                      promoteId={"GEOID"}
                      mapId={mapId}
                      maxzoom={24}>
                      <MapLayerType layerType="line" mapId={mapId} id={`${mapId}-north-carolina-outline`} {paintStyles} {layoutStyles} {layerOrder}/>
                      <MapLayerType layerType="fill" mapId={mapId} id={`${mapId}-north-carolina-fill`} {paintStyles} {layoutStyles} {layerOrder}/>
                    </MapSource>
                   
                    <MapSource
                      mapId={mapId}
                      id="residences"
                      type="geojson"
                      data={residences}
                      promoteId={"timestamp"}
                      maxzoom={24}>
                      <MapLayerType layerType="symbol" mapId={mapId} highlighted={highlighted} id={`${mapId}-investor-sfrs`} {paintStyles} {layoutStyles} {layerOrder}/>
                    </MapSource>   

                    <MapSource
                      mapId={mapId}
                      id="residences-faded"
                      type="geojson"
                      data={residences}
                      promoteId={"timestamp"}
                      maxzoom={24}>
                      <MapLayerType layerType="symbol" mapId={mapId} highlighted={faded} id={`${mapId}-investor-sfrs-faded`} {paintStyles} {layoutStyles} {layerOrder}/>
                    </MapSource>
                  {/if}
                {/if}
              </Map>
            {/if}
          </div>
          {/if}
          {#if $activeTimelineSection && textCanvasCoords}
            <div class="static-text" style={`

                top:  ${textCanvasCoords.y + "px"};
              `}
            >
              {$activeTimelineSection.text}
            </div>
          {/if}
        </div>
      </div>

    <div slot="foreground">
      <div style={`height: ${$windowHeight}px; display: flex;
      display: -webkit-flex; justify-content: center;`}/>
      {#if textCanvasCoords}
        {#each sections as section, i}
          <div style={`height: ${$windowHeight}px; z-index: 2; position: relative; pointer-events: none;`}>
            <MapSection
              bind:bounds={bounds.north_carolina}
              {section}
              map={map}
              fade={true}
              fixed={true}
              top={textCanvasCoords.y}
              left={textCanvasCoords.x}
              visibility={'hidden'}
              {progress}
              progressStart={i === (sections.length - 1) ? 0.88 :  Math.round(i / sections.length * 100) / 100}
              progressEnd={i === (sections.length - 1) ? 2 : i === (sections.length - 2) ? 0.88 :  Math.round((i + 1) / sections.length * 100) / 100}
            />
          </div>
        {/each}
      {/if}
      <div style={`height: ${0 * $windowHeight}px; display: flex;
      display: -webkit-flex; justify-content: center;`}/>
    </div>
  </Scroller>
  <div id="after-map"/>

</div>  

<style>
  [slot="background"] {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    -webkit-flex-direction: column;
    margin: auto;
    justify-content: center;
    
  }
  .static-text {
    max-width: 600px;
    position: absolute;
    font-family: 'Libre Franklin';
    line-height: 24px;
    font-weight: 400;
    font-size: 17px;
    text-align: center;
    /*border:  1px solid #999;*/
    border-radius: 20px;
    color: black;
    pointer-events: all;
    transition: opacity 0.6s;
    -webkit-transition: opacity 0.6s;
    background: white;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .timeline {
    position: absolute;
    /*top: 6%;*/
    /*right: 6%;*/
    font-family: "Bebas Neue";
    z-index:  10000;
    text-align: right;
    font-weight: bold;
    text-transform: uppercase;
    transform: translate(0, -100%);
    /*display: none;*/
  }
  .timeline-portrait {
    position: absolute;
    /*top: 6%;*/
    /*right: 6%;*/
    font-family: "Bebas Neue";
    z-index:  10000;

    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
    left: 50%;
    transform: translate(-50%, -100%);
    /*display: none;*/
  }
  .timeline-text {
    font-size: 100px;
  }
  .timeline-text-portrait {
    font-size: 40px;
  }
  @media only screen and (max-height: 500px) {
    .timeline-text {
      font-size: 50px;
    }
  }
  .month {
    color: #eda3ab;
    letter-spacing: 2px;
  }
  .year {
    color: #c33444;
  }
  .chart-map-container {
    height: 100%;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    -webkit-flex-direction: column;
    margin: auto;
    justify-content: center;
  }
  .chart {
    height: 100%;
    width: 100%;
  }
  .map-outer-container {
    height: 100%;
    width: 100%;
  }
  .map {
    margin: 0 auto;
    height: 100%;
  }

  @media only screen and (max-width:  600px) {
    .static-text {
      width: 100%;
      padding: 10px 20px;
      background: none;
      font-size: 16px;
      line-height: 24px;
      font-weight: 400;
    }
  }
</style>
