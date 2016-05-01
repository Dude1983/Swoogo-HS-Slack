(function() {
	
  var slack, path;

  slack = window.slack;

  path = location.pathname;

	
  // Index JS
  if(path === '/'){
    
    // inserts slack channels into UI
    slack.getChannels();

    // initiates all on page event listeners related to slack.js
    slack.initListeners();
  }
	
})();