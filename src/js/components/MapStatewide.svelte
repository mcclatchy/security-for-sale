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
    url: `${dataPath}/residences.json`,
    layer: "residences",
    code: "investor"
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
  let stateOutlineColor = makeColors(primaryColor, 0, 10, 0.95, 0.95)[3]
  let stateBackgroundColor = makeColors(primaryColor, 0, 10, 0.97, 0.97)[0]


  let residencesData = [];
  getTopo(residencesBounds.url, residencesBounds.layer)
  .then(res => {
    residences = res

    allresidenceIds = new Set()
    res.features.forEach(d => {
      d.properties.opacity = 0.1
      d.properties.color = "#cb0076"
      let investor = d.properties[idField]
      d.properties.investorColor = investorColors.hasOwnProperty(investor) ? investorColors[investor] : "rgba(182,182,182,0.0)"
      d.properties.investorOpacity = investorColors.hasOwnProperty(investor) ? 1 : 0
      residencesData.push(d.properties)
      allresidenceIds.add(d.properties[idField])
    });

    allresidenceIds = Array.from(allresidenceIds)
  });




  // Downloading ZIP code data
  let homes;
  const homesBounds = {
    url: `${dataPath}/homes.json`,
    layer: "homes",
    code: "investor"
  };
  let allhomeIds = []
  let homesData = [];
  getTopo(homesBounds.url, homesBounds.layer)
  .then(res => {
    homes = res

    allhomeIds = new Set()
    res.features.forEach(d => {
      d.properties.opacity = 0.1
      d.properties.color = "#cb0076"
      let investor = d.properties[idField]
      d.properties.investorColor = investorColors.hasOwnProperty(investor) ? investorColors[investor] : "rgb(216, 197, 104)"
      d.properties.investorOpacity = investorColors.hasOwnProperty(investor) ? 1 : 0
      homesData.push(d.properties)
      allhomeIds.add(d.properties[idField])
    });

    allhomeIds = Array.from(allhomeIds)
  });







  // Downloading ZIP code data
  let turningCircles;
  const turningCirclesBounds = {
    url: `${dataPath}/turning_circles.json`,
    layer: "turning_circles"
  };
  getTopo(turningCirclesBounds.url, turningCirclesBounds.layer)
  .then(res => {
    turningCircles = res
  });








  let hexagons;
  const hexagonsBounds = {
    url: `${dataPath}/hexagons.json`,
    layer: "hexagons",
    code: "bin"
  };
  let hexagonIdField = "bin"
  let hexagonColorField = "count"
  let hexagonIds = []

  let hexagonsData = [];
  // const colors = ["#ffe9c0", "#fec06b", "#fe802b", "#ed0802", "#cb0076", "#8a00aa", "#8a00aa"]
  // const colors = ["#f6dfbe", "#ceb897", "#a38e6d", "#584222","#584222", "#584222", "#584222"]
  getTopo(hexagonsBounds.url, hexagonsBounds.layer)
  .then(res => {
    hexagons = res
    // const colors = ["#FFE9F7", "#FFACDD", "#FFACDD", "#FB86CB", "#D36DAA", "#AA5688", "#803F66"]
    hexagonIds = new Set()
    res.features.forEach(d => {
      d.properties.opacity = 1

      
      // let breaks = [1, 95, 330, 580, 1000, 2000, 2500, 10000]

      let colorValue = d.properties[hexagonColorField]
      d.properties.color = getColor(colorValue, breaks, colors)
      // d.properties.color = colors[parseInt(d.properties[hexagonIdField])]
      hexagonsData.push(d.properties)
      hexagonIds.add(d.properties[hexagonIdField])
    });
    hexagonIds = Array.from(hexagonIds)
  });




  let innerCircles;
  const innerCirclesBounds = {
    url: `${dataPath}/innerCircles.json`,
    layer: "innerCircles",
    code: "bin"
  };
  let innerCircleIdField = "bin"
  let innerCircleColorField = "count"
  let innerCircleIds = []

  let innerCirclesData = [];
  // const innerCirclesColors = ["#f6dfbe", "#ceb897", "#a38e6d", "#584222","#584222", "#584222", "#584222"]
  // const innerCirclesColors = ["#bbbead", "#8d9b83", "#597254", "#3c4e38","#3c4e38", "#3c4e38"]
  getTopo(innerCirclesBounds.url, innerCirclesBounds.layer)
  .then(res => {
    innerCircles = res
    // const colors = ["#FFE9F7", "#FFACDD", "#FFACDD", "#FB86CB", "#D36DAA", "#AA5688", "#803F66"]
    innerCircleIds = new Set()
    res.features.forEach(d => {
      d.properties.opacity = 1

      // let breaks = [1, 2, 10, 50, 100, 500, 1000, 10000]
      // let breaks = [1, 95, 330, 580, 1000, 2000, 2500, 10000]
      let colorValue = d.properties[innerCircleColorField]
      d.properties.color = getColor(colorValue, breaks, colors)
      // d.properties.color = innerCirclesColors[parseInt(d.properties[innerCircleIdField])]
      innerCirclesData.push(d.properties)
      innerCircleIds.add(d.properties[innerCircleIdField])
    });
    innerCircleIds = Array.from(innerCircleIds)
  });


  let outerCircles;
  const outerCirclesBounds = {
    url: `${dataPath}/outerCircles.json`,
    layer: "outerCircles",
    code: "bin"
  };
  let outerCircleIdField = "bin"
  let outerCircleColorField = "count"
  let outerCircleIds = []

  let outerCirclesData = [];
  // const colors = ["#ffe9c0", "#fec06b", "#fe802b", "#ed0802", "#cb0076", "#8a00aa", "#8a00aa"]
  const outerCirclesColors = ["#f6dfbe", "#ceb897", "#a38e6d", "#584222","#584222", "#584222", "#584222"]
  getTopo(outerCirclesBounds.url, outerCirclesBounds.layer)
  .then(res => {
    outerCircles = res
    // const colors = ["#FFE9F7", "#FFACDD", "#FFACDD", "#FB86CB", "#D36DAA", "#AA5688", "#803F66"]
    outerCircleIds = new Set()
    res.features.forEach(d => {
      d.properties.opacity = 1
      d.properties.color = "#d6ccbf"
      outerCirclesData.push(d.properties)
      outerCircleIds.add(d.properties[outerCircleIdField])
    });
    outerCircleIds = Array.from(outerCircleIds)
  });




 let zoomedHexagons;
  const zoomedHexagonsBounds = {
    url: `${dataPath}/zoomedHexagons.json`,
    layer: "hexagons",
    code: "bin"
  };
  let zoomedHexagonIdField = "bin"
  let zoomedHexagonColorField = "count"
  let zoomedHexagonIds = []

  let zoomedHexagonsData = [];
  // const colors = ["#ffe9c0", "#fec06b", "#fe802b", "#ed0802", "#cb0076", "#8a00aa", "#8a00aa"]
  const zoomedColors = ["#FAFAFA", "#F4F4F4", "#EFEFEF", "#EAEAEA","#EAEAEA", "#EAEAEA", "#EAEAEA"]
  getTopo(zoomedHexagonsBounds.url, zoomedHexagonsBounds.layer)
  .then(res => {
    zoomedHexagons = res
    // const colors = ["#FFE9F7", "#FFACDD", "#FFACDD", "#FB86CB", "#D36DAA", "#AA5688", "#803F66"]
    zoomedHexagonIds = new Set()
    res.features.forEach(d => {
      d.properties.opacity = 1

      // let breaks = [1, 95, 330, 580, 1000, 2000, 2500, 10000]

      let colorValue = d.properties[zoomedHexagonColorField]
      d.properties.color = getColor(colorValue, zoomedBreaks, zoomedColors)
      // d.properties.color = colors[parseInt(d.properties[zoomedHexagonIdField])]
      zoomedHexagonsData.push(d.properties)
      zoomedHexagonIds.add(d.properties[zoomedHexagonIdField])
    });
    zoomedHexagonIds = Array.from(zoomedHexagonIds)
  });



  let mecklenburgHexagons;
  const mecklenburgHexagonsBounds = {
    url: `${dataPath}/mecklenburgZoomedHexagons.json`,
    layer: "hexagons",
    code: "bin"
  };
  let mecklenburgHexagonIdField = "bin"
  let mecklenburgHexagonColorField = "count"
  let mecklenburgHexagonIds = []

  let mecklenburgHexagonsData = [];
  // const colors = ["#ffe9c0", "#fec06b", "#fe802b", "#ed0802", "#cb0076", "#8a00aa", "#8a00aa"]
  // const mecklenburgColors = ["#f6dfbe", "#ceb897", "#a38e6d", "#584222","#584222", "#584222", "#584222"]
  getTopo(mecklenburgHexagonsBounds.url, mecklenburgHexagonsBounds.layer)
  .then(res => {
    mecklenburgHexagons = res
    // const colors = ["#FFE9F7", "#FFACDD", "#FFACDD", "#FB86CB", "#D36DAA", "#AA5688", "#803F66"]
    mecklenburgHexagonIds = new Set()
    res.features.forEach(d => {
      d.properties.opacity = 1

      // let breaks = [1, 2, 5, 10, 15, 20, 200, 100000]
      // let breaks = [1, 95, 330, 580, 1000, 2000, 2500, 10000]

      let colorValue = d.properties[mecklenburgHexagonColorField]
      d.properties.color = getColor(colorValue, zoomedBreaks, colors)
      // d.properties.color = colors[parseInt(d.properties[mecklenburgHexagonIdField])]
      mecklenburgHexagonsData.push(d.properties)
      mecklenburgHexagonIds.add(d.properties[mecklenburgHexagonIdField])
    });
    mecklenburgHexagonIds = Array.from(mecklenburgHexagonIds)
  });



  let mecklenburgLargeHexagons;
  const mecklenburgLargeHexagonsBounds = {
    url: `${dataPath}/mecklenburgLargeHexagons.json`,
    layer: "hexagons",
    code: "bin"
  };
  let mecklenburgLargeHexagonIdField = "bin"
  let mecklenburgLargeHexagonColorField = "count"
  let mecklenburgLargeHexagonIds = []

  let mecklenburgLargeHexagonsData = [];
  // const colors = ["#ffe9c0", "#fec06b", "#fe802b", "#ed0802", "#cb0076", "#8a00aa", "#8a00aa"]
  // const mecklenburgLargeColors = ["#f6dfbe", "#ceb897", "#a38e6d", "#584222","#584222", "#584222", "#584222"]
  getTopo(mecklenburgLargeHexagonsBounds.url, mecklenburgLargeHexagonsBounds.layer)
  .then(res => {
    mecklenburgLargeHexagons = res
    // const colors = ["#FFE9F7", "#FFACDD", "#FFACDD", "#FB86CB", "#D36DAA", "#AA5688", "#803F66"]
    mecklenburgLargeHexagonIds = new Set()
    res.features.forEach(d => {
      d.properties.opacity = 1

      // let breaks = [1, 2, 5, 10, 15, 20, 200, 100000]
      // let breaks = [1, 95, 330, 580, 1000, 2000, 2500, 10000]

      let colorValue = d.properties[mecklenburgLargeHexagonColorField]
      d.properties.color = getColor(colorValue, zoomedBreaks, colors)
      // d.properties.color = colors[parseInt(d.properties[mecklenburgLargeHexagonIdField])]
      mecklenburgLargeHexagonsData.push(d.properties)
      mecklenburgLargeHexagonIds.add(d.properties[mecklenburgLargeHexagonIdField])
    });
    mecklenburgLargeHexagonIds = Array.from(mecklenburgLargeHexagonIds)
  });


  let triangleHexagons;
  const triangleHexagonsBounds = {
    url: `${dataPath}/triangleHexagons.json`,
    layer: "hexagons",
    code: "bin"
  };
  let triangleHexagonIdField = "bin"
  let triangleHexagonColorField = "count"
  let triangleHexagonIds = []

  let triangleHexagonsData = [];
  // const colors = ["#ffe9c0", "#fec06b", "#fe802b", "#ed0802", "#cb0076", "#8a00aa", "#8a00aa"]
  // const triangleColors = ["#f6dfbe", "#ceb897", "#a38e6d", "#584222","#584222", "#584222", "#584222"]
  getTopo(triangleHexagonsBounds.url, triangleHexagonsBounds.layer)
  .then(res => {
    triangleHexagons = res
    // const colors = ["#FFE9F7", "#FFACDD", "#FFACDD", "#FB86CB", "#D36DAA", "#AA5688", "#803F66"]
    triangleHexagonIds = new Set()
    res.features.forEach(d => {
      d.properties.opacity = 1

      // let breaks = [1, 2, 5, 10, 15, 20, 200, 100000]
      // let breaks = [1, 95, 330, 580, 1000, 2000, 2500, 10000]

      let colorValue = d.properties[triangleHexagonColorField]
      d.properties.color = getColor(colorValue, zoomedBreaks, colors)
      // d.properties.color = colors[parseInt(d.properties[triangleHexagonIdField])]
      triangleHexagonsData.push(d.properties)
      triangleHexagonIds.add(d.properties[triangleHexagonIdField])
    });
    triangleHexagonIds = Array.from(triangleHexagonIds)
  });




  let triangleLargeHexagons;
  const triangleLargeHexagonsBounds = {
    url: `${dataPath}/triangleLargeHexagons.json`,
    layer: "hexagons",
    code: "bin"
  };
  let triangleLargeHexagonIdField = "bin"
  let triangleLargeHexagonColorField = "count"
  let triangleLargeHexagonIds = []

  let triangleLargeHexagonsData = [];
  // const colors = ["#ffe9c0", "#fec06b", "#fe802b", "#ed0802", "#cb0076", "#8a00aa", "#8a00aa"]
  // const triangleLargeColors = ["#f6dfbe", "#ceb897", "#a38e6d", "#584222","#584222", "#584222", "#584222"]
  getTopo(triangleLargeHexagonsBounds.url, triangleLargeHexagonsBounds.layer)
  .then(res => {
    triangleLargeHexagons = res
    // const colors = ["#FFE9F7", "#FFACDD", "#FFACDD", "#FB86CB", "#D36DAA", "#AA5688", "#803F66"]
    triangleLargeHexagonIds = new Set()
    res.features.forEach(d => {
      d.properties.opacity = 1

      // let breaks = [1, 2, 5, 10, 15, 20, 200, 100000]
      // let breaks = [1, 95, 330, 580, 1000, 2000, 2500, 10000]

      let colorValue = d.properties[triangleLargeHexagonColorField]
      d.properties.color = getColor(colorValue, zoomedBreaks, colors)
      // d.properties.color = colors[parseInt(d.properties[triangleLargeHexagonIdField])]
      triangleLargeHexagonsData.push(d.properties)
      triangleLargeHexagonIds.add(d.properties[triangleLargeHexagonIdField])
    });
    triangleLargeHexagonIds = Array.from(triangleLargeHexagonIds)
  });




  let zoomedInnerCircles;
  const zoomedInnerCirclesBounds = {
    url: `${dataPath}/zoomedInnerCircles.json`,
    layer: "innerCircles",
    code: "bin"
  };
  let zoomedInnerCircleIdField = "bin"
  let zoomedInnerCircleColorField = "count"
  let zoomedInnerCircleIds = []

  let zoomedInnerCirclesData = [];
  // const zoomedInnerCirclesColors = ["#f6dfbe", "#ceb897", "#a38e6d", "#584222","#584222", "#584222", "#584222"]
  // const zoomedInnerCirclesColors = ["#bbbead", "#8d9b83", "#597254", "#3c4e38","#3c4e38", "#3c4e38"]
  getTopo(zoomedInnerCirclesBounds.url, zoomedInnerCirclesBounds.layer)
  .then(res => {
    zoomedInnerCircles = res
    // const colors = ["#FFE9F7", "#FFACDD", "#FFACDD", "#FB86CB", "#D36DAA", "#AA5688", "#803F66"]
    zoomedInnerCircleIds = new Set()
    res.features.forEach(d => {
      d.properties.opacity = 1

      // let breaks = [1, 2, 10, 50, 100, 500, 1000, 10000]
      // let breaks = [1, 95, 330, 580, 1000, 2000, 2500, 10000]
      let colorValue = d.properties[zoomedInnerCircleColorField]
      d.properties.color = getColor(colorValue, breaks, colors)
      // d.properties.color = zoomedInnerCirclesColors[parseInt(d.properties[zoomedInnerCircleIdField])]
      zoomedInnerCirclesData.push(d.properties)
      zoomedInnerCircleIds.add(d.properties[zoomedInnerCircleIdField])
    });
    zoomedInnerCircleIds = Array.from(zoomedInnerCircleIds)
  });




  let zoomedOuterCircles;
  const zoomedOuterCirclesBounds = {
    url: `${dataPath}/zoomedOuterCircles.json`,
    layer: "outerCircles",
    code: "bin"
  };
  let zoomedOuterCircleIdField = "bin"
  let zoomedOuterCircleColorField = "count"
  let zoomedOuterCircleIds = []

  let zoomedOuterCirclesData = [];
  // const colors = ["#ffe9c0", "#fec06b", "#fe802b", "#ed0802", "#cb0076", "#8a00aa", "#8a00aa"]
  // const zoomedOuterCirclesColors = ["#f6dfbe", "#ceb897", "#a38e6d", "#584222","#584222", "#584222", "#584222"]
  getTopo(zoomedOuterCirclesBounds.url, zoomedOuterCirclesBounds.layer)
  .then(res => {
    zoomedOuterCircles = res
    // const colors = ["#FFE9F7", "#FFACDD", "#FFACDD", "#FB86CB", "#D36DAA", "#AA5688", "#803F66"]
    zoomedOuterCircleIds = new Set()
    res.features.forEach(d => {
      d.properties.opacity = 1
      d.properties.color = "#d6ccbf"
      zoomedOuterCirclesData.push(d.properties)
      zoomedOuterCircleIds.add(d.properties[zoomedOuterCircleIdField])
    });
    zoomedOuterCircleIds = Array.from(zoomedOuterCircleIds)
  });




  let mecklenburg;
  getTopo(`${dataPath}/mecklenburgOutline.json`, 'mecklenburgOutline').then(res => {mecklenburg = res})


  let mecklenburgOutline;
  getTopo(`${dataPath}/mecklenburgOutline.json`, 'mecklenburgOutline').then(res => {mecklenburgOutline = res})



  let triangle;
  getTopo(`${dataPath}/triangle.json`, 'triangle').then(res => {triangle = res})


