<script>
	import { isMobile, isTablet } from '../modules/utils.js'
    import { storeInnerHeight, aspectRatio } from '../modules/store.js';
    let wideBreakpoint = 1.8;
    let portraitBreakpoint = 0.8
    $: classSuffix = $aspectRatio <= portraitBreakpoint ? "-portrait" : ""

</script>

<div class={`title-container${classSuffix}`} style={`position: ${$aspectRatio > portraitBreakpoint ? "absolute" : "relative"}`}>
    <div  class={`title${classSuffix}`}>
        Investor Owned Single Family Residences
    </div> 
    <div  class={`subtitle${classSuffix}`}>
        Each individual dot is a single-family residence <br>
        owned by an investor.
    </div>
</div>

<style>
.title-container {
    max-width: 45%;
    /*margin: 0 auto;*/
    display: block;
    pointer-events: all;
    text-align: left;
    position: absolute;
    top: 0;
    left: 0;
    padding-left: 30px;
    padding-top: 20px;
    pointer-events: none;
    z-index:  10000000;
}   


.title {
    font-size: 25px;
    font-family: "Libre Franklin";
    font-weight: bold;
    width: 100%;
}
.subtitle {
    font-size: 15px;
    font-style: italic;
    font-family: 'Libre Franklin';
    text-align: left;
    font-weight: normal;
    padding-top: 10px;
}



.title-container-portrait {
    position: relative;
    max-width: 100%;
    padding:  0;
    padding: 20px;
    padding-top: 7%;
    padding-bottom: 35px;
}
.title-portrait {
    font-size: 17px;
    font-family: "Libre Franklin";
    font-weight: bold;
    width: 100%;
}
.subtitle-portrait {
    font-size: 12px;
    font-style: italic;
    font-family: 'Libre Franklin';
    text-align: left;
    font-weight: normal;
    padding-top: 5px;
}


</style>