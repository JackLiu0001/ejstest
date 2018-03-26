(function(window) {
    var _cm_ads = cm_ads || [];
    if (_cm_ads.length < 1) {
        return false
    }
    var icm = _cm_ads[_cm_ads.length - 1];
    var curScript = getScript();
    var extend = function(base, prop) {
        var base = base || {};
        for (var name in prop) {
            if (prop.hasOwnProperty(name)) {
                base[name] = prop[name]
            }
        }
        return base
    };

    // function getScript() {
    //     var sct = document.getElementsByTagName("script");
    //     return sct[sct.length - 1]
    // }
    var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

    function base64decode(str) {
        var c1, c2, c3, c4;
        var i, len, out;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 255]
            } while (i < len && c1 == -1);
            if (c1 == -1) {
                break
            }
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 255]
            } while (i < len && c2 == -1);
            if (c2 == -1) {
                break
            }
            out += String.fromCharCode((c1 << 2) | ((c2 & 48) >> 4));
            do {
                c3 = str.charCodeAt(i++) & 255;
                if (c3 == 61) {
                    return out
                }
                c3 = base64DecodeChars[c3]
            } while (i < len && c3 == -1);
            if (c3 == -1) {
                break
            }
            out += String.fromCharCode(((c2 & 15) << 4) | ((c3 & 60) >> 2));
            do {
                c4 = str.charCodeAt(i++) & 255;
                if (c4 == 61) {
                    return out
                }
                c4 = base64DecodeChars[c4]
            } while (i < len && c4 == -1);
            if (c4 == -1) {
                break
            }
            out += String.fromCharCode(((c3 & 3) << 6) | c4)
        }
        return out
    }

    function ajax(opt) {
        opt = opt || {};
        opt.method = opt.method.toUpperCase() || "POST";
        opt.url = opt.url || "";
        opt.async = (opt.async != undefined) ? opt.async : true;
        opt.data = opt.data || null;
        opt.success = opt.success || function() {};
        var xmlHttp = null;
        if (XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest()
        } else {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
        }
        var params = [];
        for (var key in opt.data) {
            params.push(key + "=" + opt.data[key])
        }
        var postData = params.join("&");
        if (opt.method.toUpperCase() === "POST") {
            xmlHttp.open(opt.method, opt.url, opt.async);
            xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
            xmlHttp.send(postData)
        } else {
            if (opt.method.toUpperCase() === "GET") {
                xmlHttp.open("GET", opt.url + "?" + postData, opt.async);
                xmlHttp.send(null)
            }
        }
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                opt.success(xmlHttp.responseText)
            }
        }
    }

    function getScript() {
        if (document.getElementById("cm_cb_scp")) {
            return document.getElementById("cm_cb_scp")
        }
        var scp = document.createElement("script");
        scp.id = "cm_cb_scp";
        document.getElementsByTagName("body")[0].appendChild(scp);
        return scp
    }

    function jsonp(url) {
        var callBack = "callBack_" + Math.random().toString(36).replace(/[^a-z]+/g, "");
        var $scipt = getScript();
        var $url = url + "&callback=" + callBack;
        $scipt.src = $url;
        $scipt.onerror = function() {
            failback()
        };
        window[callBack] = function(res) {
            if (res.code == 0) {
                render(getHtmlCode(res))
                loadsuccess();//濞戞挸锕ユ慨顦抩ad闁瑰瓨鍔曟慨锟�
            } else {
                failback()
            }
        }
    }

    function failback() {
        if ("__cnFailLoad" in window) {
            __cnFailLoad()
        } else {
            window.location = "mopub://failLoad"
        }
    }
    var getUrlParams = function() {
        var getVersion = function() {
            return icm.version || 22
        };
        var getMid = function() {
            return icm.cm_app_id
        };
        var getlang = function() {
            return (navigator.language) ? navigator.language : navigator.browserLanguage
        };
        var getResolution = function() {
            var scr = window.screen;
            return scr.height + "*" + scr.width
        };
        var getDPI = function() {
            return window.devicePixelRatio || 1
        };
        var getGaid = function() {
            return encodeURIComponent(icm.gid) || ""
        };
        var getPosid = function() {
            return icm.cm_slot_id || ""
        };
        var getPl = function() {
            var u = navigator.userAgent;
            var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
            return isAndroid ? 2 : 1
        };
        var getTag = function() {
            return icm.cm_tag || 1
        };
        var getBundle = function() {
            return icm.bundle || '';
        };
        var getClient_ip = function() {
            return icm.client_ip || '';
        };
        var getLat = function() {
            return icm.lat || '';
        };
        var getLon = function() {
            return icm.lon || '';
        };
        var getClient_ua = function() {
            return icm.client_ua || '';
        };
        var getGender = function() {
            return icm.gender || '';
        };
        var getAge = function() {
            return icm.age || '';
        };
        var getDnt = function() {
            return icm.dnt || '';
        };
        var getIabType = function() {
            return icm.iab_type || '';
        };
        var param = {
            v: getVersion(),
            mid: getMid(),
            lan: getlang(),
            resolution: getResolution(),
            dpi: getDPI(),
            gaid: getGaid(),
            posid: getPosid(),
            pl: getPl(),
            sdkt: 1,
            pg: 0,
            offset: 0,
            adn: 1,
            tag: getTag(),
            ord: '%%CACHEBUSTER%%',
            t: new Date() - 0,
            bundle: getBundle(),
            client_ip: getClient_ip(),
            lat: getLat(),
            lon: getLon(),
            client_ua: getClient_ua(),
            gender: getGender(),
            age: getAge(),
            dnt: getDnt(),
            iab_type: getIabType(),
        };
        if (icm.debug) {
            param.ch = "testmopub";
            param.test_country = "us"
        }
        return param
    };

    function getUrlParamString() {
        var param = getUrlParams();
        var arr = [];
        for (var i in param) {
            var str = i + "=" + param[i];
            arr.push(str)
        }
        return arr.join("&")
    }

    function getHtmlCode(ret) {
        var ads = ret.ads[0];
        var type = Number(ads.app_show_type);
        var html = "";
        switch (type) {
            case 70009:
                html += base64decode(ads.html);
                break;
            default:
                html += base64decode(ads.html);
                break
        }
        var obj = {
            clickTracking: ads.click_tracking_url,
            code: html
        };
        return obj
    }

    function parse(str) {
        return eval("(" + str + ")")
    }

    function getVisibleHeight() {
        var winWidth = 0;
        var winHeight = 0;
        if (window.innerWidth) {
            winWidth = window.innerWidth
        } else {
            if ((document.body) && (document.body.clientWidth)) {
                winWidth = document.body.clientWidth
            }
        }
        if (window.innerHeight) {
            winHeight = window.innerHeight
        } else {
            if ((document.body) && (document.body.clientHeight)) {
                if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
                    winHeight = document.documentElement.clientHeight;
                    winWidth = document.documentElement.clientWidth
                }
            }
        }
        return {
            width: winWidth,
            height: winHeight
        }
    }

    function render(obj) {
        var iframe = document.createElement("iframe");
        iframe.style.cssText += "width:" + icm.cm_ad_width + "px;height:" + icm.cm_ad_height + "px;border:0;display:block;overflow:hidden;";
        iframe.setAttribute("frameBorder", "0");
        iframe.setAttribute("scrolling", "no");
        var _div = document.createElement("div");
        var _outer = document.createElement("div");
        _outer.style.cssText += "display: -ms-flex; display: -webkit-flex; display: flex; -ms-flex-align: center; -webkit-align-items: center; -webkit-box-align: center; align-items: center;position:absolute;justify-content: center;top: 0; left: 0; bottom: 0; right: 0;";
        var $height = getVisibleHeight().height;
        var $marginTop = (icm.cm_ad_height > 50 && $height > icm.cm_ad_height) ? Math.floor(($height - icm.cm_ad_height) / 2) : 0;
        _div.style.cssText += "width:" + icm.cm_ad_width + "px;height:" + icm.cm_ad_height + "px;border:0;display:block;overflow:hidden;";
        _div.appendChild(iframe);
        _outer.appendChild(_div);
        curScript.parentNode.insertBefore(_outer, curScript);
        try {
            var _win = iframe.contentWindow;
            var _doc = _win.document;
            _win.__cTracking = obj.clickTracking;
            _doc.open();
            _doc.write(obj.code);
            _doc.close();
            // var conts = _doc.getElementsByTagName("div");
            // var imgs = _doc.getElementsByTagName("img");
            // for (var j = 0; j < conts.length; j++) {
            //     conts[j].style.width = icm.cm_ad_width + "px";
            //     conts[j].style.height = icm.cm_ad_height + "px"
            // }
            // for (var k = 0; k < imgs.length; k++) {
            //     imgs[k].style.width = icm.cm_ad_width + "px";
            //     imgs[k].style.height = icm.cm_ad_height + "px"
            // }
        } catch (e) {
            failback()
        }
    }

    function init() {
        var params = getUrlParamString();
        if (icm.debug1 != undefined) {
            params.debug1 = true
        }
        var url = (icm.source || icm.url) || "http://ssdk.adkmob.com/b/";
        jsonp(url + "?" + params)
    }
    init()
})(window);