(function () {
	
  var hubspot;
	
  hubspot = window.hubspot = {};

	hubspot.initListeners = function(){
    $('#properties_form').submit(function(e){
      e.preventDefault();

      defaultProperties = [];
      [].slice.call(e.target).forEach(function(d){
        if($(d).attr('checked')){
          defaultProperties.push({
            name : d.name,
            default_selection : true
          });
        }
      })
      upsertDefaultProperties(defaultProperties);
    });
  }

  hubspot.getProperties = function(){
		$.get('api/hubspot/properties', function(res){
      insertProperties(res);
		});
	}

  insertProperties = function(res){

    var html;

    // build containers for property groups
    res.property_group.forEach(function(d){
      html = '';
      html += `<div id=${d} class="property_group"><h5>${d.split('information')[0]}</h5></div>`;
      $('#all_properties').append(html);
    });
    

    // insert rows into property groups
   res.properties.forEach(function(d){
      html = '';
      html += `<div class="property_div" style="display: none;" data-default-selection="false">`;
      html += `<input type="checkbox" name=${d.name}>`;
      html +=`<label>${d.label}</label>`;
      html += `</div>`;
      $('#'+d.groupName).append(html);
    });   
    
    showHidePropertyGroups();

  }

  upsertDefaultProperties = function(data){

    console.log(data);
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