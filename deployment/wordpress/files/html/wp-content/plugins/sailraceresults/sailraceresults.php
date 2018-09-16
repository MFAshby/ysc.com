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
function srres_shortcode($atts = [], $content = null, $tag = '')
{
    wp_enqueue_script('srres_results');
    return '<div id="root"></div>';
}
 
function srres_shortcodes_init()
{
    add_shortcode('sailraceresults', 'srres_shortcode');
}

add_action('init', 'srres_shortcodes_init');
wp_register_script('srres_results', plugins_url('/app/index.js', __FILE__ ));

?>
