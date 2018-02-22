<?php
/**
 * Plugin Name: GalleriomJS Gallery
 * Description: This plugin will load beautiful gallery with own shortcode and fast and optimized code.
 * Depends: Wordpress
 * Version: 1.0
 * Author: xaxill
 * Author URI: https://udm-studio.si/
 * License: GPL2
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

define( 'GALLERIOM_JS_GALLERY_VERSION', '1.0' );
define( 'GALLERIOM_JS_GALLERY_DIR', plugin_dir_path(__FILE__) );
define( 'GALLERIOM_JS_GALLERY_URL', plugin_dir_url(__FILE__) );

// INSTALL THE PLUGIN
// LOAD THE PLUGIN
register_activation_hook( __FILE__,'galleriomjs_wp_gallery_activation' );
register_deactivation_hook( __FILE__, 'galleriomjs_wp_gallery_deactivation' );
register_uninstall_hook( __FILE__, 'galleriomjs_wp_gallery_uninstall' );

function galleriomjs_wp_gallery_activation() {}

function galleriomjs_wp_gallery_deactivation() {
    flush_rewrite_rules();
}

// SHORTCODES
function galleriomjs_deploy_gallery( $atts, $content = NULL ) {
    $galleriom_array = array(
        'width'  => '100%',
        'height' => 400,
        'thumbs' => false,
        'fit'    => 'cover'
    );
    $galleriom_html = NULL;
    $galleriom_atts = shortcode_atts( $galleriom_array, $atts );

    $galleriom_html = '<div id="galleriom-jsgallery-app" data-wp="true" data-width="' . $galleriom_atts['width'] . '" data-height="' . $galleriom_atts['height'] . '" data-thumbs="' . $galleriom_atts['thumbs'] . '" data-fit="' . $galleriom_atts['fit'] .'">';
    $galleriom_html .= $content;
    $galleriom_html .= '</div>';

    return $galleriom_html;
}
add_shortcode( 'galleriom', 'galleriomjs_deploy_gallery' );

function galleriomjs_load_assets() {
    if ( ! is_admin() ) {
        wp_register_style( 'galleriomjs-gallery-style', plugin_dir_url( __FILE__ ) . 'galleriom.min.css', false, 'all' );
        wp_register_script( 'galleriomjs-gallery-script', plugin_dir_url( __FILE__ ) . 'galleriom.min.js', false, '1.0', true );

        wp_enqueue_style( 'galleriomjs-gallery-style' );
        wp_enqueue_script( 'galleriomjs-gallery-script' );
    }
}
add_action( 'wp_enqueue_scripts', 'galleriomjs_load_assets' );