'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Carousel_core = function () {
    function Carousel_core(options) {
        _classCallCheck(this, Carousel_core);

        var self = this;

        self.slides = [];

        var $slider = $(options.selector);
        var $slides = $slider.find('div');

        var slider_counter = 0;

        $slides.each(function (slide) {

            // console.log($(this).data());
            self.slides.push({
                element: $(this),
                element_thumb: $('.thumb >div:eq(' + slider_counter++ + ')'),
                slide_settings: $(this).data('expandCarousel')

            });

            console.log(slider_counter);
        });

        console.log(self.slides);

        self.current_index = 0;
        self.play_interval;
        self.interval = 2;

        self.slides_count = self.slides.length;

        if (options.pagination) {
            self.pagination(options.pagination);
        }
        self.play();
    }

    _createClass(Carousel_core, [{
        key: 'pagination',
        value: function pagination(pagination_el) {

            var self = this;
            var counter = 0;

            var $pagination_el = $(pagination_el);

            for (var i = 0; i < self.slides_count; i++) {
                $pagination_el.append('<span>' + counter++ + '</span>');
            }

            $pagination_el.on('click', 'span', function () {
                self.go_to_index($(this).index());
            });
        }
    }, {
        key: 'play',
        value: function play() {

            var self = this;

            clearInterval(self.play_interval);

            self.play_interval = setInterval(function () {

                self.go_to('forward');
            }, self.interval * 1000);
        }
    }, {
        key: 'stop',
        value: function stop() {
            var self = this;

            clearInterval(self.play_interval);
        }
    }, {
        key: 'next',
        value: function next() {
            var self = this;

            self.go_to('forward');
        }
    }, {
        key: 'prev',
        value: function prev() {
            var self = this;

            self.go_to('backward');
        }
    }, {
        key: 'go_to_index',
        value: function go_to_index(index) {
            var self = this;

            self.current_index = index;

            self.render();
        }
    }, {
        key: 'go_to',
        value: function go_to(direction) {

            var self = this;

            if (direction == 'forward') {

                if (self.current_index == self.slides.length - 1) {
                    self.current_index = 0;
                } else {
                    self.current_index++;
                }
            } else if (direction == 'backward') {
                if (self.current_index == 0) {
                    self.current_index = self.slides.length - 1;
                } else {
                    self.current_index--;
                }
            }

            self.render();
        }
    }, {
        key: 'render',
        value: function render() {

            var self = this;

            self.slides.forEach(function (item) {
                item.element.removeClass('active');
            });

            self.slides[self.current_index].element.addClass('active');

            self.slides.forEach(function (item) {
                item.element_thumb.removeClass('active');
            });

            self.slides[self.current_index].element_thumb.addClass('active');

            // $('.main div').removeClass('active');

            // $('.main div:eq(' + self.current_index + ')').addClass('active');


            // $('.thumb >div').removeClass('active');
            //
            // $('.thumb >div:eq(' + self.current_index + ')').addClass('active');
        }
    }]);

    return Carousel_core;
}();

var carousel_core = new Carousel_core({

    selector: '.main',
    pagination: '.pagination'
});