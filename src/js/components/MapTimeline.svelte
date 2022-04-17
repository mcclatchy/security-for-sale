<script>
  import { inview } from 'svelte-inview';
  import { onMount } from 'svelte';

  import BarChart from './BarChart.svelte';
  import Map from './Map.svelte';
  import MapLayer from './MapLayer.svelte';
  import MapLayerType from './MapLayerType.svelte';
  import MapTimelineStyles from './MapTimelineStyles.svelte'

  // import MapLegend from './MapLegend.svelte';
  import MapSection from './MapSection.svelte';
  import MapSource from './MapSource.svelte';
  import MapTimelineTitle from './MapTimelineTitle.svelte';
  import MapTooltip from './MapTooltip.svelte';
  import Scroller from "./Scroller.svelte";
  import { windowWidth, windowHeight, isPortrait, aspectRatio } from '../modules/store.js';
  import { getAndFormatTopojsonData, formatTopojsonLayer, getJsonData, getBBoxAspectRatio, getDivAspectRatio, execResizeCallbackWithSuspend } from "../modules/utils.js";

  export let dataPath;
  export let assetPath;
  export let scrollY;

  let styleUrl = import.meta.env.PROD ? `${dataPath}/style-osm-grey.json` : `${dataPath}/style-osm-grey-dev.json`
  
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


  let innerMapHeight = 100;
  let innerMapWidth = 100;
  let bufferWidth = 0;

  let timelineCoords = [ -75.797,36.559 ];
  let timelineCanvasCoords;
  $: timelineCanvasCoords = map && map.project(timelineCoords);
  const resizeObserver = new ResizeObserver(entries => {
    const elements = entries.map(entry => entry.target);
    execResizeCallbackWithSuspend(elements, resizeObserver, () => {
      timelineCanvasCoords = map && map.project(timelineCoords)
    });
  })

  resizeObserver.observe(document.body);


  let timestamps = []
  let labels;
  let stateNames;
  let cityNames;
  let counties;
  let surroundingStates;
  let residences;
  let northCarolina;
  let timestampsAggregate;
  let timestampsCumulative;
  let allDataLoaded = false;
  async function getAllData() {
   labels = await getJsonData(`${dataPath}/labelsBare.json`, "state");
    stateNames = await formatTopojsonLayer(labels, "state");
    cityNames = await formatTopojsonLayer(labels, "city");
    counties = await getAndFormatTopojsonData(`${dataPath}/counties.json`, "counties");
    surroundingStates = await getAndFormatTopojsonData(`${dataPath}/surrounding_states.json`, "surrounding_states");
    residences = await getAndFormatTopojsonData(`${dataPath}/timeline.json`, "timeline")
    northCarolina = await getAndFormatTopojsonData(`${dataPath}/north_carolina.json`, "north_carolina")
    timestampsAggregate = await getJsonData(`${dataPath}/timestamps_aggregate.json`)
    timestampsCumulative = await getJsonData(`${dataPath}/timestamps_cumulative.json`)
    timestamps = [...new Set(residences.features.map(item => item.properties['timestamp']))];
    allDataLoaded = true;
  }
  getAllData()


  
  

  $: sections = $windowWidth && [
    {
      text: "There is something here and there's some more text for another line",
      id: "first",
      bounds: bounds.north_carolina,
      position: "static",
      speed: 0.7,
    },
    {
      text: "There is a second something here and there's some more text for another line",
      id: "second",
      bounds: bounds.north_carolina,
      position: "static",
      speed: 0.7,
    },
    {
      text: "There is a third something here and there's some more text for another line",
      id: "third",
      bounds: bounds.north_carolina,
      position: "static",
      speed: 0.7,
    },
    {
      text: "There is a fourth something here and there's some more text for another line",
      id: "fourth",
      bounds: bounds.north_carolina,
      position: "static",
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
  // let brieflyHighlighted = []
  // $: if(timestamps) {
  //   brieflyHighlighted = timestamps.filter((x) => x >= (currentTimestamp - 604800) && x <= (currentTimestamp + 604800));
  //   setTimeout(() => {brieflyHighlighted = []}, 300)
  // }

  let map = null;
  let mapId = "timeline-map"
  let mapLoaded = false;
  let topLayerDrawn = false;
  let paintStyles;
  let layoutStyles;
  let layerOrder = [
    `${mapId}-state-names`,
    `${mapId}-city-names`,

    `${mapId}-north-carolina-outline`,
    `${mapId}-surrounding-state-line`,
    `${mapId}-surrounding-state-fill`,
    `${mapId}-investor-sfrs`,
    `${mapId}-county-line`,
    `${mapId}-north-carolina-fill`
  ]
  let progress = 0;
  let pointerEvents = "none";
  let customAttribution = ""
  let mapBounds = bounds.north_carolina;

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
    let img = new Image(20,20)
    img.onload = ()=>map.addImage('hexagon', img)
    img.src = `${assetPath}/hexagon.svg`
    imageLoaded = true;
  }


  // $: map && map.loadImage(
  //   `${assetPath}/hexagon.png`,
  //   (error, image) => {
  //   if (error) throw error;
     
  //   // Add the image to the map style.
  //   map.addImage('hexagon', image);
  //   imageLoaded = true;
  // });

</script>

<MapTimelineStyles
  {mapId}
  bind:paintStyles
  bind:layoutStyles
/>

<div id="choropleth-scroller">
  <Scroller bind:progress>
    <div slot="background" class={`background`} style={`width: 100%; height: ${$windowHeight}px; pointer-events: ${pointerEvents}; padding: 0px 0px;`}>
      <MapTimelineTitle/>
      
      {#if timelineCanvasCoords}
        <div class="timeline" style={`top: ${timelineCanvasCoords.y}px; right: ${$windowWidth - timelineCanvasCoords.x}px;`}>
        <!-- {`${currentDate.getFullYear()}-${("0" + (currentDate.getMonth() + 1)).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)}`} -->
        <span class={`month timeline-text${classSuffix}`}>{progress >= 1 ? 'Mar' : progress <= 0 ? 'Jul' : month}</span>
        <span class={`timeline-text${classSuffix}`}>&nbsp;<span>
        <span class={`year timeline-text${classSuffix}`}>{progress >= 1 ? '2021' : progress <= 0 ? '1998' : year}</span>
        </div>
      {/if}
      <div class={`map-outer-container`} bind:this={outerMapContainer}>

        {#if innerMapHeight && innerMapWidth}
          <div class={`map`} use:inview="{options}" on:change="{handleChange}">
            {#if allDataLoaded && paintStyles && layoutStyles && (isInView || shouldLoad)}
              <Map id={mapId} style={styleUrl} bind:loaded={mapLoaded} location={{bounds: mapBounds}} bind:map={map} interactive={false} controls={false} attribution={"bottom-left"} customAttribution={customAttribution}>

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
                  {/if}
                {/if}
              </Map>
            {/if}
          </div>
          {/if}
        </div>
        {#if progress >= 0.74}
          <MapSection
            bind:bounds={mapBounds}
            section={sections[sections.length-1]}
            map={map}
            opacity={1}
            fixed={true}
          />
        {/if}
      </div>

    <div slot="foreground">
      <div style={`height: ${$windowHeight}px; display: flex;
      display: -webkit-flex; justify-content: center;`}/>
      {#each sections as section, i}

        <div style={`height: ${$windowHeight}px; z-index: 2; position: relative; pointer-events: none;`}>
          {#if i < (sections.length - 1)}
            <MapSection
              bind:bounds={mapBounds}
              {section}
              map={map}
              fade={true}
              fixed={true}
            />
          {/if}
        </div>
      {/each}
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
  .timeline {
    position: fixed;
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
    color: #dba1a7;
    letter-spacing: 2px;
  }
  .year {
    color: #c16677;
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
</style>
