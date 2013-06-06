$( document ).ready(function() {


    $('#microwave_plugins').append($('<span>').text("Destroy Nodes").attr({'id':'destroy_nodes'}));
    $('#destroy_nodes').button().click(function () {        
        nodes = $('#node_container').val();
        if (nodes == null) {
            
        } else {
            destroy_data = {'destroy' : nodes}
            $('#loader').show();
            $.ajax({
                url: '/destroy_nodes/' + $('#chef_server').text(),
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(destroy_data),
                success: function(data,status) {
                    if (data['error']) {
                        $('<label>').text("Error: " + data['error']);
                    } else {
                        $('<label>').text("Error: " + JSON.stringify(data));
                        refresh_environment_and_node_data();
                    }
                    $('#loader').hide();
                },
                error: function(data,status) {
                    $('#loader').hide();
                }
            });

            
        }
        
    });


});