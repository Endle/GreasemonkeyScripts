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
    hasCreatedMainDiv   : false,
    submitForm : function(e) {
        alert("B");
        return false;
    },
    start: function() {
        /*
        if(hasCreatedMainDiv)
            return hasCreatedMainDiv;
        hasCreatedMainDiv = true;
        */

        var mainDiv = document.createElement("div");
        mainDiv.setAttribute("id", "mtgCarManager");

        shopAmount = 3;
        /*alert("to go");*/
        var createForm = function(shop) {
            var form = document.createElement("form");
            form.setAttribute("id", "mtgCarInputArea");

            for (var i=0; i<shop; i++) {
                var inp = document.createElement("input");
                inp.type="text";
                inp.setAttribute("id", "mtgCarShopLink"+String(i));
                inp.setAttribute("type", "text");
                form.appendChild(inp);
            }

            /*var p = document.createElement("p");*/
            /*p.text = "输入单卡名称";*/
            form.appendChild( document.createElement("br") );
            form.appendChild( document.createTextNode("输入单卡名称") );
            form.appendChild( document.createElement("br") );

            var btn = document.createElement("button");
            btn.appendChild( document.createTextNode("Search") );
            btn.id = "mtgSubmitButton";
            btn.type = "button";
            btn.onclick=function(e) {alert("click");submitForm(e);return false;}
            btn.onsubmit=function(e) {alert("submit");return false;}
            /*form.onsubmit=function(e) {alert("submit");return false;}*/
            /*btn.onclick=submitForm;*/
            form.appendChild(btn);
            return form;
        }

        mainDiv.appendChild(createForm(shopAmount));
        $(".J_Cover").append(mainDiv);
        /*alert("Finished init");*/
        /*$(".J_Cover").append(*/
    },
};
var MTG_BUYER = Object.create(MTG_BUYER_CLASS);

document.addEventListener('keydown', function(e) {
    if (e.keyCode == 77 /* m */
        && e.ctrlKey && e.altKey) {
            MTG_BUYER.start();
        }
    return false;
})

