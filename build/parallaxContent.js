'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Carousel_core = function () {
    function Carousel_core(options) {
        _classCallCheck(this, Carousel_core);

        var self = this;

        var $slider = $(options.selector);
        var $slides = $slider.find('div');

        self.slides = self.create_slides_arr($slides);

        self.thumbs = self.create_thumbs_arr();

        // self.update_thumbs($slides);

        // console.log(self.thumbs);


        self.current_index = 0;
        self.next_index = null;
        self.prev_index = null;
        self.play_interval;
        self.interval = 0;

        self.skip_slide = false;

        self.slides_count = self.slides.length;

        if (options.pagination) {
            self.pagination(options.pagination);
        }

        self.update_thumbs();

        self.play();
    }

    _createClass(Carousel_core, [{
        key: 'create_thumbs_arr',
        value: function create_thumbs_arr() {
            $('.thumb >div:eq(0)').remove();

            var thumb_arr = [];

            $('.thumb >div').each(function () {

                thumb_arr.push({
                    element: $(this)
                });
            });

            return thumb_arr;
        }
    }, {
        key: 'create_slides_arr',
        value: function create_slides_arr($slides) {

            var slider_counter = 0;

            var slides = [];

            $slides.each(function (slide) {

                // console.log($(this).data());
                slides.push({
                    element: $(this),
                    // element_thumb: $('.thumb >div:eq('+ slider_counter  +')'),
                    element_thumb_content: $('.thumb >div:eq(' + slider_counter + ')>div'),
                    slide_settings: $(this).data('expandCarousel')

                });

                slider_counter++;
            });

            return slides;
        }
    }, {
        key: 'update_thumbs',
        value: function update_thumbs() {

            var self = this;

            var slides_counter = 0;
            var thumb_counter = 0;

            self.slides.forEach(function () {

                if (slides_counter != self.current_index) {

                    self.thumbs[thumb_counter++].index = slides_counter;
                }

                slides_counter++;
            });

            // console.log(self.thumbs);

            debugger;
        }
    }, {
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

            self.next_index = index;

            self.render();
        }
    }, {
        key: 'go_to',
        value: function go_to(direction) {

            var self = this;

            // $('#current-index').html(self.next_index);

            // $('#prev-index').html(self.prev_index);

            self.prev_index = self.next_index;

            if (direction == 'forward') {

                if (self.current_index == self.slides.length - 1) {
                    self.next_index = 0;
                } else {
                    self.next_index = self.current_index + 1;
                }
            } else if (direction == 'backward') {
                if (self.current_index == 0) {
                    self.next_index = self.slides.length - 1;
                } else {
                    self.next_index = self.current_index - 1;
                }
            }

            debugger;

            self.render();

            self.update_thumbs();
        }
    }, {
        key: 'render',
        value: function render() {

            var self = this;

            self.slides.forEach(function (item) {
                item.element.removeClass('active');
            });

            self.slides[self.next_index].element.addClass('active');

            // $('.thumb div[data-index="' + self.next_index + '"]').addClass('asdfasd');

            // console.log(self.prev_index);

            // self.thumbs[self.next_index].html( self.slides[self.prev_index].element_thumb_content);

            // $('.thumb div[data-index=' + self.prev_index +']').addClass('asdf');

            self.thumbs.forEach(function (thumb) {
                thumb.element.removeClass('test');
            });

            // console.log(self.next_index);
            // console.log(self.thumbs);

            console.log('next_slide: ' + self.next_index);

            self.thumbs.forEach(function (thumb) {

                console.log(thumb.index);

                if (thumb.index == self.next_index) {

                    thumb.element.addClass('test');
                    thumb.element.html(self.slides[self.current_index].element_thumb_content);
                }
            });

            self.current_index = self.next_index;

            self.next_index = null;

            // console.log(self.slides[self.prev_index].element_thumb_content);


            // self.slides.forEach(function(item){
            //     item.element_thumb.removeClass('active');
            // });


            // self.slides[self.next_index].element_thumb.addClass('active');

            // self.slides[self.next_index].element_thumb.append(self.slides[1].element_thumb.html());


            // $('.main div').removeClass('active');

            // $('.main div:eq(' + self.next_index + ')').addClass('active');


            // $('.thumb >div').removeClass('active');
            //
            // $('.thumb >div:eq(' + self.next_index + ')').addClass('active');
        }
    }]);

    return Carousel_core;
}();

var carousel_core = new Carousel_core({

    selector: '.main',
    pagination: '.pagination'
});

$('#next-slide').on('click', function () {
    carousel_core.go_to('forward');
});

$('#prev-slide').on('click', function () {
    carousel_core.go_to('backward');
});