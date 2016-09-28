// ==UserScript==
// @name        淘宝发车器
// @namespace   https://github.com/Endle/GreasemonkeyScripts
// @description 方便地在淘宝批量买牌
// @include     http*://*.taobao.com/*
// @version     1
// @grant       none
// @require     https://upcdn.b0.upaiyun.com/libs/jquery/jquery-2.0.3.min.js
// @require     http://oe7yazmgc.bkt.clouddn.com/urlencode/bundle.js
// ==/UserScript==

var YYYYMMDD=new Date().toISOString().slice(0,new Date().toISOString().indexOf("T")).replace(/-/g,"");

/**
 * encode
    * 使用 npm 的 urlencode 包
    * browserify urlencode.js --s encode > bundle.js
    * 存储在七牛服务器上
 *
 * @param s
 * @returns {undefined}
 */

/**
 * jsRandomSleep
 *
 * @param baseTime
 * @returns {undefined}
 */
function jsRandomSleepCalc(baseTime) {
    return Math.round(Math.random() * baseTime * 2.0) + baseTime;
}

class MTG_BUYER_CLASS {
    constructor() {}
}
var MTG_BUYER = new MTG_BUYER_CLASS();

function shopLinkToShopDiv(link) {
    var i;
    for(i=0; i<MTG_BUYER.shopAmount; i++) {
        if (MTG_BUYER.shops[i] == link)
            return $("#mtgShopDiv" + String(i));
    }
    return undefined;
}
/**
 * writeItemToShopCanvas
    * 将单个商品的信息写入到其对应商店的 div 中
 *
 * @param {string} item - HTML 格式的商品信息
 * @param {string} shopLink
 * @returns {undefined}
 */
function writeItemToShopCanvas(item, shopLink) {
    var div = shopLinkToShopDiv(shopLink);
    div.html(div.html() + "<br /> (Stub in writeItemToShopCanvas) " + item + "from" + shopLink);
    return true;
}


function writeFrameToCanvas() {
    var createShopDiv = function (serial, width) {
        var d = document.createElement("div");
        d.id = "mtgShopDiv" + String(serial);
        d.innerHTML = "Loading " + MTG_BUYER.shops[serial];
        d.style.background="grey";
        d.style.border="1px solid black";
        return d;
    };
    for (var i=0; i < MTG_BUYER.shopAmount; i++) {
        $("#mtgResultCanvas").append(createShopDiv(i,100));
    }
}

var SINGLE_SEARCH_PARAMETER =
    {itemName: "Mox", shopLink: "https://shop101650459.taobao.com"};
/**
 * arrangeRquests
    * 进行若干次的 Promise 请求
 *
 * @returns {undefined}
 */
MTG_BUYER_CLASS.prototype.arrangeRquests = function() {
    /* 这一组 asyc 函数的参数是一个 Array
    *  第一个参数都是一个 SINGLE_SEARCH_PARAMETER 对象
    */
    function asycCreateIframe(req) {
        return new Promise(function(resolve, reject) {
            var sync_createIframe = function(url) {
                var ifr = document.createElement("iframe");
                ifr.width = "1000px";
                ifr.height = "400px";
                ifr.src = url;
                $("#mtgResultCanvas").append(ifr);
                return ifr;
            };
            var ifr = sync_createIframe(req.shopLink);
            var passData = new Array();
            passData[0] = req;
            passData[1] = ifr;
            resolve(passData);
        });
    }
    function asycFillWebForm(receive) {
        return new Promise(function(resolve, reject) {
            var req = receive[0];
            var ifr = receive[1];

            /*var box = ifr.contentWindow.document.getElementByClassName("search-box");*/

            /*var stubhtml = ifr.contentWindow.document.innerHTML;*/
            var doc = ifr.contentWindow.document;
            var box = doc.getElementById("J_SearchTab");
            var stubhtml = String(box);
            var passData = new Array();
            passData[0] = req;
            passData[1] = stubhtml;
            resolve(passData);
        });
    }
    function asycResolveWebDate(data) {
        return new Promise(function(resolve, reject) {
            resolve(data);
        });
    }
    function writeResult(data) {
        writeItemToShopCanvas(data[1], data[0].shopLink);
    }
    writeFrameToCanvas();
    for (var i=0; i<this.shopAmount; i++)
    for (var j=0; j<this.cardAmount; j++) {
        var req = Object.create(SINGLE_SEARCH_PARAMETER);
        req.itemName = this.cards[j];
        req.shopLink = this.shops[i];
        Promise.resolve(req)
            .then(asycCreateIframe)
            .then(asycFillWebForm)
            .then(asycResolveWebDate)
            .then(writeResult);
    }
    alert("finished request");
};

MTG_BUYER_CLASS.prototype.submitForm = function(e) {
    this.shops = new Array(this.shopAmount);
    this.cards = new Array(this.cardAmount);

    var i;
    for (i=0; i<this.shopAmount; i++) {this.shops[i] = $("#mtgCarShopLink"+String(i)).val();}
    for (i=0; i<this.cardAmount; i++) {this.cards[i] = $("#mtgCarCardName"+String(i)).val();}
    //FIXME: Used for test
    this.shops[0] = "https://shop62237807.taobao.com";
    this.shops[1] = "https://shop65188790.taobao.com";
    this.cards[0] = "背心";
    /*this.cards[1] = "文胸";*/
    /*this.cards[2] = "打底";*/

    MTG_BUYER.arrangeRquests();

    return false;
};

MTG_BUYER_CLASS.prototype.start = function() {
    this.mainDiv = document.createElement("div");
    this.mainDiv.setAttribute("id", "mtgCarManager");

    this.shopAmount = 2;
    this.cardAmount = 1;
    this.createForm = function(shop, card) {
        var form = document.createElement("form");
        form.setAttribute("id", "mtgCarInputArea");

        for (var i=0; i<shop; i++) {
            var inp = document.createElement("input");
            inp.type="text";
            inp.setAttribute("id", "mtgCarShopLink"+String(i));
            inp.setAttribute("type", "text");
            inp.setAttribute("value", "shop link : " + String(i));
            form.appendChild(inp);
        }

        form.appendChild( document.createElement("br") );
        form.appendChild( document.createTextNode("输入单卡名称") );
        form.appendChild( document.createElement("br") );

        for (    i=0; i<card; i++) {
            var inp = document.createElement("input");
            inp.type="text";
            inp.setAttribute("id", "mtgCarCardName"+String(i));
            inp.setAttribute("type", "text");
            inp.setAttribute("value", "card name : " + String(i));
            form.appendChild(inp);
        }

        form.appendChild( document.createElement("br") );
        var btn = document.createElement("button");
        btn.appendChild( document.createTextNode("Search") );
        form.appendChild(btn);
        btn.id = "mtgSubmitButton";
        btn.type = "button";
        btn.onclick=function(e) {MTG_BUYER.submitForm(e);return false;};
        return form;
    };

    this.mainDiv.appendChild(this.createForm(this.shopAmount, this.cardAmount));

    var resultCanvas = document.createElement("div");
    resultCanvas.id = "mtgResultCanvas";
    this.mainDiv.appendChild(resultCanvas);

    $(".J_Cover").append(this.mainDiv);
    return false;
};


document.addEventListener('keydown', function(e) {
    if (e.keyCode == 77 /* m */ && e.ctrlKey && e.altKey) {
            MTG_BUYER.start();
        }
    return false;
});

