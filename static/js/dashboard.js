$( document ).ready(function() {

	$('#environment_json_link').click(function () { show_environment_json(); });
	$('#environments').change( function () { refresh_environment_and_node_data(); });

	$('#delete_environment').button().click( function () { delete_environment(); });   
    $('#add_environment').button().click( function () {	add_environment(); });   

    $('#node_container').change( function() { display_node_info(); } );
    $('#node_json_link').click(function () { 
    	$('#node_json').dialog({title: "Node Attributes", width:'550', height:'550' }); 
    });


    $('#roles').change(function () { refresh_role_data(); });
	$('#role_json_link').click(function () { 
		$('#role_json').dialog({title: "Role Attributes", width:'550', height:'550' });
	});


	$('#cookbook_json_link').click(function () { 
		$('#cookbook_json').dialog({title: "Cookbook", width:'550', height:'550' });
	});
	$('#cookbook_versions').change( function () { fill_cookbook_json(); } ) ;
	$('#cookbooks').change( function () { 
		$('#cookbook_versions').empty();
		$('#cookbook_json').val('');		
		var selected_cookbook = $('#cookbooks').val();				    
	    $.ajax({
	    	async: 'false',
	    	url: "/cookbooks/" + $('#chef_server').text() +"/" + selected_cookbook,
	    	success: function(data,status) {
	    		console.log(data);
	    		var versions = [];

	    		version_data = data[selected_cookbook]['versions'];	    
	    		 //Get all versions from cookbook json data
			    $.each(version_data, function(key,value) { 
			    	console.log(key + " " + value); 
			    	versions.push(value['version']); 
			    });
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

	
});


function refresh_dashboard() {	
	refresh_environments_list();
	refresh_roles_list();
	refresh_cookbooks_list();
	//refresh_environment_and_node_data();
}



//######################
//    Environment
//######################


function refresh_environments_list() {
	$.ajax({
		url: '/environments/' + $('#chef_server').text(),
		type: 'GET',
		success: function(data,status) {
			if (data['error']) {
				console.log(data['error']);
				$('#errors').empty().text(data['error']);
				return;
			}

			$('#environments').empty();
			// Add environments to list
			$('<option>').html("ALL").appendTo($('#environments'));		
			$('#environments').val('ALL').change();
			$.each(data['environments'], function(index,val) {
				//Append environment name to environment list
				$('<option>').html(val).appendTo($('#environments'));					
			});

		},
		error: function(data,status) {
			$('#errors').append("Error getting environment data <br />");
		}
	});
}


function refresh_environment_and_node_data() {
	$('#loader').show();
	$('#node_container').empty();
	$('#other_node_container').empty();
	

	var selected_env = $('#environments').val();		
	if (selected_env == null) return;
	data = {"names":selected_env.join()};
	$.ajax({
		url: '/environments/' + $('#chef_server').text(),
		type: 'POST',
		data: JSON.stringify(data),
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data,status){
			//console.log(JSON.stringify(data));
			if (data['error']) {
				$('#errors').empty().text(data['error']);
			} else {
				//console.log(JSON.stringify(data['environments']));
				
				// Add container_nodes
				$.each(data['nodes'], function (env, nodes) {
					var optgroup = $('<optgroup>');
					optgroup.attr('label', env);
					$.each(nodes, function (index, node) {
						$('<option>').html(node).appendTo(optgroup);
					});
					optgroup.appendTo($('#node_container'));
				});
				//Add other_nodes 
				$.each(data['other_nodes'], function (env, nodes) {
					var optgroup = $('<optgroup>');
					optgroup.attr('label', env);
					$.each(nodes, function (index, node) {
						$('<option>').html(node).appendTo(optgroup);
					});
					optgroup.appendTo($('#other_node_container'));
				});
			
				// Throw all environment data into environment_json
				$('#environment_json').val(JSON.stringify(data['environments'], undefined, 2));
				$('#environment_json_link').show();

				//Display environment data
				environment_data = data['environments']
				$.each(environment_data, function(key,val) {
			    	$('<label>').html("<b>Name: </b>"+key).appendTo($('#environment_description'));			    				    	
			    	attrib_to_look_for = ['package_component','keystone', 'vips']			    	
			    	$.each(attrib_to_look_for, function(index,attrib_key) {
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
				$('#loader').hide();
			}
			
		}

	});
}

function show_environment_json() {
	var old_env_data = $('#environment_json').val()
	$('#environment_json').css({ "min-height": '530px', "min-width": '700px'});
	$('#environment_json').dialog({
		title: "Environment Attributes", width: '730', height:'550',
		buttons: {
			"Save": function() {
				$(this).dialog("close");
				alert("coming soon...");			
			},
			"Cancel": function() {
				//Restore the old environment data
				$('#environment_json').val(old_env_data);
				$(this).dialog("close");
			}
		}

	});
}


function delete_environment() {
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
					url: "/environment/" + $('#chef_server').text() + "/" + "delete",
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
		}
	});	    	  
}



function add_environment() {
	var label = $("<label>").text('Name:');
	var input = $('<input type="text">').attr({id: 'name', name: 'name'});
	input.appendTo(label);
	$('<div />').html(label).dialog({
		modal:true, title:"Add Environment",
		buttons: {
			"Add": function () {
				$(this).dialog("close");
				$.ajax({
					url: "/environment/" + $('#chef_server').text() + "/" + "add",
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
		}
	});	    	  
 
}







// ##########################
//   Nodes
// ##########################

function display_node_info() { 
	$('#loader').show();
	$("#node_json").val('');
	$('#node_description').empty();
	
    var selected_nodes = $('#node_container').val().concat($('#other_node_container').val());               
    selected_nodes = selected_nodes.filter(function(n){return n}); //get rid of nulls
    if (selected_nodes == null) return;
	
	data = {"names":selected_nodes.join()}
	$.ajax({
	  url:"/nodes/" + $('#chef_server').text(),
	  type:"POST",
	  data:JSON.stringify(data),
	  contentType: "application/json; charset=utf-8",
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
		    	attrib_to_look_for = ['in_use', 'ipaddress', 'platform', 'roles', 'recipes', 'razor_metadata']
		    	
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








// ##########################
//   Roles
// ##########################
function refresh_roles_list() {
	$.ajax({
		url: '/roles/' + $('#chef_server').text(),
		type: 'GET',
		success: function(data,status) {
			if (data['error']) {
				console.log(data['error']);
				$('#errors').empty().text(data['error']);
				return;
			}
			$('#roles').empty();
			// Add environments to list
			$('<option>').html("ALL").appendTo($('#roles'));		
			$('#roles').val('ALL').change();
			$.each(data['roles'], function(index,val) {
				//Append environment name to environment list
				$('<option>').html(val).appendTo($('#roles'));					
			});
		},
		error: function(data,status) {
			$('#errors').append("Error getting role data <br />");
		}
	});
}


function refresh_role_data() { 
	$('#role_json').val('');
	$('#role_description').empty();
	
	selected_roles = $('#roles').val();
	if (selected_roles == null) { return; }		
	roles_request = {"names":selected_roles.join()}
	
	$.ajax({ 
	    url:"/roles/" + $('#chef_server').text(),
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

}




// ##########################
//   Cookbooks
// ##########################

function refresh_cookbooks_list() {
	$.ajax({
		url: '/cookbooks/' + $('#chef_server').text(),
		type: 'GET',
		success: function(data,status) {
			if (data['error']) {
				console.log(data['error']);
				$('#errors').empty().text(data['error']);
				return;
			}
			console.log(data['cookbooks']);
			$('#cookbooks').empty();
			$('<option>').html("-").appendTo($('#cookbooks'));			
			// Add environments to list
			$.each(data['cookbooks'], function(key,val) {
				//Append cookbook name to cookbook list
				$('<option>').html(key).appendTo($('#cookbooks'));					
			});
		},
		error: function(data,status) {
			$('#errors').append("  Error getting cookbook data <br />");
		}
	});
}



function fill_cookbook_info() {
	$('#cookbook_json').val('');	
	selected_version = $('#cookbook_versions').val();
	selected_cookbook = $('#cookbooks').val();
	console.log(selected_version);
	if (selected_version != null) {
		$.ajax ({
			url: "/cookbooks/"+$('#chef_server').text()+"/"+selected_cookbook+"/"+selected_version,
			success: function(cookbook_json,status) {
				$('#cookbook_json').val(JSON.stringify(cookbook_json,undefined,2));
				$('#cookbook_description').empty();
				$.each(cookbook_json, function (key,val) {
					$('<label>').html('<b>Name:</b> '+key).appendTo($('#cookbook_description'));
					$('<label>').html('<b>Description:</b> '+cookbook_json[key]['metadata']['description']).appendTo($('#cookbook_description'));
					
					var attributes = cookbook_json[key]['metadata']['attributes'];
					$('<pre>').css({maxHeight: '180px', overflow: 'auto', margin: '0 0 20px 0'})
							.html('<b>Attributes:</b>').append(JSON.stringify(attributes, undefined, 2))
							.appendTo($('#cookbook_description'));												
				
					$('<pre>').css({maxHeight: '350px', overflow: 'auto'})
							.html('<b>Long Description:</b><br /> '+cookbook_json[key]['metadata']['long_description']
								).appendTo($('#cookbook_description'));
					
				
				});
				
				
			}
		});
	}
}
	
	