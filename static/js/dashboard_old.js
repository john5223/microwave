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
   	 					$.ajax({
   	 						url: "/environment/delete",
   	 						type: "POST",
   	 						dataType: "json",
   	 						data: JSON.stringify({'name': input.val()}),
   	 						success: function(data,status) {
   	 							var label=$('<label>').text(status);
   	 							label.dialog();
   	 						},
   	 						error: function(data,status) {
   	 							var label=$('<label>').text(status);
   	 							label.dialog();
   	 						}
   	 						
   	 					});
   	 					   	 					
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
   	 					$.ajax({
   	 						url: "/environment/add",
   	 						type: "POST",
   	 						dataType: "json",
   	 						data: JSON.stringify({'name': input.val()}),
   	 						success: function(data,status) {
   	 							var label=$('<label>').text(status);
   	 							label.dialog();
   	 						},
   	 						error: function(data,status) {
   	 							var label=$('<label>').text(status);
   	 							label.dialog();
   	 						}
   	 						
   	 					});
   	 					   	 					
   	 				},
   	 				Cancel: function () {$(this).dialog("close");},
   	 			},
   	 			close: function () {}
   	 	});	    	  
   });   
        
        
   $('#add_role').button().click( function () {
   	 	var div = $('<div />')
   	 	var label = $("<label>").text('Name:');
		var input = $('<input type="text">').attr({id: 'name', name: 'name'});
		input.appendTo(label)
		label.appendTo(div)
		var textarea = $('<textarea>').css({height: '140px', width: '210px',margin: '10px 0'});
		textarea.appendTo(div);
							
		div.dialog({
				modal:true,
   	 			title:"Add Role",
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
   $('#delete_role').button().click( function () {
   	 	var div = $('<div />')
   	 	var label = $("<label>").text('Name:');
		var input = $('<input type="text">').attr({id: 'name', name: 'name'});
		input.appendTo(label)
		label.appendTo(div)
		div.dialog({
				modal:true,
   	 			title:"Delete Role",
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
        
  


  
	$('#nuke').button().click(function () {
		$('#loader').show();
		$.ajax({
			url:"/nuke_environment",
			success: function(data,status){	
		    	//go select env then display success
		    	display_environment();
		    	var div = $('<label>').html(status).appendTo($('<div>'));
				div.dialog();
				$('#loader').hide();		
			},
			error: function(data,status) {
				var div = $('<label>').html("status:" + status).appendTo($('<div>'));
				div.dialog();
				$('#loader').hide();
			}
		});
		
	});
	
	
	$('.move_to_environment').live("click", function () { 
		$('.move_to').dialog('close'); 	
		$('#loader').show();
		
		
		nodes = $('#other_node_container').val();
		env = $(this).text();		
		move = {'nodes': nodes,
				'environment': env }
		$.ajax({
			url:"/move_nodes",
		    type:"POST",
		    data:JSON.stringify(move),
		    dataType:"json",
		    success: function(data,status){	
		    	//go select env then display success
		    	display_environment();
		    	var div = $('<label>').html(status).appendTo($('<div>'));
				div.dialog();
				$('#loader').hide();		
			}			
		});
		
		
	});
	
	
	$('#move_node').button().click(function () { 
		other_nodes = $('#other_node_container').val();
		selected_environments = $('#environments').val();
		
		env_buttons = $('<div />');
		$.each($('#environments').val(), function(key, val) {
			var move_nodes_button = $('<button />').attr("class","move_to_environment")
						   .html(val + "<br />")
						   .css({"text-align":"center"});									 
			move_nodes_button.appendTo(env_buttons);
		});		
		
		var div = $('<label>')
				.html("<b>Move:</b> <br />" + other_nodes.join('<br />') + " <br /><br />\
				<b>to environment:</b> <br /><br />" + env_buttons.html() + "<br /><br />")
				.appendTo($('<div />'))
		
		div.attr("class","move_to");
		div.dialog();
		
		
	
	
	});
	
	
	
	$('#role_json_link').click(function () { 
		$('#role_json').dialog({title: "Role Attributes", width:'330', height:'350' });
	});
	
	$('#node_json_link').click(function () { 
		$('#node_json').dialog({title: "Node Attributes", width:'330', height:'350' });
	});
	
	$('#environment_json_link').click(function () { 

		var old_env_data = $('#environment_json').val()
		$('#environment_json').css({ "min-height": '530px', "min-width": '700px'});
		$('#environment_json').dialog({
			title: "Environment Attributes", width: '730', height:'550',
			buttons: {
				"Save": function() {
					
				},
				"Cancel": function() {
					//Restore the old environment data
					$('#environment_json').val(old_env_data);
					$(this).dialog("close");
				}
			}

		});

	});
	
	
	
	
	$('#roles').change(function () {		
		$('#role_json').val('');
		$('#role_description').empty();
		
		selected_roles = $(this).val();
		if (selected_roles == null) { return; }		
		roles_request = {"name":selected_roles.join()}
		$.ajax({ 
		    url:"/roles",
		    type:"POST",
		    data:JSON.stringify(roles_request),
		    contentType:"application/json; charset=utf-8",
		    dataType:"json",
		    success: function(data,status){		    	
		    	$('#role_json').val(JSON.stringify(data['roles'],undefined,2));
		    	$('#role_json_link').show();
		    	
		    	var roles = data['roles'];
		    	 
		    	$.each(roles, function(key,val) {
		    		var attrib = $('<label></label>').html("<b>Name:</b> " + roles[key]['name']);
			    	attrib.appendTo($('#role_description'));
			    	
			    	var attrib = $('<label></label>').html("<b>Description: </b>" + roles[key]['description']);
			    	attrib.appendTo($('#role_description'));
			    	
			    	var attrib = $('<label></label>').html("<b>Run list: </b>" + roles[key]['run_list'].join(', '));
			    	attrib.appendTo($('#role_description'));
			    	
			    	var attrib = $('<label></label>').html("<b>Default attributes: </b>" + JSON.stringify(roles[key]['default_attributes']));
			    	attrib.appendTo($('#role_description'));
			    	
			    	
			    	$("<hr />").appendTo($('#role_description'));
			    		
		    	});
		    	
		    	
		    	
		    	
		    	
		    	
		    	
		    }		    
		});		
		
	});
	
	
	
	

	function fill_cookbook_info() {
		$('#cookbook_info').val('');
		
		selected_version = $('#cookbook_versions').val();
		selected_cookbook = $('#cookbooks').val();
		console.log(selected_version);
		if (selected_version != null) {
			$.ajax ({
				url: "/cookbooks/"+selected_cookbook+"/"+selected_version,
				success: function(cookbook_info,status) {
					$('#cookbook_info').val(JSON.stringify(cookbook_info,undefined,2));
					$('#cookbook_description').empty();
					$.each(cookbook_info, function (key,val) {
						$('<label>').html('<b>Name:</b> '+key).appendTo($('#cookbook_description'));
						$('<label>').html('<b>Description:</b> '+cookbook_info[key]['metadata']['description']).appendTo($('#cookbook_description'));
						
						var attributes = JSON.stringify(cookbook_info[key]['metadata']['attributes']);
						$('<label>').html('<b>Attributes:</b> '+attributes).appendTo($('#cookbook_description'));												
						
						$('<label>').html('<b>Long Description:</b><br /> '+cookbook_info[key]['metadata']['long_description'].replace(/\n/g, '<br />')).appendTo($('#cookbook_description'));
						
					
					});
					
					
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
	    	async: 'false',
	    	url: "/cookbooks/"+selected_cookbook,
	    	success: function(data,status) {
	    		var versions = [];
	    		version_data = data[selected_cookbook]['versions'];
	    		console.log(JSON.stringify(version_data));
	    
	    		 //Get all versions from cookbook json data
			    $.each(version_data, function(key,value) { 
			    	console.log(key + " " + value); 
			    	versions.push(value['version']); 
			    });
			    
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
	    
	  
		
	});
	
	function display_environment() {
		$("#loader").show();
		
		$("#environment_json").val('');
		$("#environment_description").empty();
		
		$('#node_container').empty();
		$('#other_node_container').empty();
		
		
		var selected_env = $('#environments').val();		
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
		    	$("#environment_json").val(data['error']);
		    } else {
		    	$('#node_container').empty();
			    $('#other_node_container').empty();
			    
			    
			    //*********************
			    // Attribute Info
			    //*********************
			    
			    environment_data = data['environments']
			    
			    $("#environment_json").val( JSON.stringify(environment_data, undefined, 2));				
				$("#environment_json_link").show();
				
				$.each(environment_data, function(key,val) {
			    	$('<label>').html("<b>Name: </b>"+key).appendTo($('#environment_description'));
			    	
			    	
			    	// other_attributes = ['razor_metadata']
			    	attrib_to_look_for = ['package_component','keystone', 'vips']
			    	
			    	$.each(attrib_to_look_for, function(index,val) {
			    		var attrib_key = val;
			    		if (environment_data[key]['override_attributes']) {
			    			var attrib_data = environment_data[key]['override_attributes'][attrib_key];
					    	if(attrib_data != null || attrib_data == '0') {
					    		attrib_data = JSON.stringify(attrib_data,undefined,2).replace(/"/g,'');
					    		$('<label>').css('padding-left','15px')
					    				.html("<b>"+attrib_key+": </b>"+attrib_data)
					    				.appendTo($('#environment_description'));
					    	}				    	
			    		}
				    	
			    	});
			    	
			    	
			    	$('<hr />').appendTo($('#environment_description'));
			    });    


			    
			    
			    // ******************************
			    //   Node containers
			    // *********************************
			    
			    
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
		
		
	
	}
	
	
	$('#environments').change( function () {
		display_environment();		
	});
	
	
	
	$('.change_run_list').live('click',function () { 
		alert("changing!");
	});
	
	
	function display_node_info() { 
		$('#loader').show();
		$("#node_json").val('');
		$('#node_description').empty();
		
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
		  success: function(node_data,status){		    
			//console.log( Object.keys(node_data) ) ;		    
		    
		    if ( data['error'] ) {
		    	$("#node_json").val(node_data['error']);
		    }
		    else {
			    $("#node_json").val( JSON.stringify(node_data, undefined, 2));
			    $("#node_json_link").show();
			    
			    $.each(node_data, function(key,val) {
			    	var env_name = key;
			    	var node_div = $('<div>').attr({id:env_name});

			    	$('<button>').text("Run chef-client").appendTo(node_div);
			    	$('<label>').html("<b>Name: </b>"+env_name).appendTo(node_div);			    	
			    	$('<label>').html("<b>Run list: </b>"+val['run_list'] +  "<button class='change_run_list ui-button' style='margin-left:20px'>change</button>").appendTo(node_div);
			    	
			    	
			    	// other_attributes = ['razor_metadata']
			    	attrib_to_look_for = ['in_use', 'roles', 'recipes', 'ipaddress', 
			    						'platform',  'razor_metadata']
			    	
			    	$.each(attrib_to_look_for, function(index,val) {
			    		var attrib_key = val;
				    	var attrib_data = node_data[key]['attributes'][attrib_key];
				    	if(attrib_data != null || attrib_data == '0') {
				    		attrib_data = JSON.stringify(attrib_data,undefined,2).replace(/"/g,'');
				    		$('<label>').css('padding-left','15px')
				    				.html("<b>"+attrib_key+": </b>"+attrib_data)
				    				.appendTo(node_div);
				    	}
			    	
			    	});
			    	
			    	$('<br />').appendTo(node_div);
			    	$('<hr />').appendTo(node_div);
			    	node_div.appendTo($('#node_description'));

			    });
			}
		    $('#loader').hide();		  			  
		  }
		});	
		
	}
	
	$('#node_container').change( function() { display_node_info(); } );
	
 
});
