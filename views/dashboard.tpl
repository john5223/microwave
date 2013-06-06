%rebase layout title="Microwave Dashboard"
	<link rel="stylesheet" href="/static/css/dashboard.css" type="text/css" />
	
	<div style="position:absolute; top:50%; left: 50% ">
		<img id="loader" src="/static/images/chef-loader.gif" style="display:none" />
	</div>
	
	<h2> Chef Server:  <label id="chef_server">{{chef_server if defined('chef_server') else ''}}</label> </h2>
	
	<br />
	<div id="errors"> {{error if defined('error') else ''}}	</div>
	<br />
	<div id="microwave_plugins"></div>
	<br />
	
	<div class="l" style="width: 350px;">
		
		<!--         Environments                 -->
		<div style="width:250px">
			<h2 style="display:inline">Environments</h2>
			<span id="add_environment" class="ui-icon ui-icon-circle-plus" style="float:right"></span>
			<span id="delete_environment" class="ui-icon ui-icon-circle-minus" style="float:right"></span>			
		</div>		
		<select id="environments" multiple="multiple" cl``ass="container"></select>	
		<br /><br /><br />
	
		<!--         Roles                 -->
		<div style="width:250px">
			<h2 style="display:inline">Roles</h2>
			<span id="add_role" class="ui-icon ui-icon-circle-plus" style="float:right"></span>
			<span id="delete_role" class="ui-icon ui-icon-circle-minus" style="float:right"></span>						
		</div>
		<select id="roles" multiple="multiple" class="container" ></select> 
		<br /><br />
		<div id="role_attributes">		
			<h3>Role Attributes</h3>
			<button id="role_json_link" class="" style="">Full response</button>			
			<textarea id="role_json" readonly></textarea>		
		</div>
		<br />		
		<div id="role_description">Click a role above to see the description.</div>
		<br /><br />
	</div>

	<div class="l">
		<h2> Container Nodes </h2> 
		<select id="node_container" multiple="multiple" class="container"></select>	
		<br /><br />
		
		<h2> Other Nodes 
			<span id="move_node" class="ui-icon ui-icon-circle-arrow-n" style="margin-left:80px"></span> 
		</h2> 
		<select id="other_node_container" multiple="multiple" class="container"></select>
	
	</div>
	<div class="l">
		<h2> Info </h2> 
		
		<div id="environment_attributes">
			<h3> Environment Attributes </h3>
			<button id="environment_json_link">Full response</button>
			<textarea id="environment_json"> </textarea> 			
		</div>
		<div id="environment_description">Click an environment to see more information.</div>		
		<br />
		
		<div id="node_attributes">
			<h3> Node Attributes </h3>
			<button id="node_json_link">Full response</button>
			<textarea id="node_json" readonly></textarea> 			
		</div>		
		<div id="node_description">Click a node to see more information.</div>
		<br />
	</div>
	
	<div style="clear:both;width:1000px">

		<div id="environment_attributes">
			<h2> Cookbooks </h2>
			<button id="cookbook_json_link">Full response</button>
			<textarea id="cookbook_json" readonly> </textarea> 			
		</div>
		
		<br />
		<select id="cookbooks">	 
			<option> -- </option>
		</select>	
		<select id="cookbook_versions" style="display:none"></select>
		

		<br /><br />
		<div id="cookbook_description"></div>
		
	</div>	
		
<script type="text/JavaScript" src="/static/js/dashboard.js"></script> 
<script type="text/JavaScript" src="/static/js/razor.js"></script> 

%if not defined('error'):
	<script>
		$( document ).ready(function() {
			refresh_dashboard();
		});
	</script>
%end