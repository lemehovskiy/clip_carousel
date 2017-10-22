class ClipCarousel {

    constructor(options) {

        let self = this;


        self.settings = $.extend({
            autoplay_speed: 1,
            animate_duration: 1,
            autoplay: true
        }, options);


        let $slider = $(options.slider_selector);

        let $slides = $slider.find('>div');

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


    init_pagination_thumbs(){

        let self = this;

        self.$thumbs.find('>div').on('click', function(){
            self.go_to_index($(this).data('slide_index'))
        })
    }


    get_slide_size(){

        let self = this;

        self.slider_width = self.slides[0].element.outerWidth();
        self.slider_height = self.slides[0].element.outerHeight();

        $(window).on('resize', function(){
            self.slider_width = self.slides[0].element.outerWidth();
            self.slider_height = self.slides[0].element.outerHeight();
        })

    }

    get_thumb_size(){

        let self = this;

        self.thumb_width = self.thumbs[0].element.outerWidth();
        self.thumb_height = self.thumbs[0].element.outerHeight();

        $(window).on('resize', function(){
            self.thumb_width = self.thumbs[0].element.outerWidth();
            self.thumb_height = self.thumbs[0].element.outerHeight();
        })

    }

    create_thumbs_arr() {
        let self = this;

        self.$thumbs.find('>div:eq(0)').remove();

        let thumb_arr = [];

        self.$thumbs.find('>div').each(function () {

            thumb_arr.push({
                element: $(this)
            });
        })

        return thumb_arr;
    }

    create_slides_arr($slides) {

        let self = this;

        let slider_counter = 0;

        let slides = [];

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


    init_thumbs_index() {

        let self = this;

        let slides_counter = 0;
        let thumb_counter = 0;

        self.slides.forEach(function () {

            if (slides_counter != self.current_index) {

                self.thumbs[thumb_counter].element.data('slide_index', slides_counter);

                thumb_counter++;
            }

            slides_counter++;
        });

    }


    play() {

        let self = this;

        clearInterval(self.play_interval);

        self.play_interval = setInterval(() => {

            self.go_to('forward');

        }, self.interval * 1000);
    }

    stop() {
        let self = this;

        clearInterval(self.play_interval);
    }

    next() {
        let self = this;

        self.go_to('forward');
    }

    prev() {
        let self = this;

        self.go_to('backward');
    }

    go_to_index(index) {
        let self = this;


        self.next_index = index;

        self.render();
    }

    go_to(direction) {

        let self = this;

        self.prev_index = self.next_index;

        if (direction == 'forward') {

            if (self.current_index == self.slides.length - 1) {
                self.next_index = 0;
            }

            else {
                self.next_index = self.current_index + 1;
            }
        }

        else if (direction == 'backward') {
            if (self.current_index == 0) {
                self.next_index = self.slides.length - 1;
            }

            else {
                self.next_index = self.current_index - 1;
            }
        }

        self.render();
    }

    render() {

        let self = this;


        self.set_animate_duration();

        self.slider_animation();
        self.thumb_animation();


        self.current_index = self.next_index;

        self.next_index = null;

    }

    set_animate_duration(){

        let self = this;

        if (self.current_index == self.slides.length - 1 && self.next_index == 0) {
            self.animate_direction = 'forward';
        }

        else if (self.current_index == 0 && self.next_index == self.slides.length - 1) {
            self.animate_direction = 'backward';
        }

        else if (self.next_index > self.current_index) {
            self.animate_direction = 'forward';
        }
        else {
            self.animate_direction = 'backward';
        }
    }

    slider_animation(){
        let self = this;

        if ( self.slider_animation_tl.isActive() === true ) {
            self.slider_animation_tl.progress(1);
        }

        self.slider_animation_tl.set(self.slides[self.next_index].element, {className:'+=next'})

        self.slider_animation_tl.set(self.slides[self.current_index].element, {className:'+=prev'})

        if (self.animate_direction == 'forward') {
            self.slider_animation_tl.fromTo(self.slides[self.current_index].element, self.settings.animate_duration,
                {clip: 'rect(0, ' + self.slider_width + 'px, ' + self.slider_height + 'px, 0px)'},
                {clip: 'rect(0, 0px,' + self.slider_height + 'px, 0px)'})
        }
        else {
            self.slider_animation_tl.fromTo(self.slides[self.current_index].element, self.settings.animate_duration,
                {clip: 'rect(0, ' + self.slider_width + 'px, ' + self.slider_height + 'px, 0px)'},
                {clip: 'rect(0, ' + self.slider_width + 'px, ' + self.slider_height + 'px, ' + self.slider_width + 'px)'})
        }


        self.slider_animation_tl.set(self.slides[self.current_index].element, {className:'-=active'})
        self.slider_animation_tl.set(self.slides[self.current_index].element, {className:'-=prev'})

        self.slider_animation_tl.set(self.slides[self.current_index].element, {clip: 'rect(0, ' + self.slider_width + 'px, ' + self.slider_height + 'px, 0px)'})

        self.slider_animation_tl.set(self.slides[self.next_index].element, {className:'-=next'})
        self.slider_animation_tl.set(self.slides[self.next_index].element, {className:'+=active'})

    }

    thumb_animation(){

        let self = this;

        self.thumbs.forEach(function (thumb) {

            if (thumb.element.data('slide_index') == self.next_index) {

                if ( self.thumb_animation_tl.isActive() === true ) {
                    self.thumb_animation_tl.progress(1);
                }

                thumb.element.append(self.slides[self.current_index].element_thumb_content);

                let next_thumb = $(thumb.element).find('>div:eq(1)');
                let current_thumb = $(thumb.element).find('>div:eq(0)');

                self.thumb_animation_tl.set(current_thumb, {className:'+=prev'})
                self.thumb_animation_tl.set(next_thumb, {className:'+=next'})

                if (self.animate_direction == 'forward') {
                    self.thumb_animation_tl.fromTo(current_thumb, self.settings.animate_duration,
                        {clip: 'rect(0, ' + self.thumb_width + 'px, ' + self.thumb_height + 'px, 0px)'},
                        {clip: 'rect(0, 0px,' + self.thumb_height + 'px, 0px)'})
                }
                else {
                    self.thumb_animation_tl.fromTo(current_thumb, self.settings.animate_duration,
                        {clip: 'rect(0, ' + self.thumb_width + 'px, ' + self.thumb_height + 'px, 0px)'},
                        {clip: 'rect(0, ' + self.thumb_width + 'px,' + self.thumb_height + 'px, ' + self.thumb_width + 'px)'})
                }

                self.thumb_animation_tl.set(current_thumb, {className:'-=prev'})
                self.thumb_animation_tl.set(current_thumb, {className:'-=active'})
                self.thumb_animation_tl.set(next_thumb, {className:'-=next'})
                self.thumb_animation_tl.set(next_thumb, {className:'+=active'})

                self.thumb_animation_tl.set(current_thumb, {clip: 'rect(0, ' + self.thumb_width + 'px, ' + self.thumb_height + 'px, 0px)'})


                thumb.element.data('slide_index', self.current_index)

            }
        })
    }
}

let photo_slider = new ClipCarousel({
    slider_selector: '.photo-slider',
    thumbs_selector: '.photo-slider-thumb'
});


$('#slide-next').on('click', function(){
    photo_slider.go_to('forward');
})

$('#slide-prev').on('click', function(){
    photo_slider.go_to('backward');
})