const stateNames = {
  'type': 'FeatureCollection',
  'features': [{
    'type': 'Feature',
    'properties': {
      'description': "North Carolina",
    },
    'geometry': {
      'type': 'Point',
      'coordinates': [-79.52368355753673, 35.597597716764014]
    }
  }]
}

const areaNames = {
  'type': 'FeatureCollection',
  'features': [{
      'type': 'Feature',
      'properties': {
        'description': "Mecklenburg County",
        "anchor": "left"
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [ -80.68096704101562, 35.440620131105106]
      }
    },
    {
      'type': 'Feature',
      'properties': {
        'description': 'The Triangle',
        "anchor": "bottom"
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [ -78.680685, 36.058044]
      }
    }
  ]
}

const labelLines =  {
  // 'type': 'FeatureCollection',
  // 'features': [{
  //   "type": "Feature",
  //   'properties': {
  //     'description': "Mecklenburg County",
  //     "anchor": "left"
  //   },
  //   "geometry": {
  //     "type": "LineString",
  //     "coordinates": [
  //       [
  //         -80.70642404258251,
  //         35.440620131105106
  //       ],
  //       [
  //         -80.68496704101562,
  //         35.440620131105106
  //       ]
  //     ]
  //   }
  // }]
  }


const cityNames = {
  'type': 'FeatureCollection',
  'features': [{
      'type': 'Feature',
      'properties': {
        'description': "Raleigh",
        "anchor": "bottom"
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [-78.64444495047535, 35.78109573992683]
      }
    },
    {
      'type': 'Feature',
      'properties': {
        'description': 'Charlotte',
        "anchor": "bottom"
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [-80.84366020362712, 35.206172056567464]
      }
    },
    {
      'type': 'Feature',
      'properties': {
        'description': "Greensboro",
        "anchor": "bottom"
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [-79.79222785954914, 36.07254573709124]
      }
    },
    {
      'type': 'Feature',
      'properties': {
        'description': 'Durham',
        "anchor": "left"
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [ -78.89980946336507, 35.99487985945232]
      }
    },
    {
      'type': 'Feature',
      'properties': {
        'description': 'Chapel Hill',
        "anchor": "left"
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [ -79.05601474766779, 35.91338374801415]
      }
    },
    {
      'type': 'Feature',
      'properties': {
        'description': 'Winston-Salem',
        "anchor": "bottom"
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [-80.24534805661504, 36.10006845221626]
      }
    },
    {
      'type': 'Feature',
      'properties': {
        'description': 'Wilmington',
        "anchor": "left"
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [-77.88701582090276, 34.21523023886625]
      }
    },
    {
      'type': 'Feature',
      'properties': {
        'description': 'Fayetteville',
        "anchor": "bottom"
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [ -78.87780666559533, 35.04949344852321]
      }
    },
    {
      'type': 'Feature',
      'properties': {
        'description': 'Fuquay-Varina',
        "anchor": "bottom"
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [-78.79971446571116, 35.584000521626606]
      }
    },
    {
      'type': 'Feature',
      'properties': {
        'description': 'Holly Springs',
        "anchor": "bottom"
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [ -78.83383358844306, 35.651110473781536]
      }
    },
    {
      'type': 'Feature',
      'properties': {
        'description': 'Asheville',
        "anchor": "bottom"
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [ -82.55192435347698, 35.594594865885625]
      }
    }
  ]
}

