%rebase layout title="Dashboard"	

	<style>
		.container {height: 220px; width: 250px; margin-bottom:5px}		
		
		#node_info { height: 300px; width: 350px; overflow: auto; } 
		#environment_info { width: 350px; height: 120px }
		#cookbook_info { max-width: 300px; width:250px; height: 200px } 
	</style>

	
	<div class="l">
		<h2> Environments </h2> 
		<select id="environments" multiple="multiple" class="container">	
			<option selected=true> ALL </option> 
			%for env in environments:
				<option> {{env}} </option>
			%end		
		</select>	
		
		<br /><br />
		
		<h2> Cookbooks </h2> 
		<select id="cookbooks">	 
			<option> -- </option>
			%for cookbook in cookbooks:
				<option> {{cookbook}} </option>
			%end		
		</select>	
		<select id="cookbook_versions" style="display:none">
		</select>
		<br /><br />
		
		<textarea id="cookbook_info" readonly></textarea>
		
		
		
	</div>


	<div class="l">
		<h2> Container Nodes </h2> 
		<select id="node_container" multiple="multiple" class="container">	
			%for node in nodes:
				<option> {{node}} </option>
			%end		
		</select>	
		
		<br /><br />
		
		<h2> Other Nodes </h2> 
		<select id="other_node_container" multiple="multiple" class="container">	
		
		</select>
	
	</div>
	<div class="l">
		<h2> Info </h2> 
		
		<h3> Environment Attributes </h3>
		<textarea id="environment_info" readonly> </textarea> 
		
		
		
		<h3> Node Attributes </h3>
		<textarea id="node_info" readonly> </textarea> 
		
		
	</div>
	
	
	
	
<script>
	
$( document ).ready(function() {
	
	%import json
	var cookbooks = {{!json.dumps(cookbooks)}};
	
	function fill_cookbook_info() {
		$('#cookbook_info').val('');
		selected_version = $('#cookbook_versions').val();
		selected_cookbook = $('#cookbooks').val();
		console.log(selected_version);
		if (selected_version != null) {
			$.ajax ({
				url: "/cookbooks/"+selected_cookbook+"/"+selected_version,
				success: function(data,status) {
					$('#cookbook_info').val(JSON.stringify(data,undefined,2));
				}
			});
		}
	}
	
	$('#cookbook_versions').change( function () { fill_cookbook_info(); } ) ;

	$('#cookbooks').change( function () { 
		$('#cookbook_versions').empty();
		$('#cookbook_info').val('');
		
		var selected_cookbook = $(this).val();	
		cookbook_info = cookbooks[selected_cookbook]['versions'];
		// console.log(JSON.stringify(versions));
	    
	    $.ajax({
	    	url: "/cookbooks/"+selected_cookbook,
	    	success: function(data,status) {
	    		var versions = [];
	    		version_data = data[selected_cookbook]['versions'];
	    		console.log(JSON.stringify(version_data));
	    
	    		 //Get all versions from cookbook json data
			    $.each(version_data, function(key,value) { versions.push(value['version']); });
				
				//Add those to cookbook_version download
				$.each(versions, function(index, val) { 
					$('#cookbook_versions')
						         .append($("<option></option>")
						         .attr("value",val)
						         .text(val)); 						         
				});
				
				$('#cookbook_versions').show();
	   
				fill_cookbook_info();
				
	    	}	    	
	    }); 
	    
		
	    versions = [];
	    
	    //Get all versions from cookbook json data
	    $.each(cookbook_info, function(key,value) { versions.push(value['version']); });
		
		//Add those to cookbook_version download
		$.each(versions, function(index, val) { 
			$('#cookbook_versions')
				         .append($("<option></option>")
				         .attr("value",val)
				         .text(val)); 
				         
		})
		
		selected_version = $('#cookbook_versions').val();
		$.ajax ({
			url: "/cookbooks/"+selected_cookbook+"/"+selected_version,
			success: function(data,status) {
				$('#cookbook_info').val(JSON.stringify(data,undefined,2));
			}
		});
		
		$('#cookbook_versions').show();
	});
	
	
	
	
	
	$('#environments').change( function () {
		$("#environment_info").val('');
		var selected_env = $(this).val();		
		if (selected_env == null) return;
		
		console.log("the value you selected: " + selected_env);		
		data = {"name":selected_env.join()}
		$.ajax({
		  url:"/environment",
		  type:"POST",
		  data:JSON.stringify(data),
		  contentType:"application/json; charset=utf-8",
		  dataType:"json",
		  success: function(data,status){
		    // console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
		    
		    
		    if ( data['error'] ) {
		    	$("#environment_info").val(data['error']);
		    } else {
			    $("#environment_info").val( JSON.stringify(data['environments'], undefined, 2));
			    
			    var container_nodes = data['nodes'];
			    console.log(container_nodes);
			    
			    var all_nodes = [];
			    $("#node_container option").each(function() { all_nodes.push($(this).val()) });
			    $("#other_node_container option").each(function() { all_nodes.push($(this).val()) });
			    
			    
			    var other_nodes = new Array();
				other_nodes = jQuery.grep(all_nodes,function (item) {
				    return jQuery.inArray(item, container_nodes) < 0;
				});

			    console.log(other_nodes);
			    
			    $('#node_container').empty();
			    $('#other_node_container').empty();
			    
			    $.each(container_nodes, function(key,value) {   
				     $('#node_container')
				         .append($("<option></option>")
				         .attr("value",value)
				         .text(value)); 
				});
				$.each(other_nodes, function(key,value) {   
				     $('#other_node_container')
				         .append($("<option></option>")
				         .attr("value",value)
				         .text(value)); 
				});

			   
			    
		    }
		    
		
		    
		  }
		});
	});
	
	$('#node_container').change(function() {
        
        $("#node_info").val('');
        var selectedValue = $(this).val();
		if (selectedValue == null) return;
		console.log("the value you selected: " + selectedValue);
		
		data = {"name":selectedValue.join()}
		$.ajax({
		  url:"/node",
		  type:"POST",
		  data:JSON.stringify(data),
		  contentType:"application/json; charset=utf-8",
		  dataType:"json",
		  success: function(data,status){		    
			console.log( Object.keys(data) ) ;		    
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