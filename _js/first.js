// ==|== Global Namespace Variables =============================================================

/* Site script global namespace. Page or component specific code should be placed under this namespace. */

var AF  = AF || {},
    // Toolbox Library
    _af = _af || {};

// ==|== Throttle function ======================================================================
// https://remysharp.com/2010/07/21/throttling-function-calls

_af.throttle = function (fn, threshhold, scope) {

    'use strict';

    var last,
        deferTimer;

    threshhold || (threshhold = 250);

    return function () {
        var context = scope || this,
            now     = new Date().getTime(),
            args    = arguments;
        if (last && now < last + threshhold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
            }, threshhold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };

};

// ==|== Once function ======================================================================
// https://davidwalsh.name/javascript-once

_af.once = function (fn, context) {
    'use strict';
    var result;
    return function () {
        if (fn) {
            result = fn.apply(context || this, arguments);
            fn = null;
        }
        return result;
    };
};

// ==|== Simple JavaScript Templating ===========================================================
// John Resig – http://ejohn.org/ – MIT Licensed
/* eslint-disable */
(function () {
    var cache = {};
    _af.template = function tmpl(str, data) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str)
                 ? cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML)
                 :
            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
                 new Function('obj', 'var p=[],print=function(){p.push.apply(p,arguments);};' +
                                     // Introduce the data as local variables using with(){}
                                     'with(obj){p.push(\'' +
                                     // Convert the template into pure JavaScript

                                     str.replace(/[\r\t\n]/g, ' ').split('<%').join('\t')
                                        .replace(/((^|%>)[^\t]*)'/g, '$1\r')
                                        .replace(/\t=(.*?)%>/g, '\',$1,\'').split('\t').join('\');')
                                        .split('%>').join('p.push(\'').split('\r').join('\\\'') +
                                     '\');}return p.join(\'\');');
        // Provide some basic currying to the user
        return data
               ? fn(data)
               : fn;
    };
}());
/* eslint-enable */

// ==|== Async JS loader ========================================================================

(function (doc, s) {

    'use strict';

    _af.load = {
        /**
         * Load JavaScript file async by adding script tag to DOM.
         * May be used for own scripts or external scripts.
         * (script) _af.load.js( 'some-js-file.js' ) (/script)
         * // => Loads and executes some-js-file.js
         */
        js : function (src) {
            var script   = doc.createElement(s),
                beforeEl = doc.getElementsByTagName(s)[0];
            script.src = src;
            beforeEl.parentNode.insertBefore(script, beforeEl);
            return script;
        },
        css: function (href) {
            var link = doc.createElement('link');
            link.href = href;
            link.rel = 'stylesheet';
            link.media = 'all';
            document.head.appendChild(link);
        }
    };

}(document, 'script'));

// ==|== LocalStorage Detection =================================================================

(function (win) {

    'use strict';

    _af.localStorage = (function () {

        var uid = new Date().toString(),
            result;

        try {
            win.localStorage.setItem(uid, uid);
            result = win.localStorage.getItem(uid) === uid;
            win.localStorage.removeItem(uid);
            return result && win.localStorage;
        } catch (exception) {}

    }());

    _af.sessionStorage = _af.localStorage
                         ? win.sessionStorage
                         : false;

}(window));

// ==|== Misc Toolbox Functions =================================================================

