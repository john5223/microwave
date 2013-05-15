%rebase layout title="Dashboard"	

	<style>
		select {height: 220px; width: 250px; margin-bottom:5px}		
		
		#node_info { height: 300px; width: 350px; overflow: auto; } 
	
	</style>

	
	<div class="l">
		<h2> Environments </h2> 
		<select id="environments" multiple="multiple">	
			<option selected=true> ALL </option> 
			%for env in environments:
				<option> {{env}} </option>
			%end		
		</select>	
		
		
		<h2> Cookbooks </h2> 
		<select id="cookbooks" multiple="multiple">	 
			%for cookbook in cookbooks:
				<option> {{cookbook}} </option>
			%end		
		</select>	
		
		
		
		
	</div>


	<div class="l">
		<h2> Container Nodes </h2> 
		<select id="nodes" multiple="multiple" class="node_container">	
			%for node in nodes:
				<option> {{node}} </option>
			%end		
		</select>	
		
		<h2> Other Nodes </h2> 
		<select id="nodes" multiple="multiple" class="node_container">	
			
		</select>	
		
		
	</div>
	<div class="l">
		<h2> Info </h2> 
	
		
		<h3> Attributes </h3>
		<textarea id="node_info" readonly> </textarea> 
		
		
	</div>
	
	
	
	
<script>
	
$( document ).ready(function() {
	
	$('.environments').change( function () {
	
	});
	
	$('.node_container').change(function() {
        
        
        var selectedValue = $(this).val();
		console.log("the value you selected: " + selectedValue);
		
		data = {"name":selectedValue.join()}
		$.ajax({
		  url:"/node",
		  type:"POST",
		  data:JSON.stringify(data),
		  contentType:"application/json; charset=utf-8",
		  dataType:"json",
		  success: function(data,status){
		    // console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
		    console.log( Object.keys(data) ) ;
		    $("#node_info").val('');
		    
		    if ( data['error'] ) {
		    	$("#node_info").val(data['error']);
		    }
		    else {
			    $("#node_info").val( JSON.stringify(data, undefined, 2));
		    }
		    
		    
		  }
		});
		

    });
	
	
	
	
	
	
	
 
});

</script>