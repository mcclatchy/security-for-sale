import { feature } from 'topojson-client';
import {rgb} from "https://cdn.skypack.dev/d3-color@3";


export function tweenProgress(start, end, current, startValue=0, endValue=1) {
  let range = end - start;
  let progress = current - start;
  let tweenedPct = Math.round(progress / range * 100) / 100;
  let tweenedValue = startValue + (endValue - startValue) * tweenedPct

  if (tweenedPct < 0) {
    return startValue;
  } else if (tweenedPct > 1) {
    return endValue;
  } else {
    return tweenedValue;
  }
}

export function roundNum(number, decPlaces=0) {
  const multiplier = Math.pow(10, decPlaces)
  const rounded = Math.round(number * multiplier) / multiplier;
  return rounded
}

// https://stackoverflow.com/questions/2685911/is-there-a-way-to-round-numbers-into-a-reader-friendly-format-e-g-1-1k
export function abbrNum(number, decPlaces=0) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "k", "m", "b", "t" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
             // Here, we multiply by decPlaces, round, and then divide by decPlaces.
             // This gives us nice rounding to a particular decimal place.
             number = Math.round(number*decPlaces/size)/decPlaces;

             // Handle special case where we round up to the next abbreviation
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }

             // Add the letter for the abbreviation
             number += abbrev[i];

             // We are done... stop
             break;
        }
    }

    return number;
}

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

export function amlToHTML(text, removeBreaks=false) {
  let htmlText = replaceAll(text, /\[([^\]]+)\]\(([^\)]+)\)/, '<a target="_blank" href="$2">$1</a>');
  if (isMobile.any() && removeBreaks) {
    htmlText = replaceAll(htmlText, '<br>', ' ')
  }
  return htmlText;
}

export function getArrayItemById(id, array) {
  const item = array.find(elem => elem.id === id);
  return item;
}

export function timestampToSeconds(ts) {
  let [minutes, seconds] = ts.split(":")
  minutes = parseInt(minutes, 10)
  seconds = parseFloat(seconds, 10)

  const totalSeconds = 60 * minutes + seconds
  return totalSeconds
}

// TODO: pixelsPerFrame=5 for gallery slide videos
export function addDataToVideoElement(video, frameRate=30, pixelsPerFrame=20, portraitPixelsPerFrame=10) {
  const videoDuration = parseFloat(video?.landscape?.duration, 10);
  const portraitDuration = parseFloat(video?.portrait?.duration, 10);

  if ('scrollingTexts' in video) {
    video.scrollingTexts = video.scrollingTexts.map(item => {
      item.seconds = timestampToSeconds(item?.landscape?.timestamp);
      item.portraitSeconds = timestampToSeconds(item?.portrait?.timestamp);

      // For tracking text items from bottom to top
      item.endSeconds = item?.landscape?.endTimestamp && timestampToSeconds(item?.landscape?.endTimestamp);
      item.portraitEndSeconds = item?.portrait?.endTimestamp && timestampToSeconds(item?.portrait?.endTimestamp);

      return item;
    });
  }
  
  video.landscape.height = videoDuration * frameRate * pixelsPerFrame;
  video.portrait.height = portraitDuration * frameRate * portraitPixelsPerFrame;
  video.time = 0;
  return video;
}



export function getPixelHeightFromTimestamp(timestamp, video, windowHeight) {
  let pixelHeight = 0;
  let offset = windowHeight + video.offset;
  pixelHeight += (timestamp / video.duration) * (video.nonPausedHeight) - windowHeight;
  pixelHeight += offset
  return pixelHeight;
}

export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function getColor(value, breaks, colors) {
  if (!value) {
    return null;
  }
  let color;
  let found = false;
  let i = 1;
  while (found == false) {
    if (value <= breaks[i]) {
      color = colors[i - 1];
      found = true;
    } else if (value >= breaks[breaks.length - 1]) {
      color = colors[breaks.length - 1];
      found = true;
    } else {
      i ++;
    }
  }
  return color ? color : null;
}

// From old Pudding starter template - https://github.com/the-pudding/starter/blob/master/src/js/utils/is-mobile.js (MIT license)
// device sniffing for mobile