const residenceNames =  {
  'type': 'FeatureCollection',
  'features': [{
      'type': 'Feature',
      'properties': {
        'description': "29203",
        "label": "29203-label",
        "anchor": "bottom"
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [-81.031016, 34.088455]
      }
    }
  ]
}

  let choroplethMap = null;





  let surroundingStates;
  const surroundingStatesBounds = {
    url: `${dataPath}/surrounding_states.json`,
    layer: "surrounding_states",
    code: "postal"
  };
  // Get geometry for geojson maps
  getTopo(surroundingStatesBounds.url, surroundingStatesBounds.layer)
  .then(res => surroundingStates = res);



  let northCarolina;
  const northCarolinaBounds = {
    url: `${dataPath}/north_carolina.json`,
    layer: "north_carolina",
    code: "GEOID"
  };
  // Get geometry for geojson maps
  getTopo(northCarolinaBounds.url, northCarolinaBounds.layer)
  .then(res => northCarolina = res);

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

  let roads;
  let roadsData = [];
  getTopo(`${dataPath}/roads.json`, "roads").then(res => { 
    roads = res
    res.features.forEach(d => {
      roadsData.push(d.properties)
    })
  })

  let streets;
  let streetsData = [];
  getTopo(`${dataPath}/streets.json`, "streets").then(res => { 
    streets = res
    res.features.forEach(d => {
      streetsData.push(d.properties)
    })
  })



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
    if (choroplethMap) {
      triggerPixel = choroplethMap.offsetTop - offset
    }
  })
  $: if (scrollY > triggerPixel) {
    shouldLoad = true;
  }


  let customAttribution = ""
  customAttribution = ""
  let residenceLinesDrawn = false;
  let residencesDrawn = false;
  let residencesHeatmapDrawn = false;
  let northCarolinaLinesDrawn = false;
  let northCarolinaDrawn = false;
  let surroundingStatesDrawn = false;
  let innerCirclesDrawn = false;
  let outerCirclesDrawn = false;
  let drawnHighwayBorder = false;
  let drawnHighway = false;
  let drawnStreetBorder = false;
  let drawnStreet = false;
  let drawnOuterTurningCircle = false;


  let topLayerDrawn = false;
  let paintStyles;
  let layoutStyles;
  let mapId = "statewide-map"


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
    <div slot="background" style={`height: ${$windowHeight}px; pointer-events: ${pointerEvents}`}>

      <div class="map" use:inview="{options}" on:change="{handleChange}">
        {#if residences && residencesData && (isInView || shouldLoad)}

        <Map id={mapId} style={styleUrl} location={{bounds: bounds.north_carolina}} bind:map={choroplethMap} interactive={false} controls={false} attribution={"bottom-left"} customAttribution={customAttribution}>
<!--           <MapLegend
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
              promoteId={northCarolinaBounds.code}
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
              promoteId={surroundingStatesBounds.code}
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
              data={mecklenburgLargeHexagons}
              promoteId={mecklenburgLargeHexagonsBounds.code}
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
              promoteId={mecklenburgHexagonsBounds.code}
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
              promoteId={homesBounds.code}
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
              data={triangleLargeHexagons}
              promoteId={triangleLargeHexagonsBounds.code}
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
              promoteId={triangleHexagonsBounds.code}
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
              promoteId={hexagonsBounds.code}
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
              promoteId={zoomedHexagonsBounds.code}
              maxzoom={24}
            >
              <MapLayerType {layerOrder} layerType="fill" {mapId} {paintStyles} id="zoomed-hexagon-fill"/>
              <MapLayerType {layerOrder} layerType="line" {mapId} {paintStyles} {layoutStyles} id="zoomed-hexagon-line"/>
            </MapSource>



   

          {/if}






<!-- 

        <MapSource
          id="innerCircles"
          type="geojson"
          data={innerCircles}
          promoteId={innerCirclesBounds.code}
          maxzoom={24}>
           <MapLayer
            id="innerCircles-fill"
            type="fill"
             bind:drawn={innerCirclesDrawn}    
            select={true}
            paint={{
              'fill-color': ['get', 'color'],
              'fill-opacity': [
                "interpolate",
                  ["linear"],
                  ["zoom"],
                  8,
                  1,
                  9,
                  0,
                  14,
                  0
                ],
              "fill-opacity-transition": {
                "duration": 1,
                "delay": 0
              }
            }}
          >
          </MapLayer>
          <MapLayer
              id="innerCircle-lines"
              type="line"
              paint={{
                'line-color': ['get', 'color'], //'#D7D0D4',
                "line-opacity": [
                "interpolate",
                  ["linear"],
                  ["zoom"],
                  8,
                  1,
                  9,
                  0,
                  14,
                  0
                ], //0.8
                'line-width': 3,
              }}
            >
          </MapLayer>
        </MapSource>


        <MapSource
          id="outerCircles"
          type="geojson"
          data={outerCircles}
          promoteId={outerCirclesBounds.code}
          maxzoom={24}>
          <MapLayer
              id="outerCircle-lines"
              type="line"
              paint={{
                'line-color': ['get', 'color'],
                "line-opacity":[
                  "interpolate",
                    ["linear"],
                    ["zoom"],
                    8,
                    0.8,
                    9,
                    0,
                    14,
                    0
                  ],
                'line-width': 1,
              }}
            >
          </MapLayer>
        </MapSource>















        <MapSource
          id="zoomedInnerCircles"
          type="geojson"
          data={zoomedInnerCircles}
          promoteId={zoomedInnerCirclesBounds.code}
          maxzoom={24}>
           <MapLayer
            id="zoomedInnerCircles-fill"
            type="fill"
            select={true}
            paint={{
              'fill-color': ['get', 'color'],
              'fill-opacity': [
                "interpolate",
                  ["linear"],
                  ["zoom"],
                  8,
                  0,
                  9,
                  1,
                  12,
                  1,
                  14,
                  0
                ],
              "fill-opacity-transition": {
                "duration": 300,
                "delay": 0
              }
            }}
          >
          </MapLayer>
          <MapLayer
              id="zoomedInnerCircle-lines"
              type="line"
              paint={{
                'line-color': ['get', 'color'], //'#D7D0D4',
                "line-opacity": [
                "interpolate",
                  ["linear"],
                  ["zoom"],
                  8,
                  0,
                  9,
                  1,
                  12,
                  1,
                  14,
                  0
                ],
                'line-width': 0,
              }}
            >
          </MapLayer>
        </MapSource>


        <MapSource
          id="zoomedOuterCircles"
          type="geojson"
          data={zoomedOuterCircles}
          promoteId={zoomedOuterCirclesBounds.code}
          maxzoom={24}>
          <MapLayer
              id="zoomedOuterCircle-lines"
              type="line"
              paint={{
                'line-color': ['get', 'color'],
                "line-opacity":[
                "interpolate",
                  ["linear"],
                  ["zoom"],
                  8,
                  0,
                  9,
                  1,
                  12,
                  1,
                  14,
                  0
                ],
                'line-width': 0,
              }}
            >
          </MapLayer>
        </MapSource>


 -->














          <!-- DOT DENSITY MAP -->
        <!--   <MapSource
            id="residences-points"
            type="geojson"
            data={residences}
            promoteId={residencesBounds.code}
            maxzoom={24}>

            <MapLayer
              id="residences-point-fill"
              data={residencesData}
              highlight={true}
              {highlighted}
              clickIgnore={true}
              type="circle"
              paint={{
                'circle-color': [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    3,
                    "rgba(0,0,0,0)",
                    10,
                    "rgba(0,0,0,0)",
                    12,
                    colors[6],
                    // ['get', 'investorColor'],
                    14,
                    // colors[6],
                    ['get', 'investorColor'],
                    15,
                    // colors[6]
                    ['get', 'investorColor']
                  ],
                'circle-opacity': [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    3,
                    0,
                    10,
                    0,
                    12,
                    0.7,
                    13,
                    0.7,
                    14,
                    1,
                    15,
                    1
                  ],
                 'circle-radius': [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    3,
                    2,
                    10,
                    2,
                    14,
                    4
                  ],
                "circle-opacity-transition": {
                  "duration": 300,
                  "delay": 0
                },
                "circle-stroke-width": 1,
                "circle-stroke-color": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    3,
                    "rgba(0,0,0,0)",
                    10,
                    "rgba(0,0,0,0)",
                    12,
                    colors[6],
                    // ['get', 'investorColor'],
                    14,
                    // colors[6],
                    ['get', 'investorColor'],
                    15,
                    // colors[6]
                    ['get', 'investorColor']
                  ],
                "circle-stroke-opacity": 0.4
              }}
            >
            </MapLayer>
          </MapSource>

 -->


          <!-- <MapSource
            id="residences"
            type="geojson"
            data={residences}
            promoteId={residencesBounds.code}
            bind:loaded={residencesLoaded}
            props={{
              cluster: true,
              clusterMaxZoom: 14, // Max zoom to cluster points on
              clusterRadius: 5 // Radius of each cluster when clustering points (defaults to 50)
            }}
            maxzoom={24}>

            <MapLayer
              id="residences-fill"
              data={residencesData}
              bind:drawn={residencesDrawn}    
              highlight={true}
              {highlighted}
              clickIgnore={true}
              type="circle"
              paint={{
                'circle-color': ['case',
                    ['==', ['has', 'point_count'], true],
                    [
                      'step',
                      ['get', 'point_count'],
                      colors[0],
                      1,
                      colors[1],
                      2,
                      colors[2],
                      10,
                      colors[3],
                      50,
                      colors[4],
                      100,
                      colors[5],
                      500,
                      colors[0]
                    ],
                    colors[0]
                  ],
                  'circle-opacity': [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    3,
                    0,
                    8,
                    0,
                    10,
                    ['case',
                      ['==', ['has', 'point_count'], true],
                      [
                        'step',
                        ['get', 'point_count'],
                        0.8,
                        1,
                        0.8,
                        2,
                        0.8,
                        10,
                        0.8,
                        50,
                        0.9,
                        100,
                        0.9,
                        500,
                        0.9
                      ],
                      0.8,
                    ],
                    14,
                    0
                  ],
                // 'circle-opacity':['case',
                //     ['==', ['has', 'point_count'], true],
                //     [
                //       'step',
                //       ['get', 'point_count'],
                //       0.8,
                //       1,
                //       0.8,
                //       2,
                //       0.8,
                //       10,
                //       0.8,
                //       50,
                //       0.6,
                //       100,
                //       0.9,
                //       500,
                //       0.9
                //     ],
                //     0.8
                //   ],
                'circle-radius': ['case',
                    ['==', ['has', 'point_count'], true],
                    [
                      'step',
                      ['get', 'point_count'],
                      5,
                      10,
                      10,
                      40,
                      20,
                      100,
                      40,
                      200,
                      6
                    ],
                    6
                  ],
                "circle-opacity-transition": {
                  "duration": 300,
                  "delay": 0
                }
              }}
            >
            </MapLayer> -->

