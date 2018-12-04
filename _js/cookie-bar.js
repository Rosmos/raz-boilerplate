/**
 * Cookies Bar by Henrik Ekelöf (ÅF Örebro)
 * ============================================
 *
 * Create Script portlet from _resources/script-portlets/cookies.js and .vm files.
 *
 */

( function ( doc, COOKIENAME, DAYS, DOMAIN ) {

    'use strict';

    COOKIENAME = COOKIENAME || 'bvCookiesCookie';
    DAYS       = DAYS || 365;

    function setCookie( name, value, options ) {
        var settings = [ name + '=' + value ];
        options      = options || {};
        if ( options.days ) {
            options.date = new Date();
            options.date.setTime( options.date.getTime() + 24 * 60 * 60 * 1000 * options.days );
            settings.push( 'expires=' + options.date.toUTCString() );
        }
        options.domain && settings.push( 'domain=' + options.domain );
        settings.push( 'path=' + ( options.path ? options.path : '/' ) );
        doc.cookie = settings.join( ';' );
    }

    function init() {
        var banner = doc.querySelector( '.afCookiesBar' );
        if ( banner ) {
            banner.addEventListener( 'click', function ( e ) {
                if ( e.target && e.target.nodeName === 'BUTTON' ) {
                    setCookie( COOKIENAME, 'dismissed', { days: DAYS, domain: DOMAIN } );
                }
            } );
            banner.parentNode.removeChild( banner );
        }
    }

    if ( doc.body ) {
        init();
    } else {
        doc.addEventListener( 'DOMContentLoaded', init );
    }


}( document ) );
