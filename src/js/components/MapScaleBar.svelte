<script>
  import mapbox from '../../lib/mapbox-gl@1.13.2';

	export let map;
	export let maxWidth = 160;
	export let unit = "imperial";
	export let position = "bottom-right"

	const scale = new mapbox.ScaleControl({
		maxWidth,
		unit
	});
	map.addControl(scale, position);

</script>