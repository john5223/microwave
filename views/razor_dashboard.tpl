%rebase layout title="Microwave - Razor"

	
<div class="l">

	<div id="razor_active_models"></div>

</div>





<script>

$( document ).ready(function() {
	
	function doPoll(){
		$.post('/razor', function(data) {
		    alert(data);  // process results here
		    setTimeout(doPoll,5000);
		});
	}

	
}

</script>