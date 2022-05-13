(function(){
// Form input validation
// Validation also occurs on the server side, since it is EASY to spoof HTTP requests
// totally independently of this script! ALWAYS BE VIGILANT!
var validateInput = function(xmin, xmax, ymin, ymax, height, steps) {
  if (height > 1200 || steps > 100) {
    return false;
  }
  var width = Math.round(height/Math.abs(ymax - ymin)*Math.abs(xmax - xmin));
  if (width > 1800) {
    return false;
  }
  return true;
}

// Submit button initialization
var submitInit = function () {
  // Make sure that the output is cleared on new page load, even if the browser
  // has some kind of caching for text fields
  var output = document.getElementById('output');
  output.value = "";

  // The function to be bound to the submit button
  var runScript = function (event) {
    var runButton = document.getElementById('submit');
    var buttonDiv = document.getElementsByClassName('ajax-status')[0];
    runButton.style.pointerEvents = 'none'; // Temporarily disable button after click

    // Remove status class and insert load gif. classList.remove() does not throw errors if
    // the class doesn't exist, so we just try removing both.
    buttonDiv.classList.remove('success');
    buttonDiv.classList.remove('failure');
    runButton.innerHTML = '&nbsp;<img src="loading.gif" style="position:relative;top:3px;">&nbsp;';

    // Create the request
    var request = new XMLHttpRequest();     
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        // Success! Open image in a new window.

        // Encode image data as base64 string
        var reader = new FileReader();
        reader.readAsDataURL(this.response);
        reader.onloadend = function() {
          response = reader.result;
          // Open a new window--will require popup blocker to be turned off most likely.
          // Still, cool that you can do this--and insert HTML content into it--with JS!
          var win = window.open();
          win.document.open();
          win.document.write('<!DOCTYPE html><html lang="en"><body><h2>Your image:</h2>' + 
                             '<img src="' + response + '">' +
                             '<p>Images are not stored permanently, so if you want to keep ' +
                             'this you should save it before you close the window!</p>' +
                             '</body></html>');
          win.document.close();
        }
	
        buttonDiv.classList.add('success');
      } else {
        // Failure :(
        var reader = new FileReader();
        reader.onload = function() {
          output.value = reader.result; // Print any failure information
        }
        reader.readAsText(this.response); // This is necessary because the response is a Blob
        buttonDiv.classList.add('failure');
      }
      runButton.style.pointerEvents = 'auto'; // Script has responded, restore click events
      runButton.innerHTML = 'Run'; // Restore button text
    };
    request.onerror = function() {
      // Failure :(
      var reader = new FileReader();
      reader.onload = function() {
        output.value = reader.result; // Print any failure information
      }
      reader.readAsText(this.response);
      buttonDiv.classList.add('failure');
      runButton.style.pointerEvents = 'auto'; // Restore click events
      runButton.innerHTML = 'Run'; // Restore button text
    };

    // Grabbing input values. Children of a form element with the 'name' attribute specified
    // can be accessed by finding their parent element and using their name as the key for
    // the elements dictionary, which is decidedly less gross than giving them all an id
    var mandelFields = document.getElementById('mandelForm').elements;
    var xmin   = mandelFields['xmin'].value;
    var xmax   = mandelFields['xmax'].value;
    var ymin   = mandelFields['ymin'].value;
    var ymax   = mandelFields['ymax'].value;
    var height = mandelFields['height'].value;
    var steps  = mandelFields['steps'].value;
    
    if (!validateInput(xmin, xmax, ymin, ymax, height, steps)) {
      // Gripe at the user for messing up! If you felt so inclined you could have the validator
      // function return more information for specific messages, but that's a bit much for this.
      output.value = "Bad form input!  Try again.";
    }

    var xmin   = encodeURIComponent(xmin);
    var xmax   = encodeURIComponent(xmax);
    var ymin   = encodeURIComponent(ymin);
    var ymax   = encodeURIComponent(ymax);
    var height = encodeURIComponent(height);
    var steps  = encodeURIComponent(steps);

    var parameters = 'xmin=' + xmin + '&xmax=' + xmax + '&ymin=' + ymin + '&ymax=' + ymax +
                     '&height=' + height + '&steps=' + steps;

    request.open('POST', 'cgi-bin/wrapper2.py', true);
    request.responseType = 'blob';
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(parameters);
  };

  //Find submit button and bind click event
  document.getElementById('submit').addEventListener('click', runScript, false);
};
// Again, make sure this setup only occurs once window is loaded, so that all
// the relevant elements like #input, #submit, #output are present
window.addEventListener('load', submitInit, false);
})(); // End IIFE

