(function () {
	
  var hubspot;
	
  hubspot = window.hubspot = {};

	hubspot.getProperties = function(){
		$.get('api/hubspot/properties', function(res){
      insertProperties(res);
		});
	}

  insertProperties = function(res){

    var html = "";

    res.properties.forEach(function(d){
      html += `<div class="property_group">`;
      html += `<input type="checkbox" name=${d.name}>`;
      html +=`<label>${d.label}</label>`;
      html += `</div>`;
    });

    $('#all_properties').html(html);
  }
})();