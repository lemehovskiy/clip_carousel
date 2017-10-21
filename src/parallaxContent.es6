class Carousel_core {

    constructor(options) {

        let self = this;


        let $slider = $(options.selector);
        let $slides = $slider.find('div');


        self.slides = self.create_slides_arr($slides);

        self.thumbs = self.create_thumbs_arr();


        // self.update_thumbs($slides);

        // console.log(self.thumbs);

        self.slider_width = 0;
        self.slider_height = 0;

        self.thumb_width = 0;
        self.thumb_width = 0;

        self.current_index = 0;
        self.next_index = null;
        self.prev_index = null;
        self.play_interval;

        self.thumb_animation_tl = new TimelineMax();
        self.slider_animation_tl = new TimelineMax();


        self.autoplay_speed = 2;
        self.animate_duration = 3;

        self.interval = self.autoplay_speed + self.animate_duration;


        self.skip_slide = false;

        self.slides_count = self.slides.length;

        if (options.pagination) {
            self.pagination(options.pagination);
        }

        self.init_thumbs_index();

        self.get_slide_size();
        self.get_thumb_size();

        // self.play();

    }

    get_slide_size(){

        let self = this;

        self.slider_width = $('.main >div').outerWidth();
        self.slider_height = $('.main >div').outerHeight();

        $(window).on('resize', function(){
            self.slider_width = $('.main >div').outerWidth();
            self.slider_height = $('.main >div').outerHeight();
        })

    }

    get_thumb_size(){

        let self = this;

        self.thumb_width = $('.thumb >div').outerWidth();
        self.thumb_height = $('.thumb >div').outerHeight();

        $(window).on('resize', function(){
            self.thumb_width = $('.thumb >div').outerWidth();
            self.thumb_height = $('.thumb >div').outerHeight();
        })

    }

    create_thumbs_arr() {
        $('.thumb >div:eq(0)').remove();

        let thumb_arr = [];

        $('.thumb >div').each(function () {

            thumb_arr.push({
                element: $(this)
            });
        })

        return thumb_arr;
    }

    create_slides_arr($slides) {

        let slider_counter = 0;

        let slides = [];

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


    init_thumbs_index() {

        let self = this;

        let slides_counter = 0;
        let thumb_counter = 0;

        self.slides.forEach(function () {

            if (slides_counter != self.current_index) {

                self.thumbs[thumb_counter++].index = slides_counter;
            }


            slides_counter++;
        });
    }

    pagination(pagination_el) {

        let self = this;
        let counter = 0;

        let $pagination_el = $(pagination_el);

        for (let i = 0; i < self.slides_count; i++) {
            $pagination_el.append('<span>' + counter++ + '</span>')
        }

        $pagination_el.on('click', 'span', function () {
            self.go_to_index($(this).index())
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

        self.slider_animation();
        self.thumb_animation();

        self.current_index = self.next_index;

        self.next_index = null;

    }

    slider_animation(){
        let self = this;

        if ( self.slider_animation_tl.isActive() === true ) {
            self.slider_animation_tl.progress(1);
        }

        self.slider_animation_tl.set(self.slides[self.next_index].element, {className:'+=next'})

        self.slider_animation_tl.fromTo(self.slides[self.current_index].element, 3, {clip: 'rect(0, ' + self.slider_width + 'px, ' + self.slider_height + 'px, 0px)'}, {clip: 'rect(0, 0px,' + self.slider_height + 'px, 0px)'})
        self.slider_animation_tl.set(self.slides[self.current_index].element, {className:'-=active'})

        self.slider_animation_tl.set(self.slides[self.current_index].element, {clip: 'rect(0, ' + self.slider_width + 'px, ' + self.slider_height + 'px, 0px)'})

        self.slider_animation_tl.set(self.slides[self.next_index].element, {className:'-=next'})
        self.slider_animation_tl.set(self.slides[self.next_index].element, {className:'+=active'})

    }

    thumb_animation(){

        let self = this;

        self.thumbs.forEach(function (thumb) {

            if (thumb.index == self.next_index) {


                if ( self.thumb_animation_tl.isActive() === true ) {
                    self.thumb_animation_tl.progress(1);
                }


                thumb.element.append(self.slides[self.current_index].element_thumb_content);


                let next_thumb = $(thumb.element).find('div:eq(1)');
                let current_thumb = $(thumb.element).find('div:eq(0)');



                self.thumb_animation_tl.set(next_thumb, {className:'+=next'})

                self.thumb_animation_tl.fromTo(current_thumb, 3, {clip: 'rect(0, ' + self.thumb_width + 'px, ' + self.thumb_height + 'px, 0px)'}, {clip: 'rect(0, 0px,' + self.thumb_height + 'px, 0px)'})

                self.thumb_animation_tl.set(current_thumb, {className:'-=active'})
                self.thumb_animation_tl.set(next_thumb, {className:'-=next'})
                self.thumb_animation_tl.set(next_thumb, {className:'+=active'})

                self.thumb_animation_tl.set(current_thumb, {clip: 'rect(0, ' + self.thumb_width + 'px, ' + self.thumb_height + 'px, 0px)'})


                thumb.index = self.current_index;

            }
        })

    }

}

let carousel_core = new Carousel_core({

    selector: '.main',
    pagination: '.pagination'
});


$('#next-slide').on('click', function(){
    carousel_core.go_to('forward');
})

$('#prev-slide').on('click', function(){
    carousel_core.go_to('backward');
})