<!--             <MapLayer
              id="residences-heatmap"
              data={residencesData}
              bind:drawn={residencesHeatmapDrawn}    
              highlight={true}
              {highlighted}
              clickIgnore={true}
              type="heatmap"
              paint={{
              // Increase the heatmap weight based on frequency and property magnitude
              'heatmap-weight': [
                'step',
                ['get', 'point_count'],
                1,
                50,
                2,
                100,
                1
                ],
              // Increase the heatmap color weight weight by zoom level
              // heatmap-intensity is a multiplier on top of heatmap-weight
              'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                  0,
                  1,
                  9,
                  3
                ],
              // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
              // Begin color ramp at 0-stop with a 0-transparancy color
              // to create a blur-like effect.
              'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              "#FFFCF8",
              0.1,
              colors[1],
              0.2,
              colors[2],
              0.4,
              colors[3],
              0.6,
              colors[4],
              0.8,
              colors[5],
              1,
              colors[6],
              ],
              // Adjust the heatmap radius by zoom level
              'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              2,
              9,
              10
              ],
              // Transition from heatmap to circle layer by zoom level
              'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              1,
              9,
              0
              ]
              }}
            >
            </MapLayer>




          </MapSource>
 -->


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
            map={choroplethMap}
          />
        </div>
      {/each}
      <div style={`height: ${0.5 * $windowHeight}px; display: flex;
      display: -webkit-flex; justify-content: center;`}/>
    </div>
  </Scroller>
  <div id="after-map"/>

</div>  
