/**
 * Sets up IntersectionObserver as an observable.
 * Prevents potential scope issues.
 */

(function() {
    angular.module('ngIntersectionObserver', [])
        .factory('ngIntersectionObserverFactory', ['$window',
            function($window) {

                var configs = {
                    // default will fire when target is 100% in screen
                    defaultObserver: {
                        name: 'defaultObserver',
                        root: null,
                        rootMargin: "0px 0px",
                        threshold: 0
                    },
                    lazyloadObserver: {
                        // fires when target is 50px below the fold
                        name: 'lazyloadObserver',
                        root: null,
                        rootMargin: '50px 0px',
                        threshold: 0
                    },
                    stickyNavObserver: {
                        name: 'stickyNavObserver',
                        root: null,
                        threshold: 0,
                        rootMargin: '-5px 0px',
                        keepWatch: true
                    }
                };

                class IntersectionObserverFactory {
                    constructor(config) {
                        this.config = config;
                        this.subscribers = [];
                        this.observer = undefined;
                    }

                    subscribe(subscriber) {
                        this.subscribers.push(subscriber);
                    }

                    observe(subscriber) {
                        this.observer.observe(subscriber);
                    }

                    /**
                     * createObserver-
                     * @param { boolean } keepWatch - whether the observer should stop observing after element has entered screen.
                     * Set in the config.
                     */
                    createObserver(keepWatch) {
                        if ('IntersectionObserver' in $window) { // Confirm browser support

                            /**
                             * NOTE:
                             * subscribers !== this.subscribers;
                             * They represent the same element but are different objects.
                             * this.subscribers = the original list of subscribers passed in {el, func};
                             * subscribers = the local variable for the IntersectionObserver
                             */
                            this.observer = new IntersectionObserver(subscribers => {
                                
                                for(let i = 0; i < subscribers.length; i++) {

                                    if(subscribers[i].intersectionRatio > 0) {

                                        if(!keepWatch) {
                                            /**
                                             * Stop watching after the element is in screen
                                             */
                                            this.observer.unobserve(subscribers[i].target);
                                        }
                                        
                                        /**
                                         * Reference the callback from this.subscribers.
                                         * Pass the specific target from the IntersectionObserver
                                         */
                                        this.subscribers[i].func(subscribers[i].target);
                                    }
                                }
                            }, this.config);
                        } else {
                            /**
                             * Loop through all subscribers.
                             * Fire whatever function that would otherwise have been fired by the IntersectionObserver.
                             * subscriber.el[0] = the reference to the actual DOM node.
                             */
                            this.subscribers.forEach(subscriber => {
                                subscriber.func(subscriber.el[0]);
                            });
                        }
                    }
                }

                // Init array that will hold the observers
                var intObservers = [];

                for (var key in configs) {
                    /**
                     * Adds a new instance of InitIntersectionsObserver class.
                     * intObservers[configs[key].name] adds new instance with the name of the config but not as a string
                     */
                    intObservers[configs[key].name] = new IntersectionObserverFactory(configs[key]);
                    /**
                     * Initiate the observer for this particular class
                     */

                    intObservers[configs[key].name].createObserver(configs[key].keepWatch);
                }

                /**
                 * Subscribe takes an object for its parameters containing:
                 * @param { ngElement } el - the el from ngDirective Link function
                 * @param { string } config - the name of the config for the observer, will also become the name of the observer
                 * @param { function } func - callback function inside the link. Use to set a class, change src etc
                 */
                var _subscribe = function(el, config, func) {

                    intObservers[configs[config].name].subscribe({ el: el, func: func });

                    /**
                     * @param { ngElement } el[0] - pass it as the 0 index to refer to actual DOM element.
                     */
                    intObservers[configs[config].name].observe(el[0]);
                };

                return {
                    subscribe: _subscribe
                };
            }
        ]);
}());