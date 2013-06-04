$( document ).ready(function() {

	razor_am_button = $('<span>').button().text(' Razor active_models ');
	razor_am_button.appendTo($('#microwave_plugins'));
	razor_am_button.click(function() { show_active_models(); } );

	

});


function show_active_models() {
	am_dialog = $('<p>').text("Retrieving active models...Please wait with this window open");
	am_dialog.dialog({height:'800', width: '1200'});
	$.ajax({
		url: '/razor/active_models',
		type: 'GET',
		success: function(data,status) {
			am_dialog.text(JSON.stringify(data));
		},
		error: function(data,status) {
			am.dialog.text("Error getting razor information");
		}
	});
}

