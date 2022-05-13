(function(){
// Submit button initialization
var submitInit = function () {
  // Make sure that the output is cleared on new page load, even if the browser
  // has some kind of caching for text fields
  document.getElementById('output').value = "";

  // The function to be bound to the submit button
  var runScript = function (event) {
    // Grabbing input text-field contents
    var func = document.getElementById('func').value;
    var input = document.getElementById('input').value;
    var rot = document.getElementById('rot').value;

    var queryString = '?func=' + encodeURIComponent(func) + '&input=' + encodeURIComponent(input) + '&rot=' + encodeURIComponent(rot);

    var request = new XMLHttpRequest();
    request.open('GET', 'cgi-bin/wrapper1_advanced.py' + queryString, true);
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        output.value = String(this.responseText);
      } else { /* Failure :( Do something? */ }
    };

    request.onerror = function() { /* Do something? */ };

    request.send();
  };

  //Find submit button and bind click event
  document.getElementById('submit').addEventListener('click', runScript, false);
};
// Again, make sure this setup only occurs once window is loaded, so that all
// the relevant elements like #input, #submit, #output are present
window.addEventListener('load', submitInit, false);
})(); // End IIFE
