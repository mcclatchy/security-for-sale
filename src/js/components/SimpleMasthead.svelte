<script>
// Market masthead override to hide default flag and replace with simple logo-only one
const domain = window.pageInfo["marketInfo.domain"];
const logoAltText = window.pageInfo["marketInfo.logoAltText"];

</script>

<div class="simple-flag">
    <a href="https://www.charlotteobserver.com" class="market-logo" aria-label="Charlotte Observer">
        <img id="charlotte-logo" class="filtered-logo" src="https://charlotteobserver.com/wps/build/images/charlotteobserver/logo.svg" alt="Charlotte Observer Logo">
    </a>
    <div class="vertical-divider"/>
    <a href="https://www.newsobserver.com" class="market-logo" aria-label="News & Observer">
        <img id="news-logo" class="filtered-logo"src="https://newsobserver.com/wps/build/images/newsobserver/logo.svg" alt="News & Observer Logo">
    </a>
</div>

<style>
  .vertical-divider {
    margin: 0;
    width: 1px;
    height: 30px;
    background: #D93A4C;
    margin: 0 12px;
    margin-top: 2px;
  }
.simple-flag {
  right: 0;
  left: 0;
  position: absolute;
  top: 0;
  z-index: 99999999;
  text-align: center;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  max-width: 600px;
  margin: auto;
  margin-top: 25px;
}
#news-logo {
    height: 28px;
  }
.simple-flag  a {
  display: inline-block;
  height: 30px;
}
.filtered-logo {
  opacity: 1;
  height: inherit;
  filter: brightness(0%) invert(29%) sepia(75%) saturate(1957%) hue-rotate(330deg) brightness(90%) contrast(88%);
}
#charlotte-logo {
  margin-top: 5px;
}

@media only screen and (max-width: 600px) {
  .simple-flag {
    max-width: 100%;
    padding: 10px 0;
  }
  #news-logo {
    height: 18px;
  }
  .simple-flag a {
    height: 19px;
  }
  .vertical-divider { 
    height: 22px;
    margin: 0 11px;
    margin-top: 5px;
  }
}

</style>