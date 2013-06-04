%rebase layout title="Microwave Dashboard"

	<link rel="stylesheet" href="/static/css/dashboard.css" type="text/css" />
	
	<div style="position:absolute; top:50%; left: 50% ">
		<img id="loader" src="/static/images/chef-loader.gif" style="display:none" />
	</div>
	
	<div id="microwave_plugins"></div>
	<br />

	
	<button id="nuke"> NUKE ENVIRONMENT </button>
	<div class="l">
		
		<div style="width:250px">
			<h2 style="display:inline">Environments</h2>
			<span id="add_environment" class="ui-icon ui-icon-circle-plus" style="float:right"></span>
			<span id="delete_environment" class="ui-icon ui-icon-circle-minus" style="float:right"></span>			
			
		</div>
		
			 
		<select id="environments" multiple="multiple" cl``ass="container">	
			<option selected=true> ALL </option> 
			%for env in environments:
		`		<option> {{env}} </option>
			%end		
		</select>	
		
		<br /><br />
		
		<div style="width:250px">
			<h2 style="display:inline">Roles</h2>
			<span id="add_role" class="ui-icon ui-icon-circle-plus" style="float:right"></span>
			<span id="delete_role" class="ui-icon ui-icon-circle-minus" style="float:right"></span>						
		</div>
		
		<select id="roles" multiple="multiple" class="container" >
			%for role in roles:
				<option>{{role}}</option>
			%end
		</select> 
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
		<select id="node_container" multiple="multiple" class="container">	
			%for env in nodes['nodes']:
				<optgroup label="{{env}}">
				%for node in nodes['nodes'][env]:
					<option> {{node}} </option>
				%end
				</optgroup>
			%end		
		</select>	
		
		<br /><br />
		
		
		
		<br /><br />
		
		<h2> Other Nodes 
			<span id="move_node" class="ui-icon ui-icon-circle-arrow-n" style="margin-left:80px"></span> 
		</h2> 
		
		<select id="other_node_container" multiple="multiple" class="container">			
		</select>
		
	
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
		<div id="cookbook_description"></div>
		
		<textarea id="cookbook_info" readonly></textarea>
	</div>	
		

<script type="text/JavaScript" src="/static/js/dashboard_old.js"></script> 
<script type="text/JavaScript" src="/static/js/razor_old.js"></script> 