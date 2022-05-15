(function(){
var MAX_FILESIZE = 1572864 // 1.5MiB in bytes, because idk it seemed like a good value

// Form input validation
// Validation also occurs on the server side, since it is EASY to spoof HTTP requests
// totally independently of this script! ALWAYS BE VIGILANT!
var validateInput = function () {
  var mandelFields = document.getElementById('mandelForm').elements;
  var xmin       = mandelFields['xmin'].value;
  var xmax       = mandelFields['xmax'].value;
  var ymin       = mandelFields['ymin'].value;
  var ymax       = mandelFields['ymax'].value;
  var height     = mandelFields['height'].value;
  var steps      = mandelFields['steps'].value;
  var startColor = mandelFields['startColor'].value;
  var endColor   = mandelFields['endColor'].value;
  var bgColor    = mandelFields['bgColor'].value;
  var bgImg = null;
  if (mandelFields['bgImg'].files.length > 0) {
      // A file has to be specified before we can get the file :P
      bgImg      = mandelFields['bgImg'].files[0];
  }

  // Check dimensions and steps are reasonable to avoid huge processing times
  var width = Math.round(height/Math.abs(ymax - ymin)*Math.abs(xmax - xmin));
  if (height > 1200 || width > 1800 || steps > 100) {
    return false;
  }
  
  // Verify that color inputs are valid hex triplets (e.g. #AEEE00)
  var hexRegex = /^#[a-fA-F0-9]{6}$/
  if (!(hexRegex.test(startColor) && hexRegex.test(endColor) && hexRegex.test(bgColor))) {
    // Color inputs are not valid hex values
    return false;
  }

  // Check the size of the background image, if specified
  if (bgImg !== null && (bgImg.size > MAX_FILESIZE || bgImg.type != 'image/png') ) {
    // Image is too large or wrong filetype!
    return false;
  }
  // Validation of the background image will happen server-side.
  return true;
}

// Submit button initialization
var submitInit = function () {
  // Make sure that the output is cleared on new page load, even if the browser
  // has some kind of caching for text fields
  var output = document.getElementById('output');
  output.value = '';

  // The function to be bound to the submit button
  var runScript = function (event) {
    output.value = ''; // Clear debug output

    // Before anything else, do client-side input validation
    if (!validateInput()) {
      // Gripe at the user for messing up! If you felt so inclined you could have the validator
      // function return more information for specific messages, but that's a bit much for this.
      output.value = "Bad form input!  Try again.";
      return;
    }

    var runButton = document.getElementById('submit');
    var buttonDiv = document.getElementsByClassName('ajax-status')[0];
    runButton.style.pointerEvents = 'none'; // Temporarily disable button after click

    // Remove status class and insert load gif. classList.remove() does not throw errors if
    // the class doesn't exist, so we just try removing both.
    buttonDiv.classList.remove('success');
    buttonDiv.classList.remove('failure');
    runButton.innerHTML = '&nbsp;<img src="images/loading.gif" style="position:relative;top:3px;">&nbsp;';

    // Create the request
    var request = new XMLHttpRequest();     
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        // First encode the image data as a base64 string
        var reader = new FileReader();
        reader.readAsDataURL(this.response);
        reader.onloadend = function() {
          response = reader.result;
          // Open a new window--will require popup blocker to be turned off most likely.
          // Still, cool that you can do this--and insert HTML content into it--with JS!
          var win = window.open();
          win.document.open();
          // Write the image data to the new window as a base64-encoded data string!
          win.document.write('<!DOCTYPE html><html lang="en"><body><h2>Your image:</h2>' + 
                             '<img src="' + response + '">' +
                             '<p>Images are not stored permanently, so if you want to keep ' +
                             'this you should save it before you close the window!</p>' +
                             '</body></html>');
          win.document.close();
        }
        buttonDiv.classList.add('success'); // Let the user know the script succeeded
      } else {
        // Failure :(
        // Setting the response type as 'blob' allows us to read the image response on
        // success, but means we need to jump through some hoops to interpret it as text.
        // (Instead one might want to convert the image to a base64 string on the server
        // and return it as text, but this creates network overhead because the encoding
        // is less dense than the original data.)
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

    // For validation we have to get the input values individually due to poor cross-browser
    // support for the methods of the FormData API. But for submitting the input once the
    // values have been checked, we can use the FormData constructor to make a convenient
    // API for all the child inputs of mandelForm using just one line! This makes programatic
    // form submission a lot easier.
    var fd = new FormData(document.getElementById('mandelForm'));

    request.open('POST', 'cgi-bin/wrapper2_advanced.py', true);
    request.responseType = 'blob';
    request.send(fd);
  };

  //Find submit button and bind click event
  document.getElementById('submit').addEventListener('click', runScript, false);
};

// File clear button initialization
var clearInit = function () {
  var fileInput = document.getElementById('mandelForm').elements['bgImg'];
  var clearFileInput = function () {
    fileInput.value = '';
  }
  document.getElementById('file-clear').addEventListener('click', clearFileInput, false);
}

// Again, make sure this setup only occurs once window is loaded, so that all
// the relevant elements like #input, #submit, #output are present
window.addEventListener('load', submitInit, false);
window.addEventListener('load', clearInit, false);
})(); // End IIFE

