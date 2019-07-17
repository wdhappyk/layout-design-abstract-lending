$(function DOMContentLoaded() {
    new WOW().init();

    $('.go-to').click(function goToElement(ev) {
        ev.preventDefault();

        var scroll_el = $(this).attr('href');

        if ($(scroll_el).length) $('html, body').animate({ scrollTop: $(scroll_el).offset().top }, 500);

        return false;
    });

    (function rightPanel() {
        var $rightPanel = $('#right-panel'),
            $lsOpen = $('#right-panel-open div');
        

        $('#right-panel-open').on('click', function openRightMenu() {
            $($lsOpen.get(0)).animate({
                left: 7
            }, 100);

            $($lsOpen.get(2)).animate({
                left: -7
            }, 100);

            setTimeout(function swipeMenu() {
                for (var i = 0; i <= 2; i++) {
                    $($lsOpen.get(i)).animate({
                        left: 100,
                        opacity: 0
                    }, 100 * (i + 1));
                }

                setTimeout(function() {
                    $rightPanel.addClass('right-panel__active');
                }, 300);
            });
        });

        $('#right-panel-close').on('click', function closeRightMenu() {
            $rightPanel.removeClass('right-panel__active');

            setTimeout(function() {
                for (var i = 0; i <= 2; i++) {
                    $($lsOpen.get(i)).animate({
                        left: 0,
                        opacity: 1
                    }, 100 * (i + 1));
                }
            }, 300);
        });
    })();

    (function menuSticky() {
        var $w = $(window),
            $h = $('#header'),
            $hpt = $h.css('padding-top'),
            $m = $('#menu');

        $m.data('animate', false);

        $w.on('resize', eventEmitter);
        $w.on('scroll', eventEmitter);

        function eventEmitter() {
            if (inHead()) {
                unstick();
            } else {
                stick();
            }
        }

        eventEmitter();

        function inHead() {
            var st = $w.scrollTop(),
                h = $h.outerHeight();
            
            return !(st >= h);
        }

        function stick() {
            if ($m.hasClass('menu_stick')) return;
            $h.css('padding-top', parseInt($hpt) + $m.height()+'px');
            $m.addClass('menu_stick');
        }

        function unstick() {
            if (!$m.hasClass('menu_stick') || $m.data('animate')) return;

            $m.data('animate', true);

            $m.animate({
                top: -500
            }, 300, function complete() {
                if (inHead()) $m.removeClass('menu_stick');
                $m.data('animate', false);
                $m.css('top', 0);
            });

            $h.css('padding-top', $hpt);
        }
    })();
    
    (function review() {
        var $list = $('#review-cards'),
            $sl = $('#review-left'),
            $sr = $('#review-right'),
            mxSum = 40,
            selN = 0; // margin-left + margin-right

        function selectNext() {
            var $cards = $list.find('.card'),
                center = $cards.length / 2 >> 0;

            if (selN === $cards.length - center - 1) selN = center - $cards.length + 1;
            else selN++;

            selectCard(selN);
        }

        function selectPrev() {
            var $cards = $list.find('.card'),
                center = $cards.length / 2 >> 0;

            if (selN === center - $cards.length + 1) selN = $cards.length - center - 1;
            else selN--;

            selectCard(selN);
        }

        $sr.on('click', selectPrev);
        $sl.on('click', selectNext);

        function selectCard(n) {
            var $cards = $list.find('.card'),
                offsetX = 0,
                offsetPx = 0,
                center = $cards.length / 2 >> 0,
                k = center - n >= 0 ? 1 : -1;

            if ($cards.length % 2 === 0) {
                offsetX = -50;
                offsetPx = -mxSum / 2;
            }

            offsetX += k * n * 100;
            offsetPx += k * n * mxSum;

            $cards.each(function(i) {
                var $card = $(this);

                if (center-i !== n) $card.removeClass('card_review-active');
                else $card.addClass('card_review-active');

                $card.css('transform', 'translateX(calc(' + offsetX + '% + ' + offsetPx + 'px))');
            });
        }

        selectCard(selN);

        $list.swipe({
            swipeStatus: function(event, phase, direction, distance, duration, fingerCount, fingerData, currentDirection)
            {
                if (phase === "end"){
                    if (direction === 'left') selectPrev();
                    if (direction === 'right') selectNext();
                }
            },
            triggerOnTouchEnd:false,
            threshold: 50 // сработает через 50 пикселей
        });
    })();
    
});

