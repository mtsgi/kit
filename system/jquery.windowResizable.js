(function($){ 
    $.fn.windowResizable = function(userOptions){
        let elements = this;
        let defaults = {
            minWidth: 0,
            minHeight: 0,
            maxWidth: 10000,
            maxHeight: 10000,
            mouseRange: 10,
            isWidthResize:true,
            isHeightResize:true
        };
        
        let option = $.extend(defaults,userOptions);

        $(this).css('resize', 'none'); 
        $(this).css('overflow', 'auto'); 
        let pos_left = $(this).offset().left;
        let pos_top = $(this).get(0).offsetTop;
        let pos_right = $(this).outerWidth() + pos_left;
        let pos_bottom = $(this).outerHeight() + pos_top;
        let right_min = pos_right - option.mouseRange;
        let bottom_min = pos_bottom - option.mouseRange;
        let right_flg = false;
        let bottom_flg = false;
        let $box = $(this);
        let resize_flg = false;
        
        $(this).mousemove(function(e){

            if(resize_flg) return;
            
            right_flg = false;
            bottom_flg = false;

            pos_left = $box.offset().left;
            pos_top = $box.offset().top;
            pos_right = $box.outerWidth() + pos_left;
            pos_bottom = $box.outerHeight() + pos_top;
            right_min = pos_right - option.mouseRange;
            bottom_min = pos_bottom - option.mouseRange;
            
            let pagex = window.event.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft); 
            let pagey = window.event.clientY + (document.body.scrollTop || document.documentElement.scrollTop); 
            
            // right
            if(pagex <= pos_right && right_min <= pagex
                && pos_top <= pagey && pagey <= pos_bottom && option.isWidthResize)
            {
                right_flg = true;
            }
            // bottom
            if(pagex <= pos_right && pos_left <= pagex
                && bottom_min <= pagey && pagey <= pos_bottom && option.isHeightResize)
            {
                bottom_flg = true;
            }

            if(right_flg && bottom_flg)
            {
                $(this).css('cursor','se-resize');
            }
            else if(right_flg)
            {
                $(this).css('cursor','e-resize'); 
            }
            else if(bottom_flg)
            {
                $(this).css('cursor','n-resize');
            }
            else{
                $(this).css('cursor','auto');
            }
        });

        $(this).mousedown(function(e){
            
            let resize_right_flg = false;
            let resize_bottom_flg = false;
            
            let pagex = e.pageX;
            let pagey = e.pageY;
            let boxWidth = $box.width();
            let boxHeight = $box.height();
            
            if(right_flg){
                resize_right_flg = true;
            }
            
            if(bottom_flg){
                resize_bottom_flg = true;
            }
            $(document).mousemove(function(e){
                
                if(!resize_right_flg && !resize_bottom_flg)
                    return;   
                
                $('body').css('cursor', $box.css('cursor'));
                resize_flg = true;

                let addWidth = e.pageX - pagex;
                let resize_width = boxWidth + addWidth
                if(resize_right_flg && resize_width <= option.maxWidth 
                                        && option.minWidth <= resize_width){
                    $box.width(resize_width);
                }
                
                let addheight = e.pageY - pagey;
                let resize_height = boxHeight + addheight
                if(resize_bottom_flg && resize_height <= option.maxHeight 
                                        && option.minHeight <= resize_height){
                    $box.height(resize_height);
                }
            }).mouseup(function(){
                $(document).off("mousemove").on("mousemove", function(event){
                    System.mouseX = event.clientX;
                    System.mouseY = event.clientY;
                });
                resize_bottom_flg = false;
                resize_right_flg = false;
                resize_flg = false;
                $('body').css('cursor','auto');
            });            
        });

        return(this);
    };
})(jQuery);