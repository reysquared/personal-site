(function(){
// Submit button initialization
var submitInit = function () {
  // Make sure that the outputs are cleared on new page load, even if the browser
  // has some kind of caching for text fields
  var outputs = document.getElementsByClassName('output');
  for (var i = 0; i < outputs.length; i++) {
    outputs[i].value = "";
  }

  // The function to be bound to the submit button
  var runScript = function (event) {
    // Grab sibling elements; this allows us to put more than one of the same kind
    // of script interface on a single page, with the Submit button only getting
    // input/setting output values for elements which are direct children of its
    // same containing div element. Currently this site does not actually make use
    // of this functionality.
    // NOTE: when used in an event handler, 'this' is set to event.currentTarget
    var input  = this.parentNode.getElementsByClassName('input')[0];
    var output = this.parentNode.getElementsByClassName('output')[0];
    var scriptSelect = this.parentNode.getElementsByClassName('script-select')[0];

    var script = scriptSelect.value;
    var args   = input.value;
    var queryString = '?script=' + encodeURIComponent(script) + '&args=' + encodeURIComponent(args);

    var request = new XMLHttpRequest();
    request.open('GET', 'cgi-bin/wrapper_generic.py' + queryString, true);
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        output.value = String(this.responseText);
      } else { /* Failure :( Do something? */ }
    };

    request.onerror = function() { /* Do something? */ };

    request.send();
  };

  // Iterate through elements by class, in the event there is more than one script form
  var submitButtons = document.getElementsByClassName('submit');
  for (var i = 0; i < submitButtons.length; i++) {
    submitButtons[i].addEventListener('click', runScript, false);
  }
};
// Again, make sure this setup only occurs once window is loaded, so that all
// the relevant elements like #input, #submit, #output are present
window.addEventListener('load', submitInit, false);
})(); // End IIFE
