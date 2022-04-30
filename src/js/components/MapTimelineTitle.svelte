<script>
	import { isMobile, isTablet } from '../modules/utils.js'
    import { storeInnerHeight, aspectRatio } from '../modules/store.js';

    export let assetPath;

    let wideBreakpoint = 1.8;
    let portraitBreakpoint = 0.8
    $: classSuffix = $aspectRatio <= portraitBreakpoint ? "-portrait" : ""

</script>

<div class={`title-container${classSuffix}`}>
    <div  class={`title${classSuffix}`}>
        For corporate landlords,<br class="mobile"> a post-recession boom
    </div> 
    <div  class={`subtitle${classSuffix}`}>
        <img class="inline" src={`${assetPath}/hexagon.svg`}/>&nbsp; = &nbsp;Each point is a home purchased by an investor. <br class="mobile">Some properties may have been resold over time.
    </div>
</div>

<style>
    .inline {
        height: 100%;
    }

    .title-container {
        width:  100%;
        /*margin: 0 auto;*/
        display: block;
        pointer-events: all;
        text-align: center;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, 0);
        padding: 0 30px;
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
        text-align: center;
        font-weight: normal;
        padding-top: 10px;
        line-height: 1.25;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
    }



    .title-container-portrait {
        position: absolute;
        top:  0;
        left: 50%;
        transform: translate(-50%, 0);
        width: 100%;
        padding:  0;
        padding: 20px;
        padding-top: 10%;
        padding-bottom: 35px;
        z-index:  10000000;
        margin: 0 auto;
        text-align: center;
    }
    .title-portrait {
        font-size: 20px;
        font-family: "Libre Franklin";
        font-weight: bold;
        width: 100%;
        line-height: 21px;
    }
    .subtitle-portrait {
        font-size: 13px;
        font-style: italic;
        font-family: 'Libre Franklin';
        text-align: center;
        font-weight: normal;
        color: black;
        padding-top: 10px;
        line-height: 16px;
        height: 24px;
    }
    .subtitle-portrait img {
        margin-top: -2px;
    }
</style>