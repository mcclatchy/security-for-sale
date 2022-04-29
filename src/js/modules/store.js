import { writable, derived, readable } from 'svelte/store';
import { isMobile, isTablet } from './utils.js';

export const activeVideo = writable('');
export const activeTimelineSection = writable(null);
export const droneTriggerElement = writable(null)
export const isFirstVideoLoaded = writable(false);
export const isIntroLoaded = writable(false)

// Statewide map states
export const statewideZoom = writable('north_carolina');

export const initialOrientationAngle = readable(window.orientation);
export const updatedOrientationAngle = writable(window.orientation);

export const isRotated = derived(
    [initialOrientationAngle, updatedOrientationAngle],
    ([$initialOrientationAngle, $updatedOrientationAngle]) => $updatedOrientationAngle !== $initialOrientationAngle
)

export const windowHeight = writable(isMobile.ios() || isTablet.ipad() ? window.outerHeight : window.innerHeight);
export const windowWidth = writable(window.innerWidth);
export const aspectRatio = derived(
    [windowWidth, windowHeight],
    ([$windowWidth, $windowHeight]) => ($windowWidth / $windowHeight)
)

export const orientationAngle = writable(window.orientation);

export const orientation = derived(
    aspectRatio,
    $aspectRatio => $aspectRatio >= 1 ? "landscape" : $aspectRatio >= 0.8 ? "middle" : "portrait"
)
export const isPortrait = derived(
    orientation,
    $orientation => $orientation === "portrait" || $orientation === "middle"
)
export const storeInnerHeight = writable(window.innerHeight);
export const storeOuterHeight = writable(window.outerHeight);


// MAP STYLING
export const layersDrawn = writable([])

// AML REPLACING LINK
export const domain = writable(window.pageInfo["marketInfo.domain"]);