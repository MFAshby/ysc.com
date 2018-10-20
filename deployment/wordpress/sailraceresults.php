<?php
/**
 * @package Hello_Dolly
 * @version 1.7
 */
/*
Plugin Name: Sail Race Results
Plugin URI: https://github.com/MFAshby/ysc.com
Description: Shows sailing race results
Author: Martin Ashby
Version: 1
Author URI: https://mfashby.net
*/
function srres_shortcode_results($atts = [], $content = null, $tag = '')
{
    wp_enqueue_script('srres_results');
    return '<div id="root"></div>';
}

function srres_shortcode_input($atts = [], $content = null, $tag = '')
{
    wp_enqueue_script('srres_input');
    return '<div id="root"></div>';
}

function srres_shortcode_series($atts = [], $content = null, $tag = '')
{
    wp_enqueue_script('srres_series');
    return '<div id="root"></div>';
}
 
function srres_shortcodes_init()
{
    add_shortcode('sailraceresults', 'srres_shortcode_results');
    add_shortcode('sailraceinput', 'srres_shortcode_input');
    add_shortcode('sailraceseries', 'srres_shortcode_series');
}

add_action('init', 'srres_shortcodes_init');
wp_register_script('srres_results', plugins_url('/results/index.js', __FILE__ ));
wp_register_script('srres_input', plugins_url('/input/index.js', __FILE__ ));
wp_register_script('srres_series', plugins_url('/series/index.js', __FILE__ ));

?>
