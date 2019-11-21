(function () {

    // Returns the current value of an element within a CSS media query (MQ)
    // even if the MQ is set in ems (variable per users zoom setting)
    // so we don't have an overlap/gap if we specify pixels.
    angular.module("screenSizer", [])
           .factory("screenSizerConfig", [function () {

               var sizes = {
                   mq_page: {
                       name: 'mq_page',
                       xsdefault: 0,
                       smallest: 1,
                       small: 2,
                       medium: 3,
                       large: 4,
                       larger: 5,
                       largest: 6
                   },
                   mq_menu: {
                       name: 'mq_menu',
                       xsdefault: 0,
                       menusmall: 1,
                       menumedium: 2,
                       menularge: 3,
                       menuxlarge: 4
                   }
               };

               var getSizes = function (sizeName) {
                   return sizes[sizeName];
               };

               var getSizeIndex = function (sizeName, size) {
                   var matches = getSizes(sizeName);
                   var match = matches[size];
                   return match !== undefined ? match : -1;
               };

               return {
                   sizes: sizes,
                   getSizes: getSizes,
                   getSizeIndex: getSizeIndex
               };
           }])
           .factory("screenSizerService", ["$document", "screenSizerConfig",
               function ($document, screenSizerConfig) {

                   // Private functions
                   function getCurrentSize(sizeName) {
                       var currentSize = mediaCheck(sizeName);
                       var currentSizeNum = screenSizerConfig.getSizeIndex(sizeName, currentSize);
                       if (currentSizeNum < 0) {
                           currentSizeNum = 100000;
                       }
                       return currentSizeNum;
                   }

                   function mediaCheck(id) {
                       // Queries the ::after:content value of <div id="mq_page"></div> and <div id="mq_menu"></div>
                       // Set the content value in the CSS for each media query needed
                       var mediaSize = "large";
                       var mq = document.getElementById(id);

                       if (mq) { mediaSize = window.getComputedStyle(mq, ":after").getPropertyValue("content"); }
                       else { console.log("Couldn't find an element with an id of" + id); }

                       // Remove the quotes around the result for FF and Safari
                       mediaSize = mediaSize.replace(/"/g, '');

                       return mediaSize;
                   }

                   return {
                       isSmallerThan: function (sizeName, size) {
                           return getCurrentSize(sizeName) < size;
                       },
                       isLargerThan: function (sizeName, size) {
                           return getCurrentSize(sizeName) > size;
                       },
                       isSmallerThanOrEqualTo: function (sizeName, size) {
                           return getCurrentSize(sizeName) <= size;
                       },
                       isLargerThanOrEqualTo: function (sizeName, size) {
                           var curr = getCurrentSize(sizeName);
                           return curr >= size;
                       },
                       isEqualTo: function (sizeName, size) {
                           return getCurrentSize(sizeName) == size;
                       }
                   };

               }
           ]);

})();