%rebase layout title="Dashboard"	

	<style>
		.container {height: 220px; width: 250px; margin-bottom:5px}		
		#environments { width: 250px; } 
		
		.ui-icon { display:inline-block;line-height: 28px; }
		
		#node_info { height: 300px; width: 350px; overflow: auto; } 
		#environment_info { width: 350px; height: 120px }
		#cookbook_info {width:800px; height: 300px } 
	</style>

	<div style="height:35px;width:35px;position:absolute; top:10px; left: 600px ">
		<img id="loader" src="/static/images/chef-loader.gif" style="display:none" />
	</div>
	
	
	<div class="l">
		
		<div>
			<h2> Environments
			<span id="delete_environment" class="ui-icon ui-icon-circle-minus" style="margin-left:80px;"></span>			
			<span id="add_environment" class="ui-icon ui-icon-circle-plus"></span>	
			 </h2>
					
		</div>
			 
		<select id="environments" multiple="multiple" class="container">	
			<option selected=true> ALL </option> 
			%for env in environments:
				<option> {{env}} </option>
			%end		
		</select>	
		
		<br /><br />
		
		<h2>Roles</h2>
		<select id="roles" multiple="multiple" class="container" >
			%for role in roles:
				<option>{{role}}</option>
			%end
		</select>
		
		
		
		<br /><br />
		
		
		
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
	
	<br/><br />
	<div style="clear:both;width:1000px">
		<h2> (<label id="numCookbooks">{{len(cookbooks)}}</label>) Cookbooks</h2> 
		<select id="cookbooks">	 
			<option> -- </option>
			%for cookbook in cookbooks:
				<option> {{cookbook}} </option>
			%end		
		</select>	
		<select id="cookbook_versions" style="display:none">
		</select>
		<br /><br />
		<label id="cookbook_description"></label>
		
		<textarea id="cookbook_info" readonly></textarea>
	</div>	
		
		
	
	

<script>

$( document ).ready(function() {	
   
   	
   $('#delete_environment').button().click( function () {
   	 	var label = $("<label>").text('Name:');
		var input = $('<input type="text">').attr({id: 'name', name: 'name'});
		input.appendTo(label);
		$('<div />').html(label).dialog({
				modal:true,
   	 			title:"Delete Environment",
   	 			buttons: {
   	 				"Delete": function () {
   	 					$(this).dialog("close");
   	 					alert("Will delete it later..." + input.val() );   	 					
   	 				},
   	 				Cancel: function () {$(this).dialog("close");},
   	 			},
   	 			close: function () {}
   	 	});	    	  
   });
   
   $('#add_environment').button().click( function () {
   	 	var label = $("<label>").text('Name:');
		var input = $('<input type="text">').attr({id: 'name', name: 'name'});
		input.appendTo(label);
		$('<div />').html(label).dialog({
				modal:true,
   	 			title:"Add Environment",
   	 			buttons: {
   	 				"Add": function () {
   	 					$(this).dialog("close");
   	 					alert("Will add it later..." + input.val() );   	 					
   	 				},
   	 				Cancel: function () {$(this).dialog("close");},
   	 			},
   	 			close: function () {}
   	 	});	    	  
   });
   
   
     
   
      
      
}); 

</script>


















	
<script>
	
$( document ).ready(function() {
	
	

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
	    $.ajax({
	    	url: "/cookbooks/"+selected_cookbook,
	    	success: function(data,status) {
	    		var versions = [];
	    		version_data = data[selected_cookbook]['versions'];
	    		console.log(JSON.stringify(version_data));
	    
	    		 //Get all versions from cookbook json data
			    $.each(version_data, function(key,value) { versions.push(value['version']); });
				console.log(versions);
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
		$("#loader").show();
		
		$("#environment_info").val('');
		$('#node_container').empty();
		$('#other_node_container').empty();
		
		
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
		    	
			    $('#node_container').empty();
			    $('#other_node_container').empty();
			    $("#environment_info").val( JSON.stringify(data['environments'], undefined, 2));
			    
			    
			    
			    var container_nodes = data['nodes'];
			    $.each(container_nodes, function(env,nodes) {
			    	var optgroup = $('<optgroup>');
			    	optgroup.attr('label', env);
			    	$.each(nodes, function(index, node) {
			    		var option = $("<option></option>");
			    		option.val(node);
			    		option.text(node);			    		
			    		optgroup.append(option);
			    	});			    		
			    	$('#node_container').append(optgroup);
			    });
			    $('#node_container').select('refresh');
			    
			    
			    var other_nodes = data['other_nodes'];
			    if (other_nodes['_default']) { 
			    	var optgroup = $('<optgroup>');
			    	optgroup.attr('label', "_default");
			    	$.each(other_nodes['_default'], function(index, node) {
			    		var option = $("<option></option>");
			    		option.val(node);
			    		option.text(node);			    		
			    		optgroup.append(option);
			    	});			    		
			    	$('#other_node_container').append(optgroup);
			    	delete other_nodes['_default'];
			    }
			    $.each(other_nodes, function(env,nodes) {
			    	var optgroup = $('<optgroup>');
			    	optgroup.attr('label', env);
			    	$.each(nodes, function(index, node) {
			    		var option = $("<option></option>");
			    		option.val(node);
			    		option.text(node);			    		
			    		optgroup.append(option);
			    	});			    		
			    	$('#other_node_container').append(optgroup);
			    });
			    
			    
			    $('#other_node_container').select('refresh');
			    $("#loader").hide();			    
		    }		       
		  }
		});
		
		
		
	});
	
	
	function display_node_info() { 
		$("#node_info").val('');
        var selected_nodes = $('#node_container').val().concat($('#other_node_container').val());               
        selected_nodes = selected_nodes.filter(function(n){return n}); //get rid of nulls
        if (selected_nodes == null) return;
		
		data = {"name":selected_nodes.join()}
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
	}
	
	$('#node_container').change( function() { display_node_info(); } );
	
	
	
	
	
	
 
});

</script>