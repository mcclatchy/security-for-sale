<script>
	import { isMobile, isTablet } from '../modules/utils.js'
    import { storeInnerHeight } from '../modules/store.js';

</script>

<div class="title-container">
    <div class="title">
        Investor Owned Single Family Residences
    </div> 
    <div class="subtitle">
        Each individual dot is a single-family residence <br>
        owned by an investor.
    </div>
</div>

<style>
.title-container {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    display: block;
    pointer-events: all;
    text-align: left;
    position: absolute;
    top: 0;
    left: 0;
    padding-left: 30px;
    padding-top: 20px;
    pointer-events: none;
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


@media only screen and (max-width: 600px) {
    .title-container {
        display: none;
    }
}

</style>