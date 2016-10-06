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
    div.html(div.html() + "<br /> (Stub in writeItemToShopCanvas) " + item + " from " + shopLink);
    return true;
}

// http://stackoverflow.com/a/36242700/1166518
function stripTrailingSlash(str) {
    if (str.endsWith('/')) {
        return str.slice(0, -1);
    }
    return str;
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

/**
 * arrangeRquests
    * 进行若干次的 Promise 请求
 *
 * @returns {undefined}
 */
MTG_BUYER_CLASS.prototype.arrangeRquests = function() {
    var SINGLE_SEARCH_PARAMETER = {
        itemCode: "%B1%B3%D0%C4",
        itemName: "背心",
        shopLink: "https://shop101650459.taobao.com"};
    /* 这一组 asyc 函数的参数是一个 对象
    *  第一个参数 req 都是一个 SINGLE_SEARCH_PARAMETER 对象
    *  接下来的参数传递其他信息
    */
    function asycConvertCardName(req) {
        return new Promise(function(resolve, reject) {
            req.itemCode = encode(req.itemName);
            var passData = new Array();
            passData[0] = req;
            resolve(passData);
        });
    }

    /**
     * searchInShops
        * 对给定的一张卡，在多家商店内启动一组搜索
        * 发起的搜索是异步的，但该函数并不返回 Promise 对象
     *
     * @param receive
     * @returns {undefined}
     */
    function searchInShops(receive) {
        function asycBuildLink(receive) {
            return new Promise(function(resolve, reject) {
                var passData = {"req": receive.req};
                passData.searchLink = passData.req.shopLink
                    + "/search.htm?q=" + passData.req.itemCode
                    + "&searcy_type=item"
                    + "&s_from=newHeader&source=&ssid=s5-e&search=y"
                    + "&initiative_id=shopz_" + String(YYYYMMDD);
                resolve(passData);
            });
        }
        function asycFetchData(receive) {
            return new Promise(function(resolve, reject) {
                var passData = Object.create(receive);
                writeItemToShopCanvas(passData.searchLink, passData.req.shopLink);
                var iframe = document.createElement('iframe');
                iframe.src = passData.searchLink;
                iframe.addEventListener("load", function() {
                    var doc = iframe.contentDocument;
                    writeItemToShopCanvas("show", passData.req.shopLink);
                }, true);
                MTG_BUYER.mainDiv.appendChild(iframe);
                /*
                $.get(passData.searchLink, function(data){
                    writeItemToShopCanvas(data.contents, passData.req.shopLink);
                });
                */
                /*
                var xhr = new XMLHttpRequest();
                xhr.open("get", "https://segmentfault.com/q/1010000003853718", true);
                xhr.onreadystatechange = function() {
                    writeItemToShopCanvas(String(xhr.readyState), passData.req.shopLink);
                    if (xhr.readyState == 4) {
                        writeItemToShopCanvas(xhr.responseURL
                            + "status: " + String(xhr.statusText)
                            + "num: " + String(xhr.status)
                            + xhr.getResponseHeader("Content-Type")
                            ,
                            passData.req.shopLink);
                    }
                }
                xhr.send();
                */
                /*
                var myRequest = new Request(passData.searchLink);
                var myInit = {
                    method: 'GET',
                    headers: {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Origin": passData.req.shopLink,
                "Origin": passData.req.shopLink
                    },
                    mode: 'cors',
                    cache: 'default'
                };
                    fetch(myRequest, myInit)
                    .then(function(response) {
                        writeItemToShopCanvas("fetch", passData.req.shopLink);
                    })
                    .catch(function (err) {
                        writeItemToShopCanvas(err, passData.req.shopLink);
                    });
                */
                resolve(passData);
            });
        }

        var req;
        for (var i=0; i<MTG_BUYER.shopAmount; i++) {
            req = Object.create(receive[0]); //不复制的话，只会请求第一个网址
            req.shopLink = MTG_BUYER.shops[i];
            Promise.resolve({"req":req})
                .then(asycBuildLink)
                .then(asycFetchData);
        }
    }

    function asycFillWebForm(receive) {
        return new Promise(function(resolve, reject) {
            var req = receive[0];
            var passData = new Array();
            passData[0] = req;
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

    for (var c=0; c<this.cardAmount; c++) {
        var req = Object.create(SINGLE_SEARCH_PARAMETER);
        req.itemName = this.cards[c];
        Promise.resolve(req)
            .then(asycConvertCardName)
            .then(searchInShops);
    }
    /*
    {
        req.shopLink = this.shops[i];
        Promise.resolve(req)
            .then(asycCreateIframe)
            .then(asycFillWebForm)
            .then(asycResolveWebDate)
            .then(writeResult);
    }
    */
    /*alert("finished request");*/
};

MTG_BUYER_CLASS.prototype.submitForm = function(e) {
    this.shops = new Array(this.shopAmount);
    this.cards = new Array(this.cardAmount);

    var i;
    for (i=0; i<this.shopAmount; i++) {this.shops[i] = $("#mtgCarShopLink"+String(i)).val();}
    for (i=0; i<this.cardAmount; i++) {this.cards[i] = $("#mtgCarCardName"+String(i)).val();}
    //FIXME: Used for test
    this.shops[0] = "https://shop62237807.taobao.com";
    this.shops[1] = "https://shop65188790.taobao.com/";
    this.cards[0] = "背心";
    this.cards[1] = "文胸";
    this.cards[2] = "打底";

    for (i=0; i<this.shopAmount; i++) {
        this.shops[i] = stripTrailingSlash(this.shops[i]);
    }

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

