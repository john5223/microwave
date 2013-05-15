%from bottle import request

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="content-type" content="text/html;charset=utf-8" />
	<link rel="stylesheet" href="/static/css/main.css" type="text/css" />
	<script type="text/javascript" src="/static/js/jquery.js"></script>
	
		<title>{{title or 'Microwave'}}</title>
</head>
<body>
	
	
	<div id="header">
		<div class="wrap">
			<h1 id="logo"><a href="/">Microwave </a> - FOR QE</h1>
			<p><br /></p>
			<ul id="menu">
				
				<li><a class="{{'current' if request.path == "/" else '' }}" 
						href="/">Home</a></li>
				<li><a class="{{'current' if request.path == "/dashboard" else '' }}" 
						href="/dashboard">Dashboard</a></li>
				
				
			</ul>
		</div>
	</div>
	
	
	
	
	<div class="wrap">

		<div id="main" style="width:120%">
			%include
		</div>

		<div id="footer">
		</div>
		
		
	</div>
	
		
</body>
</html>
