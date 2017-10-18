class Carousel_core {

    constructor(options) {

        let self = this;

        self.slides = [];


        let $slider = $(options.selector);
        let $slides = $slider.find('div');

        let slider_counter = 0;


        $slides.each(function(slide){

            // console.log($(this).data());
            self.slides.push({
                element: $(this),
                element_thumb: $('.thumb >div:eq('+ slider_counter++  +')'),
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

        self.render();

    }

    render(){

        let self = this;

        self.slides.forEach(function(item){
            item.element.removeClass('active');
        });

        self.slides[self.current_index].element.addClass('active');


        self.slides.forEach(function(item){
            item.element_thumb.removeClass('active');
        });


        
        self.slides[self.current_index].element_thumb.addClass('active');

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