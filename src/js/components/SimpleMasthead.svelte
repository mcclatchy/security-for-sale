<script>
// Market masthead override to hide default flag and replace with simple logo-only one
const domain = window.pageInfo["marketInfo.domain"];
const logoAltText = window.pageInfo["marketInfo.logoAltText"];

</script>

<div class="simple-flag">
    <a href="https://www.{domain}.com" class="market-logo" aria-label={logoAltText}>
        <img id="top-logo" src="https://{domain}.com/wps/build/images/{domain}/logo.svg" alt="{domain} Logo">
    </a>
</div>

<style lang="postcss">
.simple-flag {
  right: 0;
  left: 0;
  position: absolute;
  top: 0;
  margin-top: 25px;
  z-index: 99999999;
  text-align: center;

  & a {
    display: inline-block;
    height: 24px;
  }
  & img {
    opacity: 1;
    height: inherit;
    filter: brightness(0%) invert(25%) sepia(7%) saturate(3345%) hue-rotate(314deg) brightness(85%) contrast(85%);
  }
}
</style>