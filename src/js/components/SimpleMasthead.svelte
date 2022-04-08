<script>
import { isMobile } from "../modules/utils.js";
import { windowWidth, isPortrait } from '../modules/store.js';

// Market masthead override to hide default flag and replace with simple logo-only one
const domain = window.pageInfo["marketInfo.domain"];
const logoAltText = window.pageInfo["marketInfo.logoAltText"];

</script>

<div class="simple-flag" class:portrait={$isPortrait} class:landscape={!$isPortrait}>
    <a href="https://www.{domain}.com" class="market-logo" aria-label={logoAltText}>
        <img id="top-logo" src="https://{domain}.com/wps/build/images/{domain}/logo.svg" alt="{domain} Logo">
    </a>
</div>

<style lang="postcss">
.portrait {
  right: 0;
  left: 0;
}
.landscape {
  right: 40px;
  left: unset;
}
.simple-flag {
  position: absolute;
  top: 0;
  margin-top: 25px;
  z-index: 10001;
  text-align: center;

  & a {
    display: inline-block;
    height: 24px;
  }
  & img {
    opacity: 1;
    height: inherit;
    filter: brightness(0) saturate(100%) invert(5%) sepia(82%) saturate(2479%) hue-rotate(328deg) brightness(103%) contrast(113%);
  }
}
</style>