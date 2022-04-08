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
export function addDataToVideoElement(video, frameRate=30, pixelsPerFrame=20) {
  const videoDuration = parseFloat(video?.duration, 10);

  if ('scrollingTexts' in video) {
    video.scrollingTexts = video.scrollingTexts.map(item => {
      item.seconds = timestampToSeconds(item.timestamp);
      return item;
    });
  }
  
  video.height = videoDuration * frameRate * pixelsPerFrame;
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
export function execResizeCallbackWithSuspend(elements, resizeObserver, callback) {
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

export async function getTopo(url, layer) {
  let response = await fetch(url);
  let json = await response.json();
  let geojson = await feature(json, layer);
  return geojson;
}


// SOURCE: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function rgbToHex(r, g, b) {
  r = Math.round(r)
  g = Math.round(g)
  b = Math.round(b)
  const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  return hex
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