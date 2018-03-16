/*! GalleriomJS (1.02) (C) Denis Mušić. GPL2 @license: http://www.gnu.org/licenses/ */
/**
 * Copyright (C) 2018  Denis Mušić
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */

( function( global, galleryDOM ) {

    var gallery;

    function Galleriom( appbox ) {
        this.appbox             = appbox || 0;
        this.appView            = 0;
        this.galleryHolder      = 0;
        this.galleryCollection  = [];
        this.gadget = {
            thumbsView : true,
            imageFit   : 'contain',
            caption    : false,
            preview    : false
        };
        this.leftNav    = 0;
        this.rightNav   = 0;
        this.dimensions = {
            w        : 0,
            h        : 0,
            quantity : -1
        };
        this.tools = {
            iClick  : 0,
            IE      : false,
            metrics : {
                w   : 'px',
                h   : 'px'
            }
        };
        this.swipe = {
            startX   : 0,
            treshold : 0,
            left     : 0,
            divider  : 0,
            lmb      : false
        };
    };

    Galleriom.prototype.startApp = function( env ) {
        var self = this;

        self.addListeners( 'load', env, function() {
            self.initialize( self );

            self.addListeners( 'resize', env, function() {
                var i = 0,
                    length;

                length = self.dimensions.quantity + 1;

                self.setAppFrame();
                self.elAdjuster( self.appView, self.dimensions );
                self.elAdjuster( self.galleryHolder, { w: self.dimensions.w * length, h: self.dimensions.h } );

                for ( ; i < length; ++i ) {
                    self.elAdjuster( self.galleryCollection[i], self.dimensions );
                }
            } );
        } );
    };

    Galleriom.prototype.initialize = function( self ) {
        // Detect setup
        try {
            // Detect compatibilities
            self.detectImages( self.appbox.getElementsByTagName( 'img' ) );
            self.detectIEBrowser();

            // Setup gallery
            self.setAppFrame();
            self.createView();
            self.createNavigation();
            self.createThumbsView();

            // Setup TRESHOLD and screen DIVIDER
            self.setTreshold( self.dimensions.w );
            self.setLeftRect( document.getElementById( 'galleriom-viewbox' ) );
            self.setScreenDivider( self.dimensions.w );

            // Binding event listeners
            self.addListeners('click', self.leftNav, function( evt ) { self.moveLeft( evt ); } );
            self.addListeners('click', self.rightNav, function( evt ) { self.moveRight( evt ); } );

            self.addListeners('touchstart', self.galleryHolder, function( evt ) { self.swipeTouchStart( evt ); });
            self.addListeners('touchmove', self.galleryHolder, function( evt ) { self.swipeTouchMove( evt ); });
            self.addListeners('touchend', self.galleryHolder, function( evt ) { self.swipeTouchEnd( evt ); });

            self.addListeners('mousedown', self.galleryHolder, function( evt ) { self.swipeMouseStart( evt ); });
            self.addListeners('mousemove', self.galleryHolder, function( evt ) { self.swipeMouseMove( evt ); });
            self.addListeners('mouseup', self.galleryHolder, function( evt ) { self.swipeMouseEnd( evt ); });
        } catch( error ) {
            /*console.log ( error );*/
        }
    };


    /**
     * GETTER METHODS
     *
     * Getting width and height from application wrapper, as user defined
     */

    Galleriom.prototype.getWidth = function( el ) {
        var w = el.offsetWidth;
        if ( w > 0 )  { return parseInt( w ); }
        return 0;
    };

    Galleriom.prototype.getHeight = function( el ) {
        var h = el.offsetHeight;
        if ( h > 0 ) { return parseInt( h ); }
        return 0;
    };

    Galleriom.prototype.getSizeNavBar = function( id ) {
        return document.getElementById( id ).offsetWidth;
    };

    Galleriom.prototype.getDeltaX = function( startX, momentX, position, width ) {
        if ( ! position || ! width ) {
            position = 0;
            width    = 0;

            return startX - momentX;
        }
        return ( startX - momentX + ( position * width ) );
    };

    Galleriom.prototype.getMaxMove = function( width, quantity, treshold, percentage ) {
        return ( width * quantity + ( treshold * percentage ) );
    };

    Galleriom.prototype.getMinMove = function( treshold, percentage ) {
        return ( treshold * percentage * ( -1 ) );
    };

    Galleriom.prototype.getNavArea = function( divider, treshold ) {
        return ( divider - treshold );
    };

    Galleriom.prototype.getPointerDistance = function( treshold, dist ) {
        return ( treshold / dist );
    };


    /**
     * SETTER METHODS
     *
     * Setting properties needed for proper application working
     */

    Galleriom.prototype.setAppFrame = function() {
        if ( this.appbox.hasAttribute( 'data-width' ) ) this.appbox.getAttribute( 'data-width' );
        if ( this.appbox.hasAttribute( 'data-height' ) ) this.appbox.getAttribute( 'data-height' );

        // Set the user provided dimensions
        this.grabber( this.appbox );

        // Get all needed dimensions
        this.dimensions.w = this.getWidth( this.appbox );
        this.dimensions.h = this.getHeight( this.appbox );
    };

    Galleriom.prototype.setWidth = function( el, widthOffset ) {
        if ( typeof widthOffset === 'undefined' ) { widthOffset = 0; }

        if ( widthOffset === 0 ) { el.style.width = 'auto'; }
        else { el.style.width = widthOffset + this.tools.metrics.w; }
    };

    Galleriom.prototype.setHeight = function( el, heightOffset ) {
        if ( typeof heightOffset === 'undefined' ) { heightOffset = 0; }

        if ( heightOffset === 0 ) { el.style.height = 'auto' }
        else { el.style.height = heightOffset + this.tools.metrics.h; }
    };

    Galleriom.prototype.setClassAttr = function( el, className ) {
        el.className = className;
    };

    Galleriom.prototype.setTreshold = function( w ) {
        this.swipe.treshold = ( ( w - this.getSizeNavBar('galleriom-left-nav') + this.getSizeNavBar('galleriom-right-nav') ) / 2 );
    };

    Galleriom.prototype.setLeftRect = function( el ) {
        this.swipe.left = el.getBoundingClientRect().left;
    };

    Galleriom.prototype.setScreenDivider = function( w ) {
        this.swipe.divider = this.swipe.left + ( w / 2 );
    };


    /**
     * MAIN SETUP METHODS
     *
     * Adjusting dimensions of images, creating and adjusting view block, deploying navigation and thumbs.
     * View block serves as a window to watch and operate.
     * Setting for showing thumbs are required at installation proccess. If thumbs view is not defined, application will render dots as thumbs navigation.
     */

    Galleriom.prototype.createImages = function( sizes ) {
        if ( typeof sizes === 'undefined' ) { sizes = 0; } // leave this for thumbnail creator
        var i = 0,
            length,
            image_el;

        this.galleryCollection = document.querySelectorAll( '#galleriom-jsgallery-app img' );
        length                 = this.galleryCollection.length;

        for ( ; i < length; ++i ) {
            image_el = this.galleryCollection[i];
            this.elAdjuster( image_el, sizes );
            this.setClassAttr( image_el, 'galleriom-img ' + this.gadget.imageFit );

            // Prevent click event if preview is selected stimulate other way
            if ( ! this.gadget.preview ) this.addListeners( 'click', image_el, function( evt ) { evt.preventDefault(); } );
            this.dimensions.quantity++;
        }
    };

    Galleriom.prototype.createView = function() {
        var tmp = this.appbox.children;

        this.appView       = document.createElement( 'div' );
        this.galleryHolder = document.createElement( 'div' );

        this.setAttributes( this.appView, { 'id': 'galleriom-viewbox', 'class': 'galleriom-viewbox', 'style': 'width: ' + this.dimensions.w + this.tools.metrics.w + ';' } );
        this.setAttributes( this.galleryHolder, { 'id': 'galleriom-holder', 'style': 'width: ' + ( this.dimensions.w * tmp.length ) + this.tools.metrics.w + ';' } );

        // Deploy settings for images
        this.createImages( this.dimensions );

        this.multipleAppend( this.galleryHolder, tmp );
        this.appView.appendChild( this.galleryHolder );
        this.appbox.appendChild( this.appView );
    };

    Galleriom.prototype.createNavigation = function() {
        var tmp = {};

        tmp.left  = document.createElement( 'div' );
        tmp.right = document.createElement( 'div' );
        tmp.left.appendChild( document.createElement( 'i' ) );
        tmp.right.appendChild( document.createElement( 'i' ) );

        if (!this.tools.IE) {
            this.setAttributes( tmp.left, { 'id': 'galleriom-left-nav', 'class': 'galleriom-gallery-nav left-nav disabled' } );
            this.setAttributes( tmp.right, { 'id': 'galleriom-right-nav', 'class': 'galleriom-gallery-nav right-nav' } );
        } else {
            // add different classes for IE10 <
            this.setAttributes( tmp.left, { 'id': 'galleriom-left-nav', 'class': 'galleriom-gallery-nav-ie left-nav-ie disabled' } );
            this.setAttributes( tmp.right, { 'id': 'galleriom-right-nav', 'class': 'galleriom-gallery-nav-ie right-nav-ie' } );
        }

        // Cache navigation buttons
        this.leftNav  = tmp.left;
        this.rightNav = tmp.right;

        // Drop navigation buttons in canvas
        this.appbox.children[0].appendChild( this.leftNav );
        this.appbox.children[0].appendChild( this.rightNav );

        // Check if there is only one image, to hide navigation
        this.recalcPosition( this.tools.iClick );
    };

    Galleriom.prototype.createThumbsView = function() {
        var that,
            thumbsHolder,
            thumb;

        that         = this;
        thumbsHolder = document.createElement( 'div' );

        if ( this.tools.IE ) { thumbsHolder.className = 'galleriom-thumbs-view-ie'; }
        else { thumbsHolder.className = 'galleriom-thumbs-view'; }

        // Check if there thumbs are enabled
        if ( this.gadget.thumbsView ) {
            var elems = this.galleryHolder.children;

            // Setup every thumb accordingly on it's properties
            for ( var value in elems ) {
                if ( elems.hasOwnProperty( value ) && ! isNaN( parseInt( value ) ) ) {
                    var link,
                        image;

                    image = document.createElement( 'img' );
                    thumb = document.createElement( 'div' );

                    // Grab path to smaller images
                    if ( elems[value].nodeName === 'A' ) { link = elems[value].getAttribute( 'href' ); }

                    // User didn't provide smaller images, so grab path of gallery images
                    else { link = this.galleryCollection[parseInt(value)].getAttribute( 'src' ); }

                    this.setAttributes( image, { 'src': link, 'alt': 'Thumb-no.' + value, 'data-no': value } );
                    // Add first thumb class selected-thumb
                    if ( elems[value] === elems[0] ) { image.className = 'selected-thumb'; }
                }

                this.addListeners( 'click', thumb, function( evt ) { that.thumbsToView( evt ); } );

                thumb.className = 'galleriom-thumbs';
                thumb.appendChild( image );
                thumbsHolder.appendChild( thumb );
            }
        } else {
            for ( var i = 0, n = this.dimensions.quantity + 1; i < n; ++i ) {
                thumb = document.createElement( 'div' );
                // Add first thumb class selected-thumb
                if ( i === 0 ) { this.setAttributes( thumb, { 'class': 'galleriom-thumbs-dotts selected-thumb', 'data-no': i } ); }
                else { this.setAttributes( thumb, { 'class': 'galleriom-thumbs-dotts', 'data-no': i } ); }
                this.addListeners( 'click', thumb, function( evt ) { that.thumbsToView( evt ); } );
                thumbsHolder.appendChild( thumb );
            }
        }

        this.appbox.appendChild( thumbsHolder );
        // Reset app frame to auto
        // refactor this in some propriet way
        this.appbox.style.height = 'auto';
    };


    /**
     * ANIMATION METHODS
     *
     * Logic for navigating through images and thumbs, animation logic and progress, logic for detecting on which
     */

    Galleriom.prototype.moveLeft = function() {
        this.tools.iClick--;

        this.recalcPosition(this.tools.iClick);
    };

    Galleriom.prototype.moveRight = function() {
        this.tools.iClick++;

        this.recalcPosition(this.tools.iClick);
    };

    Galleriom.prototype.thumbsToView = function( evt ) {
        var position;

        position = +evt.target.dataset['no'];

        this.recalcPosition( position );
    };

    Galleriom.prototype.swipeTouchStart = function( evt ) {
        evt.preventDefault();

        this.swipe.startX = evt.changedTouches[0].pageX;
    };

    Galleriom.prototype.swipeTouchMove = function( evt ) {
        evt.preventDefault();

        var el,
            touchobj,
            deltaX,
            maxMove, minMove;

        el       = this.galleryHolder;
        touchobj = evt.changedTouches[0];
        deltaX   = this.getDeltaX(this.swipe.startX, touchobj.pageX, this.tools.iClick, this.dimensions.w);
        maxMove  = this.getMaxMove(this.dimensions.w, this.dimensions.quantity, this.swipe.treshold, 0.5);
        minMove  = this.getMinMove(this.swipe.treshold, 0.5);

        if ( deltaX > minMove && deltaX < maxMove ) {
            el.style.transition = 'none';
            el.style.marginLeft = ( deltaX ) * ( -1 ) + 'px';
        }
    };

    Galleriom.prototype.swipeTouchEnd = function( evt ) {
        evt.preventDefault();

        var touchobj,
            deltaX,
            navArea,
            touchDist;

        touchobj  = evt.changedTouches[0];
        deltaX    = this.getDeltaX( this.swipe.startX, touchobj.pageX );
        navArea   = this.getNavArea( this.swipe.divider, this.swipe.treshold );
        touchDist = this.getPointerDistance( this.swipe.treshold, 2 );

        if ( ! deltaX ) { return false; }

        this.recalcPosition( this.tools.iClick );
        this.positionControl( deltaX, touchDist, touchobj.pageX, navArea );
    };

    Galleriom.prototype.swipeMouseStart = function( evt ) {
        evt.preventDefault();

        this.swipe.startX = evt.pageX;
        if ( evt.which === 1 ) { this.swipe.lmb = true; }
    };

    Galleriom.prototype.swipeMouseMove = function( evt ) {
        evt.preventDefault();

        var el,
            deltaX,
            maxMove, minMove;

        el      = this.galleryHolder;
        deltaX  = this.getDeltaX(this.swipe.startX, evt.pageX, this.tools.iClick, this.dimensions.w);
        maxMove = this.getMaxMove(this.dimensions.w, this.dimensions.quantity, this.swipe.treshold, 0.5);
        minMove = this.getMinMove(this.swipe.treshold, 0.5);

        if ( evt.which === 1 && this.swipe.lmb ) {
            el.style.transition = 'none';
            if ( deltaX > minMove && deltaX < maxMove ) { el.style.marginLeft = ( deltaX ) * ( -1 ) + 'px'; }
        }
    };

    Galleriom.prototype.swipeMouseEnd = function( evt ) {
        evt.preventDefault();

        var deltaX,
            navArea,
            mouseDist;

        deltaX          = this.getDeltaX( this.swipe.startX, evt.pageX );
        navArea         = this.getNavArea( this.swipe.divider, this.swipe.treshold );
        mouseDist       = this.getPointerDistance(this.swipe.treshold, 2 );
        this.swipe.lmb  = false;

        if ( ! deltaX ) { return false; }

        this.recalcPosition( this.tools.iClick );
        this.positionControl( deltaX, mouseDist, evt.pageX, navArea );
    };

    Galleriom.prototype.positionControl = function( deltaX, evtDist, positionX, navArea ) {
        if ( ! this.tools.iClick && this.tools.iClick === this.dimensions.quantity ) {
            // no move!
        } else if ( ! this.tools.iClick ) {
            if ( deltaX >= evtDist && positionX > navArea && positionX <= this.swipe.divider ) { this.moveRight(); }
        } else if ( this.tools.iClick == this.dimensions.quantity ) {
            if ( deltaX < evtDist && positionX >= navArea && positionX > this.swipe.divider ) { this.moveLeft(); }
        } else {
            if ( deltaX < evtDist && positionX >= navArea && positionX > this.swipe.divider ) { this.moveLeft(); }
            else { this.moveRight(); }
        }
    };

    Galleriom.prototype.recalcPosition = function(position) {
        if (position === 0 && position === this.dimensions.quantity) {
            // IE also has to be blocked :-D
            if (!this.tools.IE) {
                this.leftNav.className = 'galleriom-gallery-nav left-nav disabled';
                this.rightNav.className = 'galleriom-gallery-nav right-nav disabled';
            } else {
                this.leftNav.className = 'galleriom-gallery-nav-ie left-nav-ie disabled';
                this.rightNav.className = 'galleriom-gallery-nav-ie right-nav-ie disabled';
            }
        } else if (position == 0) {
            this.tools.iClick = 0;
            if (!this.tools.IE) { this.leftNav.className = 'galleriom-gallery-nav left-nav disabled'; }
            else { this.leftNav.className = 'galleriom-gallery-nav-ie left-nav-ie disabled'; }
            if (!this.tools.IE) { this.rightNav.className = 'galleriom-gallery-nav right-nav'; }
            else { this.rightNav.className = 'galleriom-gallery-nav-ie right-nav-ie'; }
        } else if (position === this.dimensions.quantity) {
            this.tools.iClick = this.dimensions.quantity;
            if (!this.tools.IE) { this.rightNav.className = 'galleriom-gallery-nav right-nav disabled'; }
            else { this.rightNav.className = 'galleriom-gallery-nav-ie right-nav-ie disabled'; }
            if (!this.tools.IE) { this.leftNav.className = 'galleriom-gallery-nav left-nav'; }
            else { this.leftNav.className = 'galleriom-gallery-nav-ie left-nav-ie'; }
        } else {
            this.tools.iClick = position;
            if (!this.tools.IE) { this.leftNav.className = 'galleriom-gallery-nav left-nav'; }
            else { this.leftNav.className = 'galleriom-gallery-nav-ie left-nav-ie'; }
            if (!this.tools.IE) { this.rightNav.className = 'galleriom-gallery-nav right-nav'; }
            else { this.rightNav.className = 'galleriom-gallery-nav-ie right-nav-ie'; }
        }

        this.displayImage( position );
        this.markThumb( position );
    };

    Galleriom.prototype.displayImage = function( position ) {
        this.galleryHolder.style.WebkitTransition = 'margin-left .4s ease';
        this.galleryHolder.style.transition = 'margin-left .4s ease';
        this.galleryHolder.style.marginLeft = ( this.dimensions.w * ( -1 ) * position ) + 'px';
    };

    Galleriom.prototype.markThumb = function( position ) {
        var markedEl = document.querySelector( '.selected-thumb' ),
            elToMark;

        if ( this.gadget.thumbsView ) {
            elToMark = document.querySelectorAll( '.galleriom-thumbs-view img' );
        }
        else {
            elToMark = document.querySelectorAll( '.galleriom-thumbs-dotts' );
        }

        // Remove class from previous thumb
        if ( markedEl ) { markedEl.classList.remove( 'selected-thumb' ); }

        // Add class to clicked thumb
        if ( elToMark[position] ) { elToMark[position].classList.add( 'selected-thumb' ); }
    };


    /**
     * HELPER METHODS
     */

    Galleriom.prototype.grabber = function( el ) {
        var attrs;

        attrs = el.attributes;

        // Available: width, height, thumbs, caption, preview, auto-scroller
        if ( attrs['data-width'] ) {
            if ( attrs['data-width'].value.indexOf( '%' ) >= 0 ) { el.style.width = attrs['data-width'].value; }
            else { el.style.width = parseInt( attrs['data-width'].value ) + 'px'; }
        }
        if ( attrs['data-height'] ) {
            if ( attrs['data-height'].value.indexOf( '%' ) >= 0 ) { el.style.height = attrs['data-height'].value; }
            else { el.style.height = parseInt( attrs['data-height'].value ) + 'px'; }
        }
        if ( attrs['data-thumbs'] )  { this.gadget.thumbsView = ( attrs['data-thumbs'].value === 'true' ); }
        if ( attrs['data-fit'] )     { this.gadget.imageFit = attrs['data-fit'].value; }
        if ( attrs['data-caption'] ) { this.gadget.caption = ( attrs['data-caption'].value === 'true' ); }
        if ( attrs['data-preview'] ) { this.gadget.preview = ( attrs['data-preview'].value === 'true' ); }
    };

    Galleriom.prototype.elAdjuster = function( el, size ) {
        this.setWidth( el, size.w );
        this.setHeight( el, size.h );
    };

    Galleriom.prototype.setAttributes = function( el, attrs ) {
        for ( var property in attrs ) {
            el.setAttribute( property, attrs[property] );
        }
    };

    Galleriom.prototype.multipleAppend = function( el, collection ) {
        for ( var i = 0, n = collection.length; i < n; ++i ) {
            el.appendChild( collection[0] );
        }
    };

    Galleriom.prototype.addListeners = function( evnt, el, func ) {
        if ( el.addEventListener ) {
            el.addEventListener( evnt, func, false );
        } else if ( el.attachEvent ) {
            el.attachEvent( 'on'+evnt, func );
        }
    };

    Galleriom.prototype.detectIEBrowser = function() {
        var el = document.createElement( 'div' );

        el.innerHTML = '<!--[if lte IE9]> <i></i> <![endif]-->';

        if ( el.getElementsByTagName( 'i' )[0] ) {
            this.tools.IE = true;
        }
    };

    Galleriom.prototype.detectImages = function( el ) {
        if ( ! el.length ) { throw new Error( 'Missing images' ); }
    };


    // Constructor call
    gallery = function( galleryDOM ) {
        return new Galleriom( galleryDOM );
    };

    global.galleriom = gallery( galleryDOM );

    /**
     * Start the application
     *
     * Starting application after all DOM is loaded, to ensure proper working environment.
     * Application will self execute after DOM is loaded.
     */
    global.galleriom.startApp(global);

} )( window, document.getElementById( 'galleriom-jsgallery-app' ) );
