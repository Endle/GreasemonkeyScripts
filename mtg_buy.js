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
    div.html(div.html() + "<br /> (Stub in writeItemToShopCanvas) " + item);
    return true;
}

/**
 * fetchItemInShop
 *
 * @param {string} itemName
 * @param {string} shopLink
 * @returns {string} - processed HTML code
 */
function fetchItemInShop(itemName, shopLink) {
    return "(Stub in fetchItemInShop)" + itemName + shopLink;
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

MTG_BUYER_CLASS.prototype.submitForm = function(e) {
    this.shops = new Array(this.shopAmount);
    this.cards = new Array(this.cardAmount);

    var i, j;
    for (i=0; i<this.shopAmount; i++) {this.shops[i] = $("#mtgCarShopLink"+String(i)).val();}
    for (i=0; i<this.cardAmount; i++) {this.cards[i] = $("#mtgCarCardName"+String(i)).val();}

    writeFrameToCanvas();
    for (i=0; i<this.shopAmount; i++)
    for (j=0; j<this.cardAmount; j++) {
        ret = fetchItemInShop(this.cards[j], this.shops[i]);
        writeItemToShopCanvas(ret, this.shops[i]);
    }

    return false;
};

MTG_BUYER_CLASS.prototype.start = function() {
    this.mainDiv = document.createElement("div");
    this.mainDiv.setAttribute("id", "mtgCarManager");

    this.shopAmount = 2;
    this.cardAmount = 4;
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