export const isMobile = {
  android: () => navigator.userAgent.match(/Android/i),
  blackberry: () => navigator.userAgent.match(/BlackBerry/i),
  ios: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
  opera: () => navigator.userAgent.match(/Opera Mini/i),
  windows: () => navigator.userAgent.match(/IEMobile/i),

  any: () => (
    isMobile.android() ||
    isMobile.blackberry() ||
    isMobile.ios() ||
    isMobile.opera() ||
    isMobile.windows()
  ),
}


export const isDesktop = {
  chrome: () => navigator.userAgent.indexOf('Chrome') != -1 && navigator.userAgent.indexOf('Opera') == -1,
  explorer: () => navigator.userAgent.indexOf('MSIE') > -1,
  firefox: () => navigator.userAgent.indexOf('Firefox') > -1,
  safari: () => navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1,
  opera: () => navigator.userAgent.toLowerCase().indexOf("op") > -1,

  any: () => {
    isDesktop.chrome() ||
    isDesktop.explorer() ||
    isDesktop.firefox() ||
    isDesktop.safari() ||
    isDesktop.opera()
  }
}

export const isTablet = {
  ipad: () => {
    // from https://www.npmjs.com/package/isipad
    const userAgentString = window.navigator.userAgent
    const navigator = window.navigator
    const isIpadOS = (navigator.platform && navigator.platform.indexOf('iPad') >= 0) || (userAgentString.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2)
    return RegExp(/iPad|iOS/).test(userAgentString) || isIpadOS
  },
  generic: () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isTablet = RegExp(/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/).test(userAgent);
    return isTablet;
  },
  any: () => (
    isTablet.ipad() ||
    isTablet.generic()
  )
}

// SOURCE: https://blog.elantha.com/resizeobserver-loop-limit-exceeded/
export async function execResizeCallbackWithSuspend(elements, resizeObserver, callback) {
  const initialSizes = elements.map(element => 
    element.getBoundingClientRect()
  );

  callback();

  const postCallbackSizes = elements.map(element =>
    element.getBoundingClientRect()
  );

  const resizedElements = elements.filter(
    (_, i) =>
      initialSizes[i].width !== postCallbackSizes[i].width ||
      initialSizes[i].height !== postCallbackSizes[i].height
  );

  resizedElements.forEach(element => resizeObserver.unobserve(element));

  window.requestAnimationFrame(() => {
    resizedElements.forEach(element => resizeObserver.observe(element));
  });
}

export async function getTopoLayer(url, layer) {
  let response = await fetch(url);
  let json = await response.json();
  let geojson = await feature(json, layer);
  return geojson;
}

export async function getJsonData(url, layer) {
  let response = await fetch(url);
  let json = await response.json();
  return json;
}

export async function formatTopojsonLayer(json, layer, colorField=null, colors=null, breaks=null, colorDict=null, defaultColor="rgba(242,242,242,1)") {
  let topojson = await feature(json, layer);
  if (colorField) {
    topojson.features.forEach(d => {
      let colorValue = d.properties[colorField]
      if (colors && breaks) {
        d.properties.color = getColor(colorValue, breaks, colors)
      } else if (colorDict) {
        d.properties.color = colorDict.hasOwnProperty(colorValue) ? colorDict[colorValue] : defaultColor;
      }
    });
  }
  return topojson;
}

export async function getAndFormatTopojsonData(url, layer, colorField=null, colors=null, breaks=null, colorDict=null, defaultColor="rgba(242,242,242,1)") {
  let json = await getJsonData(url);
  let formattedTopojson = formatTopojsonLayer(json, layer, colorField, colors, breaks, colorDict, defaultColor)
  return formattedTopojson;
}


// SOURCE: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function rgbToHex(r, g, b) {
  r = Math.round(r)
  g = Math.round(g)
  b = Math.round(b)
  const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  return hex
} 

   
export function getUnixTimestamp() {
  const dateStr = '2022-06-22';
  const date = new Date(dateStr);
  const timestampInMs = date.getTime();
  const unixTimestamp = Math.floor(date.getTime() / 1000);
}

