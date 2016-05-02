(function  () {
	
  var slack, getChannels, titleCase, setDefaultChannel, getDefaultChannel;

  slack = window.slack = {};

  // initiates onpage event listeners
  slack.initListeners = function(){

    $('#default_channel').click(slack.setDefaultChannel);
    $('#channels').change(function(e){
      $('.fa-check').remove();
    });

  }
  

  // gets Channels cached in DB (not from Slack API)
  slack.getChannels = function(){
  	
  	var html, default_channel;
    
    $.get('api/slack/channels', function(d){
    	
      default_channel = d.default_channel;

    	html = "";

      // select channels from response and builds new HTML string
    	d.channels.forEach(function(d){
        
        if(d.id === default_channel){  // sets the chosen default channel as selected in the UI
          html += `<option value=${d.id} selected>${titleCase(d.name)}</option>`
        } else {
          html += `<option value=${d.id}>${titleCase(d.name)}</option>`
        }
    		
    	});

      // inserts HTML string into DOM
    	$('#channels').html(html);
    })
  }

  

  slack.setDefaultChannel = function(){
    
    // init spinner
    $('#default_channel').after('<i class="fa fa-spinner fa-pulse fa-2x fa-fw margin-bottom"></i>');
    
    $.post('/api/slack/channels/set', {
        default_channel : getDefaultChannel()
    }, function(err, res, d){
      if (err) throw err;

      if(d.statusText === 'OK'){

        // remove spinner 
        $('.fa-spinner').remove();

        // success -> check
        $('#default_channel').after('<i class="fa fa-check fa-2x" aria-hidden="true"></i>');
      }
    })
  }

  getDefaultChannel = function(){
    // return value attr of selected option
    return $('#channels')[0].selectedOptions[0].value;

  }

  titleCase = function(string) { 
    return string.charAt(0).toUpperCase() + string.slice(1); 
  }

})()