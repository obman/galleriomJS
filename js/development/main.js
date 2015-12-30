/**
 * Created by fly on 16/01/15.
 */

/**
 * Page scroll animation
 */

(function(window, velocity) {
    var anchors,
        i = 0,
        length,
        scrollHandler;

    anchors = document.querySelectorAll('.waypoint-anchor');
    length  = anchors.length;

    for ( ; i < length; ++i) {
        anchors[i].addEventListener('click', function(evt) {
            scrollHandler(evt);
        }, false);
    }

    scrollHandler = function(e) {
        var el,
            target;

        target = e.target;
        
        if (target.nodeName == 'A') { el = document.querySelector(target.getAttribute('href')); }
        else { el = document.querySelector(target.parentElement.getAttribute('href')); }

        velocity(el, 'scroll', { duration: 1000 });
    };

})(window, Velocity);
