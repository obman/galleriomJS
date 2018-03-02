=== GalleriomJS WP Gallery ===
Contributors: xaxill
Donate link: https://www.paypal.me/xaxill
Tags: gallery, photo-gallery, wordpress-gallery-plugin, GalleriomJS-Gallery
Requires at least: 4.0
Tested up to: 4.8
Stable tag: 0.1
Requires PHP: 5.4
License: GPLv2
License URI: https://www.gnu.org/licenses/gpl-2.0.html

GalleriomJS lets you create a beautiful gallery slideshow. It's goal is to be used similar to default WP gallery - via WYSIWYG editor. Built in pure JS(ES6), CSS3 and HTML. It is dependency free, so no additional files are loaded or added.
GalleriomJS won't override default WP gallery shortcode but instead it acts as a wrapper for images.

== Description ==

GalleriomJS lets you create a beautiful gallery slideshow. It's goal is to be used similar to default WP gallery - via WYSIWYG editor. Built in pure JS(ES6), CSS3 and HTML. It is dependency free, so no additional files are loaded or added.
GalleriomJS won't override default WP gallery shortcode but instead it acts as a wrapper for images.

**BASIC OPTIONS**

Gallery is created with shortcode:
>`[galleriom][/galleriom]`.

**1. RESPONSIVE GALLERY**

This is default version.
Example:
> `[galleriom width="100%" height="100%"][/galleriom]`

**SETTING FIXED WIDTH AND HEIGHT**

If you wish to use defined width and height for gallery, you can just include dimensions in shortcode.
Example:
> `[galleriom width="400" height="400"][/galleriom]`

By the default settings width is set to 100% and height is set to 400px.

**ENABLING OR DISABLING THUMBNAILS**

Thumbs can be toggled. Default value is ENABLED, but you can easily disabled.
Example thumbs ON:
> `[galleriom thumbs="true"][/galleriom]`

Example thumbs OFF:
> `[galleriom thumbs="false"][/galleriom]`

**IMAGE FIT**

Default value is COVER, but you can choose within 5 options:
*   contain
*   cover
*   fill
*   scale-down
*   none

Example:
> [galleriom width="100%" height="400" **fit="contain"**][/galleriom]`

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Place shortcode in editor or use do_shortcode() function in template file.

== Frequently Asked Questions ==

= Does this plugin override default WP gallery shortcode? =

No, and can't be used in combination with default WP gallery shortcode.

= Where is gallery settings page? =

At this time all gallery settings are regulated via shortcode.

== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from
the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets
directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png`
(or jpg, jpeg, gif).
2. Gallery with thumbs off

== Changelog ==

= 0.1 =
* List versions from most recent at top to oldest at bottom.