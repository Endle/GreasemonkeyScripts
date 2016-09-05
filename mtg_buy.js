// ==UserScript==
// @name        淘宝发车器
// @namespace   https://github.com/Endle/GreasemonkeyScripts
// @description 方便地在淘宝批量买牌
// @include     http*://*.taobao.com/*
// @version     1
// @grant       none
// @require     https://upcdn.b0.upaiyun.com/libs/jquery/jquery-2.0.3.min.js
// ==/UserScript==

class MTG_BUYER_CLASS {
    constructor() {}
    /*
    submitForm(e) {
        alert("B");
        return false;
    }
    */

};
MTG_BUYER_CLASS.prototype.start = function() {
    this.submitForm = function(e) {alert("Stub here"); return false;}

    this.mainDiv = document.createElement("div");
    this.mainDiv.setAttribute("id", "mtgCarManager");

    this.shopAmount = 3;
    this.createForm = function(shop) {
        var form = document.createElement("form");
        form.setAttribute("id", "mtgCarInputArea");

        for (var i=0; i<shop; i++) {
            var inp = document.createElement("input");
            inp.type="text";
            inp.setAttribute("id", "mtgCarShopLink"+String(i));
            inp.setAttribute("type", "text");
            form.appendChild(inp);
        }

        form.appendChild( document.createElement("br") );
        form.appendChild( document.createTextNode("输入单卡名称") );
        form.appendChild( document.createElement("br") );

        var btn = document.createElement("button");
        btn.appendChild( document.createTextNode("Search") );
        btn.id = "mtgSubmitButton";
        btn.type = "button";
        btn.onclick=function(e) {alert("click");this.submitForm(e);return false;}
        form.appendChild(btn);
        return form;
    }

    this.mainDiv.appendChild(this.createForm(this.shopAmount));

    $(".J_Cover").append(this.mainDiv);
    return false;
}

/*var MTG_BUYER = Object.create(MTG_BUYER_CLASS);*/
var MTG_BUYER = new MTG_BUYER_CLASS();

document.addEventListener('keydown', function(e) {
    if (e.keyCode == 77 /* m */
        && e.ctrlKey && e.altKey) {
            MTG_BUYER.start();
        }
    return false;
})

