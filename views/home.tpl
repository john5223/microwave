%rebase layout title="Home"

	<h1> Home </h1>

	<h3> Default Chef Server </h3>
	<p> <a href="/dashboard"> ~/.chef </a> </p>
	

	<h3> Other remote Chef Servers </h3>
	%for chef in remote_chefs:		
		<a href="/dashboard/{{chef}}"> {{chef}} </a>
		<br />
	%end