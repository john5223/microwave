%rebase layout title="Dashboard"	

	<style>
		select {height: 500px }		  
	</style>

	<div class="l">
		<h2> Environments </h2> 
		<select id="environments" multiple="multiple">	
			<option selected=true> ALL </option> 
			%for env in environments:
				<option> {{env}} </option>
			%end		
		</select>	
	</div>


	<div class="l">
		<h2> Nodes </h2> 
		<select id="nodes" multiple="multiple">	
			%for node in nodes:
				<option> {{node}} </option>
			%end		
		</select>	
	</div>
