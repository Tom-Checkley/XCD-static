(function () {

    // Get the search field by ID
    var eID = document.getElementById("s1");
    console.log("eID: " + eID);

    // Declare the event object and set it to null
    var eventObj = null;

    // Add the event listeners I want to track
    eID.addEventListener("focus", checkSearch, false);
    eID.addEventListener("blur", checkSearch, false);
    eID.addEventListener("keydown", checkSearch, false);

    function checkSearch(eventObj) {
        try {
            // Get the event type from the object
            eventType = eventObj.type
            // Map the tab key to a variable
            var TABKEY = 9;
            // Get the search input text value
            eIDval = eID.value;
            // Get the parent element
            eIDparent = eID.parentElement;
            // Set a class since we are on it
            eIDparent.className = "notempty";
            // Get the button
            eIDbutton = eIDparent.getElementsByTagName('button')[0];
            // Set the button tabindex
            eIDbutton.setAttribute('tabindex', '0');
            // If the text value is not blank
            if (eIDval != '') {
                // Give it a class that will stay
                eIDparent.className = "notempty";
            }
            // If the text value is blank
            else {
                // Check if focus has left the input first
                if (eventType == 'blur') {
                    // Set tabindex on button to remove from flow
                    eIDbutton.setAttribute('tabindex', '-1');
                    // Remove the class
                    eIDparent.className = "";
                }
                // Check if user hit a key
                if (eventType == 'keydown') {
                    // See if the user hit the tab key
                    if (eventObj.keyCode == TABKEY) {
                        // Set tabindex on button to remove from flow
                        eIDbutton.setAttribute('tabindex', '-1');
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

})();