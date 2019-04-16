/* global _ */

import 'owl.carousel';
import _ from 'lodash';
import {waitForImagesToLoad} from 'core/helpers/waitForMediaToBeReady';

const carouselContainerSelector = '.owl-carousel';

/**
 * @ngdoc directive
 * @module superdesk.apps.web_publisher
 * @name sdGallery
 * @description Directive to show gallery slideshow
 */

export function GalleryDirective() {

    class Gallery {
        constructor() {
            this.scope = {
                items: '=',
            };

           this.template = require('./view.html');
        }

        link(scope, elem, attr) {
            /*
             * Initialize carousel after all content is loaded
             * otherwise carousel height is messed up
             */
            scope.$watch('items', (items) => {
                scope.navCounter = 1;

                scope.$applyAsync(() => {
                    // waiting for angular to render items

                    if (scope.carousel) {
                        scope.carousel.trigger('destroy.owl.carousel');
                    }

                    const carouselImages = Array.from(elem.get(0).querySelectorAll(`${carouselContainerSelector} img`));


                    if (items.length < 1 || carouselImages.length < 1) {
                        return;
                    }

                    waitForImagesToLoad(carouselImages).then(scope.initCarousel);
                });
            });

            scope.initCarousel = () => {
                scope.carousel = elem.find(carouselContainerSelector).owlCarousel({
                    items: 1,
                    autoHeight: true,
                    mouseDrag: false,
                    touchDrag: false,
                });
            }

            scope.navNext = () => {
                if (scope.navCounter < scope.items.length) {
                    scope.carousel.trigger('next.owl.carousel');
                    scope.navCounter++;
                }
            };

            scope.navPrev = () => {
                if (scope.navCounter > 1) {
                    scope.carousel.trigger('prev.owl.carousel');
                    scope.navCounter--;
                }
            };

        }
    }

    return new Gallery();
}