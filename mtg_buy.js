// ==UserScript==
// @name        淘宝发车器
// @namespace   https://github.com/Endle/GreasemonkeyScripts
// @description 方便地在淘宝批量买牌
// @include     http*://*.taobao.com/*
// @version     1
// @grant       none
// ==/UserScript==

var MTG_BUYER_CLASS = {
    start: function() {
        /*alert("Let's go!");*/
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

