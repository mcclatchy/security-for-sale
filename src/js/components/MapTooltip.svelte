<script>
  import { getContext } from 'svelte';
  import mapbox from '../../lib/mapbox-gl@1.13.2';
	// Mapbox source code is bundled due to versioning & ES6 import issues
	// https://cdn.skypack.dev/-/mapbox-gl@v1.13.2-asizChmwkQobquJNQjgb/dist=es2020,mode=imports,min/optimized/mapbox-gl.js

  export let content;
  export let hoverableIds = [];

  const tooltip = new mapbox.Popup({
		closeButton: false,
		closeOnClick: false
	});

  const { getMap } = getContext('map');
	const map = getMap();
  const hoverObj = getContext('hover');

  function getStateName(abbv) {
    const abbvToStateName = {
      'MS': 'Mississippi',
      'GA': 'Georgia',
      'SC': 'South Carolina',
      'AL': 'Alabama'
    };
    if (abbv in abbvToStateName) {
      return abbvToStateName[abbv];
    } else {
      return abbv;
    }
  }

  // https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
  function kFormatter(num) {
      return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'K' : '<1K'
  }



  function updateTooltip(obj, content) {
    if (obj.id && (hoverableIds.includes(obj.id) || !hoverableIds.length)) {
      let htmlDataPresent = `
            <div class="tooltip-table-container">
                <table class="tooltip-table">
                    <thead style="background-color: white;">
                        <tr style="border-bottom: none; vertical-align: bottom; margin-bottom: 15px;">
                            <!-- <th class=""></th> -->
                            <th style="text-align: center;" class="">Population</th>
                            <!-- <th style="text-align: center;" class="">Population Density</th> -->
                            <th style="text-align: center;" class="">Amputation Rate*</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="tooltip-number-column">
                              <p class="tooltip-cell">
                                ${kFormatter(obj.feature.properties.POPULATION_5_YR_AVG)}
                              </p>
                            </td>
                            <td class="tooltip-number-column">
                              <p class="tooltip-cell" style="background-color: ${obj.feature.properties.color}; font-weight: bold; color: ${obj.feature.properties.opacity > 0.7 ? 'white' : 'black'}">
                                ${obj.feature.properties.AMPUTATION_RATE_5_YR_AVG_PER_10K}
                              </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
          <div>
            <h4 class="tooltip-table-subtitle">*Amputation rate is per 10K residents</h4>
          </div>
      `

      let htmlInsufficientData = `
        <div>
          <h4 class="tooltip-table-subtitle" style="padding-top: 10px; font-size: 12px; color: #404040;">Insufficient data for ZIP code</h4>
        </div>
      `


      tooltip
			.setLngLat(obj.event.lngLat)
      .setHTML(
        `
          <div class="tooltip-title-container">
              <h3 class="tooltip-table-title">${obj.feature.properties.ZCTA5CE20}<span style="font-weight: normal">, ${getStateName(obj.feature.properties.STATE)}</span></h3>
          </div>
          ${obj.feature.properties.POPULATION_5_YR_AVG > 1000 ? htmlDataPresent : htmlInsufficientData}


          `)
      .addTo(map);
    } else {
      tooltip.remove();
    }
  }

  $: updateTooltip($hoverObj, content);
</script>

<style>
  :global(.mapboxgl-popup-content) {
		padding: 5px 10px !important;
    width: 240px;
    filter: drop-shadow(rgba(0, 0, 0, 0.3) 0 2px 10px);
	}

  :global(.tooltip-title-container) {
    max-width: 100%;
    margin: auto;
    border-bottom: 2px solid #EEEEEE;
    padding-bottom: 5px;
  }

  :global(.tooltip-table-title) {
    max-width: 100%;
    text-align: left;
    margin-bottom: 0px;
    margin-right: auto;
    margin-left: auto;
    color: #121212;
    font-size: 19px;
    line-height: 26px;
    padding-bottom: 2px;
    font-weight: 700;
    font-family: 'Libre Franklin';
    margin-top: 15px;
    text-transform: none;
    text-align: center;
  }

  :global(.tooltip-table-subtitle) {
    max-width: 100%;
    text-align: left;
    margin-bottom: 8px;
    margin-top: 0;
    margin-right: auto;
    margin-left: auto;
    color: #121212;
    font-size: 12px;
    line-height: 24px;
    padding-bottom: 2px;
    font-weight: 200;
    font-family: 'Libre Franklin';
    text-transform: none;
    text-align: center;
  }

  :global(.tooltip-table-container) {
    font-family: 'Libre Franklin';
    /*height: 300px;*/
    padding: 5px;
    overflow: auto;
    width: 100%;
  }

  :global(.tooltip-table) {
    width: 100%;
    border-collapse: collapse;
  }

  :global(.tooltip-table thead th) {
    position: sticky;
    top: 0;
    font-size: 10px;
    font-weight: 200;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    color: #333;
    text-align: center;
    line-height: 1.2;
  } 

  :global(.tooltip-table tr) {
    margin: 0px auto 0px 0;
    border-spacing: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;
    display: table-row;
    text-indent: initial;
    font-size: 10px;
    font-weight: 200;
    text-size-adjust: 100%;
    border-bottom: 1px solid #EEEEEE;
  }

  :global(.tooltip-index-column) {
    width: 5%;
    font-size: 11px;
    font-weight: 200;
    color: #999;
    text-align: center;
    /*padding: 10px 9px 5px 0px;*/
  }

  :global(.tooltip-text-column-long) {
    width: 20%;
    font-size: 12px;
    color: #333;
    text-align: left;
    /*padding-right: 10px;*/
    padding: 10px 0px 0px 0px;
  }


  :global(.tooltip-text-column-short) {
    width: 10%;
    font-size: 12px;
    color: #333;
    text-align: center;
  }

  :global(.tooltip-number-column) {
    width: 15%;
    font-size: 12px;
    color: #333;
    text-align: center;
  }

  :global(.tooltip-number-column p) {
    margin: 0 !important;
    padding: 4px;
  }

@media (max-width: 600px) {
    :global(.tooltip-table-title) {
    margin-top: 10px;
    font-size: 16px;
    line-height: 20px;
  }
    :global(.tooltip-table-subtitle) {
    font-size: 12px;
    line-height: 16px;
  }
    :global(.tooltip-table-container) {
    padding-right: 5px;
    padding-left: 5px;
  }
    :global(.tooltip-table thead th) {
      font-size: 10px;
  }
    :global(.tooltip-table tr) {
      font-size: 12px;
  }
  :global(.tooltip-number-column) {
    font-size: 11px;
}
  :global(.tooltip-text-column-long) {
  font-size: 13px;
}
  :global(.tooltip-text-column-short) {
  font-size: 13px;
}
  :global(.tooltip-index-column) {
  font-size: 10px;
  }
}


</style>