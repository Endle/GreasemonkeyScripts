// ==UserScript==
// @name        淘宝发车器
// @namespace   https://github.com/Endle/GreasemonkeyScripts
// @description 方便地在淘宝批量买牌
// @include     http*://*.taobao.com/*
// @version     1
// @grant       none
// @require     https://upcdn.b0.upaiyun.com/libs/jquery/jquery-2.0.3.min.js
// ==/UserScript==

var MTG_BUYER_CLASS = {
    start: function() {
        $(".J_Cover").append(
            [
             '<div id="mtgCarManager">',
             '<form>',
             '<input type="text" id="myNumber1" value="">',
             '<input type="text" id="myNumber2" value="">',
             '<p id="myNumberSum">&nbsp;</p>',
             '<button id="gmAddNumsBtn" type="button">Add the two numbers</button>',
             '<button id="gmCloseDlgBtn" type="button">Close popup</button>',
             '</form>',
             '</div>'
            ].join('\n')
                             );
    }
};
var MTG_BUYER = Object.create(MTG_BUYER_CLASS);

document.addEventListener('keydown', function(e) {
    if (e.keyCode == 77 /* m */
        && e.ctrlKey && e.altKey) {
            MTG_BUYER.start();
        }
    return false;
})

