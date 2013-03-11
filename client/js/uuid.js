"use strict";
/*!
* JavaScript UUID Generator, v0.0.1
*
* Copyright (c) 2009 Massimo Lombardo.
* Dual licensed under the MIT and the GNU GPL licenses.
*/
function UUID() {
    var uuid = (function () {
        var i,
            c = "89ab",
            u = [];

        for (i = 0; i < 36; i += 1) {
            u[i] = (Math.random() * 16 | 0).toString(16);
        }

        u[8] = u[13] = u[18] = u[23] = "-";
        u[14] = "4";
        u[19] = c.charAt(Math.random() * 4 | 0);
        return u.join("");
    })();

    return {
        toString: function () {
            return uuid;
        },
        valueOf: function () {
            return uuid;
        }
    };
}

function uid() {
    var result='';
    
    for(var i=0; i<32; i++)
        result += Math.floor(Math.random()*16).toString(16).toUpperCase();

    return result;
}