// SOURCE: https://github.com/narroviz/article-wnba-season-history/blob/master/src/js/graphic.js
export function makeColors(primaryColor, numDarker=4, numLighter=4, pctDarker=0.64, pctLighter=0.64) {
  const rgbPrimaryColor = rgb(primaryColor)
  const primaryRed = rgbPrimaryColor.r
  const primaryGreen = rgbPrimaryColor.g
  const primaryBlue = rgbPrimaryColor.b

  const darkScale = [rgbPrimaryColor]
  const darkerColors = [primaryColor]
  const darkRedStep = primaryRed * pctDarker / numDarker
  const darkGreenStep = primaryGreen * pctDarker / numDarker
  const darkBlueStep = primaryBlue * pctDarker / numDarker
  for (var i = 0; i < numDarker; i++) {
    const darkerColor = rgb(
      darkScale[i].r - darkRedStep,
      darkScale[i].g - darkGreenStep,
      darkScale[i].b - darkBlueStep,
    )
    const darkerHexColor = rgbToHex(
      darkScale[i].r - darkRedStep,
      darkScale[i].g - darkGreenStep,
      darkScale[i].b - darkBlueStep,
    )
    darkScale.push(darkerColor)
    darkerColors.push(darkerHexColor)
  }

  const lightScale = [rgbPrimaryColor]
  const lighterColors = [primaryColor]
  const lightRedStep = (255 - primaryRed) * pctLighter / numLighter
  const lightGreenStep = (255 - primaryGreen) * pctLighter / numLighter
  const lightBlueStep = (255 - primaryBlue) * pctLighter / numLighter
  for (var i = 0; i < numLighter; i++) {
    const lighterColor = rgb(
      lightScale[i].r + lightRedStep,
      lightScale[i].g + lightGreenStep,
      lightScale[i].b + lightBlueStep,
    )
    const lighterHexColor = rgbToHex(
      lightScale[i].r + lightRedStep,
      lightScale[i].g + lightGreenStep,
      lightScale[i].b + lightBlueStep,
    )
    lightScale.push(lighterColor)
    lighterColors.push(lighterHexColor)
  }

  // Remove 1st element to avoid double inclusion
  darkScale.shift()
  darkerColors.shift()
  const colorScale = [lighterColors.reverse(), darkerColors].flat(1);
  return colorScale
}


// Expects bbox to be this format: [[lon,lat], [lon,lat]]
export function getBBoxAspectRatio(bbox) {
  const lon1 = bbox[0][0];
  const lon2 = bbox[1][0];

  const lat1 = bbox[0][1];
  const lat2 = bbox[1][1];

  const horizontalSide = getDistanceFromLatLonInKm(lon1, lat1, lon2, lat1);
  const verticalSide = getDistanceFromLatLonInKm(lon1, lat1, lon1, lat2);

  const aspectRatio = Math.round(horizontalSide / verticalSide * 100) / 100;
  return aspectRatio;
}

export function replaceLinkDomain(link, newDomain, oldDomain) {
  if (!newDomain || !oldDomain) {
    return link;
  }
  const replacedLink = link.replaceAll(`www.${oldDomain}.com`, `www.${newDomain}.com`);
  return replacedLink;
}

function getDistanceFromLatLonInKm(lon1, lat1, lon2, lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

export function getDivAspectRatio(div) {
  return Math.round(div.offsetWidth / div.offsetHeight * 100) / 100;
}

// SOURCE: https://github.com/watson/nearest-date
// Sorted assumes it's sorted in ascending order
export function nearestDate(dates, target, sorted=true) {
  if (!target) target = Date.now()
  else if (target instanceof Date) target = target.getTime()

  var nearest = Infinity
  var winner = -1

  for (var index = 0; index < dates.length; index++) {
    let date = dates[index]
    if (date instanceof Date) date = date.getTime()
    var distance = Math.abs(date - target)
    if (distance < nearest) {
      nearest = distance
      winner = index
    }
    if (sorted && distance > nearest) {
      break;
    }
  }
  return winner
}

export function setupIcon(map, filepath, imageName, width=200, height=200, sdf=false) {
  let img = new Image(width, height)
  img.crossOrigin = "Anonymous";
  img.onload = ()=> map.addImage(imageName, img, {sdf})
  img.src = filepath
}