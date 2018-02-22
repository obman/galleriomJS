=== Plugin Name ===

Contributors: xaxill
Plugin Name: GalleriomJS
Plugin URI: https://obman.github.io/galleriomJS/
Tags: gallery, photo-gallery, wordpress-gallery-plugin, GalleriomJS-Gallery
Author URI: https://udm-studio.si
Author: xaxill
Donate link: https://www.paypal.me/xaxill
Requires at least: 3.8
Tested up to: 4.9.4
Stable tag: 4.9.4
Version: 1.0

== Description ==

GalleriomJS lets you create a beautiful gallery slideshow. It's goal is to be used similar to default WP gallery - via WYSIWYG editor. Built in pure JS(ES6), CSS3 and HTML. It is dependency free, so no additional files are loaded or added.
GalleriomJS won't override default WP gallery shortcode but instead it acts as a wrapper for images.

**BASIC OPTIONS**
Gallery is created with shortcode [galleriom][/galleriom].

* **SETTING WIDTH AND HEIGHT**
If you wish to use defined width and height for gallery, you can just include dimensions in shortcode.
Example: [galleriom width="400" height="400"][/galleriom]

Or you can use responsive values.
Example: [galleriom width="100%" height="100%"][/galleriom]

By the default settings width is set to 100% and height is set to 400px.

* **ENABLING OR DISABLING THUMBNAILS**
Thumbs can be toggled. Default value is ENABLED, but you can easily disabled.
Example thumbs ON: [galleriom thumbs="true"][/galleriom]
Example thumbs OFF: [galleriom thumbs="false"][/galleriom]

* **IMAGE FIT**
Default value is COVER, but you can choose within 5 options:
*   contain
*   cover
*   fill
*   scale-down
*   none


== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress