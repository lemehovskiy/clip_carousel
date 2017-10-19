class Carousel_core {

    constructor(options) {

        let self = this;


        let $slider = $(options.selector);
        let $slides = $slider.find('div');


        self.slides = self.create_slides_arr($slides);

        self.thumbs = self.create_thumbs_arr();



        // self.update_thumbs($slides);

        // console.log(self.thumbs);


        self.current_index = 0;
        self.prev_index = null;
        self.play_interval;
        self.interval = 4;

        self.slides_count = self.slides.length;

        if (options.pagination) {
            self.pagination(options.pagination);
        }

        self.update_thumbs();

        self.play();
    }

    create_thumbs_arr(){
        $('.thumb >div:eq(0)').remove();

        let thumb_arr = [];

        $('.thumb >div').each(function(){

            thumb_arr.push({
               element: $(this)
            });
        })

        return thumb_arr;
    }

    create_slides_arr($slides){

        let slider_counter = 0;

        let slides = [];

        $slides.each(function(slide){

            // console.log($(this).data());
            slides.push({
                element: $(this),
                // element_thumb: $('.thumb >div:eq('+ slider_counter  +')'),
                element_thumb_content: $('.thumb >div:eq('+ slider_counter  +')>div'),
                slide_settings: $(this).data('expandCarousel')

            });

            slider_counter++;

        });

        return slides;
    }

    update_thumbs(){

        let self = this;

        let slides_counter = 0;
        let thumb_counter = 0;

        self.slides.forEach(function(slide){

            if (slides_counter != self.current_index) {

                self.thumbs[thumb_counter++].index = slides_counter;
            }


            slides_counter++;
        });

        console.log(self.thumbs);
    }

    pagination(pagination_el) {

        let self = this;
        let counter = 0;

        let $pagination_el = $(pagination_el);

        for (let i = 0; i <  self.slides_count; i++) {
            $pagination_el.append('<span>'+ counter++ +'</span>')
        }

        $pagination_el.on('click', 'span', function(){
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


        self.current_index = index;

        self.render();
    }

    go_to(direction) {

        let self = this;

        self.prev_index = self.current_index;

        if (direction == 'forward') {

            if (self.current_index == self.slides.length - 1) {
                self.current_index = 0;
            }

            else {
                self.current_index++;
            }
        }

        else if (direction == 'backward') {
            if (self.current_index == 0) {
                self.current_index = self.slides.length - 1;
            }

            else {
                self.current_index--;
            }
        }


        $('#current-index').html(self.current_index);

        self.render();

    }

    render(){

        let self = this;

        self.slides.forEach(function(item){
            item.element.removeClass('active');
        });

        self.slides[self.current_index].element.addClass('active');


        // $('.thumb div[data-index="' + self.current_index + '"]').addClass('asdfasd');

        // console.log(self.prev_index);

        // self.thumbs[self.current_index].html( self.slides[self.prev_index].element_thumb_content);

        // $('.thumb div[data-index=' + self.prev_index +']').addClass('asdf');

        for (let i = 0; i < self.thumbs.length; i++) {

        }


        self.update_thumbs();


        // self.slides.forEach(function(item){
        //     item.element_thumb.removeClass('active');
        // });


        // self.slides[self.current_index].element_thumb.addClass('active');

        // self.slides[self.current_index].element_thumb.append(self.slides[1].element_thumb.html());




        // $('.main div').removeClass('active');

        // $('.main div:eq(' + self.current_index + ')').addClass('active');


        // $('.thumb >div').removeClass('active');
        //
        // $('.thumb >div:eq(' + self.current_index + ')').addClass('active');
    }

}

let carousel_core = new Carousel_core({

    selector: '.main',
    pagination: '.pagination'
});