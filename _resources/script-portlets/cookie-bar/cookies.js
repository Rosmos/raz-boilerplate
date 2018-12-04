/*global request, require */
/*eslint no-unused-vars:0*/

var cookiesDismissed = false;

(function () {

    'use strict';

    var editmode = !(require('VersionUtil').getCurrentVersion()),
        cookies  = request.getCookies(),
        i;
    if (editmode) {
        cookiesDismissed = true;
        return;
    }

    if (cookies && cookies.length > 0) {
        for (i = 0; i < cookies.length; i += 1) {
            if (cookies[i].getName() === 'bvCookiesCookie' &&
                cookies[i].getValue() === 'dismissed') {
                cookiesDismissed = true;
                break;
            }
        }
    }

}());