(function ($) {

    'use strict';

    [
        'Arguments',
        'Array',
        'Function',
        'String',
        'Number',
        'Date',
        'RegExp'
    ].forEach(function (name) {
        _af['is' + name] = function (obj) {
            return Object.prototype.toString.call(obj) === '[object ' + name + ']';
        };
    });

    // Test for integer
    _af.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };

    // Test for float
    _af.isFloat = function (n) {
        return n === Number(n) && n % 1 !== 0;
    };

    function isObject(o) {
        return o !== null && typeof o === 'object' && !Array.isArray(o);
    }

    function isObjectObject(o) {
        return isObject(o) === true && Object.prototype.toString.call(o) === '[object Object]';
    }

    _af.isPlainObject = function (o) {

        var ctor,
            prot;

        if (isObjectObject(o) === false) {
            return false;
        }

        // If has modified constructor
        ctor = o.constructor;
        if (typeof ctor !== 'function') {
            return false;
        }

        // If has modified prototype
        prot = ctor.prototype;
        if (isObjectObject(prot) === false) {
            return false;
        }

        // If constructor does not have an Object-specific method
        if (prot.hasOwnProperty('isPrototypeOf') === false) {
            return false;
        }

        // Most likely a plain Object
        return true;
    };

    // ==|== Scrollable Element =================================================================

    _af.scrollableElement = (function (doc) {
        var docEl     = doc.documentElement,
            scrollTop = docEl.scrollTop,
            hasScrolled;
        docEl.scrollTop += 1;
        hasScrolled = (docEl.scrollTop === scrollTop + 1);
        docEl.scrollTop = scrollTop;
        if (hasScrolled) {
            return docEl;
        }
        return doc.body;
    }(document));

    _af.$scrollableElement = jQuery(_af.scrollableElement);

    // Usage:
    // _af.scrollTo( 100 );
    // _af.scrollTo( $( '.foo' ) );
    // _af.scrollTo( { position: 100, speed: 200, after: function () { /* ... */ } } );
    // _af.scrollTo( { position: $( '.foo' ), speed: 200, after: function () { /* ... */ } } );
    _af.scrollTo = function (options) {
        if (_af.isNumber(options)) {
            options = {
                position: options
            };
        }
        if ($.isjQueryObject(options)) {
            options = {
                position: options
            };
        }
        if ($.isjQueryObject(options.position)) {
            options.position = options.position.offset().top;
        }
        $.extend({
                     position: 0,
                     speed   : 300,
                     after   : function () {}
                 }, (options || {}));
        _af.$scrollableElement.animate({
                                           scrollTop: options.position
                                       }, options.speed, options.after);
    };

}(jQuery));

// ==|== Check for edit mode ====================================================================

(function ($) {

    'use strict';

    $(function () {
        _af.isEditMode = (function () {
            var $docEl = $(document.documentElement),
                $body  = $(document.body);
            return ($docEl.hasClass('sv-edit-mode') || $body.hasClass('sv-edit-mode') ||
                    $body.hasClass('sv-editing-mode') || $body.hasClass('sv-classic-edit-mode'));
        }());
    });

}(jQuery));

// ==|== Add to init and exec on DOMContentLoaded ===============================================

/**
 * Add functions or function names for functions to be executed on DOMContentLoaded.
 * Use inline in markup. Modules will tell the script which functions
 * need to be executed for the current page.
 * Pass as string to ensure function to only be executed once.
 *
 * <script> _af.init.push( 'M.fooBar' ) </script>
 * // => will execute M.foobar on DOMContentLoaded
 *
 * <script> _af.init.push( function () { alert( 'Hello' ) } ) </script>
 * // => will alert 'Hello' on DOMContentLoaded
 */

(function (win, doc, $, undefined) {

    'use strict';

    var functionsCalled = [];

    function getFunction(fn) {

        var parts           = fn.split('.'),
            currentFunction = window,
            i,
            l;

        for (i = 0, l = parts.length; i < l; i += 1) {
            if (!currentFunction[parts[i]]) {
                return undefined;
            } else {
                currentFunction = currentFunction[parts[i]];
            }
        }

        if (_af.isFunction(currentFunction)) {
            return currentFunction;
        }

        if (_af) {
            return 1;
        } else {
            return 2;
        }

    }

    function exec(f) {

        if (_af.isArray(f)) {
            f.forEach(exec);
            return;
        }

        if (_af.isString(f)) {
            if (functionsCalled.includes(f)) {
                return;
            }
            functionsCalled.push(f);
            f = getFunction(f);
        }

        if (_af.isFunction(f)) {
            f();
        }

    }

    $(function () {
        if (_af.init.length > 0) {
            _af.init.forEach(exec);
        }
    });

}(window, document, jQuery));
