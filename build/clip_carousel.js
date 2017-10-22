'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClipCarousel = function () {
    function ClipCarousel(options) {
        _classCallCheck(this, ClipCarousel);

        var self = this;

        self.settings = $.extend({
            autoplay_speed: 1,
            animate_duration: 1,
            autoplay: true
        }, options);

        var $slider = $(options.slider_selector);

        var $slides = $slider.find('>div');

        self.$thumbs = $(options.thumbs_selector);

        self.slides = self.create_slides_arr($slides);

        self.thumbs = self.create_thumbs_arr();

        self.slider_width = 0;
        self.slider_height = 0;

        self.thumb_width = 0;
        self.thumb_width = 0;

        self.current_index = 0;
        self.next_index = null;
        self.prev_index = null;

        self.animate_direction = 'forward';

        self.play_interval;

        self.thumb_animation_tl = new TimelineMax();
        self.slider_animation_tl = new TimelineMax();

        self.interval = self.settings.autoplay_speed + self.settings.animate_duration;

        self.slides_count = self.slides.length;

        self.init_thumbs_index();

        self.get_slide_size();
        self.get_thumb_size();

        self.init_pagination_thumbs();

        if (options.autoplay) {
            self.play();
        }
    }

    _createClass(ClipCarousel, [{
        key: 'init_pagination_thumbs',
        value: function init_pagination_thumbs() {

            var self = this;

            self.$thumbs.find('>div').on('click', function () {
                self.go_to_index($(this).data('slide_index'));
            });
        }
    }, {
        key: 'get_slide_size',
        value: function get_slide_size() {

            var self = this;

            self.slider_width = self.slides[0].element.outerWidth();
            self.slider_height = self.slides[0].element.outerHeight();

            $(window).on('resize', function () {
                self.slider_width = self.slides[0].element.outerWidth();
                self.slider_height = self.slides[0].element.outerHeight();
            });
        }
    }, {
        key: 'get_thumb_size',
        value: function get_thumb_size() {

            var self = this;

            self.thumb_width = self.thumbs[0].element.outerWidth();
            self.thumb_height = self.thumbs[0].element.outerHeight();

            $(window).on('resize', function () {
                self.thumb_width = self.thumbs[0].element.outerWidth();
                self.thumb_height = self.thumbs[0].element.outerHeight();
            });
        }
    }, {
        key: 'create_thumbs_arr',
        value: function create_thumbs_arr() {
            var self = this;

            self.$thumbs.find('>div:eq(0)').remove();

            var thumb_arr = [];

            self.$thumbs.find('>div').each(function () {

                thumb_arr.push({
                    element: $(this)
                });
            });

            return thumb_arr;
        }
    }, {
        key: 'create_slides_arr',
        value: function create_slides_arr($slides) {

            var self = this;

            var slider_counter = 0;

            var slides = [];

            $slides.each(function (slide) {

                slides.push({
                    element: $(this),
                    element_thumb_content: self.$thumbs.find('>div:eq(' + slider_counter + ')>div'),
                    slide_settings: $(this).data('expandCarousel')
                });

                slider_counter++;
            });

            return slides;
        }
    }, {
        key: 'init_thumbs_index',
        value: function init_thumbs_index() {

            var self = this;

            var slides_counter = 0;
            var thumb_counter = 0;

            self.slides.forEach(function () {

                if (slides_counter != self.current_index) {

                    self.thumbs[thumb_counter].element.data('slide_index', slides_counter);

                    thumb_counter++;
                }

                slides_counter++;
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

            self.render();
        }
    }, {
        key: 'render',
        value: function render() {

            var self = this;

            self.set_animate_duration();

            self.slider_animation();
            self.thumb_animation();

            self.current_index = self.next_index;

            self.next_index = null;
        }
    }, {
        key: 'set_animate_duration',
        value: function set_animate_duration() {

            var self = this;

            if (self.current_index == self.slides.length - 1 && self.next_index == 0) {
                self.animate_direction = 'forward';
            } else if (self.current_index == 0 && self.next_index == self.slides.length - 1) {
                self.animate_direction = 'backward';
            } else if (self.next_index > self.current_index) {
                self.animate_direction = 'forward';
            } else {
                self.animate_direction = 'backward';
            }
        }
    }, {
        key: 'slider_animation',
        value: function slider_animation() {
            var self = this;

            if (self.slider_animation_tl.isActive() === true) {
                self.slider_animation_tl.progress(1);
            }

            self.slider_animation_tl.set(self.slides[self.next_index].element, { className: '+=next' });

            self.slider_animation_tl.set(self.slides[self.current_index].element, { className: '+=prev' });

            if (self.animate_direction == 'forward') {
                self.slider_animation_tl.fromTo(self.slides[self.current_index].element, self.settings.animate_duration, { clip: 'rect(0, ' + self.slider_width + 'px, ' + self.slider_height + 'px, 0px)' }, { clip: 'rect(0, 0px,' + self.slider_height + 'px, 0px)' });
            } else {
                self.slider_animation_tl.fromTo(self.slides[self.current_index].element, self.settings.animate_duration, { clip: 'rect(0, ' + self.slider_width + 'px, ' + self.slider_height + 'px, 0px)' }, { clip: 'rect(0, ' + self.slider_width + 'px, ' + self.slider_height + 'px, ' + self.slider_width + 'px)' });
            }

            self.slider_animation_tl.set(self.slides[self.current_index].element, { className: '-=active' });
            self.slider_animation_tl.set(self.slides[self.current_index].element, { className: '-=prev' });

            self.slider_animation_tl.set(self.slides[self.current_index].element, { clip: 'rect(0, ' + self.slider_width + 'px, ' + self.slider_height + 'px, 0px)' });

            self.slider_animation_tl.set(self.slides[self.next_index].element, { className: '-=next' });
            self.slider_animation_tl.set(self.slides[self.next_index].element, { className: '+=active' });
        }
    }, {
        key: 'thumb_animation',
        value: function thumb_animation() {

            var self = this;

            self.thumbs.forEach(function (thumb) {

                if (thumb.element.data('slide_index') == self.next_index) {

                    if (self.thumb_animation_tl.isActive() === true) {
                        self.thumb_animation_tl.progress(1);
                    }

                    thumb.element.append(self.slides[self.current_index].element_thumb_content);

                    var next_thumb = $(thumb.element).find('>div:eq(1)');
                    var current_thumb = $(thumb.element).find('>div:eq(0)');

                    self.thumb_animation_tl.set(current_thumb, { className: '+=prev' });
                    self.thumb_animation_tl.set(next_thumb, { className: '+=next' });

                    if (self.animate_direction == 'forward') {
                        self.thumb_animation_tl.fromTo(current_thumb, self.settings.animate_duration, { clip: 'rect(0, ' + self.thumb_width + 'px, ' + self.thumb_height + 'px, 0px)' }, { clip: 'rect(0, 0px,' + self.thumb_height + 'px, 0px)' });
                    } else {
                        self.thumb_animation_tl.fromTo(current_thumb, self.settings.animate_duration, { clip: 'rect(0, ' + self.thumb_width + 'px, ' + self.thumb_height + 'px, 0px)' }, { clip: 'rect(0, ' + self.thumb_width + 'px,' + self.thumb_height + 'px, ' + self.thumb_width + 'px)' });
                    }

                    self.thumb_animation_tl.set(current_thumb, { className: '-=prev' });
                    self.thumb_animation_tl.set(current_thumb, { className: '-=active' });
                    self.thumb_animation_tl.set(next_thumb, { className: '-=next' });
                    self.thumb_animation_tl.set(next_thumb, { className: '+=active' });

                    self.thumb_animation_tl.set(current_thumb, { clip: 'rect(0, ' + self.thumb_width + 'px, ' + self.thumb_height + 'px, 0px)' });

                    thumb.element.data('slide_index', self.current_index);
                }
            });
        }
    }]);

    return ClipCarousel;
}();

var photo_slider = new ClipCarousel({
    slider_selector: '.photo-slider',
    thumbs_selector: '.photo-slider-thumb'
});

$('#slide-next').on('click', function () {
    photo_slider.go_to('forward');
});

$('#slide-prev').on('click', function () {
    photo_slider.go_to('backward');
});