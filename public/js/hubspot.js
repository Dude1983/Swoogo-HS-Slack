(function () {
	
  var hubspot;
	
  hubspot = window.hubspot = {};

	hubspot.initListeners = function(){
    
    // form submission
    $('#properties_form').submit(function(e){
      e.preventDefault();
      getDefaultChanges();
    });

  }

  hubspot.getProperties = function(){
		$.get('api/hubspot/properties', function(res){
      insertProperties(res);
		});
	}

  insertProperties = function(res){

    var html, properties;

    properties = res.properties;

    // build containers for property groups
    res.property_group.sort().forEach(function(d){
      html = '';
      html += `<div id=${d} class="property_group"><h5>${d.split('information')[0]}</h5></div>`;
      $('#all_properties').append(html);
    });

    // insert rows into property groups
   for ( d in properties ) {

      html = '';
      html += `<div class="property_div" style="display: none;">`;
      html += `<input type="checkbox" name=${properties[d].name}>`;
      html +=`<label>${properties[d].label}</label>`;
      html += `</div>`;
      if( properties[d].default_selection === true || properties[d].default_selection === 'true' ){
        $('#default_properties').append(html);
      }
      $('#'+properties[d].groupName).append(html);
    };   
    
    showHidePropertyGroups();

  }

  getDefaultChanges = function(){
    defaultProperties = [];

      $('#all_properties input').each(function(i,d){
        if($(d).attr('checked')){
          defaultProperties.push({
            name : d.name,
            default_selection : true
          });
        }
      })
      $('#default_properties input').each(function(i, d){
        if(!($(d).attr('checked'))){
          defaultProperties.push({
            name : d.name,
            default_selection : false
          });
        }
      });

      upsertDefaultProperties(defaultProperties);
  }

  upsertDefaultProperties = function(data){

    // init spinner
    $('.button-wrapper').append('<i class="fa fa-spinner fa-pulse fa-2x fa-fw margin-bottom"></i>');
    
    $.post('api/hubspot/properties/default', { default_properties : data }, function(err, res, d){
      if (err) throw err;

      if(d.statusText === 'OK'){

        // remove spinner 
        $('.fa-spinner').remove();

        // success -> check
        $('.button-wrapper').append('<i class="fa fa-check fa-2x" aria-hidden="true"></i>');
      }
    });
  }

  showHidePropertyGroups =  function(){

    // show and select all default properties
    $('#default_properties div').each(function(i, d){
      $(d).show();
      $(d).children('input').attr('checked' , true);
    });

    //
    $('#default_properties input').click(function(d){
      $(this).removeAttr('checked');
    });

    // click listener for expanding property groups
    $('#all_properties h5').click(function(e){
      $(e.target).parent().children().each(function(i, d){
        if(d.tagName !== 'H5'){
          if($(d).attr('style') === "display: none;"){
            $(d).show();
          } else {
            $(d).hide();
          }
        }
      });
    });
   }
})();