/**
 * Created by a7268 on 2016/12/6.
 */

/* ========================================================================
 * Bootstrap: vertical_carousel.js v1.2.0
 * ======================================================================== */

+function ($) {
    'use strict';

    // VERTICAL_CAROUSEL CLASS DEFINITION
    // =========================

    var Carousel = function (element, options) {
        this.$element = $(element);
        this.id = $(element).prop("id");
        this.$indicators = this.$element.find('.vertical-carousel-indicators');
        this.$box = this.$element.find(".vertical-carousel-box");
        this.options = options;
        this.activeIndex = this.getItemIndex(this.$element.find('.item.active'));
        this.sliding = null;
        this.$items = null;

        var that = this;

        this.options.mousewheel && $(this.options.wheelTarget)
            .on('mousewheel.bs.vertical_carousel', $.proxy(this.mousewheel, this));
        if (options.urlLock) {
            this.toURL();
            $(window).on("hashchange", function () {
                setTimeout(function () {
                    if (!that.sliding)
                        that.toURL();
                }, 10)
            })
        }
    };

    Carousel.VERSION = "1.2.0";

    Carousel.TRANSITION_DURATION = 600;

    Carousel.DEFAULTS = {
        mousewheel: true,
        wheelTarget: document,
        urlLock: true
    };

    Carousel.prototype.mousewheel = function (e) {
        if (this.sliding) {
            return;
        }

        switch (e.originalEvent.wheelDelta > 0) {
            case true:
                this.to(this.activeIndex - 1);
                break;
            case false:
                this.to(this.activeIndex + 1);
                break;
            default:
                return
        }
        e.preventDefault()
    };

    Carousel.prototype.getItemIndex = function (item) {
        this.$items = item.parent().children('.item');
        return this.$items.index(item)
    };

    Carousel.prototype.toActive = function () {
        this.$box.css({
            transform: "translateY(-" + this.$element.height() * this.activeIndex + "px)"
        })
    };

    Carousel.prototype.toURL = function () {
        var hash = location.hash;
        var $item = this.$box.find(hash.replace(this.id + '_', ''));
        if ($item.length === 1) {
            this.to(this.getItemIndex($item));
        }
    };

    Carousel.prototype.to = function (pos) {
        if (!this.$items) {
            this.$items = this.$box.children('.item');
        }

        if (pos > (this.$items.length - 1) || pos < 0) {
            return;
        }

        return this.slide(pos, this.$items.eq(pos))
    };

    Carousel.prototype.next = function () {
        if (this.sliding) {
            return;
        }
        return this.to(this.activeIndex + 1);
    };

    Carousel.prototype.prev = function () {
        if (this.sliding) {
            return;
        }
        return this.to(this.activeIndex - 1);
    };

    Carousel.prototype.slide = function (pos, next) {
        var $active = this.$element.find('.item.active');
        var $next = next;
        var that = this;

        if ($next.hasClass('active')) return (this.sliding = false);

        var relatedTarget = $next[0];
        var slideEvent = $.Event('slide.bs.verticalCarousel', {
            relatedTarget: relatedTarget,
            pos: pos
        });
        this.$element.trigger(slideEvent);
        if (slideEvent.isDefaultPrevented()) {
            return;
        }

        this.sliding = true;

        this.activeIndex = pos;

        if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active');
            var $nextIndicator = $(this.$indicators.children()[pos]);
            $nextIndicator && $nextIndicator.addClass('active')
        }

        if (this.options["restsIndicators"]) {
            $(this.options["restsIndicators"] + ".active").removeClass("active");
            $($(this.options["restsIndicators"])[pos]).addClass("active");
        }//外部指示器

        var slidEvent = $.Event('slid.bs.verticalCarousel', {
            relatedTarget: relatedTarget,
            pos: pos
        });
        this.$box.css({
            transform: "translateY(-" + this.$element.height() * pos + "px)"
        });
        if ($.support.transition) {
            //$next[0].offsetWidth;//不理解有什么用，求大神解答
            $next.addClass("active");
            $active
                .one('bsTransitionEnd', function () {
                    $active.removeClass('active');
                    that.sliding = false;
                    if (that.options.urlLock) {
                        location.hash = that.id + '_' + $next.prop("id");
                    }
                    setTimeout(function () {
                        that.$element.trigger(slidEvent)
                    }, 0)
                })
                .emulateTransitionEnd(Carousel.TRANSITION_DURATION);
        } else {
            setTimeout(
                function () {
                    $active.removeClass('active');
                    $next.addClass('active');
                    that.sliding = false;
                    if (that.options.urlLock) {
                        location.hash = that.id + '_' + $next.prop("id");
                    }
                    that.$element.trigger(slidEvent)
                }, 100)
        }

        return this
    };

    // VERTICAL_CAROUSEL PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.vertical_carousel');
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option);
            var action = typeof option == 'string' ? option : options.slide;

            if (!data) $this.data('bs.vertical_carousel', (data = new Carousel(this, options)));
            if (typeof option == 'number') data.to(option);
            else if (action) data[action]();
        })
    }

    var old = $.fn.vertical_carousel;

    $.fn.vertical_carousel = Plugin;
    $.fn.vertical_carousel.Constructor = Carousel;
    

    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.vertical_carousel.noConflict = function () {
        $.fn.vertical_carousel = old;
        return this
    };

    // VERTICAL_CAROUSEL DATA-API
    // =================

    var clickHandler = function (e) {
        var href;
        var $this = $(this);
        var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7
        if (!$target.hasClass('vertical-carousel')) return;
        var options = $.extend({}, $target.data(), $this.data());
        var slideIndex = $this.attr('data-slide-to');

        Plugin.call($target, options);

        if (slideIndex) {
            $target.data('bs.vertical_carousel').to(parseInt(slideIndex))
        }

        e.preventDefault()
    };

    $(document)
        .on('click.bs.vertical_carousel.data-api', '[data-slide-to]', clickHandler);

    $(window).on("resize.bs.vertical_carousel", function () {   //窗口尺寸变化修正
        $('.vertical-carousel').each(function () {
            $(this).vertical_carousel("toActive");
        })
    });

    $(window).on('load', function () {
        $('.vertical-carousel').each(function () {
            var $carousel = $(this);
            Plugin.call($carousel, $carousel.data());
        })
    })

}(jQuery);