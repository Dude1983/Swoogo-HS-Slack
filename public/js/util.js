(function () {
	
  var util;

	util = window.util = {};

	util.initListeners = function(){

    // inserts tooltip for 
    tooltipHTML = '<span id="org_id_tooltip" class="tooltip">LeadNotify uses this information to identify your Organization when sending incoming notifications to Slack. This is not/should not be your HubSpot or your Slack credentials.</span>'
    $('#org_id_h4').after(tooltipHTML);

    
    // form submission
    $('#org_id').submit(function(e){
      e.preventDefault();

      var org = {};
      
      [].slice.call(e.target.children).forEach(function(d){
        if(d.tagName === "INPUT"){
          org[d.name] = d.value;
        }
      })

      updateOrgInfo(org);

    })

	}

  updateOrgInfo = function(org){

    // init spinner
    $('#org_id button').after('<i class="fa fa-spinner fa-pulse fa-2x fa-fw margin-bottom"></i>');

    $.post('/api/message/update', org, function(err, res, d){
      if (err) throw err;

      if(d.statusText === 'OK'){

        // remove spinner 
        $('.fa-spinner').remove();

        // success -> check
        $('#org_id button').after('<i class="fa fa-check fa-2x" aria-hidden="true"></i>');
      }

    })
  }

  util.getOrgInfo = function(){
    $.get('/api/message/meta', function(d){
      $('input[name=username]').val(d);
      $('input[name=password]').val('placeholder').attr('style', 'color :lightgrey;');
    });
    $('input[name=password]').click(function(){
      $(this).val('');
    })
  }

})();