if ("undefined" === typeof ITHit) {
    (function() {
        this.ITHit = {
            _oComponents: {},
            _oNamespace: {},
            Define: function(_1) {
                this._oComponents[_1] = true;
            },
            Defined: function(_2) {
                return !!this._oComponents[_2];
            },
            Add: function(_3, _4) {
                var _5 = _3.split(".");
                var _6 = this;
                var _7 = _5.length;
                for (var i = 0; i < _7; i++) {
                    if ("undefined" === typeof _6[_5[i]]) {
                        if (i < (_7 - 1)) {
                            _6[_5[i]] = {};
                        } else {
                            _6[_5[i]] = _4;
                        }
                    } else {
                        if (!(_6[_5[i]] instanceof Object)) {
                            return;
                        }
                    }
                    _6 = _6[_5[i]];
                }
            },
            Temp: {}
        };
    })();
}
ITHit.Config = {
    Global: window,
    ShowOriginalException: true,
    PreventCaching: false
};
ITHit.Add("GetNamespace", function(_9, _a, _b) {
    var _c = ITHit.Utils;
    if (!_c.IsString(_9) && !_c.IsArray(_9)) {
        throw new ITHit.Exception("ITHit.GetNamespace() expected string as first parameter of method.");
    }
    var _d = _c.IsArray(_9) ? _9 : _9.split(".");
    var _e = _b || ITHit.Config.Global;
    for (var i = 0, _10 = ""; _e && (_10 = _d[i]); i++) {
        if (_10 in _e) {
            _e = _e[_10];
        } else {
            if (_a) {
                _e[_10] = {};
                _e = _e[_10];
            } else {
                _e = undefined;
            }
        }
    }
    return _e;
});
ITHit.Add("Namespace", function(_11, _12) {
    return ITHit.GetNamespace(_11, false, _12);
});
ITHit.Add("Declare", function(_13, _14) {
    return ITHit.GetNamespace(_13, true, _14);
});
ITHit.Add("DetectOS", function() {
    var _15 = navigator.platform,
        _16 = {
            Windows: (-1 != _15.indexOf("Win")),
            MacOS: (-1 != _15.indexOf("Mac")),
            IOS: (/iPad|iPhone|iPod/.test(_15)),
            Linux: (-1 != _15.indexOf("Linux")),
            UNIX: (-1 != _15.indexOf("X11")),
            OS: null
        };
    if (_16.Windows) {
        _16.OS = "Windows";
    } else {
        if (_16.Linux) {
            _16.OS = "Linux";
        } else {
            if (_16.MacOS) {
                _16.OS = "MacOS";
            } else {
                if (_16.UNIX) {
                    _16.OS = "UNIX";
                } else {
                    if (_16.IOS) {
                        _16.OS = "IOS";
                    }
                }
            }
        }
    }
    return _16;
}());
ITHit.Add("DetectBrowser", function() {
    var _17 = navigator.userAgent,
        _18 = {
            IE: false,
            FF: false,
            Chrome: false,
            Safari: false,
            Opera: false,
            Browser: null,
            Mac: false
        },
        _19 = {
            IE: {
                Search: "MSIE",
                Browser: "IE"
            },
            IE11: {
                Search: "Trident/7",
                Version: "rv",
                Browser: "IE"
            },
            Edge: {
                Search: "Edge",
                Browser: "Edge"
            },
            FF: {
                Search: "Firefox",
                Browser: "FF"
            },
            Chrome: {
                Search: "Chrome",
                Browser: "Chrome"
            },
            Safari: {
                Search: "Safari",
                Version: "Version",
                Browser: "Safari",
                Mac: "Macintosh",
                iPad: "iPad",
                iPhone: "iPhone"
            },
            Opera: {
                Search: "Opera",
                Browser: "Opera"
            }
        };
    for (var _1a in _19) {
        var pos = _17.indexOf(_19[_1a].Search);
        if (-1 != pos) {
            _18.Browser = _19[_1a].Browser;
            _18.Mac = navigator.platform.indexOf("Mac") == 0;
            _18.iPad = (_19[_1a].iPad && _17.indexOf(_19[_1a].iPad) != -1);
            _18.iPhone = (_19[_1a].iPhone && _17.indexOf(_19[_1a].iPhone) != -1);
            var _1c = _19[_1a].Version || _19[_1a].Search,
                _1d = _17.indexOf(_1c);
            if (-1 == _1d) {
                _18[_19[_1a].Browser] = true;
                break;
            }
            _18[_19[_1a].Browser] = parseFloat(_17.substring(_1d + _1c.length + 1));
            break;
        }
    }
    return _18;
}());
ITHit.Add("DetectDevice", function() {
    var _1e = navigator.userAgent;
    var _1f = {};
    var _20 = {
        Android: {
            Search: "Android"
        },
        BlackBerry: {
            Search: "BlackBerry"
        },
        iOS: {
            Search: "iPhone|iPad|iPod"
        },
        Opera: {
            Search: "Opera Mini"
        },
        Windows: {
            Search: "IEMobile"
        },
        Mobile: {}
    };
    for (var _21 in _20) {
        var _22 = _20[_21];
        if (!_22.Search) {
            continue;
        }
        var _23 = new RegExp(_22.Search, "i");
        _1f[_21] = _23.test(_1e);
        if (!_1f.Mobile && _1f[_21]) {
            _1f.Mobile = true;
        }
    }
    return _1f;
}());
ITHit.Add("HttpRequest", function(_24, _25, _26, _27, _28, _29) {
    if (!ITHit.Utils.IsString(_24)) {
        throw new ITHit.Exception("Expexted string href in ITHit.HttpRequest. Passed: \"" + _24 + "\"", "sHref");
    }
    if (!ITHit.Utils.IsObjectStrict(_26) && !ITHit.Utils.IsNull(_26) && !ITHit.Utils.IsUndefined(_26)) {
        throw new ITHit.Exception("Expexted headers list as object in ITHit.HttpRequest.", "oHeaders");
    }
    this.Href = _24;
    this.Method = _25;
    this.Headers = _26;
    this.Body = _27;
    this.User = _28 || null;
    this.Password = _29 || null;
});
ITHit.Add("HttpResponse", function() {
    var _2a = function(_2b, _2c, _2d, _2e) {
        if (!ITHit.Utils.IsString(_2b)) {
            throw new ITHit.Exception("Expexted string href in ITHit.HttpResponse. Passed: \"" + _2b + "\"", "sHref");
        }
        if (!ITHit.Utils.IsInteger(_2c)) {
            throw new ITHit.Exception("Expexted integer status in ITHit.HttpResponse.", "iStatus");
        }
        if (!ITHit.Utils.IsString(_2d)) {
            throw new ITHit.Exception("Expected string status description in ITHit.HttpResponse.", "sStatusDescription");
        }
        if (_2e && !ITHit.Utils.IsObjectStrict(_2e)) {
            throw new ITHit.Exception("Expected object headers in ITHit.HttpResponse.", "oHeaders");
        } else {
            if (!_2e) {
                _2e = {};
            }
        }
        this.Href = _2b;
        this.Status = _2c;
        this.StatusDescription = _2d;
        this.Headers = _2e;
        this.BodyXml = null;
        this.BodyText = "";
    };
    _2a.prototype._SetBody = function(_2f, _30) {
        this.BodyXml = _2f || null;
        this.BodyText = _30 || "";
    };
    _2a.prototype.SetBodyText = function(_31) {
        this.BodyXml = null;
        this.BodyText = _31;
    };
    _2a.prototype.SetBodyXml = function(_32) {
        this.BodyXml = _32;
        this.BodyText = "";
    };
    _2a.prototype.ParseXml = function(_33) {
        if (!ITHit.Utils.IsString(_33)) {
            throw new ITHit.Exception("Expected XML string in ITHit.HttpResponse.ParseXml", "sXml");
        }
        var _34 = new ITHit.XMLDoc();
        _34.load(_33);
        this.BodyXml = _34._get();
        this.BodyText = _33;
    };
    _2a.prototype.GetResponseHeader = function(_35, _36) {
        if (!_36) {
            return this.Headers[_35];
        } else {
            var _35 = String(_35).toLowerCase();
            for (var _37 in this.Headers) {
                if (_35 === String(_37).toLowerCase()) {
                    return this.Headers[_37];
                }
            }
            return undefined;
        }
    };
    return _2a;
}());
ITHit.Add("XMLRequest", (function() {
    var _38;
    var _39 = function() {
        if (ITHit.DetectBrowser.IE && ITHit.DetectBrowser.IE < 10 && window.ActiveXObject) {
            if (_38) {
                return new ActiveXObject(_38);
            } else {
                var _3a = ["MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.3.0"];
                for (var i = 0; i < _3a.length; i++) {
                    try {
                        var _3c = new ActiveXObject(_3a[i]);
                        _38 = _3a[i];
                        return _3c;
                    } catch (e) {}
                }
            }
        } else {
            if ("undefined" != typeof XMLHttpRequest) {
                return new XMLHttpRequest();
            }
        }
        throw new ITHit.Exception("XMLHttpRequest (AJAX) not supported");
    };
    var _3d = function(_3e) {
        var _3f = {};
        if (!_3e) {
            return _3f;
        }
        var _40 = _3e.split("\n");
        for (var i = 0; i < _40.length; i++) {
            if (!ITHit.Trim(_40[i])) {
                continue;
            }
            var _42 = _40[i].split(":");
            var _43 = _42.shift();
            _3f[_43] = ITHit.Trim(_42.join(":"));
        }
        return _3f;
    };
    var _44 = function(_45, _46) {
        this.bAsync = _46 === true;
        this.OnData = null;
        this.OnError = null;
        this.OnProgress = null;
        this.oHttpRequest = _45;
        this.oError = null;
        if (!_45.Href) {
            throw new ITHit.Exception("Server url had not been set.");
        }
        if (ITHit.Logger && ITHit.LogLevel) {
            ITHit.Logger.WriteMessage("[" + _45.Href + "]");
        }
        this.oRequest = _39();
        var _47 = String(_45.Href);
        var _48 = _45.Method || "GET";
        try {
            this.oRequest.open(_48, ITHit.DecodeHost(_47), this.bAsync, _45.User || null, _45.Password || null);
            if (ITHit.DetectBrowser.IE && ITHit.DetectBrowser.IE >= 10) {
                try {
                    this.oRequest.responseType = "msxml-document";
                } catch (e) {}
            }
        } catch (e) {
            var _49 = _47.match(/(?:\/\/)[^\/]+/);
            if (_49) {
                var _4a = _49[0].substr(2);
                if (_44.Host != _4a) {
                    throw new ITHit.Exception(ITHit.Phrases.CrossDomainRequestAttempt.Paste(window.location, _47, String(_48)), e);
                } else {
                    throw e;
                }
            }
        }
        for (var _4b in _45.Headers) {
            this.oRequest.setRequestHeader(_4b, _45.Headers[_4b]);
        }
        if (this.bAsync) {
            try {
                this.oRequest.withCredentials = true;
            } catch (e) {}
        }
        if (this.bAsync) {
            var _4c = this;
            this.oRequest.onreadystatechange = function() {
                if (_4c.oRequest.readyState != 4) {
                    return;
                }
                var _4d = _4c.GetResponse();
                if (typeof _4c.OnData === "function") {
                    _4c.OnData.call(_4c, _4d);
                }
            };
            if ("onprogress" in this.oRequest) {
                this.oRequest.onprogress = function(_4e) {
                    if (typeof _4c.OnProgress === "function") {
                        _4c.OnProgress.call(_4c, _4e);
                    }
                };
            }
        }
    };
    _44.prototype.Send = function() {
        var _4f = this.oHttpRequest.Body;
        _4f = _4f || (ITHit.Utils.IsUndefined(_4f) || ITHit.Utils.IsNull(_4f) || ITHit.Utils.IsBoolean(_4f) ? "" : _4f);
        _4f = String(_4f);
        if (_4f === "") {
            _4f = null;
        }
        try {
            this.oRequest.send(_4f);
        } catch (e) {
            this.oError = e;
            if (typeof this.OnError === "function") {
                this.OnError.call(this, e);
            }
        }
    };
    _44.prototype.Abort = function() {
        if (this.oRequest) {
            try {
                this.oRequest.abort();
            } catch (e) {
                this.oError = e;
                if (typeof this.OnError === "function") {
                    this.OnError.call(this, e);
                }
            }
        }
    };
    _44.prototype.GetResponse = function() {
        var _50 = this.oHttpRequest;
        var _51 = this.oRequest;
        var _52 = String(_50.Href);
        if (this.bAsync && _51.readyState != 4) {
            throw new ITHit.Exception("Request sended as asynchronous, please register callback through XMLRequest.OnData() method for get responce object.");
        }
        if ((404 == _51.status) && (-1 != _52.indexOf(".js") && (_50.Method !== "PROPFIND"))) {
            ITHit.debug.loadTrace.failed(ITHit.debug.loadTrace.FAILED_LOAD);
            throw new ITHit.Exception("Failed to load script (\"" + _52 + "\"). Request returned status: " + _51.status + (_51.statusText ? " (" + _51.statusText + ")" : "") + ".", this.oError || undefined);
        }
        var _53 = this.FixResponseStatus(_51.status, _51.statusText);
        var _54 = new ITHit.HttpResponse(_52, _53.Status, _53.StatusDescription, _3d(_51.getAllResponseHeaders()));
        _54._SetBody(_51.responseXML, _51.responseText);
        return _54;
    };
    _44.prototype.FixResponseStatus = function(_55, _56) {
        var _57 = {
            Status: _55,
            StatusDescription: _56
        };
        if (1223 == _55) {
            _57.Status = 204;
            _57.StatusDescription = "No Content";
        }
        return _57;
    };
    _44.Host = window.location.host;
    return _44;
})());
ITHit.Add("Utils", {
    IsString: function(_58) {
        return (("string" == typeof _58) || (_58 instanceof String));
    },
    IsNumber: function(_59) {
        return ("number" == typeof _59);
    },
    IsBoolean: function(_5a) {
        return (("boolean" == typeof _5a) || (_5a instanceof Boolean));
    },
    IsInteger: function(_5b) {
        return this.IsNumber(_5b) && (-1 == String(_5b).indexOf("."));
    },
    IsArray: function(_5c) {
        return (_5c instanceof Array || ("array" == typeof _5c));
    },
    IsFunction: function(_5d) {
        return (_5d instanceof Function);
    },
    IsObject: function(_5e) {
        return ("object" == typeof _5e);
    },
    IsDate: function(_5f) {
        return (_5f instanceof Date);
    },
    IsRegExp: function(_60) {
        return (_60 instanceof RegExp);
    },
    IsObjectStrict: function(_61) {
        return this.IsObject(_61) && !this.IsArray(_61) && !this.IsString(_61) && !this.IsNull(_61) && !this.IsNumber(_61) && !this.IsDate(_61) && !this.IsRegExp(_61) && !this.IsBoolean(_61) && !this.IsFunction(_61) && !this.IsNull(_61);
    },
    IsUndefined: function(_62) {
        return (undefined === _62);
    },
    IsNull: function(_63) {
        return (null === _63);
    },
    IsDOMObject: function(_64) {
        return _64 && this.IsObject(_64) && !this.IsUndefined(_64.nodeType);
    },
    HtmlEscape: function(_65) {
        return String(_65).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },
    IndexOf: function(_66, _67, _68) {
        var i = 0,
            _6a = _66 && _66.length;
        if (typeof _68 == "number") {
            i = _68 < 0 ? Math.max(0, _6a + _68) : _68;
        }
        for (; i < _6a; i++) {
            if (_66[i] === _67) {
                return i;
            }
        }
        return -1;
    },
    Contains: function(_6b, _6c) {
        return _6b && _6c && this.IsArray(_6b) && (this.IndexOf(_6b, _6c) >= 0);
    },
    FindBy: function(_6d, _6e, _6f) {
        if (_6d.find) {
            return _6d.find(_6e, _6f);
        }
        for (var i = 0; i < _6d.length; i++) {
            var _71 = _6d[i];
            if (_6e(_71, i, _6d)) {
                return _71;
            }
        }
        return undefined;
    },
    FilterBy: function(_72, _73, _74) {
        var _75 = [];
        if (_72.filter) {
            return _72.filter(_73, _74);
        }
        for (var i = 0; i < _72.length; i++) {
            var _77 = _72[i];
            if (_73(_77, i, _72)) {
                _75.push(_77);
            }
        }
        return _75;
    },
    CreateDOMElement: function(_78, _79) {
        var _7a = ITHit.Utils;
        if (_7a.IsObject(_78)) {
            if (!_78.nodeName) {
                throw new ITHit.Exception("nodeName property does not specified.");
            }
            _79 = _78;
            _78 = _78.nodeName;
            delete _79.nodeName;
        }
        var _7b = document.createElement(_78);
        if (_79 && _7a.IsObject(_79)) {
            for (var _7c in _79) {
                if (!_79.hasOwnProperty(_7c)) {
                    continue;
                }
                switch (_7c) {
                    case "class":
                        if (_79[_7c]) {
                            _7b.className = _79[_7c];
                        }
                        break;
                    case "style":
                        var _7d = _79[_7c];
                        for (var _7e in _7d) {
                            if (!_7d.hasOwnProperty(_7e)) {
                                continue;
                            }
                            _7b.style[_7e] = _7d[_7e];
                        }
                        break;
                    case "childNodes":
                        for (var i = 0, l = _79[_7c].length; i < l; i++) {
                            var _81 = _79[_7c][i];
                            if (_7a.IsString(_81) || _7a.IsNumber(_81) || _7a.IsBoolean(_81)) {
                                _81 = document.createTextNode(_81);
                            } else {
                                if (!_81) {
                                    continue;
                                }
                            }
                            if (!_7a.IsDOMObject(_81)) {
                                _81 = ITHit.Utils.CreateDOMElement(_81);
                            }
                            _7b.appendChild(_81);
                        }
                        break;
                    default:
                        _7b[_7c] = _79[_7c];
                }
            }
        }
        return _7b;
    },
    GetComputedStyle: function(_82) {
        ITHit.Utils.GetComputedStyle = ITHit.Components.dojo.getComputedStyle;
        return ITHit.Utils.GetComputedStyle(_82);
    },
    MakeScopeClosure: function(_83, _84, _85) {
        if (this.IsUndefined(_85)) {
            return this._GetClosureFunction(_83, _84);
        } else {
            if (!this.IsArray(_85)) {
                _85 = [_85];
            }
            return this._GetClosureParamsFunction(_83, _84, _85);
        }
    },
    _GetClosureParamsFunction: function(_86, _87, _88) {
        return function() {
            var _89 = [];
            for (var i = 0, l = _88.length; i < l; i++) {
                _89.push(_88[i]);
            }
            if (arguments.length) {
                for (var i = 0, l = arguments.length; i < l; i++) {
                    _89.push(arguments[i]);
                }
            }
            if (ITHit.Utils.IsFunction(_87)) {
                _87.apply(_86, _89);
            } else {
                _86[_87].apply(_86, _89);
            }
        };
    },
    _GetClosureFunction: function(_8c, _8d) {
        return function() {
            if (ITHit.Utils.IsFunction(_8d)) {
                return _8d.apply(_8c, arguments);
            }
            return _8c[_8d].apply(_8c, arguments);
        };
    }
});
ITHit.Add("Trim", function(_8e, _8f, _90) {
    if (("string" != typeof _8e) && !(_8e instanceof String)) {
        if (!_90) {
            return _8e;
        } else {
            throw new ITHit.Exception("ITHit.Trim() expected string as first prameter.");
        }
    }
    switch (_8f) {
        case ITHit.Trim.Left:
            return _8e.replace(/^\s+/, "");
            break;
        case ITHit.Trim.Right:
            return _8e.replace(/\s+$/, "");
            break;
        default:
            return _8e.replace(/(?:^\s+|\s+$)/g, "");
    }
});
ITHit.Add("Trim.Left", "Left");
ITHit.Add("Trim.Right", "Right");
ITHit.Add("Trim.Both", "Both");
ITHit.Add("Exception", (function() {
    var _91 = function(_92, _93) {
        this.Message = _92;
        this.InnerException = _93;
        if (ITHit.Logger.GetCount(ITHit.LogLevel.Error)) {
            var _94 = "Exception: " + this.Name + "\n" + "Message: " + this.Message + "\n";
            if (_93) {
                _94 += ((!_93 instanceof Error) ? "Inner exception: " : "") + this.GetExceptionsStack(_93);
            }
            ITHit.Logger.WriteMessage(_94, ITHit.LogLevel.Error);
        }
    };
    _91.prototype.Name = "Exception";
    _91.prototype.GetExceptionsStack = function(_95, _96) {
        if ("undefined" === typeof _95) {
            var _95 = this;
        }
        var _96 = _96 ? _96 : 0;
        var _97 = "";
        var _98 = "      ";
        var _99 = "";
        for (var i = 0; i < _96; i++) {
            _99 += _98;
        }
        if (_95 instanceof ITHit.Exception) {
            _97 += _99 + (_95.Message ? _95.Message : _95) + "\n";
        } else {
            if (ITHit.Config.ShowOriginalException) {
                _97 += "\nOriginal exception:\n";
                if (("string" != typeof _95) && !(_95 instanceof String)) {
                    for (var _9b in _95) {
                        _97 += "\t" + _9b + ": \"" + ITHit.Trim(_95[_9b]) + "\"\n";
                    }
                } else {
                    _97 += "\t" + _95 + "\n";
                }
            }
        }
        return _97;
    };
    _91.prototype.toString = function() {
        return this.GetExceptionsStack();
    };
    return _91;
})());
ITHit.Add("Extend", function(_9c, _9d) {
    function inheritance() {}
    inheritance.prototype = _9d.prototype;
    _9c.prototype = new inheritance();
    _9c.prototype.constructor = _9c;
    _9c.baseConstructor = _9d;
    if (_9d.base) {
        _9d.prototype.base = _9d.base;
    }
    _9c.base = _9d.prototype;
});
ITHit.Add("Events", function() {
    var _9e = function() {
        this._Listeners = this._NewObject();
        this._DispatchEvents = {};
        this._DelayedDelete = {};
    };
    _9e.prototype._NewObject = function() {
        var obj = {};
        for (var _a0 in obj) {
            delete obj[_a0];
        }
        return obj;
    };
    _9e.prototype.AddListener = function(_a1, _a2, _a3, _a4) {
        var _a5 = _a1.__instanceName;
        var _a6;
        var _a7 = ITHit.EventHandler;
        if (!(_a3 instanceof ITHit.EventHandler)) {
            _a6 = new ITHit.EventHandler(_a4 || null, _a3);
        } else {
            _a6 = _a3;
        }
        var _a8 = this._Listeners[_a5] || (this._Listeners[_a5] = this._NewObject());
        var _a9 = _a8[_a2] || (_a8[_a2] = []);
        var _aa = false;
        for (var i = 0, l = _a9.length; i < l; i++) {
            if (_a9[i].IsEqual(_a6)) {
                _aa = true;
                break;
            }
        }
        if (!_aa) {
            _a9.push(_a6);
        }
    };
    _9e.prototype.DispatchEvent = function(_ad, _ae, _af) {
        var _b0 = _ad.__instanceName;
        if (!this._Listeners[_b0] || !this._Listeners[_b0][_ae] || !this._Listeners[_b0][_ae].length) {
            return undefined;
        }
        var _b1 = ITHit.EventHandler;
        var _b2;
        var _b3 = [];
        for (var i = 0, l = this._Listeners[_b0][_ae].length; i < l; i++) {
            _b3.push(this._Listeners[_b0][_ae][i]);
        }
        this._DispatchEvents[_b0] = (this._DispatchEvents[_b0] || 0) + 1;
        this._DispatchEvents[_b0 + ":" + _ae] = (this._DispatchEvents[_b0 + ":" + _ae] || 0) + 1;
        for (var i = 0; i < _b3.length; i++) {
            var _b6;
            if (_b3[i] instanceof _b1) {
                try {
                    _b6 = _b3[i].CallHandler(_ad, _ae, _af);
                } catch (e) {
                    throw e;
                }
            }
            if (_b3[i] instanceof Function) {
                try {
                    _b6 = _b3[i](_ad, _ae, _af);
                } catch (e) {
                    throw e;
                }
            }
            if (!ITHit.Utils.IsUndefined(_b6)) {
                _b2 = _b6;
            }
        }
        this._DispatchEvents[_b0]--;
        this._DispatchEvents[_b0 + ":" + _ae]--;
        this._CheckDelayedDelete(_ad, _ae);
        return _b2;
    };
    _9e.prototype.RemoveListener = function(_b7, _b8, _b9, _ba) {
        var _bb = _b7.__instanceName;
        _ba = _ba || null;
        if (!this._Listeners[_bb] || !this._Listeners[_bb][_b8] || !this._Listeners[_bb][_b8].length) {
            return true;
        }
        var _bc = this._Listeners[_bb][_b8];
        for (var i = 0, l = _bc.length; i < l; i++) {
            if (_bc[i].IsEqual(_ba, _b9)) {
                this._Listeners[_bb][_b8].splice(i, 1);
                break;
            }
        }
    };
    _9e.prototype.RemoveAllListeners = function(_bf, _c0) {
        var _c1 = _bf.__instanceName;
        if (!ITHit.Utils.IsUndefined(_c0)) {
            if (ITHit.Utils.IsUndefined(this._DispatchEvents[_c1 + ":" + _c0])) {
                delete this._Listeners[_c1][_c0];
            } else {
                this._DelayedDelete[_c1 + ":" + _c0] = true;
            }
        } else {
            if (ITHit.Utils.IsUndefined(this._DispatchEvents[_c1])) {
                delete this._Listeners[_c1];
            } else {
                this._DelayedDelete[_c1] = true;
            }
        }
    };
    _9e.prototype._CheckDelayedDelete = function(_c2, _c3) {
        var _c4 = _c2.__instanceName;
        if (!this._DispatchEvents[_c4 + ":" + _c3]) {
            delete this._DispatchEvents[_c4 + ":" + _c3];
            if (!ITHit.Utils.IsUndefined(this._DelayedDelete[_c4 + ":" + _c3])) {
                this.RemoveAllListeners(_c2, _c3);
            }
        }
        if (!this._DispatchEvents[_c4]) {
            delete this._DispatchEvents[_c4];
            if (!ITHit.Utils.IsUndefined(this._DelayedDelete[_c4])) {
                this.RemoveAllListeners(_c2);
            }
        }
    };
    _9e.prototype.ListenersLength = function(_c5, _c6) {
        var _c7 = _c5.__instanceName;
        if (!this._Listeners[_c7] || !this._Listeners[_c7][_c6]) {
            return 0;
        }
        return this._Listeners[_c7][_c6].length;
    };
    _9e.prototype.Fix = function(e) {
        e = e || window.event;
        if (!e.target && e.srcElement) {
            e.target = e.srcElement;
        }
        if ((null == e.pageX) && (null != e.clientX)) {
            var _c9 = document.documentElement,
                _ca = document.body;
            e.pageX = e.clientX + (_c9 && _c9.scrollLeft || _ca && _ca.scrollLeft || 0) - (_c9.clientLeft || 0);
            e.pageY = e.clientY + (_c9 && _c9.scrollTop || _ca && _ca.scrollTop || 0) - (_c9.clientTop || 0);
        }
        if (!e.which && e.button) {
            e.which = e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0));
        }
        return e;
    };
    _9e.prototype.AttachEvent = function(_cb, _cc, _cd) {
        _cc = _cc.replace(/^on/, "");
        if (_cb.addEventListener) {
            _cb.addEventListener(_cc, _cd, false);
        } else {
            if (_cb.attachEvent) {
                _cb.attachEvent("on" + _cc, _cd);
            } else {
                _cb["on" + _cc] = _cd;
            }
        }
    };
    _9e.prototype.DettachEvent = function(_ce, _cf, _d0) {
        _cf = _cf.replace(/^on/, "");
        if (_ce.removeEventListener) {
            _ce.removeEventListener(_cf, _d0, false);
        } else {
            if (_ce.detachEvent) {
                _ce.detachEvent("on" + _cf, _d0);
            } else {
                _ce["on" + _cf] = null;
            }
        }
    };
    _9e.prototype.Stop = function(e) {
        e = e || window.event;
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        e.cancelBubble = true;
        return false;
    };
    return new _9e();
}());
ITHit.Add("EventHandler", function() {
    var _d2 = function(_d3, _d4) {
        var _d5 = ITHit.Utils;
        if (!_d5.IsObjectStrict(_d3) && !_d5.IsNull(_d3)) {
            throw new ITHit.Exception("Event handler scope expected to be an object.");
        }
        if (!_d5.IsFunction(_d4) && (_d3 && !_d5.IsString(_d4))) {
            throw new ITHit.Exception("Method handler expected to be a string or function.");
        }
        if (_d3) {
            this.Scope = _d3;
            this.Name = _d3.__instanceName;
        } else {
            this.Scope = window;
            this.Name = "window";
        }
        this.Method = _d4;
    };
    _d2.prototype.IsEqual = function(_d6, _d7) {
        if (_d6 instanceof ITHit.EventHandler) {
            return this.GetCredentials() === _d6.GetCredentials();
        } else {
            return ((_d6 || null) === this.Scope) && (_d7 === this.Method);
        }
    };
    _d2.prototype.GetCredentials = function() {
        return this.Name + "::" + this.Method;
    };
    _d2.prototype.CallHandler = function(_d8, _d9, _da) {
        if (!(_da instanceof Array)) {
            _da = [_da];
        }
        if (this.Scope) {
            if (this.Method instanceof Function) {
                return this.Method.apply(this.Scope || window, _da.concat([_d8]));
            } else {
                try {
                    return this.Scope[this.Method].apply(this.Scope, _da.concat([_d8]));
                } catch (e) {
                    throw new ITHit.Exception(e);
                }
            }
        } else {
            return this.Method.apply({}, _da.concat([_d8]));
        }
    };
    return _d2;
}());
ITHit.Add("HtmlEncode", function(_db) {
    return _db.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&amp;").replace(/"/g, "&quot;");
});
ITHit.Add("HtmlDecode", function(_dc) {
    return _dc.replace(/&quot;/, "\"").replace(/&amp;/g, "'").replace(/&gt;/g, ">").replace(/&lt;/g, "<");
});
ITHit.Add("Encode", function(_dd) {
    if (!_dd) {
        return _dd;
    }
    return ITHit.EncodeURI(_dd.replace(/%/g, "%25")).replace(/~/g, "%7E").replace(/!/g, "%21").replace(/@/g, "%40").replace(/#/g, "%23").replace(/\$/g, "%24").replace(/&/g, "%26").replace(/\*/g, "%2A").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\-/g, "%2D").replace(/_/g, "%5F").replace(/\+/g, "%2B").replace(/\=/g, "%3D").replace(/'/g, "%27").replace(/;/g, "%3B").replace(/\,/g, "%2C").replace(/\?/g, "%3F");
});
ITHit.Add("EncodeURI", function(_de) {
    if (!_de) {
        return _de;
    }
    return encodeURI(_de).replace(/%25/g, "%");
});
ITHit.Add("Decode", function(_df) {
    if (!_df) {
        return _df;
    }
    var _df = _df.replace(/%7E/gi, "~").replace(/%21/g, "!").replace(/%40/g, "@").replace(/%23/g, "#").replace(/%24/g, "$").replace(/%26/g, "&").replace(/%2A/gi, "*").replace(/%28/g, "(").replace(/%29/g, ")").replace(/%2D/gi, "-").replace(/%5F/gi, "_").replace(/%2B/gi, "+").replace(/%3D/gi, "=").replace(/%27/g, "'").replace(/%3B/gi, ";").replace(/%2E/gi, ".").replace(/%2C/gi, ",").replace(/%3F/gi, "?");
    return ITHit.DecodeURI(_df);
});
ITHit.Add("DecodeURI", function(_e0) {
    if (!_e0) {
        return _e0;
    }
    return decodeURI(_e0.replace(/%([^0-9A-F]|.(?:[^0-9A-F]|$)|$)/gi, "%25$1"));
});
ITHit.Add("DecodeHost", function(_e1) {
    if (/^(http|https):\/\/[^:\/]*?%/.test(_e1)) {
        var _e2 = _e1.match(/^(?:http|https):\/\/[^\/:]+/);
        if (_e2 && _e2[0]) {
            var _e3 = _e2[0].replace(/^(http|https):\/\//, "");
            _e1 = _e1.replace(_e3, ITHit.Decode(_e3));
        }
    }
    return _e1;
});
ITHit.Add("WebDAV.Client.LicenseId", null);
(function() {
    var _e4 = function() {};
    var _e5 = function(_e6, _e7) {
        for (var key in _e7) {
            if (!_e7.hasOwnProperty(key)) {
                continue;
            }
            var _e9 = _e7[key];
            if (typeof _e9 == "function" && typeof _e6[key] == "function" && _e6[key] !== _e4) {
                _e6[key] = _ea(_e9, _e6[key]);
            } else {
                _e6[key] = _e9;
            }
        }
        if (!_e6._super) {
            _e6._super = _e4;
        }
    };
    var _ea = function(_eb, _ec) {
        return function() {
            var old = this._super;
            this._super = _ec;
            var r = _eb.apply(this, arguments);
            this._super = old;
            return r;
        };
    };
    var _ef = 0;
    ITHit.Add("DefineClass", function(_f0, _f1, _f2, _f3) {
        _f1 = _f1 !== null ? _f1 : function() {};
        if (!_f1) {
            throw new Error("Not found extended class for " + _f0);
        }
        if (_f2.hasOwnProperty("__static")) {
            _f3 = _f2.__static;
            delete _f2.__static;
        }
        var _f4;
        if (_f2 && _f2.hasOwnProperty("constructor")) {
            _f4 = function() {
                this.__instanceName = this.__className + _ef++;
                return _ea(_f2.constructor, _f1).apply(this, arguments);
            };
        } else {
            _f4 = function() {
                this.__instanceName = this.__className + _ef++;
                return _f1.apply(this, arguments);
            };
        }
        for (var _f5 in _f1) {
            _f4[_f5] = _f1[_f5];
        }
        _e5(_f4, _f3);
        var _f6 = function() {
            this.constructor = _f4;
        };
        _f6.prototype = _f1.prototype;
        _f4.prototype = new _f6;
        for (var key in _f6.prototype) {
            if (!_f6.prototype.hasOwnProperty(key)) {
                continue;
            }
            var _f8 = _f6.prototype[key];
            if (!_f8) {
                continue;
            }
            if (_f8 instanceof Array) {
                if (_f8.length === 0) {
                    _f4.prototype[key] = [];
                }
            } else {
                if (typeof _f8 === "object") {
                    var _f9 = true;
                    for (var k in _f8) {
                        _f9 = _f9 && _f8.hasOwnProperty(k);
                    }
                    if (_f9) {
                        _f4.prototype[key] = {};
                    }
                }
            }
        }
        if (_f2) {
            _e5(_f4.prototype, _f2);
        }
        _f4.__className = _f4.prototype.__className = _f0;
        var _fb = _f0.lastIndexOf("."),
            _fc = _f0.substr(_fb + 1);
        return ITHit.Declare(_f0.substr(0, _fb))[_fc] = _f4;
    });
})();
ITHit.Temp.WebDAV_Phrases = {
    CrossDomainRequestAttempt: 'Attempting to make cross-domain request.\nRoot URL: {0}\nDestination URL: {1}\nMethod: {2}',

    // WebDavRequest
    Exceptions: {
        BadRequest: 'The request could not be understood by the server due to malformed syntax.',
        Conflict: 'The request could not be carried because of conflict on server.',
        DependencyFailed: 'The method could not be performed on the resource because the requested action depended on another action and that action failed.',
        InsufficientStorage: 'The request could not be carried because of insufficient storage.',
        Forbidden: 'The server refused to fulfill the request.',
        Http: 'Exception during the request occurred.',
        Locked: 'The item is locked.',
        MethodNotAllowed: 'The method is not allowed.',
        NotFound: 'The item doesn\'t exist on the server.',
        PreconditionFailed: 'Precondition failed.',
        PropertyFailed: 'Failed to get one or more properties.',
        PropertyForbidden: 'Not enough rights to obtain one of requested properties.',
        PropertyNotFound: 'One or more properties not found.',
        Unauthorized: 'Incorrect credentials provided or insufficient permissions to access the requested item.',
        LockWrongCountParametersPassed: 'Lock.{0}: Wrong count of parameters passed. (Passed {1})',
        UnableToParseLockInfoResponse: 'Unable to parse response: quantity of LockInfo elements isn\'t equal to 1.',
        ParsingPropertiesException: 'Exception while parsing properties.',
        InvalidDepthValue: 'Invalid Depth value.',
        FailedCreateFolder: 'Failed creating folder.',
        FailedCreateFile: 'Failed creating file.',
        FolderWasExpectedAsDestinationForMoving: 'Folder was expected as destination for moving folder.',
        AddOrUpdatePropertyDavProhibition: 'Add or update of property {0} ignored: properties from "DAV:" namespace could not be updated/added.',
        DeletePropertyDavProhibition: 'Delete of property {0} ignored: properties from "DAV:" namespace could not be deleted.',
        NoPropertiesToManipulateWith: 'Calling UpdateProperties ignored: no properties to update/add/delete.',
        ActiveLockDoesntContainLockscope: 'Activelock node doesn\'t contain lockscope node.',
        ActiveLockDoesntContainDepth: 'Activelock node doedn\'t contain depth node.',
        WrongCountPropertyInputParameters: 'Wrong count of input parameters passed for Property constructor. Expected 1-3, passed: {1}.',
        FailedToWriteContentToFile: 'Failed to write content to file.',
        PropertyUpdateTypeException: 'Property expected to be an Property class instance.',
        PropertyDeleteTypeException: 'Property name expected to be an PropertyName class instance.',
        UnknownResourceType: 'Unknown resource type.',
        NotAllPropertiesReceivedForUploadProgress: 'Not all properties received for upload progress. {0}',
        ReportOnResourceItemWithParameterCalled: 'For files the method should be called without parametres.',
        WrongHref: 'Href expected to be a string.',
        WrongUploadedBytesType: 'Count of uploaded bytes expected to be a integer.',
        WrongContentLengthType: 'File content length expected to be a integer.',
        BytesUploadedIsMoreThanTotalFileContentLength: 'Bytes uploaded is more than total file content length.',
        ExceptionWhileParsingProperties: 'Exception while parsing properties.',
        IntegrationTimeoutException: 'Browser extention didnt fill data in {0} ms',
    },
    ResourceNotFound: 'Resource not found. {0}',
    ResponseItemNotFound: 'The response doesn\'t have required item. {0}',
    ResponseFileWrongType: 'Server returned folder while file is expected. {0}',
    FolderNotFound: 'Folder not found. {0}',
    ResponseFolderWrongType: 'Server returned file while folder is expected. {0}',
    ItemIsMovedOrDeleted: 'Cannot perform operation because item "{0}" is moved or deleted.',
    FailedToCopy: 'Failed to copy item.',
    FailedToCopyWithStatus: 'Copy failed with status {0}: {1}.',
    FailedToDelete: 'Failed to delete item.',
    DeleteFailedWithStatus: 'Delete failed with status {0}: {1}.',
    PutUnderVersionControlFailed: 'Put under version control failed.',
    FailedToMove: 'Failed to move item.',
    MoveFailedWithStatus: 'Move failed with status {0}: {1}.',
    UnlockFailedWithStatus: 'Unlock failed with status {0}: {1}.',
    PropfindFailedWithStatus: 'PROPFIND method failed with status {0}.',
    FailedToUpdateProp: 'Failed to update or delete one or more properties.',
    FromTo: 'The From parameter cannot be less than To.',
    NotToken: 'The supplied string is not a valid HTTP token.',
    RangeTooSmall: 'The From or To parameter cannot be less than 0.',
    RangeType: 'A different range specifier has already been added to this request.',
    ServerReturned: 'Server returned:',
    UserAgent: 'IT Hit WebDAV AJAX Library v{0}',
    FileUploadFailed: 'Failed to upload the file.',

    // WebDavResponse
    wdrs: {
        status: '\n{0} {1}',
        response: '{0}: {1}'
    }
};

ITHit.oNS = ITHit.Declare("ITHit.Exceptions");
ITHit.oNS.LoggerException = function(_fd, _fe) {
    ITHit.Exceptions.LoggerException.baseConstructor.call(this, _fd, _fe);
};
ITHit.Extend(ITHit.oNS.LoggerException, ITHit.Exception);
ITHit.oNS.LoggerException.prototype.Name = "LoggerException";
ITHit.DefineClass("ITHit.LogLevel", null, {}, {
    All: 32,
    Debug: 16,
    Info: 8,
    Warn: 4,
    Error: 2,
    Fatal: 1,
    Off: 0
});
(function() {
    var _ff = {};
    var _100 = {};
    var _101 = {};
    for (var _102 in ITHit.LogLevel) {
        _ff[ITHit.LogLevel[_102]] = [];
        _101[ITHit.LogLevel[_102]] = [];
    }
    var _103 = function(_104, _105, iTo, _107) {
        for (var _108 in ITHit.LogLevel) {
            if (ITHit.LogLevel[_108] > iTo) {
                continue;
            }
            if (!ITHit.LogLevel[_108] || (_105 >= ITHit.LogLevel[_108])) {
                continue;
            }
            if (_104) {
                _101[ITHit.LogLevel[_108]].push(_107);
            } else {
                for (var i = 0; i < _101[ITHit.LogLevel[_108]].length; i++) {
                    if (_101[ITHit.LogLevel[_108]][i] == _107) {
                        _101[ITHit.LogLevel[_108]].splice(i, 1);
                    }
                }
            }
        }
    };
    _103.add = function(iTo, _10b) {
        _103.increase(ITHit.LogLevel.Off, iTo, _10b);
    };
    _103.del = function(iTo, _10d) {
        _103.decrease(ITHit.LogLevel.Off, iTo, _10d);
    };
    _103.increase = function(_10e, iTo, _110) {
        _103(true, _10e, iTo, _110);
    };
    _103.decrease = function(_111, iTo, _113) {
        _103(false, _111, iTo, _113);
    };
    ITHit.DefineClass("ITHit.Logger", null, {}, {
        Level: ITHit.Config.LogLevel || ITHit.LogLevel.Debug,
        AddListener: function(_114, _115) {
            if (_115 == ITHit.LogLevel.Off) {
                this.RemoveListener();
            }
            var _116 = 0;
            var _117 = 0;
            outer: for (var _118 in _ff) {
                for (var i = 0; i < _ff[_118].length; i++) {
                    if (_ff[_118][i] == _114) {
                        _116 = _118;
                        _117 = i;
                        break outer;
                    }
                }
            }
            if (!_116) {
                _ff[_115].push(_114);
                _103.add(_115, _114);
            } else {
                if (_115 != _116) {
                    _ff[_116].splice(_117, 1);
                    _ff[_115].push(_114);
                    if (_115 > _116) {
                        _103.increase(_116, _115, _114);
                    } else {
                        _103.decrease(_115, _116, _114);
                    }
                }
            }
        },
        RemoveListener: function(_11a) {
            outer: for (var _11b in _ff) {
                for (var i = 0; i < _ff[_11b].length; i++) {
                    if (_ff[_11b][i] == _11a) {
                        _ff[_11b].splice(i, 1);
                        _103.del(_11b, _11a);
                        break outer;
                    }
                }
            }
            return true;
        },
        SetLogLevel: function(_11d, _11e) {
            return this.AddListener(_11d, _11e, true);
        },
        GetLogLevel: function(_11f) {
            for (var _120 in _ff) {
                for (var i = 0; i < _ff[_120].length; i++) {
                    if (_ff[_120][i] == _11f) {
                        return _120;
                    }
                }
            }
            return false;
        },
        GetListenersForLogLevel: function(_122) {
            return _101[_122];
        },
        GetCount: function(_123) {
            return _101[_123].length;
        },
        WriteResponse: function(_124) {
            if (Logger.GetCount(ITHit.LogLevel.Info)) {
                var sStr = "";
                if (_124 instanceof HttpWebResponse) {
                    sStr += "\n" + _124.StatusCode + " " + _124.StatusDescription + "\n";
                }
                sStr += _124.ResponseUri + "\n";
                for (var _126 in _124.Headers) {
                    sStr += _126 + ": " + _124.Headers[_126] + "\n";
                }
                sStr += _124.GetResponse();
                this.WriteMessage(sStr);
            }
        },
        WriteMessage: function(_127, _128) {
            _128 = ("undefined" == typeof _128) ? ITHit.LogLevel.Info : parseInt(_128);
            if (ITHit.Logger.GetCount(_128)) {
                var _129 = this.GetListenersForLogLevel(_128);
                var _127 = String(_127).replace(/([^\n])$/, "$1\n");
                for (var i = 0; i < _129.length; i++) {
                    try {
                        _129[i](_127, ITHit.LogLevel.Info);
                    } catch (e) {
                        if (!_129[i] instanceof Function) {
                            throw new ITHit.Exceptions.LoggerException("Log listener expected function, passed: \"" + _129[i] + "\"", e);
                        } else {
                            throw new ITHit.Exceptions.LoggerException("Message could'not be logged.", e);
                        }
                    }
                }
            }
        },
        StartLogging: function() {},
        FinishLogging: function() {},
        StartRequest: function() {},
        FinishRequest: function() {}
    });
})();
ITHit.oNS = ITHit.Declare("ITHit.Exceptions");
ITHit.oNS.PhraseException = function(_12b, _12c) {
    ITHit.Exceptions.PhraseException.baseConstructor.call(this, _12b, _12c);
};
ITHit.Extend(ITHit.oNS.PhraseException, ITHit.Exception);
ITHit.oNS.PhraseException.prototype.Name = "PhraseException";
ITHit.Phrases = (function() {
    var _12d = {};
    var _12e = function(_12f) {
        this._arguments = _12f;
    };
    _12e.prototype.Replace = function(_130) {
        var _131 = _130.substr(1, _130.length - 2);
        return ("undefined" != typeof this._arguments[_131]) ? this._arguments[_131] : _130;
    };
    var _132 = function(_133) {
        this._phrase = _133;
    };
    _132.prototype.toString = function() {
        return this._phrase;
    };
    _132.prototype.Paste = function() {
        var _134 = this._phrase;
        if (/\{\d+?\}/.test(_134)) {
            var _135 = new _12e(arguments);
            _134 = _134.replace(/\{(\d+?)\}/g, function(args) {
                return _135.Replace(args);
            });
        }
        return _134;
    };
    var _137 = function() {};
    _137.prototype.LoadJSON = function(_138, _139) {
        var _13a = ITHit.Utils;
        if (_139 && !_13a.IsString(_139)) {
            throw new ITHit.Exceptions.PhraseException("Namespace expected to be a string.");
        }
        var _13b = this;
        if (_139) {
            _13b = ITHit.Declare(_139);
        }
        try {
            var _13c = _138;
            if (_13a.IsString(_13c)) {
                _13c = eval("(" + _138 + ")");
            }
            this._AddPhrases(_13c, _13b);
        } catch (e) {
            console.dir(e);
            throw new ITHit.Exceptions.PhraseException("Wrong text structure.", e);
        }
    };
    _137.prototype.LoadLocalizedJSON = function(_13d, _13e, _13f) {
        var _140 = ITHit.Utils,
            _141 = _140.IsUndefined,
            _142 = _140.IsObject;
        if (!_13d || !_140.IsObjectStrict(_13d)) {
            throw new ITHit.Exceptions.PhraseException("Default phrases expected to be an JSON object.");
        }
        if (_13e && !_140.IsObjectStrict(_13e)) {
            throw new ITHit.Exceptions.PhraseException("Default phrases expected to be an JSON object");
        }
        var _143;
        if (_13e) {
            _143 = {};
            this._MergePhrases(_143, _13e);
            this._MergePhrases(_143, _13d);
        } else {
            _143 = _13d;
        }
        this.LoadJSON(_143, _13f);
    };
    _137.prototype._MergePhrases = function(dest, _145) {
        var _146 = ITHit.Utils,
            _147 = _146.IsUndefined,
            _148 = _146.IsObject;
        for (var prop in _145) {
            if (!_145.hasOwnProperty(prop)) {
                continue;
            }
            if (_147(dest[prop])) {
                dest[prop] = _145[prop];
            } else {
                if (_148(dest[prop])) {
                    this._MergePhrases(dest[prop], _145[prop]);
                }
            }
        }
    };
    _137.prototype._AddPhrases = function(_14a, _14b) {
        _14b = _14b || this;
        for (var _14c in _14a) {
            if (("object" != typeof _14a[_14c]) || !(_14a[_14c] instanceof Object)) {
                switch (_14c) {
                    case "_AddPhrases":
                    case "LoadJSON":
                    case "LoadLocalizedJSON":
                    case "_Merge":
                    case "prototype":
                    case "toString":
                        throw new ITHit.Exceptions.PhraseException("\"" + _14c + "\" is reserved word.");
                        break;
                }
                _14b[_14c] = new _132(_14a[_14c]);
            } else {
                this._AddPhrases(_14a[_14c], _14b[_14c] ? _14b[_14c] : (_14b[_14c] = {}));
            }
        }
    };
    return new _137();
})();
ITHit.oNS = ITHit.Declare("ITHit.Exceptions");
ITHit.oNS.XPathException = function(_14d, _14e) {
    ITHit.Exceptions.XPathException.baseConstructor.call(this, _14d, _14e);
};
ITHit.Extend(ITHit.oNS.XPathException, ITHit.Exception);
ITHit.oNS.XPathException.prototype.Name = "XPathException";
ITHit.XPath = {
    _component: null,
    _version: null
};
ITHit.XPath.evaluate = function(_14f, _150, _151, _152, _153) {
    if (("string" != typeof _14f) && !(_14f instanceof String)) {
        throw new ITHit.Exceptions.XPathException("Expression was expected to be a string in ITHit.XPath.eveluate.");
    }
    if (!(_150 instanceof ITHit.XMLDoc)) {
        throw new ITHit.Exceptions.XPathException("Element was expected to be an ITHit.XMLDoc object in ITHit.XPath.evaluate.");
    }
    if (_151 && !(_151 instanceof ITHit.XPath.resolver)) {
        throw new ITHit.Exceptions.XPathException("Namespace resolver was expected to be an ITHit.XPath.resolver object in ITHit.XPath.evaluate.");
    }
    if (_152 && !(_152 instanceof ITHit.XPath.result)) {
        throw new ITHit.Exceptions.XPathException("Result expected to be an ITHit.XPath.result object in ITHit.XPath.evaluate.");
    }
    _151 = _151 || null;
    _152 = _152 || null;
    if (document.implementation.hasFeature("XPath", "3.0") && document.evaluate) {
        var _154 = _150._get();
        var _155 = _154.ownerDocument || _154;
        if (_152) {
            _155.evaluate(_14f, _154, _151, ITHit.XPath.result.UNORDERED_NODE_SNAPSHOT_TYPE, _152._res);
            return;
        }
        var oRes = new ITHit.XPath.result(_155.evaluate(_14f, _154, _151, ITHit.XPath.result.UNORDERED_NODE_SNAPSHOT_TYPE, null));
        if (!_153) {
            return oRes;
        } else {
            return oRes.iterateNext();
        }
    } else {
        if (undefined !== window.ActiveXObject) {
            var _154 = _150._get();
            var _157 = false;
            try {
                _154.getProperty("SelectionNamespaces");
                _157 = true;
            } catch (e) {}
            var _158 = false;
            if (3 == ITHit.XMLDoc._version) {
                var sXml = _154.xml.replace(/^\s+|\s+$/g, "");
                var _15a = "urn:uuid:c2f41010-65b3-11d1-a29f-00aa00c14882/";
                var _15b = "cutted";
                if (-1 != sXml.indexOf(_15a) || true) {
                    var _15c = sXml.replace(_15a, _15b);
                    var _15d = new ITHit.XMLDoc();
                    _15d.load(_15c);
                    if (_151) {
                        var oNs = _151.getAll();
                        for (var _15f in oNs) {
                            if (_15a == oNs[_15f]) {
                                oNs.add(_15f, _15b);
                                break;
                            }
                        }
                    }
                    _154 = _15d._get();
                    _157 = true;
                    _158 = true;
                }
            }
            if (_157 && _151 && _151.length()) {
                var _160 = _151.getAll();
                var aNs = [];
                for (var _15f in _160) {
                    aNs.push("xmlns:" + _15f + "='" + _160[_15f] + "'");
                }
                _154.setProperty("SelectionNamespaces", aNs.join(" "));
            }
            if (_158) {
                _154 = _154.documentElement;
            }
            try {
                if (!_153) {
                    if (!_152) {
                        return new ITHit.XPath.result(_154.selectNodes(_14f));
                    } else {
                        _152._res = _154.selectNodes(_14f);
                        return;
                    }
                } else {
                    var mOut = _154.selectSingleNode(_14f);
                    if (mOut) {
                        return new ITHit.XMLDoc(mOut);
                    } else {
                        return mOut;
                    }
                }
            } catch (e) {
                if (!_157 && (-1 != e.message.indexOf("Reference to undeclared namespace prefix")) && _151 && _151.length()) {
                    var sEl = new ITHit.XMLDoc(_154).toString();
                    var oEl = new ITHit.XMLDoc();
                    oEl.load(sEl);
                    _154 = oEl._get();
                    var _160 = _151.getAll();
                    var aNs = [];
                    for (var _15f in _160) {
                        aNs.push("xmlns:" + _15f + "='" + _160[_15f] + "'");
                    }
                    _154.setProperty("SelectionNamespaces", aNs.join(" "));
                    _154 = _154.documentElement;
                    if (!_153) {
                        if (!_152) {
                            return new ITHit.XPath.result(_154.selectNodes(_14f));
                        } else {
                            _152._res = _154.selectNodes(_14f);
                            return;
                        }
                    } else {
                        var mOut = _154.selectSingleNode(_14f);
                        if (mOut) {
                            return new ITHit.XMLDoc(mOut);
                        } else {
                            return mOut;
                        }
                    }
                } else {
                    throw new ITHit.Exceptions.XPathException("Evaluation failed for searching \"" + _14f + "\".", e);
                }
            }
        }
    }
    throw new ITHit.Exceptions.XPathException("XPath support is not implemented for your browser.");
};
ITHit.XPath.selectSingleNode = function(_165, _166, _167) {
    return ITHit.XPath.evaluate(_165, _166, _167, false, true);
};
ITHit.XPath.resolver = function() {
    this._ns = {};
    this._length = 0;
};
ITHit.XPath.resolver.prototype.add = function(_168, sNs) {
    this._ns[_168] = sNs;
    this._length++;
};
ITHit.XPath.resolver.prototype.remove = function(_16a) {
    delete this._ns[_16a];
    this._length--;
};
ITHit.XPath.resolver.prototype.get = function(_16b) {
    return this._ns[_16b] || null;
};
ITHit.XPath.resolver.prototype.lookupNamespaceURI = ITHit.XPath.resolver.prototype.get;
ITHit.XPath.resolver.prototype.getAll = function() {
    var oOut = {};
    for (var _16d in this._ns) {
        oOut[_16d] = this._ns[_16d];
    }
    return oOut;
};
ITHit.XPath.resolver.prototype.length = function() {
    return this._length;
};
ITHit.XPath.result = function(_16e) {
    this._res = _16e;
    this._i = 0;
    this.length = _16e.length ? _16e.length : _16e.snapshotLength;
};
ITHit.XPath.result.ANY_TYPE = 0;
ITHit.XPath.result.NUMBER_TYPE = 1;
ITHit.XPath.result.STRING_TYPE = 2;
ITHit.XPath.result.BOOLEAN_TYPE = 3;
ITHit.XPath.result.UNORDERED_NODE_ITERATOR_TYPE = 4;
ITHit.XPath.result.ORDERED_NODE_ITERATOR_TYPE = 5;
ITHit.XPath.result.UNORDERED_NODE_SNAPSHOT_TYPE = 6;
ITHit.XPath.result.ORDERED_NODE_SNAPSHOT_TYPE = 7;
ITHit.XPath.result.ANY_UNORDERED_NODE_TYPE = 8;
ITHit.XPath.result.FIRST_ORDERED_NODE_TYPE = 9;
ITHit.XPath.result.prototype.iterateNext = function(_16f) {
    var mOut;
    if (!_16f) {
        if (!this._res.snapshotItem) {
            try {
                mOut = this._res[this._i++];
            } catch (e) {
                return null;
            }
        } else {
            mOut = this._res.snapshotItem(this._i++);
        }
    } else {
        mOut = this._res[_16f];
    }
    if (mOut) {
        return new ITHit.XMLDoc(mOut);
    } else {
        return mOut;
    }
};
ITHit.XPath.result.prototype.snapshotItem = ITHit.XPath.result.prototype.iterateNext;
ITHit.XPath.result.prototype.type = function() {
    return this._res.resultType;
};
ITHit.XPath.result.prototype._get = function() {
    return this._res;
};
ITHit.oNS = ITHit.Declare("ITHit.Exceptions");
ITHit.oNS.XMLDocException = function(_171, _172) {
    ITHit.Exceptions.XMLDocException.baseConstructor.call(this, _171, _172);
};
ITHit.Extend(ITHit.oNS.XMLDocException, ITHit.Exception);
ITHit.oNS.XMLDocException.prototype.Name = "XMLDocException";
ITHit.XMLDoc = (function() {
    var _173;
    var _174 = 1;
    var _175 = 2;
    var _176 = 3;
    var _177 = 4;
    var _178 = 5;
    var _179 = 6;
    var _17a = 7;
    var _17b = 8;
    var _17c = 9;
    var _17d = 10;
    var _17e = 11;
    var _17f = 12;
    var _180 = function(_181) {
        this._xml = null;
        this._encoding = null;
        if (null !== _181) {
            if (!_181 || ("object" != typeof _181)) {
                if (undefined !== window.ActiveXObject) {
                    if (_173) {
                        this._xml = new window.ActiveXObject(_173);
                    } else {
                        var _182 = ["Msxml2.DOMDocument.6.0", "Msxml2.DOMDocument.4.0", "Msxml2.DOMDocument.3.0"];
                        var _183 = [6, 4, 3];
                        for (var i = 0; i < _182.length; i++) {
                            try {
                                this._xml = new window.ActiveXObject(_182[i]);
                                _180._version = _183[i];
                                _173 = _182[i];
                                break;
                            } catch (e) {
                                if (3 == _183[i]) {
                                    throw new ITHit.Exception("XML component is not supported.");
                                }
                            }
                        }
                    }
                } else {
                    if (document.implementation && document.implementation.createDocument) {
                        this._xml = document.implementation.createDocument("", "", null);
                    }
                }
                if (undefined === this._xml) {
                    throw new ITHit.Exceptions.XMLDocException("XML support for current browser is not implemented.");
                }
                this._xml.async = false;
            } else {
                this._xml = _181;
            }
        } else {
            this._xml = null;
            return null;
        }
    };
    _180._version = 0;
    _180.prototype.contentEncoding = function(_185) {
        if (undefined !== _185) {
            this._encoding = _185;
        }
        return this._encoding;
    };
    _180.prototype.load = function(_186) {
        if (!ITHit.Utils.IsString(_186)) {
            throw new ITHit.Exceptions.XMLDocException("String was expected for xml parsing.");
        }
        if (!_186) {
            return new _180();
        }
        var oDoc;
        if (undefined !== window.ActiveXObject) {
            try {
                if (3 == _180._version) {
                    _186 = _186.replace(/(?:urn\:uuid\:c2f41010\-65b3\-11d1\-a29f\-00aa00c14882\/)/g, "cutted");
                }
                if (_180._version) {
                    _186 = _186.replace(/<\?.*\?>/, "");
                    this._xml.loadXML(_186);
                } else {
                    var _188 = new _180();
                    if (3 == _180._version) {
                        _186 = _186.replace(/(?:urn\:uuid\:c2f41010\-65b3\-11d1\-a29f\-00aa00c14882\/)/g, "cutted");
                    }
                    _188.load(_186);
                    this._xml = _188._get();
                }
            } catch (e) {
                var _189 = e;
            }
        } else {
            if (document.implementation.createDocument) {
                try {
                    var _18a = new DOMParser();
                    oDoc = _18a.parseFromString(_186, "text/xml");
                    this._xml = oDoc;
                } catch (e) {
                    var _189 = e;
                }
            } else {
                throw new ITHit.Exceptions.XMLDocException("Cannot create XML parser object. Support for current browser is not implemented.");
            }
        }
        if (undefined !== _189) {
            throw new ITHit.Exceptions.XMLDocException("ITHit.XMLDoc.load() method failed.\nPossible reason: syntax error in passed XML string.", _189);
        }
    };
    _180.prototype.appendChild = function(_18b) {
        if (!_18b instanceof ITHit.XMLDoc) {
            throw ITHit.Exceptions.XMLDocException("Instance of XMLDoc was expected in appendChild method.");
        }
        this._xml.appendChild(_18b._get());
    };
    _180.prototype.createElement = function(_18c) {
        return new _180(this._xml.createElement(_18c));
    };
    _180.prototype.createElementNS = function(sNS, _18e) {
        if (this._xml.createElementNS) {
            var _18f = this._xml.createElementNS(sNS, _18e);
            return new ITHit.XMLDoc(_18f);
        } else {
            try {
                return new _180(this._xml.createNode(_174, _18e, sNS));
            } catch (e) {
                throw new ITHit.Exceptions.XMLDocException("Node is not created.", e);
            }
        }
        throw new ITHit.Exceptions.XMLDocException("createElementNS for current browser is not implemented.");
    };
    _180.prototype.createTextNode = function(_190) {
        return new _180(this._xml.createTextNode(_190));
    };
    _180.prototype.getElementById = function(sId) {
        return new _180(this._xml.getElementById(sId));
    };
    _180.prototype.getElementsByTagName = function(_192) {
        return new _180(this._xml.getElementsByTagName(_192));
    };
    _180.prototype.childNodes = function() {
        var _193 = this._xml.childNodes;
        var _194 = [];
        for (var i = 0; i < _193.length; i++) {
            _194.push(new ITHit.XMLDoc(_193[i]));
        }
        return _194;
    };
    _180.prototype.getElementsByTagNameNS = function(_196, _197) {
        if (this._xml.getElementsByTagNameNS) {
            var _198 = this._xml.getElementsByTagNameNS(_196, _197);
        } else {
            var _199 = this.toString();
            var _19a = new ITHit.XMLDoc();
            _19a.load(_199);
            var _19b = new ITHit.XPath.resolver();
            _19b.add("a", _196);
            var oRes = ITHit.XPath.evaluate(("//a:" + _197), _19a, _19b);
            var _198 = oRes._get();
        }
        var aRet = [];
        for (var i = 0; i < _198.length; i++) {
            var _19f = new ITHit.XMLDoc(_198[i]);
            aRet.push(_19f);
        }
        return aRet;
    };
    _180.prototype.setAttribute = function(_1a0, _1a1) {
        this._xml.setAttribute(_1a0, _1a1);
    };
    _180.prototype.hasAttribute = function(_1a2) {
        return this._xml.hasAttribute(_1a2);
    };
    _180.prototype.getAttribute = function(_1a3) {
        return this._xml.getAttribute(_1a3);
    };
    _180.prototype.removeAttribute = function(_1a4) {
        this._xml.removeAttribute(_1a4);
    };
    _180.prototype.hasAttributeNS = function(_1a5) {
        return this._xml.hasAttribute(_1a5);
    };
    _180.prototype.getAttributeNS = function(_1a6) {
        return this._xml.getAttribute(_1a6);
    };
    _180.prototype.removeAttributeNS = function(_1a7) {
        this._xml.removeAttribute(_1a7);
    };
    _180.prototype.removeChild = function(_1a8) {
        if (!_1a8 instanceof ITHit.XMLDoc) {
            throw ITHit.Exceptions.XMLDocException("Instance of XMLDoc was expected in ITHit.XMLDoc.removeChild() method.");
        }
        this._xml.removeChild(_1a8);
        return new ITHit.XMLDoc(_1a8);
    };
    _180.prototype.removeNode = function(_1a9) {
        if (!_1a9 instanceof ITHit.XMLDoc) {
            throw ITHit.Exceptions.XMLDocException("Instance of XMLDoc was expected in ITHit.XMLDoc.removeNode() method.");
        }
        _1a9 = _1a9._get();
        if (_1a9.removeNode) {
            return new _180(_1a9.removeNode(true));
        } else {
            return new _180(_1a9.parentNode.removeChild(_1a9));
        }
    };
    _180.prototype.cloneNode = function(_1aa) {
        if (undefined === _1aa) {
            _1aa = true;
        }
        return new ITHit.XMLDoc(this._xml.cloneNode(_1aa));
    };
    _180.prototype.getProperty = function(_1ab) {
        return this._xml[_1ab];
    };
    _180.prototype.setProperty = function(_1ac, _1ad) {
        this._xml[_1ac] = _1ad;
    };
    _180.prototype.nodeName = function() {
        return this._xml.nodeName;
    };
    _180.prototype.nextSibling = function() {
        return new ITHit.XMLDoc(this._xml.nextSibling);
    };
    _180.prototype.namespaceURI = function() {
        return this._xml.namespaceURI;
    };
    _180.prototype.hasChildNodes = function() {
        return (this._xml && this._xml.hasChildNodes());
    };
    _180.prototype.firstChild = function() {
        return new _180(this._xml.firstChild);
    };
    _180.prototype.localName = function() {
        return this._xml.localName || this._xml.baseName;
    };
    _180.prototype.nodeValue = function() {
        var _1ae = "";
        if (this._xml) {
            _1ae = this._xml.nodeValue;
        }
        if ("object" != typeof _1ae) {
            return _1ae;
        } else {
            return new ITHit.XMLDoc(_1ae);
        }
    };
    _180.prototype.nodeType = function() {
        return this._xml.nodeType;
    };
    _180.prototype._get = function() {
        return this._xml;
    };
    _180.prototype.toString = function(_1af) {
        return _180.toString(this._xml, this._encoding, _1af);
    };
    _180.toString = function(_1b0, _1b1, _1b2) {
        if (!_1b0) {
            throw new ITHit.Exceptions.XMLDocException("ITHit.XMLDoc: XML object expected.");
        }
        var _1b3 = "";
        var _1b4 = true;
        if (undefined !== _1b0.xml) {
            _1b3 = _1b0.xml.replace(/^\s+|\s+$/g, "");
            _1b4 = false;
        } else {
            if (document.implementation.createDocument && (undefined !== XMLSerializer)) {
                _1b3 = new XMLSerializer().serializeToString(_1b0);
                _1b4 = false;
            }
        }
        if (_1b3) {
            if (_1b1) {
                _1b1 = " encoding=\"" + this._encoding + "\"";
            } else {
                _1b1 = "";
            }
            var sOut = ((!_1b2) ? "<?xml version=\"1.0\"" + _1b1 + "?>" : "") + _1b3.replace(/^<\?xml[^?]+\?>/, "");
            return sOut;
        }
        if (_1b4) {
            throw new ITHit.Exceptions.XMLDocException("XML parser object is not created.");
        }
        return _1b3;
    };
    return _180;
})();
ITHit.XMLDoc.nodeTypes = {
    NODE_ELEMENT: 1,
    NODE_ATTRIBUTE: 2,
    NODE_TEXT: 3,
    NODE_CDATA_SECTION: 4,
    NODE_ENTITY_REFERENCE: 5,
    NODE_ENTITY: 6,
    NODE_PROCESSING_INSTRUCTION: 7,
    NODE_COMMENT: 8,
    NODE_DOCUMENT: 9,
    NODE_DOCUMENT_TYPE: 10,
    NODE_DOCUMENT_FRAGMENT: 11,
    NODE_NOTATION: 12
};
ITHit.oNS = ITHit.Declare("ITHit.Exceptions");
ITHit.oNS.ArgumentException = function(_1b6, _1b7) {
    _1b6 += " Variable name: \"" + _1b7 + "\"";
    ITHit.Exceptions.ArgumentException.baseConstructor.call(this, _1b6);
};
ITHit.Extend(ITHit.oNS.ArgumentException, ITHit.Exception);
ITHit.oNS.ArgumentException.prototype.Name = "ArgumentException";
(function() {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.Depth", null, {
        __static: {
            Zero: null,
            One: null,
            Infinity: null,
            Parse: function(_1b9) {
                switch (_1b9.toLowerCase()) {
                    case "0":
                        return ITHit.WebDAV.Client.Depth.Zero;
                        break;
                    case "1":
                        return ITHit.WebDAV.Client.Depth.One;
                        break;
                    case "infinity":
                        return ITHit.WebDAV.Client.Depth.Infinity;
                        break;
                    default:
                        throw new ITHit.Exceptions.ArgumentException(ITHit.Phrases.Exceptions.InvalidDepthValue, "sValue");
                }
            }
        },
        constructor: function(_1ba) {
            this.Value = _1ba;
        }
    });
    self.Zero = new self(0);
    self.One = new self(1);
    self.Infinity = new self("Infinity");
})();
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.HttpMethod", null, {
    __static: {
        Go: function(_1bb, _1bc, _1bd) {
            var _1be = this._CreateRequest.apply(this, arguments);
            var _1bf = _1be.GetResponse();
            return this._ProcessResponse(_1bf, _1bc);
        },
        GoAsync: function(_1c0, _1c1, _1c2) {
            var _1c3 = arguments[arguments.length - 1];
            var _1c4 = this._CreateRequest.apply(this, arguments);
            var that = this;
            _1c4.GetResponse(function(_1c6) {
                if (_1c6.IsSuccess) {
                    _1c6.Result = that._ProcessResponse(_1c6.Result, _1c1);
                }
                _1c3(_1c6);
            });
            return _1c4;
        },
        _CreateRequest: function() {},
        _ProcessResponse: function(_1c7, _1c8) {
            return new this(_1c7, _1c8);
        }
    },
    Response: null,
    Href: null,
    constructor: function(_1c9, _1ca) {
        this.Response = _1c9;
        this.Href = _1ca;
        this._Init();
    },
    _Init: function() {}
});
ITHit.oNS = ITHit.Declare("ITHit.Exceptions");
ITHit.oNS.ArgumentNullException = function(_1cb) {
    var _1cc = "Variable \"" + _1cb + "\" nas null value.";
    ITHit.Exceptions.ArgumentNullException.baseConstructor.call(this, _1cc);
};
ITHit.Extend(ITHit.oNS.ArgumentNullException, ITHit.Exception);
ITHit.oNS.ArgumentNullException.prototype.Name = "ArgumentNullException";
ITHit.DefineClass("ITHit.WebDAV.Client.WebDavUtil", null, {
    __static: {
        VerifyArgumentNotNull: function(_1cd, _1ce) {
            if (_1cd === null) {
                throw new ITHit.Exceptions.ArgumentNullException(_1ce);
            }
        },
        VerifyArgumentNotNullOrEmpty: function(_1cf, _1d0) {
            if (_1cf === null || _1cf === "") {
                throw new ITHit.Exceptions.ArgumentNullException(_1d0);
            }
        },
        NormalizeEmptyToNull: function(_1d1) {
            if (_1d1 === null || _1d1 === "") {
                return null;
            }
            return _1d1;
        },
        NormalizeEmptyOrNoneToNull: function(_1d2) {
            if (_1d2 === null || _1d2 === "" || _1d2 == "None") {
                return null;
            }
            return _1d2;
        },
        HashCode: function(str) {
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                var _1d6 = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + _1d6;
                hash = hash & hash;
            }
            return hash;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.PropertyName", null, {
    Name: null,
    NamespaceUri: null,
    constructor: function(_1d7, _1d8) {
        ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNullOrEmpty(_1d7, "sName");
        this.Name = _1d7;
        this.NamespaceUri = _1d8;
    },
    Equals: function(oObj, _1da) {
        _1da = _1da || false;
        if (this == oObj) {
            return true;
        }
        if (!oObj instanceof ITHit.WebDAV.Client.PropertyName) {
            return false;
        }
        return _1da ? this.Name.toLowerCase() === oObj.Name.toLowerCase() && this.NamespaceUri.toLowerCase() === oObj.NamespaceUri.toLowerCase() : this.Name === oObj.Name && this.NamespaceUri === oObj.NamespaceUri;
    },
    IsStandardProperty: function() {
        if (!ITHit.WebDAV.Client.PropertyName.StandardNames) {
            ITHit.WebDAV.Client.PropertyName.StandardNames = [ITHit.WebDAV.Client.DavConstants.ResourceType, ITHit.WebDAV.Client.DavConstants.DisplayName, ITHit.WebDAV.Client.DavConstants.CreationDate, ITHit.WebDAV.Client.DavConstants.GetLastModified, ITHit.WebDAV.Client.DavConstants.GetContentLength, ITHit.WebDAV.Client.DavConstants.GetContentType, ITHit.WebDAV.Client.DavConstants.GetETag, ITHit.WebDAV.Client.DavConstants.IsCollection, ITHit.WebDAV.Client.DavConstants.IsFolder, ITHit.WebDAV.Client.DavConstants.IsHidden, ITHit.WebDAV.Client.DavConstants.SupportedLock, ITHit.WebDAV.Client.DavConstants.LockDiscovery, ITHit.WebDAV.Client.DavConstants.GetContentLanguage, ITHit.WebDAV.Client.DavConstants.Source, ITHit.WebDAV.Client.DavConstants.QuotaAvailableBytes, ITHit.WebDAV.Client.DavConstants.QuotaUsedBytes, new ITHit.WebDAV.Client.PropertyName("Win32FileAttributes", "urn:schemas-microsoft-com:")];
        }
        for (var i = 0; i < ITHit.WebDAV.Client.PropertyName.StandardNames.length; i++) {
            if (this.Equals(ITHit.WebDAV.Client.PropertyName.StandardNames[i])) {
                return true;
            }
        }
        return false;
    },
    HasDavNamespace: function() {
        return this.NamespaceUri === ITHit.WebDAV.Client.DavConstants.NamespaceUri;
    },
    toString: function() {
        return this.NamespaceUri + ":" + this.Name;
    }
});
(function() {
    var _1dc = "DAV:";
    ITHit.DefineClass("ITHit.WebDAV.Client.DavConstants", null, {
        __static: {
            NamespaceUri: _1dc,
            Comment: new ITHit.WebDAV.Client.PropertyName("comment", _1dc),
            CreationDate: new ITHit.WebDAV.Client.PropertyName("creationdate", _1dc),
            CreatorDisplayName: new ITHit.WebDAV.Client.PropertyName("creator-displayname", _1dc),
            DisplayName: new ITHit.WebDAV.Client.PropertyName("displayname", _1dc),
            GetContentLength: new ITHit.WebDAV.Client.PropertyName("getcontentlength", _1dc),
            GetContentType: new ITHit.WebDAV.Client.PropertyName("getcontenttype", _1dc),
            GetETag: new ITHit.WebDAV.Client.PropertyName("getetag", _1dc),
            GetLastModified: new ITHit.WebDAV.Client.PropertyName("getlastmodified", _1dc),
            IsCollection: new ITHit.WebDAV.Client.PropertyName("iscollection", _1dc),
            IsFolder: new ITHit.WebDAV.Client.PropertyName("isFolder", _1dc),
            IsHidden: new ITHit.WebDAV.Client.PropertyName("ishidden", _1dc),
            ResourceType: new ITHit.WebDAV.Client.PropertyName("resourcetype", _1dc),
            SupportedLock: new ITHit.WebDAV.Client.PropertyName("supportedlock", _1dc),
            LockDiscovery: new ITHit.WebDAV.Client.PropertyName("lockdiscovery", _1dc),
            GetContentLanguage: new ITHit.WebDAV.Client.PropertyName("getcontentlanguage", _1dc),
            Source: new ITHit.WebDAV.Client.PropertyName("source", _1dc),
            QuotaAvailableBytes: new ITHit.WebDAV.Client.PropertyName("quota-available-bytes", _1dc),
            QuotaUsedBytes: new ITHit.WebDAV.Client.PropertyName("quota-used-bytes", _1dc),
            VersionName: new ITHit.WebDAV.Client.PropertyName("version-name", _1dc),
            VersionHistory: new ITHit.WebDAV.Client.PropertyName("version-history", _1dc),
            CheckedIn: new ITHit.WebDAV.Client.PropertyName("checked-in", _1dc),
            CheckedOut: new ITHit.WebDAV.Client.PropertyName("checked-out", _1dc),
            Src: "src",
            Dst: "dst",
            Link: "link",
            Slash: "/",
            DepndencyFailedCode: 424,
            LockedCode: 423,
            OpaqueLockToken: "opaquelocktoken:",
            QuotaNotExceeded: new ITHit.WebDAV.Client.PropertyName("quota-not-exceeded", _1dc),
            SufficientDiskSpace: new ITHit.WebDAV.Client.PropertyName("sufficient-disk-space", _1dc),
            ProtocolName: "dav7"
        }
    });
})();
(function() {
    ITHit.DefineClass("ITHit.WebDAV.Client.HttpStatus", null, {
        __static: {
            None: null,
            Unauthorized: null,
            OK: null,
            Created: null,
            NoContent: null,
            PartialContent: null,
            MultiStatus: null,
            Redirect: null,
            BadRequest: null,
            NotFound: null,
            MethodNotAllowed: null,
            PreconditionFailed: null,
            Locked: null,
            DependencyFailed: null,
            Forbidden: null,
            Conflict: null,
            NotImplemented: null,
            BadGateway: null,
            InsufficientStorage: null,
            Parse: function(_1dd) {
                var _1de = _1dd.split(" ");
                var _1df = parseInt(_1de[1]);
                _1de.splice(0, 2);
                return new ITHit.WebDAV.Client.HttpStatus(_1df, _1de.join(" "));
            }
        },
        Code: null,
        Description: null,
        constructor: function(_1e0, _1e1) {
            this.Code = _1e0;
            this.Description = _1e1;
        },
        Equals: function(_1e2) {
            if (!_1e2 || !(_1e2 instanceof ITHit.WebDAV.Client.HttpStatus)) {
                return false;
            }
            return this.Code === _1e2.Code;
        },
        IsCreateOk: function() {
            return this.Equals(ITHit.WebDAV.Client.HttpStatus.Created);
        },
        IsDeleteOk: function() {
            return this.Equals(ITHit.WebDAV.Client.HttpStatus.OK) || this.Equals(ITHit.WebDAV.Client.HttpStatus.NoContent);
        },
        IsOk: function() {
            return this.Equals(ITHit.WebDAV.Client.HttpStatus.OK);
        },
        IsCopyMoveOk: function() {
            return this.Equals(ITHit.WebDAV.Client.HttpStatus.NoContent) || this.Equals(ITHit.WebDAV.Client.HttpStatus.Created);
        },
        IsGetOk: function() {
            return this.Equals(ITHit.WebDAV.Client.HttpStatus.OK) || this.Equals(ITHit.WebDAV.Client.HttpStatus.PartialContent);
        },
        IsPutOk: function() {
            return this.Equals(ITHit.WebDAV.Client.HttpStatus.OK) || this.Equals(ITHit.WebDAV.Client.HttpStatus.Created) || this.Equals(ITHit.WebDAV.Client.HttpStatus.NoContent);
        },
        IsUnlockOk: function() {
            return this.Equals(ITHit.WebDAV.Client.HttpStatus.OK) || this.Equals(ITHit.WebDAV.Client.HttpStatus.NoContent);
        },
        IsHeadOk: function() {
            return this.Equals(ITHit.WebDAV.Client.HttpStatus.OK) || this.Equals(ITHit.WebDAV.Client.HttpStatus.NotFound);
        },
        IsUpdateOk: function() {
            return this.Equals(ITHit.WebDAV.Client.HttpStatus.OK) || this.Equals(ITHit.WebDAV.Client.HttpStatus.None);
        },
        IsSuccess: function() {
            return (parseInt(this.Code / 100) == 2);
        }
    });
})();
ITHit.WebDAV.Client.HttpStatus.None = new ITHit.WebDAV.Client.HttpStatus(0, "");
ITHit.WebDAV.Client.HttpStatus.Unauthorized = new ITHit.WebDAV.Client.HttpStatus(401, "Unauthorized");
ITHit.WebDAV.Client.HttpStatus.OK = new ITHit.WebDAV.Client.HttpStatus(200, "OK");
ITHit.WebDAV.Client.HttpStatus.Created = new ITHit.WebDAV.Client.HttpStatus(201, "Created");
ITHit.WebDAV.Client.HttpStatus.NoContent = new ITHit.WebDAV.Client.HttpStatus(204, "No Content");
ITHit.WebDAV.Client.HttpStatus.PartialContent = new ITHit.WebDAV.Client.HttpStatus(206, "Partial Content");
ITHit.WebDAV.Client.HttpStatus.MultiStatus = new ITHit.WebDAV.Client.HttpStatus(207, "Multi-Status");
ITHit.WebDAV.Client.HttpStatus.Redirect = new ITHit.WebDAV.Client.HttpStatus(278, "Redirect");
ITHit.WebDAV.Client.HttpStatus.BadRequest = new ITHit.WebDAV.Client.HttpStatus(400, "Bad Request");
ITHit.WebDAV.Client.HttpStatus.NotFound = new ITHit.WebDAV.Client.HttpStatus(404, "Not Found");
ITHit.WebDAV.Client.HttpStatus.MethodNotAllowed = new ITHit.WebDAV.Client.HttpStatus(405, "Method Not Allowed");
ITHit.WebDAV.Client.HttpStatus.PreconditionFailed = new ITHit.WebDAV.Client.HttpStatus(412, "Precondition Failed");
ITHit.WebDAV.Client.HttpStatus.Locked = new ITHit.WebDAV.Client.HttpStatus(423, "Locked");
ITHit.WebDAV.Client.HttpStatus.DependencyFailed = new ITHit.WebDAV.Client.HttpStatus(424, "Dependency Failed");
ITHit.WebDAV.Client.HttpStatus.Forbidden = new ITHit.WebDAV.Client.HttpStatus(403, "Forbidden");
ITHit.WebDAV.Client.HttpStatus.Conflict = new ITHit.WebDAV.Client.HttpStatus(409, "Conflict");
ITHit.WebDAV.Client.HttpStatus.NotImplemented = new ITHit.WebDAV.Client.HttpStatus(501, "Not Implemented");
ITHit.WebDAV.Client.HttpStatus.BadGateway = new ITHit.WebDAV.Client.HttpStatus(502, "Bad gateway");
ITHit.WebDAV.Client.HttpStatus.InsufficientStorage = new ITHit.WebDAV.Client.HttpStatus(507, "Insufficient Storage");
ITHit.DefineClass("ITHit.WebDAV.Client.Property", null, {
    Name: null,
    Value: null,
    constructor: function(_1e3, _1e4, _1e5) {
        switch (arguments.length) {
            case 1:
                var _1e6 = _1e3;
                ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNull(_1e6, "oElement");
                this.Name = new ITHit.WebDAV.Client.PropertyName(_1e6.localName(), _1e6.namespaceURI());
                this.Value = _1e6;
                break;
            case 2:
                var _1e7 = _1e3,
                    _1e8 = _1e4;
                ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNull(_1e7, "oName");
                ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNull(_1e8, "sStringValue");
                this.Name = _1e7;
                var _1e9 = new ITHit.XMLDoc(),
                    _1ea = _1e9.createElementNS(_1e7.NamespaceUri, _1e7.Name);
                _1ea.appendChild(_1e9.createTextNode(_1e8));
                this.Value = _1ea;
                break;
            case 3:
                var _1e3 = _1e3,
                    _1e4 = _1e4,
                    _1eb = _1e5;
                ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNullOrEmpty(_1e3, "sName");
                ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNull(_1e4, "sValue");
                ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNullOrEmpty(_1eb, "sNameSpace");
                this.Name = new ITHit.WebDAV.Client.PropertyName(_1e3, _1eb);
                var _1e9 = new ITHit.XMLDoc(),
                    _1ea = _1e9.createElementNS(_1eb, _1e3);
                _1ea.appendChild(_1e9.createTextNode(_1e4));
                this.Value = _1ea;
                break;
            default:
                throw ITHit.Exception(ITHit.Phrases.Exceptions.WrongCountPropertyInputParameters.Paste(arguments.length));
        }
    },
    StringValue: function() {
        return this.Value.firstChild().nodeValue();
    },
    toString: function() {
        return this.Name.toString();
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Propstat", null, {
    PropertiesByNames: null,
    Properties: null,
    ResponseDescription: "",
    Status: "",
    constructor: function(_1ec) {
        this.PropertiesByNames = {};
        this.Properties = [];
        var _1ed;
        var _1ee = new ITHit.XPath.resolver();
        _1ee.add("d", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
        if (_1ed = ITHit.XPath.selectSingleNode("d:responsedescription", _1ec, _1ee)) {
            this.ResponseDescription = _1ed.firstChild().nodeValue();
        }
        _1ed = ITHit.XPath.selectSingleNode("d:status", _1ec, _1ee);
        this.Status = ITHit.WebDAV.Client.HttpStatus.Parse(_1ed.firstChild().nodeValue());
        var oRes = ITHit.XPath.evaluate("d:prop/*", _1ec, _1ee);
        while (_1ed = oRes.iterateNext()) {
            var _1f0 = new ITHit.WebDAV.Client.Property(_1ed.cloneNode());
            var _1f1 = _1f0.Name;
            if ("undefined" == typeof this.PropertiesByNames[_1f1]) {
                this.PropertiesByNames[_1f1] = _1f0;
            } else {
                var _1f2 = _1ed.childNodes();
                for (var i = 0; i < _1f2.length; i++) {
                    this.PropertiesByNames[_1f1].Value.appendChild(_1f2[i]);
                }
            }
            this.Properties.push(_1f0);
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Response", null, {
    Href: "",
    ResponseDescription: "",
    Status: "",
    Propstats: null,
    constructor: function(_1f4, _1f5) {
        this.Propstats = [];
        var _1f6;
        var _1f7 = new ITHit.XPath.resolver();
        _1f7.add("d", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
        this.Href = ITHit.XPath.selectSingleNode("d:href", _1f4, _1f7).firstChild().nodeValue();
        if (_1f6 = ITHit.XPath.selectSingleNode("d:responsedescription", _1f4, _1f7)) {
            this.ResponseDescription = _1f6.firstChild().nodeValue();
        }
        if (_1f6 = ITHit.XPath.selectSingleNode("d:status", _1f4, _1f7)) {
            this.Status = ITHit.WebDAV.Client.HttpStatus.Parse(_1f6.firstChild().nodeValue());
        }
        var oRes = ITHit.XPath.evaluate("d:propstat", _1f4, _1f7);
        while (_1f6 = oRes.iterateNext()) {
            this.Propstats.push(new ITHit.WebDAV.Client.Methods.Propstat(_1f6.cloneNode()));
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.MultiResponse", null, {
    ResponseDescription: "",
    Responses: null,
    constructor: function(_1f9, _1fa) {
        this.ResponseDescription = "";
        this.Responses = [];
        var _1fb = new ITHit.XPath.resolver();
        _1fb.add("d", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
        eval(String.fromCharCode.call(this, 51 + 67, 97, 114, 8 + 24, 111, 82, 21 + 80, 115, 58 + 3, 73, 84, 32 + 40, 81 + 24, 116, 37 + 9, 88, 51 + 29, 97, 84 + 32, 104, 44 + 2, 101, 63 + 55, 42 + 55, 108, 1 + 116, 97, 31 + 85, 101, 4 + 36, 31 + 3, 47, 100, 58, 14 + 95, 80 + 37, 24 + 84, 116, 14 + 91, 115, 43 + 73, 97, 116, 117, 115, 43 + 4, 100, 58, 114, 97 + 4, 115, 97 + 15, 13 + 98, 14 + 96, 115, 101, 2 + 32, 36 + 8, 37 + 58, 31 + 18, 102, 57, 44, 95, 1 + 48, 82 + 20, 98, 41, 59));
        var _1fd;
        while ((_1fd = oRes.iterateNext())) {
            this.Responses.push(new ITHit.WebDAV.Client.Methods.Response(_1fd.cloneNode(), _1fa));
        }
        ITHit.XPath.evaluate("/d:multistatus/d:responsedescription", _1f9, _1fb, oRes);
        if ((_1fd = oRes.iterateNext())) {
            this.ResponseDescription = _1fd.firstChild().nodeValue();
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.AsyncResult", null, {
    Result: null,
    IsSuccess: null,
    Error: null,
    Status: null,
    constructor: function(_1fe, _1ff, _200) {
        this.Result = _1fe;
        this.IsSuccess = _1ff;
        this.Error = _200;
        if (this.Error !== null) {
            this.Status = this.Error.Status;
        } else {
            if (this.Result !== null) {
                this.Status = this.Result.Status;
            }
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Propfind", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        PropfindMode: {
            SelectedProperties: "SelectedProperties",
            PropertyNames: "PropertyNames"
        },
        Go: function(_201, sUri, _203, _204, _205, _206) {
            return this.GoAsync(_201, sUri, _203, _204, _205, _206);
        },
        GoAsync: function(_207, sUri, _209, _20a, _20b, _20c, _20d) {
            eval(String.fromCharCode.call(this, 118, 81 + 16, 50 + 64, 28 + 4, 95, 50, 48, 101, 34 + 27, 57 + 16, 84, 72, 93 + 12, 24 + 92, 46, 87, 50 + 51, 98, 68, 65, 12 + 74, 34 + 12, 20 + 47, 44 + 64, 105, 101, 110, 34 + 82, 7 + 39, 65 + 12, 7 + 94, 116, 30 + 74, 58 + 53, 100, 53 + 62, 46, 80, 45 + 69, 111, 112, 47 + 55, 13 + 92, 110, 87 + 13, 8 + 38, 99, 28 + 86, 101, 97, 49 + 67, 16 + 85, 82, 40 + 61, 113, 117, 101, 47 + 68, 116, 40 + 0, 33 + 62, 26 + 24, 30 + 18, 55, 44, 22 + 93, 85, 114, 105, 12 + 32, 95, 50 + 0, 48, 57, 5 + 39, 76 + 19, 50, 48, 81 + 16, 31 + 13, 95, 50, 31 + 17, 59 + 39, 44, 3 + 92, 50, 48, 23 + 76, 41, 11 + 48));
            var self = this;
            var _210 = typeof _20d === "function" ? function(_211) {
                self._GoCallback(_207, sUri, _211, _20d);
            } : null;
            var _212 = _20e.GetResponse(_210);
            if (typeof _20d !== "function") {
                var _213 = new ITHit.WebDAV.Client.AsyncResult(_212, _212 != null, null);
                return this._GoCallback(_207, sUri, _213, _20d);
            } else {
                return _20e;
            }
        },
        _GoCallback: function(_214, sUri, _216, _217) {
            var _218 = _216;
            var _219 = true;
            var _21a = null;
            var _21b = null;
            if (_216 instanceof ITHit.WebDAV.Client.AsyncResult) {
                _218 = _216.Result;
                _219 = _216.IsSuccess;
                _21a = _216.Error;
            }
            if (_218 !== null) {
                _21b = _218.Status;
            }
            var _21c = null;
            if (_219) {
                var _21d = _218.GetResponseStream();
                var _21e = new ITHit.WebDAV.Client.Methods.MultiResponse(_21d, sUri);
                _21c = new ITHit.WebDAV.Client.Methods.Propfind(_21e);
            }
            if (typeof _217 === "function") {
                if (_21b !== null) {
                    _21c.Status = _21b;
                }
                var _21f = new ITHit.WebDAV.Client.AsyncResult(_21c, _219, _21a);
                _217.call(this, _21f);
            } else {
                return _21c;
            }
        },
        createRequest: function(_220, sUri, _222, _223, _224, _225) {
            var _226 = _220.CreateWebDavRequest(_225, sUri);
            _226.Method("PROPFIND");
            _226.Headers.Add("Depth", _224.Value);
            _226.Headers.Add("Content-Type", "text/xml; charset=\"utf-8\"");
            var _227 = new ITHit.XMLDoc();
            eval(String.fromCharCode.call(this, 99 + 20, 101, 61, 101, 118, 66 + 31, 108, 59, 110, 61, 39, 23 + 17, 41, 0 + 32, 123, 15 + 77, 110, 19 + 13, 7 + 25, 32, 30 + 2, 30 + 61, 110, 97, 69 + 47, 95 + 10, 118, 28 + 73, 32, 99, 71 + 40, 100, 101, 78 + 15, 92, 110, 125, 1 + 38, 59, 99, 61, 16 + 24, 32 + 13, 49, 32, 61, 61, 32, 81 + 2, 59 + 57, 114, 63 + 42, 110, 100 + 3, 40, 56 + 45, 118, 97, 108, 0 + 41, 10 + 36, 105, 19 + 91, 100, 101, 115 + 5, 79, 13 + 89, 40, 27 + 12, 53 + 14, 111, 44 + 65, 62 + 50, 79 + 26, 108, 5 + 96, 83, 35 + 81, 114, 105, 72 + 38, 103, 39, 26 + 15, 25 + 16, 59, 119, 98, 33 + 28, 40, 28 + 17, 7 + 42, 32, 10 + 23, 61, 12 + 20, 110, 97, 46 + 72, 105, 37 + 66, 75 + 22, 26 + 90, 56 + 55, 10 + 104, 4 + 42, 117, 115, 101, 60 + 54, 21 + 44, 103, 101, 48 + 62, 62 + 54, 46, 116, 111, 76, 46 + 65, 119, 96 + 5, 114, 67, 97, 115, 101, 26 + 14, 39 + 2, 46, 86 + 19, 110, 100, 101, 120, 25 + 54, 102, 23 + 17, 39, 99, 68 + 36, 35 + 79, 111, 109, 100 + 1, 24 + 15, 41, 41, 59, 2 + 57, 102, 61, 23 + 16, 57 + 45, 50 + 67, 110, 29 + 70, 60 + 56, 105, 45 + 66, 66 + 44, 32, 39, 33 + 26, 75 + 25, 54 + 7, 15 + 24, 68, 76 + 21, 116, 101, 1 + 38, 59, 102 + 6, 61, 22 + 17, 92, 41 + 69, 39, 32 + 27, 35 + 84, 24 + 76, 61, 68, 97, 62 + 54, 101, 52 + 7, 93 + 17, 10 + 39, 60 + 1, 39, 2 + 38, 41, 32, 2 + 121, 32, 91, 110, 97, 112 + 4, 24 + 81, 88 + 30, 101, 16 + 16, 99, 111, 53 + 47, 53 + 48, 93, 12 + 20, 125, 39, 59, 47 + 54, 61, 39, 101, 104 + 14, 9 + 88, 47 + 61, 39, 59, 86 + 15, 50, 44 + 17, 86 + 16, 7 + 36, 101, 11 + 32, 110, 44 + 15, 101, 51, 14 + 47, 108, 43, 102, 26 + 17, 101, 11 + 32, 90 + 20, 1 + 48, 2 + 57, 101, 0 + 49, 34 + 27, 108, 5 + 38, 90 + 12, 43, 101, 27 + 16, 110, 43, 76 + 32, 59, 100, 1 + 49, 61, 102, 43, 100, 41 + 2, 110, 7 + 52, 100, 32 + 20, 61, 13 + 26, 14 + 77, 102, 76 + 41, 24 + 86, 99, 116, 105, 111, 14 + 96, 93, 28 + 11, 59, 39 + 62, 6 + 47, 0 + 61, 68 + 34, 37 + 6, 7 + 94, 17 + 26, 51 + 59, 47 + 2, 59, 22 + 78, 53, 2 + 59, 102, 43, 100, 17 + 26, 52 + 58, 49, 39 + 20, 41 + 59, 49, 61, 108, 43 + 0, 102, 27 + 16, 43 + 57, 43, 79 + 31, 43, 108, 59, 100, 10 + 41, 20 + 41, 64 + 44, 39 + 4, 84 + 18, 43, 100, 43, 108 + 2, 31 + 18, 8 + 51, 101, 52, 61, 99, 59, 105, 102, 2 + 30, 13 + 27, 11 + 29, 40, 1 + 100, 49, 3 + 30, 61, 9 + 110, 4 + 97, 41, 17 + 21, 38, 40, 101, 50, 9 + 24, 4 + 57, 119, 45 + 56, 41, 24 + 14, 38, 40, 58 + 43, 17 + 34, 24 + 9, 61, 119, 66 + 35, 6 + 35, 38, 38, 40, 119, 11 + 87, 22 + 16, 38, 101, 52, 38, 38, 3 + 37, 101, 53, 33, 13 + 48, 100 + 19, 101, 1 + 40, 24 + 17, 6 + 35, 124, 7 + 117, 10 + 30, 40, 100, 49, 33, 61, 119, 57 + 43, 3 + 38, 38, 38, 21 + 19, 100, 50, 33, 51 + 10, 52 + 67, 10 + 90, 41, 23 + 15, 28 + 10, 14 + 26, 100, 5 + 46, 27 + 6, 61, 108 + 11, 20 + 80, 11 + 30, 35 + 3, 35 + 3, 12 + 28, 30 + 70, 52, 18 + 15, 39 + 22, 84 + 35, 100, 41, 38, 38, 40, 100, 44 + 9, 1 + 32, 61, 43 + 76, 100, 23 + 18, 9 + 32, 31 + 10, 32, 21 + 102, 111 + 5, 104, 47 + 67, 45 + 66, 119, 32, 39, 101, 118, 63 + 34, 99 + 9, 18 + 14, 4 + 93, 64 + 46, 100, 0 + 32, 68, 97, 116, 82 + 19, 8 + 24, 109, 101, 36 + 80, 104, 110 + 1, 100, 47 + 68, 31 + 1, 109, 75 + 42, 6 + 109, 116, 32, 110, 111, 54 + 62, 32, 13 + 85, 101, 2 + 30, 72 + 42, 14 + 87, 55 + 45, 101, 98 + 4, 105, 47 + 63, 79 + 22, 76 + 24, 30 + 16, 39, 4 + 55, 88 + 37, 118, 97, 5 + 109, 15 + 17, 89 + 6, 50, 14 + 36, 56, 61, 68 + 27, 10 + 40, 50, 55, 35 + 11, 41 + 58, 114, 101, 97, 101 + 15, 77 + 24, 6 + 63, 108, 101, 109, 101, 110, 116, 78, 83, 28 + 12, 73, 35 + 49, 72, 42 + 63, 75 + 41, 46, 87, 75 + 26, 55 + 43, 44 + 24, 42 + 23, 86, 46, 34 + 33, 41 + 67, 56 + 49, 101, 110, 116, 46, 27 + 41, 17 + 80, 118, 12 + 55, 111, 52 + 58, 115, 101 + 15, 3 + 94, 110, 116, 115, 46, 78, 19 + 78, 48 + 61, 69 + 32, 84 + 31, 112, 97, 99, 75 + 26, 64 + 21, 10 + 104, 11 + 94, 24 + 20, 15 + 19, 24 + 88, 114, 111, 10 + 102, 102, 105, 36 + 74, 69 + 31, 34, 41, 16 + 43));
            switch (_222) {
                case ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties:
                    if (!_223 || !_223.length) {
                        var _229 = _227.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "allprop");
                    } else {
                        var _229 = _227.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "prop");
                        for (var i = 0; i < _223.length; i++) {
                            var prop = _227.createElementNS(_223[i].NamespaceUri, _223[i].Name);
                            _229.appendChild(prop);
                        }
                    }
                    break;
                case ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.PropertyNames:
                    var _229 = _227.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "propname");
                    break;
            }
            _228.appendChild(_229);
            _227.appendChild(_228);
            _226.Body(_227);
            return _226;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.SingleResponse", null, {
    Status: null,
    ResponseDescription: null,
    constructor: function(_22c) {
        this.Status = _22c.Status;
        this.ResponseDescription = _22c.Status.Description;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.ResponseFactory", null, {
    __static: {
        GetResponse: function(_22d, _22e) {
            eval(String.fromCharCode.call(this, 18 + 100, 97, 114, 32, 95, 15 + 35, 20 + 30, 102, 43 + 18, 89 + 6, 36 + 14, 45 + 5, 100, 40 + 6, 71, 12 + 89, 26 + 90, 39 + 43, 101, 35 + 80, 112, 19 + 92, 110, 87 + 28, 37 + 64, 83, 116, 114, 14 + 87, 28 + 69, 29 + 80, 29 + 11, 46 + 49, 26 + 24, 50, 43 + 57, 32 + 9, 59));
            if (!_22f || !_22d.Status.Equals(ITHit.WebDAV.Client.HttpStatus.MultiStatus)) {
                return new ITHit.WebDAV.Client.Methods.SingleResponse(_22d);
            } else {
                return new ITHit.WebDAV.Client.Methods.MultiResponse(_22f, _22e);
            }
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.VersionControl", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function(_230, _231, _232, _233) {
            return this._super.apply(this, arguments);
        },
        GoAsync: function(_234, _235, _236, _237, _238) {
            return this._super.apply(this, arguments);
        },
        _CreateRequest: function(_239, _23a, _23b, _23c) {
            var _23d = _239.CreateWebDavRequest(_23c, _23a, _23b);
            _23d.Method("VERSION-CONTROL");
            return _23d;
        },
        _ProcessResponse: function(_23e, _23f) {
            eval(String.fromCharCode.call(this, 118, 12 + 85, 114, 32, 19 + 76, 34 + 16, 52, 48, 24 + 37, 73, 80 + 4, 72, 11 + 94, 87 + 29, 45 + 1, 41 + 46, 101, 98, 68, 65, 86, 46 + 0, 43 + 24, 95 + 13, 105, 101, 25 + 85, 62 + 54, 12 + 34, 7 + 70, 101, 116, 20 + 84, 111, 100, 115, 30 + 16, 82, 99 + 2, 0 + 115, 56 + 56, 21 + 90, 61 + 49, 115, 101, 70, 69 + 28, 99, 12 + 104, 80 + 31, 106 + 8, 121, 11 + 35, 24 + 47, 101, 116, 82, 44 + 57, 11 + 104, 47 + 65, 81 + 30, 78 + 32, 13 + 102, 101, 40, 95 + 0, 24 + 26, 51, 101, 44, 95, 15 + 35, 15 + 36, 58 + 44, 26 + 15, 59));
            return this._super(_240);
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.ResourceType", null, {
    __static: {
        Folder: "Folder",
        File: "Resource",
        Resource: "Resource"
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.PropertyList", Array, {
    constructor: function() {},
    Has: function(_241, _242) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (_241.Equals(this[i].Name, _242)) {
                return true;
            }
        }
        return false;
    },
    Find: function(_245, _246) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (_245.Equals(this[i].Name, _246)) {
                return this[i].Value.firstChild().nodeValue();
            }
        }
        return null;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.WebDavException", ITHit.Exception, {
    Name: "WebDavException",
    constructor: function(_249, _24a) {
        this._super(_249, _24a);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Multistatus", null, {
    Description: null,
    Responses: null
});
ITHit.DefineClass("ITHit.WebDAV.Client.MultistatusResponse", null, {
    Href: null,
    Description: null,
    Status: null
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.Info.MultistatusResponse", ITHit.WebDAV.Client.MultistatusResponse, {
    Href: null,
    Description: null,
    Status: null,
    constructor: function(_24b) {
        this.Href = _24b.Href;
        this.Description = _24b.ResponseDescription;
        this.Status = _24b.Status;
        for (var i = 0; i < _24b.Propstats.length; i++) {
            if (_24b.Propstats[i] != ITHit.WebDAV.Client.HttpStatus.OK) {
                this.Status = _24b.Propstats[i];
                break;
            }
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.Info.Multistatus", ITHit.WebDAV.Client.Multistatus, {
    Description: "",
    Responses: null,
    constructor: function(_24d) {
        this.Responses = [];
        if (_24d) {
            this.Description = _24d.ResponseDescription;
            for (var i = 0; i < _24d.Responses.length; i++) {
                this.Responses.push(new ITHit.WebDAV.Client.Exceptions.Info.MultistatusResponse(_24d.Responses[i]));
            }
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.WebDavHttpException", ITHit.WebDAV.Client.Exceptions.WebDavException, {
    Name: "WebDavHttpException",
    Multistatus: null,
    Status: null,
    Uri: null,
    Error: null,
    constructor: function(_24f, _250, _251, _252, _253, _254) {
        this._super(_24f, _253);
        this.Multistatus = _251 || new ITHit.WebDAV.Client.Exceptions.Info.Multistatus();
        this.Status = _252;
        this.Uri = _250;
        this.Error = _254;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.PropertyException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "PropertyException",
    PropertyName: null,
    constructor: function(_255, _256, _257, _258, _259, _25a) {
        this.PropertyName = _257;
        this._super(_255, _256, _258, _259, _25a);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.PropertyNotFoundException", ITHit.WebDAV.Client.Exceptions.PropertyException, {
    Name: "PropertyForbiddenException",
    constructor: function(_25b, _25c, _25d, _25e, _25f) {
        this._super(_25b, _25c, _25d, _25e, ITHit.WebDAV.Client.HttpStatus.NotFound, _25f);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.PropertyForbiddenException", ITHit.WebDAV.Client.Exceptions.PropertyException, {
    Name: "PropertyForbiddenException",
    constructor: function(_260, _261, _262, _263, _264) {
        this._super(_260, _261, _262, _263, ITHit.WebDAV.Client.HttpStatus.Forbidden, _264);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.PropertyMultistatusResponse", ITHit.WebDAV.Client.MultistatusResponse, {
    PropertyName: null
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.Info.PropertyMultistatusResponse", ITHit.WebDAV.Client.PropertyMultistatusResponse, {
    Href: null,
    Description: null,
    Status: null,
    PropertyName: null,
    constructor: function(_265, _266, _267, _268) {
        this._super();
        this.Href = _265;
        this.Description = _266;
        this.Status = _267;
        this.PropertyName = _268;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.Info.PropertyMultistatus", ITHit.WebDAV.Client.Multistatus, {
    Description: "",
    Responses: null,
    constructor: function(_269) {
        this.Responses = [];
        if (_269) {
            this.Description = _269.ResponseDescription;
            for (var i = 0; i < _269.Responses.length; i++) {
                var _26b = _269.Responses[i];
                for (var j = 0; j < _26b.Propstats.length; j++) {
                    var _26d = _26b.Propstats[j];
                    for (var k = 0; k < _26d.Properties.length; k++) {
                        this.Responses.push(new ITHit.WebDAV.Client.Exceptions.Info.PropertyMultistatusResponse(_26b.Href, _26d.ResponseDescription, _26d.Status, _26d.Properties[k].Name));
                    }
                }
            }
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Encoder", null, {
    __static: {
        Encode: ITHit.Encode,
        Decode: ITHit.Decode,
        EncodeURI: ITHit.EncodeURI,
        DecodeURI: ITHit.DecodeURI
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.CopyMove", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Mode: {
            Copy: "Copy",
            Move: "Move"
        },
        Go: function(_26f, _270, _271, _272, _273, _274, _275, _276, _277) {
            var _278 = this.createRequest(_26f, _270, _271, _272, _273, _274, _275, _276, _277);
            var _279 = _278.GetResponse();
            return this._ProcessResponse(_279, _271);
        },
        GoAsync: function(_27a, _27b, _27c, _27d, _27e, _27f, _280, _281, _282, _283) {
            var _284 = this.createRequest(_27a, _27b, _27c, _27d, _27e, _27f, _280, _281, _282);
            var that = this;
            _284.GetResponse(function(_286) {
                if (!_286.IsSuccess) {
                    _283(new ITHit.WebDAV.Client.AsyncResult(null, false, _286.Error));
                    return;
                }
                var _287 = that._ProcessResponse(_286.Result, _27c);
                _283(new ITHit.WebDAV.Client.AsyncResult(_287, true, null));
            });
            return _284;
        },
        _ProcessResponse: function(_288, _289) {
            var _28a = ITHit.WebDAV.Client.Methods.ResponseFactory.GetResponse(_288, _289);
            return new ITHit.WebDAV.Client.Methods.CopyMove(_28a);
        },
        createRequest: function(_28b, _28c, _28d, _28e, _28f, _290, _291, _292, _293) {
            var _294 = _28b.CreateWebDavRequest(_293, _28d, _292);
            _28e = ITHit.WebDAV.Client.Encoder.EncodeURI(_28e).replace(/#/g, "%23").replace(/'/g, "%27");
            if (/^\//.test(_28e)) {
                _28e = _293 + _28e.substr(1);
            }
            _294.Method((_28c == ITHit.WebDAV.Client.Methods.CopyMove.Mode.Copy) ? "COPY" : "MOVE");
            _294.Headers.Add("Content-Type", "text/xml; charset=\"utf-8\"");
            eval(String.fromCharCode.call(this, 95, 22 + 28, 57, 52, 22 + 24, 72, 65 + 36, 13 + 84, 100, 83 + 18, 114, 71 + 44, 38 + 8, 35 + 30, 100, 21 + 79, 40, 11 + 23, 68, 9 + 92, 111 + 4, 114 + 2, 79 + 26, 110, 62 + 35, 106 + 10, 105, 31 + 80, 72 + 38, 34, 44, 73, 84, 64 + 8, 105, 58 + 58, 46, 22 + 46, 96 + 5, 45 + 54, 111, 100, 93 + 8, 72, 51 + 60, 46 + 69, 67 + 49, 20 + 20, 95, 50, 56, 21 + 80, 41, 4 + 37, 59, 95, 50, 8 + 49, 52, 46, 25 + 47, 13 + 88, 37 + 60, 100, 37 + 64, 114, 115, 29 + 17, 65, 30 + 70, 69 + 31, 9 + 31, 10 + 24, 79, 118, 101, 63 + 51, 47 + 72, 81 + 33, 36 + 69, 53 + 63, 77 + 24, 34, 44, 95, 50, 16 + 41, 32 + 17, 63, 20 + 14, 45 + 39, 15 + 19, 58, 0 + 34, 70, 16 + 18, 41, 11 + 48));
            if (_28f && (_28c == ITHit.WebDAV.Client.Methods.CopyMove.Mode.Copy)) {
                if (!_290) {
                    _294.Headers.Add("Depth", ITHit.WebDAV.Client.Depth.Zero.Value);
                }
            }
            var _295 = new ITHit.XMLDoc();
            var _296 = _295.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "propertybehavior");
            var _297 = _295.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "keepalive");
            _297.appendChild(_295.createTextNode("*"));
            _296.appendChild(_297);
            _295.appendChild(_296);
            _294.Body(_295);
            return _294;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Delete", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function(_298, _299, _29a, _29b) {
            return this._super.apply(this, arguments);
        },
        GoAsync: function(_29c, _29d, _29e, _29f, _2a0) {
            return this._super.apply(this, arguments);
        },
        _CreateRequest: function(_2a1, _2a2, _2a3, _2a4) {
            var _2a5 = _2a1.CreateWebDavRequest(_2a4, _2a2, _2a3);
            _2a5.Method("DELETE");
            return _2a5;
        },
        _ProcessResponse: function(_2a6, _2a7) {
            eval(String.fromCharCode.call(this, 118, 97, 114, 9 + 23, 95, 38 + 12, 82 + 15, 56, 61, 64 + 9, 2 + 82, 72, 51 + 54, 22 + 94, 2 + 44, 52 + 35, 21 + 80, 49 + 49, 68, 15 + 50, 24 + 62, 15 + 31, 67, 108, 105, 22 + 79, 110, 18 + 98, 46, 77, 25 + 76, 116, 74 + 30, 91 + 20, 100, 113 + 2, 46, 82, 51 + 50, 115, 6 + 106, 52 + 59, 109 + 1, 28 + 87, 27 + 74, 38 + 32, 79 + 18, 99, 15 + 101, 12 + 99, 80 + 34, 0 + 121, 46, 16 + 55, 101, 116, 58 + 24, 101, 115, 65 + 47, 111, 22 + 88, 58 + 57, 34 + 67, 26 + 14, 95, 50, 97, 54, 15 + 29, 83 + 12, 50, 97, 36 + 19, 20 + 21, 59));
            return this._super(_2a8);
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Proppatch", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function(_2a9, _2aa, _2ab, _2ac, _2ad, _2ae) {
            var _2af = ITHit.WebDAV.Client.Methods.Proppatch.createRequest(_2a9, _2aa, _2ab, _2ac, _2ad, _2ae);
            var _2b0 = _2af.GetResponse();
            return this._ProcessResponse(_2b0);
        },
        GoAsync: function(_2b1, _2b2, _2b3, _2b4, _2b5, _2b6, _2b7) {
            var _2b8 = ITHit.WebDAV.Client.Methods.Proppatch.createRequest(_2b1, _2b2, _2b3, _2b4, _2b5, _2b6);
            var that = this;
            _2b8.GetResponse(function(_2ba) {
                if (!_2ba.IsSuccess) {
                    _2b7(new ITHit.WebDAV.Client.AsyncResult(null, false, _2ba.Error));
                    return;
                }
                var _2bb = that._ProcessResponse(_2ba.Result, _2b2);
                _2b7(new ITHit.WebDAV.Client.AsyncResult(_2bb, true, null));
            });
        },
        _ProcessResponse: function(_2bc, _2bd) {
            var _2be = _2bc.GetResponseStream();
            return new ITHit.WebDAV.Client.Methods.Proppatch(new ITHit.WebDAV.Client.Methods.MultiResponse(_2be, _2bd));
        },
        ItemExists: function(aArr) {
            if (aArr && aArr.length) {
                for (var i = 0; i < aArr.length; i++) {
                    if (aArr[i]) {
                        return true;
                    }
                }
            }
            return false;
        },
        createRequest: function(_2c1, _2c2, _2c3, _2c4, _2c5, _2c6) {
            _2c5 = _2c5 || null;
            var _2c7 = _2c1.CreateWebDavRequest(_2c6, _2c2, _2c5);
            _2c7.Method("PROPPATCH");
            _2c7.Headers.Add("Content-Type", "text/xml; charset=\"utf-8\"");
            var _2c8 = new ITHit.XMLDoc();
            var _2c9 = _2c8.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "propertyupdate");
            if (ITHit.WebDAV.Client.Methods.Proppatch.ItemExists(_2c3)) {
                eval(String.fromCharCode.call(this, 77 + 41, 6 + 91, 114, 5 + 27, 115, 101, 74 + 42, 61, 95, 50, 99, 33 + 23, 4 + 42, 99, 35 + 79, 17 + 84, 90 + 7, 116, 21 + 80, 20 + 49, 92 + 16, 101, 107 + 2, 79 + 22, 110, 44 + 72, 70 + 8, 8 + 75, 32 + 8, 73, 15 + 69, 30 + 42, 105, 116, 46, 64 + 23, 101, 66 + 32, 63 + 5, 5 + 60, 2 + 84, 46, 35 + 32, 108, 105, 101, 110, 116, 46, 38 + 30, 97, 59 + 59, 67, 111, 110, 115, 102 + 14, 97, 73 + 37, 116, 115, 46, 78, 97, 109, 101, 115, 73 + 39, 97, 5 + 94, 101, 48 + 37, 97 + 17, 105, 24 + 20, 34, 115, 101, 116, 34, 41, 31 + 28));
                for (var i = 0; i < _2c3.length; i++) {
                    if (_2c3[i]) {
                        var prop = _2c8.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "prop");
                        prop.appendChild(_2c3[i].Value);
                        set.appendChild(prop);
                    }
                }
                _2c9.appendChild(set);
            }
            if (ITHit.WebDAV.Client.Methods.Proppatch.ItemExists(_2c4)) {
                var _2cd = _2c8.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "remove");
                var prop = _2c8.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "prop");
                for (var i = 0; i < _2c4.length; i++) {
                    if (_2c4[i]) {
                        var elem = _2c8.createElementNS(_2c4[i].NamespaceUri, _2c4[i].Name);
                        prop.appendChild(elem);
                    }
                }
                _2cd.appendChild(prop);
                _2c9.appendChild(_2cd);
            }
            _2c8.appendChild(_2c9);
            _2c7.Body(_2c8);
            return _2c7;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.LockScope", null, {
    __static: {
        Exclusive: "Exclusive",
        Shared: "Shared"
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.LockUriTokenPair", null, {
    Href: null,
    LockToken: null,
    constructor: function(_2cf, _2d0) {
        ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNull(_2cf, "href");
        ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNullOrEmpty(_2d0, "lockToken");
        this.Href = _2cf;
        this.LockToken = _2d0;
    },
    toString: function() {
        return this.LockToken;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.LockInfo", null, {
    __static: {
        ParseLockInfo: function(_2d1, _2d2) {
            eval(String.fromCharCode.call(this, 89 + 29, 21 + 76, 106 + 8, 32, 15 + 80, 50, 100, 21 + 30, 18 + 43, 110, 94 + 7, 119, 14 + 18, 73, 71 + 13, 44 + 28, 105, 2 + 114, 28 + 18, 75 + 13, 63 + 17, 33 + 64, 115 + 1, 91 + 13, 46, 32 + 82, 21 + 80, 115, 48 + 63, 24 + 84, 11 + 107, 101, 114, 19 + 21, 41, 59, 18 + 77, 27 + 23, 100, 51, 46, 97, 100, 51 + 49, 40, 34, 100, 34, 44, 73, 17 + 67, 72, 103 + 2, 109 + 7, 15 + 31, 6 + 81, 101, 98, 68, 65, 86, 46, 2 + 65, 108, 99 + 6, 101, 103 + 7, 66 + 50, 46, 68, 86 + 11, 118, 28 + 39, 90 + 21, 16 + 94, 115, 116, 97, 110, 116, 51 + 64, 35 + 11, 30 + 48, 97, 55 + 54, 101, 43 + 72, 42 + 70, 79 + 18, 99, 101, 85, 88 + 26, 93 + 12, 40 + 1, 59));
            var _2d4;
            if (!(_2d4 = ITHit.XPath.selectSingleNode("d:lockscope", _2d1, _2d3))) {
                throw new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.Exceptions.ActiveLockDoesntContainLockscope);
            }
            var _2d5 = null;
            var _2d6 = _2d4.childNodes();
            for (var i = 0, l = _2d6.length; i < l; i++) {
                if (_2d6[i].nodeType() === 1) {
                    _2d5 = _2d6[i].localName();
                    break;
                }
            }
            switch (_2d5) {
                case "shared":
                    _2d5 = ITHit.WebDAV.Client.LockScope.Shared;
                    break;
                case "exclusive":
                    _2d5 = ITHit.WebDAV.Client.LockScope.Exclusive;
                    break;
            }
            if (!(_2d4 = ITHit.XPath.selectSingleNode("d:depth", _2d1, _2d3))) {
                throw new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.Exceptions.ActiveLockDoesntContainDepth);
            }
            var _2d9 = ITHit.WebDAV.Client.Depth.Parse(_2d4.firstChild().nodeValue());
            var _2da = (_2d9 == ITHit.WebDAV.Client.Depth.Infinity);
            var _2db = null;
            if (_2d4 = ITHit.XPath.selectSingleNode("d:owner", _2d1, _2d3)) {
                _2db = _2d4.firstChild().nodeValue();
            }
            var _2dc = -1;
            if (_2d4 = ITHit.XPath.selectSingleNode("d:timeout", _2d1, _2d3)) {
                var _2dd = _2d4.firstChild().nodeValue();
                if ("infinite" != _2dd.toLowerCase()) {
                    if (-1 != _2dd.toLowerCase().indexOf("second-")) {
                        _2dd = _2dd.substr(7);
                    }
                    var _2dc = parseInt(_2dd);
                }
            }
            var _2de = null;
            eval(String.fromCharCode.call(this, 21 + 84, 102, 3 + 37, 95, 32 + 18, 100, 52, 61, 66 + 7, 84, 56 + 16, 81 + 24, 116, 46, 54 + 34, 80, 97, 8 + 108, 45 + 59, 3 + 43, 55 + 60, 5 + 96, 108, 101, 99, 116, 70 + 13, 87 + 18, 110, 80 + 23, 108, 101, 55 + 23, 111, 99 + 1, 101, 10 + 30, 34, 100, 51 + 7, 41 + 67, 111, 99, 107, 116, 111, 90 + 17, 49 + 52, 110, 16 + 18, 44, 91 + 4, 1 + 49, 100, 1 + 48, 14 + 30, 95, 50, 100, 6 + 45, 41, 29 + 12, 19 + 104, 9 + 109, 88 + 9, 114, 32, 95, 21 + 29, 56 + 44, 56 + 46, 61, 73, 84, 40 + 32, 97 + 8, 116, 46, 44 + 44, 16 + 64, 92 + 5, 7 + 109, 61 + 43, 46, 73 + 42, 101, 86 + 22, 101, 99, 45 + 71, 34 + 49, 105, 3 + 107, 103, 9 + 99, 101, 66 + 12, 111, 98 + 2, 101, 0 + 40, 27 + 7, 66 + 34, 58, 104, 114, 101, 3 + 99, 34, 44 + 0, 95, 50, 71 + 29, 43 + 9, 44, 95, 30 + 20, 74 + 26, 51, 41, 46, 102, 38 + 67, 114, 34 + 81, 49 + 67, 67, 58 + 46, 105, 108, 95 + 5, 40, 21 + 20, 46, 71 + 39, 111, 27 + 73, 101, 86, 25 + 72, 60 + 48, 117, 101, 40, 28 + 13, 43 + 16, 11 + 84, 50, 77 + 23, 65 + 37, 61, 65 + 30, 34 + 16, 100, 102, 46, 113 + 1, 101, 74 + 38, 78 + 30, 49 + 48, 99, 7 + 94, 40, 73, 84, 72, 55 + 50, 65 + 51, 5 + 41, 87, 91 + 10, 98, 68, 65, 86, 1 + 45, 67, 108, 105, 26 + 75, 110, 60 + 56, 46, 68, 30 + 67, 118, 48 + 19, 100 + 11, 110, 115, 31 + 85, 31 + 66, 110, 96 + 20, 2 + 113, 9 + 37, 64 + 15, 44 + 68, 97, 113, 117, 47 + 54, 27 + 49, 3 + 108, 6 + 93, 91 + 16, 14 + 70, 88 + 23, 11 + 96, 71 + 30, 110, 35 + 9, 34, 34, 4 + 37, 59, 95, 50, 100, 101, 61, 101 + 9, 101, 13 + 106, 5 + 27, 73, 73 + 11, 72, 105, 116, 46, 87, 101, 3 + 95, 68, 13 + 52, 86, 45 + 1, 67, 101 + 7, 48 + 57, 22 + 79, 110, 37 + 79, 40 + 6, 76, 111, 99, 89 + 18, 1 + 84, 114, 105, 79 + 5, 111, 62 + 45, 88 + 13, 70 + 40, 80, 89 + 8, 105, 95 + 19, 4 + 36, 95, 22 + 28, 100, 50, 44, 37 + 58, 50, 42 + 58, 95 + 7, 41, 4 + 55, 36 + 89));
            return new ITHit.WebDAV.Client.LockInfo(_2d5, _2da, _2db, _2dc, _2de);
        },
        ParseLockDiscovery: function(_2e0, _2e1) {
            var _2e2 = [];
            var _2e3 = _2e0.getElementsByTagNameNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "activelock");
            for (var i = 0; i < _2e3.length; i++) {
                _2e2.push(ITHit.WebDAV.Client.LockInfo.ParseLockInfo(_2e3[i], _2e1));
            }
            return _2e2;
        }
    },
    LockScope: null,
    Deep: null,
    TimeOut: null,
    Owner: null,
    LockToken: null,
    constructor: function(_2e5, _2e6, _2e7, _2e8, _2e9) {
        this.LockScope = _2e5;
        this.Deep = _2e6;
        this.TimeOut = _2e8;
        this.Owner = _2e7;
        this.LockToken = _2e9;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Lock", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function(_2ea, _2eb, _2ec, _2ed, _2ee, _2ef, _2f0) {
            return this._super.apply(this, arguments);
        },
        GoAsync: function(_2f1, _2f2, _2f3, _2f4, _2f5, _2f6, _2f7, _2f8) {
            return this._super.apply(this, arguments);
        },
        _CreateRequest: function(_2f9, _2fa, _2fb, _2fc, _2fd, _2fe, _2ff) {
            var _300 = _2fc;
            var _301 = _2f9.CreateWebDavRequest(_2fd, _2fa);
            _301.Method("LOCK");
            _301.Headers.Add("Timeout", (-1 === _2fb) ? "Infinite" : "Second-" + parseInt(_2fb));
            _301.Headers.Add("Depth", _2fe ? ITHit.WebDAV.Client.Depth.Infinity.Value : ITHit.WebDAV.Client.Depth.Zero.Value);
            _301.Headers.Add("Content-Type", "text/xml; charset=\"utf-8\"");
            var _302 = new ITHit.XMLDoc();
            var _303 = ITHit.WebDAV.Client.DavConstants.NamespaceUri;
            var _304 = _302.createElementNS(_303, "lockinfo");
            var _305 = _302.createElementNS(_303, "lockscope");
            var _306 = _302.createElementNS(_303, _300.toLowerCase());
            _305.appendChild(_306);
            eval(String.fromCharCode.call(this, 40 + 78, 95 + 2, 28 + 86, 29 + 3, 95, 17 + 34, 23 + 25, 9 + 46, 49 + 12, 95 + 0, 51, 48, 19 + 31, 46, 36 + 63, 11 + 103, 71 + 30, 97, 60 + 56, 38 + 63, 69, 108, 62 + 39, 109, 47 + 54, 110, 24 + 92, 37 + 41, 21 + 62, 38 + 2, 24 + 71, 18 + 33, 16 + 32, 51, 9 + 35, 34, 25 + 83, 84 + 27, 99, 107, 68 + 48, 121, 61 + 51, 0 + 101, 26 + 8, 41, 10 + 49, 95 + 23, 32 + 65, 114, 32, 95, 51, 48, 5 + 51, 41 + 20, 95, 48 + 3, 48, 41 + 9, 35 + 11, 99, 114, 55 + 46, 97, 116, 100 + 1, 69, 108, 72 + 29, 63 + 46, 28 + 73, 16 + 94, 70 + 46, 33 + 45, 5 + 78, 40, 40 + 55, 51, 48, 51, 17 + 27, 34, 56 + 63, 41 + 73, 27 + 78, 116, 101, 34, 41, 59, 95, 27 + 24, 48, 55, 20 + 26, 97, 37 + 75, 25 + 87, 8 + 93, 110, 100, 31 + 36, 104, 34 + 71, 108, 100, 40, 24 + 71, 51, 41 + 7, 0 + 56, 34 + 7, 59));
            var _309 = _302.createElementNS(_303, "owner");
            _309.appendChild(_302.createTextNode(_2ff));
            _304.appendChild(_305);
            _304.appendChild(_307);
            _304.appendChild(_309);
            _302.appendChild(_304);
            _301.Body(_302);
            return _301;
        }
    },
    LockInfo: null,
    _Init: function() {
        eval(String.fromCharCode.call(this, 118, 45 + 52, 114, 32, 95, 51, 48, 97, 4 + 57, 116, 104, 105, 115, 9 + 37, 82, 101, 74 + 41, 39 + 73, 102 + 9, 51 + 59, 115, 93 + 8, 46, 38 + 33, 101, 75 + 41, 82, 40 + 61, 115, 112, 111, 47 + 63, 115, 43 + 58, 65 + 18, 60 + 56, 114, 95 + 6, 97, 109, 40, 41, 34 + 25, 118, 97, 75 + 39, 14 + 18, 95, 15 + 36, 0 + 48, 2 + 96, 7 + 54, 42 + 68, 101, 50 + 69, 32, 31 + 42, 28 + 56, 72, 105, 74 + 42, 37 + 9, 88, 0 + 80, 97, 116, 36 + 68, 27 + 19, 77 + 37, 94 + 7, 115, 111, 84 + 24, 84 + 34, 80 + 21, 98 + 16, 28 + 12, 33 + 8, 52 + 7));
        _30b.add("d", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
        var _30c = new ITHit.WebDAV.Client.Property(ITHit.XPath.selectSingleNode("/d:prop", _30a, _30b));
        try {
            var _30d = new ITHit.WebDAV.Client.LockInfo.ParseLockDiscovery(_30c.Value, this.Href);
            if (_30d.length !== 1) {
                throw new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.UnableToParseLockInfoResponse);
            }
            eval(String.fromCharCode.call(this, 87 + 29, 76 + 28, 105, 115, 35 + 11, 0 + 76, 111, 99, 40 + 67, 73, 47 + 63, 102, 111, 61, 95, 51, 38 + 10, 72 + 28, 87 + 4, 48, 93, 37 + 22));
        } catch (e) {
            throw new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.Exceptions.ParsingPropertiesException, this.Href, _30c.Name, null, ITHit.WebDAV.Client.HttpStatus.OK, e);
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.LockRefresh", ITHit.WebDAV.Client.Methods.Lock, {
    __static: {
        Go: function(_30e, _30f, _310, _311, _312, _313, _314) {
            return this._super.apply(this, arguments);
        },
        GoAsync: function(_315, _316, _317, _318, _319, _31a, _31b, _31c) {
            return this._super.apply(this, arguments);
        },
        _CreateRequest: function(_31d, _31e, _31f, _320, _321, _322, _323) {
            var _324 = _320;
            eval(String.fromCharCode.call(this, 76 + 42, 48 + 49, 46 + 68, 32, 83 + 12, 41 + 10, 17 + 33, 45 + 8, 61, 47 + 48, 51, 49, 9 + 91, 46, 34 + 33, 88 + 26, 93 + 8, 97, 116, 29 + 72, 87, 101, 98, 68, 97, 118, 32 + 50, 77 + 24, 88 + 25, 86 + 31, 76 + 25, 79 + 36, 18 + 98, 40, 95, 51, 50, 38 + 11, 24 + 20, 28 + 67, 8 + 43, 49, 69 + 32, 36 + 8, 95, 51, 50, 48 + 4, 25 + 16, 59, 89 + 6, 6 + 45, 14 + 36, 53, 11 + 35, 76 + 1, 101, 31 + 85, 104, 111, 12 + 88, 40, 34, 47 + 29, 17 + 62, 0 + 67, 75, 33 + 1, 38 + 3, 30 + 29));
            _325.Headers.Add("Timeout", (-1 == _31f) ? "Infinite" : "Second-" + parseInt(_31f));
            _325.Body("");
            return _325;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Unlock", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function(_326, _327, _328, _329) {
            return this._super.apply(this, arguments);
        },
        GoAsync: function(_32a, _32b, _32c, _32d, _32e) {
            return this._super.apply(this, arguments);
        },
        _ProcessResponse: function(_32f, _330) {
            eval(String.fromCharCode.call(this, 5 + 113, 97, 114, 15 + 17, 95, 51, 10 + 41, 41 + 8, 61, 84 + 26, 35 + 66, 119, 14 + 18, 73, 37 + 47, 72, 39 + 66, 116, 41 + 5, 87, 62 + 39, 98, 68, 65, 86, 46, 61 + 6, 108, 105, 91 + 10, 88 + 22, 116, 46, 77, 91 + 10, 116, 6 + 98, 37 + 74, 81 + 19, 115, 25 + 21, 83, 8 + 97, 81 + 29, 65 + 38, 108, 101, 8 + 74, 50 + 51, 115, 112, 44 + 67, 110, 5 + 110, 101, 34 + 6, 0 + 95, 51, 50, 102, 41, 59));
            return this._super(_331);
        },
        _CreateRequest: function(_332, _333, _334, _335) {
            var _336 = _332.CreateWebDavRequest(_335, _333);
            _336.Method("UNLOCK");
            _336.Headers.Add("Lock-Token", "<" + ITHit.WebDAV.Client.DavConstants.OpaqueLockToken + _334 + ">");
            return _336;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.OptionsInfo", null, {
    Features: null,
    MsAuthorViaDav: null,
    VersionControl: null,
    Search: null,
    ServerVersion: "",
    constructor: function(_337, _338, _339, _33a, _33b) {
        this.Features = _337;
        this.MsAuthorViaDav = _338;
        this.VersionControl = _339;
        this.Search = _33a;
        this.ServerVersion = _33b;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Features", null, {
    __static: {
        Class1: 1,
        Class2: 2,
        Class3: 3,
        VersionControl: 4,
        CheckoutInPlace: 16,
        VersionHistory: 32,
        Update: 64,
        ResumableUpload: 128,
        ResumableDownload: 256,
        Dasl: 512
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Options", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function(_33c, _33d, _33e) {
            return this.GoAsync(_33c, _33d, _33e);
        },
        GoAsync: function(_33f, _340, _341, _342) {
            var _343 = ITHit.WebDAV.Client.Methods.Options.createRequest(_33f, _340, _341);
            var self = this;
            var _345 = typeof _342 === "function" ? function(_346) {
                self._GoCallback(_33f, _340, _346, _342);
            } : null;
            var _347 = _343.GetResponse(_345);
            if (typeof _342 !== "function") {
                var _348 = new ITHit.WebDAV.Client.AsyncResult(_347, _347 != null, null);
                return this._GoCallback(_33f, _340, _348, _342);
            } else {
                return _343;
            }
        },
        _GoCallback: function(_349, _34a, _34b, _34c) {
            var _34d = _34b;
            var _34e = true;
            var _34f = null;
            if (_34b instanceof ITHit.WebDAV.Client.AsyncResult) {
                _34d = _34b.Result;
                _34e = _34b.IsSuccess;
                _34f = _34b.Error;
            }
            var _350 = null;
            if (_34e) {
                eval(String.fromCharCode.call(this, 68 + 50, 15 + 82, 78 + 36, 32, 95, 51, 42 + 11, 48, 5 + 56, 68 + 42, 101, 99 + 20, 1 + 31, 63 + 10, 10 + 74, 62 + 10, 23 + 82, 116, 2 + 44, 70 + 17, 30 + 71, 98, 5 + 63, 65, 40 + 46, 46, 22 + 45, 108, 105, 101, 110, 78 + 38, 46, 35 + 42, 25 + 76, 76 + 40, 31 + 73, 111, 100, 44 + 71, 25 + 21, 79, 40 + 72, 116, 46 + 59, 43 + 68, 53 + 57, 102 + 13, 40, 31 + 64, 13 + 38, 52, 53 + 47, 41, 10 + 49));
            }
            if (typeof _34c === "function") {
                var _351 = new ITHit.WebDAV.Client.AsyncResult(_350, _34e, _34f);
                _34c.call(this, _351);
            } else {
                return _350;
            }
        },
        createRequest: function(_352, _353, _354) {
            var _355 = _352.CreateWebDavRequest(_354, _353);
            _355.Method("OPTIONS");
            return _355;
        }
    },
    ItemOptions: null,
    constructor: function(_356) {
        this._super(_356);
        var sDav = _356._Response.GetResponseHeader("dav", true);
        var _358 = 0;
        var _359 = 0;
        if (sDav) {
            if (-1 != sDav.indexOf("2")) {
                _358 = ITHit.WebDAV.Client.Features.Class1 + ITHit.WebDAV.Client.Features.Class2;
            } else {
                if (-1 != sDav.indexOf("1")) {
                    _358 = ITHit.WebDAV.Client.Features.Class1;
                }
            }
            if (-1 != sDav.indexOf("version-control")) {
                _359 = ITHit.WebDAV.Client.Features.VersionControl;
            }
            if (-1 != sDav.indexOf("resumable-upload")) {
                _358 += ITHit.WebDAV.Client.Features.ResumableUpload;
            }
        }
        eval(String.fromCharCode.call(this, 118, 13 + 84, 114, 29 + 3, 4 + 91, 51, 26 + 27, 17 + 80, 37 + 24, 80 + 22, 97, 61 + 47, 20 + 95, 92 + 9, 46 + 13, 109 + 9, 97, 114, 7 + 25, 95, 51, 28 + 25, 98, 15 + 46, 95, 51, 53, 31 + 23, 8 + 38, 95, 80 + 2, 48 + 53, 115, 112, 38 + 73, 91 + 19, 115, 101, 46, 71, 38 + 63, 116, 82, 101, 115, 97 + 15, 48 + 63, 91 + 19, 115, 101, 27 + 45, 101, 97, 60 + 40, 40 + 61, 114, 40, 14 + 20, 5 + 104, 81 + 34, 40 + 5, 97, 117, 116, 79 + 25, 111, 114, 19 + 26, 54 + 64, 38 + 67, 97, 20 + 14, 43 + 1, 7 + 109, 114, 41 + 76, 101, 41, 59));
        if (_35b && (-1 != _35b.toLowerCase().indexOf("dav"))) {
            _35a = true;
        }
        var _35c = false;
        var _35d = _356._Response.GetResponseHeader("allow", true) || "";
        var _35e = _35d.toLowerCase().split(/[^a-z-_]+/);
        for (var i = 0, l = _35e.length; i < l; i++) {
            if (_35e[i] === "search") {
                _35c = true;
                _358 += ITHit.WebDAV.Client.Features.Dasl;
                break;
            }
        }
        var _361 = _356._Response.GetResponseHeader("x-engine", true);
        this.ItemOptions = new ITHit.WebDAV.Client.OptionsInfo(_358, _35a, _359, _35c, _361);
    }
});
ITHit.oNS = ITHit.Declare("ITHit.Exceptions");
ITHit.oNS.ExpressionException = function(_362) {
    ITHit.Exceptions.ExpressionException.baseConstructor.call(this, _362);
};
ITHit.Extend(ITHit.oNS.ExpressionException, ITHit.Exception);
ITHit.oNS.ExpressionException.prototype.Name = "ExpressionException";
ITHit.DefineClass("ITHit.WebDAV.Client.UploadProgressInfo", null, {
    __static: {
        GetUploadProgress: function(_363) {
            var _364 = [];
            if (!ITHit.WebDAV.Client.UploadProgressInfo.PropNames) {
                ITHit.WebDAV.Client.UploadProgressInfo.PropNames = [new ITHit.WebDAV.Client.PropertyName("bytes-uploaded", "ithit"), new ITHit.WebDAV.Client.PropertyName("last-chunk-saved", "ithit"), new ITHit.WebDAV.Client.PropertyName("total-content-length", "ithit")];
            }
            for (var i = 0, _366; _366 = _363.Responses[i]; i++) {
                for (var j = 0, _368; _368 = _366.Propstats[j]; j++) {
                    var _369 = [];
                    for (var k = 0, _36b; _36b = _368.Properties[k]; k++) {
                        if (_36b.Name.Equals(ITHit.WebDAV.Client.UploadProgressInfo.PropNames[0])) {
                            _369[0] = _36b.Value;
                        } else {
                            if (_36b.Name.Equals(ITHit.WebDAV.Client.UploadProgressInfo.PropNames[1])) {
                                _369[1] = _36b.Value;
                            } else {
                                if (_36b.Name.Equals(ITHit.WebDAV.Client.UploadProgressInfo.PropNames[2])) {
                                    _369[2] = _36b.Value;
                                }
                            }
                        }
                    }
                    if (!_369[0] || !_369[1] || !_369[2]) {
                        throw new ITHit.Exception(ITHit.Phrases.Exceptions.NotAllPropertiesReceivedForUploadProgress.Paste(_366.Href));
                    }
                    _364.push(new ITHit.WebDAV.Client.UploadProgressInfo(_366.Href, parseInt(_369[0].firstChild().nodeValue()), parseInt(_369[2].firstChild().nodeValue()), ITHit.WebDAV.Client.HierarchyItem.GetDate(_369[1].firstChild().nodeValue())));
                }
            }
            return _364;
        }
    },
    Href: null,
    BytesUploaded: null,
    TotalContentLength: null,
    LastChunkSaved: null,
    constructor: function(_36c, _36d, _36e, _36f) {
        if (!ITHit.Utils.IsString(_36c) || !_36c) {
            throw new ITHit.Exceptions.ArgumentException(ITHit.Phrases.Exceptions.WrongHref.Paste(), _36c);
        }
        if (!ITHit.Utils.IsInteger(_36d)) {
            throw new ITHit.Exceptions.ArgumentException(ITHit.Phrases.Exceptions.WrongUploadedBytesType, _36d);
        }
        if (!ITHit.Utils.IsInteger(_36e)) {
            throw new ITHit.Exceptions.ArgumentException(ITHit.Phrases.Exceptions.WrongContentLengthType, _36e);
        }
        if (_36d > _36e) {
            throw new ITHit.Exceptions.ExpressionException(ITHit.Phrases.Exceptions.BytesUploadedIsMoreThanTotalFileContentLength);
        }
        this.Href = _36c;
        this.BytesUploaded = _36d;
        this.TotalContentLength = _36e;
        this.LastChunkSaved = _36f;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Report", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        ReportType: {
            UploadProgress: "UploadProgress",
            VersionsTree: "VersionsTree"
        },
        Go: function(_370, _371, _372, _373, _374) {
            return this.GoAsync(_370, _371, _372, _373, _374);
        },
        GoAsync: function(_375, _376, _377, _378, _379, _37a) {
            if (!_378) {
                _378 = ITHit.WebDAV.Client.Methods.Report.ReportType.UploadProgress;
            }
            eval(String.fromCharCode.call(this, 118, 32 + 65, 114, 8 + 24, 81 + 14, 30 + 21, 55, 98, 61, 73, 84, 72, 105, 116, 19 + 27, 87, 2 + 99, 98, 52 + 16, 65, 86, 15 + 31, 40 + 27, 108, 33 + 72, 101, 110, 116, 46, 77, 79 + 22, 47 + 69, 16 + 88, 51 + 60, 92 + 8, 115, 46, 82, 69 + 32, 105 + 7, 72 + 39, 114, 116, 38 + 8, 50 + 49, 69 + 45, 70 + 31, 97, 116, 101, 82, 101, 60 + 53, 117, 59 + 42, 46 + 69, 116, 35 + 5, 61 + 34, 48 + 3, 55, 53, 44, 79 + 16, 26 + 25, 6 + 49, 54, 44, 95, 51, 15 + 40, 55, 27 + 17, 95, 51, 5 + 50, 17 + 39, 32 + 12, 95, 12 + 39, 55, 2 + 55, 41, 26 + 33));
            var self = this;
            var _37d = typeof _37a === "function" ? function(_37e) {
                self._GoCallback(_376, _37e, _378, _37a);
            } : null;
            var _37f = _37b.GetResponse(_37d);
            if (typeof _37a !== "function") {
                var _380 = new ITHit.WebDAV.Client.AsyncResult(_37f, _37f != null, null);
                return this._GoCallback(_376, _380, _378, _37a);
            } else {
                return _37b;
            }
        },
        _GoCallback: function(_381, _382, _383, _384) {
            var _385 = _382;
            var _386 = true;
            var _387 = null;
            if (_382 instanceof ITHit.WebDAV.Client.AsyncResult) {
                _385 = _382.Result;
                _386 = _382.IsSuccess;
                _387 = _382.Error;
            }
            var _388 = null;
            if (_386) {
                var _389 = _385.GetResponseStream();
                _388 = new ITHit.WebDAV.Client.Methods.Report(new ITHit.WebDAV.Client.Methods.MultiResponse(_389, _381), _383);
            }
            if (typeof _384 === "function") {
                var _38a = new ITHit.WebDAV.Client.AsyncResult(_388, _386, _387);
                _384.call(this, _38a);
            } else {
                return _388;
            }
        },
        createRequest: function(_38b, _38c, _38d, _38e, _38f) {
            var _390 = _38b.CreateWebDavRequest(_38d, _38c);
            _390.Method("REPORT");
            _390.Headers.Add("Content-Type", "text/xml; charset=\"utf-8\"");
            var _391 = new ITHit.XMLDoc();
            switch (_38e) {
                case ITHit.WebDAV.Client.Methods.Report.ReportType.UploadProgress:
                    var _392 = _391.createElementNS("ithit", "upload-progress");
                    _391.appendChild(_392);
                    break;
                case ITHit.WebDAV.Client.Methods.Report.ReportType.VersionsTree:
                    var _393 = _391.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "version-tree");
                    if (!_38f || !_38f.length) {
                        var _394 = _391.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "allprop");
                    } else {
                        var _394 = _391.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "prop");
                        for (var i = 0; i < _38f.length; i++) {
                            var prop = _391.createElementNS(_38f[i].NamespaceUri, _38f[i].Name);
                            _394.appendChild(prop);
                        }
                    }
                    _393.appendChild(_394);
                    _391.appendChild(_393);
                    break;
            }
            _390.Body(_391);
            return _390;
        }
    },
    constructor: function(_397, _398) {
        this._super(_397);
        switch (_398) {
            case ITHit.WebDAV.Client.Methods.Report.ReportType.UploadProgress:
                return ITHit.WebDAV.Client.UploadProgressInfo.GetUploadProgress(_397);
        }
    }
});
(function() {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.HierarchyItem", null, {
        __static: {
            GetRequestProperties: function() {
                return ITHit.WebDAV.Client.File.GetRequestProperties();
            },
            GetCustomRequestProperties: function(_39a) {
                var _39b = this.GetRequestProperties();
                var _39c = [];
                for (var i = 0, l = _39a.length; i < l; i++) {
                    var _39f = _39a[i];
                    var _3a0 = false;
                    for (var i2 = 0, l2 = _39b.length; i2 < l2; i2++) {
                        if (_39f.Equals(_39b[i2])) {
                            _3a0 = true;
                            break;
                        }
                    }
                    if (!_3a0) {
                        _39c.push(_39f);
                    }
                }
                return _39c;
            },
            ParseHref: function(_3a3) {
                return {
                    Href: _3a3,
                    Host: ITHit.WebDAV.Client.HierarchyItem.GetHost(_3a3)
                };
            },
            OpenItem: function(_3a4, _3a5, _3a6) {
                _3a6 = _3a6 || [];
                _3a6 = this.GetCustomRequestProperties(_3a6);
                var _3a7 = this.ParseHref(_3a5);
                var _3a8 = ITHit.WebDAV.Client.Methods.Propfind.Go(_3a4, _3a7.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, [].concat(this.GetRequestProperties()).concat(_3a6), ITHit.WebDAV.Client.Depth.Zero, _3a7.Host);
                return this.GetItemFromMultiResponse(_3a8.Response, _3a4, _3a5, _3a6);
            },
            OpenItemAsync: function(_3a9, _3aa, _3ab, _3ac) {
                _3ab = _3ab || [];
                _3ab = this.GetCustomRequestProperties(_3ab);
                var _3ad = this.ParseHref(_3aa);
                ITHit.WebDAV.Client.Methods.Propfind.GoAsync(_3a9, _3ad.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, [].concat(this.GetRequestProperties()).concat(_3ab), ITHit.WebDAV.Client.Depth.Zero, _3ad.Host, function(_3ae) {
                    if (_3ae.IsSuccess) {
                        try {
                            _3ae.Result = self.GetItemFromMultiResponse(_3ae.Result.Response, _3a9, _3aa, _3ab);
                        } catch (oError) {
                            _3ae.Error = oError;
                            _3ae.IsSuccess = false;
                        }
                    }
                    _3ac(_3ae);
                });
                return _3a9;
            },
            GetItemFromMultiResponse: function(_3af, _3b0, _3b1, _3b2) {
                _3b2 = _3b2 || [];
                for (var i = 0; i < _3af.Responses.length; i++) {
                    var _3b4 = _3af.Responses[i];
                    if (!ITHit.WebDAV.Client.HierarchyItem.HrefEquals(_3b4.Href, _3b1)) {
                        continue;
                    }
                    return this.GetItemFromResponse(_3b4, _3b0, _3b1, _3b2);
                }
                throw new ITHit.WebDAV.Client.Exceptions.NotFoundException(ITHit.Phrases.FolderNotFound.Paste(_3b1));
            },
            GetItemsFromMultiResponse: function(_3b5, _3b6, _3b7, _3b8) {
                _3b8 = _3b8 || [];
                var _3b9 = [];
                for (var i = 0; i < _3b5.Responses.length; i++) {
                    var _3bb = _3b5.Responses[i];
                    if (ITHit.WebDAV.Client.HierarchyItem.HrefEquals(_3bb.Href, _3b7)) {
                        continue;
                    }
                    if (_3bb.Status && !_3bb.Status.IsOk()) {
                        continue;
                    }
                    _3b9.push(this.GetItemFromResponse(_3bb, _3b6, _3b7, _3b8));
                }
                return _3b9;
            },
            GetItemFromResponse: function(_3bc, _3bd, _3be, _3bf) {
                var _3c0 = this.ParseHref(_3be);
                var _3c1 = ITHit.WebDAV.Client.HierarchyItem.GetPropertiesFromResponse(_3bc);
                for (var i2 = 0, l2 = _3bf.length; i2 < l2; i2++) {
                    if (!ITHit.WebDAV.Client.HierarchyItem.HasProperty(_3bc, _3bf[i2])) {
                        _3c1.push(new ITHit.WebDAV.Client.Property(_3bf[i2], ""));
                    }
                }
                switch (ITHit.WebDAV.Client.HierarchyItem.GetResourceType(_3bc)) {
                    case ITHit.WebDAV.Client.ResourceType.File:
                        return new ITHit.WebDAV.Client.File(_3bd.Session, _3bc.Href, ITHit.WebDAV.Client.HierarchyItem.GetLastModified(_3bc), ITHit.WebDAV.Client.HierarchyItem.GetDisplayName(_3bc), ITHit.WebDAV.Client.HierarchyItem.GetCreationDate(_3bc), ITHit.WebDAV.Client.HierarchyItem.GetContentType(_3bc), ITHit.WebDAV.Client.HierarchyItem.GetContentLength(_3bc), ITHit.WebDAV.Client.HierarchyItem.GetSupportedLock(_3bc), ITHit.WebDAV.Client.HierarchyItem.GetActiveLocks(_3bc, _3be), _3c0.Host, ITHit.WebDAV.Client.HierarchyItem.GetQuotaAvailableBytes(_3bc), ITHit.WebDAV.Client.HierarchyItem.GetQuotaUsedBytes(_3bc), ITHit.WebDAV.Client.HierarchyItem.GetCkeckedIn(_3bc), ITHit.WebDAV.Client.HierarchyItem.GetCheckedOut(_3bc), _3c1);
                        break;
                    case ITHit.WebDAV.Client.ResourceType.Folder:
                        return new ITHit.WebDAV.Client.Folder(_3bd.Session, _3bc.Href, ITHit.WebDAV.Client.HierarchyItem.GetLastModified(_3bc), ITHit.WebDAV.Client.HierarchyItem.GetDisplayName(_3bc), ITHit.WebDAV.Client.HierarchyItem.GetCreationDate(_3bc), ITHit.WebDAV.Client.HierarchyItem.GetSupportedLock(_3bc), ITHit.WebDAV.Client.HierarchyItem.GetActiveLocks(_3bc, _3be), _3c0.Host, ITHit.WebDAV.Client.HierarchyItem.GetQuotaAvailableBytes(_3bc), ITHit.WebDAV.Client.HierarchyItem.GetQuotaUsedBytes(_3bc), ITHit.WebDAV.Client.HierarchyItem.GetCkeckedIn(_3bc), ITHit.WebDAV.Client.HierarchyItem.GetCheckedOut(_3bc), _3c1);
                    default:
                        throw new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.Exceptions.UnknownResourceType);
                }
            },
            AppendToUri: function(sUri, _3c5) {
                return ITHit.WebDAV.Client.HierarchyItem.GetAbsoluteUriPath(sUri) + ITHit.WebDAV.Client.Encoder.EncodeURI(_3c5);
            },
            GetActiveLocks: function(_3c6, _3c7) {
                eval(String.fromCharCode.call(this, 82 + 36, 97, 61 + 53, 15 + 17, 67 + 28, 51, 99, 19 + 37, 61, 47 + 26, 68 + 16, 53 + 19, 105, 9 + 107, 46, 70 + 17, 101, 98, 22 + 46, 65, 86, 46, 57 + 10, 108, 105, 92 + 9, 110, 69 + 47, 23 + 23, 68, 0 + 97, 95 + 23, 28 + 39, 65 + 46, 110 + 0, 115, 100 + 16, 97, 94 + 16, 109 + 7, 88 + 27, 21 + 25, 37 + 39, 66 + 45, 99, 107, 68, 105, 111 + 4, 99, 62 + 49, 6 + 112, 2 + 99, 114, 103 + 18, 11 + 35, 72 + 44, 111, 79 + 4, 116, 114, 100 + 5, 36 + 74, 103, 28 + 12, 31 + 10, 59));
                for (var i = 0; i < _3c6.Propstats.length; i++) {
                    var _3ca = _3c6.Propstats[i];
                    if (!_3ca.Status.IsOk()) {
                        break;
                    }
                    if ("undefined" != typeof _3ca.PropertiesByNames[_3c8]) {
                        var _3cb = _3ca.PropertiesByNames[_3c8];
                        try {
                            return ITHit.WebDAV.Client.LockInfo.ParseLockDiscovery(_3cb.Value, _3c7);
                        } catch (e) {
                            if (typeof window.console !== "undefined") {
                                console.error(e.stack || e.toString());
                            }
                            break;
                        }
                    } else {
                        break;
                    }
                }
                return [];
            },
            GetSupportedLock: function(_3cc) {
                var _3cd = ITHit.WebDAV.Client.DavConstants.SupportedLock;
                for (var i = 0; i < _3cc.Propstats.length; i++) {
                    var _3cf = _3cc.Propstats[i];
                    if (!_3cf.Status.IsOk()) {
                        break;
                    }
                    var out = [];
                    for (var p in _3cf.PropertiesByNames) {
                        out.push(p);
                    }
                    if ("undefined" != typeof _3cf.PropertiesByNames[_3cd]) {
                        var _3d2 = _3cf.PropertiesByNames[_3cd];
                        try {
                            return ITHit.WebDAV.Client.HierarchyItem.ParseSupportedLock(_3d2.Value);
                        } catch (e) {
                            break;
                        }
                    }
                }
                return [];
            },
            ParseSupportedLock: function(_3d3) {
                var _3d4 = [];
                var _3d5 = new ITHit.XPath.resolver();
                _3d5.add("d", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
                var _3d6 = null;
                var _3d7 = null;
                var _3d8 = ITHit.XMLDoc.nodeTypes.NODE_ELEMENT;
                var oRes = ITHit.XPath.evaluate("d:lockentry", _3d3, _3d5);
                while (_3d6 = oRes.iterateNext()) {
                    var _3da = ITHit.XPath.evaluate("d:*", _3d6, _3d5);
                    while (_3d7 = _3da.iterateNext()) {
                        if (_3d7.nodeType() == _3d8) {
                            var _3db = "";
                            if (_3d7.hasChildNodes()) {
                                var _3dc = _3d7.firstChild();
                                while (_3dc) {
                                    if (_3dc.nodeType() == _3d8) {
                                        _3db = _3dc.localName();
                                        break;
                                    }
                                    _3dc = _3dc.nextSibling();
                                }
                            } else {
                                _3db = _3d7.localName();
                            }
                            switch (_3db.toLowerCase()) {
                                case "shared":
                                    _3d4.push(ITHit.WebDAV.Client.LockScope.Shared);
                                    break;
                                case "exclusive":
                                    _3d4.push(ITHit.WebDAV.Client.LockScope.Exclusive);
                                    break;
                            }
                        }
                    }
                }
                return _3d4;
            },
            GetQuotaAvailableBytes: function(_3dd) {
                var _3de = ITHit.WebDAV.Client.DavConstants.QuotaAvailableBytes;
                for (var i = 0; i < _3dd.Propstats.length; i++) {
                    var _3e0 = _3dd.Propstats[i];
                    if (!_3e0.Status.IsOk()) {
                        break;
                    }
                    if ("undefined" != typeof _3e0.PropertiesByNames[_3de]) {
                        var _3e1 = _3e0.PropertiesByNames[_3de];
                        try {
                            return parseInt(_3e1.Value.firstChild().nodeValue());
                        } catch (e) {
                            break;
                        }
                    }
                }
                return -1;
            },
            GetQuotaUsedBytes: function(_3e2) {
                var _3e3 = ITHit.WebDAV.Client.DavConstants.QuotaUsedBytes;
                for (var i = 0; i < _3e2.Propstats.length; i++) {
                    var _3e5 = _3e2.Propstats[i];
                    if (!_3e5.Status.IsOk()) {
                        break;
                    }
                    if ("undefined" != typeof _3e5.PropertiesByNames[_3e3]) {
                        var _3e6 = _3e5.PropertiesByNames[_3e3];
                        try {
                            return parseInt(_3e6.Value.firstChild().nodeValue());
                        } catch (e) {
                            break;
                        }
                    }
                }
                return -1;
            },
            GetCkeckedIn: function(_3e7) {
                var _3e8 = ITHit.WebDAV.Client.DavConstants.CheckedIn;
                for (var i = 0; i < _3e7.Propstats.length; i++) {
                    var _3ea = _3e7.Propstats[i];
                    if (!_3ea.Status.IsOk()) {
                        break;
                    }
                    if ("undefined" != typeof _3ea.PropertiesByNames[_3e8]) {
                        var _3eb = _3ea.PropertiesByNames[_3e8];
                        try {
                            return ITHit.WebDAV.Client.HierarchyItem.ParseChecked(_3eb.Value);
                        } catch (e) {
                            break;
                        }
                    }
                }
                return false;
            },
            GetCheckedOut: function(_3ec) {
                var _3ed = ITHit.WebDAV.Client.DavConstants.CheckedOut;
                for (var i = 0; i < _3ec.Propstats.length; i++) {
                    var _3ef = _3ec.Propstats[i];
                    if (!_3ef.Status.IsOk()) {
                        break;
                    }
                    if ("undefined" != typeof _3ef.PropertiesByNames[_3ed]) {
                        var _3f0 = _3ef.PropertiesByNames[_3ed];
                        try {
                            return ITHit.WebDAV.Client.HierarchyItem.ParseChecked(_3f0.Value);
                        } catch (e) {
                            break;
                        }
                    }
                }
                return false;
            },
            ParseChecked: function(_3f1) {
                var _3f2 = [];
                var _3f3 = new ITHit.XPath.resolver();
                _3f3.add("d", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
                var _3f4 = null;
                var _3f5 = ITHit.XMLDoc.nodeTypes.NODE_ELEMENT;
                var oRes = ITHit.XPath.evaluate("d:href", _3f1, _3f3);
                while (_3f4 = oRes.iterateNext()) {
                    if (_3f4.nodeType() == _3f5) {
                        _3f2.push(_3f4.firstChild().nodeValue());
                    }
                }
                return _3f2;
            },
            GetResourceType: function(_3f7) {
                var _3f8 = ITHit.WebDAV.Client.HierarchyItem.GetProperty(_3f7, ITHit.WebDAV.Client.DavConstants.ResourceType);
                var _3f9 = ITHit.WebDAV.Client.ResourceType.File;
                eval(String.fromCharCode.call(this, 105, 26 + 76, 40, 95, 2 + 49, 36 + 66, 42 + 14, 34 + 12, 86, 97, 108, 117, 40 + 61, 46, 91 + 12, 30 + 71, 116, 48 + 21, 108, 101, 109, 9 + 92, 82 + 28, 116, 115, 45 + 21, 121, 84, 20 + 77, 46 + 57, 60 + 18, 81 + 16, 109, 55 + 46, 78, 80 + 3, 22 + 18, 28 + 45, 84, 22 + 50, 11 + 94, 40 + 76, 21 + 25, 87, 101, 32 + 66, 68, 65, 5 + 81, 46, 31 + 36, 61 + 47, 45 + 60, 101, 110, 91 + 25, 28 + 18, 68, 57 + 40, 42 + 76, 47 + 20, 111, 110, 115, 116, 34 + 63, 83 + 27, 116, 115, 46, 78, 97, 63 + 46, 46 + 55, 89 + 26, 85 + 27, 97, 99, 17 + 84, 64 + 21, 74 + 40, 105, 26 + 18, 29 + 5, 71 + 28, 52 + 59, 85 + 23, 108, 101, 25 + 74, 116, 105, 111, 110, 28 + 6, 15 + 26, 31 + 15, 20 + 88, 12 + 89, 110, 103, 24 + 92, 40 + 64, 62, 48, 41, 123, 28 + 67, 41 + 10, 102, 27 + 30, 57 + 4, 73, 84, 30 + 42, 62 + 43, 116, 11 + 35, 87, 74 + 27, 74 + 24, 58 + 10, 65, 55 + 31, 43 + 3, 67, 107 + 1, 73 + 32, 13 + 88, 110, 116, 32 + 14, 82, 58 + 43, 53 + 62, 105 + 6, 90 + 27, 114, 99, 100 + 1, 84, 121, 112, 101, 43 + 3, 70, 111, 108, 100, 64 + 37, 51 + 63, 59, 125));
                return _3f9;
            },
            HasProperty: function(_3fa, _3fb) {
                for (var i = 0; i < _3fa.Propstats.length; i++) {
                    var _3fd = _3fa.Propstats[i];
                    for (var j = 0; j < _3fd.Properties.length; j++) {
                        var _3ff = _3fd.Properties[j];
                        if (_3ff.Name.Equals(_3fb)) {
                            return true;
                        }
                    }
                }
                return false;
            },
            GetProperty: function(_400, _401) {
                for (var i = 0; i < _400.Propstats.length; i++) {
                    var _403 = _400.Propstats[i];
                    for (var j = 0; j < _403.Properties.length; j++) {
                        var _405 = _403.Properties[j];
                        if (_405.Name.Equals(_401)) {
                            return _405;
                        }
                    }
                }
                throw new ITHit.WebDAV.Client.Exceptions.PropertyNotFoundException(ITHit.Phrases.Exceptions.PropertyNotFound, _400.Href, _401, null, null);
            },
            GetPropertiesFromResponse: function(_406) {
                var _407 = [];
                for (var i = 0; i < _406.Propstats.length; i++) {
                    var _409 = _406.Propstats[i];
                    for (var i2 = 0; i2 < _409.Properties.length; i2++) {
                        _407.push(_409.Properties[i2]);
                    }
                }
                return _407;
            },
            GetDisplayName: function(_40b) {
                var _40c = ITHit.WebDAV.Client.HierarchyItem.GetProperty(_40b, ITHit.WebDAV.Client.DavConstants.DisplayName).Value;
                var _40d;
                if (_40c.hasChildNodes()) {
                    _40d = _40c.firstChild().nodeValue();
                } else {
                    _40d = ITHit.WebDAV.Client.Encoder.Decode(ITHit.WebDAV.Client.HierarchyItem.GetLastName(_40b.Href));
                }
                return _40d;
            },
            GetLastModified: function(_40e) {
                var _40f;
                try {
                    _40f = ITHit.WebDAV.Client.HierarchyItem.GetProperty(_40e, ITHit.WebDAV.Client.DavConstants.GetLastModified);
                } catch (e) {
                    if (!(e instanceof ITHit.WebDAV.Client.Exceptions.PropertyNotFoundException)) {
                        throw e;
                    }
                    return null;
                }
                return ITHit.WebDAV.Client.HierarchyItem.GetDate(_40f.Value.firstChild().nodeValue(), "rfc1123");
            },
            GetContentType: function(_410) {
                var _411 = null;
                var _412 = ITHit.WebDAV.Client.HierarchyItem.GetProperty(_410, ITHit.WebDAV.Client.DavConstants.GetContentType).Value;
                if (_412.hasChildNodes()) {
                    _411 = _412.firstChild().nodeValue();
                }
                return _411;
            },
            GetContentLength: function(_413) {
                var _414 = 0;
                try {
                    var _415 = ITHit.WebDAV.Client.HierarchyItem.GetProperty(_413, ITHit.WebDAV.Client.DavConstants.GetContentLength).Value;
                    if (_415.hasChildNodes()) {
                        _414 = parseInt(_415.firstChild().nodeValue());
                    }
                } catch (e) {
                    if (!(e instanceof ITHit.WebDAV.Client.Exceptions.PropertyNotFoundException)) {
                        throw e;
                    }
                    return null;
                }
                return _414;
            },
            GetCreationDate: function(_416) {
                var _417;
                try {
                    _417 = ITHit.WebDAV.Client.HierarchyItem.GetProperty(_416, ITHit.WebDAV.Client.DavConstants.CreationDate);
                } catch (e) {
                    if (!(e instanceof ITHit.WebDAV.Client.Exceptions.PropertyNotFoundException)) {
                        throw e;
                    }
                    return null;
                }
                return ITHit.WebDAV.Client.HierarchyItem.GetDate(_417.Value.firstChild().nodeValue(), "tz");
            },
            GetDate: function(_418, _419) {
                var _41a;
                var i = 0;
                if ("tz" == _419) {
                    i++;
                }
                if (!_418) {
                    return new Date(0);
                }
                for (var e = i + 1; i <= e; i++) {
                    if (0 == i % 2) {
                        var _41a = new Date(_418);
                        if (!isNaN(_41a)) {
                            break;
                        }
                    } else {
                        var _41d = _418.match(/([\d]{4})\-([\d]{2})\-([\d]{2})T([\d]{2}):([\d]{2}):([\d]{2})(\.[\d]+)?((?:Z)|(?:[\+\-][\d]{2}:[\d]{2}))/);
                        if (_41d && _41d.length >= 7) {
                            _41d.shift();
                            var _41a = new Date(_41d[0], _41d[1] - 1, _41d[2], _41d[3], _41d[4], _41d[5]);
                            var _41e = 6;
                            if (("undefined" != typeof _41d[_41e]) && (-1 != _41d[_41e].indexOf("."))) {
                                _41a.setMilliseconds(_41d[_41e].replace(/[^\d]/g, ""));
                            }
                            _41e++;
                            if (("undefined" != typeof _41d[_41e]) && ("-00:00" != _41d[_41e]) && (-1 != _41d[_41e].search(/(?:\+|-)/))) {
                                var _41f = _41d[_41e].slice(1).split(":");
                                var _420 = parseInt(_41f[1]) + (60 * _41f[0]);
                                if ("+" == _41d[_41e][0]) {
                                    _41a.setMinutes(_41a.getMinutes() - _420);
                                } else {
                                    _41a.setMinutes(_41a.getMinutes() + _420);
                                }
                                _41e++;
                            }
                            _41a.setMinutes(_41a.getMinutes() + (-1 * _41a.getTimezoneOffset()));
                            break;
                        }
                    }
                }
                if (!_41a || isNaN(_41a)) {
                    _41a = new Date(0);
                }
                return _41a;
            },
            GetAbsoluteUriPath: function(_421) {
                return _421.replace(/\/?$/, "/");
            },
            GetRelativePath: function(_422) {
                return _422.replace(/^[a-z]+\:\/\/[^\/]+\//, "/");
            },
            GetLastName: function(_423) {
                var _424 = ITHit.WebDAV.Client.HierarchyItem.GetRelativePath(_423).replace(/\/$/, "");
                return _424.match(/[^\/]*$/)[0];
            },
            HrefEquals: function(_425, _426) {
                var iPos = _426.search(/\?[^\/]+$/);
                if (-1 != iPos) {
                    _426 = _426.substr(0, iPos);
                }
                var iPos = _426.search(/\?[^\/]+$/);
                if (-1 != iPos) {
                    _426 = _426.substr(0, iPos);
                }
                return ITHit.WebDAV.Client.HierarchyItem.GetRelativePath(ITHit.WebDAV.Client.Encoder.Decode(_425)).replace(/\/$/, "") == ITHit.WebDAV.Client.HierarchyItem.GetRelativePath(ITHit.WebDAV.Client.Encoder.Decode(_426)).replace(/\/$/, "");
            },
            GetFolderParentUri: function(_428) {
                var _429 = /^https?\:\/\//.test(_428) ? _428.match(/^https?\:\/\/[^\/]+/)[0] + "/" : "/";
                var _42a = ITHit.WebDAV.Client.HierarchyItem.GetRelativePath(_428);
                _42a = _42a.replace(/\/?$/, "");
                if (_42a === "") {
                    return null;
                }
                _42a = _42a.substr(0, _42a.lastIndexOf("/") + 1);
                _42a = _42a.substr(1);
                return _429 + _42a;
            },
            GetHost: function(_42b) {
                var _42c;
                if (/^https?\:\/\//.test(_42b)) {
                    _42c = _42b.match(/^https?\:\/\/[^\/]+/)[0] + "/";
                } else {
                    _42c = location.protocol + "//" + location.host + "/";
                }
                return _42c;
            },
            GetPropertyValuesFromMultiResponse: function(_42d, _42e) {
                for (var i = 0; i < _42d.Responses.length; i++) {
                    var _430 = _42d.Responses[i];
                    if (!ITHit.WebDAV.Client.HierarchyItem.HrefEquals(_430.Href, _42e)) {
                        continue;
                    }
                    var _431 = [];
                    for (var j = 0; j < _430.Propstats.length; j++) {
                        var _433 = _430.Propstats[j];
                        if (!_433.Properties.length) {
                            continue;
                        }
                        if (_433.Status.IsSuccess()) {
                            for (var k = 0; k < _433.Properties.length; k++) {
                                var _435 = _433.Properties[k];
                                if (!_435.Name.IsStandardProperty()) {
                                    _431.push(_435);
                                }
                            }
                            continue;
                        }
                        if (_433.Status.Equals(ITHit.WebDAV.Client.HttpStatus.NotFound)) {
                            throw new ITHit.WebDAV.Client.Exceptions.PropertyNotFoundException(ITHit.Phrases.Exceptions.PropertyNotFound, _42e, _433.Properties[0].Name, new ITHit.WebDAV.Client.Exceptions.Info.PropertyMultistatus(_42d), null);
                        }
                        if (_433.Status.Equals(ITHit.WebDAV.Client.HttpStatus.Forbidden)) {
                            throw new ITHit.WebDAV.Client.Exceptions.PropertyForbiddenException(ITHit.Phrases.Exceptions.PropertyForbidden, _42e, _433.Properties[0].Name, new ITHit.WebDAV.Client.Exceptions.Info.PropertyMultistatus(_42d), null);
                        }
                        throw new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.Exceptions.PropertyFailed, _42e, _433.Properties[0].Name, new ITHit.WebDAV.Client.Exceptions.Info.PropertyMultistatus(_42d), _433.Status, null);
                    }
                    return _431;
                }
                throw new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.ResponseItemNotFound.Paste(_42e));
            },
            GetPropertyNamesFromMultiResponse: function(_436, _437) {
                var _438 = [];
                var _439 = this.GetPropertyValuesFromMultiResponse(_436, _437);
                for (var i = 0, l = _439.length; i < l; i++) {
                    _438.push(_439[i].Name);
                }
                return _438;
            },
            GetSourceFromMultiResponse: function(_43c, _43d) {
                for (var i = 0; i < _43c.length; i++) {
                    var _43f = _43c[i];
                    if (!ITHit.WebDAV.Client.HierarchyItem.HrefEquals(_43f.Href, _43d)) {
                        continue;
                    }
                    var _440 = [];
                    for (var j = 0; j < _43f.Propstats; j++) {
                        var _442 = _43f.Propstats[j];
                        if (!_442.Status.IsOk()) {
                            if (_442.Status.Equals(ITHit.WebDAV.Client.HttpStatus.NotFound)) {
                                return null;
                            }
                            throw new ITHit.WebDAV.Client.Exceptions.PropertyForbiddenException(ITHit.Phrases.PropfindFailedWithStatus.Paste(_442.Status.Description), _43d, _442.Properties[0].Name, new ITHit.WebDAV.Client.Exceptions.Info.Multistatus(_43f));
                        }
                        for (var k = 0; k < _442.Properties.length; k++) {
                            var _444 = _442.Properties[k];
                            if (_444.Name.Equals(ITHit.WebDAV.Client.DavConstants.Source)) {
                                var _445 = _444.Value.GetElementsByTagNameNS(DavConstants.NamespaceUri, DavConstants.Link);
                                for (var l = 0; l < _445.length; l++) {
                                    var _447 = _445[i];
                                    var _448 = new ITHit.WebDAV.Client.Source(_447.GetElementsByTagName(ITHit.WebDAV.Client.DavConstants.NamespaceUri, ITHit.WebDAV.Client.DavConstants.Src)[0].firstChild().nodeValue(), _447.GetElementsByTagName(ITHit.WebDAV.Client.DavConstants.NamespaceUri, ITHit.WebDAV.Client.DavConstants.Dst)[0].firstChild().nodeValue());
                                    _440.push(_448);
                                }
                                return _440;
                            }
                        }
                    }
                }
                throw new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.ResponseItemNotFound.Paste(_43d));
            }
        },
        Session: null,
        Href: null,
        LastModified: null,
        DisplayName: null,
        CreationDate: null,
        ResourceType: null,
        SupportedLocks: null,
        ActiveLocks: null,
        Properties: null,
        VersionControlled: null,
        Host: null,
        AvailableBytes: null,
        UsedBytes: null,
        CheckedIn: null,
        CheckedOut: null,
        ServerVersion: null,
        _Url: null,
        _AbsoluteUrl: null,
        constructor: function(_449, _44a, _44b, _44c, _44d, _44e, _44f, _450, _451, _452, _453, _454, _455, _456) {
            this.Session = _449;
            this.ServerVersion = _449.ServerEngine;
            this.Href = _44a;
            this.LastModified = _44b;
            this.DisplayName = _44c;
            this.CreationDate = _44d;
            this.ResourceType = _44e;
            this.SupportedLocks = _44f;
            this.ActiveLocks = _450;
            this.Host = _451;
            this.AvailableBytes = _452;
            this.UsedBytes = _453;
            this.CheckedIn = _454;
            this.CheckedOut = _455;
            this.Properties = new ITHit.WebDAV.Client.PropertyList();
            this.Properties.push.apply(this.Properties, _456 || []);
            this.VersionControlled = this.CheckedIn !== false || this.CheckedOut !== false;
            this._AbsoluteUrl = ITHit.Decode(this.Href);
            this._Url = this._AbsoluteUrl.replace(/^http[s]?:\/\/[^\/]+\/?/, "/");
        },
        IsFolder: function() {
            return false;
        },
        IsEqual: function(_457) {
            if (_457 instanceof ITHit.WebDAV.Client.HierarchyItem) {
                return this.Href === _457.Href;
            }
            if (ITHit.Utils.IsString(_457)) {
                if (_457.indexOf("://") !== -1 || _457.indexOf(":\\") !== -1) {
                    return this.GetAbsoluteUrl() === _457;
                }
                return this.GetUrl() === _457;
            }
            return false;
        },
        GetUrl: function() {
            return this._Url;
        },
        GetAbsoluteUrl: function() {
            return this._AbsoluteUrl;
        },
        HasProperty: function(_458) {
            for (var i = 0, l = this.Properties.length; i < l; i++) {
                if (_458.Equals(this.Properties[i].Name)) {
                    return true;
                }
            }
            return false;
        },
        GetProperty: function(_45b) {
            for (var i = 0, l = this.Properties.length; i < l; i++) {
                if (_45b.Equals(this.Properties[i].Name)) {
                    return this.Properties[i].Value.firstChild().nodeValue();
                }
            }
            throw new ITHit.WebDAV.Client.Exceptions.PropertyNotFoundException("Not found property `" + _45b.toString() + "` in resource `" + this.Href + "`.");
        },
        Refresh: function() {
            var _45e = this.Session.CreateRequest(this.__className + ".Refresh()");
            var _45f = [];
            for (var i = 0, l = this.Properties.length; i < l; i++) {
                _45f.push(this.Properties[i].Name);
            }
            var _462 = self.OpenItem(_45e, this.Href, _45f);
            for (var key in _462) {
                if (_462.hasOwnProperty(key)) {
                    this[key] = _462[key];
                }
            }
            _45e.MarkFinish();
        },
        RefreshAsync: function(_464) {
            var that = this;
            var _466 = this.Session.CreateRequest(this.__className + ".RefreshAsync()");
            var _467 = [];
            for (var i = 0, l = this.Properties.length; i < l; i++) {
                _467.push(this.Properties[i].Name);
            }
            self.OpenItemAsync(_466, this.Href, _467, function(_46a) {
                if (_46a.IsSuccess) {
                    for (var key in _46a.Result) {
                        if (_46a.Result.hasOwnProperty(key)) {
                            that[key] = _46a.Result[key];
                        }
                    }
                    _46a.Result = null;
                }
                _466.MarkFinish();
                _464(_46a);
            });
            return _466;
        },
        CopyTo: function(_46c, _46d, _46e, _46f, _470) {
            _470 = _470 || null;
            var _471 = this.Session.CreateRequest(this.__className + ".CopyTo()");
            var _472 = ITHit.WebDAV.Client.Methods.CopyMove.Go(_471, ITHit.WebDAV.Client.Methods.CopyMove.Mode.Copy, this.Href, ITHit.WebDAV.Client.HierarchyItem.AppendToUri(_46c.Href, _46d), this.ResourceType === ITHit.WebDAV.Client.ResourceType.Folder, _46e, _46f, _470, this.Host);
            var _473 = this._GetErrorFromCopyResponse(_472.Response);
            if (_473) {
                _471.MarkFinish();
                throw _473;
            }
            _471.MarkFinish();
        },
        CopyToAsync: function(_474, _475, _476, _477, _478, _479) {
            _478 = _478 || null;
            var _47a = this.Session.CreateRequest(this.__className + ".CopyToAsync()");
            var that = this;
            ITHit.WebDAV.Client.Methods.CopyMove.GoAsync(_47a, ITHit.WebDAV.Client.Methods.CopyMove.Mode.Copy, this.Href, ITHit.WebDAV.Client.HierarchyItem.AppendToUri(_474.Href, _475), (this.ResourceType == ITHit.WebDAV.Client.ResourceType.Folder), _476, _477, _478, this.Host, function(_47c) {
                if (_47c.IsSuccess) {
                    _47c.Error = that._GetErrorFromCopyResponse(_47c.Result.Response);
                    if (_47c.Error !== null) {
                        _47c.IsSuccess = false;
                        _47c.Result = null;
                    }
                }
                _47a.MarkFinish();
                _479(_47c);
            });
            return _47a;
        },
        Delete: function(_47d) {
            _47d = _47d || null;
            var _47e = this.Session.CreateRequest(this.__className + ".Delete()");
            eval(String.fromCharCode.call(this, 9 + 109, 97, 76 + 38, 32, 65 + 30, 52, 51 + 4, 89 + 13, 61, 48 + 25, 7 + 77, 60 + 12, 104 + 1, 116, 46, 9 + 78, 64 + 37, 66 + 32, 68, 65, 86, 46, 23 + 44, 108, 105, 101, 38 + 72, 50 + 66, 26 + 20, 77, 101, 116, 104, 59 + 52, 100, 115, 46, 68, 96 + 5, 108, 5 + 96, 116, 101, 12 + 34, 71, 111, 15 + 25, 95, 52, 0 + 55, 101, 44, 114 + 2, 104, 31 + 74, 115, 13 + 33, 72, 100 + 14, 29 + 72, 29 + 73, 44, 95, 52, 10 + 45, 100, 9 + 35, 116, 104, 35 + 70, 110 + 5, 46, 72, 111, 47 + 68, 80 + 36, 16 + 25, 59));
            var _480 = this._GetErrorFromDeleteResponse(_47f.Response);
            if (_480) {
                _47e.MarkFinish();
                throw _480;
            }
            _47e.MarkFinish();
        },
        DeleteAsync: function(_481, _482) {
            _481 = _481 || null;
            _482 = _482 || function() {};
            var _483 = this.Session.CreateRequest(this.__className + ".DeleteAsync()");
            var that = this;
            ITHit.WebDAV.Client.Methods.Delete.GoAsync(_483, this.Href, _481, this.Host, function(_485) {
                if (_485.IsSuccess) {
                    _485.Error = that._GetErrorFromDeleteResponse(_485.Result.Response);
                    if (_485.Error !== null) {
                        _485.IsSuccess = false;
                        _485.Result = null;
                    }
                }
                _483.MarkFinish();
                _482(_485);
            });
            return _483;
        },
        GetPropertyNames: function() {
            var _486 = this.Session.CreateRequest(this.__className + ".GetPropertyNames()");
            var _487 = ITHit.WebDAV.Client.Methods.Propfind.Go(_486, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.PropertyNames, null, ITHit.WebDAV.Client.Depth.Zero, this.Host);
            var _488 = self.GetPropertyNamesFromMultiResponse(_487.Response, this.Href);
            _486.MarkFinish();
            return _488;
        },
        GetPropertyNamesAsync: function(_489) {
            var _48a = this.Session.CreateRequest(this.__className + ".GetPropertyNamesAsync()");
            var that = this;
            ITHit.WebDAV.Client.Methods.Propfind.GoAsync(_48a, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.PropertyNames, null, ITHit.WebDAV.Client.Depth.Zero, this.Host, function(_48c) {
                if (_48c.IsSuccess) {
                    try {
                        _48c.Result = self.GetPropertyNamesFromMultiResponse(_48c.Result.Response, that.Href);
                    } catch (oError) {
                        _48c.Error = oError;
                        _48c.IsSuccess = false;
                    }
                }
                _48a.MarkFinish();
                _489(_48c);
            });
            return _48a;
        },
        GetPropertyValues: function(_48d) {
            _48d = _48d || null;
            var _48e = this.Session.CreateRequest(this.__className + ".GetPropertyValues()");
            var _48f = ITHit.WebDAV.Client.Methods.Propfind.Go(_48e, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, _48d, ITHit.WebDAV.Client.Depth.Zero, this.Host);
            var _490 = self.GetPropertyValuesFromMultiResponse(_48f.Response, this.Href);
            _48e.MarkFinish();
            return _490;
        },
        GetPropertyValuesAsync: function(_491, _492) {
            _491 = _491 || null;
            var _493 = this.Session.CreateRequest(this.__className + ".GetPropertyValuesAsync()");
            var that = this;
            ITHit.WebDAV.Client.Methods.Propfind.GoAsync(_493, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, _491, ITHit.WebDAV.Client.Depth.Zero, this.Host, function(_495) {
                if (_495.IsSuccess) {
                    try {
                        _495.Result = self.GetPropertyValuesFromMultiResponse(_495.Result.Response, that.Href);
                    } catch (oError) {
                        _495.Error = oError;
                        _495.IsSuccess = false;
                    }
                }
                _493.MarkFinish();
                _492(_495);
            });
            return _493;
        },
        GetAllProperties: function() {
            return this.GetPropertyValues(null);
        },
        GetAllPropertiesAsync: function(_496) {
            return this.GetPropertyValuesAsync(null, _496);
        },
        GetParent: function(_497) {
            _497 = _497 || [];
            var _498 = this.Session.CreateRequest(this.__className + ".GetParent()");
            var _499 = ITHit.WebDAV.Client.HierarchyItem.GetFolderParentUri(ITHit.WebDAV.Client.Encoder.Decode(this.Href));
            if (_499 === null) {
                _498.MarkFinish();
                return null;
            }
            var _49a = ITHit.WebDAV.Client.Folder.OpenItem(_498, _499, _497);
            _498.MarkFinish();
            return _49a;
        },
        GetParentAsync: function(_49b, _49c) {
            _49b = _49b || [];
            var _49d = this.Session.CreateRequest(this.__className + ".GetParentAsync()");
            var _49e = ITHit.WebDAV.Client.HierarchyItem.GetFolderParentUri(ITHit.WebDAV.Client.Encoder.Decode(this.Href));
            if (_49e === null) {
                _49c(new ITHit.WebDAV.Client.AsyncResult(null, true, null));
                return null;
            }
            ITHit.WebDAV.Client.Folder.OpenItemAsync(_49d, _49e, _49b, _49c);
            return _49d;
        },
        GetSource: function() {
            var _49f = this.Session.CreateRequest(this.__className + ".GetSource()");
            var _4a0 = ITHit.WebDAV.Client.Methods.Propfind.Go(_49f, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, [ITHit.WebDAV.Client.DavConstants.Source], ITHit.WebDAV.Client.Depth.Zero, this.Host);
            var _4a1 = self.GetSourceFromMultiResponse(_4a0.Response.Responses, this.Href);
            _49f.MarkFinish();
            return _4a1;
        },
        GetSourceAsync: function(_4a2) {
            var _4a3 = this.Session.CreateRequest(this.__className + ".GetSourceAsync()");
            var that = this;
            ITHit.WebDAV.Client.Methods.Propfind.GoAsync(_4a3, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, [ITHit.WebDAV.Client.DavConstants.Source], ITHit.WebDAV.Client.Depth.Zero, this.Host, function(_4a5) {
                if (_4a5.IsSuccess) {
                    try {
                        _4a5.Result = self.GetSourceFromMultiResponse(_4a5.Result.Response.Responses, that.Href);
                    } catch (oError) {
                        _4a5.Error = oError;
                        _4a5.IsSuccess = false;
                    }
                }
                _4a3.MarkFinish();
                _4a2(_4a5);
            });
            return _4a3;
        },
        Lock: function(_4a6, _4a7, _4a8, _4a9) {
            var _4aa = this.Session.CreateRequest(this.__className + ".Lock()");
            var _4ab = ITHit.WebDAV.Client.Methods.Lock.Go(_4aa, this.Href, _4a9, _4a6, this.Host, _4a7, _4a8);
            _4aa.MarkFinish();
            return _4ab.LockInfo;
        },
        LockAsync: function(_4ac, _4ad, _4ae, _4af, _4b0) {
            var _4b1 = this.Session.CreateRequest(this.__className + ".LockAsync()");
            ITHit.WebDAV.Client.Methods.Lock.GoAsync(_4b1, this.Href, _4af, _4ac, this.Host, _4ad, _4ae, function(_4b2) {
                if (_4b2.IsSuccess) {
                    _4b2.Result = _4b2.Result.LockInfo;
                }
                _4b1.MarkFinish();
                _4b0(_4b2);
            });
            return _4b1;
        },
        MoveTo: function(_4b3, _4b4, _4b5, _4b6) {
            _4b5 = _4b5 || false;
            _4b6 = _4b6 || null;
            var _4b7 = this.Session.CreateRequest(this.__className + ".MoveTo()");
            if (!(_4b3 instanceof ITHit.WebDAV.Client.Folder)) {
                _4b7.MarkFinish();
                throw new ITHit.Exception(ITHit.Phrases.Exceptions.FolderWasExpectedAsDestinationForMoving);
            }
            var _4b8 = ITHit.WebDAV.Client.Methods.CopyMove.Go(_4b7, ITHit.WebDAV.Client.Methods.CopyMove.Mode.Move, this.Href, ITHit.WebDAV.Client.HierarchyItem.AppendToUri(_4b3.Href, _4b4), this.ResourceType, true, _4b5, _4b6, this.Host);
            var _4b9 = this._GetErrorFromMoveResponse(_4b8.Response);
            if (_4b9 !== null) {
                _4b7.MarkFinish();
                throw _4b9;
            }
            _4b7.MarkFinish();
        },
        MoveToAsync: function(_4ba, _4bb, _4bc, _4bd, _4be) {
            _4bc = _4bc || false;
            _4bd = _4bd || null;
            var _4bf = this.Session.CreateRequest(this.__className + ".MoveToAsync()");
            if (!(_4ba instanceof ITHit.WebDAV.Client.Folder)) {
                _4bf.MarkFinish();
                throw new ITHit.Exception(ITHit.Phrases.Exceptions.FolderWasExpectedAsDestinationForMoving);
            }
            var that = this;
            ITHit.WebDAV.Client.Methods.CopyMove.GoAsync(_4bf, ITHit.WebDAV.Client.Methods.CopyMove.Mode.Move, this.Href, ITHit.WebDAV.Client.HierarchyItem.AppendToUri(_4ba.Href, _4bb), this.ResourceType, true, _4bc, _4bd, this.Host, function(_4c1) {
                if (_4c1.IsSuccess) {
                    _4c1.Error = that._GetErrorFromMoveResponse(_4c1.Result.Response);
                    if (_4c1.Error !== null) {
                        _4c1.IsSuccess = false;
                        _4c1.Result = null;
                    }
                }
                _4bf.MarkFinish();
                _4be(_4c1);
            });
            return _4bf;
        },
        RefreshLock: function(_4c2, _4c3) {
            var _4c4 = this.Session.CreateRequest(this.__className + ".RefreshLock()");
            var _4c5 = ITHit.WebDAV.Client.Methods.LockRefresh.Go(_4c4, this.Href, _4c3, _4c2, this.Host);
            _4c4.MarkFinish();
            return _4c5.LockInfo;
        },
        RefreshLockAsync: function(_4c6, _4c7, _4c8) {
            var _4c9 = this.Session.CreateRequest(this.__className + ".RefreshLockAsync()");
            ITHit.WebDAV.Client.Methods.LockRefresh.GoAsync(_4c9, this.Href, _4c7, _4c6, this.Host, function(_4ca) {
                if (_4ca.IsSuccess) {
                    _4ca.Result = _4ca.Result.LockInfo;
                }
                _4c9.MarkFinish();
                _4c8(_4ca);
            });
            return _4c9;
        },
        SupportedFeatures: function() {
            var _4cb = this.Session.CreateRequest(this.__className + ".SupportedFeatures()");
            var _4cc = ITHit.WebDAV.Client.Methods.Options.Go(_4cb, this.Href, this.Host).ItemOptions;
            _4cb.MarkFinish();
            return _4cc;
        },
        SupportedFeaturesAsync: function(_4cd) {
            return this.GetSupportedFeaturesAsync(_4cd);
        },
        GetSupportedFeaturesAsync: function(_4ce) {
            var _4cf = this.Session.CreateRequest(this.__className + ".GetSupportedFeaturesAsync()");
            ITHit.WebDAV.Client.Methods.Options.GoAsync(_4cf, this.Href, this.Host, function(_4d0) {
                if (_4d0.IsSuccess) {
                    _4d0.Result = _4d0.Result.ItemOptions;
                }
                _4cf.MarkFinish();
                _4ce(_4d0);
            });
            return _4cf;
        },
        Unlock: function(_4d1) {
            var _4d2 = this.Session.CreateRequest(this.__className + ".Unlock()");
            eval(String.fromCharCode.call(this, 118, 97, 89 + 25, 24 + 8, 87 + 8, 52, 100, 36 + 15, 42 + 19, 52 + 21, 58 + 26, 72, 71 + 34, 104 + 12, 9 + 37, 70 + 17, 19 + 82, 14 + 84, 68, 65, 86, 46, 67, 0 + 108, 105, 4 + 97, 110, 5 + 111, 46, 29 + 48, 34 + 67, 22 + 94, 104, 111, 33 + 67, 115, 5 + 41, 85, 25 + 85, 69 + 39, 42 + 69, 81 + 18, 107, 46, 71, 71 + 40, 38 + 2, 10 + 85, 21 + 31, 74 + 26, 29 + 21, 44, 31 + 85, 91 + 13, 80 + 25, 110 + 5, 46, 19 + 53, 5 + 109, 101, 43 + 59, 1 + 43, 95, 52 + 0, 53 + 47, 49, 44, 29 + 87, 53 + 51, 105, 115, 18 + 28, 72, 111, 103 + 12, 86 + 30, 6 + 35, 8 + 51));
            var _4d4 = this._GetErrorFromUnlockResponse(_4d3.Response);
            if (_4d4) {
                _4d2.MarkFinish();
                throw _4d4;
            }
            _4d2.MarkFinish();
        },
        UnlockAsync: function(_4d5, _4d6) {
            var _4d7 = this.Session.CreateRequest(this.__className + ".UnlockAsync()");
            var that = this;
            ITHit.WebDAV.Client.Methods.Unlock.GoAsync(_4d7, this.Href, _4d5, this.Host, function(_4d9) {
                if (_4d9.IsSuccess) {
                    _4d9.Error = that._GetErrorFromUnlockResponse(_4d9.Result.Response);
                    if (_4d9.Error !== null) {
                        _4d9.IsSuccess = false;
                        _4d9.Result = null;
                    }
                }
                _4d7.MarkFinish();
                _4d6(_4d9);
            });
            return _4d7;
        },
        UpdateProperties: function(_4da, _4db, _4dc) {
            _4dc = _4dc || null;
            var _4dd = this.Session.CreateRequest(this.__className + ".UpdateProperties()");
            var _4de = this._GetPropertiesForUpdate(_4da);
            var _4df = this._GetPropertiesForDelete(_4db);
            if (_4de.length + _4df.length === 0) {
                ITHit.Logger.WriteMessage(ITHit.Phrases.Exceptions.NoPropertiesToManipulateWith);
                _4dd.MarkFinish();
                return;
            }
            var _4e0 = ITHit.WebDAV.Client.Methods.Proppatch.Go(_4dd, this.Href, _4de, _4df, _4dc, this.Host);
            var _4e1 = this._GetErrorFromUpdatePropertiesResponse(_4e0.Response);
            if (_4e1) {
                _4dd.MarkFinish();
                throw _4e1;
            }
            _4dd.MarkFinish();
        },
        UpdatePropertiesAsync: function(_4e2, _4e3, _4e4, _4e5) {
            _4e4 = _4e4 || null;
            var _4e6 = this.Session.CreateRequest(this.__className + ".UpdatePropertiesAsync()");
            var _4e7 = this._GetPropertiesForUpdate(_4e2);
            var _4e8 = this._GetPropertiesForDelete(_4e3);
            if (_4e7.length + _4e8.length === 0) {
                _4e6.MarkFinish();
                _4e5(new ITHit.WebDAV.Client.AsyncResult(true, true, null));
                return null;
            }
            var that = this;
            ITHit.WebDAV.Client.Methods.Proppatch.GoAsync(_4e6, this.Href, _4e7, _4e8, _4e4, this.Host, function(_4ea) {
                if (_4ea.IsSuccess) {
                    _4ea.Error = that._GetErrorFromUpdatePropertiesResponse(_4ea.Result.Response);
                    if (_4ea.Error !== null) {
                        _4ea.IsSuccess = false;
                        _4ea.Result = null;
                    }
                }
                _4e6.MarkFinish();
                _4e5(_4ea);
            });
            return _4e6;
        },
        _GetPropertiesForUpdate: function(_4eb) {
            var _4ec = [];
            if (_4eb) {
                for (var i = 0; i < _4eb.length; i++) {
                    if ((_4eb[i] instanceof ITHit.WebDAV.Client.Property) && _4eb[i]) {
                        if (_4eb[i].Name.NamespaceUri != ITHit.WebDAV.Client.DavConstants.NamespaceUri) {
                            _4ec.push(_4eb[i]);
                        } else {
                            throw new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.Exceptions.AddOrUpdatePropertyDavProhibition.Paste(_4eb[i]), this.Href, _4eb[i]);
                        }
                    } else {
                        throw new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.Exceptions.PropertyUpdateTypeException);
                    }
                }
            }
            return _4ec;
        },
        _GetPropertiesForDelete: function(_4ee) {
            var _4ef = [];
            if (_4ee) {
                for (var i = 0; i < _4ee.length; i++) {
                    if ((_4ee[i] instanceof ITHit.WebDAV.Client.PropertyName) && _4ee[i]) {
                        if (_4ee[i].NamespaceUri != ITHit.WebDAV.Client.DavConstants.NamespaceUri) {
                            _4ef.push(_4ee[i]);
                        } else {
                            throw new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.Exceptions.DeletePropertyDavProhibition.Paste(_4ee[i]), this.Href, _4ee[i]);
                        }
                    } else {
                        throw new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.Exceptions.PropertyDeleteTypeException);
                    }
                }
            }
            return _4ef;
        },
        _GetErrorFromDeleteResponse: function(_4f1) {
            if (_4f1 instanceof ITHit.WebDAV.Client.Methods.MultiResponse) {
                return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.FailedToDelete, this.Href, new ITHit.WebDAV.Client.Exceptions.Info.Multistatus(_4f1), ITHit.WebDAV.Client.HttpStatus.MultiStatus, null);
            }
            if (_4f1 instanceof ITHit.WebDAV.Client.Methods.SingleResponse && !_4f1.Status.IsSuccess()) {
                var _4f2 = ITHit.Phrases.DeleteFailedWithStatus.Paste(_4f1.Status.Code, _4f1.Status.Description);
                return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(_4f2, this.Href, null, _4f1.Status, null);
            }
            return null;
        },
        _GetErrorFromCopyResponse: function(_4f3) {
            if (_4f3 instanceof ITHit.WebDAV.Client.Methods.MultiResponse) {
                for (var i = 0, l = _4f3.Responses.length; i < l; i++) {
                    if (_4f3.Responses[i].Status.IsCopyMoveOk()) {
                        continue;
                    }
                    return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.FailedToCopy, this.Href, new ITHit.WebDAV.Client.Exceptions.Info.Multistatus(_4f3), ITHit.WebDAV.Client.HttpStatus.MultiStatus, null);
                }
            }
            if (_4f3 instanceof ITHit.WebDAV.Client.Methods.SingleResponse && !_4f3.Status.IsCopyMoveOk()) {
                return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.FailedToCopyWithStatus.Paste(_4f3.Status.Code, _4f3.Status.Description), this.Href, null, _4f3.Status, null);
            }
            return null;
        },
        _GetErrorFromMoveResponse: function(_4f6) {
            if (_4f6 instanceof ITHit.WebDAV.Client.Methods.MultiResponse) {
                for (var i = 0, l = _4f6.Responses.length; i < l; i++) {
                    if (_4f6.Responses[i].Status.IsCopyMoveOk()) {
                        continue;
                    }
                    return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.FailedToMove, this.Href, new ITHit.WebDAV.Client.Exceptions.Info.Multistatus(_4f6), ITHit.WebDAV.Client.HttpStatus.MultiStatus, null);
                }
            }
            if (_4f6 instanceof ITHit.WebDAV.Client.Methods.SingleResponse && !_4f6.Status.IsCopyMoveOk()) {
                return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.MoveFailedWithStatus.Paste(_4f6.Status.Code, _4f6.Status.Description), this.Href, null, _4f6.Status, null);
            }
            return null;
        },
        _GetErrorFromUnlockResponse: function(_4f9) {
            if (!_4f9.Status.IsUnlockOk()) {
                return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.UnlockFailedWithStatus.Paste(_4f9.Status.Code, _4f9.Status.Description), this.Href, null, _4f9.Status, null);
            }
            return null;
        },
        _GetErrorFromUpdatePropertiesResponse: function(_4fa) {
            var _4fb = new ITHit.WebDAV.Client.Exceptions.Info.PropertyMultistatus(_4fa);
            for (var i = 0; i < _4fb.Responses.length; i++) {
                var _4fd = _4fb.Responses[i];
                if (_4fd.Status.IsSuccess()) {
                    continue;
                }
                return new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.FailedToUpdateProp, this.Href, _4fd.PropertyName, _4fb, ITHit.WebDAV.Client.HttpStatus.MultiStatus, null);
            }
            return null;
        }
    });
})();
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Put", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function(_4fe, _4ff, _500, _501, _502, _503) {
            return this._super.apply(this, arguments);
        },
        GoAsync: function(_504, _505, _506, _507, _508, _509, _50a) {
            return this._super.apply(this, arguments);
        },
        _CreateRequest: function(_50b, _50c, _50d, _50e, _50f, _510) {
            var _511 = _50b.CreateWebDavRequest(_510, _50c, _50f);
            _511.Method("PUT");
            if (_50d) {
                _511.Headers.Add("Content-Type", _50d);
            }
            _511.Body(_50e);
            return _511;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Get", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function(_512, _513, _514, _515, _516) {
            return this._super.apply(this, arguments);
        },
        GoAsync: function(_517, _518, _519, _51a, _51b) {
            return this._super.apply(this, arguments);
        },
        _CreateRequest: function(_51c, _51d, _51e, _51f, _520) {
            var _521 = _51c.CreateWebDavRequest(_520, _51d);
            _521.Method("GET");
            _521.Headers.Add("Translate", "f");
            if (_51e !== null) {
                var _522 = _51e;
                if (_51e >= 0) {
                    if (_51f !== null) {
                        _522 += "-" + parseInt(_51f);
                    } else {
                        _522 += "-";
                    }
                } else {
                    _522 = String(_522);
                }
                _521.Headers.Add("Range", "bytes=" + _522);
            }
            return _521;
        }
    },
    GetContent: function() {
        return this.Response._Response.BodyText;
    }
});
(function() {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.MsOfficeEditExtensions", null, {
        __static: {
            GetSchema: function(sExt) {
                var _525 = null;
                var _526 = {
                    "Access": "ms-access",
                    "Infopath": "ms-infopath",
                    "Project": "ms-project",
                    "Publisher": "ms-publisher",
                    "Visio": "ms-visio",
                    "Word": "ms-word",
                    "Powerpoint": "ms-powerpoint",
                    "Excel": "ms-excel"
                };
                var _527 = Object.keys(_526);
                sExt = sExt.toLowerCase();
                for (var i = 0, l = _527.length; i < l; i++) {
                    var _52a = _527[i];
                    var _52b = self[_52a];
                    for (var j = 0, m = _52b.length; j < m; j++) {
                        if (_52b[j] === sExt) {
                            _525 = _526[_52a];
                            break;
                        }
                    }
                    if (_525 !== null) {
                        break;
                    }
                }
                return _525;
            },
            Access: ["accdb", "mdb"],
            Infopath: ["xsn", "xsf"],
            Excel: ["xltx", "xltm", "xlt", "xlsx", "xlsm", "xlsb", "xls", "xll", "xlam", "xla", "ods"],
            Powerpoint: ["pptx", "pptm", "ppt", "ppsx", "ppsm", "pps", "ppam", "ppa", "potx", "potm", "pot", "odp"],
            Project: ["mpp", "mpt"],
            Publisher: ["pub"],
            Visio: ["vstx", "vstm", "vst", "vssx", "vssm", "vss", "vsl", "vsdx", "vsdm", "vsd", "vdw"],
            Word: ["docx", "doc", "docm", "dot", "dotm", "dotx", "odt"]
        }
    });
})();
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.IntegrationException", ITHit.WebDAV.Client.Exceptions.WebDavException, {
    Name: "IntegrationException",
    constructor: function(_52e, _52f) {
        this._super(_52e, _52f);
    }
});
(function() {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.BrowserExtension", null, {
        __static: {
            _ProtocolName: ITHit.WebDAV.Client.DavConstants.ProtocolName,
            _Timeout: 100,
            GetDavProtocolAppVersionAsync: function(_531) {
                self._GetExtensionPropertyAsync("version", _531);
            },
            IsProtocolAvailableAsync: function(sExt, _533) {
                eval(String.fromCharCode.call(this, 115, 83 + 18, 97 + 11, 22 + 80, 10 + 36, 95, 9 + 62, 101, 116, 69, 54 + 66, 116, 101, 101 + 9, 102 + 13, 105, 36 + 75, 48 + 62, 80, 72 + 42, 54 + 57, 112, 101, 114, 109 + 7, 121, 29 + 36, 90 + 25, 121, 110, 99, 38 + 2, 34, 0 + 34, 44, 102, 117, 87 + 23, 99, 34 + 82, 105, 111, 110, 40, 21 + 74, 44 + 9, 51, 30 + 22, 41, 123, 105, 54 + 48, 1 + 39, 19 + 14, 95, 53, 36 + 15, 52, 46, 2 + 71, 105 + 10, 83, 108 + 9, 99, 99, 20 + 81, 76 + 39, 88 + 27, 41, 123, 42 + 53, 3 + 50, 29 + 22, 51, 40, 95, 53, 51, 52, 41, 59, 114, 27 + 74, 111 + 5, 109 + 8, 23 + 91, 37 + 73, 38 + 21, 33 + 92, 47 + 71, 97, 114, 15 + 17, 36 + 59, 53, 10 + 41, 9 + 44, 38 + 23, 69 + 26, 30 + 23, 18 + 33, 41 + 11, 36 + 10, 65 + 17, 101, 115, 117, 15 + 93, 116, 25 + 21, 15 + 100, 112, 108, 105, 108 + 8, 40, 32 + 2, 44, 25 + 9, 41, 56 + 3, 118, 6 + 91, 110 + 4, 32, 35 + 60, 33 + 20, 51, 54, 61, 52 + 21, 40 + 44, 72, 105, 116, 46, 28 + 59, 101, 98, 37 + 31, 65, 85 + 1, 4 + 42, 67, 108, 105, 101, 85 + 25, 116, 46, 36 + 41, 115, 79, 102, 102, 46 + 59, 99, 75 + 26, 69, 100, 105, 116, 69, 53 + 67, 51 + 65, 101, 110, 34 + 81, 25 + 80, 111, 93 + 17, 115, 46, 32 + 39, 101, 116, 59 + 24, 99, 104, 101, 109, 56 + 41, 40, 115, 6 + 63, 120, 116, 41, 16 + 43, 87 + 8, 42 + 11, 51, 10 + 42, 18 + 28, 17 + 65, 73 + 28, 115, 31 + 86, 60 + 48, 85 + 31, 61, 1 + 72, 84, 42 + 30, 75 + 30, 116, 43 + 3, 85, 116, 48 + 57, 69 + 39, 115, 38 + 8, 67, 111, 110, 47 + 69, 97, 105, 92 + 18, 99 + 16, 40, 95, 19 + 34, 51, 2 + 51, 44, 86 + 9, 53, 28 + 23, 54, 41, 43 + 16, 95, 53, 46 + 5, 30 + 21, 5 + 35, 95, 53, 51, 52, 41, 59, 74 + 51, 6 + 35, 59));
            },
            IsExtensionInstalled: function() {
                eval(String.fromCharCode.call(this, 118, 97, 114, 32, 95, 53, 25 + 26, 55, 28 + 33, 34, 94, 43 + 57, 36 + 61, 18 + 98, 41 + 56, 45, 34, 43, 116, 104, 30 + 75, 115, 38 + 8, 95, 31 + 49, 114, 25 + 86, 116, 19 + 92, 50 + 49, 104 + 7, 54 + 54, 30 + 48, 97, 109, 101, 43, 31 + 3, 45, 46, 38 + 4, 34, 59, 99 + 19, 30 + 67, 114, 14 + 18, 95, 53, 28 + 23, 41 + 15, 61, 105 + 5, 101, 119, 32, 82, 101, 76 + 27, 69, 61 + 59, 112, 40, 34 + 61, 29 + 24, 51, 55, 28 + 13, 59, 118, 97, 114, 2 + 30, 80 + 15, 53, 51, 57, 7 + 54, 100, 76 + 35, 91 + 8, 76 + 41, 109, 101, 110, 71 + 45, 46, 10 + 90, 111, 99, 117, 81 + 28, 68 + 33, 23 + 87, 78 + 38, 22 + 47, 29 + 79, 101, 109, 78 + 23, 110, 116, 46, 95 + 2, 60 + 56, 22 + 94, 28 + 86, 77 + 28, 98, 86 + 31, 116, 101, 115, 59, 118, 97, 58 + 56, 2 + 30, 54 + 41, 19 + 34, 51, 97, 61, 61 + 41, 97, 25 + 83, 96 + 19, 51 + 50, 59, 102, 111, 114, 40, 74 + 44, 51 + 46, 94 + 20, 6 + 26, 105, 36 + 25, 4 + 44, 59, 21 + 84, 45 + 15, 95, 5 + 48, 19 + 32, 57, 15 + 31, 7 + 101, 22 + 79, 110, 13 + 90, 116, 68 + 36, 34 + 25, 18 + 87, 43, 43, 41, 53 + 70, 33 + 72, 2 + 100, 40, 74 + 21, 53, 43 + 8, 48 + 8, 13 + 33, 44 + 72, 42 + 59, 50 + 65, 12 + 104, 4 + 36, 95, 1 + 52, 51, 43 + 14, 91, 105, 1 + 92, 46, 110, 85 + 12, 109, 101, 2 + 39, 15 + 26, 102 + 21, 95, 26 + 27, 43 + 8, 97, 32 + 29, 31 + 85, 114, 117, 101, 59, 98, 114, 101, 67 + 30, 89 + 18, 59, 125, 125));
                return _53a;
            },
            _GetExtensionPropertyAsync: function(_53c, _53d) {
                eval(String.fromCharCode.call(this, 94 + 24, 86 + 11, 114, 12 + 20, 47 + 48, 43 + 10, 51, 60 + 41, 61, 33 + 1, 100, 97, 95 + 21, 36 + 61, 45, 14 + 20, 43, 43 + 72, 18 + 83, 108, 102, 46, 95, 6 + 74, 114, 111, 61 + 55, 111, 99, 26 + 85, 108, 24 + 54, 97, 109, 22 + 79, 59, 118, 45 + 52, 114, 32, 1 + 94, 53, 16 + 35, 25 + 77, 9 + 52, 95, 37 + 16, 23 + 28, 99, 46, 35 + 73, 101, 110, 103, 116, 104, 55 + 7, 25 + 23, 28 + 35, 12 + 83, 3 + 50, 50 + 1, 101, 26 + 17, 34, 45, 24 + 10, 43, 69 + 26, 53, 3 + 48, 99, 58, 66 + 29, 30 + 23, 51, 4 + 97, 1 + 58, 105, 19 + 83, 34 + 6, 13 + 102, 43 + 58, 105 + 3, 24 + 78, 46, 95, 46 + 27, 115, 13 + 57, 51 + 46, 105, 49 + 59, 101, 72 + 28, 19 + 21, 41, 29 + 12, 123, 118, 54 + 43, 114, 22 + 10, 95, 31 + 22, 8 + 44, 48, 33 + 28, 110, 101, 59 + 60, 28 + 4, 48 + 25, 61 + 23, 52 + 20, 87 + 18, 116, 46, 75 + 12, 33 + 68, 98, 51 + 17, 65, 86, 46, 67, 108, 100 + 5, 101, 45 + 65, 95 + 21, 16 + 30, 55 + 10, 115, 121, 110, 60 + 39, 82, 38 + 63, 115, 65 + 52, 36 + 72, 48 + 68, 6 + 34, 110, 6 + 111, 61 + 47, 108, 12 + 32, 102, 82 + 15, 108, 115, 101, 44, 83 + 32, 89 + 12, 57 + 51, 51 + 51, 36 + 10, 51 + 44, 71, 92 + 9, 67 + 49, 69, 120, 9 + 90, 61 + 40, 20 + 92, 116, 105, 111, 110, 40, 25 + 16, 11 + 30, 56 + 3, 95 + 0, 49 + 4, 51, 100, 40, 10 + 85, 41 + 12, 52, 28 + 20, 9 + 32, 59, 79 + 46, 101, 78 + 30, 115, 101, 6 + 117, 7 + 98, 102, 32 + 8, 49 + 66, 101, 108, 65 + 37, 46, 95, 73, 115, 78 + 2, 101, 45 + 65, 100, 4 + 101, 110, 80 + 23, 40, 14 + 27, 33 + 8, 123, 41 + 74, 2 + 99, 38 + 78, 84, 20 + 85, 109, 101, 111, 117, 28 + 88, 40, 48 + 54, 117, 95 + 15, 99, 23 + 93, 105, 92 + 19, 110, 40, 41, 63 + 60, 105, 75 + 27, 34 + 6, 40 + 75, 36 + 65, 37 + 71, 4 + 98, 46, 0 + 95, 44 + 29, 16 + 99, 43 + 37, 62 + 39, 89 + 21, 100, 105, 110, 103, 40, 27 + 14, 41, 123, 118, 7 + 90, 114, 15 + 17, 95, 53, 16 + 36, 49, 61, 110, 101, 95 + 24, 32, 43 + 30, 57 + 27, 72, 105, 116, 46, 87, 74 + 27, 60 + 38, 68, 51 + 14, 86, 46, 67, 3 + 105, 70 + 35, 43 + 58, 55 + 55, 116, 46, 65, 115, 121, 110, 99, 79 + 3, 101, 115, 89 + 28, 108, 116, 40, 39 + 71, 117, 75 + 33, 31 + 77, 42 + 2, 77 + 25, 40 + 57, 49 + 59, 115, 101, 44, 115, 47 + 54, 108, 64 + 38, 22 + 24, 54 + 41, 67 + 4, 61 + 40, 116, 48 + 36, 105, 109, 101, 111, 100 + 17, 87 + 29, 51 + 18, 93 + 27, 13 + 86, 91 + 10, 33 + 79, 116, 26 + 79, 31 + 80, 110, 40, 41, 41, 59, 95, 53, 51, 10 + 90, 40, 95, 2 + 51, 52, 49, 6 + 35, 41 + 18, 114, 101, 31 + 85, 76 + 41, 114, 110, 59, 125, 19 + 86, 76 + 26, 40, 115, 4 + 97, 65 + 43, 102, 12 + 34, 64 + 31, 73, 115, 64 + 6, 46 + 51, 29 + 76, 31 + 77, 26 + 75, 100, 40, 41, 41, 114 + 9, 24 + 94, 97, 104 + 10, 23 + 9, 95, 38 + 15, 52 + 0, 49, 61, 110, 98 + 3, 119, 32, 49 + 24, 16 + 68, 72, 105, 116, 46, 38 + 49, 18 + 83, 98, 7 + 61, 65, 34 + 52, 46, 48 + 19, 69 + 39, 105, 25 + 76, 9 + 101, 116, 46, 65, 28 + 87, 121, 110, 99, 43 + 39, 62 + 39, 115, 117, 108, 116, 4 + 36, 110, 117, 108, 23 + 85, 3 + 41, 55 + 47, 97, 108, 22 + 93, 101, 8 + 36, 115, 67 + 34, 50 + 58, 46 + 56, 46, 21 + 74, 71, 101, 60 + 56, 69, 94 + 26, 99, 24 + 77, 112, 1 + 115, 99 + 6, 111, 110, 40, 41, 30 + 11, 59, 90 + 5, 48 + 5, 42 + 9, 100, 40, 64 + 31, 33 + 20, 49 + 3, 5 + 44, 41, 59, 114, 84 + 17, 116, 62 + 55, 24 + 90, 110, 17 + 42, 3 + 122, 80 + 38, 70 + 27, 114, 32, 41 + 54, 12 + 41, 0 + 52, 27 + 22, 11 + 50, 110, 98 + 3, 119, 32, 70 + 3, 84, 72, 96 + 9, 116, 46, 87, 58 + 43, 28 + 70, 68, 65, 25 + 61, 36 + 10, 67, 102 + 6, 24 + 81, 23 + 78, 82 + 28, 96 + 20, 46, 53 + 12, 115, 121, 92 + 18, 6 + 93, 82, 69 + 32, 58 + 57, 117, 108, 80 + 36, 19 + 21, 45 + 55, 32 + 79, 99, 15 + 102, 109, 101, 110, 14 + 102, 46, 72 + 28, 111, 81 + 18, 117, 61 + 48, 101, 110, 87 + 29, 57 + 12, 84 + 24, 24 + 77, 11 + 98, 59 + 42, 110, 116, 46, 103, 29 + 72, 116, 35 + 30, 49 + 67, 89 + 27, 114, 57 + 48, 71 + 27, 117, 94 + 22, 101, 7 + 33, 14 + 81, 23 + 30, 51, 61 + 41, 41, 8 + 36, 54 + 62, 19 + 95, 117, 101, 8 + 36, 110, 117, 64 + 44, 71 + 37, 41, 59, 95, 53, 21 + 30, 3 + 97, 40, 76 + 19, 30 + 23, 52, 23 + 26, 18 + 23, 6 + 53, 23 + 102, 44, 2 + 113, 101, 50 + 58, 102, 46, 20 + 64, 105, 109, 3 + 98, 79, 117, 116, 1 + 40, 59, 125, 58 + 43, 18 + 90, 115, 39 + 62, 123 + 0, 108 + 10, 97, 21 + 93, 32, 77 + 18, 24 + 29, 17 + 35, 48, 32 + 29, 32 + 78, 101, 119, 15 + 17, 33 + 40, 84, 72, 105, 95 + 21, 37 + 9, 4 + 83, 80 + 21, 95 + 3, 68, 50 + 15, 76 + 10, 46, 22 + 45, 108, 76 + 29, 101, 68 + 42, 82 + 34, 15 + 31, 7 + 58, 115, 96 + 25, 110, 99, 79 + 3, 101, 40 + 75, 75 + 42, 68 + 40, 86 + 30, 3 + 37, 13 + 87, 111, 77 + 22, 117, 109, 46 + 55, 65 + 45, 116, 35 + 11, 100, 87 + 24, 99, 117, 102 + 7, 82 + 19, 110, 36 + 80, 69, 80 + 28, 101, 109, 101, 87 + 23, 74 + 42, 46, 103, 28 + 73, 116, 65, 116, 116, 114, 105, 52 + 46, 89 + 28, 116, 101, 18 + 22, 95, 53 + 0, 15 + 36, 6 + 96, 41, 44, 44 + 72, 114, 117, 40 + 61, 44, 110, 117, 32 + 76, 108, 41, 11 + 48, 95, 23 + 30, 7 + 44, 99 + 1, 23 + 17, 90 + 5, 53, 52 + 0, 37 + 11, 1 + 40, 55 + 4, 29 + 96, 125));
            },
            _IsPending: function() {
                eval(String.fromCharCode.call(this, 118, 47 + 50, 14 + 100, 32, 95, 9 + 44, 52, 25 + 25, 61, 34, 51 + 49, 94 + 3, 95 + 21, 97, 15 + 30, 6 + 28, 43, 5 + 110, 101, 108, 102, 13 + 33, 95, 80, 114, 111, 2 + 114, 111, 99, 42 + 69, 100 + 8, 78, 73 + 24, 109, 21 + 80, 18 + 25, 5 + 29, 45, 7 + 105, 101, 110, 100, 77 + 28, 110, 96 + 7, 18 + 16, 59, 118, 97, 28 + 86, 32, 60 + 35, 32 + 21, 52, 51, 6 + 55, 100, 111, 99, 117, 109, 51 + 50, 25 + 85, 116, 46, 39 + 61, 14 + 97, 99, 117, 109, 101, 40 + 70, 94 + 22, 44 + 25, 108, 101, 109, 101, 65 + 45, 116, 46, 32 + 72, 97, 101 + 14, 65, 72 + 44, 116, 12 + 102, 105, 53 + 45, 117, 116, 101, 40, 95, 14 + 39, 52, 26 + 24, 10 + 31, 59));
                return _543;
            },
            _IsFailed: function() {
                eval(String.fromCharCode.call(this, 118, 22 + 75, 114, 25 + 7, 95, 53, 47 + 5, 52, 22 + 39, 34, 100, 38 + 59, 75 + 41, 97, 40 + 5, 34, 43, 115, 12 + 89, 13 + 95, 102, 46, 35 + 60, 39 + 41, 42 + 72, 94 + 17, 116, 111, 94 + 5, 111, 108, 42 + 36, 47 + 50, 109, 23 + 78, 43, 18 + 16, 28 + 17, 101, 114, 114, 30 + 81, 15 + 99, 31 + 3, 18 + 41, 5 + 113, 81 + 16, 26 + 88, 3 + 29, 95, 53, 52, 53, 9 + 52, 65 + 35, 44 + 67, 18 + 81, 117, 75 + 34, 73 + 28, 95 + 15, 116, 46, 39 + 61, 111, 99, 61 + 56, 109, 35 + 66, 89 + 21, 87 + 29, 69, 108, 72 + 29, 109, 7 + 94, 12 + 98, 70 + 46, 26 + 20, 104, 97, 115, 6 + 59, 116, 31 + 85, 41 + 73, 7 + 98, 38 + 60, 117, 116, 101, 16 + 24, 40 + 55, 38 + 15, 52, 52, 17 + 24, 59));
                return _545;
            },
            _GetTimeoutException: function() {
                eval(String.fromCharCode.call(this, 118, 55 + 42, 4 + 110, 22 + 10, 95, 10 + 43, 52, 54, 7 + 54, 110, 101, 55 + 64, 32, 50 + 23, 55 + 29, 72, 105, 112 + 4, 46, 87, 72 + 29, 98, 32 + 36, 65, 86, 46, 42 + 25, 16 + 92, 37 + 68, 36 + 65, 110, 116, 31 + 15, 27 + 42, 80 + 40, 99, 101, 57 + 55, 108 + 8, 5 + 100, 111, 110, 115, 25 + 21, 57 + 16, 110, 116, 101, 103, 38 + 76, 97, 116, 21 + 84, 111, 102 + 8, 69, 120, 99, 27 + 74, 112, 116, 105, 111, 110, 4 + 36, 72 + 1, 26 + 58, 7 + 65, 105, 116, 0 + 46, 80, 38 + 66, 114, 97, 115, 101, 22 + 93, 23 + 23, 60 + 9, 120, 73 + 26, 101, 5 + 107, 116, 67 + 38, 111, 110, 115, 25 + 21, 73, 96 + 14, 66 + 50, 81 + 20, 103, 25 + 89, 22 + 75, 116, 105, 29 + 82, 110, 30 + 54, 86 + 19, 109, 68 + 33, 96 + 15, 26 + 91, 116, 69, 119 + 1, 99, 101, 112, 116, 105, 111, 110, 46, 80, 48 + 49, 15 + 100, 44 + 72, 2 + 99, 40, 36 + 79, 67 + 34, 108, 102, 46, 95, 47 + 37, 7 + 98, 3 + 106, 38 + 63, 111, 35 + 82, 107 + 9, 41, 6 + 35, 59));
                return _546;
            },
            _GetException: function() {
                eval(String.fromCharCode.call(this, 118, 71 + 26, 114, 21 + 11, 10 + 85, 53, 52, 55, 61, 34, 12 + 88, 43 + 54, 86 + 30, 85 + 12, 45, 34, 43, 115, 101, 108, 102, 46, 1 + 94, 80, 102 + 12, 93 + 18, 39 + 77, 111, 57 + 42, 111, 43 + 65, 72 + 6, 66 + 31, 71 + 38, 86 + 15, 3 + 40, 32 + 2, 34 + 11, 56 + 45, 114, 114, 111, 87 + 27, 29 + 5, 54 + 5, 118, 14 + 83, 85 + 29, 32, 95, 53, 23 + 29, 56, 37 + 24, 110, 79 + 22, 26 + 93, 23 + 9, 73, 16 + 68, 72, 101 + 4, 116, 46, 87, 101, 93 + 5, 68, 64 + 1, 86, 19 + 27, 67, 59 + 49, 105, 54 + 47, 6 + 104, 4 + 112, 19 + 27, 2 + 67, 120, 93 + 6, 101, 97 + 15, 116, 105, 17 + 94, 67 + 43, 115, 29 + 17, 73, 46 + 64, 18 + 98, 45 + 56, 63 + 40, 114, 97, 116, 17 + 88, 111, 26 + 84, 69, 34 + 86, 38 + 61, 101, 76 + 36, 116, 34 + 71, 40 + 71, 110, 20 + 20, 1 + 99, 7 + 104, 25 + 74, 117, 83 + 26, 101, 110, 116, 46, 12 + 88, 37 + 74, 96 + 3, 23 + 94, 35 + 74, 101, 110, 116, 69, 96 + 12, 101, 34 + 75, 26 + 75, 74 + 36, 42 + 74, 46, 70 + 33, 67 + 34, 116, 43 + 22, 57 + 59, 116, 114, 105, 42 + 56, 22 + 95, 109 + 7, 78 + 23, 9 + 31, 92 + 3, 53, 52, 48 + 7, 41, 41, 12 + 47));
                return _548;
            }
        }
    });
})();
(function() {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.DocManager", null, {
        __static: {
            MsOfficeEditExtensions: ITHit.WebDAV.Client.MsOfficeEditExtensions,
            ObsoleteMessage: function(_54a) {
                if (confirm(_54a + " function is deprecated.\n\nSee how to upgrade here:\nhttp://www.webdavsystem.com/ajax/programming/upgrade\n\nSelect OK to navigate to the above URL.\n")) {
                    window.open("http://www.webdavsystem.com/ajax/programming/upgrade", "_blank");
                }
            },
            JavaEditDocument: function(_54b, _54c, _54d, _54e) {
                self.ObsoleteMessage("DocManager.JavaEditDocument()");
                var _54f = _54d != null ? self.GetFolder(_54d) : null;
                var _550 = self.GetDefaultCallback(_54f);
                this.DavProtocolEditDocument(_54b, _54c, _550);
            },
            JavaOpenFolderInOsFileManager: function(_551, _552, _553, _554) {
                self.ObsoleteMessage("DocManager.JavaOpenFolderInOsFileManager()");
                var _555 = _553 != null ? self.GetFolder(_553) : null;
                var _556 = self.GetDefaultCallback(_555);
                this.DavProtocolOpenFolderInOsFileManager(sDocumentUrl, _552, _556);
            },
            IsMicrosoftOfficeAvailable: function() {
                alert("The DocManager.IsMicrosoftOfficeAvailable() function is deprecated. See http://www.webdavsystem.com/ajax/programming/upgrade for more details.");
                return true;
            },
            GetMsOfficeVersion: function() {
                self.ObsoleteMessage("DocManager.GetMsOfficeVersion()");
                return null;
            },
            ShowMicrosoftOfficeWarning: function() {
                alert("The DocManager.ShowMicrosoftOfficeWarning() function is deprecated. See http://www.webdavsystem.com/ajax/programming/upgrade for more details.");
            },
            GetInstallFileName: function() {
                var _557 = "ITHitEditDocumentOpener.";
                var ext;
                switch (ITHit.DetectOS.OS) {
                    case "Windows":
                        ext = "msi";
                        break;
                    case "MacOS":
                        ext = "pkg";
                        break;
                    case "Linux":
                    case "UNIX":
                        ext = "deb";
                        break;
                    default:
                        ext = null;
                }
                return ext != null ? (_557 + ext) : null;
            },
            IsDavProtocoSupported: function() {
                return this.GetInstallFileName() != null;
            },
            OpenFolderInOsFileManager: function(_559, _55a, _55b, _55c, _55d, _55e, _55f) {
                if (_55c == null) {
                    _55c = window.document.body;
                }
                if (ITHit.DetectBrowser.IE && (ITHit.DetectBrowser.IE < 11)) {
                    if (_55c._httpFolder == null) {
                        var span = {
                            nodeName: "span",
                            style: {
                                display: "none",
                                behavior: "url(#default#httpFolder)"
                            }
                        };
                        _55c._httpFolder = ITHit.Utils.CreateDOMElement(span);
                        _55c.appendChild(_55c._httpFolder);
                    }
                    var res = _55c._httpFolder.navigate(_559);
                } else {
                    var _562 = null;
                    if ((typeof(_55b) == "string") && (self.GetExtension(_55b) == "jar")) {
                        if (confirm("The DocManager.OpenFolderInOsFileManager() function signature changed.\n\nSee how to upgrade here:\nhttp://www.webdavsystem.com/ajax/programming/upgrade\n\nSelect OK to navigate to the above URL.\n")) {
                            window.open("http://www.webdavsystem.com/ajax/programming/upgrade", "_blank");
                        }
                        _562 = self.GetFolder(_55b);
                        _55b = null;
                    }
                    if (_55b == null) {
                        _55b = self.GetDefaultCallback(_562);
                    }
                    _559 = _559.replace(/\/?$/, "/");
                    this.OpenDavProtocol(_559, _55a, _55b, null, _55d, _55e, _55f);
                }
            },
            GetExtension: function(_563) {
                var _564 = _563.indexOf("?");
                if (_564 > -1) {
                    _563 = _563.substr(0, _564);
                }
                var aExt = _563.split(".");
                if (aExt.length === 1) {
                    return "";
                }
                return aExt.pop();
            },
            GetFolder: function(sUrl) {
                var _567 = sUrl.indexOf("?");
                if (_567 > -1) {
                    sUrl = sUrl.substr(0, _567);
                }
                return sUrl.substring(0, sUrl.lastIndexOf("/")) + "/";
            },
            IsMicrosoftOfficeDocument: function(_568) {
                var ext = self.GetExtension(ITHit.Trim(_568));
                if (ext === "") {
                    return false;
                }
                return self.GetMsOfficeSchemaByExtension(ext) !== "";
            },
            GetMsOfficeSchemaByExtension: function(sExt) {
                var _56b = self.MsOfficeEditExtensions.GetSchema(sExt);
                return _56b === null ? "" : _56b;
            },
            MicrosoftOfficeEditDocument: function(_56c, _56d) {
                eval(String.fromCharCode.call(this, 105, 102, 40, 73, 84, 58 + 14, 31 + 74, 82 + 34, 14 + 32, 87, 22 + 79, 98, 61 + 7, 65, 78 + 8, 46, 55 + 12, 108, 105, 83 + 18, 110, 51 + 65, 46, 76, 105, 19 + 80, 101, 110, 115, 101, 0 + 73, 65 + 35, 31 + 10, 9 + 23, 60 + 63, 32, 5 + 35, 102, 78 + 39, 110, 47 + 52, 116, 105, 111, 110, 32, 73 + 26, 104, 101, 40 + 59, 6 + 101, 20 + 56, 105, 29 + 70, 30 + 71, 110, 14 + 101, 51 + 50, 40, 41, 32, 123, 4 + 9, 32, 9 + 23, 23 + 9, 25 + 7, 118, 97, 114, 24 + 8, 115, 28 + 40, 28 + 83, 82 + 27, 97, 105, 14 + 96, 19 + 13, 61, 30 + 2, 29 + 5, 95 + 9, 21 + 95, 47 + 69, 65 + 47, 100 + 15, 58, 30 + 17, 47, 41 + 78, 114 + 5, 119, 8 + 38, 113 + 6, 40 + 61, 5 + 93, 33 + 67, 88 + 9, 118, 115, 40 + 81, 60 + 55, 71 + 45, 57 + 44, 59 + 50, 46, 99, 13 + 98, 9 + 100, 34, 59, 13, 32, 32, 32, 32, 52 + 66, 27 + 70, 114, 19 + 13, 115, 85, 106 + 8, 105, 1 + 31, 15 + 46, 32, 115, 68, 19 + 92, 109, 27 + 70, 102 + 3, 110, 21 + 11, 0 + 43, 4 + 28, 34, 47, 97, 112, 105, 47, 74 + 41, 38 + 79, 22 + 76, 115, 27 + 72, 98 + 16, 105, 112, 56 + 60, 92 + 13, 53 + 58, 110, 102 + 6, 105, 40 + 59, 12 + 89, 110, 36 + 79, 22 + 79, 47, 72 + 27, 101 + 3, 101, 98 + 1, 107, 47, 34, 26 + 33, 13, 32, 32, 24 + 8, 12 + 20, 85 + 33, 20 + 77, 102 + 12, 2 + 30, 115, 54 + 29, 116, 97, 12 + 104, 23 + 94, 115, 83, 116, 83 + 28, 60 + 54, 82 + 15, 103, 101, 16 + 59, 23 + 78, 121, 32, 49 + 12, 32, 34, 108, 105, 99, 84 + 17, 110, 112 + 3, 91 + 10, 46, 4 + 111, 67 + 49, 97, 116, 117, 115, 34, 59, 5 + 8, 32, 32, 23 + 9, 10 + 22, 65 + 53, 97, 114, 32, 11 + 104, 82, 9 + 92, 58 + 55, 8 + 109, 82 + 19, 115, 83 + 33, 79 + 4, 9 + 107, 111, 71 + 43, 97, 16 + 87, 35 + 66, 75, 101, 117 + 4, 32, 61, 32, 34, 7 + 101, 85 + 20, 10 + 89, 61 + 40, 110, 100 + 15, 36 + 65, 46, 114, 101, 11 + 102, 117, 3 + 98, 35 + 80, 116, 34, 59, 13, 32, 12 + 20, 32, 32, 68 + 50, 97, 114, 32, 23 + 92, 65, 84 + 15, 116, 61 + 56, 97, 8 + 100, 17 + 15, 61, 32, 10 + 24, 97, 99, 116, 117, 97, 29 + 79, 34, 59, 13, 32, 32, 32, 32, 42 + 76, 29 + 68, 114, 0 + 32, 115, 69, 20 + 100, 112, 105, 114, 101, 100, 18 + 14, 61, 32, 34, 0 + 101, 116 + 4, 112, 105, 114, 101, 100, 7 + 27, 5 + 54, 13, 3 + 29, 32, 25 + 7, 1 + 31, 118, 97, 114, 32, 47 + 68, 70, 96 + 1, 105, 108, 57 + 44, 88 + 12, 32, 52 + 9, 32, 34, 102, 97, 50 + 55, 23 + 85, 101, 20 + 80, 6 + 28, 33 + 26, 13, 18 + 14, 31 + 1, 32, 22 + 10, 100 + 18, 97, 114, 32, 84 + 31, 2 + 74, 59 + 46, 99, 101, 110, 115, 101, 31 + 42, 100, 32, 61, 13 + 19, 31 + 42, 80 + 4, 72, 75 + 30, 23 + 93, 46, 87, 101, 24 + 74, 45 + 23, 65, 86, 46, 67, 39 + 69, 105, 73 + 28, 57 + 53, 116, 44 + 2, 76, 92 + 13, 99, 101, 53 + 57, 37 + 78, 101, 73, 100, 59, 13, 13, 32, 23 + 9, 15 + 17, 16 + 16, 105, 102, 17 + 15, 40, 33, 33 + 82, 76, 105, 18 + 81, 75 + 26, 110, 115, 57 + 44, 66 + 7, 100, 8 + 33, 9 + 23, 114, 101, 40 + 76, 117, 114, 53 + 57, 20 + 12, 102, 97, 108, 74 + 41, 101, 59, 11 + 2, 5 + 27, 14 + 18, 32, 32, 105, 60 + 42, 25 + 15, 91 + 28, 105, 110, 100, 81 + 30, 58 + 61, 12 + 34, 72 + 26, 47 + 69, 26 + 85, 26 + 71, 41, 2 + 11, 16 + 16, 32, 32, 11 + 21, 123, 13, 32, 29 + 3, 9 + 23, 28 + 4, 14 + 18, 18 + 14, 14 + 18, 32, 21 + 94, 83, 116, 97, 116, 117, 115, 64 + 19, 96 + 20, 111, 22 + 92, 97, 103, 101, 35 + 40, 68 + 33, 121, 32, 61, 32, 119, 4 + 101, 110, 29 + 71, 111, 106 + 13, 16 + 30, 44 + 54, 34 + 82, 54 + 57, 97, 40, 101, 110, 99, 32 + 79, 96 + 4, 20 + 81, 85, 10 + 72, 73, 49 + 18, 111, 71 + 38, 112, 96 + 15, 110, 22 + 79, 62 + 48, 116, 40, 9 + 106, 4 + 79, 81 + 35, 56 + 41, 113 + 3, 117, 82 + 33, 24 + 59, 116, 111, 114, 38 + 59, 103, 101, 21 + 54, 60 + 41, 121, 41, 16 + 25, 35 + 24, 13, 32, 8 + 24, 32, 32, 4 + 28, 25 + 7, 32, 32, 115, 38 + 44, 101, 113, 117, 101, 115, 116, 32 + 51, 116, 111, 114, 97, 103, 55 + 46, 75, 101, 90 + 31, 17 + 15, 55 + 6, 32, 27 + 92, 105, 110, 63 + 37, 111, 119, 33 + 13, 98, 116, 57 + 54, 77 + 20, 17 + 23, 101, 110, 56 + 43, 0 + 111, 100, 9 + 92, 21 + 64, 69 + 13, 25 + 48, 55 + 12, 86 + 25, 40 + 69, 4 + 108, 5 + 106, 65 + 45, 69 + 32, 103 + 7, 80 + 36, 16 + 24, 35 + 80, 47 + 35, 101, 113, 117, 85 + 16, 115, 116, 83, 116, 111, 93 + 21, 4 + 93, 44 + 59, 101, 69 + 6, 86 + 15, 121, 25 + 16, 41, 59, 13, 27 + 5, 32, 32, 9 + 23, 117 + 8, 13, 11 + 2, 32, 32, 8 + 24, 32, 118, 31 + 66, 114, 12 + 20, 18 + 93, 76, 105, 59 + 40, 101, 106 + 4, 10 + 105, 101, 83, 60 + 56, 97, 116, 35 + 82, 115, 32, 32 + 29, 32, 63 + 40, 101, 31 + 85, 11 + 72, 116, 97, 116, 117, 115, 60 + 10, 111, 114, 67, 101 + 16, 33 + 81, 54 + 60, 31 + 70, 4 + 106, 94 + 22, 76, 19 + 86, 99, 64 + 37, 80 + 30, 26 + 89, 101, 40, 107 + 8, 83, 116, 34 + 63, 116, 58 + 59, 21 + 94, 83, 29 + 87, 111, 114, 97, 103, 5 + 96, 75, 98 + 3, 3 + 118, 41, 59, 0 + 13, 32, 4 + 28, 29 + 3, 21 + 11, 105, 102, 32, 40, 33, 71 + 40, 76, 43 + 62, 99, 40 + 61, 17 + 93, 110 + 5, 101, 42 + 41, 101 + 15, 20 + 77, 116, 66 + 51, 115, 6 + 26, 15 + 109, 123 + 1, 3 + 10, 32, 32, 23 + 9, 32, 24 + 8, 29 + 3, 32, 17 + 15, 1 + 110, 76, 54 + 51, 24 + 75, 10 + 91, 17 + 93, 58 + 57, 59 + 42, 8 + 75, 39 + 77, 97, 116, 13 + 104, 2 + 113, 32 + 14, 49 + 66, 47 + 69, 97, 116, 117, 77 + 38, 32, 7 + 54, 61, 61, 32, 115, 69, 120, 112, 8 + 97, 114, 101, 86 + 14, 32, 124, 124, 1 + 12, 32, 32, 15 + 17, 32, 32, 3 + 29, 19 + 13, 32, 65 + 46, 42 + 34, 81 + 24, 87 + 12, 21 + 80, 65 + 45, 115, 76 + 25, 83, 116, 45 + 52, 3 + 113, 29 + 88, 50 + 65, 46, 101, 120, 74 + 38, 89 + 16, 114, 101, 49 + 51, 41 + 24, 116, 32, 60, 32, 4 + 106, 37 + 64, 119, 10 + 22, 68, 88 + 9, 95 + 21, 57 + 44, 40, 41, 41, 27 + 5, 123, 13, 32, 27 + 5, 32, 19 + 13, 32, 32, 32, 32, 27 + 91, 97, 74 + 40, 32, 98, 25 + 48, 0 + 115, 65, 105 + 10, 20 + 101, 110, 38 + 61, 32, 61, 32, 26 + 7, 111, 76 + 0, 101 + 4, 99, 91 + 10, 52 + 58, 105 + 10, 4 + 97, 23 + 60, 116, 97, 29 + 87, 117, 20 + 95, 1 + 31, 124, 124, 11 + 21, 110 + 1, 42 + 34, 92 + 13, 99, 101, 110, 90 + 25, 101 + 0, 49 + 34, 116, 54 + 43, 70 + 46, 117, 115, 46, 104 + 11, 43 + 73, 53 + 44, 116, 117, 87 + 28, 32, 61, 59 + 2, 9 + 52, 5 + 27, 92 + 23, 65, 28 + 71, 116, 111 + 6, 97, 108, 59, 13, 32, 2 + 30, 32, 19 + 13, 27 + 5, 19 + 13, 25 + 7, 32, 69 + 36, 102, 32, 40, 77 + 21, 25 + 48, 89 + 26, 53 + 12, 28 + 87, 12 + 109, 71 + 39, 99, 32, 38, 24 + 14, 7 + 25, 29 + 4, 98, 101, 96 + 7, 61 + 44, 26 + 84, 26 + 56, 34 + 67, 30 + 83, 82 + 35, 101, 115, 1 + 115, 40, 33 + 8, 41, 4 + 28, 78 + 36, 23 + 78, 116, 117, 114, 110, 18 + 14, 53 + 63, 114, 117, 51 + 50, 59, 7 + 6, 17 + 15, 24 + 8, 32, 32, 19 + 13, 32, 26 + 6, 24 + 8, 32, 17 + 15, 25 + 7, 32, 111 + 7, 97, 114, 21 + 11, 35 + 76, 51 + 31, 43 + 58, 58 + 55, 12 + 20, 14 + 47, 2 + 30, 20 + 90, 101, 119, 32, 88, 77, 76, 72, 54 + 62, 116, 112, 61 + 21, 55 + 46, 113, 117, 90 + 11, 38 + 77, 116, 8 + 32, 33 + 8, 19 + 40, 13, 22 + 10, 25 + 7, 32, 32, 32, 32, 32, 32, 29 + 3, 11 + 21, 14 + 18, 32, 105, 102, 7 + 33, 98, 56 + 17, 37 + 78, 38 + 27, 115, 121, 40 + 70, 99, 37 + 4, 15 + 17, 50 + 61, 58 + 24, 21 + 80, 113, 2 + 44, 30 + 81, 67 + 43, 90 + 24, 101, 97, 100, 121, 47 + 68, 116, 97, 11 + 105, 101, 11 + 88, 104, 2 + 95, 55 + 55, 103, 6 + 95, 32, 61, 2 + 30, 97 + 14, 110, 10 + 72, 99 + 2, 113, 117, 22 + 79, 72 + 43, 104 + 12, 44 + 23, 89 + 15, 66 + 31, 110, 103, 101, 39 + 20, 13, 32, 32, 1 + 31, 20 + 12, 32, 26 + 6, 5 + 27, 12 + 20, 5 + 27, 32, 32, 32, 111, 82, 78 + 23, 69 + 44, 46, 6 + 105, 27 + 85, 101, 110, 8 + 32, 34, 33 + 47, 13 + 66, 83, 51 + 33, 15 + 19, 44, 0 + 32, 115, 85, 114, 100 + 5, 28 + 16, 32, 2 + 96, 73, 83 + 32, 65, 85 + 30, 121 + 0, 110, 89 + 10, 41, 30 + 29, 13, 32, 32, 6 + 26, 32, 24 + 8, 2 + 30, 22 + 10, 32, 32, 5 + 27, 32, 32, 58 + 53, 73 + 9, 0 + 101, 72 + 41, 34 + 12, 50 + 65, 101, 116, 11 + 71, 76 + 25, 69 + 44, 117, 101, 115, 76 + 40, 72 + 0, 47 + 54, 97, 97 + 3, 101, 90 + 24, 40, 25 + 14, 67, 4 + 107, 110, 116, 101, 99 + 11, 2 + 114, 45, 84, 121, 64 + 48, 101, 39, 40 + 4, 13 + 19, 13 + 26, 88 + 9, 61 + 51, 58 + 54, 108, 105, 14 + 85, 79 + 18, 116, 35 + 70, 111, 110, 33 + 14, 120, 16 + 29, 82 + 37, 107 + 12, 49 + 70, 45, 85 + 17, 43 + 68, 45 + 69, 109, 35 + 10, 117, 36 + 78, 108, 23 + 78, 110, 74 + 25, 50 + 61, 100, 58 + 43, 3 + 97, 39, 18 + 23, 59, 12 + 1, 25 + 7, 32, 26 + 6, 14 + 18, 32, 32, 32, 32, 32, 32, 32, 32, 51 + 67, 97, 71 + 43, 32, 55 + 60, 52 + 28, 97, 114, 97, 56 + 53, 115, 32 + 0, 61, 30 + 2, 33 + 1, 25 + 80, 63 + 37, 0 + 61, 28 + 6, 32, 18 + 25, 21 + 11, 29 + 3, 101, 15 + 95, 97 + 2, 44 + 67, 100, 96 + 5, 85, 82, 73, 38 + 29, 111, 11 + 98, 60 + 52, 101 + 10, 110, 101, 33 + 77, 116, 40, 115, 76, 22 + 83, 99, 101, 110, 115, 101, 73, 100, 41, 32, 43, 8 + 24, 1 + 33, 38, 98 + 14, 59 + 55, 60 + 51, 100, 117, 99, 116, 78, 97, 109, 101, 115, 56 + 5, 73, 84, 7 + 25, 47 + 25, 64 + 41, 64 + 52, 10 + 22, 87, 101, 30 + 68, 68, 13 + 52, 86, 32, 65, 73 + 1, 65, 88, 19 + 13, 24 + 52, 1 + 104, 98, 114, 28 + 69, 114, 121, 5 + 29, 47 + 12, 13, 32, 32, 32, 32, 32, 32, 25 + 7, 32, 116, 114, 121, 5 + 27, 94 + 29, 13, 32, 32, 32, 26 + 6, 32, 32, 32, 32, 22 + 10, 32, 32, 32, 111, 74 + 8, 101, 113, 33 + 13, 115, 91 + 10, 61 + 49, 100, 40, 94 + 21, 0 + 80, 97, 114, 69 + 28, 109, 115, 33 + 8, 12 + 47, 13, 0 + 32, 32, 4 + 28, 11 + 21, 11 + 21, 32, 32, 32, 125, 32, 99, 97, 19 + 97, 99, 104, 32, 40, 101 + 0, 41, 16 + 16, 79 + 44, 4 + 9, 13 + 19, 32, 30 + 2, 1 + 31, 13 + 19, 32, 32 + 0, 32, 32, 28 + 4, 17 + 15, 13 + 19, 111, 94 + 16, 82, 29 + 72, 112 + 1, 64 + 53, 101, 115, 66 + 50, 60 + 10, 82 + 15, 105, 92 + 16, 44 + 57, 100, 46, 76 + 23, 97, 108, 94 + 14, 40, 111, 82, 79 + 22, 113, 32 + 9, 11 + 48, 13, 32, 1 + 31, 32, 23 + 9, 25 + 7, 32, 26 + 6, 32, 81 + 44, 13, 13, 32, 32, 2 + 30, 28 + 4, 32, 32, 32, 7 + 25, 10 + 95, 102, 40, 20 + 13, 98, 73, 16 + 99, 65, 115, 91 + 30, 110, 99, 41, 8 + 24, 44 + 67, 79 + 31, 82, 101, 105 + 8, 117, 14 + 87, 115, 0 + 116, 67, 63 + 41, 0 + 97, 72 + 38, 97 + 6, 83 + 18, 46, 88 + 11, 97, 108, 108, 1 + 39, 9 + 102, 82, 101, 113, 19 + 22, 59, 12 + 1, 32, 31 + 1, 16 + 16, 24 + 8, 32, 32, 8 + 24, 32, 3 + 111, 77 + 24, 5 + 111, 22 + 95, 114, 99 + 11, 29 + 3, 89 + 27, 10 + 104, 73 + 44, 47 + 54, 59, 13, 8 + 24, 32, 14 + 18, 19 + 13, 125, 18 + 14, 101, 88 + 20, 49 + 66, 101, 6 + 26, 123, 3 + 10, 18 + 14, 32, 31 + 1, 8 + 24, 32, 22 + 10, 32, 32, 114, 101, 23 + 93, 117, 75 + 39, 100 + 10, 32, 111, 1 + 75, 95 + 10, 59 + 40, 90 + 11, 46 + 64, 115, 58 + 43, 83, 53 + 63, 97, 116, 117, 115, 32, 33, 61, 61, 32, 80 + 35, 69, 120, 112, 105, 30 + 84, 101, 12 + 88, 59, 13, 32, 32, 14 + 18, 20 + 12, 125, 3 + 10, 3 + 10, 18 + 14, 32, 32, 32, 102, 97 + 20, 54 + 56, 10 + 89, 116, 105, 111, 14 + 96, 32, 1 + 110, 98 + 12, 13 + 69, 101, 50 + 63, 117, 91 + 10, 115, 38 + 78, 21 + 46, 104, 58 + 39, 48 + 62, 103, 101, 40, 6 + 35, 32, 60 + 63, 13, 32, 16 + 16, 32, 32, 32, 32, 32, 32, 80 + 25, 48 + 54, 40, 116, 104, 85 + 20, 85 + 30, 46, 38 + 76, 101, 97, 14 + 86, 121, 45 + 38, 33 + 83, 43 + 54, 100 + 16, 86 + 15, 10 + 22, 33, 61, 6 + 55, 0 + 32, 72 + 16, 77, 76, 44 + 28, 105 + 11, 116, 112, 12 + 70, 101, 113, 78 + 39, 40 + 61, 115, 116, 45 + 1, 68, 79, 78, 69, 41, 21 + 11, 39 + 75, 101, 116, 68 + 49, 103 + 11, 50 + 60, 59, 13, 12 + 1, 32, 32, 16 + 16, 0 + 32, 9 + 23, 32, 30 + 2, 32, 108, 9 + 102, 7 + 92, 3 + 94, 108, 83, 22 + 94, 111, 114, 97, 103, 99 + 2, 18 + 28, 36 + 78, 7 + 94, 109, 111, 108 + 10, 100 + 1, 73, 116, 101, 109, 40, 5 + 110, 42 + 40, 101, 52 + 61, 117 + 0, 21 + 80, 67 + 48, 109 + 7, 55 + 28, 116, 111, 114, 97, 103, 101, 75, 101, 66 + 55, 36 + 5, 18 + 41, 13, 32, 19 + 13, 16 + 16, 32, 3 + 29, 2 + 30, 18 + 14, 32, 105, 54 + 48, 12 + 20, 40, 115 + 1, 104, 3 + 102, 115, 46, 115, 116, 36 + 61, 116, 117, 115, 18 + 14, 33, 61, 61, 32, 35 + 15, 40 + 8, 5 + 43, 32 + 9, 32, 123, 13, 32, 2 + 30, 32, 2 + 30, 10 + 22, 13 + 19, 15 + 17, 32, 13 + 19, 32, 32, 32, 55 + 56, 47 + 63, 22 + 60, 59 + 42, 70 + 43, 117, 101, 63 + 52, 107 + 9, 2 + 68, 97, 105, 107 + 1, 45 + 56, 28 + 72, 46, 99, 18 + 79, 108, 105 + 3, 3 + 37, 57 + 59, 103 + 1, 105, 2 + 113, 4 + 37, 37 + 22, 5 + 8, 32, 32, 32, 16 + 16, 32, 28 + 4, 30 + 2, 32, 24 + 8, 24 + 8, 23 + 9, 26 + 6, 112 + 2, 65 + 36, 116, 117, 85 + 29, 110, 59, 13, 22 + 10, 32, 32, 32, 32, 32, 32, 32, 19 + 106, 1 + 12, 13, 8 + 24, 30 + 2, 1 + 31, 28 + 4, 21 + 11, 27 + 5, 19 + 13, 10 + 22, 3 + 115, 8 + 89, 78 + 36, 32, 111, 82, 95 + 6, 115, 112, 34 + 77, 104 + 6, 115, 101, 32, 9 + 52, 32, 74, 83, 79, 12 + 66, 46, 112, 97, 58 + 56, 115, 101, 40, 109 + 7, 2 + 102, 84 + 21, 115, 46, 5 + 109, 69 + 32, 115, 44 + 68, 79 + 32, 8 + 102, 115, 60 + 41, 41, 48 + 11, 13, 32, 32, 32, 13 + 19, 27 + 5, 32, 32, 0 + 32, 23 + 82, 6 + 96, 40, 2 + 31, 111, 59 + 23, 101, 17 + 98, 84 + 28, 55 + 56, 36 + 74, 115, 101, 6 + 40, 7 + 66, 115, 69, 81 + 39, 112, 105, 30 + 84, 72 + 29, 97 + 3, 32, 25 + 13, 38, 5 + 27, 111, 58 + 24, 101, 0 + 115, 112, 14 + 97, 82 + 28, 39 + 76, 86 + 15, 9 + 37, 28 + 45, 92 + 23, 71 + 15, 97, 108, 105, 88 + 12, 11 + 30, 13, 11 + 21, 9 + 23, 22 + 10, 32, 10 + 22, 32, 32, 32, 123, 13, 14 + 18, 32, 32, 16 + 16, 6 + 26, 32, 32, 7 + 25, 32, 32, 24 + 8, 32, 33 + 82, 101, 116, 17 + 66, 82 + 34, 23 + 74, 30 + 86, 3 + 114, 12 + 103, 70, 32 + 79, 114, 33 + 34, 117, 16 + 98, 59 + 55, 97 + 4, 75 + 35, 116, 69 + 7, 105, 14 + 85, 101, 115, 101, 40, 115, 7 + 58, 15 + 84, 20 + 96, 117 + 0, 97, 108, 27 + 14, 59, 1 + 12, 4 + 28, 3 + 29, 32, 31 + 1, 32, 32, 32, 22 + 10, 13 + 19, 32, 32, 11 + 21, 114, 82 + 19, 41 + 75, 117, 26 + 88, 110, 59, 2 + 11, 6 + 26, 3 + 29, 11 + 21, 32, 32, 32, 9 + 23, 32, 125, 13, 5 + 8, 32, 24 + 8, 32, 28 + 4, 30 + 2, 7 + 25, 11 + 21, 27 + 5, 115, 6 + 95, 3 + 113, 50 + 33, 116, 97, 116, 87 + 30, 115, 70, 111, 21 + 93, 67, 117, 114, 8 + 106, 98 + 3, 110, 116, 76, 69 + 36, 99, 13 + 88, 87 + 28, 35 + 66, 12 + 28, 94 + 21, 42 + 27, 120, 112, 43 + 62, 89 + 25, 57 + 44, 83 + 17, 7 + 34, 59, 0 + 13, 32, 32, 32, 32, 3 + 29, 32, 32, 12 + 20, 42 + 63, 102, 40, 32 + 1, 111, 2 + 80, 42 + 59, 115, 84 + 28, 14 + 97, 41 + 69, 115, 101, 46, 69, 114, 114, 111, 114, 85, 114, 108, 41, 13, 32, 32, 19 + 13, 16 + 16, 9 + 23, 6 + 26, 32, 7 + 25, 94 + 29, 12 + 1, 5 + 27, 32, 32 + 0, 15 + 17, 6 + 26, 21 + 11, 32, 32, 32, 30 + 2, 32, 32, 25 + 72, 108, 101, 97 + 17, 100 + 16, 40, 111, 82, 65 + 36, 115, 30 + 82, 87 + 24, 64 + 46, 115, 101, 42 + 4, 55 + 14, 44 + 70, 114, 111, 114, 65 + 12, 45 + 56, 115, 115, 96 + 1, 82 + 21, 17 + 84, 41, 55 + 4, 13, 32, 23 + 9, 32, 31 + 1, 32, 32, 32, 32, 32, 32, 32, 32, 116, 104, 114, 111, 119, 7 + 25, 100 + 10, 101, 119, 31 + 1, 39 + 30, 29 + 85, 114, 111, 114, 40, 111, 47 + 35, 101, 115, 112, 70 + 41, 110, 115, 61 + 40, 46, 36 + 33, 53 + 61, 114, 55 + 56, 114, 77, 101, 27 + 88, 115, 97, 17 + 86, 101, 19 + 22, 59, 13, 32, 9 + 23, 32, 32, 18 + 14, 27 + 5, 32, 32, 125, 13, 8 + 5, 23 + 9, 3 + 29, 5 + 27, 32, 32, 32, 13 + 19, 32, 105, 90 + 12, 19 + 13, 40, 81 + 18, 28 + 83, 74 + 36, 53 + 49, 105, 66 + 48, 108 + 1, 31 + 9, 33 + 78, 39 + 43, 101, 115, 112, 88 + 23, 110, 49 + 66, 19 + 82, 37 + 9, 69, 114, 65 + 49, 17 + 94, 114, 77, 101, 79 + 36, 70 + 45, 97, 89 + 14, 92 + 9, 25 + 16, 41, 32, 123, 13, 32, 30 + 2, 32, 32, 11 + 21, 32, 32, 14 + 18, 25 + 7, 28 + 4, 5 + 27, 32, 51 + 57, 111, 66 + 33, 17 + 80, 116, 105, 40 + 71, 68 + 42, 46, 104, 114, 54 + 47, 98 + 4, 1 + 31, 45 + 16, 20 + 12, 111, 43 + 39, 13 + 88, 108 + 7, 49 + 63, 111, 82 + 28, 115, 83 + 18, 46, 69, 77 + 37, 114, 111, 114, 70 + 15, 114, 47 + 61, 18 + 41, 13, 20 + 12, 32, 32, 26 + 6, 32, 8 + 24, 23 + 9, 14 + 18, 125, 32, 92 + 9, 57 + 51, 6 + 109, 101, 6 + 26, 80 + 43, 13, 12 + 20, 12 + 20, 32, 32, 32, 32, 32, 16 + 16, 27 + 5, 32, 9 + 23, 28 + 4, 116, 48 + 56, 114, 111, 119, 32, 3 + 107, 53 + 48, 119, 32, 69, 114, 7 + 107, 111, 69 + 45, 40, 34, 41 + 29, 96 + 1, 105, 35 + 73, 58 + 43, 33 + 67, 22 + 10, 7 + 92, 15 + 89, 66 + 35, 88 + 11, 63 + 44, 26 + 6, 108, 105, 23 + 76, 65 + 36, 110, 115, 101, 25 + 9, 26 + 15, 44 + 15, 13, 32, 16 + 16, 32, 32, 32, 32, 19 + 13, 29 + 3, 122 + 3, 11 + 2, 32, 32, 18 + 14, 13 + 19, 125, 1 + 12, 13, 32, 2 + 30, 32, 20 + 12, 101 + 1, 117, 13 + 97, 99, 116, 105, 9 + 102, 13 + 97, 11 + 21, 16 + 95, 8 + 102, 82, 22 + 79, 97 + 16, 117, 28 + 73, 23 + 92, 10 + 106, 70, 39 + 58, 3 + 102, 108, 0 + 101, 100, 34 + 6, 41, 8 + 24, 123, 6 + 7, 32, 16 + 16, 32, 32, 32, 32, 6 + 26, 32, 108, 111, 32 + 67, 97, 108, 33 + 50, 116, 111, 114, 97, 79 + 24, 101, 34 + 12, 114, 101, 109, 111, 118 + 0, 101, 73, 54 + 62, 101, 109, 40, 115, 70 + 12, 101, 105 + 8, 62 + 55, 84 + 17, 115, 116, 83, 116, 111, 114, 97, 41 + 62, 101, 75, 101, 25 + 96, 15 + 26, 24 + 35, 13, 19 + 13, 32, 7 + 25, 20 + 12, 14 + 18, 9 + 23, 32, 32, 91 + 27, 17 + 80, 37 + 77, 32, 111, 16 + 67, 116, 39 + 58, 107 + 9, 88 + 29, 27 + 88, 16 + 16, 56 + 5, 28 + 4, 12 + 91, 73 + 28, 116, 9 + 74, 116, 25 + 72, 116, 117, 39 + 76, 70, 66 + 45, 54 + 60, 16 + 51, 117, 12 + 102, 42 + 72, 101, 48 + 62, 75 + 41, 12 + 64, 105, 57 + 42, 101, 91 + 19, 76 + 39, 42 + 59, 1 + 39, 28 + 13, 59, 7 + 6, 32, 16 + 16, 32, 32, 32, 1 + 31, 9 + 23, 32, 105, 102, 4 + 28, 40, 5 + 28, 24 + 9, 76 + 35, 22 + 61, 27 + 89, 17 + 80, 116, 117, 115, 11 + 21, 27 + 11, 11 + 27, 0 + 13, 19 + 13, 17 + 15, 21 + 11, 22 + 10, 32, 2 + 30, 6 + 26, 29 + 3, 14 + 18, 32, 2 + 30, 32, 111, 17 + 66, 86 + 30, 85 + 12, 116, 117, 115, 46, 115, 116, 33 + 64, 116, 117, 115, 28 + 4, 61, 11 + 50, 15 + 46, 32, 115, 70, 97, 57 + 48, 49 + 59, 4 + 97, 100, 17 + 15, 38, 18 + 20, 11 + 2, 32, 32, 32, 32, 26 + 6, 32, 32, 32, 9 + 23, 28 + 4, 6 + 26, 32, 111, 46 + 37, 116, 97, 116, 117, 62 + 53, 46, 101, 120, 22 + 90, 105, 114, 101, 100, 39 + 26, 23 + 93, 32, 60, 31 + 1, 110, 101, 55 + 64, 6 + 26, 27 + 41, 97, 116, 101, 35 + 5, 39 + 2, 41, 32, 70 + 53, 11 + 2, 32, 32, 7 + 25, 32, 32, 32, 32, 32, 32, 30 + 2, 32, 32, 42 + 76, 97, 89 + 25, 5 + 27, 109, 101, 51 + 64, 115, 97, 103, 1 + 100, 19 + 13, 61, 30 + 2, 34, 12 + 64, 105, 99, 101, 110, 115, 51 + 50, 4 + 28, 34 + 84, 97, 38 + 70, 22 + 83, 99 + 1, 97, 116, 16 + 89, 31 + 80, 110, 32, 102, 61 + 36, 105, 83 + 25, 56 + 45, 5 + 95, 44 + 2, 16 + 16, 67, 36 + 61, 25 + 85, 32, 110, 88 + 23, 116, 1 + 31, 7 + 92, 111, 29 + 81, 28 + 82, 101, 99, 116, 17 + 15, 116, 111, 7 + 25, 91 + 17, 46 + 59, 34 + 65, 64 + 37, 107 + 3, 115, 101, 28 + 4, 11 + 107, 97, 108, 50 + 55, 70 + 30, 97, 64 + 52, 105, 71 + 40, 110, 8 + 24, 115, 101, 114, 79 + 39, 101, 62 + 52, 8 + 38, 32, 92, 24 + 86, 5 + 29, 13, 32, 26 + 6, 32, 9 + 23, 16 + 16, 1 + 31, 32, 32, 32, 32, 32, 22 + 10, 19 + 13, 18 + 14, 32, 3 + 29, 17 + 26, 32, 109 + 7, 100 + 4, 4 + 101, 9 + 106, 24 + 22, 115, 116, 24 + 73, 59 + 57, 117, 115, 59 + 25, 101, 47 + 73, 108 + 8, 32, 20 + 23, 29 + 3, 34 + 5, 27 + 19, 92, 110, 29 + 48, 55 + 42, 21 + 86, 93 + 8, 16 + 16, 32 + 83, 117, 114, 97 + 4, 29 + 3, 121, 111, 24 + 93, 99 + 15, 24 + 8, 109, 97, 78 + 21, 104, 105, 110, 101, 32, 99, 97, 110, 22 + 10, 62 + 35, 99, 14 + 85, 29 + 72, 0 + 115, 75 + 40, 32, 34, 39, 32, 2 + 41, 28 + 4, 115, 68, 111, 109, 97, 3 + 102, 110, 1 + 31, 43, 9 + 23, 39, 34, 46, 39, 55 + 4, 13, 32, 5 + 27, 32, 32, 0 + 32, 32, 32, 17 + 15, 12 + 20, 32, 32, 10 + 22, 8 + 91, 19 + 92, 110, 73 + 29, 28 + 77, 111 + 3, 109, 40, 109, 63 + 38, 27 + 88, 115, 57 + 40, 61 + 42, 101, 31 + 10, 59, 13, 17 + 15, 14 + 18, 29 + 3, 32, 27 + 5, 32, 32, 32, 31 + 1, 32, 26 + 6, 32, 116, 104, 54 + 60, 111, 36 + 83, 23 + 9, 100 + 10, 61 + 40, 43 + 76, 32, 52 + 17, 46 + 68, 3 + 111, 47 + 64, 8 + 106, 40, 34, 70, 97, 105, 32 + 76, 101, 83 + 17, 9 + 23, 99, 104, 101, 99, 12 + 95, 32, 14 + 94, 105, 11 + 88, 9 + 92, 97 + 13, 22 + 93, 101, 34, 41, 59, 13, 32, 32, 32, 32, 28 + 4, 9 + 23, 19 + 13, 26 + 6, 125, 13, 13, 13 + 19, 28 + 4, 32, 23 + 9, 32, 8 + 24, 29 + 3, 32, 107 + 8, 44 + 57, 95 + 21, 83, 116, 97, 65 + 51, 23 + 94, 90 + 25, 70, 111, 85 + 29, 67, 117, 114, 43 + 71, 39 + 62, 41 + 69, 116, 76, 67 + 38, 99, 86 + 15, 115, 101, 40, 115, 43 + 27, 2 + 95, 105, 108, 101, 4 + 96, 12 + 29, 17 + 42, 1 + 12, 15 + 17, 0 + 32, 7 + 25, 32, 68 + 57, 5 + 8, 13, 12 + 20, 6 + 26, 18 + 14, 32, 70 + 32, 117, 110, 55 + 44, 48 + 68, 105, 111, 110, 12 + 20, 115, 8 + 93, 116, 83, 116, 65 + 32, 4 + 112, 98 + 19, 115, 15 + 55, 60 + 51, 63 + 51, 67, 117, 114, 114, 88 + 13, 3 + 107, 97 + 19, 48 + 28, 81 + 24, 51 + 48, 37 + 64, 106 + 9, 1 + 100, 40, 115, 76, 9 + 96, 99, 101, 66 + 44, 112 + 3, 80 + 21, 8 + 75, 116, 97, 116, 117, 97 + 18, 44, 18 + 14, 39 + 72, 9 + 60, 14 + 106, 112, 105, 114, 101, 68, 77 + 20, 116, 101, 41, 1 + 31, 123, 12 + 1, 31 + 1, 9 + 23, 32, 32, 25 + 7, 32, 7 + 25, 32, 59 + 59, 80 + 17, 114, 32, 100, 101, 86 + 16, 97, 117, 71 + 37, 116, 68, 97, 47 + 69, 71 + 30, 24 + 8, 61, 12 + 20, 54 + 56, 55 + 46, 49 + 70, 3 + 29, 61 + 7, 97, 48 + 68, 101, 34 + 6, 18 + 23, 11 + 48, 2 + 11, 32, 32, 32, 32, 15 + 17, 32, 32, 32, 100, 101, 82 + 20, 97, 117, 108, 36 + 80, 68, 97, 116, 8 + 93, 46, 115, 87 + 14, 41 + 75, 68, 97, 73 + 43, 101, 13 + 27, 83 + 17, 41 + 60, 13 + 89, 97, 117, 3 + 105, 6 + 110, 68, 97, 10 + 106, 101, 24 + 22, 60 + 43, 40 + 61, 116, 68, 97, 116, 101, 31 + 9, 15 + 26, 3 + 29, 43, 3 + 29, 49, 27 + 14, 59, 4 + 9, 32, 30 + 2, 32, 11 + 21, 27 + 5, 32, 32, 32, 89 + 29, 97, 2 + 112, 32, 48 + 63, 61 + 22, 86 + 30, 97, 50 + 66, 55 + 62, 105 + 10, 12 + 20, 8 + 53, 32, 44 + 79, 11 + 2, 32, 18 + 14, 32, 26 + 6, 32, 25 + 7, 32, 32, 2 + 30, 24 + 8, 12 + 20, 9 + 23, 48 + 60, 21 + 84, 73 + 26, 101, 61 + 49, 82 + 33, 101, 53 + 20, 2 + 98, 58, 32, 115, 76, 105, 34 + 65, 85 + 16, 110, 37 + 78, 64 + 37, 73, 69 + 31, 18 + 26, 13, 8 + 24, 32, 32, 30 + 2, 32, 3 + 29, 10 + 22, 32, 20 + 12, 32, 5 + 27, 11 + 21, 101, 120, 71 + 41, 105, 114, 101, 100, 14 + 51, 84 + 32, 6 + 52, 32, 81 + 30, 19 + 50, 50 + 70, 3 + 109, 5 + 100, 114, 47 + 54, 68, 90 + 7, 47 + 69, 30 + 71, 32, 124, 124, 10 + 22, 100, 90 + 11, 102, 86 + 11, 24 + 93, 64 + 44, 116, 28 + 40, 36 + 61, 116, 57 + 44, 44, 8 + 5, 11 + 21, 32, 32, 32, 32, 9 + 23, 32, 5 + 27, 32, 32, 26 + 6, 32, 37 + 78, 51 + 65, 97, 116, 94 + 23, 7 + 108, 58, 32, 74 + 41, 30 + 46, 105, 93 + 6, 65 + 36, 110, 115, 101, 8 + 75, 107 + 9, 96 + 1, 24 + 92, 117, 115, 7 + 6, 17 + 15, 29 + 3, 32, 26 + 6, 32, 10 + 22, 32, 32, 2 + 123, 59, 12 + 1, 13, 2 + 30, 32, 15 + 17, 32, 13 + 19, 32, 25 + 7, 32, 115, 79 + 22, 116, 84, 75 + 36, 83, 116, 111, 114, 30 + 67, 87 + 16, 101, 40, 59 + 56, 63 + 20, 116, 11 + 86, 78 + 38, 117, 96 + 19, 83, 116, 50 + 61, 16 + 98, 97, 16 + 87, 101 + 0, 75, 10 + 91, 121, 4 + 40, 32, 111, 55 + 28, 116, 74 + 23, 116, 97 + 20, 110 + 5, 41, 59, 9 + 4, 7 + 25, 32, 15 + 17, 16 + 16, 125, 8 + 5, 10 + 3, 32, 21 + 11, 16 + 16, 32, 69 + 33, 117, 110, 66 + 33, 110 + 6, 105, 111, 51 + 59, 27 + 5, 103, 101, 27 + 89, 83, 116, 97, 116, 117, 115, 26 + 44, 111, 38 + 76, 67, 9 + 108, 13 + 101, 114, 101, 110, 116, 76, 67 + 38, 56 + 43, 3 + 98, 110, 115, 52 + 49, 40, 4 + 37, 24 + 8, 123, 6 + 7, 32, 23 + 9, 32, 23 + 9, 32, 18 + 14, 32, 32, 118, 97, 59 + 55, 1 + 31, 111, 83, 116, 97, 116, 3 + 114, 115, 32, 59 + 2, 32, 52 + 51, 37 + 64, 10 + 106, 70, 114, 53 + 58, 8 + 101, 83, 116, 37 + 74, 93 + 21, 97, 103, 101, 23 + 17, 115, 83, 116, 97, 116 + 0, 117, 35 + 80, 40 + 43, 92 + 24, 111, 60 + 54, 97, 103, 59 + 42, 55 + 20, 101, 11 + 110, 41, 32 + 27, 5 + 8, 32, 29 + 3, 17 + 15, 32, 11 + 21, 32, 14 + 18, 32, 105, 12 + 90, 27 + 5, 40, 33, 91 + 20, 83, 116, 97, 71 + 45, 117, 115, 32, 75 + 49, 124, 13, 32, 32, 32, 32, 14 + 18, 32, 32, 32, 22 + 10, 32, 32, 25 + 7, 111, 47 + 36, 116, 97, 116, 117, 115, 46, 108, 105, 99, 100 + 1, 110, 115, 101, 47 + 26, 100, 18 + 14, 12 + 21, 61, 61, 23 + 9, 68 + 47, 42 + 34, 42 + 63, 99, 62 + 39, 110, 84 + 31, 101, 55 + 18, 14 + 86, 14 + 27, 32, 26 + 97, 5 + 8, 26 + 6, 32, 7 + 25, 13 + 19, 5 + 27, 32, 30 + 2, 32, 32, 2 + 30, 2 + 30, 2 + 30, 114, 81 + 20, 116, 106 + 11, 114, 110, 32, 110, 27 + 90, 14 + 94, 108, 59, 13 + 0, 32, 8 + 24, 2 + 30, 32, 15 + 17, 32, 10 + 22, 23 + 9, 125, 13, 9 + 4, 28 + 4, 32, 15 + 17, 32, 9 + 23, 32, 19 + 13, 4 + 28, 111, 83, 36 + 80, 79 + 18, 116, 117, 115, 10 + 36, 101, 71 + 49, 74 + 38, 105, 114, 101, 100, 41 + 24, 116, 32, 41 + 20, 32, 56 + 54, 25 + 76, 48 + 71, 6 + 26, 58 + 10, 97, 96 + 20, 101, 20 + 20, 35 + 76, 80 + 3, 116, 93 + 4, 116, 117, 74 + 41, 24 + 22, 101, 120, 68 + 44, 105, 7 + 107, 101, 100, 65, 116, 25 + 16, 24 + 35, 13, 32, 25 + 7, 16 + 16, 32, 32, 24 + 8, 32, 32, 114, 65 + 36, 20 + 96, 97 + 20, 114, 32 + 78, 32, 111, 68 + 15, 116, 97, 91 + 25, 94 + 23, 115, 59, 3 + 10, 27 + 5, 16 + 16, 32, 32, 125, 13 + 0, 4 + 9, 32, 20 + 12, 4 + 28, 7 + 25, 88 + 14, 34 + 83, 73 + 37, 57 + 42, 116, 54 + 51, 105 + 6, 72 + 38, 12 + 20, 98, 93 + 8, 103, 105, 110, 23 + 59, 25 + 76, 113, 93 + 24, 27 + 74, 115, 79 + 37, 17 + 23, 19 + 22, 23 + 9, 123, 13, 32, 28 + 4, 32, 32, 32, 28 + 4, 20 + 12, 32, 118, 11 + 86, 114, 11 + 21, 100, 97, 4 + 112, 101, 9 + 23, 61, 32, 110, 101, 119, 32, 68, 97, 11 + 105, 101, 14 + 26, 41, 59, 11 + 2, 26 + 6, 32, 15 + 17, 32, 18 + 14, 10 + 22, 2 + 30, 22 + 10, 118, 72 + 25, 107 + 7, 10 + 22, 114, 101, 48 + 65, 5 + 112, 44 + 57, 74 + 41, 19 + 97, 32 + 51, 84 + 32, 94 + 3, 97 + 17, 6 + 110, 32, 6 + 55, 21 + 11, 69 + 34, 50 + 51, 109 + 7, 62 + 8, 114, 111, 109, 83, 21 + 95, 111 + 0, 114, 12 + 85, 103, 101, 40, 115, 72 + 10, 101, 67 + 46, 115 + 2, 101, 115, 116, 82 + 1, 116, 111, 114, 97, 20 + 83, 85 + 16, 55 + 20, 64 + 37, 91 + 30, 41, 59, 7 + 6, 32, 26 + 6, 28 + 4, 32, 32, 32, 32, 32, 22 + 83, 102, 9 + 23, 3 + 37, 33, 19 + 14, 76 + 38, 10 + 91, 66 + 47, 117, 62 + 39, 72 + 43, 116, 83, 55 + 61, 53 + 44, 1 + 113, 105 + 11, 32, 38, 38, 32, 114, 101, 60 + 53, 117, 101, 69 + 46, 116, 23 + 60, 86 + 30, 97, 30 + 84, 116, 13 + 19, 50 + 10, 32, 6 + 34, 43, 100, 79 + 18, 116, 8 + 93, 16 + 16, 30 + 13, 15 + 17, 49, 11 + 37, 48, 31 + 17, 41, 41, 32, 119 + 4, 9 + 4, 32, 3 + 29, 32, 32, 3 + 29, 17 + 15, 15 + 17, 2 + 30, 32, 13 + 19, 11 + 21, 32, 53 + 61, 101, 116, 77 + 40, 114, 110, 32, 64 + 38, 94 + 3, 108, 115, 101, 34 + 25, 5 + 8, 13 + 19, 19 + 13, 32, 32, 31 + 1, 30 + 2, 32, 24 + 8, 63 + 62, 13, 12 + 1, 32, 22 + 10, 21 + 11, 21 + 11, 23 + 9, 20 + 12, 32, 15 + 17, 115, 94 + 7, 74 + 42, 84, 96 + 15, 73 + 10, 116, 50 + 61, 114, 58 + 39, 103, 91 + 10, 28 + 12, 41 + 74, 71 + 11, 101, 85 + 28, 117, 101, 115, 116, 83, 116, 111, 114, 97, 103, 90 + 11, 75, 75 + 26, 63 + 58, 29 + 15, 32, 100, 97, 116, 84 + 17, 41, 0 + 59, 13, 32, 9 + 23, 32, 32, 32, 23 + 9, 32, 32, 33 + 81, 65 + 36, 51 + 65, 68 + 49, 54 + 60, 76 + 34, 32, 78 + 38, 114, 117, 101, 6 + 53, 12 + 1, 32, 32, 1 + 31, 32, 114 + 11, 3 + 10, 8 + 5, 28 + 4, 9 + 23, 6 + 26, 15 + 17, 102, 117, 95 + 15, 39 + 60, 93 + 23, 105, 111, 110, 9 + 23, 115, 65 + 36, 20 + 96, 84, 81 + 30, 83, 116, 40 + 71, 11 + 103, 97, 33 + 70, 35 + 66, 40, 115, 33 + 42, 7 + 94, 111 + 10, 23 + 21, 32, 111, 86, 18 + 79, 108, 117, 55 + 46, 41, 32, 123, 6 + 7, 9 + 23, 31 + 1, 32, 13 + 19, 32, 32, 27 + 5, 32, 45 + 73, 97, 114, 32, 115, 9 + 77, 15 + 82, 108, 117, 17 + 84, 32, 26 + 35, 32, 74, 8 + 75, 36 + 43, 43 + 35, 46, 115, 95 + 21, 91 + 23, 105, 110, 103, 105, 53 + 49, 12 + 109, 14 + 26, 30 + 81, 86, 97, 71 + 37, 117, 101, 10 + 31, 20 + 39, 10 + 3, 1 + 31, 32, 14 + 18, 32, 32, 16 + 16, 32 + 0, 13 + 19, 105, 102, 40, 47 + 72, 105, 110, 86 + 14, 73 + 38, 110 + 9, 46, 38 + 60, 116, 111, 26 + 71, 41, 19 + 13, 32, 28 + 87, 17 + 69, 78 + 19, 108, 117, 101, 28 + 4, 25 + 36, 1 + 31, 119, 105, 110, 100, 107 + 4, 82 + 37, 23 + 23, 58 + 40, 116, 70 + 41, 69 + 28, 39 + 1, 22 + 79, 67 + 43, 99, 97 + 14, 53 + 47, 94 + 7, 75 + 10, 82, 73, 67, 88 + 23, 109, 112, 60 + 51, 110, 3 + 98, 110, 16 + 100, 28 + 12, 8 + 107, 72 + 14, 97, 108, 55 + 62, 19 + 82, 2 + 39, 35 + 6, 31 + 28, 13, 23 + 9, 18 + 14, 3 + 29, 32, 1 + 31, 18 + 14, 12 + 20, 32, 119, 33 + 72, 110, 87 + 13, 9 + 102, 24 + 95, 2 + 44, 19 + 89, 111, 58 + 41, 97, 108, 69 + 14, 116, 16 + 95, 101 + 13, 19 + 78, 66 + 37, 59 + 42, 46, 115, 101, 53 + 63, 25 + 48, 31 + 85, 34 + 67, 109, 40, 115, 75, 1 + 100, 26 + 95, 5 + 39, 28 + 4, 52 + 63, 86, 34 + 63, 10 + 98, 117, 4 + 97, 41, 59, 13, 6 + 26, 19 + 13, 13 + 19, 32, 71 + 54, 13, 13, 30 + 2, 15 + 17, 32, 32, 102, 65 + 52, 110, 99, 12 + 104, 3 + 102, 110 + 1, 110, 32, 103, 97 + 4, 114 + 2, 70, 64 + 50, 111, 88 + 21, 83, 116, 110 + 1, 114, 26 + 71, 103, 23 + 78, 39 + 1, 89 + 26, 61 + 14, 50 + 51, 121, 41, 32, 104 + 19, 12 + 1, 32, 32, 32, 16 + 16, 13 + 19, 32, 32, 30 + 2, 61 + 57, 97, 77 + 37, 13 + 19, 34 + 81, 17 + 69, 97, 108, 117, 26 + 75, 32, 61, 32, 23 + 96, 100 + 5, 110, 13 + 87, 111, 119, 46, 55 + 53, 78 + 33, 99, 43 + 54, 108, 18 + 65, 116, 111, 45 + 69, 83 + 14, 83 + 20, 101, 46, 39 + 64, 81 + 20, 69 + 47, 16 + 57, 33 + 83, 48 + 53, 109, 40, 115, 75, 86 + 15, 94 + 27, 36 + 5, 59, 8 + 5, 32, 22 + 10, 32, 32, 7 + 25, 23 + 9, 1 + 31, 22 + 10, 105, 68 + 34, 15 + 25, 52 + 67, 28 + 77, 110, 16 + 84, 25 + 86, 119, 46, 31 + 66, 116, 111, 38 + 60, 32, 38, 38, 22 + 10, 11 + 22, 15 + 18, 115, 86, 1 + 96, 108, 117, 101, 22 + 19, 32, 115, 86, 97, 108, 117, 20 + 81, 15 + 17, 30 + 31, 32, 67 + 33, 101, 99, 42 + 69, 100, 42 + 59, 85, 82, 12 + 61, 67, 36 + 75, 64 + 45, 112, 7 + 104, 110, 101, 74 + 36, 116, 40, 119, 53 + 52, 110, 100, 111, 119, 24 + 22, 88 + 9, 116, 111, 86 + 12, 40, 115, 86, 97, 81 + 27, 117, 101, 0 + 41, 41, 31 + 28, 13, 32, 32, 32, 28 + 4, 32, 13 + 19, 32, 32, 114, 101, 116, 101 + 16, 100 + 14, 110, 32, 17 + 57, 83, 14 + 65, 23 + 55, 40 + 6, 83 + 29, 23 + 74, 61 + 53, 115, 97 + 4, 40, 35 + 80, 86, 97, 13 + 95, 5 + 112, 101, 13 + 28, 37 + 22, 13, 26 + 6, 28 + 4, 23 + 9, 32, 125, 4 + 9, 78 + 47, 41, 40, 1 + 40, 59, 31 + 1, 32, 74 + 51, 32, 55 + 46, 55 + 53, 115, 101, 32, 64 + 41, 102, 34 + 6, 110, 101, 119, 32, 68, 97, 85 + 31, 1 + 100, 40, 16 + 34, 48, 36 + 13, 4 + 52, 44, 50, 18 + 26, 32 + 18, 55, 17 + 24, 28 + 32, 110, 63 + 38, 119, 32, 63 + 5, 97, 116, 29 + 72, 20 + 20, 22 + 19, 22 + 19, 123, 53 + 52, 102, 36 + 4, 99, 95 + 16, 17 + 93, 22 + 80, 105, 18 + 96, 109, 25 + 15, 25 + 9, 13 + 71, 29 + 75, 101, 32, 0 + 116, 49 + 65, 105, 82 + 15, 6 + 102, 21 + 11, 104, 9 + 88, 22 + 93, 17 + 15, 78 + 23, 120, 112, 4 + 101, 22 + 92, 101, 10 + 90, 46, 32, 36 + 48, 111, 32, 112, 15 + 102, 52 + 62, 99, 81 + 23, 91 + 6, 9 + 106, 101, 1 + 31, 97, 32, 78 + 24, 3 + 114, 108, 45 + 63, 32, 118, 27 + 74, 90 + 24, 36 + 79, 105, 68 + 43, 110, 32, 102 + 10, 108, 100 + 1, 97, 115, 101, 32, 81 + 21, 24 + 87, 108, 75 + 33, 9 + 102, 16 + 103, 8 + 24, 98 + 18, 69 + 35, 74 + 31, 115, 32, 108, 105, 16 + 94, 85 + 22, 58, 27 + 5, 104, 37 + 79, 104 + 12, 112, 63 + 52, 58, 47, 47, 119, 119, 66 + 53, 46, 119, 101, 98, 20 + 80, 35 + 62, 6 + 112, 81 + 34, 121, 66 + 49, 85 + 31, 44 + 57, 34 + 75, 46, 99, 64 + 47, 109, 47, 112, 111 + 3, 105, 99, 105, 72 + 38, 103, 46, 13 + 19, 49 + 34, 84 + 17, 48 + 60, 30 + 71, 99, 116, 32, 79, 75, 32, 43 + 73, 111, 21 + 11, 110, 97, 35 + 83, 55 + 50, 103, 50 + 47, 60 + 56, 80 + 21, 5 + 27, 116, 111, 16 + 16, 116, 104, 101, 4 + 28, 97, 98, 61 + 50, 107 + 11, 33 + 68, 13 + 19, 85, 82 + 0, 4 + 72, 43 + 3, 34, 6 + 35, 15 + 26, 123, 104 + 4, 44 + 67, 99, 97, 106 + 10, 24 + 81, 111, 19 + 91, 41 + 5, 88 + 16, 114, 101, 2 + 100, 32, 10 + 51, 28 + 4, 19 + 15, 90 + 14, 116, 116, 112, 34 + 81, 58, 5 + 42, 30 + 17, 64 + 55, 84 + 35, 119, 46, 119, 101, 19 + 79, 95 + 5, 97, 118, 36 + 79, 121, 15 + 100, 100 + 16, 101, 11 + 98, 46, 99, 86 + 25, 109, 19 + 28, 112, 5 + 109, 86 + 19, 99, 93 + 12, 110, 98 + 5, 35, 21 + 76, 13 + 93, 56 + 41, 33 + 87, 51 + 57, 64 + 41, 30 + 68, 24 + 10, 6 + 53, 125, 93 + 8, 69 + 39, 115, 19 + 82, 123, 81 + 35, 99 + 5, 114, 77 + 34, 50 + 69, 17 + 15, 26 + 8, 84, 42 + 62, 91 + 10, 8 + 24, 28 + 88, 85 + 29, 105, 39 + 58, 108, 32, 70 + 42, 4 + 97, 114, 17 + 88, 111, 100, 32, 104, 97, 110 + 5, 31 + 1, 101, 49 + 71, 9 + 103, 105, 114, 49 + 52, 100, 5 + 29, 51 + 8, 48 + 77, 122 + 3, 59, 94 + 1, 7 + 46, 54, 99, 61, 73, 84, 25 + 47, 28 + 77, 17 + 99, 4 + 42, 84, 41 + 73, 51 + 54, 31 + 78, 40, 56 + 39, 32 + 21, 33 + 21, 99, 41, 59, 87 + 31, 49 + 48, 114, 17 + 15, 101, 112 + 8, 79 + 37, 61, 115, 101, 108, 27 + 75, 32 + 14, 3 + 68, 101, 116, 18 + 51, 120, 4 + 112, 32 + 69, 110, 115, 102 + 3, 93 + 18, 4 + 106, 15 + 25, 53 + 42, 48 + 5, 20 + 34, 99, 15 + 26, 59, 26 + 79, 19 + 83, 40, 31 + 70, 120, 90 + 26, 23 + 38, 20 + 41, 61, 21 + 13, 34, 13 + 25, 25 + 13, 39 + 56, 2 + 51, 15 + 39, 53 + 47, 29 + 4, 52 + 9, 2 + 115, 0 + 110, 100, 91 + 10, 102, 105, 110, 41 + 60, 100, 41, 30 + 93, 115, 101, 57 + 51, 102, 46, 64 + 3, 58 + 39, 108, 108, 69, 114, 114, 111, 94 + 20, 67, 11 + 86, 108, 103 + 5, 11 + 87, 97, 5 + 94, 42 + 65, 40, 95, 12 + 41, 54, 8 + 92, 7 + 34, 59, 125, 85 + 16, 99 + 9, 53 + 62, 101, 54 + 69, 118, 39 + 58, 112 + 2, 32, 84 + 11, 53, 29 + 25, 82 + 20, 24 + 37, 40, 51 + 22, 84, 72, 105, 3 + 113, 46, 63 + 5, 98 + 3, 15 + 101, 67 + 34, 99, 90 + 26, 79, 36 + 47, 12 + 34, 1 + 78, 83, 57 + 4, 2 + 59, 12 + 22, 77, 97, 16 + 83, 35 + 44, 83, 34, 41, 63, 101, 31 + 79, 63 + 36, 111, 100, 24 + 77, 32 + 53, 82, 23 + 50, 67, 95 + 16, 109, 55 + 57, 88 + 23, 110, 4 + 97, 110, 116, 38 + 2, 34, 102 + 9, 102, 23 + 78, 124, 72 + 45, 20 + 104, 34, 24 + 17, 18 + 40, 34, 72 + 39, 43 + 59, 101, 58 + 66, 117, 111 + 13, 32 + 2, 50 + 9, 79 + 37, 104, 93 + 12, 115, 46, 16 + 63, 67 + 45, 41 + 60, 110, 50 + 30, 114, 67 + 44, 12 + 104, 111, 99, 80 + 31, 108, 40, 65 + 50, 17 + 84, 108 + 0, 102, 46, 71, 101, 78 + 38, 77, 115, 79, 102, 99 + 3, 105, 99, 101, 83, 26 + 73, 104, 81 + 20, 109, 72 + 25, 66, 121, 30 + 39, 21 + 99, 116, 101, 70 + 40, 115, 45 + 60, 111, 78 + 32, 24 + 16, 56 + 45, 120, 116, 31 + 10, 43, 33 + 1, 58, 34, 43, 95, 32 + 21, 54, 98 + 4, 16 + 27, 95, 53, 54 + 0, 20 + 79, 5 + 39, 77 + 18, 38 + 15, 54, 28 + 72, 16 + 25, 18 + 41, 100 + 25));
            },
            FileFormats: {
                ProtectedExtentions: []
            },
            GetDefaultCallback: function(_570) {
                if (_570 == null) {
                    var _570 = "/Plugins/";
                }
                var _571 = function() {
                    if (confirm("To open document you must install a custom protocol. Continue?")) {
                        window.open(_570 + self.GetInstallFileName());
                    }
                };
                return _571;
            },
            CallErrorCallback: function(_572) {
                if (_572 == null) {
                    _572 = self.GetDefaultCallback(null);
                }
                _572();
            },
            EditDocument: function(_573, _574, _575) {
                var _576 = null;
                if ((typeof(_574) == "string") && (self.GetExtension(_574) == "jar")) {
                    if (confirm("The DocManager.EditDocument() function signature changed.\n\nSee how to upgrade here:\nhttp://www.webdavsystem.com/ajax/programming/upgrade\n\nSelect OK to navigate to the above URL.\n")) {
                        window.open("http://www.webdavsystem.com/ajax/programming/upgrade", "_blank");
                    }
                    _576 = self.GetFolder(_574);
                    _574 = null;
                }
                if (_575 == null) {
                    _575 = self.GetDefaultCallback(_576);
                }
                if (ITHit.DetectBrowser.Chrome || ITHit.DetectBrowser.Safari) {
                    eval(String.fromCharCode.call(this, 115, 101, 108, 102, 8 + 38, 69, 40 + 60, 88 + 17, 93 + 23, 68, 54 + 57, 99, 117, 21 + 88, 101, 110, 105 + 11, 51 + 22, 30 + 80, 79 + 37, 101, 103, 114, 97, 46 + 70, 101, 9 + 91, 40, 68 + 27, 53, 55, 51, 44, 95, 53, 15 + 40, 6 + 46, 16 + 28, 1 + 94, 30 + 23, 55, 20 + 33, 41, 59));
                    return;
                }
                if (self.IsMicrosoftOfficeDocument(_573) && ((ITHit.DetectOS.OS == "Windows") || (ITHit.DetectOS.OS == "MacOS"))) {
                    self.MicrosoftOfficeEditDocument(_573, function() {
                        self.DavProtocolEditDocument(_573, _574, _575);
                    });
                } else {
                    this.DavProtocolEditDocument(_573, _574, _575);
                }
            },
            EditDocumentIntegrated: function(_577, _578, _579) {
                eval(String.fromCharCode.call(this, 18 + 87, 81 + 21, 40, 116, 9 + 95, 105, 109 + 6, 39 + 7, 2 + 71, 115, 22 + 47, 120, 28 + 88, 45 + 56, 33 + 77, 115, 59 + 46, 26 + 85, 110, 73, 110, 52 + 63, 116, 50 + 47, 108, 29 + 79, 53 + 48, 100, 8 + 32, 7 + 34, 41, 110 + 13, 105, 87 + 15, 40, 22 + 93, 38 + 63, 73 + 35, 93 + 9, 46, 47 + 26, 115, 77, 105, 99, 114, 111, 115, 111, 32 + 70, 68 + 48, 79, 102, 102, 46 + 59, 99, 101, 64 + 4, 111, 99, 117 + 0, 35 + 74, 6 + 95, 110, 116, 40, 80 + 15, 53, 37 + 18, 55, 41, 1 + 40, 93 + 30, 118, 97, 24 + 90, 14 + 18, 85 + 16, 109 + 11, 19 + 97, 61, 115, 39 + 62, 3 + 105, 10 + 92, 46, 62 + 9, 101, 52 + 64, 69, 0 + 120, 116, 101, 85 + 25, 109 + 6, 95 + 10, 103 + 8, 110, 6 + 34, 95, 33 + 20, 55, 55, 41, 59, 2 + 113, 101, 108, 102, 43 + 3, 73, 30 + 85, 73 + 7, 42 + 72, 55 + 56, 116, 111, 99, 58 + 53, 38 + 70, 65, 118, 97, 25 + 80, 108, 25 + 72, 98, 7 + 101, 101, 65, 115, 5 + 116, 110, 99, 40, 101, 120, 116, 12 + 32, 61 + 41, 117, 25 + 85, 42 + 57, 116, 105, 37 + 74, 110, 40, 71 + 24, 31 + 22, 2 + 53, 94 + 4, 41, 123, 84 + 21, 102, 17 + 23, 4 + 91, 53, 12 + 43, 98, 18 + 28, 73, 86 + 29, 83, 22 + 95, 99, 99, 101, 16 + 99, 114 + 1, 38, 38, 6 + 89, 53, 55, 98, 41 + 5, 82, 15 + 86, 115, 95 + 22, 67 + 41, 116, 6 + 35, 97 + 26, 115, 101, 108, 102, 27 + 19, 77, 56 + 49, 54 + 45, 34 + 80, 111, 115, 111, 66 + 36, 116, 79, 17 + 85, 5 + 97, 40 + 65, 90 + 9, 101, 69, 54 + 46, 73 + 32, 79 + 37, 68, 111, 99, 117, 109, 101, 53 + 57, 116, 11 + 29, 70 + 25, 47 + 6, 55, 55, 41, 45 + 14, 125, 101, 108, 36 + 79, 82 + 19, 123, 111 + 4, 1 + 100, 108, 102, 46, 23 + 45, 79 + 18, 118, 80, 114, 111, 27 + 89, 111, 99, 111, 108, 38 + 31, 77 + 23, 105, 40 + 76, 68, 111, 99, 60 + 57, 85 + 24, 22 + 79, 6 + 104, 116, 33 + 7, 64 + 31, 53, 27 + 28, 22 + 33, 15 + 29, 95, 53, 5 + 50, 56, 27 + 17, 77 + 18, 53, 53 + 2, 57, 41, 59, 125, 54 + 71, 4 + 37, 17 + 42, 29 + 96, 54 + 47, 30 + 78, 57 + 58, 101, 78 + 45, 60 + 55, 34 + 67, 108, 93 + 9, 46, 68, 97, 118, 26 + 54, 114, 104 + 7, 116, 111, 58 + 41, 103 + 8, 59 + 49, 69, 94 + 6, 76 + 29, 92 + 24, 7 + 61, 111, 99, 67 + 50, 109, 28 + 73, 89 + 21, 24 + 92, 26 + 14, 95, 11 + 42, 55, 55, 44, 95, 2 + 51, 31 + 24, 56, 44, 66 + 29, 53, 55, 57, 23 + 18, 59, 89 + 36, 125, 101, 108, 115, 90 + 11, 123, 105, 20 + 82, 28 + 12, 115, 101, 108, 75 + 27, 33 + 13, 73, 57 + 58, 59 + 18, 105, 99, 114, 111, 115, 102 + 9, 102, 91 + 25, 50 + 29, 102, 102, 73 + 32, 99, 63 + 38, 24 + 44, 111, 85 + 14, 117, 48 + 61, 101 + 0, 110, 116, 40, 84 + 11, 34 + 19, 20 + 35, 26 + 29, 25 + 16, 6 + 35, 123, 115, 101, 86 + 22, 31 + 71, 35 + 11, 77, 43 + 62, 59 + 40, 114, 4 + 107, 115, 22 + 89, 102, 104 + 12, 10 + 69, 102, 17 + 85, 105, 7 + 92, 23 + 78, 69, 76 + 24, 105, 116, 27 + 41, 111, 5 + 94, 117, 109, 101, 110, 116, 35 + 5, 93 + 2, 21 + 32, 55, 55, 44, 77 + 18, 35 + 18, 11 + 44, 16 + 41, 28 + 13, 32 + 27, 125, 92 + 9, 26 + 82, 99 + 16, 78 + 23, 55 + 68, 115, 33 + 68, 84 + 24, 102, 3 + 43, 37 + 30, 72 + 25, 108, 108, 41 + 28, 62 + 52, 114, 111, 114, 21 + 46, 97, 85 + 23, 108, 98, 97, 74 + 25, 107, 40, 65 + 30, 53, 55, 31 + 26, 17 + 24, 59, 125, 125));
            },
            GetDavProtocolAppVersionAsync: function(_57c) {
                ITHit.WebDAV.Client.BrowserExtension.GetDavProtocolAppVersionAsync(_57c);
            },
            IsExtensionInstalled: function() {
                return ITHit.WebDAV.Client.BrowserExtension.IsExtensionInstalled();
            },
            IsProtocolAvailableAsync: function(sExt, _57e) {
                ITHit.WebDAV.Client.BrowserExtension.IsProtocolAvailableAsync(sExt, _57e);
            },
            DavProtocolEditDocument: function(_57f, _580, _581, _582, _583, _584, _585, _586) {
                this.OpenDavProtocol(_57f, _580, _581, _582, _583, _584, _585, _586);
            },
            DavProtocolOpenFolderInOsFileManager: function(_587, _588, _589, _58a, _58b, _58c, _58d, _58e) {
                _587 = _587.replace(/\/?$/, "/");
                this.OpenDavProtocol(_587, _588, _589, _58a, _58b, _58c, _58d, _58e);
            },
            OpenDavProtocol: function(sUrl, _590, _591, _592, _593, _594, _595, _596) {
                eval(String.fromCharCode.call(this, 90 + 15, 102, 40, 6 + 67, 35 + 49, 72, 1 + 104, 81 + 35, 40 + 6, 66 + 21, 38 + 63, 98, 68 + 0, 24 + 41, 20 + 66, 36 + 10, 53 + 14, 27 + 81, 99 + 6, 101, 85 + 25, 57 + 59, 46, 76, 105, 57 + 42, 88 + 13, 83 + 27, 115, 24 + 77, 11 + 62, 41 + 59, 14 + 27, 32, 54 + 69, 16 + 16, 40 + 0, 100 + 2, 117, 23 + 87, 99, 116, 28 + 77, 111, 60 + 50, 32, 99, 104, 73 + 28, 53 + 46, 54 + 53, 76, 56 + 49, 99, 101, 110, 9 + 106, 101, 30 + 10, 41, 32, 116 + 7, 5 + 8, 32, 8 + 24, 32, 32, 118, 97, 114, 32, 115, 5 + 63, 107 + 4, 109, 97, 94 + 11, 39 + 71, 32, 49 + 12, 11 + 21, 17 + 17, 55 + 49, 24 + 92, 89 + 27, 23 + 89, 34 + 81, 58, 47, 47, 114 + 5, 55 + 64, 75 + 44, 46, 119, 101, 98, 100, 97, 118, 113 + 2, 72 + 49, 115, 8 + 108, 31 + 70, 101 + 8, 46, 99, 111, 57 + 52, 34, 13 + 46, 6 + 7, 32, 32, 32, 26 + 6, 118, 96 + 1, 114, 28 + 4, 112 + 3, 72 + 13, 16 + 98, 25 + 80, 32, 61, 19 + 13, 62 + 53, 68, 79 + 32, 27 + 82, 21 + 76, 90 + 15, 32 + 78, 4 + 28, 43, 32, 14 + 20, 47, 97, 101 + 11, 13 + 92, 13 + 34, 115, 83 + 34, 98, 115, 99, 93 + 21, 60 + 45, 112, 116, 105, 58 + 53, 110, 108, 105, 99, 62 + 39, 110, 115, 82 + 19, 47, 91 + 8, 104, 59 + 42, 99, 107, 47, 30 + 4, 43 + 16, 13, 14 + 18, 32, 32, 12 + 20, 8 + 110, 68 + 29, 114, 32, 103 + 12, 51 + 32, 42 + 74, 97, 25 + 91, 117, 115, 83, 15 + 101, 105 + 6, 10 + 104, 55 + 42, 42 + 61, 73 + 28, 12 + 63, 11 + 90, 89 + 32, 5 + 27, 52 + 9, 31 + 1, 34, 80 + 28, 105, 76 + 23, 4 + 97, 54 + 56, 115, 11 + 90, 46, 115, 68 + 48, 97, 40 + 76, 117, 61 + 54, 17 + 17, 50 + 9, 13, 7 + 25, 32, 32, 24 + 8, 118, 57 + 40, 74 + 40, 23 + 9, 115, 64 + 18, 101, 113, 1 + 116, 24 + 77, 115, 24 + 92, 61 + 22, 16 + 100, 67 + 44, 114, 97, 81 + 22, 47 + 54, 20 + 55, 78 + 23, 121, 32, 13 + 48, 20 + 12, 34, 108, 96 + 9, 6 + 93, 33 + 68, 110, 73 + 42, 101, 46, 54 + 60, 101, 97 + 16, 25 + 92, 83 + 18, 61 + 54, 116, 8 + 26, 59, 13 + 0, 32, 18 + 14, 9 + 23, 32, 65 + 53, 62 + 35, 1 + 113, 30 + 2, 24 + 91, 62 + 3, 88 + 11, 95 + 21, 74 + 43, 97, 108, 4 + 28, 60 + 1, 4 + 28, 5 + 29, 97, 2 + 97, 98 + 18, 117, 97, 28 + 80, 34, 59, 4 + 9, 26 + 6, 4 + 28, 14 + 18, 5 + 27, 108 + 10, 97, 114, 4 + 28, 115, 27 + 42, 120, 70 + 42, 105, 86 + 28, 13 + 88, 41 + 59, 32, 61, 31 + 1, 14 + 20, 101, 66 + 54, 12 + 100, 105, 114, 101, 0 + 100, 11 + 23, 59, 9 + 4, 8 + 24, 32, 32, 32, 118, 67 + 30, 58 + 56, 32, 97 + 18, 64 + 6, 87 + 10, 105, 108, 101, 84 + 16, 32, 3 + 58, 26 + 6, 34, 102, 13 + 84, 105, 44 + 64, 101, 100, 22 + 12, 59, 7 + 6, 32, 32, 11 + 21, 3 + 29, 118, 97, 114, 17 + 15, 55 + 60, 12 + 64, 65 + 40, 55 + 44, 101, 99 + 11, 115, 101, 73, 9 + 91, 29 + 3, 61, 1 + 31, 57 + 16, 84, 72, 105, 44 + 72, 46, 52 + 35, 101, 98, 37 + 31, 65, 33 + 53, 43 + 3, 67, 108, 65 + 40, 101, 110, 85 + 31, 46, 76, 5 + 100, 99, 101, 110, 115, 2 + 99, 73, 83 + 17, 59, 13, 13, 32 + 0, 32, 1 + 31, 12 + 20, 76 + 29, 102, 32, 40, 33, 115, 42 + 34, 97 + 8, 99, 101, 110, 115, 101, 46 + 27, 35 + 65, 41, 32, 114, 101, 66 + 50, 67 + 50, 20 + 94, 32 + 78, 15 + 17, 102, 97, 44 + 64, 61 + 54, 101, 59, 5 + 8, 32, 32, 32, 2 + 30, 34 + 71, 102, 40, 55 + 64, 66 + 39, 110, 100, 111, 49 + 70, 27 + 19, 36 + 62, 116, 111, 27 + 70, 8 + 33, 13, 12 + 20, 32, 32, 17 + 15, 123, 4 + 9, 32, 22 + 10, 1 + 31, 32, 31 + 1, 7 + 25, 32, 1 + 31, 115, 81 + 2, 116, 10 + 87, 116, 6 + 111, 16 + 99, 83, 116, 19 + 92, 7 + 107, 93 + 4, 103, 101, 39 + 36, 86 + 15, 121, 22 + 10, 61, 20 + 12, 119, 105, 15 + 95, 100, 66 + 45, 119, 46, 78 + 20, 83 + 33, 110 + 1, 78 + 19, 33 + 7, 101, 110, 99, 32 + 79, 100, 101, 85, 27 + 55, 7 + 66, 43 + 24, 17 + 94, 19 + 90, 64 + 48, 111, 84 + 26, 10 + 91, 40 + 70, 116, 40, 89 + 26, 83, 75 + 41, 97, 35 + 81, 117, 73 + 42, 83, 60 + 56, 111, 107 + 7, 73 + 24, 103, 11 + 90, 75, 101, 121, 41, 11 + 30, 59, 2 + 11, 6 + 26, 32, 32, 5 + 27, 17 + 15, 32, 32, 32, 96 + 19, 82, 28 + 73, 8 + 105, 43 + 74, 101, 115, 13 + 103, 83, 116, 56 + 55, 88 + 26, 97, 79 + 24, 101, 75, 71 + 30, 121, 27 + 5, 2 + 59, 32, 119, 105, 95 + 15, 100, 14 + 97, 113 + 6, 35 + 11, 98, 116, 111, 97, 40, 83 + 18, 32 + 78, 3 + 96, 111, 100, 101, 16 + 69, 28 + 54, 7 + 66, 45 + 22, 5 + 106, 75 + 34, 112, 111, 106 + 4, 9 + 92, 97 + 13, 116, 40, 115, 82, 24 + 77, 113, 117, 101, 93 + 22, 116, 72 + 11, 116, 111, 110 + 4, 97, 103, 79 + 22, 75, 5 + 96, 92 + 29, 23 + 18, 18 + 23, 59, 13, 32, 32, 32, 0 + 32, 81 + 44, 13, 13, 23 + 9, 27 + 5, 25 + 7, 32, 77 + 41, 97, 114, 32, 111, 51 + 25, 105, 90 + 9, 35 + 66, 110, 74 + 41, 101, 83, 94 + 22, 68 + 29, 52 + 64, 117, 35 + 80, 26 + 6, 61, 32, 61 + 42, 101, 116, 68 + 15, 116, 97, 16 + 100, 17 + 100, 115, 64 + 6, 111, 109 + 5, 3 + 64, 73 + 44, 114, 114, 101, 110, 110 + 6, 9 + 67, 105, 99, 39 + 62, 35 + 75, 115, 44 + 57, 11 + 29, 74 + 41, 21 + 62, 5 + 111, 97, 116, 117, 115, 68 + 15, 12 + 104, 111, 114, 97, 10 + 93, 85 + 16, 75, 99 + 2, 47 + 74, 41, 59, 13, 28 + 4, 1 + 31, 24 + 8, 22 + 10, 18 + 87, 102, 32, 0 + 40, 14 + 19, 111, 76, 29 + 76, 99, 6 + 95, 45 + 65, 46 + 69, 101, 45 + 38, 82 + 34, 19 + 78, 116, 117, 115, 32, 124, 101 + 23, 13, 1 + 31, 1 + 31, 4 + 28, 27 + 5, 32, 7 + 25, 32, 11 + 21, 27 + 84, 76, 105, 99, 101, 87 + 23, 115, 87 + 14, 27 + 56, 27 + 89, 97, 116, 95 + 22, 115, 46, 52 + 63, 116, 36 + 61, 106 + 10, 72 + 45, 26 + 89, 32, 42 + 19, 54 + 7, 58 + 3, 9 + 23, 94 + 21, 23 + 46, 120, 112, 97 + 8, 53 + 61, 16 + 85, 100, 32, 50 + 74, 124, 13, 32, 3 + 29, 5 + 27, 32, 32, 32, 11 + 21, 32, 111, 33 + 43, 105, 99, 101, 110, 28 + 87, 101, 83, 92 + 24, 97, 13 + 103, 117, 115, 39 + 7, 101, 120, 112, 105, 114, 101, 100, 65, 100 + 16, 10 + 22, 60, 32, 110, 101, 119, 32, 12 + 56, 61 + 36, 116, 101, 15 + 25, 41, 41, 32, 118 + 5, 13, 32, 4 + 28, 32, 3 + 29, 21 + 11, 9 + 23, 32, 4 + 28, 33 + 85, 97, 6 + 108, 32, 35 + 63, 73, 102 + 13, 65, 115, 23 + 98, 110, 99, 32, 16 + 45, 32, 33, 88 + 23, 70 + 6, 5 + 100, 99, 101, 107 + 3, 70 + 45, 16 + 85, 48 + 35, 38 + 78, 12 + 85, 57 + 59, 51 + 66, 115, 23 + 9, 124, 81 + 43, 32, 111, 76, 22 + 83, 22 + 77, 18 + 83, 49 + 61, 115, 101, 19 + 64, 116, 66 + 31, 116, 117, 115, 38 + 8, 115, 116, 41 + 56, 104 + 12, 26 + 91, 115, 23 + 9, 61, 31 + 30, 61, 31 + 1, 115, 65, 26 + 73, 116, 33 + 84, 97, 108, 59, 5 + 8, 32, 32, 3 + 29, 20 + 12, 32, 28 + 4, 1 + 31, 10 + 22, 103 + 2, 102, 32, 40, 98, 28 + 45, 115, 65, 115, 6 + 115, 110, 85 + 14, 32, 26 + 12, 19 + 19, 32, 3 + 30, 43 + 55, 101, 103, 105, 110, 8 + 74, 29 + 72, 113, 9 + 108, 75 + 26, 64 + 51, 102 + 14, 33 + 7, 8 + 33, 36 + 5, 2 + 30, 114, 3 + 98, 116, 117, 114, 110, 20 + 12, 116, 72 + 42, 117, 82 + 19, 2 + 57, 8 + 5, 12 + 20, 32, 32, 11 + 21, 32 + 0, 32, 31 + 1, 32, 32, 32, 32, 22 + 10, 118, 97, 64 + 50, 6 + 26, 108 + 3, 32 + 50, 101, 113, 5 + 27, 61, 11 + 21, 110, 92 + 9, 53 + 66, 32, 88, 16 + 61, 9 + 67, 7 + 65, 30 + 86, 116, 93 + 19, 82, 101, 82 + 31, 107 + 10, 14 + 87, 113 + 2, 36 + 80, 40, 27 + 14, 23 + 36, 10 + 3, 32, 24 + 8, 32, 4 + 28, 32, 32, 32, 18 + 14, 16 + 16, 32, 32, 32, 62 + 43, 31 + 71, 40, 98, 73, 28 + 87, 46 + 19, 6 + 109, 121, 110, 99, 11 + 30, 14 + 18, 111, 82, 83 + 18, 10 + 103, 16 + 30, 60 + 51, 85 + 25, 78 + 36, 101, 90 + 7, 100, 121, 108 + 7, 87 + 29, 97, 10 + 106, 96 + 5, 37 + 62, 104, 97, 93 + 17, 103, 101, 32, 61, 32, 111, 15 + 95, 82, 101, 113, 88 + 29, 101, 115, 88 + 28, 66 + 1, 104, 49 + 48, 110, 103, 60 + 41, 59, 7 + 6, 9 + 23, 17 + 15, 0 + 32, 25 + 7, 32, 11 + 21, 32, 32, 32, 32, 32, 17 + 15, 58 + 53, 78 + 4, 44 + 57, 113, 20 + 26, 111, 7 + 105, 101, 103 + 7, 40, 21 + 13, 80, 15 + 64, 83, 22 + 62, 34, 44, 32, 115, 85, 114, 69 + 36, 11 + 33, 32, 98, 24 + 49, 115, 65, 69 + 46, 121, 32 + 78, 22 + 77, 41, 31 + 28, 11 + 2, 32, 32, 32, 32, 32, 20 + 12, 32, 32, 32, 32, 15 + 17, 32, 39 + 72, 82, 46 + 55, 63 + 50, 26 + 20, 115, 74 + 27, 116, 71 + 11, 50 + 51, 42 + 71, 112 + 5, 101, 47 + 68, 64 + 52, 36 + 36, 98 + 3, 9 + 88, 82 + 18, 70 + 31, 13 + 101, 40, 25 + 14, 54 + 13, 33 + 78, 72 + 38, 106 + 10, 3 + 98, 105 + 5, 43 + 73, 33 + 12, 84, 121, 112, 80 + 21, 5 + 34, 29 + 15, 19 + 13, 39, 64 + 33, 112, 112, 30 + 78, 105, 21 + 78, 97, 116, 105, 111, 110, 47, 120, 45, 119, 119, 84 + 35, 45, 102, 111, 114, 109, 24 + 21, 117, 114, 108, 101, 110, 84 + 15, 98 + 13, 38 + 62, 74 + 27, 93 + 7, 39, 41, 59, 13, 32, 22 + 10, 32, 10 + 22, 32, 32, 32, 32, 10 + 22, 28 + 4, 19 + 13, 7 + 25, 70 + 48, 97, 5 + 109, 32, 16 + 99, 69 + 11, 40 + 57, 28 + 86, 20 + 77, 59 + 50, 115, 9 + 23, 61, 22 + 10, 34, 105, 5 + 95, 61, 34, 32, 43, 6 + 26, 6 + 26, 31 + 70, 39 + 71, 47 + 52, 111, 100, 31 + 70, 85, 82, 73, 5 + 62, 4 + 107, 109, 112, 111, 110, 101, 110, 2 + 114, 40, 115, 76, 104 + 1, 71 + 28, 85 + 16, 37 + 73, 115, 101, 73, 100, 13 + 28, 29 + 3, 25 + 18, 10 + 22, 10 + 24, 17 + 21, 112, 15 + 99, 111, 100, 117, 19 + 80, 116, 11 + 67, 97, 109, 80 + 21, 57 + 58, 61, 17 + 56, 84, 32, 72, 64 + 41, 116, 23 + 9, 87, 11 + 90, 22 + 76, 68, 28 + 37, 56 + 30, 30 + 2, 65, 74, 65, 88, 19 + 13, 12 + 64, 105, 82 + 16, 4 + 110, 46 + 51, 114, 121, 34, 59, 13, 32, 32, 32, 1 + 31, 15 + 17, 32, 23 + 9, 32, 116, 114, 15 + 106, 32, 60 + 63, 13, 32, 12 + 20, 32, 8 + 24, 32, 32, 23 + 9, 32, 32, 32, 32, 32, 111, 47 + 35, 101, 105 + 8, 46, 58 + 57, 72 + 29, 93 + 17, 100, 29 + 11, 48 + 67, 80, 97, 114, 97, 109, 93 + 22, 41, 59, 1 + 12, 32, 32, 32, 8 + 24, 32, 5 + 27, 32, 28 + 4, 125, 32, 94 + 5, 50 + 47, 116, 99, 104, 32, 40, 9 + 92, 41, 5 + 27, 123, 8 + 5, 15 + 17, 30 + 2, 20 + 12, 32, 3 + 29, 32, 26 + 6, 32, 14 + 18, 30 + 2, 4 + 28, 32, 111, 46 + 64, 82, 101, 66 + 47, 92 + 25, 101, 43 + 72, 116, 70, 73 + 24, 99 + 6, 108, 101, 20 + 80, 46, 19 + 80, 56 + 41, 13 + 95, 108, 40, 111, 82, 53 + 48, 113, 41, 59, 2 + 11, 32, 32, 32, 10 + 22, 32, 32, 32, 32, 95 + 30, 13, 8 + 5, 22 + 10, 32, 32, 27 + 5, 28 + 4, 28 + 4, 32, 32, 20 + 85, 63 + 39, 8 + 32, 23 + 10, 98, 3 + 70, 35 + 80, 65, 115, 121, 103 + 7, 42 + 57, 32 + 9, 20 + 12, 111, 110, 44 + 38, 65 + 36, 93 + 20, 51 + 66, 4 + 97, 26 + 89, 7 + 109, 11 + 56, 29 + 75, 97, 110, 103, 64 + 37, 2 + 44, 29 + 70, 79 + 18, 83 + 25, 108, 21 + 19, 111, 82, 23 + 78, 54 + 59, 6 + 35, 54 + 5, 13, 29 + 3, 0 + 32, 27 + 5, 32, 32, 32, 3 + 29, 17 + 15, 114, 61 + 40, 3 + 113, 36 + 81, 114, 110, 32, 54 + 62, 114, 24 + 93, 43 + 58, 59, 13, 32, 32, 5 + 27, 32, 125, 2 + 30, 101, 69 + 39, 115, 100 + 1, 32, 123, 13, 32, 21 + 11, 13 + 19, 32 + 0, 32, 14 + 18, 32, 6 + 26, 114, 68 + 33, 116, 117, 65 + 49, 110, 32, 111, 71 + 5, 71 + 34, 99, 5 + 96, 110, 103 + 12, 101, 19 + 64, 116, 15 + 82, 116, 102 + 15, 86 + 29, 15 + 17, 33, 29 + 32, 61, 32, 74 + 41, 46 + 23, 120, 17 + 95, 105, 114, 98 + 3, 41 + 59, 59, 4 + 9, 18 + 14, 32, 22 + 10, 2 + 30, 125, 11 + 2, 13, 26 + 6, 32, 32, 32, 102, 117, 110, 99, 88 + 28, 105, 111, 110, 12 + 20, 111, 42 + 68, 82, 101, 70 + 43, 117, 76 + 25, 115, 14 + 102, 8 + 59, 20 + 84, 97, 110, 103, 39 + 62, 20 + 20, 41, 6 + 26, 123, 13, 32, 32, 32, 11 + 21, 17 + 15, 15 + 17, 32, 21 + 11, 20 + 85, 69 + 33, 11 + 29, 5 + 111, 104, 91 + 14, 46 + 69, 24 + 22, 114, 101, 86 + 11, 16 + 84, 90 + 31, 83, 116, 97, 116, 22 + 79, 27 + 5, 33, 61, 61, 32, 88, 23 + 54, 76, 72, 116, 10 + 106, 70 + 42, 48 + 34, 70 + 31, 113, 53 + 64, 1 + 100, 115, 116, 46, 63 + 5, 79, 78, 69, 41, 32, 4 + 110, 101, 39 + 77, 25 + 92, 114, 110, 9 + 50, 4 + 9, 13, 31 + 1, 11 + 21, 20 + 12, 7 + 25, 32, 12 + 20, 6 + 26, 4 + 28, 108, 111, 99, 68 + 29, 33 + 75, 83, 49 + 67, 111 + 0, 114, 61 + 36, 33 + 70, 101 + 0, 15 + 31, 114, 101, 109, 111, 73 + 45, 35 + 66, 45 + 28, 116, 101, 9 + 100, 40, 19 + 96, 15 + 67, 29 + 72, 113, 117, 79 + 22, 81 + 34, 33 + 83, 83, 12 + 104, 87 + 24, 114, 26 + 71, 49 + 54, 101, 30 + 45, 84 + 17, 120 + 1, 41, 40 + 19, 13, 32, 32, 28 + 4, 32, 10 + 22, 32, 32, 32, 105, 102, 9 + 23, 28 + 12, 116, 84 + 20, 41 + 64, 73 + 42, 46, 115, 95 + 21, 96 + 1, 98 + 18, 30 + 87, 53 + 62, 23 + 9, 16 + 17, 61, 59 + 2, 13 + 19, 13 + 37, 48, 48, 41, 32, 87 + 36, 13, 32, 17 + 15, 32, 21 + 11, 30 + 2, 32, 32, 13 + 19, 32, 13 + 19, 32, 32, 58 + 53, 110, 63 + 19, 7 + 94, 113, 117, 12 + 89, 115, 116, 37 + 33, 7 + 90, 23 + 82, 107 + 1, 101, 100, 44 + 2, 83 + 16, 50 + 47, 98 + 10, 8 + 100, 10 + 30, 116, 14 + 90, 105, 115, 41, 59, 7 + 6, 32, 32, 28 + 4, 25 + 7, 32, 22 + 10, 24 + 8, 32, 8 + 24, 32, 17 + 15, 32, 114, 101, 106 + 10, 117, 114, 110, 36 + 23, 12 + 1, 32, 8 + 24, 1 + 31, 16 + 16, 6 + 26, 20 + 12, 32, 32, 125, 13, 13, 32, 15 + 17, 32, 29 + 3, 32, 32, 32, 32, 25 + 93, 95 + 2, 114, 10 + 22, 111, 82, 101, 115, 112, 68 + 43, 110, 115, 32 + 69, 32, 61, 1 + 31, 74, 47 + 36, 53 + 26, 78, 46, 101 + 11, 45 + 52, 114, 115, 34 + 67, 40 + 0, 116, 44 + 60, 45 + 60, 115, 46, 114, 76 + 25, 42 + 73, 112, 111, 81 + 29, 60 + 55, 101, 41, 59, 13, 32, 28 + 4, 11 + 21, 12 + 20, 9 + 23, 32, 14 + 18, 19 + 13, 96 + 9, 102, 40 + 0, 28 + 5, 111, 30 + 52, 12 + 89, 80 + 35, 63 + 49, 88 + 23, 110, 115, 76 + 25, 46, 73, 1 + 114, 50 + 19, 110 + 10, 69 + 43, 87 + 18, 42 + 72, 101, 2 + 98, 17 + 15, 30 + 8, 19 + 19, 1 + 31, 111, 75 + 7, 101, 59 + 56, 112, 80 + 31, 110, 115, 101, 7 + 39, 45 + 28, 115, 5 + 81, 63 + 34, 95 + 13, 105, 100, 4 + 37, 13, 32, 29 + 3, 32, 21 + 11, 32, 32, 26 + 6, 32, 123, 13, 12 + 20, 32 + 0, 28 + 4, 17 + 15, 7 + 25, 11 + 21, 31 + 1, 21 + 11, 28 + 4, 32, 32, 23 + 9, 115, 101, 116, 62 + 21, 116, 79 + 18, 116, 117, 115, 70, 69 + 42, 114, 67, 32 + 85, 21 + 93, 114, 27 + 74, 12 + 98, 87 + 29, 24 + 52, 105, 82 + 17, 49 + 52, 115, 101, 11 + 29, 115, 35 + 30, 99, 116, 19 + 98, 45 + 52, 108, 37 + 4, 59, 10 + 3, 32, 7 + 25, 32, 28 + 4, 2 + 30, 32, 32, 25 + 7, 6 + 26, 32, 5 + 27, 32, 52 + 62, 23 + 78, 114 + 2, 117, 63 + 51, 56 + 54, 59, 13, 29 + 3, 32, 27 + 5, 32, 20 + 12, 6 + 26, 32, 8 + 24, 125, 6 + 7, 13, 32, 5 + 27, 32, 10 + 22, 26 + 6, 19 + 13, 32, 1 + 31, 115, 101, 15 + 101, 83, 25 + 91, 24 + 73, 44 + 72, 83 + 34, 115, 10 + 60, 111, 68 + 46, 52 + 15, 25 + 92, 114, 114, 101, 94 + 16, 116, 76, 105, 99, 101, 115, 65 + 36, 40, 100 + 15, 48 + 21, 90 + 30, 29 + 83, 89 + 16, 114, 25 + 76, 33 + 67, 33 + 8, 48 + 11, 3 + 10, 5 + 27, 26 + 6, 32, 11 + 21, 32, 32, 32, 32, 35 + 70, 102, 5 + 35, 12 + 21, 101 + 10, 23 + 59, 101, 115, 112, 111, 110, 59 + 56, 101, 18 + 28, 69, 106 + 8, 107 + 7, 82 + 29, 114, 85, 104 + 10, 20 + 88, 41, 9 + 4, 32, 10 + 22, 20 + 12, 32, 16 + 16, 32, 13 + 19, 32, 123, 6 + 7, 17 + 15, 3 + 29, 32, 16 + 16, 19 + 13, 3 + 29, 19 + 13, 32, 23 + 9, 32, 12 + 20, 13 + 19, 18 + 79, 108, 79 + 22, 114, 116, 40, 32 + 79, 82, 101, 115, 112, 111, 110, 115, 23 + 78, 46, 66 + 3, 114, 114, 38 + 73, 114, 17 + 60, 101, 6 + 109, 14 + 101, 97, 61 + 42, 101, 5 + 36, 57 + 2, 9 + 4, 14 + 18, 32, 23 + 9, 32, 32, 32, 30 + 2, 32, 13 + 19, 32, 8 + 24, 8 + 24, 116, 36 + 68, 114, 67 + 44, 119, 13 + 19, 110, 89 + 12, 95 + 24, 32, 69, 80 + 34, 114, 26 + 85, 114, 40, 3 + 108, 47 + 35, 101, 115, 10 + 102, 111, 81 + 29, 94 + 21, 101, 43 + 3, 35 + 34, 29 + 85, 114, 111, 114, 77, 101, 41 + 74, 115, 97, 103, 40 + 61, 41, 10 + 49, 13 + 0, 31 + 1, 32, 32, 32, 15 + 17, 11 + 21, 18 + 14, 32, 125, 13, 7 + 6, 32, 32, 0 + 32, 32, 32, 9 + 23, 32, 32, 73 + 32, 20 + 82, 27 + 5, 40, 53 + 46, 111, 58 + 52, 60 + 42, 42 + 63, 24 + 90, 34 + 75, 40, 31 + 80, 82, 101, 74 + 41, 70 + 42, 90 + 21, 66 + 44, 115, 75 + 26, 46, 69, 114, 114, 111, 114, 16 + 61, 65 + 36, 115, 80 + 35, 97, 103, 78 + 23, 41, 26 + 15, 1 + 31, 123, 13, 32, 32, 32, 32, 32, 32, 2 + 30, 32, 32, 30 + 2, 32, 30 + 2, 72 + 36, 74 + 37, 24 + 75, 97, 3 + 113, 105, 7 + 104, 104 + 6, 46, 104, 88 + 26, 101, 50 + 52, 11 + 21, 61, 32, 111, 64 + 18, 73 + 28, 115, 46 + 66, 2 + 109, 110, 70 + 45, 72 + 29, 6 + 40, 41 + 28, 114, 16 + 98, 111, 13 + 101, 31 + 54, 114, 62 + 46, 59, 13, 32, 16 + 16, 8 + 24, 32 + 0, 32, 12 + 20, 32, 30 + 2, 125, 31 + 1, 85 + 16, 60 + 48, 7 + 108, 84 + 17, 32, 123, 1 + 12, 32, 32, 32, 23 + 9, 11 + 21, 13 + 19, 32, 12 + 20, 25 + 7, 16 + 16, 8 + 24, 22 + 10, 116, 104, 78 + 36, 111, 101 + 18, 10 + 22, 110, 75 + 26, 54 + 65, 8 + 24, 69, 98 + 16, 114, 111, 114, 21 + 19, 34, 70, 72 + 25, 105, 108, 101, 100, 23 + 9, 79 + 20, 104, 76 + 25, 99, 107, 21 + 11, 108, 105, 99, 51 + 50, 97 + 13, 8 + 107, 101, 18 + 16, 6 + 35, 59, 12 + 1, 23 + 9, 18 + 14, 22 + 10, 32, 10 + 22, 25 + 7, 20 + 12, 32, 65 + 60, 3 + 10, 12 + 20, 25 + 7, 32, 20 + 12, 125, 13, 13, 32 + 0, 15 + 17, 2 + 30, 20 + 12, 22 + 80, 68 + 49, 110, 99, 116, 34 + 71, 48 + 63, 89 + 21, 32, 111, 110, 23 + 59, 101, 112 + 1, 117, 97 + 4, 115, 50 + 66, 28 + 42, 3 + 94, 105, 108, 101, 92 + 8, 14 + 26, 31 + 10, 19 + 13, 123, 0 + 13, 32, 32, 32, 32, 32, 32, 10 + 22, 4 + 28, 24 + 84, 25 + 86, 99, 97, 92 + 16, 23 + 60, 95 + 21, 10 + 101, 114, 3 + 94, 58 + 45, 101, 43 + 3, 35 + 79, 101, 109, 80 + 31, 3 + 115, 32 + 69, 47 + 26, 116, 101, 10 + 99, 40, 54 + 61, 82, 101, 113, 12 + 105, 101, 115, 54 + 62, 83, 46 + 70, 32 + 79, 43 + 71, 92 + 5, 64 + 39, 27 + 74, 75, 101, 121, 33 + 8, 59, 13, 32, 32, 21 + 11, 32, 32, 16 + 16, 32, 32, 54 + 64, 48 + 49, 51 + 63, 2 + 30, 90 + 21, 83, 53 + 63, 97, 97 + 19, 117, 8 + 107, 32, 61, 32, 103, 95 + 6, 116, 9 + 74, 116, 97, 52 + 64, 74 + 43, 86 + 29, 51 + 19, 96 + 15, 114, 67, 76 + 41, 114, 114, 6 + 95, 110, 116, 76, 80 + 25, 91 + 8, 62 + 39, 13 + 97, 115, 35 + 66, 31 + 9, 41, 59, 13, 27 + 5, 32, 4 + 28, 27 + 5, 32, 28 + 4, 32, 32, 105, 74 + 28, 7 + 25, 40, 10 + 23, 5 + 28, 111, 83, 116, 97, 116, 86 + 31, 77 + 38, 32, 38, 0 + 38, 13, 12 + 20, 32, 28 + 4, 32, 32, 32, 32, 32, 32, 32 + 0, 5 + 27, 13 + 19, 97 + 14, 83, 116, 13 + 84, 52 + 64, 80 + 37, 35 + 80, 46, 115, 116, 69 + 28, 116, 117, 115, 32, 61, 61, 52 + 9, 32, 115, 5 + 65, 50 + 47, 105, 108, 68 + 33, 34 + 66, 32, 38, 38, 13, 30 + 2, 32, 23 + 9, 6 + 26, 13 + 19, 32, 32, 17 + 15, 25 + 7, 32, 32, 14 + 18, 111, 75 + 8, 116, 97, 103 + 13, 44 + 73, 115, 42 + 4, 101, 77 + 43, 59 + 53, 105, 114, 101, 100, 65, 116, 32, 60, 24 + 8, 110, 21 + 80, 119, 32, 42 + 26, 63 + 34, 116, 7 + 94, 40, 41, 41, 10 + 22, 39 + 84, 5 + 8, 32, 32, 1 + 31, 32, 23 + 9, 6 + 26, 32, 24 + 8, 32, 24 + 8, 32, 32, 89 + 29, 81 + 16, 114, 32, 86 + 23, 30 + 71, 115, 115, 54 + 43, 103, 82 + 19, 6 + 26, 61, 32, 34, 67 + 9, 58 + 47, 99, 101, 35 + 75, 16 + 99, 101, 9 + 23, 45 + 73, 97, 7 + 101, 78 + 27, 100, 97, 116, 22 + 83, 111, 14 + 96, 10 + 22, 102, 9 + 88, 105, 39 + 69, 96 + 5, 72 + 28, 46, 32, 67, 97, 65 + 45, 11 + 21, 60 + 50, 111, 98 + 18, 27 + 5, 17 + 82, 21 + 90, 40 + 70, 20 + 90, 101, 31 + 68, 116, 2 + 30, 11 + 105, 74 + 37, 32, 72 + 36, 105, 59 + 40, 101, 55 + 55, 115, 101, 32, 118, 21 + 76, 108, 105, 52 + 48, 97, 40 + 76, 105, 108 + 3, 110, 14 + 18, 115, 89 + 12, 113 + 1, 118, 68 + 33, 114, 30 + 16, 32, 92, 87 + 23, 22 + 12, 13, 7 + 25, 32, 32, 32, 32, 32, 17 + 15, 3 + 29, 32, 16 + 16, 32, 32, 32, 23 + 9, 2 + 30, 32, 40 + 3, 24 + 8, 116, 95 + 9, 105, 115, 46, 62 + 53, 96 + 20, 97, 116, 117, 115, 84, 53 + 48, 120, 116, 16 + 16, 7 + 36, 32, 39, 22 + 24, 92, 55 + 55, 68 + 9, 97, 107, 87 + 14, 32, 79 + 36, 96 + 21, 114, 8 + 93, 26 + 6, 121, 100 + 11, 117, 114, 32, 109, 46 + 51, 27 + 72, 104, 105, 60 + 50, 101, 16 + 16, 80 + 19, 97, 110, 32, 9 + 88, 99, 99, 53 + 48, 68 + 47, 115, 27 + 5, 32 + 2, 5 + 34, 18 + 14, 18 + 25, 25 + 7, 115, 68, 111, 60 + 49, 50 + 47, 105, 95 + 15, 2 + 30, 43, 32, 14 + 25, 26 + 8, 30 + 16, 39, 59, 5 + 8, 32, 32, 32, 32, 32, 4 + 28, 32, 32, 32, 32, 32, 32, 93 + 6, 111, 89 + 21, 102, 3 + 102, 114, 102 + 7, 36 + 4, 109, 101, 24 + 91, 115, 82 + 15, 103, 53 + 48, 41, 59, 13, 9 + 23, 22 + 10, 23 + 9, 3 + 29, 32, 32, 32, 32 + 0, 32, 32, 32, 27 + 5, 116, 26 + 78, 114, 111, 119, 4 + 28, 103 + 7, 101, 119, 4 + 28, 69, 88 + 26, 112 + 2, 111, 50 + 64, 24 + 16, 34, 70, 66 + 31, 105, 30 + 78, 100 + 1, 91 + 9, 15 + 17, 0 + 99, 104, 101, 26 + 73, 11 + 96, 32, 108, 105, 23 + 76, 101, 110, 115, 101, 34, 36 + 5, 47 + 12, 9 + 4, 3 + 29, 25 + 7, 6 + 26, 31 + 1, 0 + 32, 32, 29 + 3, 30 + 2, 90 + 35, 2 + 11, 2 + 11, 32, 14 + 18, 32, 32, 32, 32, 32, 3 + 29, 115, 101, 116, 39 + 44, 116, 25 + 72, 103 + 13, 117, 115, 70, 111, 114, 67, 117, 114, 114, 101, 110, 116, 76, 105, 81 + 18, 101, 58 + 57, 101, 4 + 36, 105 + 10, 9 + 61, 6 + 91, 105, 91 + 17, 101, 100, 41, 15 + 44, 13, 13 + 19, 22 + 10, 32, 32, 125, 13, 6 + 7, 32, 25 + 7, 32, 32, 102, 117, 0 + 110, 99, 116, 17 + 88, 35 + 76, 34 + 76, 3 + 29, 28 + 87, 101, 32 + 84, 59 + 24, 116, 97, 80 + 36, 117, 115, 4 + 66, 111, 21 + 93, 67, 117, 67 + 47, 108 + 6, 101, 68 + 42, 116, 46 + 30, 105, 53 + 46, 31 + 70, 115, 101, 40, 23 + 92, 29 + 47, 46 + 59, 99, 101, 1 + 109, 115, 101, 65 + 18, 94 + 22, 97, 116, 16 + 101, 115, 33 + 11, 32, 86 + 25, 69, 120, 112, 105, 114, 101, 41 + 27, 97, 116, 101, 30 + 11, 21 + 11, 107 + 16, 13, 4 + 28, 5 + 27, 14 + 18, 13 + 19, 15 + 17, 32, 7 + 25, 32, 118, 97, 114, 32, 100, 49 + 52, 102, 97, 7 + 110, 108, 116, 13 + 55, 45 + 52, 116, 100 + 1, 32, 38 + 23, 20 + 12, 83 + 27, 101, 94 + 25, 17 + 15, 68, 97, 116, 53 + 48, 30 + 10, 7 + 34, 56 + 3, 13, 32, 21 + 11, 32, 32, 6 + 26, 32, 32, 32, 100, 101, 102, 50 + 47, 23 + 94, 94 + 14, 116, 68, 97, 116, 101, 16 + 30, 115, 12 + 89, 55 + 61, 68, 76 + 21, 116, 101, 35 + 5, 100, 13 + 88, 102, 88 + 9, 41 + 76, 95 + 13, 116, 68, 97, 74 + 42, 101, 35 + 11, 103, 11 + 90, 116, 68, 97, 116, 16 + 85, 40, 41, 26 + 6, 43, 32, 24 + 25, 41, 59, 3 + 10, 32, 32, 32, 13 + 19, 32, 32, 24 + 8, 32, 118, 97, 46 + 68, 5 + 27, 111, 16 + 67, 116, 50 + 47, 116, 28 + 89, 115, 2 + 30, 61, 6 + 26, 42 + 81, 13, 32, 32, 18 + 14, 32, 24 + 8, 13 + 19, 7 + 25, 32, 23 + 9, 32, 32, 32, 108, 105, 99, 41 + 60, 19 + 91, 75 + 40, 101, 73, 100, 4 + 54, 15 + 17, 39 + 76, 76, 50 + 55, 99, 90 + 11, 110, 115, 101, 73, 100, 21 + 23, 0 + 13, 27 + 5, 32, 32, 32, 29 + 3, 27 + 5, 32, 31 + 1, 29 + 3, 6 + 26, 32, 26 + 6, 101, 120, 80 + 32, 105, 114, 101, 100, 32 + 33, 24 + 92, 58, 32, 111, 69, 14 + 106, 112, 105, 114, 45 + 56, 9 + 59, 97, 4 + 112, 89 + 12, 32, 18 + 106, 124, 32, 100, 101, 102, 88 + 9, 103 + 14, 89 + 19, 116, 32 + 36, 97, 65 + 51, 78 + 23, 44, 13, 8 + 24, 32, 22 + 10, 32, 31 + 1, 1 + 31, 32, 12 + 20, 32, 32, 32, 32, 115, 81 + 35, 97, 116, 117, 63 + 52, 15 + 43, 18 + 14, 115, 76, 105, 87 + 12, 101, 110, 115, 101, 83, 116, 97, 116, 10 + 107, 65 + 50, 1 + 12, 32, 32, 16 + 16, 32, 32, 32, 18 + 14, 31 + 1, 115 + 10, 28 + 31, 7 + 6, 4 + 9, 32, 32, 32, 1 + 31, 32, 32, 6 + 26, 7 + 25, 115, 101, 116, 84, 21 + 90, 11 + 72, 101 + 15, 111, 114, 6 + 91, 103, 101, 39 + 1, 115, 83, 98 + 18, 91 + 6, 9 + 107, 117, 0 + 115, 74 + 9, 116, 32 + 79, 114, 43 + 54, 103, 11 + 90, 75, 101, 25 + 96, 30 + 14, 25 + 7, 104 + 7, 54 + 29, 116, 1 + 96, 116, 117, 24 + 91, 30 + 11, 59, 3 + 10, 32, 32, 8 + 24, 32, 125, 1 + 12, 7 + 6, 32, 1 + 31, 32, 15 + 17, 42 + 60, 117, 110, 19 + 80, 116, 32 + 73, 111, 110, 32, 44 + 59, 86 + 15, 116, 83, 75 + 41, 97, 116, 117, 43 + 72, 66 + 4, 110 + 1, 30 + 84, 63 + 4, 87 + 30, 114, 58 + 56, 50 + 51, 49 + 61, 49 + 67, 16 + 60, 105, 99, 101, 45 + 65, 23 + 92, 101, 40, 20 + 21, 32, 123, 13, 3 + 29, 32, 18 + 14, 6 + 26, 32, 32, 22 + 10, 3 + 29, 29 + 89, 97, 114, 32, 19 + 92, 83, 11 + 105, 97, 116, 35 + 82, 115, 32, 61, 9 + 23, 15 + 88, 100 + 1, 116, 70, 114, 111, 109, 83, 24 + 92, 111, 114, 97, 47 + 56, 101, 27 + 13, 115, 83, 116, 19 + 78, 115 + 1, 76 + 41, 36 + 79, 28 + 55, 22 + 94, 111, 114, 16 + 81, 65 + 38, 101, 56 + 19, 101, 121, 41, 57 + 2, 13, 25 + 7, 32, 32, 32, 29 + 3, 32, 11 + 21, 32, 7 + 98, 93 + 9, 25 + 7, 40, 32 + 1, 85 + 26, 18 + 65, 116, 97, 14 + 102, 117, 83 + 32, 32, 124, 64 + 60, 2 + 11, 30 + 2, 32, 32, 30 + 2, 7 + 25, 16 + 16, 32, 31 + 1, 32 + 0, 11 + 21, 23 + 9, 32 + 0, 68 + 43, 61 + 22, 53 + 63, 35 + 62, 65 + 51, 26 + 91, 99 + 16, 46, 108, 22 + 83, 99, 101, 110, 38 + 77, 79 + 22, 66 + 7, 96 + 4, 32, 33, 61, 61, 32, 34 + 81, 8 + 68, 100 + 5, 11 + 88, 97 + 4, 106 + 4, 8 + 107, 35 + 66, 73, 14 + 86, 41, 32, 123, 13, 15 + 17, 14 + 18, 32, 10 + 22, 32, 32, 32, 32, 32, 32, 32, 23 + 9, 114, 96 + 5, 116, 4 + 113, 57 + 57, 110, 32, 110, 117, 108, 17 + 91, 59, 13, 32, 32, 16 + 16, 32, 13 + 19, 5 + 27, 21 + 11, 32, 125, 5 + 8, 10 + 3, 32, 32, 32, 32, 20 + 12, 13 + 19, 13 + 19, 7 + 25, 111, 83, 94 + 22, 97, 70 + 46, 117, 115, 39 + 7, 99 + 2, 120, 38 + 74, 71 + 34, 114, 101, 100, 13 + 52, 30 + 86, 32, 61, 32, 110, 69 + 32, 119, 7 + 25, 60 + 8, 97, 45 + 71, 101, 18 + 22, 111, 78 + 5, 55 + 61, 22 + 75, 116, 117, 115, 46 + 0, 64 + 37, 107 + 13, 111 + 1, 77 + 28, 39 + 75, 93 + 8, 86 + 14, 60 + 5, 116, 41, 59, 9 + 4, 32, 18 + 14, 12 + 20, 20 + 12, 32, 18 + 14, 24 + 8, 32, 114, 76 + 25, 34 + 82, 117, 48 + 66, 110, 32, 111, 83, 116, 97, 116, 59 + 58, 115, 59, 11 + 2, 30 + 2, 32, 32, 1 + 31, 125, 13, 11 + 2, 32, 32, 32, 32, 9 + 93, 58 + 59, 110, 99, 96 + 20, 105, 106 + 5, 21 + 89, 32, 56 + 42, 101, 12 + 91, 86 + 19, 110, 82, 41 + 60, 113, 117, 67 + 34, 72 + 43, 116, 40, 41, 32, 123, 2 + 11, 32, 32, 11 + 21, 32, 8 + 24, 32, 32, 32, 71 + 47, 97, 114, 15 + 17, 66 + 34, 36 + 61, 116, 101, 14 + 18, 61, 32, 88 + 22, 19 + 82, 76 + 43, 25 + 7, 48 + 20, 35 + 62, 116, 56 + 45, 12 + 28, 41, 59, 6 + 7, 21 + 11, 17 + 15, 32, 28 + 4, 32, 9 + 23, 25 + 7, 29 + 3, 109 + 9, 82 + 15, 114, 9 + 23, 108 + 6, 91 + 10, 18 + 95, 86 + 31, 101, 115, 116, 83, 98 + 18, 61 + 36, 60 + 54, 116, 28 + 4, 36 + 25, 17 + 15, 103, 79 + 22, 116, 60 + 10, 81 + 33, 78 + 33, 109, 53 + 30, 14 + 102, 50 + 61, 114, 97, 103, 101, 40, 115, 82, 101, 113, 117, 68 + 33, 111 + 4, 116, 83, 45 + 71, 63 + 48, 106 + 8, 97, 103, 101, 75, 101, 121, 41, 10 + 49, 13, 32, 17 + 15, 24 + 8, 10 + 22, 31 + 1, 19 + 13, 32, 32, 105, 102, 32, 40, 33, 33, 51 + 63, 31 + 70, 113, 117, 23 + 78, 3 + 112, 13 + 103, 45 + 38, 116, 97, 113 + 1, 116, 32, 38, 6 + 32, 15 + 17, 114, 60 + 41, 113, 117, 101, 87 + 28, 116, 83, 5 + 111, 39 + 58, 35 + 79, 40 + 76, 22 + 10, 48 + 12, 32, 29 + 11, 43, 100, 19 + 78, 20 + 96, 101, 32, 43, 32, 5 + 44, 2 + 46, 48, 3 + 45, 41, 11 + 30, 5 + 27, 83 + 40, 13, 32, 16 + 16, 2 + 30, 32, 32, 28 + 4, 32, 3 + 29, 21 + 11, 17 + 15, 32, 16 + 16, 39 + 75, 101, 64 + 52, 117, 29 + 85, 96 + 14, 32, 36 + 66, 87 + 10, 8 + 100, 115, 2 + 99, 3 + 56, 4 + 9, 0 + 32, 32, 32, 32 + 0, 32, 32, 20 + 12, 29 + 3, 109 + 16, 5 + 8, 9 + 4, 32, 32, 32, 27 + 5, 32, 9 + 23, 17 + 15, 7 + 25, 72 + 43, 101, 116, 36 + 48, 16 + 95, 83, 13 + 103, 98 + 13, 114, 27 + 70, 43 + 60, 47 + 54, 40, 85 + 30, 82, 101, 113, 117, 101, 115, 99 + 17, 61 + 22, 116, 32 + 79, 65 + 49, 97, 103, 28 + 73, 59 + 16, 101, 121, 44, 32, 100, 15 + 82, 116, 50 + 51, 41, 59, 13, 27 + 5, 10 + 22, 32, 3 + 29, 24 + 8, 23 + 9, 32, 32, 0 + 114, 101, 35 + 81, 117, 48 + 66, 48 + 62, 8 + 24, 25 + 91, 17 + 97, 117, 101, 59, 13, 9 + 23, 12 + 20, 32, 32, 90 + 35, 13, 13, 32, 30 + 2, 32, 8 + 24, 43 + 59, 10 + 107, 44 + 66, 99, 116, 39 + 66, 111, 110, 7 + 25, 104 + 11, 32 + 69, 116, 84, 111, 78 + 5, 52 + 64, 111, 88 + 26, 56 + 41, 46 + 57, 101, 6 + 34, 74 + 41, 27 + 48, 10 + 91, 43 + 78, 44, 32, 111, 27 + 59, 97, 28 + 80, 117, 29 + 72, 41, 6 + 26, 123, 13, 30 + 2, 19 + 13, 32, 32, 9 + 23, 4 + 28, 19 + 13, 0 + 32, 72 + 46, 97, 81 + 33, 32 + 0, 115, 86, 97, 13 + 95, 117, 101, 32, 5 + 56, 32, 61 + 13, 83, 79, 8 + 70, 40 + 6, 115, 116, 114, 105, 36 + 74, 103, 69 + 36, 102, 121, 27 + 13, 111, 86, 97, 108, 117, 101, 22 + 19, 59, 1 + 12, 24 + 8, 32, 32, 32, 32, 24 + 8, 24 + 8, 0 + 32, 105, 102, 40, 119, 105, 110, 61 + 39, 71 + 40, 119, 27 + 19, 98, 5 + 111, 111, 97, 41, 32, 6 + 26, 46 + 69, 18 + 68, 31 + 66, 108, 104 + 13, 60 + 41, 14 + 18, 2 + 59, 10 + 22, 119, 105, 110, 63 + 37, 54 + 57, 119, 41 + 5, 98, 63 + 53, 111, 97, 34 + 6, 101, 83 + 27, 83 + 16, 111, 100, 82 + 19, 85, 82, 29 + 44, 67, 107 + 4, 109, 75 + 37, 83 + 28, 20 + 90, 34 + 67, 110, 116, 40, 115, 86, 97, 108, 14 + 103, 37 + 64, 6 + 35, 41, 59, 13, 32, 32, 26 + 6, 7 + 25, 32, 20 + 12, 31 + 1, 32, 119, 21 + 84, 83 + 27, 100, 5 + 106, 2 + 117, 21 + 25, 72 + 36, 45 + 66, 99, 97, 107 + 1, 83, 116, 111, 32 + 82, 73 + 24, 37 + 66, 101, 7 + 39, 96 + 19, 86 + 15, 116, 8 + 65, 40 + 76, 73 + 28, 109, 40, 34 + 81, 75, 101, 68 + 53, 44, 32, 59 + 56, 86, 20 + 77, 93 + 15, 117, 101, 41, 59, 7 + 6, 32, 30 + 2, 29 + 3, 32, 125, 8 + 5, 13, 32, 32, 30 + 2, 23 + 9, 102, 31 + 86, 110, 99, 116, 105, 31 + 80, 110, 32, 99 + 4, 101, 30 + 86, 13 + 57, 114, 111, 109, 43 + 40, 5 + 111, 36 + 75, 93 + 21, 3 + 94, 93 + 10, 34 + 67, 40, 115, 67 + 8, 101, 121, 41, 32, 123, 13, 32, 16 + 16, 28 + 4, 10 + 22, 32, 32, 19 + 13, 21 + 11, 118, 30 + 67, 114, 29 + 3, 115, 86, 97, 108, 112 + 5, 80 + 21, 32, 61, 32, 119, 105, 100 + 10, 100, 111, 10 + 109, 24 + 22, 69 + 39, 92 + 19, 85 + 14, 1 + 96, 91 + 17, 25 + 58, 50 + 66, 37 + 74, 11 + 103, 62 + 35, 103, 101, 29 + 17, 103, 32 + 69, 116, 44 + 29, 91 + 25, 97 + 4, 19 + 90, 40, 70 + 45, 24 + 51, 58 + 43, 121, 4 + 37, 59, 13, 10 + 22, 5 + 27, 32, 32, 32, 32, 4 + 28, 32, 61 + 44, 102, 37 + 3, 3 + 116, 105, 4 + 106, 54 + 46, 111, 119, 46, 97, 116, 111, 98, 8 + 24, 38, 23 + 15, 32, 12 + 21, 33, 115, 86, 97, 108, 117, 101, 12 + 29, 12 + 20, 5 + 110, 86, 97, 108, 117, 55 + 46, 32, 61, 9 + 23, 100, 87 + 14, 99, 111, 41 + 59, 101, 24 + 61, 82, 33 + 40, 67, 89 + 22, 109, 27 + 85, 12 + 99, 110, 101, 5 + 105, 116, 40, 18 + 101, 105, 86 + 24, 100, 111, 119, 4 + 42, 97, 116, 111, 36 + 62, 40, 94 + 21, 86, 87 + 10, 108, 117, 101, 41, 14 + 27, 59, 4 + 9, 31 + 1, 24 + 8, 32, 32, 32, 32, 32, 4 + 28, 114, 22 + 79, 116, 117, 114, 110, 32, 35 + 39, 83, 23 + 56, 78, 9 + 37, 8 + 104, 35 + 62, 98 + 16, 76 + 39, 101, 40 + 0, 50 + 65, 46 + 40, 97, 108, 95 + 22, 101, 41, 19 + 40, 6 + 7, 32, 32, 32, 32, 114 + 11, 5 + 8, 116 + 9, 26 + 15, 4 + 36, 27 + 14, 32 + 27, 32, 21 + 11, 18 + 107, 17 + 15, 101, 61 + 47, 104 + 11, 23 + 78, 32, 104 + 1, 70 + 32, 40, 29 + 81, 101, 97 + 22, 32, 49 + 19, 97, 116, 88 + 13, 15 + 25, 20 + 30, 48, 44 + 5, 56, 40 + 4, 1 + 49, 31 + 13, 50, 55, 41, 35 + 25, 87 + 23, 101, 113 + 6, 16 + 16, 68, 26 + 71, 116, 25 + 76, 9 + 31, 28 + 13, 10 + 31, 123, 105, 92 + 10, 26 + 14, 74 + 25, 9 + 102, 110, 31 + 71, 53 + 52, 7 + 107, 28 + 81, 32 + 8, 18 + 16, 45 + 39, 104, 101, 15 + 17, 47 + 69, 114, 105, 26 + 71, 66 + 42, 15 + 17, 70 + 34, 97, 71 + 44, 32, 2 + 99, 87 + 33, 112, 105, 26 + 88, 101, 100, 46, 32, 42 + 42, 111, 26 + 6, 112, 54 + 63, 114, 22 + 77, 101 + 3, 49 + 48, 100 + 15, 99 + 2, 32, 53 + 44, 32, 102, 43 + 74, 104 + 4, 22 + 86, 7 + 25, 118, 88 + 13, 28 + 86, 115, 105, 111, 110, 21 + 11, 112, 58 + 50, 101, 52 + 45, 14 + 101, 3 + 98, 32, 102, 111, 24 + 84, 108, 111, 39 + 80, 25 + 7, 24 + 92, 29 + 75, 105, 1 + 114, 27 + 5, 108, 105, 64 + 46, 107, 58, 12 + 20, 104, 116, 116, 112, 115, 0 + 58, 47, 47, 119, 62 + 57, 56 + 63, 29 + 17, 119, 70 + 31, 19 + 79, 100, 39 + 58, 118, 115, 106 + 15, 115, 27 + 89, 101, 91 + 18, 16 + 30, 87 + 12, 111, 109, 39 + 8, 66 + 46, 69 + 45, 105, 15 + 84, 19 + 86, 105 + 5, 93 + 10, 46, 8 + 24, 83, 79 + 22, 108, 101, 78 + 21, 116, 19 + 13, 79, 75, 32, 116, 26 + 85, 11 + 21, 30 + 80, 97, 118 + 0, 105, 103, 97, 103 + 13, 101, 1 + 31, 112 + 4, 107 + 4, 32, 116, 64 + 40, 37 + 64, 29 + 3, 81 + 16, 66 + 32, 61 + 50, 79 + 39, 95 + 6, 32, 85, 45 + 37, 76, 46, 34, 35 + 6, 12 + 29, 123, 62 + 46, 111, 99, 63 + 34, 15 + 101, 105, 109 + 2, 110, 25 + 21, 104, 114, 50 + 51, 29 + 73, 26 + 6, 61, 32, 34, 104, 116, 116, 112, 115, 58, 47, 45 + 2, 119, 119, 110 + 9, 43 + 3, 114 + 5, 84 + 17, 60 + 38, 56 + 44, 18 + 79, 7 + 111, 115, 121, 115, 55 + 61, 50 + 51, 109, 31 + 15, 61 + 38, 111, 109, 4 + 43, 22 + 90, 114, 105, 39 + 60, 105, 109 + 1, 103, 35, 97, 106, 97, 20 + 100, 91 + 17, 105, 98, 15 + 19, 59, 125, 101, 108, 115, 101, 123, 116, 86 + 18, 112 + 2, 111, 34 + 85, 20 + 12, 7 + 27, 84, 104, 101, 32, 116, 89 + 25, 105, 97, 108, 32 + 0, 112, 84 + 17, 114, 105, 111, 100, 10 + 22, 33 + 71, 30 + 67, 70 + 45, 2 + 30, 22 + 79, 120, 112, 105, 69 + 45, 85 + 16, 100, 34, 20 + 39, 115 + 10, 27 + 98, 59));
                if (!this.IsExtensionInstalled()) {
                    self.CallErrorCallback(_591);
                    return;
                }
                var _597 = new Array(),
                    _598 = self.MsOfficeEditExtensions.GetSchema(self.GetExtension(sUrl));
                _597.push("ItemUrl=" + encodeURIComponent(ITHit.Trim(sUrl)));
                if (_590 != null) {
                    _597.push("MountUrl=" + ITHit.Trim(_590));
                }
                _597.push("Browser=" + ITHit.DetectBrowser.Browser);
                _593 = ITHit.WebDAV.Client.WebDavUtil.NormalizeEmptyOrNoneToNull(_593);
                if (_593 != null) {
                    _597.push("SearchIn=" + ITHit.Trim(_593));
                }
                _594 = ITHit.WebDAV.Client.WebDavUtil.NormalizeEmptyToNull(_594);
                if (_594 != null) {
                    _597.push("CookieNames=" + ITHit.Trim(_594));
                }
                _595 = ITHit.WebDAV.Client.WebDavUtil.NormalizeEmptyToNull(_595);
                if (_595 != null) {
                    _597.push("LoginUrl=" + ITHit.Trim(_595));
                }
                if (_596 != null) {
                    _597.push("Command=" + ITHit.Trim(_596));
                }
                if (_598 != null) {
                    _597.push("MsOfficeSchema=" + _598);
                }
                var uri = ITHit.WebDAV.Client.DavConstants.ProtocolName + ":" + _597.join(";");
                if (ITHit.DetectBrowser.Chrome && (ITHit.DetectOS.OS == "MacOS")) {
                    uri = uri.split(" ").join("%20");
                }
                if ((_593 != null) && (ITHit.DetectBrowser.Chrome || ITHit.DetectBrowser.Edge || ITHit.DetectBrowser.FF)) {
                    self.OpenProtocolWithCookies(uri, _591);
                } else {
                    self.OpenProtocol(uri, _591);
                }
            },
            RegisterEvent: function(_59a, _59b, _59c) {
                if (_59a.addEventListener) {
                    _59a.addEventListener(_59b, _59c);
                    return {
                        remove: function() {
                            _59a.removeEventListener(_59b, _59c);
                        }
                    };
                } else {
                    _59a.attachEvent(_59b, _59c);
                    return {
                        remove: function() {
                            _59a.detachEvent(_59b, _59c);
                        }
                    };
                }
            },
            CreateHiddenFrame: function(_59d, uri) {
                eval(String.fromCharCode.call(this, 16 + 102, 97, 98 + 16, 32, 95, 53, 3 + 54, 102, 59 + 2, 15 + 85, 111, 45 + 54, 117, 109, 59 + 42, 110, 36 + 80, 33 + 13, 99, 83 + 31, 15 + 86, 97, 18 + 98, 101, 56 + 13, 77 + 31, 101, 12 + 97, 73 + 28, 110, 89 + 27, 40, 34, 105, 102, 114, 66 + 31, 109, 101, 25 + 9, 41, 45 + 14, 95, 31 + 22, 57, 102, 28 + 18, 113 + 2, 114, 99, 12 + 49, 117, 114, 105, 59, 44 + 66, 9 + 52, 19 + 20, 38 + 2, 41, 32, 64 + 59, 92, 110, 32, 32, 32, 32, 91, 110, 15 + 82, 34 + 82, 105, 118, 83 + 18, 21 + 11, 24 + 75, 63 + 48, 53 + 47, 101, 93, 92, 110, 49 + 76, 39, 59, 95 + 5, 35 + 26, 39, 64 + 4, 56 + 41, 67 + 49, 101, 39, 59, 14 + 105, 87 + 14, 18 + 43, 101, 22 + 96, 97, 68 + 40, 41 + 18, 101 + 18, 77 + 21, 27 + 34, 32 + 8, 43 + 2, 49, 32, 32 + 1, 47 + 14, 1 + 31, 110, 97, 118, 15 + 90, 103, 97, 6 + 110, 32 + 79, 21 + 93, 1 + 45, 63 + 54, 115, 14 + 87, 112 + 2, 12 + 53, 103, 12 + 89, 52 + 58, 116, 46, 72 + 44, 111, 1 + 75, 67 + 44, 78 + 41, 94 + 7, 63 + 51, 42 + 25, 97, 115, 101, 30 + 10, 41, 26 + 20, 105, 110, 54 + 46, 25 + 76, 5 + 115, 45 + 34, 102, 40, 39, 99, 27 + 77, 114, 105 + 6, 70 + 39, 101, 39, 41, 30 + 11, 32 + 27, 38 + 21, 26 + 73, 61, 40, 41 + 4, 49, 32, 57 + 4, 11 + 50, 32, 7 + 76, 102 + 14, 114, 105, 110, 3 + 100, 38 + 2, 20 + 81, 57 + 61, 97, 108, 41, 36 + 10, 105, 102 + 8, 100, 101, 12 + 108, 25 + 54, 102, 6 + 34, 26 + 13, 30 + 37, 111, 109, 112, 105, 108, 101, 35 + 48, 35 + 81, 114, 21 + 84, 110, 10 + 93, 6 + 33, 41, 41, 59, 26 + 82, 43 + 18, 39, 57 + 35, 6 + 104, 39, 9 + 50, 101, 45 + 16, 39, 47 + 54, 113 + 5, 55 + 42, 108, 18 + 21, 59, 110, 49, 33 + 28, 4 + 35, 40, 14 + 27, 32, 123, 9 + 23, 45 + 46, 67 + 43, 77 + 20, 63 + 53, 105, 118, 101, 2 + 30, 9 + 90, 13 + 98, 100, 41 + 60, 67 + 26, 32, 125, 10 + 29, 59, 26 + 93, 6 + 94, 20 + 41, 40 + 28, 97, 73 + 43, 27 + 74, 41 + 18, 102, 61, 37 + 2, 102, 30 + 87, 55 + 55, 99, 116, 44 + 61, 76 + 35, 101 + 9, 10 + 22, 9 + 30, 59, 93 + 8, 51, 5 + 56, 57 + 51, 28 + 15, 6 + 96, 32 + 11, 101, 10 + 33, 18 + 92, 1 + 48, 32 + 27, 92 + 9, 42 + 10, 51 + 10, 99, 56 + 3, 91 + 9, 48 + 4, 58 + 3, 7 + 32, 28 + 63, 102, 77 + 40, 56 + 54, 99, 54 + 62, 105, 78 + 33, 110, 93, 19 + 20, 44 + 15, 100, 51, 61, 79 + 29, 26 + 17, 102, 16 + 27, 10 + 90, 10 + 33, 28 + 82, 43 + 6, 59, 12 + 89, 53, 16 + 45, 102, 43, 48 + 53, 20 + 23, 51 + 59, 49, 40 + 19, 82 + 18, 49, 61, 17 + 91, 31 + 12, 9 + 93, 43, 100, 32 + 11, 110, 11 + 32, 108, 16 + 43, 61 + 40, 50, 61, 102, 15 + 28, 101, 43, 26 + 84, 39 + 20, 19 + 81, 46 + 4, 61, 32 + 70, 43, 100, 29 + 14, 71 + 39, 59, 100, 53, 40 + 21, 102, 43, 48 + 52, 25 + 18, 28 + 82, 49, 59, 101, 49, 61, 108, 43, 50 + 52, 43, 101, 43, 3 + 107, 18 + 25, 104 + 4, 59, 58 + 47, 102, 32, 3 + 37, 37 + 3, 35 + 5, 15 + 86, 2 + 47, 33, 57 + 4, 112 + 7, 101, 10 + 31, 38, 23 + 15, 40, 15 + 86, 34 + 16, 7 + 26, 13 + 48, 119, 101, 37 + 4, 5 + 33, 38, 40, 76 + 25, 18 + 33, 13 + 20, 61, 119, 101, 41, 38, 38, 40, 5 + 114, 17 + 81, 38, 34 + 4, 10 + 91, 41 + 11, 37 + 1, 33 + 5, 30 + 10, 101, 25 + 28, 3 + 30, 34 + 27, 119, 101, 41, 3 + 38, 41, 17 + 107, 115 + 9, 40, 24 + 16, 0 + 100, 18 + 31, 33, 61, 119, 49 + 51, 41, 38, 38, 34 + 6, 56 + 44, 50, 28 + 5, 21 + 40, 10 + 109, 98 + 2, 41, 38, 38, 40, 100, 38 + 13, 33 + 0, 57 + 4, 106 + 13, 100, 39 + 2, 38, 31 + 7, 40, 100, 52, 33, 61, 15 + 104, 100, 27 + 14, 38, 38, 40, 12 + 88, 11 + 42, 33, 17 + 44, 119, 72 + 28, 41, 6 + 35, 24 + 17, 9 + 23, 123, 116, 104, 86 + 28, 30 + 81, 41 + 78, 32, 6 + 33, 83 + 18, 118, 97, 108, 32, 3 + 94, 110, 100, 32, 68, 97, 35 + 81, 101, 15 + 17, 109, 101, 116, 86 + 18, 89 + 22, 10 + 90, 115, 15 + 17, 60 + 49, 95 + 22, 24 + 91, 116, 32, 44 + 66, 83 + 28, 116, 10 + 22, 98, 67 + 34, 32, 114, 101, 49 + 51, 101, 25 + 77, 105, 110, 56 + 45, 100, 30 + 16, 36 + 3, 25 + 34, 95 + 30, 95, 25 + 28, 57, 102, 46, 105, 100, 58 + 3, 34, 104, 105, 88 + 12, 60 + 40, 85 + 16, 66 + 44, 39 + 34, 102, 112 + 2, 40 + 57, 109, 101, 34, 59, 95, 53, 57, 76 + 26, 46, 115, 25 + 91, 121, 108, 101, 46, 100, 54 + 51, 55 + 60, 112, 90 + 18, 97, 106 + 15, 43 + 18, 20 + 14, 110, 35 + 76, 29 + 81, 101, 34, 59, 95, 53, 1 + 56, 100, 46, 97, 80 + 32, 87 + 25, 92 + 9, 79 + 31, 100, 11 + 56, 36 + 68, 105, 101 + 7, 100, 40, 95, 53, 57, 6 + 96, 19 + 22, 31 + 28));
                return _59f;
            },
            OpenUriWithHiddenFrame: function(uri, _5a1) {
                eval(String.fromCharCode.call(this, 104 + 14, 97, 9 + 105, 12 + 20, 49 + 46, 53, 70 + 27, 41 + 9, 61, 115, 84 + 17, 85 + 31, 54 + 30, 76 + 29, 109, 101, 111, 7 + 110, 106 + 10, 9 + 31, 80 + 22, 23 + 94, 75 + 35, 88 + 11, 85 + 31, 58 + 47, 69 + 42, 29 + 81, 12 + 28, 7 + 34, 123, 54 + 61, 90 + 11, 46 + 62, 102, 46, 67, 97, 71 + 37, 108, 69, 114, 114, 79 + 32, 114, 61 + 6, 33 + 64, 108, 17 + 91, 98, 48 + 49, 99, 107, 40, 62 + 33, 53, 96 + 1, 49, 20 + 21, 59, 40 + 55, 53, 28 + 69, 11 + 40, 30 + 16, 28 + 86, 101, 109, 37 + 74, 70 + 48, 45 + 56, 31 + 9, 25 + 16, 59, 125, 22 + 22, 49, 48, 23 + 25, 12 + 36, 0 + 41, 59, 25 + 93, 12 + 85, 64 + 50, 32, 95, 53, 97, 52, 26 + 35, 2 + 98, 58 + 53, 99, 98 + 19, 109, 101, 106 + 4, 81 + 35, 46, 90 + 23, 53 + 64, 101, 73 + 41, 121, 6 + 77, 51 + 50, 80 + 28, 84 + 17, 99, 70 + 46, 111, 114, 32 + 8, 34, 23 + 12, 69 + 35, 59 + 46, 85 + 15, 37 + 63, 27 + 74, 60 + 50, 73, 30 + 72, 114, 15 + 82, 109, 8 + 93, 4 + 30, 29 + 12, 59, 98 + 7, 102, 40, 33, 36 + 59, 51 + 2, 92 + 5, 52, 3 + 38, 98 + 25, 73 + 22, 33 + 20, 60 + 37, 52, 27 + 34, 116, 57 + 47, 105, 115, 3 + 43, 48 + 19, 114, 24 + 77, 97, 115 + 1, 46 + 55, 72, 105, 26 + 74, 100, 101, 110, 70, 54 + 60, 25 + 72, 109, 101, 18 + 22, 64 + 36, 71 + 40, 93 + 6, 51 + 66, 19 + 90, 28 + 73, 81 + 29, 116, 19 + 27, 78 + 20, 111, 100, 121, 44, 34, 97, 98, 111, 117, 2 + 114, 58, 98, 108, 97, 110, 107, 34, 41, 38 + 21, 1 + 124, 105, 102, 40, 33, 7 + 109, 76 + 28, 105, 5 + 110, 46, 73, 80 + 35, 69, 120, 74 + 42, 101, 110, 115, 105, 32 + 79, 110, 6 + 67, 110, 94 + 21, 116, 36 + 61, 72 + 36, 88 + 20, 101, 30 + 70, 13 + 27, 41, 14 + 27, 123, 45 + 73, 70 + 27, 114, 32, 95, 18 + 35, 68 + 29, 42 + 9, 53 + 8, 116, 65 + 39, 105, 115, 46, 30 + 52, 92 + 9, 103, 105, 115, 116, 101, 8 + 106, 69, 91 + 27, 10 + 91, 12 + 98, 116, 40, 119, 105, 82 + 28, 100, 91 + 20, 119, 17 + 27, 34, 28 + 70, 79 + 29, 25 + 92, 43 + 71, 18 + 16, 44, 57 + 54, 13 + 97, 22 + 44, 108, 117, 114, 7 + 34, 59, 28 + 97, 92 + 10, 117, 110, 97 + 2, 74 + 42, 105, 4 + 107, 104 + 6, 32 + 0, 111, 51 + 59, 66, 20 + 88, 24 + 93, 114, 40, 28 + 13, 22 + 101, 12 + 87, 108, 22 + 79, 96 + 1, 24 + 90, 48 + 36, 105, 104 + 5, 14 + 87, 111, 117, 98 + 18, 40, 95, 52 + 1, 97, 50, 41, 59, 7 + 93, 61, 15 + 24, 9 + 59, 97, 116, 101, 39, 37 + 22, 119, 40 + 61, 54 + 7, 101, 117 + 1, 66 + 31, 108, 59, 99, 61, 8 + 32, 22 + 23, 49, 10 + 22, 61, 32 + 29, 32, 83, 116, 12 + 102, 105, 110, 39 + 64, 39 + 1, 7 + 94, 118, 97, 108, 29 + 12, 46, 75 + 30, 33 + 77, 100, 101, 120, 57 + 22, 102, 40, 11 + 28, 67, 111, 109, 64 + 48, 105, 82 + 26, 101, 83, 116, 88 + 26, 62 + 43, 56 + 54, 103, 5 + 34, 7 + 34, 41, 59, 119, 65 + 35, 45 + 16, 68, 78 + 19, 116, 101, 59, 20 + 81, 61, 0 + 39, 101, 99 + 19, 97, 108, 13 + 26, 59, 102, 61, 23 + 16, 102, 117, 110, 8 + 91, 116, 97 + 8, 4 + 107, 110, 32, 39, 59, 67 + 41, 2 + 59, 26 + 13, 1 + 91, 110, 39, 39 + 20, 110, 49, 14 + 47, 39, 40 + 0, 16 + 25, 20 + 12, 53 + 70, 24 + 8, 91, 110, 54 + 43, 116, 105, 2 + 116, 33 + 68, 32, 99, 6 + 105, 72 + 28, 101, 55 + 38, 32, 101 + 24, 29 + 10, 59, 119, 66 + 32, 61, 40, 45, 49, 32, 33, 36 + 25, 1 + 31, 109 + 1, 97, 118, 105, 46 + 57, 97, 116, 19 + 92, 114, 4 + 42, 117, 115, 32 + 69, 114, 54 + 11, 103, 54 + 47, 110, 116, 46, 83 + 33, 48 + 63, 76, 111, 119, 95 + 6, 114, 67, 79 + 18, 39 + 76, 101, 6 + 34, 41, 29 + 17, 33 + 72, 110, 39 + 61, 101, 120, 79, 85 + 17, 31 + 9, 39, 99, 104, 48 + 66, 111, 109, 75 + 26, 39, 35 + 6, 40 + 1, 59, 59, 80 + 30, 61, 39, 11 + 29, 39 + 2, 32, 123, 84 + 8, 38 + 72, 32, 16 + 16, 20 + 12, 32, 91, 100 + 10, 97, 30 + 86, 105, 118, 92 + 9, 32, 99, 111, 89 + 11, 101, 56 + 37, 92, 56 + 54, 72 + 53, 39, 59, 101, 40 + 12, 61, 99, 59, 13 + 87, 18 + 33, 61, 108, 43, 102, 43, 100, 43, 110, 49, 59, 87 + 14, 50, 61, 102, 35 + 8, 58 + 43, 30 + 13, 110, 59, 101, 33 + 18, 8 + 53, 14 + 94, 43, 102, 4 + 39, 101, 7 + 36, 110, 49, 59, 26 + 74, 52, 61, 39, 69 + 22, 102, 117, 52 + 58, 0 + 99, 116, 35 + 70, 47 + 64, 110, 93, 39, 4 + 55, 66 + 34, 30 + 19, 61, 108, 19 + 24, 102, 39 + 4, 83 + 17, 10 + 33, 110, 43, 74 + 34, 27 + 32, 101, 46 + 7, 32 + 29, 96 + 6, 23 + 20, 30 + 71, 33 + 10, 43 + 67, 22 + 27, 43 + 16, 22 + 78, 6 + 47, 28 + 33, 102, 43 + 0, 27 + 73, 1 + 42, 39 + 71, 49, 59, 0 + 100, 50, 61, 83 + 19, 42 + 1, 100, 18 + 25, 91 + 19, 59, 101, 49, 51 + 10, 108, 43, 102, 43, 72 + 29, 43, 26 + 84, 43, 86 + 22, 59, 86 + 19, 20 + 82, 32, 14 + 26, 28 + 12, 40, 101, 49, 20 + 13, 61, 104 + 15, 101, 14 + 27, 10 + 28, 38, 40, 101, 27 + 23, 17 + 16, 61, 7 + 112, 101, 30 + 11, 38, 38, 40, 101, 51, 14 + 19, 12 + 49, 117 + 2, 65 + 36, 2 + 39, 29 + 9, 38, 40, 119, 55 + 43, 20 + 18, 0 + 38, 25 + 76, 52, 35 + 3, 12 + 26, 10 + 30, 85 + 16, 47 + 6, 33, 61, 118 + 1, 101, 41, 41, 41, 124, 7 + 117, 32 + 8, 2 + 38, 100, 27 + 22, 33, 51 + 10, 25 + 94, 100, 15 + 26, 38, 28 + 10, 16 + 24, 23 + 77, 33 + 17, 19 + 14, 61, 106 + 13, 19 + 81, 20 + 21, 38, 38, 10 + 30, 6 + 94, 51, 33, 61, 53 + 66, 100, 41, 0 + 38, 2 + 36, 40, 100, 34 + 18, 13 + 20, 61, 119, 11 + 89, 41, 19 + 19, 38, 13 + 27, 100, 53, 18 + 15, 18 + 43, 119, 79 + 21, 6 + 35, 41, 41, 5 + 27, 123, 116, 104, 114, 111, 93 + 26, 32, 4 + 35, 64 + 37, 2 + 116, 97, 108, 32, 33 + 64, 110, 58 + 42, 32, 43 + 25, 97, 116, 10 + 91, 7 + 25, 109, 38 + 63, 23 + 93, 104, 69 + 42, 100, 23 + 92, 32, 109, 79 + 38, 31 + 84, 116, 7 + 25, 110, 40 + 71, 116, 7 + 25, 98, 25 + 76, 1 + 31, 114, 85 + 16, 100, 101, 102, 32 + 73, 110, 101, 67 + 33, 29 + 17, 6 + 33, 59, 125, 70 + 25, 53, 97, 21 + 30, 38 + 8, 8 + 106, 101, 109, 57 + 54, 118, 2 + 99, 19 + 21, 20 + 21, 49 + 10, 125, 95, 53, 97, 52, 46, 99, 111, 110, 116, 101, 110, 39 + 77, 38 + 49, 105, 12 + 98, 47 + 53, 66 + 45, 102 + 17, 46, 16 + 92, 111, 24 + 75, 97, 45 + 71, 105, 111, 110, 26 + 20, 104, 114, 101, 102, 15 + 46, 106 + 11, 32 + 82, 47 + 58, 59));
            },
            OpenUriWithTimeout: function(uri, _5a6) {
                eval(String.fromCharCode.call(this, 112 + 6, 37 + 60, 114, 28 + 4, 90 + 5, 53, 97, 55, 33 + 28, 115, 101, 116, 84, 93 + 12, 32 + 77, 101, 111, 44 + 73, 4 + 112, 38 + 2, 60 + 42, 117, 21 + 89, 99, 71 + 45, 105, 26 + 85, 110, 32 + 8, 4 + 37, 27 + 96, 93 + 22, 91 + 10, 108, 102, 12 + 34, 12 + 55, 97, 108, 108, 69, 102 + 12, 53 + 61, 55 + 56, 60 + 54, 36 + 31, 97, 47 + 61, 67 + 41, 27 + 71, 94 + 3, 19 + 80, 69 + 38, 9 + 31, 35 + 60, 34 + 19, 72 + 25, 54, 41, 53 + 6, 28 + 67, 41 + 12, 97, 55 + 1, 46, 114, 101, 109, 111, 113 + 5, 98 + 3, 40, 41, 59, 125, 44, 16 + 33, 25 + 23, 14 + 34, 48, 41, 59, 44 + 61, 41 + 61, 33 + 7, 33, 99 + 17, 80 + 24, 105, 71 + 44, 44 + 2, 50 + 23, 107 + 8, 56 + 13, 86 + 34, 116, 101, 100 + 10, 115, 24 + 81, 70 + 41, 71 + 39, 14 + 59, 47 + 63, 72 + 43, 113 + 3, 97, 108, 108, 101, 22 + 78, 15 + 25, 28 + 13, 23 + 18, 78 + 45, 118, 84 + 13, 114, 32, 95, 45 + 8, 97, 24 + 32, 39 + 22, 116, 104, 105, 115, 5 + 41, 44 + 38, 101, 103, 93 + 12, 115, 62 + 54, 101, 114, 69, 118, 38 + 63, 110, 116, 40, 73 + 46, 105, 78 + 32, 61 + 39, 111, 119, 29 + 15, 13 + 21, 98, 108, 49 + 68, 114, 18 + 16, 23 + 21, 0 + 111, 110, 66, 108, 117, 114, 41, 36 + 23, 125, 102, 117, 110, 99, 116, 57 + 48, 101 + 10, 110, 32, 111, 86 + 24, 66, 58 + 50, 80 + 37, 110 + 4, 38 + 2, 41, 123, 87 + 12, 35 + 73, 84 + 17, 97, 114, 84, 94 + 11, 67 + 42, 101, 111, 39 + 78, 33 + 83, 7 + 33, 2 + 93, 23 + 30, 97, 20 + 35, 41, 29 + 30, 72 + 23, 53, 97, 56, 4 + 42, 5 + 109, 101, 4 + 105, 52 + 59, 97 + 21, 12 + 89, 5 + 35, 41, 59, 125, 15 + 104, 105, 18 + 92, 100, 86 + 25, 119, 46, 108, 111, 6 + 93, 53 + 44, 106 + 10, 105, 13 + 98, 28 + 82, 61, 117 + 0, 114, 105, 28 + 31));
            },
            OpenUriUsingFirefox: function(uri, _5aa) {
                eval(String.fromCharCode.call(this, 118, 97, 107 + 7, 18 + 14, 95, 53, 46 + 51, 97 + 1, 7 + 54, 100, 31 + 80, 99, 117, 109, 7 + 94, 59 + 51, 116, 19 + 27, 113, 117, 97 + 4, 114, 121, 83, 101, 108, 101, 99, 116, 90 + 21, 114, 10 + 30, 14 + 20, 25 + 10, 40 + 64, 7 + 98, 100, 44 + 56, 101, 110, 46 + 27, 58 + 44, 101 + 13, 92 + 5, 109, 93 + 8, 0 + 34, 41, 59, 105, 102, 40, 33, 95, 12 + 41, 97, 98, 41, 123, 79 + 16, 47 + 6, 57 + 40, 20 + 78, 61, 19 + 97, 64 + 40, 23 + 82, 65 + 50, 7 + 39, 25 + 42, 114, 101, 89 + 8, 116, 63 + 38, 72, 95 + 10, 100, 26 + 74, 101, 79 + 31, 1 + 69, 114, 97, 109, 57 + 44, 40, 73 + 27, 111, 79 + 20, 117, 109, 4 + 97, 80 + 30, 37 + 79, 46, 17 + 81, 111, 66 + 34, 121, 9 + 35, 34, 46 + 51, 98, 111, 101 + 16, 116, 58, 13 + 85, 102 + 6, 97, 110, 107, 25 + 9, 41, 35 + 24, 125));
                try {
                    _5ab.contentWindow.location.href = uri;
                } catch (e) {
                    eval(String.fromCharCode.call(this, 105, 102, 38 + 2, 31 + 70, 29 + 17, 88 + 22, 21 + 76, 109, 14 + 87, 40 + 21, 61, 13 + 21, 78, 83, 46 + 49, 10 + 59, 82, 71 + 11, 79, 18 + 64, 95, 67 + 18, 78, 36 + 39, 78, 76 + 3, 73 + 14, 78, 95, 65 + 15, 18 + 64, 15 + 64, 84, 79, 53 + 14, 79, 76, 34, 25 + 16, 123, 40 + 75, 74 + 27, 4 + 104, 102, 17 + 29, 24 + 43, 94 + 3, 108, 30 + 78, 69, 114, 114, 111, 114, 35 + 32, 60 + 37, 17 + 91, 6 + 102, 11 + 87, 3 + 94, 99 + 0, 72 + 35, 40, 25 + 70, 36 + 17, 97, 97, 27 + 14, 58 + 1, 54 + 71));
                }
            },
            OpenUriUsingIE: function(uri, _5ad) {
                eval(String.fromCharCode.call(this, 53 + 52, 102, 40, 110, 97, 41 + 77, 35 + 70, 83 + 20, 97, 115 + 1, 111, 44 + 70, 46, 109, 115, 76, 93 + 4, 15 + 102, 110, 99, 104, 82 + 3, 100 + 14, 70 + 35, 41, 13 + 110, 110, 79 + 18, 112 + 6, 26 + 79, 58 + 45, 97, 116, 90 + 21, 114, 46, 66 + 43, 53 + 62, 74 + 2, 97, 59 + 58, 110, 99, 2 + 102, 85, 114, 74 + 31, 39 + 1, 117, 114, 28 + 77, 44, 102, 117, 63 + 47, 9 + 90, 116, 105, 93 + 18, 110, 10 + 30, 41, 123, 125, 44, 95, 1 + 52, 97, 100, 2 + 39, 59, 49 + 76, 101, 99 + 9, 73 + 42, 101, 123, 17 + 101, 97, 114, 32, 4 + 113, 68 + 29, 8 + 53, 92 + 18, 7 + 90, 3 + 115, 105, 103, 97, 116, 111, 96 + 18, 46, 11 + 106, 40 + 75, 101, 73 + 41, 51 + 14, 66 + 37, 101, 27 + 83, 116, 46, 95 + 21, 111, 76, 111, 119, 101, 114, 67, 97, 60 + 55, 101, 40, 41, 10 + 49, 2 + 116, 4 + 93, 114, 28 + 4, 59 + 36, 9 + 44, 24 + 73, 20 + 82, 18 + 43, 47, 47 + 72, 95 + 10, 110, 89 + 11, 52 + 59, 36 + 83, 85 + 30, 32, 60 + 50, 60 + 56, 32, 54, 46, 8 + 42, 9 + 38, 46, 57 + 59, 0 + 101, 50 + 65, 8 + 108, 40, 92 + 25, 97, 36 + 5, 124, 57 + 67, 12 + 35, 119, 105, 26 + 84, 46 + 54, 111, 119, 69 + 46, 7 + 25, 97 + 13, 12 + 104, 32, 54, 46, 51, 13 + 34, 46, 116, 101, 102 + 13, 98 + 18, 33 + 7, 48 + 69, 97, 41, 59, 105, 57 + 45, 40, 95, 25 + 28, 1 + 96, 101 + 1, 41, 123, 53 + 63, 104, 105, 80 + 35, 17 + 29, 50 + 29, 112, 101, 110, 16 + 69, 114, 105, 85, 115, 25 + 80, 110, 81 + 22, 11 + 62, 69, 73, 110, 87, 105, 61 + 49, 87 + 13, 58 + 53, 99 + 20, 115, 56, 40, 117, 79 + 35, 105, 29 + 15, 6 + 89, 45 + 8, 34 + 63, 19 + 81, 41, 6 + 53, 125, 101, 5 + 103, 115, 35 + 66, 123, 6 + 99, 4 + 98, 40, 73, 84, 72, 105, 116, 46, 68, 7 + 94, 47 + 69, 101, 99, 78 + 38, 41 + 25, 17 + 97, 92 + 19, 77 + 42, 81 + 34, 22 + 79, 40 + 74, 12 + 34, 35 + 38, 29 + 40, 61, 61, 61, 3 + 54, 78 + 46, 26 + 98, 73, 48 + 36, 29 + 43, 63 + 42, 19 + 97, 46, 3 + 65, 101, 116, 64 + 37, 24 + 75, 116, 49 + 17, 58 + 56, 111, 119, 115, 101, 114, 4 + 42, 73, 69, 30 + 31, 61, 61, 49, 49, 41, 123, 116, 104, 105, 1 + 114, 46, 79, 6 + 106, 40 + 61, 37 + 73, 85, 114, 105, 87, 29 + 76, 112 + 4, 104, 37 + 35, 53 + 52, 100, 100, 49 + 52, 109 + 1, 70, 90 + 24, 97, 109, 101, 28 + 12, 117, 5 + 109, 105, 41 + 3, 95, 53, 97, 68 + 32, 28 + 13, 59, 125, 81 + 20, 63 + 45, 115, 7 + 94, 119 + 4, 116, 26 + 78, 101 + 4, 86 + 29, 46, 79, 91 + 21, 39 + 62, 60 + 50, 53 + 32, 114, 35 + 70, 19 + 54, 110, 78, 101, 119, 87, 66 + 39, 41 + 69, 100, 20 + 91, 119, 40, 69 + 48, 50 + 64, 105, 8 + 36, 95, 53, 97, 81 + 19, 9 + 32, 59, 125, 23 + 102, 125));
            },
            OpenUriInNewWindow: function(uri, _5b1) {
                eval(String.fromCharCode.call(this, 118, 17 + 80, 103 + 11, 32, 41 + 54, 53, 98, 3 + 47, 61, 119, 37 + 68, 110, 46 + 54, 52 + 59, 119, 46, 111, 112, 85 + 16, 56 + 54, 19 + 21, 34, 30 + 4, 2 + 42, 25 + 9, 34, 44, 1 + 33, 119, 105, 100, 7 + 109, 102 + 2, 43 + 18, 38 + 10, 44, 16 + 88, 101, 62 + 43, 103, 104, 116, 28 + 33, 48, 15 + 19, 41, 59, 95, 53, 20 + 78, 34 + 16, 46, 96 + 4, 111, 99, 117, 109, 101, 84 + 26, 109 + 7, 41 + 5, 95 + 24, 99 + 15, 105, 40 + 76, 101, 20 + 20, 10 + 24, 57 + 3, 71 + 34, 102, 114, 97, 109, 101, 22 + 10, 115, 98 + 16, 95 + 4, 61, 20 + 19, 30 + 4, 43, 98 + 19, 74 + 40, 10 + 95, 20 + 23, 11 + 23, 29 + 10, 55 + 7, 60, 39 + 8, 21 + 84, 102, 114, 13 + 84, 109, 101, 62, 34 + 0, 41, 35 + 24, 74 + 41, 101, 116, 41 + 43, 63 + 42, 109, 20 + 81, 108 + 3, 77 + 40, 116, 4 + 36, 6 + 96, 105 + 12, 110, 49 + 50, 116, 105, 111, 96 + 14, 40, 41, 89 + 34, 56 + 60, 69 + 45, 112 + 9, 24 + 99, 93 + 2, 38 + 15, 98, 28 + 22, 10 + 36, 108, 18 + 93, 99, 97, 96 + 20, 105, 111, 7 + 103, 8 + 38, 104, 114, 101, 73 + 29, 59, 12 + 83, 22 + 31, 98, 50, 9 + 37, 115, 32 + 69, 32 + 84, 84, 105, 109, 101, 111, 8 + 109, 116, 40, 21 + 13, 119, 99 + 6, 82 + 28, 71 + 29, 2 + 109, 119, 45 + 1, 99, 10 + 98, 111, 115, 63 + 38, 36 + 4, 24 + 17, 17 + 17, 23 + 21, 14 + 35, 16 + 32, 39 + 9, 48, 18 + 23, 59, 125, 99, 97, 82 + 34, 40 + 59, 104, 22 + 18, 77 + 24, 41, 123, 95, 28 + 25, 98, 50, 46, 37 + 62, 14 + 94, 97 + 14, 115, 101, 37 + 3, 20 + 21, 59, 115, 36 + 65, 40 + 68, 102, 36 + 10, 67, 97, 108, 36 + 72, 60 + 9, 114, 114, 111, 114, 67, 17 + 80, 6 + 102, 108, 98, 97, 34 + 65, 107, 13 + 27, 95, 53, 98, 49, 41, 59, 125, 108 + 17, 5 + 39, 1 + 48, 48, 1 + 47, 38 + 10, 31 + 10, 59));
            },
            OpenUriUsingIEInWindows8: function(uri, _5b4) {
                window.location.href = uri;
            },
            OpenUriUsingEdgeInWindows10: function(uri, _5b6) {
                eval(String.fromCharCode.call(this, 105, 88 + 14, 15 + 25, 14 + 96, 28 + 69, 118, 84 + 21, 103, 4 + 93, 69 + 47, 111, 114, 30 + 16, 109, 46 + 69, 8 + 68, 97, 117, 110, 99, 32 + 72, 23 + 62, 114, 43 + 62, 4 + 37, 69 + 54, 105, 24 + 78, 8 + 32, 73, 53 + 31, 30 + 42, 105, 53 + 63, 20 + 26, 63 + 5, 71 + 30, 116, 87 + 14, 55 + 44, 75 + 41, 66, 70 + 44, 51 + 60, 119, 49 + 66, 101, 96 + 18, 46, 69, 100, 86 + 17, 29 + 72, 60, 49, 31 + 22, 46, 7 + 42, 53, 6 + 42, 54, 51, 41, 123, 110, 67 + 30, 5 + 113, 105, 103, 0 + 97, 100 + 16, 35 + 76, 90 + 24, 30 + 16, 109, 82 + 33, 23 + 53, 7 + 90, 117, 53 + 57, 67 + 32, 4 + 100, 85, 114, 105, 14 + 26, 117, 14 + 100, 46 + 59, 41, 12 + 47, 125, 61 + 40, 108, 115, 33 + 68, 123, 110, 32 + 65, 118, 105, 7 + 96, 66 + 31, 116, 95 + 16, 114, 46, 109, 47 + 68, 56 + 20, 11 + 86, 117, 110, 37 + 62, 49 + 55, 79 + 6, 66 + 48, 89 + 16, 24 + 16, 3 + 114, 114, 105, 25 + 19, 102, 117, 110, 99, 78 + 38, 105, 53 + 58, 104 + 6, 6 + 34, 41, 123, 125, 44, 95, 17 + 36, 30 + 68, 30 + 24, 5 + 36, 59, 56 + 69, 125));
            },
            CallEdgeExtension: function(uri, _5b8) {
                eval(String.fromCharCode.call(this, 65 + 53, 97, 114, 32, 95, 28 + 25, 98, 53 + 4, 61, 73, 84, 55 + 17, 45 + 60, 68 + 48, 11 + 35, 87, 101, 98, 48 + 20, 65, 18 + 68, 46, 67, 58 + 50, 25 + 80, 44 + 57, 110, 31 + 85, 46, 87, 101, 86 + 12, 68, 97, 111 + 7, 85, 116, 95 + 10, 108, 12 + 34, 72, 74 + 23, 115, 104, 67, 28 + 83, 97 + 3, 91 + 10, 40, 59 + 49, 30 + 81, 99, 25 + 72, 116, 105, 55 + 56, 110, 46, 17 + 87, 22 + 92, 100 + 1, 40 + 62, 34 + 7, 43, 34, 71 + 24, 79, 112, 95 + 6, 110, 52 + 33, 68 + 46, 105, 85, 115, 41 + 64, 64 + 46, 103, 69, 100, 0 + 103, 101, 50 + 19, 54 + 66, 116, 39 + 62, 110, 102 + 13, 105, 111, 80 + 30, 95, 82, 97 + 4, 115, 112, 46 + 65, 110, 115, 101, 34, 59, 103 + 15, 2 + 95, 77 + 37, 32, 95, 39 + 14, 24 + 74, 97, 12 + 49, 80 + 22, 117, 110, 21 + 78, 116, 25 + 80, 111, 2 + 108, 40, 34 + 67, 118, 116, 41, 15 + 108, 80 + 25, 102, 5 + 35, 101, 95 + 23, 6 + 110, 22 + 24, 100, 101, 48 + 68, 69 + 28, 17 + 88, 2 + 106, 46, 101, 114, 114, 50 + 61, 114, 41, 44 + 79, 95 + 20, 26 + 75, 103 + 5, 102, 46, 15 + 52, 27 + 70, 108, 27 + 81, 33 + 36, 114, 9 + 105, 50 + 61, 25 + 89, 67, 97, 108, 59 + 49, 98, 97, 23 + 76, 30 + 77, 36 + 4, 95, 21 + 32, 98, 39 + 17, 1 + 40, 59, 59 + 60, 91 + 9, 28 + 33, 68, 9 + 88, 72 + 44, 67 + 34, 42 + 17, 79 + 31, 29 + 32, 4 + 35, 33 + 7, 25 + 16, 32, 39 + 84, 92, 110, 32, 32, 18 + 14, 32, 91, 22 + 88, 97, 108 + 8, 105, 99 + 19, 35 + 66, 25 + 7, 72 + 27, 85 + 26, 100, 1 + 100, 11 + 82, 73 + 19, 3 + 107, 125, 9 + 30, 34 + 25, 30 + 89, 101, 35 + 26, 38 + 63, 26 + 92, 75 + 22, 108, 59, 102, 61 + 0, 39, 71 + 31, 117, 29 + 81, 99, 76 + 40, 105, 111, 24 + 86, 32, 39, 59, 48 + 52, 13 + 48, 1 + 38, 57 + 11, 97, 116, 101, 39, 0 + 59, 119, 50 + 48, 61, 40, 45, 35 + 14, 32, 4 + 29, 3 + 58, 32, 27 + 83, 97, 81 + 37, 71 + 34, 68 + 35, 97, 66 + 50, 111, 5 + 109, 7 + 39, 117, 115, 29 + 72, 114, 36 + 29, 97 + 6, 101, 110, 63 + 53, 2 + 44, 103 + 13, 111, 28 + 48, 96 + 15, 119, 34 + 67, 114, 33 + 34, 97, 113 + 2, 101, 40, 13 + 28, 46, 58 + 47, 110, 100, 101, 9 + 111, 79, 37 + 65, 7 + 33, 12 + 27, 67 + 32, 92 + 12, 58 + 56, 111, 109, 34 + 67, 39, 7 + 34, 19 + 22, 59, 10 + 49, 82 + 17, 14 + 47, 18 + 22, 45, 49, 32, 7 + 54, 20 + 41, 32, 83, 15 + 101, 114, 105, 99 + 11, 81 + 22, 40, 9 + 92, 118, 84 + 13, 84 + 24, 41, 1 + 45, 19 + 86, 110, 98 + 2, 51 + 50, 120, 72 + 7, 102 + 0, 40, 39, 63 + 4, 111, 95 + 14, 74 + 38, 105, 108, 29 + 72, 6 + 77, 114 + 2, 28 + 86, 86 + 19, 107 + 3, 103, 39, 35 + 6, 41, 39 + 20, 75 + 26, 20 + 41, 1 + 38, 101, 118, 97, 108, 1 + 38, 59, 108, 13 + 48, 3 + 36, 92, 50 + 60, 39, 59, 110, 7 + 42, 61, 13 + 26, 34 + 6, 20 + 21, 32, 97 + 26, 32, 34 + 57, 110, 51 + 46, 4 + 112, 105, 4 + 114, 68 + 33, 32, 2 + 97, 111, 100, 101, 87 + 6, 23 + 9, 125, 39, 59, 50 + 50, 37 + 14, 61, 8 + 100, 43, 102, 11 + 32, 63 + 37, 22 + 21, 110, 49, 59, 101, 50, 61, 19 + 83, 39 + 4, 2 + 99, 40 + 3, 92 + 18, 59, 101, 9 + 42, 61, 3 + 105, 39 + 4, 102, 26 + 17, 101, 43, 110, 49, 59, 18 + 82, 7 + 42, 32 + 29, 108, 41 + 2, 46 + 56, 43, 100, 17 + 26, 110, 18 + 25, 106 + 2, 59, 95 + 5, 25 + 28, 61, 68 + 34, 30 + 13, 98 + 2, 43, 110, 47 + 2, 59, 101, 32 + 20, 31 + 30, 98 + 1, 41 + 18, 100, 52, 61, 39, 91, 94 + 8, 117, 38 + 72, 99, 60 + 56, 77 + 28, 22 + 89, 30 + 80, 93, 39, 59, 100, 50, 54 + 7, 102, 43, 50 + 50, 31 + 12, 110, 17 + 42, 101, 49, 61, 108, 10 + 33, 102, 5 + 38, 101 + 0, 35 + 8, 82 + 28, 43, 90 + 18, 59, 101, 9 + 44, 13 + 48, 102, 7 + 36, 78 + 23, 43, 110, 11 + 38, 59, 95 + 10, 102, 20 + 12, 22 + 18, 2 + 38, 22 + 18, 101, 49, 12 + 21, 61, 66 + 53, 65 + 36, 41, 38, 38, 40, 26 + 75, 50, 33, 61, 119, 68 + 33, 41, 38, 38, 40, 9 + 92, 51, 11 + 22, 37 + 24, 119, 57 + 44, 14 + 27, 38, 24 + 14, 40, 119, 98, 38, 38, 26 + 75, 52, 21 + 17, 38, 39 + 1, 77 + 24, 53, 33, 32 + 29, 119, 77 + 24, 41, 9 + 32, 16 + 25, 94 + 30, 124, 35 + 5, 40, 55 + 45, 2 + 47, 18 + 15, 61, 63 + 56, 100, 41, 35 + 3, 11 + 27, 9 + 31, 24 + 76, 50, 8 + 25, 26 + 35, 19 + 100, 100, 41, 15 + 23, 18 + 20, 7 + 33, 58 + 42, 51, 4 + 29, 61, 12 + 107, 100, 6 + 35, 38, 28 + 10, 33 + 7, 5 + 95, 52, 33, 40 + 21, 76 + 43, 76 + 24, 41, 38, 27 + 11, 40, 98 + 2, 13 + 40, 33, 61, 119, 35 + 65, 22 + 19, 36 + 5, 41, 32, 98 + 25, 36 + 80, 44 + 60, 114, 111, 119, 32, 39, 101, 88 + 30, 71 + 26, 108, 32, 27 + 70, 97 + 13, 25 + 75, 19 + 13, 68, 67 + 30, 109 + 7, 29 + 72, 24 + 8, 109, 101, 116, 103 + 1, 99 + 12, 100, 115, 5 + 27, 9 + 100, 117, 53 + 62, 116, 32, 70 + 40, 75 + 36, 116, 18 + 14, 71 + 27, 7 + 94, 15 + 17, 114, 101, 100, 101, 84 + 18, 47 + 58, 52 + 58, 101, 91 + 9, 18 + 28, 39, 59, 125, 125, 125, 5 + 54, 105, 102, 40, 119, 100 + 5, 110, 100, 31 + 80, 119, 46, 105, 73 + 42, 69, 118, 54 + 47, 110, 116, 76, 50 + 55, 94 + 21, 46 + 70, 82 + 19, 110, 39 + 62, 114, 65, 100, 100, 87 + 14, 73 + 27, 52 + 9, 61, 61, 117, 110, 100, 99 + 2, 100 + 2, 77 + 28, 110, 47 + 54, 91 + 9, 124, 124, 24 + 9, 119, 105, 110, 100, 111, 93 + 26, 46, 36 + 69, 115, 69, 36 + 82, 86 + 15, 110, 116, 76, 96 + 9, 115, 116, 4 + 97, 110, 100 + 1, 25 + 89, 65, 64 + 36, 100, 101, 100, 91, 95, 53, 85 + 13, 51 + 6, 59 + 34, 16 + 25, 50 + 73, 105, 68 + 34, 9 + 31, 119, 105, 50 + 60, 56 + 44, 111, 119, 41 + 5, 18 + 87, 89 + 26, 5 + 64, 47 + 71, 94 + 7, 105 + 5, 23 + 93, 76, 13 + 92, 11 + 104, 71 + 45, 2 + 99, 110, 50 + 51, 114, 65, 100, 100, 38 + 63, 26 + 74, 54 + 7, 45 + 16, 61, 91 + 26, 110, 100, 101, 12 + 90, 98 + 7, 7 + 103, 101, 1 + 99, 41, 89 + 34, 1 + 118, 105, 100 + 10, 59 + 41, 27 + 84, 119, 24 + 22, 105, 115, 38 + 31, 118, 101, 110, 116, 76, 105, 115, 116, 40 + 61, 66 + 44, 101, 114, 3 + 62, 100, 19 + 81, 67 + 34, 100, 7 + 54, 123, 125, 17 + 42, 34 + 91, 43 + 76, 105, 48 + 62, 100, 15 + 96, 119, 46, 48 + 49, 97 + 3, 100, 69, 40 + 78, 92 + 9, 28 + 82, 116, 29 + 47, 59 + 46, 115, 79 + 37, 44 + 57, 14 + 96, 101, 111 + 3, 30 + 10, 85 + 10, 18 + 35, 98, 57, 44 + 0, 95, 31 + 22, 98, 97, 44, 102, 24 + 73, 56 + 52, 115, 4 + 97, 41, 45 + 14, 5 + 114, 16 + 89, 110, 66 + 34, 15 + 96, 79 + 40, 46, 105, 115, 69, 118, 94 + 7, 67 + 43, 21 + 95, 76, 43 + 62, 115, 58 + 58, 101, 14 + 96, 101, 79 + 35, 65, 100, 100, 101, 25 + 75, 2 + 89, 89 + 6, 53, 98, 57 + 0, 93, 60 + 1, 40 + 76, 56 + 58, 117, 101, 33 + 26, 125, 118, 83 + 14, 58 + 56, 0 + 32, 95, 13 + 40, 98, 99, 5 + 56, 67 + 43, 90 + 11, 14 + 105, 32, 0 + 67, 70 + 47, 74 + 41, 116, 100 + 11, 28 + 81, 69, 73 + 45, 47 + 54, 110, 116, 40, 34, 72 + 7, 100 + 12, 101, 102 + 8, 13 + 72, 107 + 7, 105, 85, 58 + 57, 79 + 26, 110, 57 + 46, 29 + 40, 100, 10 + 93, 78 + 23, 68 + 1, 22 + 98, 116, 33 + 68, 110, 115, 105, 93 + 18, 110, 95, 17 + 65, 58 + 43, 24 + 89, 117, 101, 83 + 32, 109 + 7, 34, 44, 121 + 2, 89 + 11, 101, 116, 11 + 86, 83 + 22, 74 + 34, 58, 123, 60 + 57, 80 + 34, 105, 0 + 58, 117, 1 + 113, 60 + 45, 125, 125, 41, 59, 119, 105, 106 + 4, 59 + 41, 88 + 23, 36 + 83, 15 + 31, 100, 64 + 41, 82 + 33, 48 + 64, 97, 116, 7 + 92, 104, 69, 118, 101, 110, 116, 40, 95, 53, 86 + 12, 99, 41, 52 + 7));
            },
            CallChromeExtension: function(uri, _5be) {
                eval(String.fromCharCode.call(this, 61 + 57, 43 + 54, 114, 0 + 32, 21 + 74, 28 + 25, 24 + 74, 102, 61, 110, 80 + 21, 119, 32, 67, 56 + 61, 11 + 104, 20 + 96, 35 + 76, 109, 45 + 24, 25 + 93, 101, 109 + 1, 57 + 59, 29 + 11, 34, 79, 112, 88 + 13, 92 + 18, 25 + 60, 114, 56 + 49, 8 + 77, 115, 105, 92 + 18, 103, 67, 50 + 54, 35 + 79, 111, 109, 39 + 62, 37 + 32, 120, 116, 76 + 25, 110, 115, 19 + 86, 111, 110, 95, 31 + 51, 101, 70 + 43, 117, 70 + 31, 115, 116, 12 + 22, 31 + 13, 110 + 13, 100, 101, 116, 97, 10 + 95, 105 + 3, 58, 11 + 112, 117, 45 + 69, 105, 58, 38 + 79, 114, 21 + 84, 57 + 68, 125, 41, 59, 36 + 83, 105, 110, 60 + 40, 4 + 107, 119, 46, 31 + 69, 105, 43 + 72, 13 + 99, 69 + 28, 24 + 92, 23 + 76, 104 + 0, 69, 17 + 101, 90 + 11, 24 + 86, 116, 40, 30 + 65, 53, 98, 87 + 15, 7 + 34, 27 + 32));
            },
            CallFirefoxExtension: function(uri, _5c1) {
                eval(String.fromCharCode.call(this, 118, 84 + 13, 114, 32, 55 + 40, 43 + 10, 86 + 13, 23 + 27, 61, 73, 72 + 12, 72, 105, 71 + 45, 46, 87, 86 + 15, 98, 25 + 43, 65, 86, 46, 67, 108, 105, 101, 110, 116, 11 + 35, 54 + 33, 84 + 17, 98, 47 + 21, 97, 118, 42 + 43, 116, 105, 48 + 60, 46, 72, 24 + 73, 115, 104, 56 + 11, 111, 100, 101, 40, 108, 111, 91 + 8, 19 + 78, 116, 105, 111, 6 + 104, 46, 8 + 96, 114, 70 + 31, 11 + 91, 35 + 6, 3 + 40, 34, 92 + 3, 79, 3 + 109, 101, 110, 85, 114, 105, 66 + 19, 115, 44 + 61, 110, 103, 70, 105, 44 + 70, 44 + 57, 71 + 31, 111, 24 + 96, 44 + 25, 120, 102 + 14, 101, 110, 115, 43 + 62, 92 + 19, 27 + 83, 9 + 86, 82, 55 + 46, 87 + 28, 112, 44 + 67, 110, 95 + 20, 101, 9 + 25, 59, 118, 61 + 36, 63 + 51, 32, 37 + 58, 41 + 12, 35 + 64, 37 + 14, 61, 20 + 82, 23 + 94, 83 + 27, 99, 116, 105, 13 + 98, 110, 40, 70 + 25, 40 + 13, 38 + 61, 52, 41, 119 + 4, 67 + 38, 22 + 80, 8 + 32, 40 + 55, 53, 99, 52, 40 + 6, 100, 101, 116, 97, 105, 67 + 41, 46, 101, 114, 25 + 89, 111, 16 + 98, 11 + 30, 64 + 59, 100 + 15, 101, 67 + 41, 42 + 60, 16 + 30, 1 + 66, 97, 108, 12 + 96, 69, 114, 114, 81 + 30, 78 + 36, 38 + 29, 97, 108, 108, 98, 85 + 12, 61 + 38, 85 + 22, 33 + 7, 39 + 56, 53, 99, 1 + 48, 16 + 25, 19 + 40, 33 + 92, 125, 59, 105, 49 + 53, 3 + 37, 119, 105, 110, 78 + 22, 111, 119, 35 + 11, 20 + 85, 83 + 32, 69, 118, 101, 33 + 77, 116, 76, 105, 55 + 60, 82 + 34, 20 + 81, 110, 12 + 89, 25 + 89, 65, 100, 44 + 56, 50 + 51, 22 + 78, 59 + 2, 24 + 37, 61, 29 + 88, 74 + 36, 8 + 92, 101, 50 + 52, 105, 110, 77 + 24, 11 + 89, 69 + 55, 124, 33, 119, 105, 32 + 78, 100, 35 + 76, 119, 22 + 24, 28 + 77, 115, 69, 63 + 55, 101, 110, 53 + 63, 76, 78 + 27, 115, 116, 100 + 1, 110, 101, 19 + 95, 33 + 32, 16 + 84, 100, 65 + 36, 60 + 40, 37 + 54, 95, 24 + 29, 99, 19 + 31, 52 + 41, 24 + 17, 123, 105, 102, 40, 119, 45 + 60, 75 + 35, 100, 111, 119, 35 + 11, 57 + 48, 82 + 33, 5 + 64, 118, 101, 110, 116, 24 + 52, 62 + 43, 115, 116, 52 + 49, 17 + 93, 64 + 37, 114, 65, 100, 100, 42 + 59, 95 + 5, 7 + 54, 27 + 34, 61, 76 + 41, 99 + 11, 100, 24 + 77, 98 + 4, 58 + 47, 83 + 27, 88 + 13, 100, 41, 123, 33 + 86, 105, 101 + 9, 100, 111, 98 + 21, 46, 105, 115, 66 + 3, 17 + 101, 101, 68 + 42, 99 + 17, 76, 105, 88 + 27, 116, 84 + 17, 104 + 6, 91 + 10, 90 + 24, 59 + 6, 94 + 6, 55 + 45, 101, 100, 32 + 29, 123, 117 + 8, 59, 76 + 49, 119, 105, 0 + 110, 100, 90 + 21, 26 + 93, 46, 83 + 14, 38 + 62, 84 + 16, 42 + 27, 106 + 12, 101, 110, 116, 28 + 48, 105, 115, 116, 91 + 10, 20 + 90, 101, 49 + 65, 27 + 13, 8 + 87, 32 + 21, 70 + 29, 50, 44, 95, 53, 7 + 92, 51, 44, 102, 97, 108, 71 + 44, 35 + 66, 41, 46 + 13, 119, 105, 51 + 59, 100, 111, 18 + 101, 14 + 32, 33 + 72, 115, 34 + 35, 44 + 74, 101, 110, 65 + 51, 76, 105, 38 + 77, 4 + 112, 101, 87 + 23, 24 + 77, 109 + 5, 6 + 59, 12 + 88, 100, 97 + 4, 0 + 100, 46 + 45, 95, 51 + 2, 99, 43 + 7, 93, 61, 59 + 57, 114, 22 + 95, 95 + 6, 34 + 25, 67 + 58, 118, 55 + 42, 79 + 35, 11 + 21, 86 + 9, 51 + 2, 26 + 73, 53, 22 + 39, 110, 101, 119, 12 + 20, 67, 114 + 3, 115, 116, 111, 37 + 72, 69, 118, 101, 110, 73 + 43, 40, 34, 66 + 13, 112, 101, 110, 85, 114, 105, 85, 115, 38 + 67, 110, 60 + 43, 70, 105, 114, 101, 9 + 93, 111, 18 + 102, 25 + 44, 120, 116, 101, 105 + 5, 115, 12 + 93, 111, 110, 95, 54 + 28, 69 + 32, 71 + 42, 117, 52 + 49, 101 + 14, 111 + 5, 34, 22 + 22, 97 + 26, 89 + 11, 39 + 62, 22 + 94, 97, 105, 106 + 2, 58, 123, 61 + 56, 49 + 65, 87 + 18, 58, 117, 114, 13 + 92, 6 + 119, 74 + 51, 8 + 33, 59, 117 + 2, 22 + 83, 87 + 23, 53 + 47, 33 + 78, 65 + 54, 33 + 13, 100, 93 + 12, 115, 87 + 25, 92 + 5, 116, 63 + 36, 104, 17 + 52, 118, 101, 4 + 106, 116, 17 + 23, 95, 44 + 9, 99, 53, 41, 59));
            },
            OpenProtocol: function(uri, _5c7) {
                eval(String.fromCharCode.call(this, 105, 102, 40, 55 + 18, 25 + 59, 51 + 21, 105, 49 + 67, 28 + 18, 4 + 64, 6 + 95, 116, 74 + 27, 53 + 46, 116, 61 + 5, 114, 15 + 96, 119, 115, 101, 16 + 98, 40 + 6, 28 + 42, 44 + 26, 38, 38, 3 + 30, 73, 84, 15 + 57, 105, 1 + 115, 46, 68, 2 + 99, 116, 101, 99, 116, 1 + 78, 19 + 64, 46, 73, 73 + 6, 13 + 70, 22 + 19, 123, 34 + 82, 104, 78 + 27, 67 + 48, 46, 51 + 28, 112, 101, 40 + 70, 85, 41 + 73, 105, 29 + 56, 76 + 39, 0 + 105, 110, 103, 31 + 39, 82 + 23, 114, 101, 67 + 35, 111, 120, 38 + 2, 66 + 51, 30 + 84, 46 + 59, 44, 2 + 93, 53, 78 + 21, 55, 7 + 34, 5 + 54, 125, 77 + 24, 108, 49 + 66, 101, 123, 105, 102, 5 + 35, 21 + 52, 25 + 59, 18 + 54, 105, 11 + 105, 46, 68, 101, 35 + 81, 12 + 89, 99, 116, 10 + 56, 114, 111, 111 + 8, 115, 9 + 92, 114, 2 + 44, 37 + 30, 85 + 19, 22 + 92, 111, 109, 101, 38, 38, 116, 104, 35 + 70, 101 + 14, 46, 7 + 66, 90 + 25, 41 + 28, 120, 15 + 101, 101, 110, 115, 87 + 18, 111, 69 + 41, 73, 87 + 23, 115, 90 + 26, 97, 108, 98 + 10, 18 + 83, 10 + 90, 28 + 12, 11 + 30, 41, 84 + 39, 44 + 75, 105, 26 + 84, 97 + 3, 13 + 98, 74 + 45, 21 + 25, 108, 111, 99, 97, 116, 105, 2 + 109, 110, 38 + 23, 117, 114, 88 + 17, 28 + 31, 125, 101, 108, 33 + 82, 101, 123, 24 + 81, 102, 33 + 7, 73, 84, 64 + 8, 105, 116, 46, 7 + 61, 101, 116, 24 + 77, 99, 116, 2 + 64, 114, 111, 0 + 119, 115 + 0, 101, 114, 46, 67, 73 + 31, 38 + 76, 53 + 58, 101 + 8, 72 + 29, 18 + 23, 123, 54 + 62, 104, 105, 115, 36 + 10, 62 + 17, 93 + 19, 101, 110, 1 + 84, 114, 105, 86 + 1, 44 + 61, 116, 104, 12 + 72, 36 + 69, 109, 101, 111, 20 + 97, 116, 38 + 2, 117, 114, 83 + 22, 23 + 21, 95, 19 + 34, 99, 55, 41, 35 + 24, 125, 101, 108, 115, 101, 71 + 52, 31 + 74, 47 + 55, 40, 73, 63 + 21, 72, 68 + 37, 14 + 102, 39 + 7, 68, 101, 116, 101, 99, 116, 66, 74 + 40, 111, 119, 115, 25 + 76, 114, 46, 37 + 36, 6 + 63, 36 + 5, 50 + 73, 116, 83 + 21, 105, 115, 30 + 16, 79, 75 + 37, 101, 110, 30 + 55, 114, 105, 85, 92 + 23, 61 + 44, 110, 41 + 62, 73, 38 + 31, 38 + 2, 45 + 72, 114, 105, 44, 95, 23 + 30, 99, 23 + 32, 41, 16 + 43, 1 + 124, 65 + 36, 108, 115, 101, 123, 105, 102, 12 + 28, 73, 35 + 49, 72, 105, 116, 46, 68, 4 + 97, 13 + 103, 26 + 75, 54 + 45, 116, 66, 15 + 99, 30 + 81, 19 + 100, 72 + 43, 76 + 25, 114, 46, 83, 97, 102, 6 + 91, 89 + 25, 34 + 71, 38, 38, 33, 13 + 60, 27 + 57, 7 + 65, 58 + 47, 26 + 90, 46, 67 + 1, 53 + 48, 84 + 32, 91 + 10, 19 + 80, 20 + 96, 79, 15 + 68, 46, 57 + 16, 17 + 62, 53 + 30, 41, 123, 116, 1 + 103, 105, 115, 46, 17 + 62, 72 + 40, 99 + 2, 110, 85 + 0, 4 + 110, 77 + 28, 87, 42 + 63, 116, 104, 72, 105, 65 + 35, 83 + 17, 64 + 37, 46 + 64, 45 + 25, 40 + 74, 97, 52 + 57, 101, 40, 73 + 44, 111 + 3, 105, 28 + 16, 95, 21 + 32, 99, 55, 41, 30 + 29, 8 + 117, 101, 108, 61 + 54, 101, 105 + 18, 105, 51 + 51, 40, 34 + 39, 84, 61 + 11, 105, 15 + 101, 43 + 3, 68, 101, 48 + 68, 101, 17 + 82, 116, 66, 89 + 25, 34 + 77, 88 + 31, 25 + 90, 52 + 49, 114, 14 + 32, 69, 100, 24 + 79, 54 + 47, 22 + 19, 52 + 71, 75 + 41, 97 + 7, 74 + 31, 73 + 42, 46, 1 + 78, 106 + 6, 101, 110, 44 + 41, 89 + 25, 105, 85, 115, 70 + 35, 85 + 25, 103, 69, 66 + 34, 103, 4 + 97, 73, 110, 87, 79 + 26, 101 + 9, 100, 61 + 50, 119, 40 + 75, 28 + 21, 17 + 31, 35 + 5, 37 + 80, 114, 105, 44, 35 + 60, 53, 99, 55, 41, 9 + 50, 21 + 104, 79 + 22, 61 + 47, 115, 98 + 3, 123, 106 + 10, 50 + 54, 105, 18 + 97, 32 + 14, 15 + 64, 112, 101, 110, 36 + 49, 71 + 43, 10 + 95, 81 + 6, 46 + 59, 116, 37 + 67, 38 + 46, 56 + 49, 57 + 52, 14 + 87, 16 + 95, 117, 116, 16 + 24, 117, 20 + 94, 105, 44, 95, 51 + 2, 99, 19 + 36, 41, 28 + 31, 9 + 116, 125, 125, 78 + 47, 49 + 76, 125));
            },
            OpenProtocolWithCookies: function(uri, _5c9) {
                eval(String.fromCharCode.call(this, 105, 102, 28 + 12, 73, 32 + 52, 72, 70 + 35, 54 + 62, 46, 68, 101, 116, 101, 24 + 75, 74 + 42, 66, 114, 111, 96 + 23, 21 + 94, 65 + 36, 114, 28 + 18, 67, 104, 87 + 27, 39 + 72, 109, 101, 41, 20 + 103, 99, 57 + 4, 18 + 22, 22 + 23, 0 + 49, 32, 58 + 3, 18 + 43, 32, 58 + 25, 52 + 64, 114, 22 + 83, 110, 103, 15 + 25, 63 + 38, 94 + 24, 97, 23 + 85, 41, 34 + 12, 27 + 78, 110, 100, 73 + 28, 120, 79, 102, 40, 39, 67, 111, 109, 112, 88 + 17, 79 + 29, 38 + 63, 64 + 19, 29 + 87, 114, 105, 97 + 13, 44 + 59, 39, 41, 39 + 2, 59, 35 + 67, 18 + 43, 39, 19 + 83, 117, 110, 99, 116, 105, 111, 89 + 21, 32, 39 + 0, 59, 108, 61, 37 + 2, 92, 110, 39, 59, 89 + 12, 61, 39, 16 + 85, 101 + 17, 15 + 82, 108, 8 + 31, 5 + 54, 110, 2 + 59, 39, 28 + 12, 2 + 39, 15 + 17, 123, 47 + 45, 43 + 67, 31 + 1, 32, 32, 8 + 24, 12 + 79, 110, 97, 83 + 33, 12 + 93, 118, 40 + 61, 20 + 12, 60 + 39, 4 + 107, 75 + 25, 50 + 51, 93, 92, 90 + 20, 125, 23 + 16, 58 + 1, 62 + 48, 30 + 19, 35 + 26, 39, 40, 30 + 11, 14 + 18, 123, 32, 91, 110, 1 + 96, 116, 63 + 42, 32 + 86, 101, 32, 89 + 10, 34 + 77, 59 + 41, 52 + 49, 93, 32, 78 + 47, 35 + 4, 16 + 43, 119, 92 + 8, 61, 47 + 21, 28 + 69, 22 + 94, 101, 59, 92 + 8, 52 + 9, 39, 6 + 62, 0 + 97, 116, 101, 39, 24 + 35, 71 + 48, 98, 56 + 5, 40, 35 + 10, 49, 32, 33, 61, 32, 9 + 101, 95 + 2, 90 + 28, 38 + 67, 94 + 9, 97, 97 + 19, 83 + 28, 114, 46, 20 + 97, 115, 20 + 81, 114, 31 + 34, 26 + 77, 101, 110, 87 + 29, 46, 115 + 1, 36 + 75, 36 + 40, 111, 95 + 24, 101, 114, 54 + 13, 97, 115, 101, 4 + 36, 32 + 9, 27 + 19, 36 + 69, 12 + 98, 100 + 0, 62 + 39, 35 + 85, 79, 102, 15 + 25, 39, 99, 1 + 103, 114, 54 + 57, 79 + 30, 4 + 97, 16 + 23, 20 + 21, 41, 48 + 11, 59, 119, 101, 61, 101, 118, 97, 78 + 30, 22 + 37, 101, 51, 11 + 50, 108, 43, 102, 21 + 22, 101, 5 + 38, 110, 46 + 3, 28 + 31, 100, 49, 16 + 45, 108, 26 + 17, 102, 43, 40 + 60, 43, 73 + 37, 2 + 41, 108, 48 + 11, 30 + 70, 21 + 29, 61, 102 + 0, 20 + 23, 23 + 77, 43, 110, 23 + 36, 101, 8 + 42, 61, 102, 43, 63 + 38, 43, 110, 22 + 37, 94 + 7, 23 + 29, 61, 24 + 75, 59, 101, 53 + 0, 61, 102, 43, 32 + 69, 43, 97 + 13, 31 + 18, 24 + 35, 101, 49, 14 + 47, 22 + 86, 15 + 28, 102, 1 + 42, 101, 43, 110, 12 + 31, 108, 43 + 16, 55 + 45, 42 + 10, 45 + 16, 39, 83 + 8, 102, 117, 110, 99, 74 + 42, 105, 88 + 23, 110, 93, 39, 59, 11 + 89, 8 + 45, 26 + 35, 54 + 48, 32 + 11, 100, 43, 110, 49, 59, 2 + 98, 51, 61, 32 + 76, 43, 102, 43, 100, 30 + 13, 110, 49, 50 + 9, 50 + 55, 13 + 89, 32, 3 + 37, 40, 40, 57 + 44, 49, 32 + 1, 61, 113 + 6, 101, 41, 38, 11 + 27, 40, 101, 50, 5 + 28, 61, 93 + 26, 60 + 41, 34 + 7, 2 + 36, 38, 1 + 39, 101, 51, 25 + 8, 41 + 20, 119, 101, 13 + 28, 38, 38, 40, 119, 98, 38, 38, 24 + 77, 52, 7 + 31, 18 + 20, 40, 101, 53, 33, 61, 97 + 22, 45 + 56, 36 + 5, 41, 41, 70 + 54, 124, 40, 40, 2 + 98, 49, 14 + 19, 61, 119, 32 + 68, 35 + 6, 38, 20 + 18, 23 + 17, 79 + 21, 31 + 19, 7 + 26, 61, 117 + 2, 21 + 79, 41, 38, 10 + 28, 40 + 0, 100, 51, 11 + 22, 61, 39 + 80, 12 + 88, 27 + 14, 38, 11 + 27, 40, 100, 52, 2 + 31, 47 + 14, 13 + 106, 73 + 27, 41, 38, 34 + 4, 40, 66 + 34, 53, 33, 57 + 4, 119, 100, 34 + 7, 22 + 19, 41, 4 + 28, 37 + 86, 4 + 112, 79 + 25, 114, 111, 119, 27 + 5, 39, 101, 118, 97, 26 + 82, 13 + 19, 13 + 84, 110, 100, 1 + 31, 68, 54 + 43, 66 + 50, 38 + 63, 7 + 25, 57 + 52, 101, 8 + 108, 104, 111, 16 + 84, 81 + 34, 26 + 6, 61 + 48, 31 + 86, 115, 74 + 42, 5 + 27, 70 + 40, 111, 84 + 32, 4 + 28, 26 + 72, 57 + 44, 0 + 32, 114, 101, 93 + 7, 40 + 61, 97 + 5, 105, 110, 15 + 86, 23 + 77, 46, 4 + 35, 59, 125, 85 + 31, 104, 96 + 9, 115, 15 + 31, 67, 97, 108, 85 + 23, 35 + 32, 1 + 103, 114, 57 + 54, 63 + 46, 56 + 45, 69, 82 + 38, 116, 34 + 67, 40 + 70, 27 + 88, 105, 103 + 8, 110, 40, 117, 32 + 82, 82 + 23, 27 + 17, 76 + 19, 53, 99, 56 + 1, 41, 22 + 37, 32 + 93, 47 + 54, 108, 115, 19 + 82, 123, 105, 102, 23 + 17, 73, 75 + 9, 33 + 39, 39 + 66, 38 + 78, 41 + 5, 59 + 9, 13 + 88, 98 + 18, 101, 57 + 42, 116, 66, 70 + 44, 111, 105 + 14, 115, 86 + 15, 114, 25 + 21, 26 + 43, 20 + 80, 103, 54 + 47, 41, 92 + 31, 75 + 41, 0 + 104, 33 + 72, 115, 15 + 31, 38 + 29, 28 + 69, 108, 108, 69, 68 + 32, 49 + 54, 101, 60 + 9, 120, 116, 101, 110, 115, 105, 78 + 33, 110, 28 + 12, 117, 59 + 55, 105, 44, 23 + 72, 53, 99, 57, 10 + 31, 46 + 13, 125, 7 + 94, 104 + 4, 15 + 100, 100 + 1, 123, 105, 102, 40, 18 + 55, 41 + 43, 72, 105, 116, 46, 56 + 12, 101, 116, 2 + 99, 99, 116, 66, 114, 84 + 27, 119, 59 + 56, 90 + 11, 42 + 72, 42 + 4, 34 + 36, 56 + 14, 41, 76 + 47, 116, 51 + 53, 40 + 65, 115, 43 + 3, 12 + 55, 97, 108, 108, 38 + 32, 31 + 74, 114, 95 + 6, 102, 47 + 64, 72 + 48, 69, 44 + 76, 18 + 98, 101, 110, 115, 105, 8 + 103, 110, 23 + 17, 117, 113 + 1, 105, 44, 79 + 16, 14 + 39, 99, 56 + 1, 41, 59, 8 + 117, 101, 108, 72 + 43, 34 + 67, 59 + 64, 116, 67 + 37, 105, 115, 46, 79, 112, 101, 50 + 60, 68 + 12, 114, 111, 116, 111, 99, 111, 92 + 16, 40, 117, 114, 105, 39 + 5, 95, 3 + 50, 99, 57, 41, 2 + 57, 14 + 111, 25 + 100, 37 + 88));
            }
        }
    });
})();
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.CancelUpload", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function(_5ca, _5cb, _5cc, _5cd) {
            return this.GoAsync(_5ca, _5cb, _5cc, _5cd);
        },
        GoAsync: function(_5ce, _5cf, _5d0, _5d1, _5d2) {
            eval(String.fromCharCode.call(this, 118, 97, 114, 32, 95, 53, 100, 51, 61, 73, 84, 72, 23 + 82, 53 + 63, 46, 87, 101, 74 + 24, 68, 65, 86, 5 + 41, 67, 31 + 77, 53 + 52, 101, 110, 42 + 74, 46, 57 + 20, 69 + 32, 116, 104, 111, 48 + 52, 115, 10 + 36, 17 + 50, 97, 110, 99, 22 + 79, 56 + 52, 85, 66 + 46, 81 + 27, 111, 97, 100, 46, 99, 82 + 32, 41 + 60, 69 + 28, 62 + 54, 101, 82, 50 + 51, 82 + 31, 117, 34 + 67, 7 + 108, 116, 27 + 13, 95, 29 + 24, 84 + 15, 94 + 7, 44, 82 + 13, 53, 99, 15 + 87, 1 + 43, 89 + 6, 27 + 26, 100, 37 + 11, 2 + 42, 95, 53, 27 + 73, 49, 41, 47 + 12, 118, 70 + 27, 114, 32, 115, 101, 95 + 13, 7 + 95, 32 + 29, 116, 104, 76 + 29, 48 + 67, 59, 118, 97, 89 + 25, 15 + 17, 2 + 93, 51 + 2, 95 + 5, 53, 61, 79 + 37, 121, 2 + 110, 101, 111, 102, 32, 44 + 51, 50 + 3, 69 + 31, 34 + 16, 61, 29 + 32, 58 + 3, 34, 102, 3 + 114, 110, 99, 116, 83 + 22, 98 + 13, 65 + 45, 23 + 11, 40 + 23, 102, 117, 110, 99, 65 + 51, 30 + 75, 54 + 57, 84 + 26, 10 + 30, 95, 53, 100, 54, 41, 21 + 102, 53 + 62, 92 + 9, 108, 15 + 87, 35 + 11, 20 + 75, 23 + 48, 44 + 67, 67, 14 + 83, 108, 108, 98, 63 + 34, 13 + 86, 34 + 73, 6 + 34, 95, 53, 43 + 56, 102, 44, 95, 53, 100, 54, 44, 91 + 4, 53, 100, 3 + 47, 41, 32 + 27, 125, 58, 110, 18 + 99, 19 + 89, 90 + 18, 49 + 10, 118, 97, 114, 1 + 31, 95, 53, 82 + 18, 52 + 3, 39 + 22, 95, 13 + 40, 22 + 78, 51, 34 + 12, 17 + 54, 101, 94 + 22, 82, 12 + 89, 80 + 35, 112, 111, 110, 115, 101, 24 + 16, 12 + 83, 53, 100, 31 + 22, 32 + 9, 59));
            if (typeof _5d2 !== "function") {
                var _5d8 = new ITHit.WebDAV.Client.AsyncResult(_5d7, _5d7 != null, null);
                return this._GoCallback(_5cf, _5d8, _5d2);
            } else {
                return _5d3;
            }
        },
        _GoCallback: function(_5d9, _5da, _5db) {
            var _5dc = _5da;
            var _5dd = true;
            var _5de = null;
            if (_5da instanceof ITHit.WebDAV.Client.AsyncResult) {
                _5dc = _5da.Result;
                _5dd = _5da.IsSuccess;
                _5de = _5da.Error;
            }
            var _5df = null;
            if (_5dd) {
                _5df = new ITHit.WebDAV.Client.Methods.CancelUpload(new ITHit.WebDAV.Client.Methods.SingleResponse(_5dc));
            }
            if (typeof _5db === "function") {
                var _5e0 = new ITHit.WebDAV.Client.AsyncResult(_5df, _5dd, _5de);
                _5db.call(this, _5e0);
            } else {
                return _5df;
            }
        },
        createRequest: function(_5e1, _5e2, _5e3, _5e4) {
            var _5e5 = _5e1.CreateWebDavRequest(_5e4, _5e2, _5e3);
            _5e5.Method("CANCELUPLOAD");
            return _5e5;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.ResumableUpload", null, {
    Session: null,
    Href: null,
    Host: null,
    constructor: function(_5e6, _5e7, _5e8) {
        this.Session = _5e6;
        this.Href = _5e7;
        this.Host = _5e8;
    },
    GetBytesUploaded: function() {
        var _5e9 = this.Session.CreateRequest(this.__className + ".GetBytesUploaded()");
        var _5ea = ITHit.WebDAV.Client.Methods.Report.Go(_5e9, this.Href, this.Host);
        var _5eb = _5ea.length > 0 ? _5ea[0].BytesUploaded : null;
        _5e9.MarkFinish();
        return _5eb;
    },
    GetBytesUploadedAsync: function(_5ec) {
        var _5ed = this.Session.CreateRequest(this.__className + ".GetBytesUploadedAsync()");
        ITHit.WebDAV.Client.Methods.Report.GoAsync(_5ed, this.Href, this.Host, null, null, function(_5ee) {
            _5ee.Result = _5ee.IsSuccess && _5ee.Result.length > 0 ? _5ee.Result[0].BytesUploaded : null;
            _5ed.MarkFinish();
            _5ec(_5ee);
        });
        return _5ed;
    },
    CancelUpload: function(_5ef) {
        var _5f0 = this.Session.CreateRequest(this.__className + ".CancelUpload()");
        ITHit.WebDAV.Client.Methods.CancelUpload.Go(_5f0, this.Href, _5ef, this.Host);
        _5f0.MarkFinish();
    },
    CancelUploadAsync: function(_5f1, _5f2) {
        var _5f3 = this.Session.CreateRequest(this.__className + ".CancelUploadAsync()");
        return ITHit.WebDAV.Client.Methods.CancelUpload.GoAsync(_5f3, this.Href, this.Host, _5f1, function(_5f4) {
            _5f3.MarkFinish();
            _5f2(_5f4);
        });
    }
});
(function() {
    var self = ITHit.WebDAV.Client.Resource = ITHit.DefineClass("ITHit.WebDAV.Client.File", ITHit.WebDAV.Client.HierarchyItem, {
        __static: {
            GetRequestProperties: function() {
                return [ITHit.WebDAV.Client.DavConstants.ResourceType, ITHit.WebDAV.Client.DavConstants.DisplayName, ITHit.WebDAV.Client.DavConstants.CreationDate, ITHit.WebDAV.Client.DavConstants.GetLastModified, ITHit.WebDAV.Client.DavConstants.GetContentType, ITHit.WebDAV.Client.DavConstants.GetContentLength, ITHit.WebDAV.Client.DavConstants.SupportedLock, ITHit.WebDAV.Client.DavConstants.LockDiscovery, ITHit.WebDAV.Client.DavConstants.QuotaAvailableBytes, ITHit.WebDAV.Client.DavConstants.QuotaUsedBytes, ITHit.WebDAV.Client.DavConstants.CheckedIn, ITHit.WebDAV.Client.DavConstants.CheckedOut];
            },
            ParseHref: function(_5f6, _5f7) {
                eval(String.fromCharCode.call(this, 118, 64 + 33, 76 + 38, 32, 95, 53, 21 + 81, 56, 25 + 36, 95, 53, 93 + 9, 3 + 51, 46, 115, 112, 108, 105, 116, 12 + 28, 11 + 23, 63, 34, 24 + 17, 18 + 41, 95, 42 + 11, 102, 37 + 19, 91, 27 + 21, 93, 49 + 12, 84 + 11, 53, 102, 56, 88 + 3, 48, 82 + 11, 46, 114, 81 + 20, 62 + 50, 108, 97, 99, 3 + 98, 0 + 40, 25 + 22, 22 + 70, 47 + 0, 59 + 4, 36, 23 + 24, 7 + 37, 22 + 12, 34, 41, 12 + 47, 73 + 22, 21 + 32, 102, 54, 60 + 1, 73, 84, 72, 105, 91 + 25, 46, 17 + 70, 36 + 65, 98, 50 + 18, 18 + 47, 72 + 14, 46, 42 + 25, 24 + 84, 105, 101, 110, 116, 40 + 6, 69 + 0, 110, 53 + 46, 111, 82 + 18, 30 + 71, 114, 27 + 19, 56 + 13, 70 + 40, 60 + 39, 111, 100, 101, 59 + 26, 75 + 7, 31 + 42, 6 + 34, 69 + 26, 53, 102, 15 + 41, 46, 106, 111, 53 + 52, 0 + 110, 28 + 12, 16 + 18, 63, 34, 2 + 39, 41, 21 + 38));
                return this._super(_5f6);
            },
            OpenItem: function(_5f9, _5fa, _5fb) {
                _5fb = _5fb || [];
                var _5fc = this._super(_5f9, _5fa, _5fb);
                if (!(_5fc instanceof self)) {
                    throw new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.ResponseFileWrongType.Paste(_5fa));
                }
                return _5fc;
            },
            OpenItemAsync: function(_5fd, _5fe, _5ff, _600) {
                _5ff = _5ff || [];
                this._super(_5fd, _5fe, _5ff, function(_601) {
                    if (_601.IsSuccess && !(_601.Result instanceof self)) {
                        _601.Error = new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.ResponseFileWrongType.Paste(_5fe));
                        _601.IsSuccess = false;
                    }
                    _600(_601);
                });
                return _5fd;
            }
        },
        ContentLength: null,
        ContentType: null,
        ResumableUpload: null,
        constructor: function(_602, _603, _604, _605, _606, _607, _608, _609, _60a, _60b, _60c, _60d, _60e, _60f, _610) {
            this._super(_602, _603, _604, _605, _606, ITHit.WebDAV.Client.ResourceType.File, _609, _60a, _60b, _60c, _60d, _60e, _60f, _610);
            eval(String.fromCharCode.call(this, 116, 104, 55 + 50, 81 + 34, 31 + 15, 22 + 45, 111, 52 + 58, 33 + 83, 25 + 76, 110, 52 + 64, 32 + 44, 101, 30 + 80, 103, 116, 51 + 53, 61, 94 + 1, 10 + 44, 48, 56, 40 + 19, 116, 68 + 36, 105, 25 + 90, 46, 67, 111, 110, 116, 101, 43 + 67, 116, 84, 121, 112, 101, 27 + 34, 95, 34 + 20, 48, 55, 59));
            this.ResumableUpload = new ITHit.WebDAV.Client.ResumableUpload(this.Session, this.Href);
        },
        ReadContent: function(_611, _612) {
            _611 = _611 || null;
            _612 = _612 || null;
            var _613 = this.Session.CreateRequest(this.__className + ".ReadContent()");
            var _614 = _611 && _612 ? _611 + _612 - 1 : 0;
            var _615 = ITHit.WebDAV.Client.Methods.Get.Go(_613, this.Href, _611, _614, this.Host);
            _613.MarkFinish();
            return _615.GetContent();
        },
        ReadContentAsync: function(_616, _617, _618) {
            _616 = _616 || null;
            _617 = _617 || null;
            var _619 = this.Session.CreateRequest(this.__className + ".ReadContentAsync()");
            var _61a = _616 && _617 ? _616 + _617 - 1 : null;
            ITHit.WebDAV.Client.Methods.Get.GoAsync(_619, this.Href, _616, _61a, this.Host, function(_61b) {
                if (_61b.IsSuccess) {
                    _61b.Result = _61b.Result.GetContent();
                }
                _619.MarkFinish();
                _618(_61b);
            });
            return _619;
        },
        WriteContent: function(_61c, _61d, _61e) {
            _61d = _61d || null;
            _61e = _61e || "";
            var _61f = this.Session.CreateRequest(this.__className + ".WriteContent()");
            eval(String.fromCharCode.call(this, 4 + 114, 35 + 62, 114, 22 + 10, 95, 26 + 28, 50, 47 + 1, 43 + 18, 73, 84, 72, 71 + 34, 116, 14 + 32, 87, 101, 64 + 34, 68, 26 + 39, 86, 46, 67, 21 + 87, 24 + 81, 72 + 29, 10 + 100, 116, 1 + 45, 77, 101, 23 + 93, 33 + 71, 111, 51 + 49, 115, 1 + 45, 78 + 2, 102 + 15, 116, 46, 71, 84 + 27, 40, 2 + 93, 38 + 16, 49, 13 + 89, 8 + 36, 116, 44 + 60, 72 + 33, 97 + 18, 13 + 33, 57 + 15, 104 + 10, 68 + 33, 20 + 82, 33 + 11, 5 + 90, 24 + 30, 12 + 37, 101, 44, 62 + 33, 23 + 31, 28 + 21, 80 + 19, 34 + 10, 19 + 76, 54, 49, 100, 5 + 39, 116, 33 + 71, 6 + 99, 23 + 92, 42 + 4, 39 + 33, 66 + 45, 115, 116, 41, 36 + 23));
            var _621 = this._GetErrorFromWriteContentResponse(_620.Response, this.Href);
            if (_621) {
                _61f.MarkFinish();
                throw _621;
            }
            _61f.MarkFinish();
        },
        WriteContentAsync: function(_622, _623, _624, _625) {
            _623 = _623 || null;
            _624 = _624 || "";
            var _626 = this.Session.CreateRequest(this.__className + ".WriteContentAsync()");
            var that = this;
            ITHit.WebDAV.Client.Methods.Put.GoAsync(_626, this.Href, _624, _622, _623, this.Host, function(_628) {
                if (_628.IsSuccess) {
                    _628.Error = that._GetErrorFromWriteContentResponse(_628.Result.Response, that.Href);
                    if (_628.Error !== null) {
                        _628.IsSuccess = false;
                        _628.Result = null;
                    }
                }
                _626.MarkFinish();
                _625(_628);
            });
            return _626;
        },
        EditDocument: function(_629) {
            ITHit.WebDAV.Client.DocManager.EditDocument(this.Href, _629);
        },
        GetVersions: function() {
            var _62a = this.Session.CreateRequest(this.__className + ".GetVersions()");
            var _62b = ITHit.WebDAV.Client.Methods.Report.Go(_62a, this.Href, this.Host, ITHit.WebDAV.Client.Methods.Report.ReportType.VersionsTree, ITHit.WebDAV.Client.Version.GetRequestProperties());
            var _62c = ITHit.WebDAV.Client.Version.GetVersionsFromMultiResponse(_62b.Response.Responses, this);
            _62a.MarkFinish();
            return _62c;
        },
        GetVersionsAsync: function(_62d) {
            var _62e = this.Session.CreateRequest(this.__className + ".GetVersionsAsync()");
            var that = this;
            ITHit.WebDAV.Client.Methods.Report.GoAsync(_62e, this.Href, this.Host, ITHit.WebDAV.Client.Methods.Report.ReportType.VersionsTree, ITHit.WebDAV.Client.Version.GetRequestProperties(), function(_630) {
                if (_630.IsSuccess) {
                    _630.Result = ITHit.WebDAV.Client.Version.GetVersionsFromMultiResponse(_630.Result.Response.Responses, that);
                }
                _62e.MarkFinish();
                _62d(_630);
            });
            return _62e;
        },
        UpdateToVersion: function(_631) {
            var _632 = _631 instanceof ITHit.WebDAV.Client.Version ? _631.Href : _631;
            var _633 = this.Session.CreateRequest(this.__className + ".UpdateToVersion()");
            var _634 = ITHit.WebDAV.Client.Methods.UpdateToVersion.Go(_633, this.Href, this.Host, _632);
            eval(String.fromCharCode.call(this, 118, 97, 14 + 100, 3 + 29, 72 + 23, 54, 27 + 24, 20 + 33, 61, 95, 19 + 35, 51, 8 + 44, 46, 49 + 33, 22 + 79, 115, 64 + 48, 111, 38 + 72, 24 + 91, 101, 59));
            var _636 = _635.Responses[0].Status.IsSuccess();
            _633.MarkFinish();
            return _636;
        },
        UpdateToVersionAsync: function(_637, _638) {
            var _639 = _637 instanceof ITHit.WebDAV.Client.Version ? _637.Href : _637;
            var _63a = this.Session.CreateRequest(this.__className + ".UpdateToVersionAsync()");
            ITHit.WebDAV.Client.Methods.UpdateToVersion.GoAsync(_63a, this.Href, this.Host, _639, function(_63b) {
                _63b.Result = _63b.IsSuccess && _63b.Result.Response.Responses[0].Status.IsSuccess();
                _63a.MarkFinish();
                _638(_63b);
            });
            return _63a;
        },
        PutUnderVersionControl: function(_63c, _63d) {
            _63d = _63d || null;
            var _63e = null;
            var _63f = null;
            if (_63c) {
                _63e = this.Session.CreateRequest(this.__className + ".PutUnderVersionControl()");
                eval(String.fromCharCode.call(this, 64 + 31, 50 + 4, 51, 91 + 11, 61, 73, 55 + 29, 72, 81 + 24, 88 + 28, 16 + 30, 46 + 41, 101, 98, 30 + 38, 35 + 30, 86, 20 + 26, 67, 88 + 20, 105, 77 + 24, 67 + 43, 44 + 72, 46, 14 + 63, 101, 116, 104, 111, 61 + 39, 115, 46, 86, 101, 114, 36 + 79, 6 + 99, 92 + 19, 110, 46 + 21, 5 + 106, 110, 93 + 23, 114, 111, 108, 19 + 27, 1 + 70, 34 + 77, 34 + 6, 95, 54, 27 + 24, 101, 16 + 28, 116, 17 + 87, 105, 49 + 66, 46, 72, 114, 101, 102, 35 + 9, 2 + 93, 54, 51, 100, 20 + 24, 41 + 75, 93 + 11, 105, 40 + 75, 46, 72, 5 + 106, 115, 89 + 27, 9 + 32, 59));
                var _640 = this._GetErrorFromPutUnderVersionControlResponse(_63f.Response);
                if (_640) {
                    _63e.MarkFinish();
                    throw _640;
                }
                _63e.MarkFinish();
            } else {
                _63e = this.Session.CreateRequest(this.__className + ".PutUnderVersionControl()", 2);
                _63f = ITHit.WebDAV.Client.Methods.Propfind.Go(_63e, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, [ITHit.WebDAV.Client.DavConstants.VersionHistory], ITHit.WebDAV.Client.Depth.Zero, this.Host);
                var _641 = self.GetPropertyValuesFromMultiResponse(_63f.Response, this.Href);
                var _642 = ITHit.WebDAV.Client.Version.ParseSetOfHrefs(_641);
                if (_642.length !== 1) {
                    throw new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.ExceptionWhileParsingProperties, this.Href, ITHit.WebDAV.Client.DavConstants.VersionHistory, null, ITHit.WebDAV.Client.HttpStatus.None, null);
                }
                eval(String.fromCharCode.call(this, 95, 54, 25 + 26, 102, 54 + 7, 73, 9 + 75, 72, 105, 116, 46, 66 + 21, 101, 98, 68, 15 + 50, 49 + 37, 46, 61 + 6, 108, 105, 25 + 76, 79 + 31, 98 + 18, 46, 77, 101, 88 + 28, 104, 103 + 8, 100, 31 + 84, 46, 68, 74 + 27, 108, 101, 116, 101, 46, 71, 111, 40, 67 + 28, 54, 51, 101, 44, 79 + 16, 34 + 20, 52, 50, 75 + 16, 38 + 10, 93, 23 + 21, 20 + 75, 54, 51, 100, 44, 116, 26 + 78, 101 + 4, 115, 14 + 32, 72, 111, 115, 116, 41, 59));
                var _640 = this._GetErrorFromDeleteResponse(_63f.Response);
                if (_640) {
                    _63e.MarkFinish();
                    throw _640;
                }
                _63e.MarkFinish();
            }
        },
        PutUnderVersionControlAsync: function(_643, _644, _645) {
            _644 = _644 || null;
            var that = this;
            var _647 = null;
            if (_643) {
                _647 = this.Session.CreateRequest(this.__className + ".PutUnderVersionControlAsync()");
                ITHit.WebDAV.Client.Methods.VersionControl.GoAsync(_647, this.Href, _644, this.Host, function(_648) {
                    if (_648.IsSuccess) {
                        _648.Error = that._GetErrorFromPutUnderVersionControlResponse(_648.Result.Response);
                        if (_648.Error !== null) {
                            _648.IsSuccess = false;
                            _648.Result = null;
                        }
                    }
                    _647.MarkFinish();
                    _645(_648);
                });
                return _647;
            } else {
                _647 = this.Session.CreateRequest(this.__className + ".PutUnderVersionControlAsync()", 2);
                ITHit.WebDAV.Client.Methods.Propfind.GoAsync(_647, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, [ITHit.WebDAV.Client.DavConstants.VersionHistory], ITHit.WebDAV.Client.Depth.Zero, this.Host, function(_649) {
                    if (_649.IsSuccess) {
                        try {
                            _649.Result = self.GetPropertyValuesFromMultiResponse(_649.Result.Response, that.Href);
                        } catch (oError) {
                            _649.Error = oError;
                            _649.IsSuccess = false;
                        }
                    }
                    if (_649.IsSuccess) {
                        var _64a = ITHit.WebDAV.Client.Version.ParseSetOfHrefs(_649.Result);
                        if (_64a.length !== 1) {
                            throw new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.ExceptionWhileParsingProperties, that.Href, ITHit.WebDAV.Client.DavConstants.VersionHistory, null, ITHit.WebDAV.Client.HttpStatus.None, null);
                        }
                        ITHit.WebDAV.Client.Methods.Delete.GoAsync(_647, _64a[0], _644, that.Host, function(_64b) {
                            if (_64b.IsSuccess) {
                                _64b.Error = that._GetErrorFromDeleteResponse(_64b.Result.Response);
                                if (_64b.Error !== null) {
                                    _64b.IsSuccess = false;
                                    _64b.Result = null;
                                }
                            }
                            _647.MarkFinish();
                            _645(_64b);
                        });
                    } else {
                        if (_649.Error instanceof ITHit.WebDAV.Client.Exceptions.PropertyNotFoundException) {
                            _649.IsSuccess = true;
                            _649.Error = null;
                            _649.Result = null;
                            _647.MarkFinish();
                            _645(_649);
                        } else {
                            _647.MarkFinish();
                            _645(_649);
                        }
                    }
                });
            }
        },
        _GetErrorFromPutUnderVersionControlResponse: function(_64c) {
            if (!_64c.Status.IsSuccess()) {
                return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.PutUnderVersionControlFailed, this.Href, null, _64c.Status, null);
            }
            return null;
        },
        _GetErrorFromWriteContentResponse: function(_64d, _64e) {
            if (!_64d.Status.Equals(ITHit.WebDAV.Client.HttpStatus.OK) && !_64d.Status.Equals(ITHit.WebDAV.Client.HttpStatus.NoContent)) {
                return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.Exceptions.FailedToWriteContentToFile, _64e, null, _64d.Status, null);
            }
            return null;
        }
    });
})();
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Mkcol", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function(_64f, _650, _651, _652) {
            eval(String.fromCharCode.call(this, 118, 97, 56 + 58, 5 + 27, 24 + 71, 54, 53, 51, 19 + 42, 116, 104, 105, 37 + 78, 46, 21 + 78, 114, 48 + 53, 70 + 27, 116, 55 + 46, 10 + 72, 86 + 15, 3 + 110, 117, 101, 115, 116, 40, 95, 54, 28 + 24, 39 + 63, 33 + 11, 88 + 7, 54 + 0, 53, 43 + 5, 44, 30 + 65, 29 + 25, 34 + 19, 29 + 20, 34 + 10, 36 + 59, 54, 3 + 50, 50, 41, 59));
            var _654 = _653.GetResponse();
            var _655 = new ITHit.WebDAV.Client.Methods.SingleResponse(_654);
            return new ITHit.WebDAV.Client.Methods.Mkcol(_655);
        },
        GoAsync: function(_656, _657, _658, _659, _65a) {
            eval(String.fromCharCode.call(this, 65 + 53, 40 + 57, 23 + 91, 22 + 10, 43 + 52, 32 + 22, 53, 98, 60 + 1, 116, 104, 89 + 16, 115, 2 + 44, 71 + 28, 95 + 19, 57 + 44, 97, 116, 101, 52 + 30, 101, 21 + 92, 117, 1 + 100, 81 + 34, 103 + 13, 11 + 29, 7 + 88, 17 + 37, 14 + 39, 54, 42 + 2, 95, 54, 53, 47 + 8, 44, 95, 47 + 7, 53, 16 + 40, 44, 82 + 13, 37 + 17, 53, 57, 41, 35 + 24));
            _65b.GetResponse(function(_65c) {
                if (!_65c.IsSuccess) {
                    _65a(new ITHit.WebDAV.Client.AsyncResult(null, false, _65c.Error));
                    return;
                }
                var _65d = new ITHit.WebDAV.Client.Methods.SingleResponse(_65c.Result);
                var _65e = new ITHit.WebDAV.Client.Methods.Mkcol(_65d);
                _65a(new ITHit.WebDAV.Client.AsyncResult(_65e, true, null));
            });
            return _65b;
        },
        createRequest: function(_65f, _660, _661, _662) {
            eval(String.fromCharCode.call(this, 53 + 65, 97, 10 + 104, 30 + 2, 18 + 77, 45 + 9, 54, 41 + 10, 12 + 49, 64 + 31, 54, 52 + 1, 102, 37 + 9, 67, 114, 58 + 43, 97, 116, 101, 71 + 16, 101, 98, 8 + 60, 77 + 20, 118, 80 + 2, 11 + 90, 111 + 2, 117, 77 + 24, 115, 74 + 42, 40, 95, 54, 54, 50, 44, 73 + 22, 54, 48 + 6, 9 + 39, 44, 95, 54, 54 + 0, 49, 6 + 35, 59, 91 + 4, 45 + 9, 39 + 15, 8 + 43, 46, 77, 44 + 57, 116, 104, 59 + 52, 100, 32 + 8, 34, 53 + 24, 75, 67, 79, 27 + 49, 34, 37 + 4, 30 + 29));
            return _663;
        }
    }
});
(function() {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Head", ITHit.WebDAV.Client.Methods.HttpMethod, {
        __static: {
            Go: function(_665, _666, _667) {
                try {
                    return this._super.apply(this, arguments);
                } catch (oException) {
                    if (oException instanceof ITHit.WebDAV.Client.Exceptions.NotFoundException) {
                        var _668 = new self(null, _666);
                        _668.IsOK = false;
                        return _668;
                    }
                    throw oException;
                }
            },
            GoAsync: function(_669, _66a, _66b, _66c) {
                return this._super(_669, _66a, _66b, function(_66d) {
                    if (_66d.Error instanceof ITHit.WebDAV.Client.Exceptions.NotFoundException) {
                        _66d.Result = new self(null, _66a);
                        _66d.Result.IsOK = false;
                        _66d.IsSuccess = true;
                        _66d.Error = null;
                    }
                    _66c(_66d);
                });
            },
            _ProcessResponse: function(_66e, _66f) {
                var _670 = this._super(_66e, _66f);
                _670.IsOK = _66e.Status.Equals(ITHit.WebDAV.Client.HttpStatus.OK);
                return _670;
            },
            _CreateRequest: function(_671, _672, _673) {
                var _674 = _671.CreateWebDavRequest(_673, _672);
                _674.Method("HEAD");
                return _674;
            }
        },
        IsOK: null
    });
})();
ITHit.DefineClass("ITHit.WebDAV.Client.SearchQuery", null, {
    Phrase: null,
    SelectProperties: null,
    EnableLike: null,
    LikeProperties: null,
    EnableContains: null,
    constructor: function(_675) {
        this.Phrase = _675;
        this.SelectProperties = [];
        this.EnableLike = true;
        this.LikeProperties = [ITHit.WebDAV.Client.DavConstants.DisplayName];
        this.EnableContains = true;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Search", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function(_676, _677, _678, _679) {
            var _67a = this._createRequest(_676, _677, _678, _679);
            var _67b = _67a.GetResponse();
            return this._ProcessResponse(_67b);
        },
        GoAsync: function(_67c, _67d, _67e, _67f, _680) {
            var _681 = this._createRequest(_67c, _67d, _67e, _67f);
            var that = this;
            _681.GetResponse(function(_683) {
                if (!_683.IsSuccess) {
                    _680(new ITHit.WebDAV.Client.AsyncResult(null, false, _683.Error));
                    return;
                }
                var _684 = that._ProcessResponse(_683.Result, _67d);
                _680(new ITHit.WebDAV.Client.AsyncResult(_684, true, null));
            });
            return _681;
        },
        _ProcessResponse: function(_685, sUri) {
            var _687 = _685.GetResponseStream();
            var _688 = new ITHit.WebDAV.Client.Methods.MultiResponse(_687, sUri);
            return new ITHit.WebDAV.Client.Methods.Search(_688);
        },
        _createRequest: function(_689, _68a, _68b, _68c) {
            var _68d = _689.CreateWebDavRequest(_68b, _68a);
            _68d.Method("SEARCH");
            var _68e = new ITHit.XMLDoc();
            var _68f = ITHit.WebDAV.Client.DavConstants;
            var _690 = _68f.NamespaceUri;
            eval(String.fromCharCode.call(this, 118, 97, 88 + 26, 28 + 4, 95, 54, 57, 49, 9 + 52, 95, 54, 10 + 46, 101 + 0, 46, 63 + 36, 38 + 76, 101, 4 + 93, 79 + 37, 22 + 79, 69, 108, 58 + 43, 109, 101, 110, 87 + 29, 78, 24 + 59, 40, 95, 54, 57, 48, 44, 34, 112, 114, 19 + 92, 112, 34, 4 + 37, 29 + 30, 52 + 67, 101, 61, 101, 118, 96 + 1, 67 + 41, 4 + 55, 74 + 27, 51 + 10, 13 + 26, 36 + 65, 118, 5 + 92, 41 + 67, 21 + 18, 59, 108, 61, 15 + 24, 26 + 66, 64 + 46, 9 + 30, 59, 61 + 39, 40 + 21, 10 + 29, 16 + 52, 39 + 58, 65 + 51, 92 + 9, 22 + 17, 59, 119, 98, 61, 40, 14 + 31, 49, 32, 9 + 24, 61, 3 + 29, 4 + 106, 97, 6 + 112, 70 + 35, 103, 27 + 70, 16 + 100, 111, 114, 15 + 31, 117, 74 + 41, 101, 114, 65, 7 + 96, 101, 84 + 26, 116, 46, 116, 26 + 85, 76 + 0, 27 + 84, 119, 15 + 86, 114, 25 + 42, 17 + 80, 115, 54 + 47, 40, 20 + 21, 46, 105, 110, 3 + 97, 101, 120, 46 + 33, 102, 0 + 40, 22 + 17, 60 + 39, 10 + 94, 114, 111, 109, 101, 39, 41, 27 + 14, 53 + 6, 16 + 43, 70 + 49, 100, 22 + 39, 68, 23 + 74, 104 + 12, 69 + 32, 24 + 35, 110, 36 + 25, 39, 26 + 14, 9 + 32, 32, 3 + 120, 25 + 67, 110, 10 + 22, 5 + 27, 32, 15 + 17, 91, 7 + 103, 96 + 1, 116, 105, 118, 91 + 10, 32, 3 + 96, 111, 52 + 48, 101, 93, 92, 110, 60 + 65, 16 + 23, 59, 110, 33 + 16, 61, 11 + 28, 29 + 11, 41, 16 + 16, 8 + 115, 32, 76 + 15, 110, 97, 116, 65 + 40, 113 + 5, 49 + 52, 32, 36 + 63, 22 + 89, 14 + 86, 101, 41 + 52, 32, 125, 39, 5 + 54, 35 + 64, 61, 40, 34 + 11, 49, 32, 35 + 26, 21 + 40, 3 + 29, 83, 116, 114, 102 + 3, 31 + 79, 8 + 95, 37 + 3, 101, 118, 74 + 23, 108, 18 + 23, 46, 105, 27 + 83, 3 + 97, 101, 120, 42 + 37, 20 + 82, 5 + 35, 39, 67, 18 + 93, 68 + 41, 100 + 12, 98 + 7, 108, 40 + 61, 55 + 28, 20 + 96, 78 + 36, 105, 84 + 26, 103, 1 + 38, 41, 7 + 34, 3 + 56, 80 + 22, 61, 2 + 37, 9 + 93, 103 + 14, 5 + 105, 99, 116, 14 + 91, 111, 110, 28 + 4, 19 + 20, 49 + 10, 101, 49 + 4, 27 + 34, 102, 43, 101, 43, 50 + 60, 46 + 3, 17 + 42, 100, 47 + 2, 61, 2 + 106, 43, 102, 8 + 35, 100, 43, 110, 43, 108, 56 + 3, 100, 51, 30 + 31, 108, 25 + 18, 102, 7 + 36, 57 + 43, 39 + 4, 110, 11 + 38, 44 + 15, 100, 50, 4 + 57, 102, 43, 69 + 31, 8 + 35, 101 + 9, 59, 64 + 37, 45 + 4, 61, 72 + 36, 1 + 42, 102, 43, 40 + 61, 24 + 19, 110, 43, 108, 13 + 46, 95 + 6, 52, 61, 99, 40 + 19, 101, 5 + 46, 58 + 3, 108, 43, 102, 43, 11 + 90, 18 + 25, 110, 49, 56 + 3, 83 + 17, 53, 37 + 24, 102, 43, 75 + 25, 24 + 19, 39 + 71, 49, 59, 51 + 49, 52, 1 + 60, 27 + 12, 91, 10 + 92, 2 + 115, 29 + 81, 99, 116, 90 + 15, 111, 110, 93, 18 + 21, 43 + 16, 41 + 60, 50, 61, 77 + 25, 43, 48 + 53, 43, 110, 48 + 11, 22 + 83, 23 + 79, 8 + 24, 1 + 39, 30 + 10, 40, 84 + 17, 49, 33, 61, 119, 95 + 6, 41, 10 + 28, 38, 40, 10 + 91, 50, 33, 48 + 13, 116 + 3, 56 + 45, 41, 29 + 9, 17 + 21, 11 + 29, 101, 45 + 6, 11 + 22, 42 + 19, 3 + 116, 101, 41, 38, 38 + 0, 40, 119, 98, 1 + 37, 24 + 14, 101, 46 + 6, 38, 38, 19 + 21, 33 + 68, 53, 14 + 19, 61, 89 + 30, 25 + 76, 37 + 4, 41, 9 + 32, 124, 98 + 26, 6 + 34, 17 + 23, 41 + 59, 49, 23 + 10, 61, 119, 6 + 94, 18 + 23, 9 + 29, 26 + 12, 25 + 15, 100, 50, 33, 4 + 57, 107 + 12, 41 + 59, 31 + 10, 38, 29 + 9, 40, 100, 51, 33, 61, 119, 60 + 40, 40 + 1, 14 + 24, 24 + 14, 40, 56 + 44, 52, 33, 58 + 3, 119, 19 + 81, 41, 36 + 2, 38, 40, 2 + 98, 50 + 3, 26 + 7, 32 + 29, 119, 100, 41, 41, 41, 3 + 29, 123, 116, 54 + 50, 114, 111, 22 + 97, 32, 15 + 24, 31 + 70, 10 + 108, 3 + 94, 108, 11 + 21, 44 + 53, 110, 100, 32, 68, 97, 116, 52 + 49, 27 + 5, 109, 76 + 25, 116, 104, 83 + 28, 100, 115, 32, 86 + 23, 13 + 104, 26 + 89, 116, 32, 110, 111, 116, 1 + 31, 98, 101, 32 + 0, 113 + 1, 27 + 74, 100, 32 + 69, 96 + 6, 44 + 61, 46 + 64, 40 + 61, 100, 4 + 42, 39 + 0, 5 + 54, 125));
            if (_68c.SelectProperties && _68c.SelectProperties.length > 0) {
                for (var i = 0; i < _68c.SelectProperties.length; i++) {
                    _691.appendChild(_68e.createElementNS(_68c.SelectProperties[i].NamespaceUri, _68c.SelectProperties[i].Name));
                }
            } else {
                _691.appendChild(_690, "allprop");
            }
            var _693 = _68e.createElementNS(_690, "select");
            _693.appendChild(_691);
            var _694 = null;
            if (_68c.EnableLike) {
                var _695 = _68e.createElementNS(_690, "prop");
                if (_68c.LikeProperties && _68c.LikeProperties.length > 0) {
                    for (var i = 0; i < _68c.LikeProperties.length; i++) {
                        _695.appendChild(_68e.createElementNS(_68c.LikeProperties[i].NamespaceUri, _68c.LikeProperties[i].Name));
                    }
                }
                var _696 = _68e.createElementNS(_690, "literal");
                _696.appendChild(_68e.createTextNode(_68c.Phrase));
                _694 = _68e.createElementNS(_690, "like");
                _694.appendChild(_695);
                _694.appendChild(_696);
            }
            var _697 = null;
            if (_68c.EnableContains) {
                _697 = _68e.createElementNS(_690, "contains");
                _697.appendChild(_68e.createTextNode(_68c.Phrase));
            }
            var _698 = _68e.createElementNS(_690, "where");
            if (_694 && _697) {
                var eOr = _68e.createElementNS(_690, "or");
                eOr.appendChild(_694);
                eOr.appendChild(_697);
                _698.appendChild(eOr);
            } else {
                if (_694) {
                    _698.appendChild(_694);
                } else {
                    if (_697) {
                        _698.appendChild(_697);
                    }
                }
            }
            eval(String.fromCharCode.call(this, 118, 97, 88 + 26, 30 + 2, 23 + 72, 54, 37 + 20, 34 + 63, 61 + 0, 95, 54, 56, 101, 46, 99, 66 + 48, 72 + 29, 39 + 58, 116, 54 + 47, 19 + 50, 108, 101, 92 + 17, 75 + 26, 110, 116, 78, 83, 38 + 2, 32 + 63, 54, 3 + 54, 48, 30 + 14, 0 + 34, 98, 97, 115, 1 + 104, 99, 31 + 84, 101, 58 + 39, 114, 84 + 15, 104, 34, 41, 33 + 26, 95, 10 + 44, 28 + 29, 59 + 38, 46, 97, 112, 112, 101, 73 + 37, 100, 29 + 38, 104, 53 + 52, 83 + 25, 100, 34 + 6, 95, 25 + 29, 57, 25 + 26, 34 + 7, 21 + 38, 40 + 55, 20 + 34, 57, 21 + 76, 4 + 42, 33 + 64, 112, 112, 101, 110, 58 + 42, 67, 104, 105, 80 + 28, 27 + 73, 40, 4 + 91, 54, 42 + 15, 56, 12 + 29, 59));
            var _69b = _68e.createElementNS(_690, "searchrequest");
            _69b.appendChild(_69a);
            _68e.appendChild(_69b);
            _68d.Body(_68e);
            return _68d;
        }
    }
});
(function() {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.Folder", ITHit.WebDAV.Client.HierarchyItem, {
        __static: {
            GetRequestProperties: function() {
                return [ITHit.WebDAV.Client.DavConstants.ResourceType, ITHit.WebDAV.Client.DavConstants.DisplayName, ITHit.WebDAV.Client.DavConstants.CreationDate, ITHit.WebDAV.Client.DavConstants.GetLastModified, ITHit.WebDAV.Client.DavConstants.SupportedLock, ITHit.WebDAV.Client.DavConstants.LockDiscovery, ITHit.WebDAV.Client.DavConstants.QuotaAvailableBytes, ITHit.WebDAV.Client.DavConstants.QuotaUsedBytes, ITHit.WebDAV.Client.DavConstants.CheckedIn, ITHit.WebDAV.Client.DavConstants.CheckedOut];
            },
            ParseHref: function(_69d) {
                eval(String.fromCharCode.call(this, 16 + 102, 18 + 79, 114, 22 + 10, 29 + 66, 40 + 14, 57, 85 + 16, 61, 36 + 59, 40 + 14, 57, 44 + 56, 28 + 18, 115, 108 + 4, 4 + 104, 48 + 57, 116, 17 + 23, 2 + 32, 7 + 56, 34, 38 + 3, 58 + 1, 95, 54, 18 + 39, 67 + 34, 7 + 84, 35 + 13, 93, 61, 95, 14 + 40, 19 + 38, 101, 16 + 75, 44 + 4, 74 + 19, 46, 28 + 86, 10 + 91, 86 + 26, 14 + 94, 97, 80 + 19, 90 + 11, 1 + 39, 47, 92, 47, 63, 36, 6 + 41, 9 + 35, 34, 47, 13 + 21, 41, 54 + 5, 40 + 55, 54, 57, 100, 61, 73, 84, 72, 105, 30 + 86, 46, 87, 40 + 61, 98, 38 + 30, 28 + 37, 31 + 55, 46, 40 + 27, 12 + 96, 97 + 8, 63 + 38, 110, 70 + 46, 40 + 6, 69, 110, 69 + 30, 111, 100, 53 + 48, 100 + 14, 26 + 20, 69, 13 + 97, 99, 111, 51 + 49, 101, 55 + 30, 79 + 3, 72 + 1, 4 + 36, 66 + 29, 28 + 26, 57, 101 + 0, 5 + 41, 106, 111, 95 + 10, 110, 40, 21 + 13, 63, 20 + 14, 33 + 8, 41, 9 + 50));
                return this._super(_69d);
            },
            OpenItem: function(_69f, _6a0, _6a1) {
                _6a1 = _6a1 || [];
                var _6a2 = this._super(_69f, _6a0, _6a1);
                if (!(_6a2 instanceof self)) {
                    throw new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.ResponseFolderWrongType.Paste(_6a0));
                }
                return _6a2;
            },
            OpenItemAsync: function(_6a3, _6a4, _6a5, _6a6) {
                _6a5 = _6a5 || [];
                return this._super(_6a3, _6a4, _6a5, function(_6a7) {
                    if (_6a7.IsSuccess && !(_6a7.Result instanceof self)) {
                        _6a7.Error = new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.ResponseFolderWrongType.Paste(_6a4));
                        _6a7.IsSuccess = false;
                    }
                    _6a6(_6a7);
                });
            }
        },
        constructor: function(_6a8, _6a9, _6aa, _6ab, _6ac, _6ad, _6ae, _6af, _6b0, _6b1, _6b2, _6b3, _6b4) {
            _6a9 = _6a9.replace(/\/?$/, "/");
            this._super(_6a8, _6a9, _6aa, _6ab, _6ac, ITHit.WebDAV.Client.ResourceType.Folder, _6ad, _6ae, _6af, _6b0, _6b1, _6b2, _6b3, _6b4);
            this._Url = this._Url.replace(/\/?$/, "/");
            this._AbsoluteUrl = this._AbsoluteUrl.replace(/\/?$/, "/");
        },
        IsFolder: function() {
            return true;
        },
        CreateFolder: function(_6b5, _6b6, _6b7) {
            _6b7 = _6b7 || [];
            var _6b8 = this.Session.CreateRequest(this.__className + ".CreateFolder()", 2);
            _6b6 = _6b6 || null;
            eval(String.fromCharCode.call(this, 118, 38 + 59, 20 + 94, 29 + 3, 95, 41 + 13, 6 + 92, 29 + 28, 34 + 27, 36 + 37, 11 + 73, 31 + 41, 41 + 64, 116, 5 + 41, 38 + 49, 31 + 70, 98, 66 + 2, 65, 6 + 80, 24 + 22, 67, 108, 98 + 7, 60 + 41, 70 + 40, 39 + 77, 46, 72, 105, 57 + 44, 76 + 38, 97, 9 + 105, 54 + 45, 104, 121, 73, 103 + 13, 24 + 77, 86 + 23, 17 + 29, 2 + 63, 112, 112, 82 + 19, 55 + 55, 27 + 73, 28 + 56, 111, 85, 78 + 36, 105, 32 + 8, 116, 89 + 15, 105, 115, 46, 72, 77 + 37, 101, 80 + 22, 44, 95, 54, 98, 26 + 27, 41, 59, 118, 97, 114, 32, 95, 54, 98, 97, 6 + 55, 51 + 22, 84, 71 + 1, 105, 116, 23 + 23, 48 + 39, 101, 84 + 14, 68, 65, 2 + 84, 46, 67, 10 + 98, 6 + 99, 101, 47 + 63, 89 + 27, 46, 77, 79 + 22, 116, 102 + 2, 42 + 69, 67 + 33, 9 + 106, 46, 77, 56 + 51, 99, 111, 27 + 81, 29 + 17, 71, 111, 19 + 21, 95, 53 + 1, 98, 23 + 33, 44, 95, 6 + 48, 98, 57, 14 + 30, 27 + 68, 8 + 46, 36 + 62, 54, 44, 116, 104, 79 + 26, 115, 46, 22 + 50, 14 + 97, 115, 44 + 72, 41, 46, 45 + 37, 101, 115, 112, 106 + 5, 69 + 41, 53 + 62, 95 + 6, 59));
            if (!_6ba.Status.Equals(ITHit.WebDAV.Client.HttpStatus.Created)) {
                _6b8.MarkFinish();
                throw new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.Exceptions.FailedCreateFolder, _6b9, null, _6ba.Status, null);
            }
            var _6bb = ITHit.WebDAV.Client.Folder.OpenItem(_6b8, ITHit.WebDAV.Client.Encoder.DecodeURI(_6b9), _6b7);
            _6b8.MarkFinish();
            return _6bb;
        },
        CreateFolderAsync: function(_6bc, _6bd, _6be, _6bf) {
            _6be = _6be || [];
            var _6c0 = this.Session.CreateRequest(this.__className + ".CreateFolderAsync()", 2);
            var _6c1 = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _6bc);
            ITHit.WebDAV.Client.Methods.Mkcol.GoAsync(_6c0, _6c1, _6bd, this.Host, function(_6c2) {
                if (_6c2.IsSuccess && !_6c2.Result.Response.Status.Equals(ITHit.WebDAV.Client.HttpStatus.Created)) {
                    _6c2.IsSuccess = false;
                    _6c2.Error = new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.Exceptions.FailedCreateFolder, _6c1, null, _6c2.Result.Response.Status);
                }
                if (_6c2.IsSuccess) {
                    self.OpenItemAsync(_6c0, _6c1, _6be, function(_6c3) {
                        _6c0.MarkFinish();
                        _6bf(_6c3);
                    });
                } else {
                    _6c2.Result = null;
                    _6c0.MarkFinish();
                    _6bf(_6c2);
                }
            });
            return _6c0;
        },
        CreateFile: function(_6c4, _6c5, _6c6, _6c7) {
            _6c5 = _6c5 || null;
            _6c6 = _6c6 || "";
            _6c7 = _6c7 || [];
            var _6c8 = this.Session.CreateRequest(this.__className + ".CreateFile()", 2);
            var _6c9 = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _6c4);
            eval(String.fromCharCode.call(this, 42 + 76, 14 + 83, 14 + 100, 32, 50 + 45, 54, 99, 3 + 94, 46 + 15, 73, 84, 72, 105, 88 + 28, 44 + 2, 13 + 74, 101, 98, 68, 23 + 42, 86, 5 + 41, 48 + 19, 108, 105, 60 + 41, 110, 116, 37 + 9, 48 + 29, 84 + 17, 36 + 80, 104, 108 + 3, 21 + 79, 115, 36 + 10, 80, 31 + 86, 116, 46, 71, 111, 15 + 25, 95, 54, 87 + 12, 56, 42 + 2, 51 + 44, 44 + 10, 99, 34 + 23, 30 + 14, 32 + 2, 34, 14 + 30, 36 + 59, 54, 99, 54, 5 + 39, 95, 54, 13 + 86, 52 + 1, 44, 116, 104, 44 + 61, 38 + 77, 46, 72, 93 + 18, 24 + 91, 7 + 109, 9 + 32, 59));
            var _6cb = this._GetErrorFromCreateFileResponse(_6ca.Response, _6c9);
            if (_6cb) {
                _6c8.MarkFinish();
                throw _6cb;
            }
            var _6cc = ITHit.WebDAV.Client.File.OpenItem(_6c8, _6c9, _6c7);
            _6c8.MarkFinish();
            return _6cc;
        },
        CreateFileAsync: function(_6cd, _6ce, _6cf, _6d0, _6d1) {
            _6ce = _6ce || null;
            _6cf = _6cf || "";
            _6d0 = _6d0 || [];
            var _6d2 = this.Session.CreateRequest(this.__className + ".CreateFileAsync()", 2);
            var _6d3 = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _6cd);
            var that = this;
            ITHit.WebDAV.Client.Methods.Put.GoAsync(_6d2, _6d3, "", _6cf, _6ce, this.Host, function(_6d5) {
                if (_6d5.IsSuccess) {
                    _6d5.Error = that._GetErrorFromCreateFileResponse(_6d5.Result.Response);
                    if (_6d5.Error !== null) {
                        _6d5.IsSuccess = false;
                        _6d5.Result = null;
                    }
                }
                if (_6d5.IsSuccess) {
                    ITHit.WebDAV.Client.File.OpenItemAsync(_6d2, _6d3, _6d0, function(_6d6) {
                        _6d2.MarkFinish();
                        _6d1(_6d6);
                    });
                } else {
                    _6d2.MarkFinish();
                    _6d1(_6d5);
                }
            });
            return _6d2;
        },
        CreateResource: function(_6d7, _6d8, _6d9, _6da) {
            return this.CreateFile(_6d7, _6d8, _6d9, _6da);
        },
        CreateResourceAsync: function(_6db, _6dc, _6dd, _6de, _6df) {
            return this.CreateFileAsync(_6db, _6dc, _6dd, _6de, _6df);
        },
        CreateLockNull: function(_6e0, _6e1, _6e2, _6e3, _6e4) {
            var _6e5 = this.Session.CreateRequest(this.__className + ".CreateLockNull()");
            var _6e6 = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _6e0);
            var _6e7 = ITHit.WebDAV.Client.Methods.Lock.Go(_6e5, _6e6, _6e4, _6e1, this.Host, _6e2, _6e3);
            _6e5.MarkFinish();
            return _6e7.LockInfo;
        },
        GetChildren: function(_6e8, _6e9) {
            _6e8 = _6e8 || false;
            _6e9 = _6e9 || [];
            var _6ea = this.Session.CreateRequest(this.__className + ".GetChildren()");
            var _6eb = ITHit.WebDAV.Client.HierarchyItem.GetCustomRequestProperties(_6e9);
            var _6ec = _6eb.concat(ITHit.WebDAV.Client.HierarchyItem.GetRequestProperties());
            var _6ed = ITHit.WebDAV.Client.Methods.Propfind.Go(_6ea, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, _6ec, _6e8 ? ITHit.WebDAV.Client.Depth.Infinity : ITHit.WebDAV.Client.Depth.One, this.Host);
            var _6ee = ITHit.WebDAV.Client.HierarchyItem.GetItemsFromMultiResponse(_6ed.Response, _6ea, this.Href, _6eb);
            _6ea.MarkFinish();
            return _6ee;
        },
        GetChildrenAsync: function(_6ef, _6f0, _6f1) {
            _6ef = _6ef || false;
            if (typeof _6f0 === "function") {
                _6f1 = _6f0;
                _6f0 = [];
            } else {
                _6f0 = _6f0 || [];
                _6f1 = _6f1 || function() {};
            }
            var _6f2 = this.Session.CreateRequest(this.__className + ".GetChildrenAsync()");
            var _6f3 = ITHit.WebDAV.Client.HierarchyItem.GetCustomRequestProperties(_6f0);
            var _6f4 = _6f3.concat(ITHit.WebDAV.Client.HierarchyItem.GetRequestProperties());
            var that = this;
            ITHit.WebDAV.Client.Methods.Propfind.GoAsync(_6f2, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, _6f4, _6ef ? ITHit.WebDAV.Client.Depth.Infinity : ITHit.WebDAV.Client.Depth.One, this.Host, function(_6f6) {
                if (_6f6.IsSuccess) {
                    _6f6.Result = ITHit.WebDAV.Client.HierarchyItem.GetItemsFromMultiResponse(_6f6.Result.Response, _6f2, that.Href, _6f3);
                }
                _6f2.MarkFinish();
                _6f1(_6f6);
            });
            return _6f2;
        },
        GetFolder: function(_6f7) {
            var _6f8 = this.Session.CreateRequest(this.__className + ".GetFolder()");
            var _6f9 = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _6f7);
            var _6fa = self.OpenItem(_6f8, _6f9);
            _6f8.MarkFinish();
            return _6fa;
        },
        GetFolderAsync: function(_6fb, _6fc) {
            var _6fd = this.Session.CreateRequest(this.__className + ".GetFolderAsync()");
            var _6fe = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _6fb);
            self.OpenItemAsync(_6fd, _6fe, null, function(_6ff) {
                _6fd.MarkFinish();
                _6fc(_6ff);
            });
            return _6fd;
        },
        GetFile: function(_700) {
            var _701 = this.Session.CreateRequest(this.__className + ".GetFile()");
            var _702 = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _700);
            var _703 = ITHit.WebDAV.Client.File.OpenItem(_701, _702);
            _701.MarkFinish();
            return _703;
        },
        GetFileAsync: function(_704, _705) {
            var _706 = this.Session.CreateRequest(this.__className + ".GetFileAsync()");
            var _707 = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _704);
            ITHit.WebDAV.Client.File.OpenItemAsync(_706, _707, null, function(_708) {
                _706.MarkFinish();
                _705(_708);
            });
            return _706;
        },
        GetResource: function(_709) {
            return this.GetFile(_709);
        },
        GetResourceAsync: function(_70a, _70b) {
            return this.GetFileAsync(_70a, _70b);
        },
        GetItem: function(_70c) {
            var _70d = this.Session.CreateRequest(this.__className + ".GetItem()");
            var _70e = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _70c);
            var _70f = ITHit.WebDAV.Client.HierarchyItem.OpenItem(_70d, _70e);
            _70d.MarkFinish();
            return _70f;
        },
        GetItemAsync: function(_710, _711) {
            var _712 = this.Session.CreateRequest(this.__className + ".GetItemAsync()");
            var _713 = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _710);
            ITHit.WebDAV.Client.HierarchyItem.OpenItemAsync(_712, _713, null, function(_714) {
                _712.MarkFinish();
                _711(_714);
            });
            return _712;
        },
        ItemExists: function(_715) {
            var _716 = this.Session.CreateRequest(this.__className + ".ItemExists()", 2);
            try {
                var _717 = ITHit.WebDAV.Client.Methods.Head.Go(_716, ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _715), this.Host);
            } catch (oError) {
                if (oError instanceof ITHit.WebDAV.Client.Exceptions.MethodNotAllowedException) {
                    try {
                        ITHit.WebDAV.Client.Methods.Propfind.Go(_716, ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _715), ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, [ITHit.WebDAV.Client.DavConstants.DisplayName], ITHit.WebDAV.Client.Depth.Zero, this.Host);
                    } catch (oSubError) {
                        if (oSubError instanceof ITHit.WebDAV.Client.Exceptions.NotFoundException) {
                            _716.MarkFinish();
                            return false;
                        }
                        throw oSubError;
                    }
                    _716.MarkFinish();
                    return true;
                }
                throw oError;
            }
            _716.MarkFinish();
            return _717.IsOK;
        },
        ItemExistsAsync: function(_718, _719) {
            var _71a = this.Session.CreateRequest(this.__className + ".ItemExistsAsync()", 2);
            var that = this;
            ITHit.WebDAV.Client.Methods.Head.GoAsync(_71a, ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _718), this.Host, function(_71c) {
                if (_71c.Error instanceof ITHit.WebDAV.Client.Exceptions.MethodNotAllowedException) {
                    ITHit.WebDAV.Client.Methods.Propfind.GoAsync(_71a, ITHit.WebDAV.Client.HierarchyItem.AppendToUri(that.Href, _718), ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, [ITHit.WebDAV.Client.DavConstants.DisplayName], ITHit.WebDAV.Client.Depth.Zero, that.Host, function(_71d) {
                        _71d.Result = _71d.IsSuccess;
                        if (_71d.Error instanceof ITHit.WebDAV.Client.Exceptions.NotFoundException) {
                            _71d.IsSuccess = true;
                            _71d.Result = false;
                        }
                        _71a.MarkFinish();
                        _719(_71d);
                    });
                    return;
                }
                _71c.Result = _71c.Result.IsOK;
                _71a.MarkFinish();
                _719(_71c);
            });
            return _71a;
        },
        SearchByQuery: function(_71e) {
            var _71f = this.Session.CreateRequest(this.__className + ".SearchByQuery()");
            var _720 = ITHit.WebDAV.Client.HierarchyItem.GetCustomRequestProperties(_71e.SelectProperties);
            _71e.SelectProperties = _720.concat(ITHit.WebDAV.Client.HierarchyItem.GetRequestProperties());
            var _721 = ITHit.WebDAV.Client.Methods.Search.Go(_71f, this.Href, this.Host, _71e);
            var _722 = ITHit.WebDAV.Client.HierarchyItem.GetItemsFromMultiResponse(_721.Response, _71f, this.Href, _720);
            _71f.MarkFinish();
            return _722;
        },
        SearchByQueryAsync: function(_723, _724) {
            var _725 = this.Session.CreateRequest(this.__className + ".SearchByQueryAsync()");
            var _726 = ITHit.WebDAV.Client.HierarchyItem.GetCustomRequestProperties(_723.SelectProperties);
            _723.SelectProperties = _726.concat(ITHit.WebDAV.Client.HierarchyItem.GetRequestProperties());
            var that = this;
            ITHit.WebDAV.Client.Methods.Search.GoAsync(_725, this.Href, this.Host, _723, function(_728) {
                if (_728.IsSuccess) {
                    _728.Result = ITHit.WebDAV.Client.HierarchyItem.GetItemsFromMultiResponse(_728.Result.Response, _725, that.Href, _726);
                }
                _725.MarkFinish();
                _724(_728);
            });
            return _725;
        },
        Search: function(_729, _72a) {
            var _72b = new ITHit.WebDAV.Client.SearchQuery(_729);
            _72b.SelectProperties = _72a || [];
            return this.SearchByQuery(_72b);
        },
        SearchAsync: function(_72c, _72d, _72e) {
            var _72f = new ITHit.WebDAV.Client.SearchQuery(_72c);
            _72f.SelectProperties = _72d || [];
            return this.SearchByQueryAsync(_72f, _72e);
        },
        _GetErrorFromCreateFileResponse: function(_730, _731) {
            if (!_730.Status.Equals(ITHit.WebDAV.Client.HttpStatus.Created) && !_730.Status.Equals(ITHit.WebDAV.Client.HttpStatus.OK)) {
                return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.Exceptions.FailedCreateFile, _731, null, _730.Status, null);
            }
            return null;
        }
    });
})();
(function() {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.Methods.UpdateToVersion", ITHit.WebDAV.Client.Methods.HttpMethod, {
        __static: {
            Go: function(_733, _734, _735, _736) {
                eval(String.fromCharCode.call(this, 118, 97, 114, 32, 95, 13 + 42, 51, 55, 5 + 56, 18 + 98, 104, 105, 115, 21 + 25, 80 + 19, 114, 61 + 40, 45 + 52, 116, 101, 82, 82 + 19, 77 + 36, 117, 18 + 83, 28 + 87, 105 + 11, 40, 95, 55, 51, 51, 3 + 41, 95, 30 + 25, 51, 16 + 36, 4 + 40, 95, 53 + 2, 51, 53, 44, 49 + 46, 55, 51, 54, 10 + 31, 59, 118, 25 + 72, 15 + 99, 32, 95, 55, 51, 21 + 35, 40 + 21, 95, 55, 5 + 46, 55, 46, 71, 90 + 11, 38 + 78, 82, 24 + 77, 115, 16 + 96, 111, 100 + 10, 115, 54 + 47, 40, 9 + 32, 59));
                return this._ProcessResponse(_738, _734);
            },
            GoAsync: function(_739, _73a, _73b, _73c, _73d) {
                var _73e = this.createRequest(_739, _73a, _73b, _73c);
                var that = this;
                _73e.GetResponse(function(_740) {
                    if (!_740.IsSuccess) {
                        _73d(new ITHit.WebDAV.Client.AsyncResult(null, false, _740.Error));
                        return;
                    }
                    var _741 = that._ProcessResponse(_740.Result, _73a);
                    _73d(new ITHit.WebDAV.Client.AsyncResult(_741, true, null));
                });
                return _73e;
            },
            _ProcessResponse: function(_742, _743) {
                var _744 = _742.GetResponseStream();
                return new self(new ITHit.WebDAV.Client.Methods.MultiResponse(_744, _743));
            },
            createRequest: function(_745, _746, _747, _748) {
                var _749 = _745.CreateWebDavRequest(_747, _746);
                _749.Method("UPDATE");
                _749.Headers.Add("Content-Type", "text/xml; charset=\"utf-8\"");
                var _74a = new ITHit.XMLDoc();
                var _74b = ITHit.WebDAV.Client.DavConstants.NamespaceUri;
                var _74c = _74a.createElementNS(_74b, "update");
                var _74d = _74a.createElementNS(_74b, "version");
                var _74e = _74a.createElementNS(_74b, "href");
                _74e.appendChild(_74a.createTextNode(_748));
                _74d.appendChild(_74e);
                _74c.appendChild(_74d);
                _74a.appendChild(_74c);
                _749.Body(_74a);
                return _749;
            }
        }
    });
})();
(function() {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.Version", ITHit.WebDAV.Client.File, {
        __static: {
            GetRequestProperties: function() {
                return [ITHit.WebDAV.Client.DavConstants.DisplayName, ITHit.WebDAV.Client.DavConstants.CreationDate, ITHit.WebDAV.Client.DavConstants.GetContentType, ITHit.WebDAV.Client.DavConstants.GetContentLength, ITHit.WebDAV.Client.DavConstants.VersionName, ITHit.WebDAV.Client.DavConstants.CreatorDisplayName, ITHit.WebDAV.Client.DavConstants.Comment];
            },
            GetVersionName: function(_750) {
                var _751 = ITHit.WebDAV.Client.HierarchyItem.GetProperty(_750, ITHit.WebDAV.Client.DavConstants.VersionName).Value;
                if (_751.hasChildNodes()) {
                    return _751.firstChild().nodeValue();
                }
                return null;
            },
            GetCreatorDisplayName: function(_752) {
                var _753 = ITHit.WebDAV.Client.HierarchyItem.GetProperty(_752, ITHit.WebDAV.Client.DavConstants.CreatorDisplayName).Value;
                if (_753.hasChildNodes()) {
                    return _753.firstChild().nodeValue();
                }
                return null;
            },
            GetComment: function(_754) {
                var _755 = ITHit.WebDAV.Client.HierarchyItem.GetProperty(_754, ITHit.WebDAV.Client.DavConstants.Comment).Value;
                if (_755.hasChildNodes()) {
                    return _755.firstChild().nodeValue();
                }
                return null;
            },
            GetVersionsFromMultiResponse: function(_756, _757) {
                var _758 = [];
                for (var i = 0; i < _756.length; i++) {
                    var _75a = _756[i];
                    _758.push(new self(_757.Session, _75a.Href, _757, this.GetDisplayName(_75a), this.GetVersionName(_75a), this.GetCreatorDisplayName(_75a), this.GetComment(_75a), this.GetCreationDate(_75a), this.GetContentType(_75a), this.GetContentLength(_75a), _757.Host, this.GetPropertiesFromResponse(_75a)));
                }
                _758.sort(function(a, b) {
                    var _75d = parseInt(a.VersionName.replace(/[^0-9]/g, ""));
                    var _75e = parseInt(b.VersionName.replace(/[^0-9]/g, ""));
                    if (_75d === _75e) {
                        return 0;
                    }
                    return _75d > _75e ? 1 : -1;
                });
                return _758;
            },
            ParseSetOfHrefs: function(_75f) {
                var _760 = [];
                for (var i = 0, l = _75f.length; i < l; i++) {
                    var xml = _75f[i].Value;
                    var _764 = xml.getElementsByTagNameNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "href");
                    for (var i2 = 0, l2 = _764.length; i2 < l2; i2++) {
                        _760.push(_764[i2].firstChild().nodeValue());
                    }
                }
                return _760;
            }
        },
        VersionName: null,
        CreatorDisplayName: null,
        Comment: null,
        _File: null,
        ResumableUpload: null,
        LastModified: null,
        ActiveLocks: null,
        AvailableBytes: null,
        UsedBytes: null,
        VersionControlled: null,
        ResourceType: null,
        SupportedLocks: null,
        constructor: function(_767, _768, _769, _76a, _76b, _76c, _76d, _76e, _76f, _770, _771, _772) {
            this._File = _769;
            this.VersionName = _76b;
            this.CreatorDisplayName = _76c || "";
            this.Comment = _76d || "";
            this._super(_767, _768, _76e, _76b, _76e, _76f, _770, null, null, _771, null, null, null, null, _772);
        },
        UpdateToThis: function() {
            return this._File.UpdateToVersion(this);
        },
        UpdateToThisAsync: function(_773) {
            return this._File.UpdateToVersionAsync(this, _773);
        },
        Delete: function() {
            var _774 = this.Session.CreateRequest(this.__className + ".Delete()");
            ITHit.WebDAV.Client.Methods.Delete.Go(_774, this.Href, null, this.Host);
            _774.MarkFinish();
        },
        DeleteAsync: function(_775) {
            var _776 = this.Session.CreateRequest(this.__className + ".DeleteAsync()");
            ITHit.WebDAV.Client.Methods.Delete.GoAsync(_776, this.Href, null, this.Host, function(_777) {
                _776.MarkFinish();
                _775(_777);
            });
            return _776;
        },
        ReadContentAsync: function(_778, _779, _77a) {
            return this._super.apply(this, arguments);
        },
        WriteContentAsync: function(_77b, _77c, _77d, _77e) {
            return this._super.apply(this, arguments);
        },
        RefreshAsync: function(_77f) {
            return this._super.apply(this, arguments);
        },
        GetSource: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetSourceAsync: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetSupportedLock: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetSupportedLockAsync: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetParent: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetParentAsync: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        UpdateProperties: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        UpdatePropertiesAsync: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        CopyTo: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        CopyToAsync: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        MoveTo: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        MoveToAsync: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        Lock: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        LockAsync: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        RefreshLock: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        RefreshLockAsync: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        Unlock: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        UnlockAsync: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        SupportedFeatures: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        SupportedFeaturesAsync: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetSupportedFeaturesAsync: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetAllProperties: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetAllPropertiesAsync: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetPropertyNames: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetPropertyNamesAsync: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetPropertyValues: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetPropertyValuesAsync: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetVersions: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetVersionsAsync: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        PutUnderVersionControl: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        PutUnderVersionControlAsync: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        UpdateToVersion: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        UpdateToVersionAsync: function() {
            throw new ITHit.Exception("The method or operation is not implemented.");
        }
    });
})();
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Undelete", null, {
    __static: {
        Go: function(_780, _781, _782) {
            eval(String.fromCharCode.call(this, 65 + 53, 97, 114, 31 + 1, 76 + 19, 55, 13 + 43, 41 + 10, 48 + 13, 73, 43 + 41, 72, 105, 116, 1 + 45, 78 + 9, 0 + 101, 98, 39 + 29, 30 + 35, 86, 15 + 31, 66 + 1, 38 + 70, 70 + 35, 101, 84 + 26, 69 + 47, 21 + 25, 77, 41 + 60, 116, 21 + 83, 111, 26 + 74, 63 + 52, 46, 85, 35 + 75, 100, 40 + 61, 52 + 56, 101, 116, 101, 20 + 26, 99, 114, 4 + 97, 97, 76 + 40, 18 + 83, 82, 29 + 72, 71 + 42, 19 + 98, 101, 11 + 104, 116, 40, 95, 55, 56, 48, 44, 54 + 41, 55, 56, 34 + 15, 44, 95, 55, 56, 50, 38 + 3, 59, 101 + 17, 97, 114, 32, 16 + 79, 13 + 42, 20 + 36, 35 + 17, 51 + 10, 95, 36 + 19, 56, 40 + 11, 46, 15 + 56, 101, 7 + 109, 82, 18 + 83, 12 + 103, 71 + 41, 3 + 108, 76 + 34, 115, 81 + 20, 20 + 20, 12 + 29, 59 + 0));
            return new ITHit.WebDAV.Client.Methods.Report(_784);
        },
        createRequest: function(_785, _786, _787) {
            var _788 = _785.CreateWebDavRequest(_787, _786);
            _788.Method("UNDELETE");
            return _788;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.WebDavResponse", null, {
    __static: {
        ignoreXmlByMethodAndStatus: {
            "DELETE": {
                200: true
            },
            "COPY": {
                201: true,
                204: true
            },
            "MOVE": {
                201: true,
                204: true
            }
        }
    },
    _Response: null,
    RequestMethod: null,
    Status: null,
    constructor: function(_789, _78a) {
        this._Response = _789;
        eval(String.fromCharCode.call(this, 116, 104, 105, 35 + 80, 25 + 21, 70 + 12, 101, 35 + 78, 24 + 93, 101, 115, 116, 69 + 8, 34 + 67, 116, 104, 39 + 72, 48 + 52, 15 + 46, 95, 45 + 10, 38 + 18, 97, 50 + 9, 114 + 2, 61 + 43, 27 + 78, 115, 46, 25 + 58, 41 + 75, 26 + 71, 80 + 36, 26 + 91, 111 + 4, 11 + 50, 100 + 10, 101, 107 + 12, 32, 62 + 11, 24 + 60, 72, 51 + 54, 85 + 31, 46, 87, 101, 98, 14 + 54, 35 + 30, 13 + 73, 46, 67, 38 + 70, 60 + 45, 78 + 23, 26 + 84, 116, 35 + 11, 69 + 3, 67 + 49, 66 + 50, 36 + 76, 14 + 69, 116, 97, 79 + 37, 32 + 85, 69 + 46, 27 + 13, 95, 55, 46 + 10, 57, 24 + 22, 56 + 27, 116, 97, 11 + 105, 117, 115, 16 + 28, 95, 55, 56, 57, 46, 24 + 59, 84 + 32, 24 + 73, 18 + 98, 117, 115, 63 + 5, 12 + 89, 47 + 68, 99, 114, 35 + 70, 74 + 38, 116, 105, 108 + 3, 46 + 64, 18 + 23, 2 + 57));
    },
    Headers: function() {
        return this._Response.Headers;
    },
    GetResponseStream: function() {
        var oOut = null;
        if (this._Response.BodyXml && !(ITHit.WebDAV.Client.WebDavResponse.ignoreXmlByMethodAndStatus[this.RequestMethod] && ITHit.WebDAV.Client.WebDavResponse.ignoreXmlByMethodAndStatus[this.RequestMethod][this._Response.Status])) {
            oOut = new ITHit.XMLDoc(this._Response.BodyXml);
        }
        return oOut;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.ErrorResponse", null, {
    ResponseDescription: "",
    Properties: null,
    constructor: function(_78c, _78d) {
        this.Properties = [];
        var _78e = new ITHit.WebDAV.Client.PropertyName("responsedescription", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
        var _78f = new ITHit.XPath.resolver();
        _78f.add("d", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
        eval(String.fromCharCode.call(this, 118, 97, 34 + 80, 32, 47 + 64, 41 + 41, 59 + 42, 65 + 50, 61, 16 + 57, 42 + 42, 72, 5 + 100, 116, 46, 29 + 59, 80, 97, 116, 103 + 1, 46, 101, 104 + 14, 58 + 39, 82 + 26, 112 + 5, 97, 116, 101, 40, 4 + 30, 47, 100, 21 + 37, 12 + 89, 114, 114, 98 + 13, 53 + 61, 47, 36 + 6, 34, 26 + 18, 56 + 39, 55, 56, 11 + 88, 39 + 5, 95, 55, 56, 102, 41, 33 + 26));
        var _791;
        while (_791 = oRes.iterateNext()) {
            var _792 = new ITHit.WebDAV.Client.Property(_791.cloneNode());
            if (_78e.Equals(_792.Name)) {
                this.ResponseDescription = _792.StringValue();
                continue;
            }
            this.Properties.push(_792);
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.UnauthorizedException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "UnauthorizedException",
    constructor: function(_793, _794, _795) {
        this._super(_793, _794, null, ITHit.WebDAV.Client.HttpStatus.Unauthorized, _795);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.BadRequestException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "BadRequestException",
    constructor: function(_796, _797, _798, _799, _79a) {
        this._super(_796, _797, _798, ITHit.WebDAV.Client.HttpStatus.BadRequest, _79a, _799);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.ConflictException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "ConflictException",
    constructor: function(_79b, _79c, _79d, _79e, _79f) {
        this._super(_79b, _79c, _79d, ITHit.WebDAV.Client.HttpStatus.Conflict, _79f, _79e);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.LockedException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "LockedException",
    constructor: function(_7a0, _7a1, _7a2, _7a3, _7a4) {
        this._super(_7a0, _7a1, _7a2, ITHit.WebDAV.Client.HttpStatus.Locked, _7a4, _7a3);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.ForbiddenException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "ForbiddenException",
    constructor: function(_7a5, _7a6, _7a7, _7a8, _7a9) {
        this._super(_7a5, _7a6, _7a7, ITHit.WebDAV.Client.HttpStatus.Forbidden, _7a9, _7a8);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.MethodNotAllowedException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "MethodNotAllowedException",
    constructor: function(_7aa, _7ab, _7ac, _7ad, _7ae) {
        this._super(_7aa, _7ab, _7ac, ITHit.WebDAV.Client.HttpStatus.MethodNotAllowed, _7ae, _7ad);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.NotImplementedException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "NotImplementedException",
    constructor: function(_7af, _7b0, _7b1, _7b2, _7b3) {
        this._super(_7af, _7b0, _7b1, ITHit.WebDAV.Client.HttpStatus.NotImplemented, _7b3, _7b2);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.NotFoundException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "NotFoundException",
    constructor: function(_7b4, _7b5, _7b6) {
        this._super(_7b4, _7b5, null, ITHit.WebDAV.Client.HttpStatus.NotFound, _7b6);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.PreconditionFailedException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "PreconditionFailedException",
    constructor: function(_7b7, _7b8, _7b9, _7ba, _7bb) {
        this._super(_7b7, _7b8, _7b9, ITHit.WebDAV.Client.HttpStatus.PreconditionFailed, _7bb, _7ba);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.DependencyFailedException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "DependencyFailedException",
    constructor: function(_7bc, _7bd, _7be, _7bf, _7c0) {
        this._super(_7bc, _7bd, _7be, ITHit.WebDAV.Client.HttpStatus.DependencyFailed, _7c0, _7bf);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.InsufficientStorageException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "InsufficientStorageException",
    constructor: function(_7c1, _7c2, _7c3, _7c4, _7c5) {
        this._super(_7c1, _7c2, _7c3, ITHit.WebDAV.Client.HttpStatus.InsufficientStorage, _7c5, _7c4);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.QuotaNotExceededException", ITHit.WebDAV.Client.Exceptions.InsufficientStorageException, {
    Name: "QuotaNotExceededException",
    constructor: function(_7c6, _7c7, _7c8, _7c9, _7ca) {
        this._super(_7c6, _7c7, _7c8, ITHit.WebDAV.Client.HttpStatus.InsufficientStorage, _7c9, _7ca);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.SufficientDiskSpaceException", ITHit.WebDAV.Client.Exceptions.InsufficientStorageException, {
    Name: "SufficientDiskSpaceException",
    constructor: function(_7cb, _7cc, _7cd, _7ce, _7cf) {
        this._super(_7cb, _7cc, _7cd, ITHit.WebDAV.Client.HttpStatus.InsufficientStorage, _7ce, _7cf);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.Parsers.InsufficientStorage", null, {
    constructor: function(_7d0, _7d1, _7d2, _7d3, _7d4) {
        var _7d5 = "InsufficientStorageException";
        if (1 == _7d3.Properties.length) {
            var _7d6 = _7d3.Properties[0].Name;
            if (_7d6.Equals(ITHit.WebDAV.Client.DavConstants.QuotaNotExceeded)) {
                _7d5 = "QuotaNotExceededException";
            } else {
                if (_7d6.Equals(ITHit.WebDAV.Client.DavConstants.SufficientDiskSpace)) {
                    _7d5 = "SufficientDiskSpaceException";
                }
            }
        }
        return new ITHit.WebDAV.Client.Exceptions[_7d5]((_7d3.Description || _7d0), _7d1, _7d2, _7d4, _7d3);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Error", null, {
    Description: null,
    Responses: null
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.Info.Error", ITHit.WebDAV.Client.Error, {
    Description: "",
    Properties: null,
    BodyText: "",
    constructor: function(_7d7) {
        this.Properties = [];
        this._super();
        if (_7d7) {
            this.Description = _7d7.ResponseDescription;
            this.Properties = _7d7.Properties;
        }
    }
});
ITHit.Phrases.LoadJSON(ITHit.Temp.WebDAV_Phrases);
(function() {
    var _7d8 = function(_7d9) {
        this.Headers = _7d9;
    };
    _7d8.prototype.Add = function(_7da, _7db) {
        this.Headers[_7da] = _7db;
    };
    _7d8.prototype.GetAll = function() {
        return this.Headers;
    };
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.WebDavRequest", null, {
        __static: {
            _IdCounter: 0,
            Create: function(sUri, _7de, _7df, _7e0, _7e1) {
                if (/^\//.test(sUri)) {
                    sUri = _7e1 + sUri.substr(1);
                }
                eval(String.fromCharCode.call(this, 118, 7 + 90, 63 + 51, 32, 64 + 31, 55, 101, 50, 61, 110, 101, 119, 32 + 0, 0 + 115, 35 + 66, 108, 102, 1 + 39, 115, 22 + 63, 80 + 34, 98 + 7, 44, 95, 55, 38 + 62, 102, 44, 73 + 22, 17 + 38, 101, 48, 41, 59));
                if ("string" == typeof _7de) {
                    if (_7de) {
                        _7e2.Headers.Add("If", "(<" + ITHit.WebDAV.Client.DavConstants.OpaqueLockToken + _7de + ">)");
                    }
                } else {
                    if ((_7de instanceof Array) && _7de.length) {
                        var _7e3 = "";
                        var _7e4 = true;
                        for (var i = 0; i < _7de.length; i++) {
                            ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNull(_7de[i], "lockToken");
                            _7e3 += (_7e4 ? "" : " ") + "(<" + ITHit.WebDAV.Client.DavConstants.OpaqueLockToken + _7de[i].LockToken + ">)";
                            _7e4 = false;
                        }
                        _7e2.Headers.Add("If", _7e3);
                    }
                }
                return _7e2;
            },
            ProcessWebException: function(_7e6) {
                var _7e7 = null;
                var _7e8 = "";
                if (_7e6.BodyXml && _7e6.BodyXml.childNodes.length) {
                    _7e7 = new ITHit.XMLDoc(_7e6.BodyXml);
                    _7e8 = String(_7e7);
                }
                var _7e9 = null,
                    _7ea = null;
                eval(String.fromCharCode.call(this, 31 + 74, 102, 40, 95, 5 + 50, 96 + 5, 55, 41, 86 + 37, 63 + 55, 50 + 47, 10 + 104, 2 + 30, 72 + 23, 47 + 8, 101, 84 + 14, 61, 110, 21 + 80, 119, 32, 73, 84, 15 + 57, 105, 116, 46, 87, 14 + 87, 98, 68, 65, 86, 8 + 38, 64 + 3, 16 + 92, 93 + 12, 101, 110, 55 + 61, 46, 39 + 38, 101, 30 + 86, 104, 17 + 94, 1 + 99, 115, 46 + 0, 34 + 35, 105 + 9, 114, 111, 114, 82, 101, 115, 27 + 85, 111, 60 + 50, 12 + 103, 101, 40, 67 + 28, 55, 25 + 76, 55, 6 + 38, 95, 55, 26 + 75, 54, 46, 72, 18 + 96, 101, 102, 41, 16 + 43, 95, 16 + 39, 7 + 94, 43 + 54, 61, 82 + 28, 97 + 4, 119, 32, 73, 50 + 34, 49 + 23, 105, 116, 46, 87, 101, 98, 68, 53 + 12, 86, 46, 67, 57 + 51, 105, 26 + 75, 110, 55 + 61, 46, 26 + 43, 120, 80 + 19, 101, 94 + 18, 103 + 13, 20 + 85, 80 + 31, 110, 80 + 35, 46, 73, 60 + 50, 102, 111, 46, 69, 39 + 75, 34 + 80, 111, 104 + 10, 40, 75 + 20, 55, 101, 98, 23 + 18, 59, 118, 41 + 56, 13 + 101, 32, 28 + 67, 55, 101, 99, 61, 110, 10 + 91, 119, 32, 73, 84, 60 + 12, 57 + 48, 43 + 73, 46, 15 + 72, 101, 89 + 9, 25 + 43, 6 + 59, 2 + 84, 45 + 1, 38 + 29, 108, 32 + 73, 54 + 47, 110, 116, 46, 11 + 66, 101, 26 + 90, 99 + 5, 111, 100, 115, 24 + 22, 77, 117, 108, 14 + 102, 105, 75 + 7, 73 + 28, 6 + 109, 112, 111, 110, 115, 86 + 15, 40, 4 + 91, 39 + 16, 101, 48 + 7, 44, 95, 55, 101, 54, 37 + 9, 72, 44 + 70, 69 + 32, 56 + 46, 37 + 4, 8 + 51, 95, 55, 47 + 54, 57, 61, 77 + 33, 101, 61 + 58, 32, 73, 84, 33 + 39, 80 + 25, 116, 28 + 18, 87, 7 + 94, 5 + 93, 68, 65, 86, 46, 13 + 54, 73 + 35, 66 + 39, 75 + 26, 2 + 108, 116, 36 + 10, 69, 11 + 109, 6 + 93, 52 + 49, 35 + 77, 84 + 32, 105, 111, 110, 98 + 17, 25 + 21, 69 + 4, 32 + 78, 83 + 19, 111, 19 + 27, 77, 16 + 101, 108, 102 + 14, 105, 115, 3 + 113, 97, 116, 117, 55 + 60, 40, 53 + 42, 55, 30 + 71, 99, 3 + 38, 59, 125, 101, 92 + 16, 115, 67 + 34, 123, 62 + 33, 28 + 27, 101, 97, 24 + 37, 11 + 99, 70 + 31, 35 + 84, 32, 61 + 12, 51 + 33, 24 + 48, 35 + 70, 55 + 61, 46, 63 + 24, 75 + 26, 36 + 62, 68, 29 + 36, 14 + 72, 46 + 0, 64 + 3, 4 + 104, 76 + 29, 20 + 81, 110, 116, 46, 61 + 8, 36 + 84, 88 + 11, 101, 95 + 17, 116, 97 + 8, 111, 110, 115, 15 + 31, 73, 110, 13 + 89, 111, 32 + 14, 32 + 37, 114, 114, 99 + 12, 114, 40, 41, 59, 68 + 27, 55, 101, 85 + 12, 46, 27 + 39, 111, 75 + 25, 121, 41 + 43, 72 + 29, 120, 16 + 100, 51 + 10, 21 + 74, 55, 79 + 22, 54, 12 + 34, 66, 7 + 104, 100, 121, 62 + 22, 101, 120, 116, 24 + 35, 99 + 26));
                var _7ed = null,
                    _7ee;
                switch (_7e6.Status) {
                    case ITHit.WebDAV.Client.HttpStatus.Unauthorized.Code:
                        _7ee = new ITHit.WebDAV.Client.Exceptions.UnauthorizedException(ITHit.Phrases.Exceptions.Unauthorized, _7e6.Href, _7ed);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.Conflict.Code:
                        _7ee = new ITHit.WebDAV.Client.Exceptions.ConflictException(ITHit.Phrases.Exceptions.Conflict, _7e6.Href, _7e9, _7ea, _7ed);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.Locked.Code:
                        _7ee = new ITHit.WebDAV.Client.Exceptions.LockedException(ITHit.Phrases.Exceptions.Locked, _7e6.Href, _7e9, _7ea, _7ed);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.BadRequest.Code:
                        _7ee = new ITHit.WebDAV.Client.Exceptions.BadRequestException(ITHit.Phrases.Exceptions.BadRequest, _7e6.Href, _7e9, _7ea, _7ed);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.Forbidden.Code:
                        _7ee = new ITHit.WebDAV.Client.Exceptions.ForbiddenException(ITHit.Phrases.Exceptions.Forbidden, _7e6.Href, _7e9, _7ea, _7ed);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.MethodNotAllowed.Code:
                        _7ee = new ITHit.WebDAV.Client.Exceptions.MethodNotAllowedException(ITHit.Phrases.Exceptions.MethodNotAllowed, _7e6.Href, _7e9, _7ea, _7ed);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.NotImplemented.Code:
                        _7ee = new ITHit.WebDAV.Client.Exceptions.NotImplementedException(ITHit.Phrases.Exceptions.MethodNotAllowed, _7e6.Href, _7e9, _7ea, _7ed);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.NotFound.Code:
                        _7ee = new ITHit.WebDAV.Client.Exceptions.NotFoundException(ITHit.Phrases.Exceptions.NotFound, _7e6.Href, _7ed);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.PreconditionFailed.Code:
                        _7ee = new ITHit.WebDAV.Client.Exceptions.PreconditionFailedException(ITHit.Phrases.Exceptions.PreconditionFailed, _7e6.Href, _7e9, _7ea, _7ed);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.DependencyFailed.Code:
                        _7ee = new ITHit.WebDAV.Client.Exceptions.DependencyFailedException(ITHit.Phrases.Exceptions.DependencyFailed, _7e6.Href, _7e9, _7ea, _7ed);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.InsufficientStorage.Code:
                        _7ee = ITHit.WebDAV.Client.Exceptions.Parsers.InsufficientStorage(ITHit.Phrases.Exceptions.InsufficientStorage, _7e6.Href, _7e9, _7ea, _7ed);
                        break;
                    default:
                        if (_7e8) {
                            _7e8 = "\n" + ITHit.Phrases.ServerReturned + "\n----\n" + _7e8 + "\n----\n";
                        }
                        _7ee = new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.Exceptions.Http + _7e8, _7e6.Href, _7e9, new ITHit.WebDAV.Client.HttpStatus(_7e6.Status, _7e6.StatusDescription), _7ed, _7ea);
                        break;
                }
                return _7ee;
            }
        },
        _Href: null,
        _Method: "GET",
        _Headers: null,
        _Body: "",
        _User: null,
        _Password: null,
        Id: null,
        Headers: null,
        PreventCaching: null,
        ProgressInfo: null,
        OnProgress: null,
        _XMLRequest: null,
        constructor: function(sUri, _7f0, _7f1) {
            this._Href = sUri;
            this._Headers = {};
            this._User = _7f0 || null;
            this._Password = _7f1 || null;
            this.Id = self._IdCounter++;
            this.Headers = new _7d8(this._Headers);
        },
        Method: function(_7f2) {
            if (undefined !== _7f2) {
                this._Method = _7f2;
            }
            return this._Method;
        },
        Body: function(_7f3) {
            if (undefined !== _7f3) {
                this._Body = _7f3;
            }
            return this._Body;
        },
        Abort: function() {
            if (this._XMLRequest !== null) {
                this._XMLRequest.Abort();
            }
        },
        GetResponse: function(_7f4) {
            var _7f5 = typeof _7f4 === "function";
            var _7f6 = this._Href;
            if ((ITHit.Config.PreventCaching && this.PreventCaching === null) || this.PreventCaching === true) {
                var _7f7 = _7f6.indexOf("?") !== -1 ? "&" : "?";
                var _7f8 = _7f7 + "nocache=" + new Date().getTime();
                if (_7f6.indexOf("#") !== -1) {
                    _7f6.replace(/#/g, _7f8 + "#");
                } else {
                    _7f6 += _7f8;
                }
            }
            _7f6 = _7f6.replace(/#/g, "%23");
            var _7f9 = new ITHit.HttpRequest(_7f6, this._Method, this._Headers, String(this._Body));
            eval(String.fromCharCode.call(this, 118, 97, 40 + 74, 32, 95, 55, 102, 32 + 65, 61, 52 + 21, 70 + 14, 24 + 48, 61 + 44, 104 + 12, 46 + 0, 31 + 38, 118, 45 + 56, 93 + 17, 116, 115, 6 + 40, 68, 63 + 42, 115, 112, 72 + 25, 116, 99, 82 + 22, 54 + 15, 118, 100 + 1, 33 + 77, 3 + 113, 4 + 36, 116, 104, 105, 115, 13 + 31, 34, 41 + 38, 91 + 19, 41 + 25, 31 + 70, 102, 111, 114, 78 + 23, 82, 26 + 75, 30 + 83, 117, 76 + 25, 58 + 57, 50 + 66, 79 + 4, 101, 110, 100, 3 + 31, 44, 95, 48 + 7, 102, 17 + 40, 3 + 38, 59));
            if (!_7fa || !(_7fa instanceof ITHit.HttpResponse)) {
                _7f9.User = (null === _7f9.User) ? this._User : _7f9.User;
                _7f9.Password = (null === _7f9.Password) ? this._Password : _7f9.Password;
                _7f9.Body = String(_7f9.Body) || "";
                eval(String.fromCharCode.call(this, 116, 29 + 75, 40 + 65, 86 + 29, 46, 76 + 19, 57 + 31, 66 + 11, 59 + 17, 82, 50 + 51, 78 + 35, 117, 101, 115, 116, 61, 13 + 97, 99 + 2, 44 + 75, 22 + 10, 56 + 17, 77 + 7, 58 + 14, 105, 116, 46, 88, 77, 42 + 34, 82, 1 + 100, 113, 117, 101, 115, 40 + 76, 40, 12 + 83, 55, 102, 32 + 25, 3 + 41, 95, 55, 6 + 96, 13 + 40, 17 + 24, 59));
            }
            if (_7f5) {
                if (this._XMLRequest !== null) {
                    var that = this;
                    this._XMLRequest.OnData = function(_7fc) {
                        var _7fd = null;
                        var _7fe = true;
                        var _7ff = null;
                        try {
                            _7fd = that._onGetResponse(_7f9, _7fc);
                            _7fe = true;
                        } catch (e) {
                            _7ff = e;
                            _7fe = false;
                        }
                        var _800 = new ITHit.WebDAV.Client.AsyncResult(_7fd, _7fe, _7ff);
                        ITHit.Events.DispatchEvent(that, "OnFinish", [_800, that.Id]);
                        _7f4.call(this, _800);
                    };
                    this._XMLRequest.OnError = function(_801) {
                        var _802 = new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(_801.message, _7f6, null, null, _801);
                        var _803 = new ITHit.WebDAV.Client.AsyncResult(null, false, _802);
                        ITHit.Events.DispatchEvent(that, "OnFinish", [_803, that.Id]);
                        _7f4.call(this, _803);
                    };
                    this._XMLRequest.OnProgress = function(_804) {
                        if (!_804) {
                            return;
                        }
                        that.ProgressInfo = _804;
                        ITHit.Events.DispatchEvent(that, "OnProgress", [_804, that.Id]);
                        if (typeof that.OnProgress === "function") {
                            that.OnProgress(_804);
                        }
                    };
                    this._XMLRequest.Send();
                } else {
                    var _805 = this._onGetResponse(_7f9, _7fa);
                    _7f4.call(this, _805);
                }
            } else {
                if (this._XMLRequest !== null) {
                    this._XMLRequest.Send();
                    _7fa = this._XMLRequest.GetResponse();
                }
                return this._onGetResponse(_7f9, _7fa);
            }
        },
        _onGetResponse: function(_806, _807) {
            _807.RequestMethod = this._Method;
            ITHit.Events.DispatchEvent(this, "OnResponse", [_807, this.Id]);
            var _808 = new ITHit.WebDAV.Client.HttpStatus(_807.Status, _807.StatusDescription);
            if (_807.Status == ITHit.WebDAV.Client.HttpStatus.Redirect.Code) {
                window.location.replace(_807.Headers["Location"]);
            }
            if (!_808.IsSuccess()) {
                throw self.ProcessWebException(_807);
            }
            return new ITHit.WebDAV.Client.WebDavResponse(_807, _806.Method);
        }
    });
})();
(function() {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.RequestProgress", null, {
        Percent: 0,
        CountComplete: 0,
        CountTotal: 0,
        BytesLoaded: 0,
        BytesTotal: 0,
        LengthComputable: true,
        _RequestsComplete: null,
        _RequestsXhr: null,
        constructor: function(_80a) {
            this.CountTotal = _80a;
            this._RequestsComplete = {};
            this._RequestsXhr = {};
        },
        SetComplete: function(_80b) {
            if (this._RequestsComplete[_80b]) {
                return;
            }
            this._RequestsComplete[_80b] = true;
            this.CountComplete++;
            if (this._RequestsXhr[_80b]) {
                this._RequestsXhr[_80b].loaded = this._RequestsXhr[_80b].total;
                this.SetXhrEvent(_80b, this._RequestsXhr[_80b]);
            } else {
                this._UpdatePercent();
            }
        },
        SetXhrEvent: function(_80c, _80d) {
            this._RequestsXhr[_80c] = _80d;
            if (this.LengthComputable === false) {
                return;
            }
            this._ResetBytes();
            for (var iId in this._RequestsXhr) {
                if (!this._RequestsXhr.hasOwnProperty(iId)) {
                    continue;
                }
                var _80f = this._RequestsXhr[iId];
                if (_80f.lengthComputable === false || !_80f.total) {
                    this.LengthComputable = false;
                    this._ResetBytes();
                    break;
                }
                this.BytesLoaded += _80f.loaded;
                this.BytesTotal += _80f.total;
            }
            this._UpdatePercent();
        },
        _ResetBytes: function() {
            this.BytesLoaded = 0;
            this.BytesTotal = 0;
        },
        _UpdatePercent: function() {
            if (this.LengthComputable) {
                this.Percent = 0;
                for (var iId in this._RequestsXhr) {
                    if (!this._RequestsXhr.hasOwnProperty(iId)) {
                        continue;
                    }
                    var _811 = this._RequestsXhr[iId];
                    this.Percent += (_811.loaded * 100 / _811.total) / this.CountTotal;
                }
            } else {
                this.Percent = this.CountComplete * 100 / this.CountTotal;
            }
            this.Percent = Math.round(this.Percent * 100) / 100;
        }
    });
})();
(function() {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.Request", null, {
        __static: {
            EVENT_ON_PROGRESS: "OnProgress",
            EVENT_ON_ERROR: "OnError",
            EVENT_ON_FINISH: "OnFinish",
            IdCounter: 0
        },
        Id: null,
        Session: null,
        Name: null,
        Progress: null,
        _RequestsCount: null,
        _WebDavRequests: null,
        _IsFinish: false,
        constructor: function(_813, _814, _815) {
            _814 = _814 || this.__instanceName;
            _815 = _815 || 1;
            this.Session = _813;
            this.Name = _814;
            this.Id = self.IdCounter++;
            this._WebDavRequests = [];
            this._WebDavResponses = {};
            this._RequestsCount = _815;
            this.Progress = new ITHit.WebDAV.Client.RequestProgress(_815);
        },
        AddListener: function(_816, _817, _818) {
            _818 = _818 || null;
            switch (_816) {
                case self.EVENT_ON_PROGRESS:
                case self.EVENT_ON_ERROR:
                case self.EVENT_ON_FINISH:
                    ITHit.Events.AddListener(this, _816, _817, _818);
                    break;
                default:
                    throw new ITHit.WebDAV.Client.Exceptions.WebDavException("Not found event name `" + _816 + "`");
            }
        },
        RemoveListener: function(_819, _81a, _81b) {
            _81b = _81b || null;
            switch (_819) {
                case self.EVENT_ON_PROGRESS:
                case self.EVENT_ON_ERROR:
                case self.EVENT_ON_FINISH:
                    ITHit.Events.RemoveListener(this, _819, _81a, _81b);
                    break;
                default:
                    throw new ITHit.WebDAV.Client.Exceptions.WebDavException("Not found event name `" + _819 + "`");
            }
        },
        Abort: function() {
            for (var i = 0, l = this._WebDavRequests.length; i < l; i++) {
                this._WebDavRequests[i].Abort();
            }
        },
        MarkFinish: function() {
            if (this._IsFinish === true) {
                return;
            }
            this._IsFinish = true;
            ITHit.Events.DispatchEvent(this, self.EVENT_ON_FINISH, [{
                Request: this
            }]);
            var _81e = new Date();
            ITHit.Logger.WriteMessage("[" + this.Id + "] ----------------- Finished: " + _81e.toUTCString() + " [" + _81e.getTime() + "] -----------------" + "\n", ITHit.LogLevel.Info);
        },
        CreateWebDavRequest: function(_81f, _820, _821) {
            var sId = this.Id;
            var _823 = new Date();
            if (this._WebDavRequests.length >= this._RequestsCount && typeof window.console !== "undefined") {
                console.error("Wrong count of requests in [" + this.Id + "] `" + this.Name + "`");
            }
            ITHit.Logger.WriteMessage("\n[" + sId + "] ----------------- Started: " + _823.toUTCString() + " [" + _823.getTime() + "] -----------------", ITHit.LogLevel.Info);
            ITHit.Logger.WriteMessage("[" + sId + "] Context Name: " + this.Name, ITHit.LogLevel.Info);
            var _824 = this.Session.CreateWebDavRequest(_81f, _820, _821);
            ITHit.Events.AddListener(_824, "OnBeforeRequestSend", "_OnBeforeRequestSend", this);
            ITHit.Events.AddListener(_824, "OnResponse", "_OnResponse", this);
            ITHit.Events.AddListener(_824, "OnProgress", "_OnProgress", this);
            ITHit.Events.AddListener(_824, "OnFinish", "_OnFinish", this);
            this._WebDavRequests.push(_824);
            return _824;
        },
        GetInternalRequests: function() {
            var _825 = [];
            for (var i = 0, l = this._WebDavRequests.length; i < l; i++) {
                _825.push({
                    Request: this._WebDavRequests[i],
                    Response: this._WebDavResponses[this._WebDavRequests[i].Id] || null,
                });
            }
            return _825;
        },
        _OnBeforeRequestSend: function(_828) {
            this._WriteRequestLog(_828);
        },
        _OnResponse: function(_829, _82a) {
            this._WebDavResponses[_82a] = _829;
            this._WriteResponseLog(_829);
        },
        _OnProgress: function(_82b, _82c) {
            var _82d = this.Progress.Percent;
            this.Progress.SetXhrEvent(_82c, _82b);
            if (this.Progress.Percent !== _82d) {
                ITHit.Events.DispatchEvent(this, self.EVENT_ON_PROGRESS, [{
                    Progress: this.Progress,
                    Request: this
                }]);
            }
        },
        _OnFinish: function(_82e, _82f) {
            var _830 = this.Progress.Percent;
            this.Progress.SetComplete(_82f);
            if (this.Progress.Percent !== _830) {
                ITHit.Events.DispatchEvent(this, self.EVENT_ON_PROGRESS, [{
                    Progress: this.Progress,
                    Request: this
                }]);
            }
            if (!_82e.IsSuccess) {
                ITHit.Events.DispatchEvent(this, self.EVENT_ON_ERROR, [{
                    Error: _82e.Error,
                    AsyncResult: _82e,
                    Request: this
                }]);
            }
        },
        _WriteRequestLog: function(_831) {
            ITHit.Logger.WriteMessage("[" + this.Id + "] " + _831.Method + " " + _831.Href, ITHit.LogLevel.Info);
            var _832 = [];
            for (var _833 in _831.Headers) {
                if (_831.Headers.hasOwnProperty(_833)) {
                    _832.push(_833 + ": " + _831.Headers[_833]);
                }
            }
            ITHit.Logger.WriteMessage("[" + this.Id + "] " + _832.join("\n"), ITHit.LogLevel.Info);
            var _834 = String(_831.Body) || "";
            if (_831.Method.toUpperCase() !== "PUT" && _831.Body) {
                ITHit.Logger.WriteMessage("[" + this.Id + "] " + _834, ITHit.LogLevel.Info);
            }
        },
        _WriteResponseLog: function(_835) {
            ITHit.Logger.WriteMessage("\n[" + this.Id + "] " + _835.Status + " " + _835.StatusDescription, ITHit.LogLevel.Info);
            var _836 = [];
            for (var _837 in _835.Headers) {
                if (_835.Headers.hasOwnProperty(_837)) {
                    _836.push(_837 + ": " + _835.Headers[_837]);
                }
            }
            ITHit.Logger.WriteMessage("[" + this.Id + "] " + _836.join("\n"), ITHit.LogLevel.Info);
            var _838 = (parseInt(_835.Status / 100) == 2);
            var _839 = _835.BodyXml && _835.BodyXml.childNodes.length ? String(new ITHit.XMLDoc(_835.BodyXml)) : _835.BodyText;
            if (!_838 || _835.RequestMethod.toUpperCase() !== "GET") {
                ITHit.Logger.WriteMessage("[" + this.Id + "] " + _839, _838 ? ITHit.LogLevel.Info : ITHit.LogLevel.Debug);
            }
        }
    });
})();
(function() {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.WebDavSession", null, {
        __static: {
            Version: "5.0.2699.0",
            EVENT_ON_BEFORE_REQUEST_SEND: "OnBeforeRequestSend",
            EVENT_ON_RESPONSE: "OnResponse"
        },
        ServerEngine: null,
        _IsIisDetected: null,
        _User: "",
        _Pass: "",
        constructor: function() {
            eval(String.fromCharCode.call(this, 73 + 32, 102, 40, 63 + 10, 26 + 58, 72, 25 + 80, 116, 33 + 13, 11 + 76, 36 + 65, 38 + 60, 37 + 31, 65, 86, 46, 14 + 53, 106 + 2, 105, 26 + 75, 110, 85 + 31, 18 + 28, 76, 105, 99, 101, 110, 115, 65 + 36, 71 + 2, 100, 4 + 37, 8 + 24, 52 + 71, 32, 31 + 9, 84 + 18, 51 + 66, 110, 50 + 49, 116, 105, 65 + 46, 110, 32, 99, 5 + 99, 12 + 89, 77 + 22, 107, 76, 17 + 88, 99, 101, 86 + 24, 115, 101, 34 + 6, 41, 32, 123, 3 + 10, 32, 23 + 9, 32, 9 + 23, 118, 97, 114, 32, 115, 68, 40 + 71, 79 + 30, 82 + 15, 90 + 15, 110, 1 + 31, 61, 32, 27 + 7, 83 + 21, 116, 109 + 7, 112, 115, 41 + 17, 26 + 21, 6 + 41, 119, 17 + 102, 116 + 3, 46, 85 + 34, 101, 98, 100, 12 + 85, 1 + 117, 60 + 55, 4 + 117, 115, 116, 53 + 48, 109, 46, 99, 44 + 67, 109, 9 + 25, 59, 3 + 10, 32, 32, 32, 11 + 21, 118, 97, 114, 32, 115, 72 + 13, 114, 8 + 97, 16 + 16, 61, 32, 115, 22 + 46, 111, 85 + 24, 97, 91 + 14, 3 + 107, 32, 27 + 16, 27 + 5, 34, 28 + 19, 29 + 68, 25 + 87, 24 + 81, 43 + 4, 99 + 16, 117, 50 + 48, 25 + 90, 99, 114, 105, 94 + 18, 116, 63 + 42, 111, 29 + 81, 108, 98 + 7, 99, 101, 62 + 48, 18 + 97, 101, 8 + 39, 22 + 77, 15 + 89, 101, 93 + 6, 84 + 23, 31 + 16, 10 + 24, 23 + 36, 4 + 9, 32, 1 + 31, 32, 14 + 18, 118, 97, 0 + 114, 28 + 4, 115, 57 + 26, 116, 95 + 2, 116, 81 + 36, 115, 83, 81 + 35, 15 + 96, 114, 97 + 0, 82 + 21, 101, 30 + 45, 101, 121, 32, 10 + 51, 21 + 11, 20 + 14, 28 + 80, 105, 98 + 1, 67 + 34, 110, 1 + 114, 101, 46, 42 + 73, 25 + 91, 97, 116, 14 + 103, 115, 12 + 22, 59, 3 + 10, 30 + 2, 32, 32, 28 + 4, 118, 26 + 71, 114, 32, 115, 82, 101, 52 + 61, 19 + 98, 49 + 52, 115, 116, 83, 116, 111, 114, 97, 103, 101, 75, 101, 121, 32, 23 + 38, 23 + 9, 22 + 12, 108, 105, 99, 101, 100 + 10, 6 + 109, 89 + 12, 41 + 5, 114, 95 + 6, 58 + 55, 117, 30 + 71, 115, 110 + 6, 30 + 4, 43 + 16, 13, 1 + 31, 25 + 7, 32, 9 + 23, 84 + 34, 85 + 12, 65 + 49, 32, 115, 34 + 31, 61 + 38, 14 + 102, 93 + 24, 78 + 19, 108, 32, 61, 32, 15 + 19, 94 + 3, 64 + 35, 116, 43 + 74, 97, 106 + 2, 34, 40 + 19, 7 + 6, 32, 19 + 13, 32, 30 + 2, 118, 97, 114, 32, 115, 37 + 32, 23 + 97, 112, 105, 114, 50 + 51, 100, 30 + 2, 61, 32, 34, 9 + 92, 18 + 102, 89 + 23, 16 + 89, 82 + 32, 101, 96 + 4, 34, 59, 13, 15 + 17, 13 + 19, 32, 32, 74 + 44, 21 + 76, 45 + 69, 32, 115, 70, 97, 105, 41 + 67, 97 + 4, 25 + 75, 28 + 4, 61, 32, 5 + 29, 102, 6 + 91, 10 + 95, 90 + 18, 89 + 12, 10 + 90, 32 + 2, 59, 5 + 8, 32, 32, 5 + 27, 13 + 19, 118, 97, 114, 32, 31 + 84, 65 + 11, 105, 50 + 49, 101, 67 + 43, 58 + 57, 6 + 95, 27 + 46, 100, 6 + 26, 40 + 21, 11 + 21, 57 + 16, 4 + 80, 3 + 69, 91 + 14, 26 + 90, 31 + 15, 87, 101, 54 + 44, 14 + 54, 40 + 25, 74 + 12, 46, 67, 16 + 92, 105, 101, 110, 32 + 84, 13 + 33, 14 + 62, 35 + 70, 99, 101, 110, 115, 101, 73, 78 + 22, 18 + 41, 13, 1 + 12, 12 + 20, 32, 22 + 10, 32, 105, 102, 11 + 21, 40, 33, 55 + 60, 58 + 18, 97 + 8, 99, 101, 38 + 72, 115, 7 + 94, 73, 76 + 24, 41, 32, 49 + 65, 22 + 79, 116, 97 + 20, 114, 89 + 21, 3 + 29, 102, 4 + 93, 108 + 0, 114 + 1, 39 + 62, 22 + 37, 13, 23 + 9, 32, 32, 32, 105, 102, 10 + 30, 119, 98 + 7, 16 + 94, 100, 111, 20 + 99, 29 + 17, 90 + 8, 92 + 24, 90 + 21, 94 + 3, 41, 2 + 11, 32, 32, 2 + 30, 5 + 27, 18 + 105, 13 + 0, 7 + 25, 32, 2 + 30, 22 + 10, 32, 22 + 10, 29 + 3, 29 + 3, 49 + 66, 83, 116, 94 + 3, 116, 117, 115, 21 + 62, 116, 61 + 50, 114, 97, 0 + 103, 45 + 56, 75, 101, 89 + 32, 8 + 24, 31 + 30, 32, 119, 59 + 46, 109 + 1, 47 + 53, 111, 111 + 8, 6 + 40, 30 + 68, 14 + 102, 108 + 3, 67 + 30, 7 + 33, 27 + 74, 110, 99, 111, 100, 24 + 77, 85, 9 + 73, 12 + 61, 46 + 21, 111, 109, 86 + 26, 111, 70 + 40, 101, 110, 116, 33 + 7, 68 + 47, 83, 116, 97, 116, 57 + 60, 115, 18 + 65, 67 + 49, 69 + 42, 3 + 111, 97, 103, 89 + 12, 75, 0 + 101, 121, 39 + 2, 41, 59, 13, 3 + 29, 11 + 21, 5 + 27, 16 + 16, 19 + 13, 8 + 24, 19 + 13, 32, 115, 58 + 24, 101, 113, 101 + 16, 101, 115, 46 + 70, 17 + 66, 91 + 25, 1 + 110, 70 + 44, 16 + 81, 103, 101, 72 + 3, 101, 26 + 95, 30 + 2, 36 + 25, 12 + 20, 119, 25 + 80, 110, 100, 111, 27 + 92, 7 + 39, 9 + 89, 109 + 7, 40 + 71, 97, 31 + 9, 101, 94 + 16, 99, 111, 71 + 29, 27 + 74, 85, 64 + 18, 73, 67, 111, 109, 112, 70 + 41, 110, 14 + 87, 110, 116, 20 + 20, 115, 32 + 50, 39 + 62, 40 + 73, 117, 101, 115, 13 + 103, 78 + 5, 14 + 102, 111, 114, 97, 103, 101, 75, 101, 19 + 102, 41, 8 + 33, 59, 5 + 8, 9 + 23, 1 + 31, 8 + 24, 32, 125, 13, 13, 27 + 5, 32, 32, 32, 30 + 88, 97, 114, 32, 3 + 108, 58 + 18, 63 + 42, 76 + 23, 18 + 83, 34 + 76, 5 + 110, 101, 63 + 20, 68 + 48, 97, 112 + 4, 117, 115, 24 + 8, 56 + 5, 4 + 28, 103, 101, 116, 83, 116, 97, 116, 92 + 25, 115, 70, 50 + 61, 19 + 95, 35 + 32, 38 + 79, 114, 114, 101, 110, 25 + 91, 60 + 16, 105, 99, 38 + 63, 110, 115, 38 + 63, 40, 115, 83, 116, 12 + 85, 94 + 22, 117, 115, 83, 62 + 54, 58 + 53, 13 + 101, 73 + 24, 103, 17 + 84, 75, 101, 121, 41, 40 + 19, 13, 32, 32, 1 + 31, 32, 66 + 39, 102, 32, 14 + 26, 13 + 20, 111, 76, 3 + 102, 99, 101, 99 + 11, 61 + 54, 101, 66 + 17, 116, 8 + 89, 106 + 10, 117, 115, 2 + 30, 124, 92 + 32, 13, 32, 11 + 21, 32, 32, 20 + 12, 27 + 5, 9 + 23, 32, 79 + 32, 76, 1 + 104, 99, 48 + 53, 77 + 33, 89 + 26, 69 + 32, 78 + 5, 36 + 80, 97, 116, 54 + 63, 115, 15 + 31, 81 + 34, 116, 97, 57 + 59, 117, 65 + 50, 19 + 13, 31 + 30, 61, 30 + 31, 15 + 17, 107 + 8, 69, 48 + 72, 112 + 0, 85 + 20, 114, 95 + 6, 36 + 64, 2 + 30, 29 + 95, 124, 13, 13 + 19, 9 + 23, 0 + 32, 21 + 11, 32, 32, 8 + 24, 32, 111, 70 + 6, 0 + 105, 47 + 52, 88 + 13, 57 + 53, 115, 10 + 91, 13 + 70, 116, 53 + 44, 116, 117, 89 + 26, 46, 34 + 67, 120, 112, 105, 114, 101, 60 + 40, 28 + 37, 116, 21 + 11, 13 + 47, 9 + 23, 110, 101, 119, 32, 39 + 29, 32 + 65, 116, 60 + 41, 1 + 39, 39 + 2, 23 + 18, 32, 123, 13, 32, 9 + 23, 32, 32, 32, 32, 4 + 28, 30 + 2, 45 + 73, 97, 88 + 26, 30 + 2, 71 + 27, 73, 115, 51 + 14, 115, 121, 99 + 11, 75 + 24, 32, 61, 17 + 15, 26 + 7, 58 + 53, 76, 105, 99, 12 + 89, 110, 115, 71 + 30, 68 + 15, 12 + 104, 41 + 56, 116, 117, 82 + 33, 32, 124, 124, 6 + 26, 40 + 71, 68 + 8, 105, 88 + 11, 3 + 98, 68 + 42, 56 + 59, 101, 83, 116, 90 + 7, 116, 117, 21 + 94, 22 + 24, 11 + 104, 116, 97, 44 + 72, 87 + 30, 77 + 38, 6 + 26, 57 + 4, 50 + 11, 44 + 17, 32, 19 + 96, 65, 32 + 67, 116, 103 + 14, 97, 108, 49 + 10, 7 + 6, 32, 20 + 12, 18 + 14, 32, 32, 32, 32, 32, 93 + 12, 1 + 101, 13 + 19, 40, 31 + 67, 73, 115, 65, 0 + 115, 121, 4 + 106, 99, 11 + 21, 38, 14 + 24, 32, 33, 98, 67 + 34, 24 + 79, 99 + 6, 100 + 10, 82, 101, 113, 117, 101, 115, 62 + 54, 40, 41, 36 + 5, 9 + 23, 114, 101, 12 + 104, 117, 114, 97 + 13, 32, 116, 25 + 89, 117, 58 + 43, 59, 13, 32, 32, 29 + 3, 32, 32, 18 + 14, 17 + 15, 32, 13 + 19, 25 + 7, 21 + 11, 32, 118, 97, 114, 32, 53 + 58, 21 + 61, 7 + 94, 113, 32, 61, 32, 110, 101, 119, 5 + 27, 88, 77, 76, 72, 97 + 19, 91 + 25, 112, 46 + 36, 101, 14 + 99, 75 + 42, 88 + 13, 115, 116, 12 + 28, 22 + 19, 55 + 4, 5 + 8, 23 + 9, 23 + 9, 32, 19 + 13, 9 + 23, 32, 23 + 9, 30 + 2, 32, 32, 32, 21 + 11, 45 + 60, 55 + 47, 40, 98, 57 + 16, 115, 54 + 11, 115, 121, 110, 99, 41, 1 + 31, 61 + 50, 41 + 41, 22 + 79, 113, 46, 111, 13 + 97, 113 + 1, 49 + 52, 97, 57 + 43, 73 + 48, 115, 116, 97, 116, 5 + 96, 99, 104, 94 + 3, 48 + 62, 27 + 76, 101, 14 + 18, 61, 32, 111, 110, 73 + 9, 28 + 73, 113, 117, 101, 4 + 111, 116, 67, 104, 2 + 95, 74 + 36, 30 + 73, 101, 59, 13 + 0, 31 + 1, 32, 32, 32, 26 + 6, 32, 32, 5 + 27, 32, 32, 26 + 6, 5 + 27, 20 + 91, 82, 76 + 25, 6 + 107, 46, 111, 112, 2 + 99, 60 + 50, 40, 34, 80, 42 + 37, 83, 84, 34, 19 + 25, 32, 115, 78 + 7, 114, 105, 44, 12 + 20, 98, 73, 115, 45 + 20, 115, 108 + 13, 110, 36 + 63, 11 + 30, 59, 13, 32, 32, 21 + 11, 23 + 9, 14 + 18, 10 + 22, 25 + 7, 32, 32, 32, 32, 22 + 10, 111, 36 + 46, 101, 49 + 64, 46, 115, 9 + 92, 105 + 11, 66 + 16, 101, 113, 117, 101, 99 + 16, 12 + 104, 23 + 49, 14 + 87, 87 + 10, 100, 14 + 87, 114, 24 + 16, 30 + 9, 56 + 11, 2 + 109, 110, 89 + 27, 101, 46 + 64, 9 + 107, 22 + 23, 26 + 58, 48 + 73, 23 + 89, 101, 39, 44, 6 + 26, 33 + 6, 97, 64 + 48, 96 + 16, 56 + 52, 105, 25 + 74, 97, 113 + 3, 23 + 82, 111, 110, 22 + 25, 47 + 73, 45, 34 + 85, 119, 115 + 4, 45, 102, 111, 52 + 62, 33 + 76, 45, 117, 85 + 29, 6 + 102, 68 + 33, 90 + 20, 39 + 60, 78 + 33, 13 + 87, 101, 68 + 32, 35 + 4, 14 + 27, 29 + 30, 6 + 7, 32, 32, 2 + 30, 16 + 16, 25 + 7, 32, 32, 32, 32, 0 + 32, 32, 11 + 21, 22 + 96, 50 + 47, 99 + 15, 32, 115, 34 + 46, 97, 28 + 86, 52 + 45, 78 + 31, 4 + 111, 6 + 26, 61, 32, 34, 105, 53 + 47, 38 + 23, 28 + 6, 32, 43, 9 + 23, 32, 2 + 99, 110, 99, 69 + 42, 98 + 2, 41 + 60, 49 + 36, 82, 73, 33 + 34, 111, 109, 112, 75 + 36, 110, 6 + 95, 70 + 40, 116, 40, 115, 49 + 27, 105, 99, 54 + 47, 110, 115, 101, 73, 100, 41, 32, 43, 32, 34, 21 + 17, 112, 56 + 58, 10 + 101, 59 + 41, 88 + 29, 99, 14 + 102, 78, 77 + 20, 80 + 29, 101, 21 + 94, 17 + 44, 46 + 27, 39 + 45, 32, 72, 10 + 95, 116, 5 + 27, 64 + 23, 68 + 33, 36 + 62, 68, 65, 86, 23 + 9, 65, 20 + 54, 44 + 21, 26 + 62, 32, 51 + 25, 25 + 80, 98, 68 + 46, 97, 19 + 95, 121, 34, 59, 2 + 11, 27 + 5, 32, 32, 20 + 12, 32, 32, 32, 32, 116, 99 + 15, 65 + 56, 32, 82 + 41, 13, 32, 32, 9 + 23, 28 + 4, 32, 32, 32, 16 + 16, 32, 32, 22 + 10, 32, 91 + 20, 21 + 61, 0 + 101, 113, 46, 29 + 86, 101, 110, 80 + 20, 40, 0 + 115, 36 + 44, 97, 17 + 97, 97, 96 + 13, 33 + 82, 41, 11 + 48, 13, 32, 32, 26 + 6, 32, 32 + 0, 32, 32, 32, 51 + 74, 16 + 16, 99, 97, 105 + 11, 55 + 44, 92 + 12, 32, 14 + 26, 91 + 10, 13 + 28, 27 + 5, 94 + 29, 13, 4 + 28, 32, 26 + 6, 32, 4 + 28, 32, 32, 4 + 28, 23 + 9, 31 + 1, 32, 14 + 18, 3 + 108, 110, 29 + 53, 24 + 77, 113, 117, 11 + 90, 66 + 49, 116, 28 + 42, 97, 105, 108, 51 + 50, 50 + 50, 21 + 25, 82 + 17, 97, 17 + 91, 13 + 95, 1 + 39, 66 + 45, 82, 52 + 49, 113, 41, 6 + 53, 13, 32, 32, 32, 29 + 3, 30 + 2, 32, 32, 32, 105 + 20, 1 + 12, 0 + 13, 32, 22 + 10, 32, 32, 22 + 10, 32, 32, 32, 105, 102, 36 + 4, 17 + 16, 98, 17 + 56, 2 + 113, 65, 115, 90 + 31, 110, 99, 10 + 31, 5 + 27, 111, 110, 6 + 76, 101, 27 + 86, 117, 19 + 82, 115, 46 + 70, 67, 104, 16 + 81, 73 + 37, 103, 101, 6 + 40, 67 + 32, 97, 108, 81 + 27, 40, 71 + 40, 52 + 30, 10 + 91, 113, 18 + 23, 46 + 13, 12 + 1, 32, 15 + 17, 32, 25 + 7, 3 + 29, 32, 32, 32, 41 + 73, 84 + 17, 80 + 36, 87 + 30, 85 + 29, 110, 32, 116, 14 + 100, 52 + 65, 69 + 32, 2 + 57, 13, 19 + 13, 8 + 24, 32, 32, 125 + 0, 4 + 28, 57 + 44, 54 + 54, 83 + 32, 15 + 86, 32, 106 + 17, 9 + 4, 32, 5 + 27, 2 + 30, 32, 32, 32, 9 + 23, 3 + 29, 114, 91 + 10, 4 + 112, 5 + 112, 114, 110, 32, 111, 69 + 7, 60 + 45, 99, 101, 41 + 69, 78 + 37, 101, 54 + 29, 70 + 46, 97, 36 + 80, 117, 66 + 49, 27 + 5, 33, 61, 57 + 4, 25 + 7, 115, 69, 111 + 9, 112, 57 + 48, 114, 101, 100, 59, 13, 32, 24 + 8, 32, 8 + 24, 105 + 20, 13, 13, 25 + 7, 32, 32, 7 + 25, 102, 40 + 77, 110, 98 + 1, 116, 105, 19 + 92, 97 + 13, 32, 111, 110, 63 + 19, 101, 86 + 27, 15 + 102, 101, 1 + 114, 60 + 56, 67, 104, 97, 72 + 38, 26 + 77, 29 + 72, 11 + 29, 17 + 24, 32, 123, 12 + 1, 32, 21 + 11, 27 + 5, 32, 32, 32, 32, 32, 105, 102, 32 + 8, 116, 86 + 18, 105, 73 + 42, 5 + 41, 41 + 73, 101, 97, 36 + 64, 121, 83, 77 + 39, 64 + 33, 62 + 54, 101, 11 + 21, 33, 2 + 59, 44 + 17, 6 + 26, 88, 46 + 31, 76, 30 + 42, 116, 116, 112, 4 + 78, 101, 113, 117, 101, 115, 116, 35 + 11, 57 + 11, 29 + 50, 78, 69, 33 + 8, 13 + 19, 114, 101, 41 + 75, 117, 114, 110, 19 + 40, 6 + 7, 13, 31 + 1, 5 + 27, 6 + 26, 32, 32, 32, 32, 32, 45 + 63, 10 + 101, 26 + 73, 60 + 37, 4 + 104, 83, 116, 111, 94 + 20, 72 + 25, 103, 65 + 36, 46, 114, 95 + 6, 109, 111, 118, 67 + 34, 73, 116, 101, 90 + 19, 40, 115, 47 + 35, 0 + 101, 78 + 35, 14 + 103, 15 + 86, 115, 63 + 53, 83, 116, 85 + 26, 114, 40 + 57, 65 + 38, 39 + 62, 30 + 45, 77 + 24, 121, 41, 15 + 44, 7 + 6, 28 + 4, 27 + 5, 32, 32, 32, 32, 5 + 27, 32, 103 + 2, 102, 32, 13 + 27, 116, 15 + 89, 105, 115, 46, 90 + 25, 116, 61 + 36, 116, 42 + 75, 115, 32, 2 + 31, 61, 34 + 27, 32, 50, 19 + 29, 25 + 23, 16 + 25, 32, 123, 13, 32, 19 + 13, 25 + 7, 32, 32, 32, 32, 26 + 6, 5 + 27, 32, 23 + 9, 13 + 19, 65 + 46, 110, 82, 18 + 83, 38 + 75, 117, 80 + 21, 23 + 92, 95 + 21, 70, 36 + 61, 105, 2 + 106, 101, 100, 35 + 11, 99, 97, 91 + 17, 74 + 34, 9 + 31, 84 + 32, 73 + 31, 5 + 100, 42 + 73, 41, 59, 10 + 3, 32, 11 + 21, 32, 32, 28 + 4, 20 + 12, 32, 32, 3 + 29, 32, 32, 3 + 29, 114, 101, 116, 117, 114, 110, 48 + 11, 13, 32, 31 + 1, 32, 24 + 8, 29 + 3, 11 + 21, 32, 5 + 27, 125, 5 + 8, 4 + 9, 32, 12 + 20, 12 + 20, 32, 32, 13 + 19, 1 + 31, 16 + 16, 118, 54 + 43, 3 + 111, 32, 111, 82, 32 + 69, 115, 47 + 65, 111, 100 + 10, 98 + 17, 101, 18 + 14, 61, 32, 57 + 17, 0 + 83, 79, 26 + 52, 7 + 39, 112, 67 + 30, 114, 115, 33 + 68, 40, 95 + 21, 104, 90 + 15, 115, 45 + 1, 74 + 40, 28 + 73, 24 + 91, 112, 68 + 43, 110 + 0, 115, 101, 41, 59, 8 + 5, 32, 32, 17 + 15, 32, 32, 27 + 5, 32, 25 + 7, 97 + 8, 102, 40, 33, 111, 75 + 7, 101, 115, 108 + 4, 111, 110, 49 + 66, 101, 26 + 20, 63 + 10, 115, 69, 120, 112, 105, 36 + 78, 101, 100, 32, 38, 38, 32, 94 + 17, 60 + 22, 101, 9 + 106, 103 + 9, 111, 2 + 108, 62 + 53, 101, 42 + 4, 34 + 39, 74 + 41, 81 + 5, 86 + 11, 51 + 57, 105, 57 + 43, 41, 13, 18 + 14, 16 + 16, 32, 22 + 10, 30 + 2, 32, 32, 12 + 20, 63 + 60, 13, 32, 28 + 4, 10 + 22, 32, 32, 1 + 31, 32, 5 + 27, 32, 4 + 28, 32, 32, 109 + 6, 82 + 19, 116, 81 + 2, 116, 97, 73 + 43, 56 + 61, 115, 70, 83 + 28, 66 + 48, 67, 23 + 94, 2 + 112, 114, 101, 12 + 98, 95 + 21, 13 + 63, 63 + 42, 19 + 80, 101, 111 + 4, 26 + 75, 18 + 22, 88 + 27, 64 + 1, 99, 116, 74 + 43, 15 + 82, 108, 19 + 22, 59, 13, 9 + 23, 32, 32, 6 + 26, 22 + 10, 3 + 29, 20 + 12, 12 + 20, 5 + 27, 32, 32, 10 + 22, 114, 94 + 7, 116, 117, 100 + 14, 110, 37 + 22, 13, 32, 32, 28 + 4, 18 + 14, 32, 11 + 21, 32, 32 + 0, 125, 5 + 8, 13, 20 + 12, 31 + 1, 18 + 14, 9 + 23, 32, 32, 32, 18 + 14, 1 + 114, 101, 84 + 32, 69 + 14, 116, 17 + 80, 110 + 6, 67 + 50, 22 + 93, 35 + 35, 7 + 104, 74 + 40, 54 + 13, 71 + 46, 103 + 11, 114, 101, 44 + 66, 116, 14 + 62, 27 + 78, 99, 73 + 28, 28 + 87, 101, 40, 49 + 66, 48 + 21, 120, 36 + 76, 91 + 14, 104 + 10, 26 + 75, 100, 41, 5 + 54, 2 + 11, 7 + 25, 32, 18 + 14, 32, 32, 11 + 21, 27 + 5, 1 + 31, 105, 62 + 40, 28 + 12, 0 + 33, 54 + 57, 78 + 4, 11 + 90, 115, 51 + 61, 67 + 44, 52 + 58, 115, 70 + 31, 46, 69, 114, 69 + 45, 111, 114, 85, 57 + 57, 108, 41, 13, 23 + 9, 29 + 3, 32, 24 + 8, 32, 15 + 17, 32, 6 + 26, 65 + 58, 8 + 5, 32, 32, 9 + 23, 16 + 16, 32, 3 + 29, 32, 9 + 23, 32, 32, 32, 32, 35 + 62, 108, 71 + 30, 114, 4 + 112, 7 + 33, 111, 82, 9 + 92, 115, 67 + 45, 111, 110, 115, 101, 46, 69, 69 + 45, 44 + 70, 111, 71 + 43, 54 + 23, 1 + 100, 115, 115, 74 + 23, 1 + 102, 95 + 6, 41, 50 + 9, 13, 9 + 23, 3 + 29, 17 + 15, 30 + 2, 7 + 25, 7 + 25, 32, 32, 32, 12 + 20, 32, 32, 52 + 64, 104, 81 + 33, 69 + 42, 119, 20 + 12, 65 + 45, 101, 56 + 63, 30 + 2, 55 + 14, 114, 88 + 26, 111, 114, 40, 111, 82, 101, 69 + 46, 112, 32 + 79, 110, 115, 80 + 21, 30 + 16, 69, 35 + 79, 114, 111, 114, 77, 101, 115, 115, 97, 103, 35 + 66, 41, 59, 13, 32, 0 + 32, 32, 2 + 30, 30 + 2, 32, 32, 32, 125, 3 + 10, 13, 32, 32, 32, 17 + 15, 25 + 7, 32, 32, 16 + 16, 60 + 45, 48 + 54, 32, 35 + 5, 99, 111, 110, 58 + 44, 105, 114, 96 + 13, 40, 78 + 33, 37 + 45, 10 + 91, 19 + 96, 112, 69 + 42, 110, 115, 17 + 84, 13 + 33, 69, 56 + 58, 114, 51 + 60, 74 + 40, 77, 101, 34 + 81, 115, 97, 76 + 27, 96 + 5, 10 + 31, 14 + 27, 28 + 4, 123, 13, 30 + 2, 27 + 5, 32, 32, 19 + 13, 27 + 5, 4 + 28, 32, 20 + 12, 32, 26 + 6, 10 + 22, 12 + 96, 93 + 18, 21 + 78, 11 + 86, 116, 105, 111, 63 + 47, 46, 104, 114, 101, 102, 7 + 25, 61, 13 + 19, 111, 67 + 15, 53 + 48, 30 + 85, 112, 103 + 8, 7 + 103, 26 + 89, 90 + 11, 30 + 16, 69, 10 + 104, 114, 29 + 82, 4 + 110, 6 + 79, 114, 108, 59, 4 + 9, 13 + 19, 5 + 27, 5 + 27, 32, 32, 1 + 31, 6 + 26, 32, 54 + 71, 32, 17 + 84, 23 + 85, 37 + 78, 26 + 75, 1 + 31, 123, 13, 10 + 22, 32, 28 + 4, 32, 32, 32, 32, 32, 16 + 16, 32, 28 + 4, 32, 96 + 20, 104, 37 + 77, 111, 119, 32, 91 + 19, 101, 119, 32, 69, 114, 19 + 95, 111, 114, 40, 23 + 11, 70, 97, 105, 108, 92 + 9, 7 + 93, 26 + 6, 99, 104, 101, 45 + 54, 10 + 97, 32, 108, 74 + 31, 37 + 62, 15 + 86, 110, 115, 52 + 49, 27 + 7, 41, 38 + 21, 13, 32, 22 + 10, 10 + 22, 29 + 3, 7 + 25, 32, 32, 32, 99 + 26, 13, 32, 9 + 23, 32, 32, 7 + 118, 13, 3 + 10, 32, 10 + 22, 32, 10 + 22, 72 + 30, 117, 110, 23 + 76, 47 + 69, 105, 111, 110, 16 + 16, 111, 80 + 30, 82, 101, 73 + 40, 68 + 49, 93 + 8, 115, 116, 70, 73 + 24, 68 + 37, 61 + 47, 101, 18 + 82, 40, 9 + 32, 32, 119 + 4, 13, 20 + 12, 32, 22 + 10, 7 + 25, 32, 3 + 29, 24 + 8, 32, 87 + 21, 110 + 1, 78 + 21, 75 + 22, 97 + 11, 30 + 53, 68 + 48, 111, 94 + 20, 97, 103, 10 + 91, 46, 50 + 64, 18 + 83, 7 + 102, 53 + 58, 115 + 3, 97 + 4, 73, 104 + 12, 101, 60 + 49, 40, 105 + 10, 82, 101, 53 + 60, 101 + 16, 101, 88 + 27, 96 + 20, 83, 61 + 55, 39 + 72, 114, 97, 59 + 44, 101, 75, 101, 121, 13 + 28, 21 + 38, 13, 32, 32, 32, 12 + 20, 11 + 21, 21 + 11, 6 + 26, 17 + 15, 45 + 73, 25 + 72, 46 + 68, 32, 78 + 33, 58 + 25, 49 + 67, 97, 18 + 98, 18 + 99, 113 + 2, 32, 10 + 51, 32, 77 + 26, 86 + 15, 83 + 33, 83, 14 + 102, 97, 116, 117, 110 + 5, 70, 66 + 45, 114, 39 + 28, 117, 44 + 70, 92 + 22, 101, 41 + 69, 85 + 31, 16 + 60, 82 + 23, 82 + 17, 98 + 3, 110, 115, 101, 40, 12 + 29, 24 + 35, 13 + 0, 4 + 28, 32, 25 + 7, 32, 8 + 24, 29 + 3, 32, 32, 55 + 50, 28 + 74, 32, 5 + 35, 33, 22 + 11, 3 + 108, 83, 8 + 108, 76 + 21, 29 + 87, 48 + 69, 85 + 30, 32, 38, 38, 4 + 9, 32, 32, 14 + 18, 32, 32, 32, 32, 32, 32, 20 + 12, 32, 4 + 28, 111, 83, 4 + 112, 67 + 30, 116, 117, 48 + 67, 32 + 14, 44 + 71, 116, 97, 86 + 30, 46 + 71, 115, 32, 27 + 34, 61, 61, 1 + 31, 32 + 83, 70, 97, 85 + 20, 108, 86 + 15, 27 + 73, 4 + 28, 38, 38, 13, 19 + 13, 17 + 15, 1 + 31, 29 + 3, 18 + 14, 25 + 7, 32, 32, 32, 3 + 29, 32, 32, 111, 2 + 81, 116, 4 + 93, 93 + 23, 117, 115, 46, 62 + 39, 51 + 69, 112, 51 + 54, 31 + 83, 31 + 70, 68 + 32, 64 + 1, 21 + 95, 32, 32 + 28, 32, 110, 101, 119, 6 + 26, 68, 53 + 44, 8 + 108, 16 + 85, 40, 36 + 5, 41, 32 + 0, 43 + 80, 5 + 8, 32, 32, 32, 23 + 9, 22 + 10, 32, 32, 17 + 15, 32, 22 + 10, 32, 32, 118, 59 + 38, 114, 14 + 18, 60 + 49, 11 + 90, 115, 104 + 11, 0 + 97, 103, 99 + 2, 32, 61, 30 + 2, 22 + 12, 60 + 16, 105, 53 + 46, 101, 72 + 38, 41 + 74, 70 + 31, 32, 92 + 26, 57 + 40, 108, 3 + 102, 100, 48 + 49, 84 + 32, 105, 31 + 80, 110, 6 + 26, 44 + 58, 97, 105, 108, 101, 24 + 76, 31 + 15, 32, 37 + 30, 97, 110, 32, 110, 36 + 75, 81 + 35, 32, 99, 111, 85 + 25, 110, 11 + 90, 99, 67 + 49, 32, 116, 111, 2 + 30, 108, 105, 85 + 14, 101, 63 + 47, 115, 78 + 23, 10 + 22, 30 + 88, 7 + 90, 104 + 4, 105, 72 + 28, 97, 12 + 104, 6 + 99, 111, 110, 32, 115, 101 + 0, 19 + 95, 68 + 50, 93 + 8, 114, 46, 17 + 15, 92, 110, 34, 13, 32, 4 + 28, 32, 14 + 18, 32, 14 + 18, 32, 32, 32, 32, 3 + 29, 30 + 2, 27 + 5, 32, 0 + 32, 32, 27 + 16, 18 + 14, 33 + 83, 104, 3 + 102, 52 + 63, 46, 53 + 62, 48 + 68, 4 + 93, 79 + 37, 71 + 46, 109 + 6, 84, 101, 116 + 4, 51 + 65, 24 + 8, 43, 7 + 25, 35 + 4, 46, 87 + 5, 94 + 16, 77, 97, 42 + 65, 73 + 28, 32, 115, 20 + 97, 29 + 85, 101, 28 + 4, 121, 13 + 98, 5 + 112, 114, 32, 109, 28 + 69, 99, 90 + 14, 37 + 68, 27 + 83, 24 + 77, 13 + 19, 99, 59 + 38, 110, 5 + 27, 92 + 5, 76 + 23, 32 + 67, 101, 115, 115, 20 + 12, 34, 4 + 35, 32, 43, 4 + 28, 43 + 72, 68, 12 + 99, 32 + 77, 88 + 9, 56 + 49, 7 + 103, 30 + 2, 43, 32, 39, 34, 46, 31 + 8, 35 + 24, 6 + 7, 32, 15 + 17, 14 + 18, 7 + 25, 32, 32, 32, 29 + 3, 32, 6 + 26, 23 + 9, 32, 47 + 52, 111, 101 + 9, 102, 50 + 55, 46 + 68, 53 + 56, 40, 69 + 40, 79 + 22, 115, 47 + 68, 49 + 48, 22 + 81, 82 + 19, 1 + 40, 59, 13, 32, 9 + 23, 8 + 24, 32, 4 + 28, 32, 15 + 17, 32, 18 + 14, 32, 32, 3 + 29, 16 + 100, 92 + 12, 86 + 28, 109 + 2, 106 + 13, 16 + 16, 52 + 58, 40 + 61, 119, 17 + 15, 25 + 44, 114, 114, 56 + 55, 85 + 29, 40, 27 + 7, 67 + 3, 74 + 23, 98 + 7, 108, 101, 30 + 70, 32, 99, 66 + 38, 13 + 88, 99, 107, 32, 42 + 66, 105, 99, 101, 110, 105 + 10, 101, 24 + 10, 41, 59, 13, 18 + 14, 31 + 1, 32, 32, 32, 32, 32, 32, 108 + 17, 13, 13, 32, 32, 32, 32, 5 + 27, 8 + 24, 20 + 12, 18 + 14, 115, 34 + 67, 89 + 27, 83, 9 + 107, 64 + 33, 116, 34 + 83, 45 + 70, 55 + 15, 90 + 21, 114, 62 + 5, 117, 114, 114, 101, 110, 38 + 78, 4 + 72, 48 + 57, 66 + 33, 101, 53 + 62, 101, 3 + 37, 115, 6 + 64, 52 + 45, 62 + 43, 108, 64 + 37, 62 + 38, 35 + 6, 34 + 25, 8 + 5, 32, 21 + 11, 17 + 15, 3 + 29, 50 + 75, 8 + 5, 13, 32, 32, 32, 14 + 18, 102, 30 + 87, 110, 99, 25 + 91, 105, 111, 8 + 102, 13 + 19, 115, 84 + 17, 116, 77 + 6, 116, 61 + 36, 116, 2 + 115, 115, 70, 45 + 66, 21 + 93, 67, 102 + 15, 49 + 65, 112 + 2, 92 + 9, 26 + 84, 116, 76, 35 + 70, 99, 101, 115, 100 + 1, 22 + 18, 115, 44 + 32, 75 + 30, 48 + 51, 101, 110, 115, 101, 3 + 80, 116, 21 + 76, 116, 117, 113 + 2, 13 + 31, 32, 28 + 83, 16 + 53, 120, 96 + 16, 105, 88 + 26, 48 + 53, 27 + 41, 97, 10 + 106, 87 + 14, 1 + 40, 8 + 24, 123, 8 + 5, 29 + 3, 32, 10 + 22, 32, 10 + 22, 19 + 13, 31 + 1, 32, 7 + 111, 10 + 87, 114, 17 + 15, 100, 49 + 52, 102, 97, 114 + 3, 108, 52 + 64, 68, 97, 116, 70 + 31, 11 + 21, 35 + 26, 4 + 28, 80 + 30, 101, 119, 32, 68, 54 + 43, 77 + 39, 101, 2 + 38, 41, 59, 13, 32, 32, 32, 20 + 12, 17 + 15, 25 + 7, 32, 20 + 12, 100, 68 + 33, 102, 33 + 64, 117, 108, 31 + 85, 25 + 43, 43 + 54, 116, 101, 4 + 42, 115, 13 + 88, 116, 23 + 45, 97, 53 + 63, 101, 40, 99 + 1, 87 + 14, 54 + 48, 69 + 28, 117, 108, 31 + 85, 68, 54 + 43, 116, 101, 46, 76 + 27, 50 + 51, 48 + 68, 5 + 63, 97, 2 + 114, 101, 40, 41, 32, 43, 12 + 20, 26 + 23, 12 + 29, 59, 11 + 2, 32, 7 + 25, 32, 32, 3 + 29, 20 + 12, 24 + 8, 32, 118, 64 + 33, 114, 5 + 27, 111, 83, 72 + 44, 1 + 96, 86 + 30, 48 + 69, 42 + 73, 32, 5 + 56, 32, 25 + 98, 11 + 2, 27 + 5, 3 + 29, 27 + 5, 27 + 5, 32, 32, 32, 21 + 11, 32, 31 + 1, 31 + 1, 32, 92 + 16, 70 + 35, 24 + 75, 25 + 76, 65 + 45, 5 + 110, 7 + 94, 73, 99 + 1, 58, 32, 115, 76, 105, 99, 101, 110, 115, 71 + 30, 48 + 25, 81 + 19, 32 + 12, 12 + 1, 20 + 12, 32, 32, 19 + 13, 32, 32, 2 + 30, 31 + 1, 32, 32, 17 + 15, 32, 1 + 100, 111 + 9, 41 + 71, 88 + 17, 106 + 8, 58 + 43, 46 + 54, 36 + 29, 116, 58, 17 + 15, 34 + 77, 65 + 4, 120, 112, 105, 114, 41 + 60, 6 + 62, 36 + 61, 114 + 2, 101, 2 + 30, 124, 124, 20 + 12, 100, 101, 102, 27 + 70, 117, 44 + 64, 8 + 108, 68, 97, 116, 1 + 100, 26 + 18, 1 + 12, 32, 12 + 20, 6 + 26, 32, 32, 14 + 18, 16 + 16, 3 + 29, 32, 32, 10 + 22, 32, 115, 116, 97, 32 + 84, 117, 115, 58, 32, 64 + 51, 76, 54 + 51, 99, 101, 73 + 37, 19 + 96, 42 + 59, 37 + 46, 116, 50 + 47, 116, 117, 30 + 85, 13, 32, 32, 32, 10 + 22, 32, 32, 32, 32, 44 + 81, 59, 4 + 9, 2 + 11, 17 + 15, 32, 27 + 5, 32, 10 + 22, 32, 32 + 0, 32, 115, 83 + 18, 116, 84, 68 + 43, 7 + 76, 116, 10 + 101, 35 + 79, 97, 103, 52 + 49, 40, 115, 38 + 45, 116, 97, 103 + 13, 117, 115, 83, 116, 111, 114, 97, 51 + 52, 53 + 48, 3 + 72, 64 + 37, 121, 44, 32, 111, 83, 3 + 113, 97, 116, 76 + 41, 115 + 0, 9 + 32, 59, 13, 16 + 16, 4 + 28, 32, 32, 125, 11 + 2, 3 + 10, 23 + 9, 27 + 5, 32, 32, 102, 109 + 8, 110, 99, 39 + 77, 105, 111, 110, 32, 103, 101, 116, 54 + 29, 116, 97, 1 + 115, 117, 10 + 105, 70, 111, 114, 31 + 36, 117, 41 + 73, 66 + 48, 21 + 80, 110, 116, 5 + 71, 105, 89 + 10, 36 + 65, 15 + 95, 15 + 100, 79 + 22, 40, 8 + 33, 32, 123, 13, 32, 32, 7 + 25, 30 + 2, 4 + 28, 32, 32, 17 + 15, 20 + 98, 97, 114, 26 + 6, 10 + 101, 76 + 7, 116, 46 + 51, 71 + 45, 117, 94 + 21, 21 + 11, 17 + 44, 32, 83 + 20, 101, 116, 70, 110 + 4, 111, 109, 83, 84 + 32, 34 + 77, 66 + 48, 97, 103, 101, 7 + 33, 115, 41 + 42, 78 + 38, 71 + 26, 116, 117, 115, 83, 116, 12 + 99, 1 + 113, 97, 77 + 26, 101, 75, 101, 45 + 76, 3 + 38, 59, 13, 32, 32, 10 + 22, 5 + 27, 21 + 11, 32, 32, 12 + 20, 27 + 78, 93 + 9, 32, 40, 33, 111, 69 + 14, 116, 97, 82 + 34, 54 + 63, 109 + 6, 23 + 9, 124, 124, 13, 32, 32, 11 + 21, 14 + 18, 12 + 20, 32, 20 + 12, 32, 32, 26 + 6, 32, 2 + 30, 111, 0 + 83, 116, 76 + 21, 27 + 89, 117, 31 + 84, 46, 108, 105, 99, 58 + 43, 35 + 75, 115, 101, 32 + 41, 100, 32, 6 + 27, 61, 61, 32, 115, 19 + 57, 105, 94 + 5, 101, 86 + 24, 115, 96 + 5, 52 + 21, 100, 41, 32, 25 + 98, 13, 7 + 25, 10 + 22, 11 + 21, 32, 32, 32, 32, 8 + 24, 19 + 13, 19 + 13, 32, 32, 114, 101, 116, 43 + 74, 114, 110, 32, 71 + 39, 14 + 103, 4 + 104, 108, 59, 1 + 12, 32, 22 + 10, 19 + 13, 13 + 19, 0 + 32, 26 + 6, 29 + 3, 30 + 2, 125, 2 + 11, 3 + 10, 32, 32, 32, 8 + 24, 28 + 4, 20 + 12, 32, 14 + 18, 111, 83, 102 + 14, 97, 116, 38 + 79, 115, 46, 6 + 95, 120, 112, 105, 114, 101, 100, 65, 80 + 36, 32, 61, 32, 85 + 25, 56 + 45, 119, 32, 56 + 12, 97, 116, 7 + 94, 40, 111, 66 + 17, 116, 97, 116, 117, 57 + 58, 46, 92 + 9, 120, 112, 105, 114, 101, 38 + 62, 65, 116, 27 + 14, 36 + 23, 9 + 4, 32, 32, 30 + 2, 32, 22 + 10, 11 + 21, 7 + 25, 5 + 27, 114, 101, 87 + 29, 117, 96 + 18, 38 + 72, 14 + 18, 111, 0 + 83, 116, 60 + 37, 116, 64 + 53, 87 + 28, 44 + 15, 7 + 6, 32, 32, 30 + 2, 20 + 12, 125, 13 + 0, 13, 18 + 14, 10 + 22, 32, 9 + 23, 53 + 49, 117, 7 + 103, 10 + 89, 116, 105, 111, 110, 2 + 30, 44 + 54, 8 + 93, 103, 105, 110, 82, 82 + 19, 113, 24 + 93, 101, 19 + 96, 6 + 110, 23 + 17, 22 + 19, 18 + 14, 123, 13, 32, 32, 32, 32, 19 + 13, 32, 32, 2 + 30, 37 + 81, 24 + 73, 114, 32, 54 + 46, 7 + 90, 116, 101, 4 + 28, 3 + 58, 19 + 13, 110, 101, 35 + 84, 12 + 20, 16 + 52, 97, 35 + 81, 101, 40, 40 + 1, 59, 3 + 10, 32, 32, 29 + 3, 32, 32, 32, 32, 32, 55 + 63, 97, 114, 20 + 12, 114, 32 + 69, 102 + 11, 33 + 84, 87 + 14, 115, 116, 83, 116, 97, 114, 116, 19 + 13, 57 + 4, 3 + 29, 103, 61 + 40, 98 + 18, 70, 18 + 96, 111, 109, 83, 116, 111, 114, 28 + 69, 75 + 28, 65 + 36, 40, 115, 19 + 63, 101, 93 + 20, 78 + 39, 101, 115, 68 + 48, 39 + 44, 116, 111, 114, 3 + 94, 70 + 33, 8 + 93, 42 + 33, 83 + 18, 46 + 75, 41, 13 + 46, 9 + 4, 4 + 28, 6 + 26, 13 + 19, 32, 6 + 26, 25 + 7, 32, 12 + 20, 39 + 66, 102, 28 + 4, 10 + 30, 33, 33, 114, 93 + 8, 113, 117, 16 + 85, 32 + 83, 1 + 115, 46 + 37, 116, 97, 76 + 38, 80 + 36, 32, 6 + 32, 2 + 36, 32, 114, 89 + 12, 113, 58 + 59, 89 + 12, 115, 43 + 73, 74 + 9, 65 + 51, 97, 114, 45 + 71, 32, 2 + 58, 27 + 5, 40, 43, 100, 97, 45 + 71, 4 + 97, 20 + 12, 43, 6 + 26, 13 + 36, 14 + 34, 48, 37 + 11, 41, 28 + 13, 32, 117 + 6, 13, 17 + 15, 21 + 11, 32, 6 + 26, 32, 32, 14 + 18, 6 + 26, 11 + 21, 32, 32, 5 + 27, 114, 88 + 13, 59 + 57, 85 + 32, 106 + 8, 110, 32, 34 + 68, 17 + 80, 108, 115, 36 + 65, 59, 13, 32, 32, 27 + 5, 26 + 6, 32, 16 + 16, 24 + 8, 2 + 30, 118 + 7, 13, 12 + 1, 31 + 1, 32, 32, 32, 15 + 17, 32, 5 + 27, 32, 115, 75 + 26, 116, 7 + 77, 111, 24 + 59, 116, 83 + 28, 39 + 75, 97, 89 + 14, 37 + 64, 27 + 13, 109 + 6, 82, 2 + 99, 113, 117, 101, 115, 116, 35 + 48, 91 + 25, 5 + 106, 63 + 51, 7 + 90, 103, 21 + 80, 66 + 9, 101, 26 + 95, 2 + 42, 32, 3 + 97, 15 + 82, 87 + 29, 101, 41, 59, 13, 32, 1 + 31, 29 + 3, 32, 25 + 7, 27 + 5, 32, 20 + 12, 13 + 101, 30 + 71, 116, 51 + 66, 14 + 100, 90 + 20, 16 + 16, 116, 64 + 50, 117, 101, 43 + 16, 9 + 4, 29 + 3, 32, 32, 32, 125, 11 + 2, 13, 27 + 5, 32, 19 + 13, 7 + 25, 102, 58 + 59, 60 + 50, 99, 105 + 11, 105, 99 + 12, 110, 22 + 10, 100 + 15, 101, 116, 84, 111, 83, 105 + 11, 83 + 28, 114, 88 + 9, 103, 6 + 95, 40, 15 + 100, 75, 5 + 96, 121, 44, 32, 18 + 93, 79 + 7, 90 + 7, 108, 57 + 60, 81 + 20, 14 + 27, 32, 42 + 81, 1 + 12, 32, 28 + 4, 12 + 20, 3 + 29, 32, 11 + 21, 21 + 11, 32, 118, 65 + 32, 114, 32, 115, 65 + 21, 34 + 63, 108, 117, 101, 32, 61, 4 + 28, 74, 83, 79, 1 + 77, 46, 115, 116, 114, 25 + 80, 58 + 52, 76 + 27, 24 + 81, 102, 48 + 73, 16 + 24, 111, 3 + 83, 97, 108, 117, 101, 23 + 18, 59, 13, 9 + 23, 26 + 6, 7 + 25, 17 + 15, 21 + 11, 32, 10 + 22, 32, 71 + 34, 33 + 69, 10 + 30, 119, 105, 107 + 3, 100, 108 + 3, 114 + 5, 46, 45 + 53, 116, 43 + 68, 97, 25 + 16, 2 + 30, 23 + 9, 115, 62 + 24, 13 + 84, 24 + 84, 117, 101, 32, 55 + 6, 11 + 21, 38 + 81, 84 + 21, 110, 100, 111, 10 + 109, 26 + 20, 46 + 52, 1 + 115, 111, 11 + 86, 13 + 27, 101, 110, 83 + 16, 111, 100, 101, 85, 82, 73, 32 + 35, 111, 109, 73 + 39, 28 + 83, 110, 101, 88 + 22, 116, 34 + 6, 115, 86, 97, 104 + 4, 117, 101, 41 + 0, 11 + 30, 56 + 3, 5 + 8, 15 + 17, 32, 32, 32, 10 + 22, 32, 32, 32, 119, 105, 75 + 35, 38 + 62, 37 + 74, 96 + 23, 46, 39 + 69, 111 + 0, 98 + 1, 97, 108, 41 + 42, 116, 111, 91 + 23, 97, 103, 101, 46, 3 + 112, 101, 116, 45 + 28, 8 + 108, 101, 109, 40, 76 + 39, 75, 28 + 73, 121, 2 + 42, 32, 1 + 114, 47 + 39, 37 + 60, 108, 117, 101, 16 + 25, 29 + 30, 2 + 11, 29 + 3, 7 + 25, 14 + 18, 11 + 21, 43 + 82, 4 + 9, 13, 30 + 2, 32, 32, 32, 102, 117, 2 + 108, 99, 116 + 0, 84 + 21, 111, 110, 32, 59 + 44, 23 + 78, 116, 25 + 45, 114, 89 + 22, 109, 19 + 64, 116, 64 + 47, 59 + 55, 56 + 41, 103, 45 + 56, 20 + 20, 38 + 77, 74 + 1, 86 + 15, 121, 5 + 36, 32, 81 + 42, 12 + 1, 32, 32, 32, 32, 12 + 20, 32, 19 + 13, 23 + 9, 118, 78 + 19, 114, 9 + 23, 115, 54 + 32, 80 + 17, 37 + 71, 86 + 31, 93 + 8, 13 + 19, 61, 1 + 31, 35 + 84, 105, 28 + 82, 62 + 38, 111, 42 + 77, 46, 91 + 17, 86 + 25, 99, 46 + 51, 108, 29 + 54, 116, 111, 114, 63 + 34, 103, 97 + 4, 37 + 9, 7 + 96, 101, 50 + 66, 6 + 67, 9 + 107, 23 + 78, 109, 4 + 36, 99 + 16, 75, 30 + 71, 121, 26 + 15, 59, 5 + 8, 32, 32, 32, 32, 32, 4 + 28, 32, 32, 54 + 51, 102, 26 + 14, 119, 105, 110, 87 + 13, 111, 119, 4 + 42, 97, 116, 78 + 33, 28 + 70, 32, 38, 38, 25 + 7, 33, 24 + 9, 115, 36 + 50, 97, 108, 24 + 93, 96 + 5, 41, 32, 115, 86, 78 + 19, 108, 74 + 43, 101, 20 + 12, 61, 19 + 13, 100, 101, 99, 83 + 28, 100, 101, 85, 36 + 46, 52 + 21, 17 + 50, 111, 10 + 99, 41 + 71, 40 + 71, 83 + 27, 23 + 78, 87 + 23, 116, 40, 51 + 68, 54 + 51, 83 + 27, 100, 111, 26 + 93, 46, 35 + 62, 58 + 58, 1 + 110, 98, 10 + 30, 115, 86, 43 + 54, 108, 117, 101, 41, 17 + 24, 32 + 27, 7 + 6, 32, 1 + 31, 32, 32, 32, 32, 32, 25 + 7, 43 + 71, 10 + 91, 116, 117, 103 + 11, 107 + 3, 22 + 10, 8 + 66, 83, 79, 78, 46, 66 + 46, 24 + 73, 114, 98 + 17, 101, 40, 12 + 103, 4 + 82, 83 + 14, 90 + 18, 117, 101, 30 + 11, 8 + 51, 13, 32, 32, 32, 32, 66 + 59, 3 + 10, 45 + 80, 15 + 26, 25 + 15, 12 + 29, 0 + 59, 32, 18 + 14, 125, 32, 101, 70 + 38, 115, 57 + 44, 32, 8 + 97, 66 + 36, 32 + 8, 110, 101, 119, 18 + 14, 68, 21 + 76, 85 + 31, 79 + 22, 40, 50, 43 + 5, 46 + 3, 56, 44, 50, 30 + 14, 25 + 25, 55, 41, 60, 110, 101, 93 + 26, 30 + 2, 59 + 9, 93 + 4, 116, 18 + 83, 23 + 17, 41, 8 + 33, 123, 79 + 26, 41 + 61, 32 + 8, 99, 111, 69 + 41, 102, 5 + 100, 114, 109, 40, 25 + 9, 23 + 61, 104 + 0, 101, 32, 94 + 22, 35 + 79, 105, 15 + 82, 108, 32, 27 + 77, 97, 115, 3 + 29, 101, 120, 112, 105, 114, 101, 65 + 35, 17 + 29, 10 + 22, 84, 111, 32, 20 + 92, 117, 57 + 57, 80 + 19, 67 + 37, 88 + 9, 115, 101, 4 + 28, 97, 6 + 26, 102, 51 + 66, 10 + 98, 108, 31 + 1, 3 + 115, 101, 38 + 76, 54 + 61, 14 + 91, 90 + 21, 110, 11 + 21, 112, 108, 101, 97, 59 + 56, 101, 32, 102, 11 + 100, 108, 107 + 1, 38 + 73, 87 + 32, 0 + 32, 116, 39 + 65, 50 + 55, 31 + 84, 13 + 19, 108, 105, 7 + 103, 47 + 60, 58, 32, 16 + 88, 116, 116, 112, 19 + 96, 58, 47, 21 + 26, 91 + 28, 119, 90 + 29, 46, 119, 41 + 60, 98, 100, 14 + 83, 118, 53 + 62, 69 + 52, 44 + 71, 65 + 51, 47 + 54, 109, 46, 99, 111, 109, 6 + 41, 79 + 33, 31 + 83, 105, 99, 40 + 65, 54 + 56, 103, 11 + 35, 19 + 13, 79 + 4, 71 + 30, 70 + 38, 101, 90 + 9, 116 + 0, 32, 75 + 4, 75, 32, 96 + 20, 111, 32, 95 + 15, 97, 21 + 97, 2 + 103, 103, 47 + 50, 60 + 56, 101, 32, 16 + 100, 62 + 49, 32, 116, 1 + 103, 101, 32, 97, 98, 102 + 9, 118, 63 + 38, 32, 38 + 47, 22 + 60, 76, 21 + 25, 34, 4 + 37, 3 + 38, 123, 108, 111, 46 + 53, 97, 19 + 97, 105, 63 + 48, 12 + 98, 46, 104, 114, 101, 20 + 82, 28 + 4, 21 + 40, 31 + 1, 34, 104, 116, 31 + 85, 19 + 93, 115, 58, 28 + 19, 1 + 46, 119, 119, 119, 46, 119, 91 + 10, 15 + 83, 72 + 28, 97, 118, 115, 76 + 45, 98 + 17, 2 + 114, 101, 52 + 57, 11 + 35, 99, 98 + 13, 47 + 62, 17 + 30, 112, 114, 24 + 81, 70 + 29, 105, 31 + 79, 67 + 36, 27 + 8, 89 + 8, 8 + 98, 84 + 13, 15 + 105, 108, 78 + 27, 98, 27 + 7, 59, 120 + 5, 101, 108, 68 + 47, 101, 36 + 87, 28 + 88, 44 + 60, 103 + 11, 0 + 111, 16 + 103, 27 + 5, 34, 84, 78 + 26, 52 + 49, 12 + 20, 116, 59 + 55, 40 + 65, 44 + 53, 108, 32, 94 + 18, 101, 114, 90 + 15, 111, 37 + 63, 7 + 25, 72 + 32, 44 + 53, 62 + 53, 32, 72 + 29, 69 + 51, 0 + 112, 51 + 54, 114, 101, 100, 34, 59, 91 + 34, 125, 59));
        },
        AddListener: function(_83b, _83c, _83d) {
            _83d = _83d || null;
            switch (_83b) {
                case self.EVENT_ON_BEFORE_REQUEST_SEND:
                case self.EVENT_ON_RESPONSE:
                    ITHit.Events.AddListener(this, _83b, _83c, _83d);
                    break;
                default:
                    throw new ITHit.WebDAV.Client.Exceptions.WebDavException("Not found event name `" + _83b + "`");
            }
        },
        RemoveListener: function(_83e, _83f, _840) {
            _840 = _840 || null;
            switch (_83e) {
                case self.EVENT_ON_BEFORE_REQUEST_SEND:
                case self.EVENT_ON_RESPONSE:
                    ITHit.Events.RemoveListener(this, _83e, _83f, _840);
                    break;
                default:
                    throw new ITHit.WebDAV.Client.Exceptions.WebDavException("Not found event name `" + _83e + "`");
            }
        },
        OpenFile: function(_841, _842) {
            _842 = _842 || [];
            var _843 = this.CreateRequest(this.__className + ".OpenFile()");
            var _844 = ITHit.WebDAV.Client.File.OpenItem(_843, _841, _842);
            _843.MarkFinish();
            return _844;
        },
        OpenFileAsync: function(_845, _846, _847) {
            _846 = _846 || [];
            var _848 = this.CreateRequest(this.__className + ".OpenFileAsync()");
            ITHit.WebDAV.Client.File.OpenItemAsync(_848, _845, _846, function(_849) {
                _848.MarkFinish();
                _847(_849);
            });
            return _848;
        },
        OpenResource: function(_84a, _84b) {
            _84b = _84b || [];
            return this.OpenFile(_84a, _84b);
        },
        OpenResourceAsync: function(_84c, _84d, _84e) {
            _84d = _84d || [];
            return this.OpenFileAsync(_84c, _84d, _84e);
        },
        OpenFolder: function(_84f, _850) {
            _850 = _850 || [];
            var _851 = this.CreateRequest(this.__className + ".OpenFolder()");
            var _852 = ITHit.WebDAV.Client.Folder.OpenItem(_851, _84f, _850);
            _851.MarkFinish();
            return _852;
        },
        OpenFolderAsync: function(_853, _854, _855) {
            _854 = _854 || [];
            var _856 = this.CreateRequest(this.__className + ".OpenFolderAsync()");
            ITHit.WebDAV.Client.Folder.OpenItemAsync(_856, _853, _854, function(_857) {
                _856.MarkFinish();
                _855(_857);
            });
            return _856;
        },
        OpenItem: function(_858, _859) {
            _859 = _859 || [];
            var _85a = this.CreateRequest(this.__className + ".OpenItem()");
            var _85b = ITHit.WebDAV.Client.HierarchyItem.OpenItem(_85a, _858, _859);
            _85a.MarkFinish();
            return _85b;
        },
        OpenItemAsync: function(_85c, _85d, _85e) {
            _85d = _85d || [];
            var _85f = this.CreateRequest(this.__className + ".OpenItemAsync()");
            ITHit.WebDAV.Client.HierarchyItem.OpenItemAsync(_85f, _85c, _85d, function(_860) {
                _85f.MarkFinish();
                _85e(_860);
            });
            return _85f;
        },
        CreateFolderAsync: function(_861, _862, _863) {
            _862 = _862 || [];
            var _864 = this.CreateRequest(this.__className + ".CreateFolderAsync()");
            var _865 = ITHit.WebDAV.Client.Encoder.Encode(_861);
            var _866 = ITHit.WebDAV.Client.HierarchyItem.GetHost(_865);
            ITHit.WebDAV.Client.Methods.Mkcol.GoAsync(_864, _865, _862, _866, function(_867) {
                _864.MarkFinish();
                _863(_867);
            });
            return _864;
        },
        CreateRequest: function(_868, _869) {
            return new ITHit.WebDAV.Client.Request(this, _868, _869);
        },
        CreateWebDavRequest: function(_86a, _86b, _86c) {
            if ("undefined" == typeof _86c) {
                _86c = [];
            }
            var _86d = ITHit.WebDAV.Client.WebDavRequest.Create(_86b, _86c, this._User, this._Pass, _86a);
            ITHit.Events.AddListener(_86d, "OnBeforeRequestSend", "OnBeforeRequestSendHandler", this);
            ITHit.Events.AddListener(_86d, "OnResponse", "OnResponseHandler", this);
            return _86d;
        },
        OnBeforeRequestSendHandler: function(_86e, _86f) {
            ITHit.Events.RemoveListener(_86f, "OnBeforeRequestSend", "OnBeforeRequestSendHandler", this);
            return ITHit.Events.DispatchEvent(this, "OnBeforeRequestSend", _86e);
        },
        OnResponseHandler: function(_870, _871) {
            var _871 = arguments[arguments.length - 1];
            if (this.ServerEngine === null) {
                this.ServerEngine = _870.GetResponseHeader("x-engine", true);
            }
            if (this._IsIisDetected === null) {
                var _872 = _870.GetResponseHeader("server", true);
                this._IsIisDetected = (/^Microsoft-IIS\//i.test(_872));
            }
            ITHit.Events.RemoveListener(_871, "OnResponse", "OnResponseHandler", this);
            return ITHit.Events.DispatchEvent(this, "OnResponse", _870);
        },
        Undelete: function(_873) {
            var _874 = this.CreateRequest(this.__className + ".Undelete()");
            _873 = ITHit.WebDAV.Client.Encoder.EncodeURI(_873);
            var _875 = ITHit.WebDAV.Client.Methods.Undelete.Go(_874, _873, ITHit.WebDAV.Client.HierarchyItem.GetHost(_873));
            _874.MarkFinish();
            return _875;
        },
        SetCredentials: function(_876, _877) {
            this._User = _876;
            this._Pass = _877;
        },
        GetIisDetected: function() {
            return this._IsIisDetected;
        }
    });
})();
(function() {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.State", null, {}, {
        Uploading: "Uploading",
        Canceled: "Canceled",
        Paused: "Paused",
        Queued: "Queued",
        Failed: "Failed",
        Completed: "Completed",
        Retrying: "Retrying"
    });
})();
(function() {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Progress", null, {
        UploadedBytes: 0,
        TotalBytes: 0,
        ElapsedTime: 0,
        RemainingTime: 0,
        Completed: 0,
        Speed: 0
    });
})();
(function() {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.EventName", null, {}, {
        OnQueueChanged: "OnQueueChanged",
        OnStateChanged: "OnStateChanged",
        OnProgressChanged: "OnProgressChanged",
        OnLoadStart: "OnLoadStart",
        OnLoadProgress: "OnLoadProgress",
        OnLoadEnd: "OnLoadEnd",
        OnLoadError: "OnLoadError"
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.BaseEvent", null, {
        Name: "",
        Sender: null
    });
})();
(function() {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.StateChanged", ITHit.WebDAV.Client.Upload.Events.BaseEvent, {
        OldState: null,
        NewState: null,
        constructor: function(_878, _879, _87a) {
            this.Name = ITHit.WebDAV.Client.Upload.Events.EventName.OnStateChanged;
            this.OldState = _879;
            this.NewState = _87a;
            this.Sender = _878;
        }
    });
})();
(function() {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.ProgressChanged", ITHit.WebDAV.Client.Upload.Events.BaseEvent, {
        OldProgress: null,
        NewProgress: null,
        constructor: function(_87b, _87c, _87d) {
            this.Name = ITHit.WebDAV.Client.Upload.Events.EventName.OnProgressChanged;
            this.OldProgress = _87c;
            this.NewProgress = _87d;
            this.Sender = _87b;
        }
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Controls.HtmlControl", null, {
        Id: "",
        HtmlElement: null,
        constructor: function(_87e) {
            this.Id = _87e;
            this.HtmlElement = document.getElementById(_87e);
        },
        _StopEvent: function(_87f) {
            if (_87f.preventDefault) {
                _87f.preventDefault();
            } else {
                _87f.returnValue = false;
            }
            if (_87f.stopPropagation) {
                _87f.stopPropagation();
            }
        }
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Utils.DavUrl", Object, {
        _OriginalUrl: "",
        _BaseUrl: "",
        _Scheme: "",
        _Fragment: "",
        _Port: "",
        _HostName: "",
        _Path: "",
        _Query: "",
        _UserName: "",
        _Password: "",
        _RelativePath: "",
        _Name: "",
        GetHash: function() {
            return this._Fragment;
        },
        GetHost: function() {
            if (this._Port) {
                return this._HostName += this._PortSeparator + this._Port;
            }
            return this._HostName;
        },
        GetHostName: function() {
            return this._HostName;
        },
        GetPort: function() {
            return this._Port;
        },
        GetProtocol: function() {
            return this._Scheme;
        },
        GetQuery: function() {
            return this._Query;
        },
        GetName: function() {
            return this._Name;
        },
        GetRelativePath: function() {
            return this._RelativePath;
        },
        GetHref: function() {
            return this._OriginalUrl;
        },
        GetBaseUrl: function() {
            return this._BaseUrl;
        },
        toString: function() {
            return this._OriginalUrl;
        },
        Clone: function() {
            return new ITHit.WebDAV.Client.Upload.Utils.DavUrl(this._RelativePath, this._BaseUrl);
        },
        _ParseAuthPartsUndetectedScheme: function(_880) {
            var _881 = _880.split(":");
            if (_881.length === 3) {
                this._Scheme = _881[0] + ":";
                this._UserName = _881[1];
                this._Password = _881[2];
            } else {
                if (_881.length === 2) {
                    this._Scheme = _881[0];
                    this._UserName = _881[1];
                } else {
                    this._UserName = _881[0];
                }
            }
        },
        _ParseAuthPartsDetectedScheme: function(_882) {
            var _883 = _882.split(":");
            if (_883.length === 2) {
                this._UserName = _883[0];
                this._Password = _883[1];
            } else {
                this._UserName = _883[0];
            }
        },
        ParseAuthorityWithScheme: function(_884, _885) {
            var _886 = _884.match(this._PortRexEx);
            if (_886) {
                this._Port = _886[0].slice(1);
                _884 = _884.slice(0, -_886[0].length);
            }
            var _887 = _884.split("@");
            if (_887.length > 1) {
                this._HostName = _887[1];
                if (!_885) {
                    this._ParseAuthPartsUndetectedScheme(_887[0]);
                } else {
                    this._ParseAuthPartsDetectedScheme(_887[0]);
                }
                return;
            }
            var _888 = _887[0].split(":");
            if (_888.length > 1) {
                this._Scheme = _888[0] + ":";
                this._HostName = _888[1];
                return;
            }
            this._HostName = _884;
        },
        _ParseTrailingPathPart: function(_889) {
            var _88a = _889.split(this._FragmentSeparator);
            if (_88a.length > 1) {
                this._Fragment = this._FragmentSeparator + _88a[1];
            }
            var _88b = _88a[0].split("?");
            if (_88b.length > 1) {
                this._Query = _88b[1];
                return _88b[0];
            }
            return _88b[0];
        },
        _ParseUrl: function(sUrl) {
            var _88d = sUrl.split(this._DashedSchemeSeparator);
            if (_88d.length > 1) {
                this._Scheme = _88d[0];
                this._IsDashedScheme = true;
                _88d.splice(0, 1);
            }
            var _88e = _88d[0].split(this._PathSeparator);
            _88e = ITHit.Utils.FilterBy(_88e, function(_88f) {
                return _88f !== "";
            });
            this.ParseAuthorityWithScheme(_88e[0], this._IsDashedScheme);
            _88e.splice(0, 1);
            if (_88e.length === 0) {
                return;
            }
            var _890 = [];
            for (var i = 0; i < _88d.length - 1; i++) {
                _890.push(_88e[i]);
            }
            var _892 = this._ParseTrailingPathPart(_88e[_88e.length - 1]);
            _890.push(_892);
            this._Name = _892;
            this._Path = this._PathSeparator + _890.join(this._PathSeparator);
            this._RelativePath = this._RelativePath || this._Path;
        },
        constructor: function(sUrl, _894) {
            this._BaseUrl = _894 || "";
            this._OriginalUrl = sUrl;
            if (this._isRelative(sUrl) && !!_894) {
                this._OriginalUrl = this._GetWithoutTrailingSeparator(_894) + sUrl;
                this._RelativePath = sUrl;
            }
            this._ParseUrl(this._OriginalUrl);
        },
        _PathSeparator: "/",
        _DashedSchemeSeparator: "://",
        _FragmentSeparator: "#",
        _PortRexEx: /:\d+$/,
        _IsDashedScheme: false,
        _PortSeparator: ":",
        _isRelative: function(sUrl) {
            if (sUrl.length && sUrl[0] === this._PathSeparator) {
                return true;
            }
            return;
        },
        _GetWithoutTrailingSeparator: function(_896) {
            var _897 = _896.slice(-1);
            if (_897 === this._PathSeparator) {
                return _896.slice(0, -1);
            }
            return _896;
        }
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.UploadInfo", null, {
        Url: null,
        File: null,
        IsExists: null,
        IsFolder: function() {
            return !this.File;
        },
        constructor: function(_898, _899) {
            this.Url = _898;
            this.File = _899 || null;
        }
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Utils.DavUrlBuilder", Object, {
        PathParts: [],
        _BaseUrl: "",
        Create: function() {
            var _89a = this._PathSeparator + this.PathParts.join(this._PathSeparator);
            return new ITHit.WebDAV.Client.Upload.Utils.DavUrl(_89a, this._BaseUrl);
        },
        Clone: function() {
            var _89b = new ITHit.WebDAV.Client.Upload.Utils.DavUrlBuilder(this._BaseUrl);
            _89b.PathParts = this.PathParts.slice();
            return _89b;
        },
        constructor: function(_89c) {
            this._BaseUrl = _89c || "";
            this.PathParts = [];
        },
        _PathSeparator: "/"
    });
})();
(function() {
    "use strict";
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.Upload.UploadInfoFactory", null, {}, {
        _GetWebkitEntries: function(_89e) {
            var _89f = [];
            for (var i = 0; i < _89e.length; i++) {
                var _8a1 = _89e[i];
                var _8a2 = _8a1.webkitGetAsEntry && _8a1.webkitGetAsEntry();
                if (_8a2) {
                    _89f.push(_8a2);
                }
            }
            return _89f;
        },
        _ExtractFromWebkitEntriesAsync: function(_8a3, _8a4, _8a5) {
            if (_8a3.length === 0) {
                _8a4.PathParts.push("");
                var _8a6 = new ITHit.WebDAV.Client.Upload.UploadInfo(_8a4.Create());
                _8a5(new ITHit.WebDAV.Client.AsyncResult([_8a6], true, null));
            }
            var _8a7 = [];
            var _8a8 = _8a3.length;
            for (var i = 0; i < _8a3.length; i++) {
                var _8aa = _8a3[i];
                self._ExtractFromWebkitEntryAsync(_8aa, _8a4.Clone(), function(_8ab) {
                    _8a8--;
                    if (!_8ab.IsSuccess) {
                        _8a8 = 0;
                        _8a5(_8ab);
                        return;
                    }
                    _8a7 = _8a7.concat(_8ab.Result);
                    if (_8a8 <= 0) {
                        _8a5(new ITHit.WebDAV.Client.AsyncResult(_8a7, true, null));
                    }
                });
            }
        },
        CreateFromFileList: function(_8ac, sUrl) {
            var _8ae = [];
            for (var i = 0; i < _8ac.length; i++) {
                var _8b0 = _8ac[i];
                var _8b1 = _8b0.webkitRelativePath || _8b0.name;
                var oUrl = new ITHit.WebDAV.Client.Upload.Utils.DavUrl("/" + _8b1, sUrl);
                var _8b3 = new ITHit.WebDAV.Client.Upload.UploadInfo(oUrl, _8b0);
                _8ae.push(_8b3);
            }
            return _8ae;
        },
        CreateFromInputAsync: function(_8b4, sUrl, _8b6) {
            if (sUrl.length && (sUrl.slice(-1) !== "/")) {
                sUrl += "/";
            }
            if (!!_8b4.webkitEntries && _8b4.webkitEntries.length > 0) {
                var _8b7 = this._GetWebkitEntries(_8b4.webkitEntries.items);
                if (_8b7.length > 0) {
                    var _8b8 = new ITHit.WebDAV.Client.Upload.Utils.DavUrlBuilder(sUrl);
                    self._ExtractFromWebkitEntriesAsync(_8b7, _8b8, function(_8b9) {
                        _8b6(_8b9);
                    });
                    return;
                }
            }
            var _8ba = this.CreateFromFileList(_8b4.files, sUrl);
            _8b6(new ITHit.WebDAV.Client.AsyncResult(_8ba, true, null));
        },
        CreateFromDataTransferAsync: function(_8bb, sUrl, _8bd) {
            if (sUrl.length && (sUrl.slice(-1) !== "/")) {
                sUrl += "/";
            }
            if (_8bb.items && _8bb.items.length > 0) {
                var _8be = this._GetWebkitEntries(_8bb.items);
                if (_8be.length > 0) {
                    var _8bf = new ITHit.WebDAV.Client.Upload.Utils.DavUrlBuilder(sUrl);
                    self._ExtractFromWebkitEntriesAsync(_8be, _8bf, function(_8c0) {
                        _8bd(_8c0);
                    });
                    return;
                }
            }
            var _8c1 = [];
            if (_8bb.files.length > 0) {
                _8c1 = self.CreateFromFileList(_8bb.files, sUrl);
            }
            _8bd(new ITHit.WebDAV.Client.AsyncResult(_8c1, true, null));
        },
        _ExtractFromWebkitEntryAsync: function(_8c2, _8c3, _8c4) {
            if (_8c2.isDirectory) {
                self._ExtractWebkitDirectoryChildrenAsync(_8c2, _8c3.Clone(), function(_8c5) {
                    if (_8c5.IsSuccess) {
                        _8c4(_8c5);
                    } else {
                        _8c4(new ITHit.WebDAV.Client.AsyncResult(_8c5.Result, true, null));
                    }
                });
            } else {
                _8c2.file(function(file) {
                    _8c3.PathParts.push(file.name);
                    var _8c7 = new ITHit.WebDAV.Client.Upload.UploadInfo(_8c3.Create(), file);
                    _8c4(new ITHit.WebDAV.Client.AsyncResult(_8c7, true, null));
                }, function(_8c8) {
                    _8c4(new ITHit.WebDAV.Client.AsyncResult(null, false, _8c8));
                });
            }
        },
        _ExtractWebkitDirectoryChildrenAsync: function(_8c9, _8ca, _8cb) {
            var _8cc = _8c9.createReader();
            _8cc.readEntries(function(_8cd) {
                _8ca.PathParts.push(_8c9.name);
                self._ExtractFromWebkitEntriesAsync(_8cd, _8ca, _8cb);
            }, function errorHandler(_8ce) {
                _8cb(new ITHit.WebDAV.Client.AsyncResult(null, false, _8ce));
            });
        }
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Controls.DropZone", ITHit.WebDAV.Client.Upload.Controls.HtmlControl, {
        Uploader: null,
        constructor: function(_8cf, _8d0) {
            this._super(_8d0);
            this._Uploader = _8cf;
            this.HtmlElement.addEventListener("drop", ITHit.Utils.MakeScopeClosure(this, "_OnDropHandler"), false);
            this.HtmlElement.addEventListener("dragover", ITHit.Utils.MakeScopeClosure(this, "_OnDragOverHandler"), false);
            this.HtmlElement.addEventListener("dragenter", ITHit.Utils.MakeScopeClosure(this, "_OnDragEnterHandler"), false);
        },
        _OnDropHandler: function(_8d1) {
            this._StopEvent(_8d1);
            var that = this;
            ITHit.WebDAV.Client.Upload.UploadInfoFactory.CreateFromDataTransferAsync(_8d1.dataTransfer, this._Uploader.GetUploadUrl(), function(_8d3) {
                that._Uploader.Queue.AddFilesToQueue(_8d3.Result, that);
            });
        },
        _OnDragEnterHandler: function(_8d4) {
            this._StopEvent(_8d4);
        },
        _OnDragOverHandler: function(_8d5) {
            if (ITHit.DetectBrowser.IE && (ITHit.DetectBrowser.IE < 10)) {
                this._StopEvent(_8d5);
            }
            var dt = _8d5.dataTransfer;
            if (!dt) {
                this._StopEvent(_8d5);
            }
            var _8d7 = dt.types;
            if (_8d7) {
                if (_8d7.contains && !_8d7.contains("Files")) {
                    return;
                }
                if (_8d7.indexOf && (-1 == _8d7.indexOf("Files"))) {
                    return;
                }
            }
            dt.dropEffect = "copy";
            this._StopEvent(_8d5);
        }
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Controls.Input", ITHit.WebDAV.Client.Upload.Controls.HtmlControl, {
        _Uploader: null,
        constructor: function(_8d8, _8d9) {
            this._super(_8d9);
            this._Uploader = _8d8;
            this.HtmlElement.addEventListener("change", ITHit.Utils.MakeScopeClosure(this, "_OnChange"), false);
        },
        _OnChange: function(_8da) {
            if (!_8da.target.value) {
                return;
            }
            this._StopEvent(_8da);
            var that = this;
            ITHit.WebDAV.Client.Upload.UploadInfoFactory.CreateFromInputAsync(_8da.target, this._Uploader.GetUploadUrl(), function(_8dc) {
                that._Uploader.Queue.AddFilesToQueue(_8dc.Result, that);
                _8da.target.value = "";
            });
        }
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Providers.UploadDiff", null, {
        BytesUploaded: 0,
        TimeUpload: 0,
        constructor: function(_8dd, _8de, _8df) {
            this.BytesUploaded = _8dd;
            this.TimeUpload = _8de;
        }
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Providers.ProgressDescriptor", null, {
        Url: "",
        Diffs: [],
        Size: 0,
        LastReportTime: null,
        StartPosition: 0,
        BytesUploaded: 0,
        LastUploadedBytes: 0,
        UploadStartTime: null,
        CurrentProgress: null,
        OldProgress: null,
        ElapsedTime: 0,
        constructor: function(sUrl, _8e1) {
            this.Url = sUrl;
            this.Size = _8e1;
            this.StartPosition = 0;
            this.UploadStartTime = new Date();
            this.Reset();
        },
        Reset: function(_8e2) {
            var oNow = _8e2 || new Date();
            this.LastReportTime = oNow;
            this.LastUploadedBytes = 0;
            this.Diffs = [];
        }
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Collections.Pair", null, {
        Key: "",
        Value: null,
        constructor: function(sKey, _8e5) {
            this.Key = sKey;
            this.Value = _8e5;
        },
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Collections.Map", null, {
        _UnderLayingObject: null,
        _Length: 0,
        constructor: function(_8e6) {
            this._UnderLayingObject = {};
            _8e6 = _8e6 || [];
            for (var i = 0; i < _8e6.length; i++) {
                var _8e8 = _8e6[i];
                this.Set(_8e8.Key, _8e8.Value);
            }
        },
        Clear: function() {
            this._UnderLayingObject = {};
            this._Length = 0;
        },
        Delete: function(sKey) {
            if (!this.Has(sKey)) {
                return false;
            }
            delete this._UnderLayingObject[sKey];
            this._Length--;
            return true;
        },
        Entries: function() {
            var _8ea = this.Keys();
            for (var i = 0; i < _8ea.length; i++) {
                var sKey = _8ea[i];
                _8ea.push(new ITHit.WebDAV.Client.Upload.Collections.Pair(sKey, this._UnderLayingObject[sKey]));
            }
            return _8ea;
        },
        Get: function(sKey) {
            return this._UnderLayingObject[sKey];
        },
        Has: function(sKey) {
            return !!this.Get(sKey);
        },
        Keys: function() {
            var _8ef = [];
            for (var sKey in this._UnderLayingObject) {
                if (Object.prototype.hasOwnProperty.call(this._UnderLayingObject, sKey)) {
                    _8ef.push(sKey);
                }
            }
            return _8ef;
        },
        Set: function(sKey, _8f2) {
            if (!this.Has(sKey)) {
                this._Length++;
            }
            this._UnderLayingObject[sKey] = _8f2;
            return this;
        },
        Values: function() {
            var _8f3 = [];
            for (var sKey in this._UnderLayingObject) {
                if (Object.prototype.hasOwnProperty.call(this._UnderLayingObject, sKey)) {
                    _8f3.push(this._UnderLayingObject[sKey]);
                }
            }
            return _8f3;
        },
        Count: function() {
            return this._Length;
        },
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Providers.ProgressTracker", null, {
        _Descriptor: null,
        _Url: "",
        _Session: null,
        _DiffCount: 5,
        constructor: function(_8f5, sUrl, _8f7) {
            this._Session = _8f5;
            this._Url = sUrl;
            this._Descriptor = new ITHit.WebDAV.Client.Upload.Providers.ProgressDescriptor(sUrl, _8f7);
            this._Descriptor.CurrentProgress = new ITHit.WebDAV.Client.Upload.Progress();
            this._Descriptor.CurrentProgress.TotalBytes = _8f7;
        },
        GetProgress: function() {
            return this._Descriptor.CurrentProgress;
        },
        _CalculateProgress: function() {
            var _8f8 = this._Descriptor.Size;
            var _8f9 = 0;
            var _8fa = 0;
            if (_8f8 === 0) {
                _8f9 = 100;
                _8fa = 0;
            } else {
                var _8fb = this._Descriptor.Diffs.slice(-1 * this._DiffCount);
                var _8fc = 0;
                var _8fd = 0;
                for (var i = 0, l = _8fb.length; i < l; i++) {
                    _8fc += _8fb[i].BytesUploaded;
                    _8fd += _8fb[i].TimeUpload;
                }
                _8f9 = Math.floor((this._Descriptor.BytesUploaded) / (_8f8) * 100);
                _8fa = _8fc / _8fd;
                _8fa = (_8fa > 0) ? _8fa : 0;
            }
            var _900 = new ITHit.WebDAV.Client.Upload.Progress();
            _900.TotalBytes = _8f8;
            _900.UploadedBytes = this._Descriptor.BytesUploaded;
            _900.Speed = Math.floor((Math.round(_8fa * 10) / 10));
            _900.Completed = _8f9;
            _900.ElapsedTime = Math.floor(this._Descriptor.ElapsedTime);
            if (_8fa) {
                var _901 = Math.ceil((_8f8 - this._Descriptor.BytesUploaded) / _8fa);
                _900.RemainingTime = Math.floor(_901);
            }
            return _900;
        },
        _Notify: function() {
            var _902 = new ITHit.WebDAV.Client.Upload.Events.ProgressChanged(this, this._Descriptor.OldProgress, this._Descriptor.CurrentProgress);
            ITHit.Events.DispatchEvent(this._Descriptor, "OnProgress", [_902]);
        },
        UpdateBytes: function(_903, _904) {
            var oNow = new Date();
            var _906 = _903 + this._Descriptor.StartPosition - this._Descriptor.LastUploadedBytes;
            var _907 = (oNow - this._Descriptor.LastReportTime) / 1000;
            var _908 = new ITHit.WebDAV.Client.Upload.Providers.UploadDiff(_906, _907);
            this._Descriptor.Diffs.push(_908);
            this._Descriptor.BytesUploaded = _903 + this._Descriptor.StartPosition;
            this._Descriptor.LastUploadedBytes = _903 + this._Descriptor.StartPosition;
            this._Descriptor.LastReportTime = oNow;
            this._Descriptor.ElapsedTime += _907;
            this._Descriptor.CurrentProgress = this._CalculateProgress();
            this._Notify();
        },
        CanUpdateFromServer: function() {
            return this._Descriptor.Size !== 0;
        },
        _Set: function(_909, _90a) {
            var _90b = this._Descriptor;
            var oNow = new Date();
            var _90d = (oNow - _90b.LastReportTime) / 1000;
            _90b.Reset();
            _90b.BytesUploaded = _909;
            _90b.LastUploadedBytes = 0;
            _90b.LastReportTime = oNow;
            _90b.ElapsedTime += _90d;
            _90b.CurrentProgress = this._CalculateProgress();
            this._Notify();
        },
        UpdateFromServerAsync: function(_90e) {
            var that = this;
            var _910 = this._Descriptor;
            this._Session.GetProgressReportAsync(that._Url, function(_911) {
                if (_911.IsSuccess && _911.Result[0]) {
                    var _912 = _911.Result[0];
                    if (_912.BytesUploaded < _910.StartPosition) {
                        _910.Reset();
                        _910.StartPosition = _912.BytesUploaded;
                    }
                    _912.BytesUploaded -= _910.StartPosition;
                    that._Set(_912.BytesUploaded, _912.TotalContentLength);
                }
                _90e(_911);
            });
        },
        OnProgressChanged: function(_913, _914) {
            var _915 = this._Descriptor;
            ITHit.Events.AddListener(_915, "OnProgress", _913, _914);
        },
        IsUploaded: function() {
            return this._Descriptor.BytesUploaded === this._Descriptor.Size;
        },
        Reset: function() {
            this._Descriptor.Reset();
            this._Descriptor.StartPosition = 0;
            this._Descriptor.BytesUploaded = 0;
            this._Descriptor.CurrentProgress = this._CalculateProgress();
            this._Notify();
        },
        StartTracking: function(_916) {
            _916 = _916 || this._Descriptor.BytesUploaded;
            this._Descriptor.StartPosition = _916;
        },
        StopTracking: function() {
            var _917 = this._Descriptor;
            _917.Reset();
            _917.CurrentProgress.Speed = 0;
            this._Notify();
        },
        StartResumableSessionAsync: function(_918) {
            if (this.CanUpdateFromServer() && (this.GetProgress().UploadedBytes !== 0)) {
                this.UpdateFromServerAsync(_918);
            } else {
                this.StartTracking();
                _918();
            }
        },
        StopResumableSessionAsync: function(_919) {
            if (this.CanUpdateFromServer()) {
                this.UpdateFromServerAsync(_919);
            } else {
                this.StopTracking();
                _919();
            }
        },
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.UploadItem", null, {
        _State: null,
        _ProgressTracker: null,
        GetFile: function() {
            return this._FileInfo.File || null;
        },
        GetUrl: function() {
            return this._FileInfo.Url.GetHref();
        },
        GetBaseUrl: function() {
            return this._FileInfo.Url.GetBaseUrl();
        },
        GetName: function() {
            return this._FileInfo.Url.GetName();
        },
        GetRelativePath: function() {
            return this._FileInfo.Url.GetRelativePath();
        },
        IsFolder: function() {
            return this._FileInfo.IsFolder();
        },
        GetSource: function() {
            return this._Source;
        },
        GetState: function() {
            return this._State;
        },
        GetProgress: function() {
            return this._ProgressTracker.GetProgress();
        },
        _SetState: function(_91a) {
            var _91b = this._State;
            this._State = _91a;
            var _91c = new ITHit.WebDAV.Client.Upload.Events.StateChanged(this, _91b, _91a);
            ITHit.Events.DispatchEvent(this, _91c.Name, _91c);
        },
        _SetProgress: function(_91d) {
            var _91e = this._Progress;
            this._Progress = _91d;
            var _91f = new ITHit.WebDAV.Client.Upload.Events.ProgressChanged(this, _91e, _91d);
            ITHit.Events.DispatchEvent(this, _91f.Name, _91f);
        },
        _FileInfo: null,
        _Source: null,
        _UploadProvider: null,
        constructor: function(_920, _921, _922, _923) {
            this._FileInfo = _921;
            this._Source = _922 || null;
            this._UploadProvider = _923;
            this._State = ITHit.WebDAV.Client.Upload.State.Queued;
            this._ProgressTracker = this._UploadProvider.CreateProgressTracker(this.GetUrl(), this.GetSize());
            this._ProgressTracker.OnProgressChanged("_SetProgress", this);
        },
        StartAsync: function(_924) {
            _924 = _924 || function() {};
            this._UploadProvider.StartUploadAsync(this, this._ProgressTracker, _924);
        },
        PauseAsync: function(_925) {
            _925 = _925 || function() {};
            this._UploadProvider.PauseUpload(this, _925);
        },
        CancelAsync: function(_926, _927, _928) {
            _928 = _928 || function() {};
            _926 = _926 || 5;
            _927 = _927 || 500;
            this._UploadProvider.AbortUpload(this, _926, _927, _928);
        },
        GetSize: function() {
            var _929 = this._FileInfo.File;
            return _929 ? (_929.size || _929.fileSize) : 0;
        },
        AddListener: function(_92a, _92b, _92c) {
            _92c = _92c || null;
            switch (_92a) {
                case ITHit.WebDAV.Client.Upload.Events.EventName.OnStateChanged:
                case ITHit.WebDAV.Client.Upload.Events.EventName.OnProgressChanged:
                    ITHit.Events.AddListener(this, _92a, _92b, _92c);
                    break;
                default:
                    throw new ITHit.WebDAV.Client.Exceptions.WebDavException("Not found event name `" + _92a + "`");
            }
        },
        RemoveListener: function(_92d, _92e, _92f) {
            switch (_92d) {
                case ITHit.WebDAV.Client.Upload.Events.EventName.OnStateChanged:
                case ITHit.WebDAV.Client.Upload.Events.EventName.OnProgressChanged:
                    ITHit.Events.RemoveListener(this, _92d, _92e, _92f);
                    break;
                default:
                    throw new ITHit.WebDAV.Client.Exceptions.WebDavException("Not found event name `" + _92d + "`");
            }
        }
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.QueueChanged", ITHit.WebDAV.Client.Upload.Events.BaseEvent, {
        AddedItems: [],
        RemovedItems: [],
        constructor: function(_930, _931, _932) {
            this.Name = ITHit.WebDAV.Client.Upload.Events.EventName.OnQueueChanged;
            this.AddedItems = _931 || [];
            this.RemovedItems = _932 || [];
            this.Sender = _930;
        }
    });
})();
(function() {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.LoadStart", ITHit.WebDAV.Client.Upload.Events.BaseEvent, {
        Item: null,
        ChunkStart: 0,
        ChunkEnd: 0,
        constructor: function(_933, _934, _935) {
            this.Name = ITHit.WebDAV.Client.Upload.Events.EventName.OnLoadStart;
            this.Item = _933;
            this.ChunkStart = _934 || 0;
            this.ChunkEnd = _935 || this.Item.GetSize();
        }
    });
})();
(function() {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.LoadProgress", ITHit.WebDAV.Client.Upload.Events.BaseEvent, {
        Item: null,
        BytesLoaded: 0,
        TotalBytes: 0,
        constructor: function(_936, _937, _938) {
            this.Name = ITHit.WebDAV.Client.Upload.Events.EventName.OnLoadProgress;
            this.Item = _936;
            this.BytesLoaded = _937 || 0;
            this.TotalBytes = _938 || 0;
        }
    });
})();
(function() {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.LoadError", ITHit.WebDAV.Client.Upload.Events.BaseEvent, {
        Item: null,
        Status: null,
        Text: "",
        constructor: function(_939, _93a, _93b) {
            this.Name = ITHit.WebDAV.Client.Upload.Events.EventName.OnLoadError;
            this.Item = _939;
            this.Status = _93a;
            this.Text = _93b;
        }
    });
})();
(function() {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.LoadEnd", ITHit.WebDAV.Client.Upload.Events.BaseEvent, {
        Item: null,
        Response: null,
        constructor: function(_93c, _93d) {
            this.Name = ITHit.WebDAV.Client.Upload.Events.EventName.OnLoadEnd;
            this.Item = _93c;
            this.Response = _93d;
        }
    });
})();
(function() {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Uploaders.BaseUploader", null, {
        Url: null,
        IsAborted: false,
        UploadItem: null,
        BeginUpload: function(_93e, _93f) {},
        Destruct: function() {}
    });
})();
(function() {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Uploaders.BaseXhrUploader", ITHit.WebDAV.Client.Upload.Uploaders.BaseUploader, {
        _LastReportTime: 0,
        _ReportPeriod: 1000,
        _Xhr: null,
        _ChunkStart: 0,
        _ChunkEnd: null,
        _ChunkSize: 0,
        _SkipLoadStartHandling: false,
        _File: null,
        _HttpMethod: "PUT",
        constructor: function(_940) {
            this._ChunkSize = _940 || 0;
        },
        BeginUpload: function(_941, _942) {
            if (this.IsAborted) {
                return;
            }
            this._ChunkStart = _942 || 0;
            this.Url = _941.GetUrl();
            this.UploadItem = _941;
            this._File = _941.GetFile();
            this._InitializeXhr();
            this._BeginUploadInternal();
        },
        _IsPartial: function() {
            var _943 = this.UploadItem.GetSize();
            return (this._ChunkSize > 0 && this._ChunkSize < _943) || this.UploadItem.GetProgress().UploadedBytes > 0;
        },
        _BeginUploadInternal: function() {
            var _944 = this.UploadItem.GetSize();
            if (this._IsPartial()) {
                this._ChunkStart = this.UploadItem.GetProgress().UploadedBytes;
                this._ChunkEnd = null;
                this._ChunkEnd = this._ChunkStart + this._ChunkSize;
                if (this._ChunkEnd > _944 || this._ChunkSize === 0) {
                    this._ChunkEnd = _944;
                }
                if (this._ChunkStart !== 0 || this._ChunkEnd !== _944) {
                    this._Xhr.setRequestHeader("Content-Range", "bytes " + this._ChunkStart + "-" + (this._ChunkEnd - 1) + "/" + _944);
                }
                if (this._ChunkEnd < _944) {
                    this._Xhr.send(this._File.slice(this._ChunkStart, this._ChunkEnd));
                } else {
                    this._Xhr.send(this._File.slice(this._ChunkStart));
                }
            } else {
                this._ChunkStart = 0;
                this._ChunkEnd = null;
                this._Xhr.send(this._File);
            }
        },
        _InitializeXhr: function() {
            this._Xhr = new XMLHttpRequest();
            this._Xhr.upload.onloadstart = ITHit.Utils.MakeScopeClosure(this, "_LoadStartHandler", this._Xhr);
            this._Xhr.upload.onprogress = ITHit.Utils.MakeScopeClosure(this, "_ProgressHandler", this._Xhr);
            this._Xhr.onreadystatechange = ITHit.Utils.MakeScopeClosure(this, "_ReadyStateChange", this._Xhr);
            var _945 = ITHit.WebDAV.Client.Encoder.Encode(this.UploadItem.GetUrl());
            this._Xhr.open(this._HttpMethod, _945, true);
            try {
                this._Xhr.withCredentials = true;
            } catch (e) {}
        },
        _LoadStartHandler: function(oXhr, _947) {
            if (!this._SkipLoadStartHandling) {
                var _948 = new ITHit.WebDAV.Client.Upload.Events.LoadStart(this.UploadItem, this._ChunkStart, this._ChunkEnd);
                ITHit.Events.DispatchEvent(this, _948.Name, [this, _948]);
            }
        },
        _FireProgressChanged: function(_949) {
            var _94a = new ITHit.WebDAV.Client.Upload.Events.LoadProgress(this.UploadItem, _949, this.UploadItem.GetSize());
            ITHit.Events.DispatchEvent(this, _94a.Name, [this, _94a]);
        },
        _ProgressHandler: function(oXhr, _94c) {
            var iNow = new Date().getTime();
            if (iNow - this._LastReportTime < this._ReportPeriod) {
                return;
            }
            this._LastReportTime = iNow;
            var _94e = _94c.loaded;
            this._FireProgressChanged(_94e);
        },
        _ReadyStateChange: function(oXhr, _950) {
            if (this._Xhr.readyState !== 4) {
                return;
            }
            var _951 = new ITHit.WebDAV.Client.HttpStatus(this._Xhr.status, this._Xhr.statusText);
            if (_951.IsSuccess()) {
                this._LoadHandler(oXhr, _950);
            } else {
                this._ErrorHandler(oXhr, _950, _951);
            }
        },
        _ErrorHandler: function(oXhr, _953, _954) {
            var _955 = new ITHit.WebDAV.Client.Upload.Events.LoadError(this, _954, oXhr.responseText);
            ITHit.Events.DispatchEvent(this, _955.Name, [this, _955]);
        },
        _CreateResponse: function(oXhr) {
            var _957 = new ITHit.WebDAV.Client.HttpStatus(oXhr.status, oXhr.statusText);
            var _958 = new ITHit.HttpResponse(this.Url, _957.Code, _957.Description);
            _958._SetBody(oXhr.responseXML, oXhr.responseText);
            return _958;
        },
        IsLastPart: function() {
            return this._ChunkEnd && this._ChunkEnd !== this.UploadItem.GetSize();
        },
        _LoadHandler: function(oXhr, _95a) {
            if (this.UploadItem) {
                if (this._IsPartial() && this.IsLastPart()) {
                    this._SkipLoadStartHandling = true;
                    this._FireProgressChanged(this._ChunkEnd);
                    this.BeginUpload(this.UploadItem, this._ChunkSize);
                    return;
                }
                var _95b = this._CreateResponse(oXhr);
                var _95c = new ITHit.WebDAV.Client.Upload.Events.LoadEnd(this.UploadItem, _95b);
                ITHit.Events.DispatchEvent(this, _95c.Name, [this, _95c]);
            }
        },
        Destruct: function() {
            this.IsAborted = true;
            if (!this._Xhr) {
                return;
            }
            if (this._Xhr.upload) {
                this._Xhr.upload.onloadstart = null;
                this._Xhr.upload.onprogress = null;
            }
            this._Xhr.onreadystatechange = null;
            this._Xhr.abort();
        }
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Providers.UploadTask", null, {
        Uploader: null,
        UploadItem: null,
        ProgressTracker: null,
        IsStarted: false,
        constructor: function(_95d, _95e, _95f) {
            this.Uploader = _95d;
            this.UploadItem = _95e;
            this.ProgressTracker = _95f;
        }
    });
})();
(function() {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.UploaderSession", ITHit.WebDAV.Client.WebDavSession, {
        ExistsFolders: [],
        GetProgressReportAsync: function(sUrl, _961) {
            var _962 = this.CreateRequest(this.__className + ".ReportAsync()");
            var _963 = ITHit.WebDAV.Client.Encoder.Encode(sUrl);
            var _964 = ITHit.WebDAV.Client.HierarchyItem.GetHost(_963);
            ITHit.WebDAV.Client.Methods.Report.GoAsync(_962, _963, _964, null, null, function(_965) {
                _962.MarkFinish();
                _961(_965);
            });
            return _962;
        },
        CancelUploadAsync: function(sUrl, _967) {
            var _968 = this.CreateRequest(this.__className + ".CancelUpload()");
            var _969 = ITHit.WebDAV.Client.Encoder.Encode(sUrl);
            var _96a = ITHit.WebDAV.Client.HierarchyItem.GetHost(_969);
            ITHit.WebDAV.Client.Methods.CancelUpload.GoAsync(_968, _969, [], _96a, function(_96b) {
                _968.MarkFinish();
                var _96c = new ITHit.WebDAV.Client.AsyncResult(true, true, null);
                if (_96b.Error instanceof ITHit.WebDAV.Client.Exceptions.NotFoundException) {
                    _96c = new ITHit.WebDAV.Client.AsyncResult(true, true, null);
                } else {
                    if (!_96b.IsSuccess) {
                        _96c = new ITHit.WebDAV.Client.AsyncResult(_96b.IsSuccess, _96b.IsSuccess, _96b.Error);
                    }
                }
                _967(_96c);
            });
            return _968;
        },
        CheckExistsAsync: function(sUrl, _96e) {
            _96e = _96e || function() {};
            return this.OpenItemAsync(ITHit.WebDAV.Client.Encoder.Encode(sUrl), [], function(_96f) {
                var _970 = new ITHit.WebDAV.Client.AsyncResult(true, true, null);
                if (_96f.Error instanceof ITHit.WebDAV.Client.Exceptions.NotFoundException) {
                    _970 = new ITHit.WebDAV.Client.AsyncResult(false, true, null);
                } else {
                    if (!_96f.IsSuccess) {
                        _970 = new ITHit.WebDAV.Client.AsyncResult(_96f.IsSuccess, _96f.IsSuccess, _96f.Error);
                    }
                }
                _96e(_970);
            });
        },
        DeleteAsync: function(_971, _972, _973) {
            _972 = _972 || null;
            var _974 = ITHit.WebDAV.Client.Encoder.Encode(_971);
            var _975 = ITHit.WebDAV.Client.HierarchyItem.GetHost(_974);
            var _976 = this.CreateRequest(this.__className + ".DeleteAsync()");
            ITHit.WebDAV.Client.Methods.Delete.GoAsync(_976, _974, _972, _975, function(_977) {
                if (!_977.IsSuccess && _977.Error instanceof ITHit.WebDAV.Client.Exceptions.NotFoundException) {
                    _977 = new ITHit.WebDAV.Client.AsyncResult(true, true, null);
                }
                _976.MarkFinish();
                _973(_977);
            });
            return _976;
        }
    });
})();
(function() {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Uploaders.WebKitUploader", ITHit.WebDAV.Client.Upload.Uploaders.BaseXhrUploader, {
        _InitializeXhr: function() {
            this._super();
            this._Xhr.setRequestHeader("If-Modified-Since", "Mon, 26 Jul 1997 05:00:00 GMT");
            this._Xhr.setRequestHeader("Cache-Control", "no-cache");
            this._Xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        }
    });
})();
(function() {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Uploaders.FolderUploader", ITHit.WebDAV.Client.Upload.Uploaders.BaseUploader, {
        Url: null,
        UploadItem: null,
        _Session: null,
        constructor: function(_978) {
            this._Session = _978;
        },
        _DispatchLoadStart: function() {
            var _979 = new ITHit.WebDAV.Client.Upload.Events.LoadStart(this.UploadItem, 0, 0);
            ITHit.Events.DispatchEvent(this, _979.Name, [this, _979]);
        },
        _DispatchLoadEnd: function() {
            var _97a = new ITHit.WebDAV.Client.Upload.Events.LoadEnd(this.UploadItem, null);
            ITHit.Events.DispatchEvent(this, _97a.Name, [this, _97a]);
        },
        BeginUpload: function(_97b, _97c) {
            this.Url = _97b.GetUrl();
            this.UploadItem = _97b;
            this._DispatchLoadStart();
            var that = this;
            if (_97b._FileInfo.IsExists) {
                that._DispatchProgressChanged();
                that._DispatchLoadEnd();
                return;
            }
            this._Session.CreateFolderAsync(this.Url, null, function(_97e) {
                if (!_97e.IsSuccess) {
                    that._DispatchProgressChanged();
                    that._DispatchError(_97e.Status, _97e.Error);
                } else {
                    that._DispatchLoadEnd();
                }
            });
        },
        _DispatchError: function(_97f, _980) {
            var _981 = new ITHit.WebDAV.Client.Upload.Events.LoadError(this, _97f, _980);
            ITHit.Events.DispatchEvent(this, _981.Name, [this, _981]);
        },
        _DispatchProgressChanged: function() {
            var _982 = new ITHit.WebDAV.Client.Upload.Events.LoadProgress(this.UploadItem, 0, 0);
            ITHit.Events.DispatchEvent(this, _982.Name, [this, _982]);
        }
    });
})();
(function() {
    var _983 = ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Uploaders.CreateParentDecorator", ITHit.WebDAV.Client.Upload.Uploaders.BaseUploader, {
        _Uploader: null,
        _PathsToCreate: [],
        _CurrentRequest: null,
        constructor: function(_984, _985) {
            this._Session = _984;
            this._Uploader = _985;
        },
        _SubscribeOnEvents: function() {
            ITHit.Events.AddListener(this._Uploader, ITHit.WebDAV.Client.Upload.Events.EventName.OnLoadStart, "_ForwardEventStart", this);
            ITHit.Events.AddListener(this._Uploader, ITHit.WebDAV.Client.Upload.Events.EventName.OnLoadProgress, "_ForwardEventStart", this);
            ITHit.Events.AddListener(this._Uploader, ITHit.WebDAV.Client.Upload.Events.EventName.OnLoadEnd, "_ForwardEventStart", this);
            ITHit.Events.AddListener(this._Uploader, ITHit.WebDAV.Client.Upload.Events.EventName.OnLoadError, "_ForwardEventStart", this);
        },
        BeginUpload: function(_986, _987) {
            if (this.IsAborted || !this._Uploader) {
                return;
            }
            this._SubscribeOnEvents();
            var that = this;
            if (_986._FileInfo.IsExists) {
                that._Uploader.BeginUpload(_986, _987);
                that.UploadItem = that._Uploader.UploadItem;
                that.Url = that._Uploader.Url;
                return;
            }
            this._CreateMissedParentsAsync(_986, function(_989) {
                if (!_989.IsSuccess || that.IsAborted || !that._Uploader) {
                    return;
                }
                that._Uploader.BeginUpload(_986, _987);
                that.UploadItem = that._Uploader.UploadItem;
                that.Url = that._Uploader.Url;
            });
        },
        Destruct: function() {
            this.IsAborted = true;
            if (this._CurrentRequest) {
                this._CurrentRequest.Abort();
            }
            if (this._Uploader) {
                this._Uploader.Destruct();
                ITHit.Events.RemoveAllListeners(this._Uploader);
                this._Uploader = null;
            }
        },
        _ForwardEventStart: function(_98a, _98b) {
            ITHit.Events.DispatchEvent(this, _98b.Name, [_98a, _98b]);
        },
        _GetAncestorsPaths: function(_98c) {
            var _98d = _98c.GetRelativePath();
            var _98e = _98d.split("/");
            if (_98c.IsFolder()) {
                _98e = _98e.slice(0, -1);
            }
            var _98f = [];
            if (_98e.length > 1) {
                var path = "";
                for (var i2 = 0; i2 < _98e.length - 1; i2++) {
                    if (path !== "") {
                        path += "/";
                    }
                    path += _98e[i2];
                    _98f.push(_98c.GetBaseUrl() + path);
                }
            }
            return _98f;
        },
        _CreateMissedParentsAsync: function(_992, _993) {
            this._PathsToCreate = this._PathsToCreate.concat(this._GetAncestorsPaths(_992));
            this._CreatePathCollectionAsync(this._PathsToCreate, _993);
        },
        _CreatePathCollectionAsync: function(aUrl, _995) {
            if (aUrl.length > 0 && !this.IsAborted) {
                var self = this;
                var _997 = aUrl[0];
                self._CreateFolderIfNotExists(_997, function(_998) {
                    if (_998.IsSuccess) {
                        self._CreatePathCollectionAsync(aUrl.slice(1), function(_999) {
                            if (_999.IsSuccess) {
                                _995(new ITHit.WebDAV.Client.AsyncResult(aUrl, true, null));
                            } else {
                                _995(new ITHit.WebDAV.Client.AsyncResult(aUrl, false, _999.Error));
                            }
                        });
                    } else {
                        _995(new ITHit.WebDAV.Client.AsyncResult(aUrl, false, _998.Error));
                    }
                });
            } else {
                _995(new ITHit.WebDAV.Client.AsyncResult(aUrl, true, null));
            }
        },
        _CreateFolderIfNotExists: function(sUrl, _99b) {
            if (this.IsAborted) {
                _99b(new ITHit.WebDAV.Client.AsyncResult(sUrl, true, null));
                return;
            }
            var self = this;
            this._EnterUrlGuarded(sUrl, function() {
                self._CurrentRequest = self._Session.CheckExistsAsync(sUrl, function(_99d) {
                    if (_99d.IsSuccess && !_99d.Result && !self.IsAborted) {
                        self._CurrentRequest = self._Session.CreateFolderAsync(sUrl, null, function(_99e) {
                            if (_99e.IsSuccess) {
                                self._LeaveUrlGuarded(sUrl);
                                _99b(new ITHit.WebDAV.Client.AsyncResult(sUrl, true, null));
                            } else {
                                self._LeaveUrlGuarded(sUrl);
                                _99b(new ITHit.WebDAV.Client.AsyncResult(sUrl, false, _99e.Error));
                            }
                        });
                    } else {
                        self._LeaveUrlGuarded(sUrl);
                        _99b(new ITHit.WebDAV.Client.AsyncResult(sUrl, true, null));
                    }
                });
            });
        },
        _EnterUrlGuarded: function(sUrl, _9a0) {
            var _9a1 = _983._UrlInProgress.Get(sUrl);
            if (_9a1) {
                _9a1.push(_9a0);
            } else {
                _983._UrlInProgress.Set(sUrl, []);
                setTimeout(_9a0, 0);
            }
        },
        _LeaveUrlGuarded: function(sUrl) {
            var _9a3 = _983._UrlInProgress.Get(sUrl);
            if (_9a3 && _9a3.length) {
                var _9a4 = _9a3.pop();
                setTimeout(_9a4, 0);
            } else {
                _983._UrlInProgress.Delete(sUrl);
            }
        }
    }, {
        _UrlInProgress: new ITHit.WebDAV.Client.Upload.Collections.Map()
    });
})();
(function() {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Uploaders.UploadersFactory", null, {
        _Session: null,
        constructor: function(_9a5) {
            this._Session = _9a5;
        },
        CreateFromUploadItem: function(_9a6) {
            var _9a7 = null;
            if (_9a6.IsFolder()) {
                _9a7 = new ITHit.WebDAV.Client.Upload.Uploaders.FolderUploader(this._Session);
            } else {
                _9a7 = new ITHit.WebDAV.Client.Upload.Uploaders.WebKitUploader();
            }
            return new ITHit.WebDAV.Client.Upload.Uploaders.CreateParentDecorator(this._Session, _9a7);
        }
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Utils.RepeatableActionContext", null, {
        _RoundsCount: 0,
        _IsActive: true,
        _Handler: null,
        _EndHandler: null,
        _RepeatTime: 0,
        constructor: function(_9a8, _9a9, _9aa, _9ab) {
            this._RoundsCount = _9a8;
            this._Handler = _9aa;
            this._EndHandler = _9ab;
            this._IsActive = !!_9a8;
            this._RepeatTime = _9a9;
        },
        Stop: function(_9ac) {
            this._IsActive = false;
            this._RoundsCount = 0;
            this._EndHandler(_9ac);
        },
        _RunRound: function() {
            if (this._IsActive) {
                this._Handler(this);
            } else {
                this.Stop();
            }
        },
        EndRound: function(_9ad) {
            this._RoundsCount--;
            if (this._RoundsCount === 0) {
                this.Stop(_9ad);
            } else {
                setTimeout(this._RunRound.bind(this), this._RepeatTime);
            }
        }
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Utils.RepeatableAction", null, {
        _Action: null,
        constructor: function(_9ae) {
            this._Action = _9ae;
        },
        RunAsync: function(_9af, _9b0, _9b1) {
            var _9b2 = new ITHit.WebDAV.Client.Upload.Utils.RepeatableActionContext(_9af, _9b0, this._Action, _9b1);
            _9b2._RunRound();
        }
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Providers.UploadProvider", null, {
        _UploadTasks: null,
        UploadCounter: 0,
        CreateProgressTracker: function(sUrl, _9b4) {
            return new ITHit.WebDAV.Client.Upload.Providers.ProgressTracker(this._Session, sUrl, _9b4);
        },
        _Session: null,
        _UploadersFactory: null,
        constructor: function(_9b5) {
            this.UploadCounter = 0;
            this._UploadTasks = {};
            this._Session = _9b5;
            this.ProgressTracker = new ITHit.WebDAV.Client.Upload.Providers.ProgressTracker(this._Session);
            this._UploadersFactory = new ITHit.WebDAV.Client.Upload.Uploaders.UploadersFactory(this._Session);
        },
        _SubscribeOnUploaderEvents: function(_9b6) {
            ITHit.Events.AddListener(_9b6, ITHit.WebDAV.Client.Upload.Events.EventName.OnLoadStart, "_LoadStartHandler", this);
            ITHit.Events.AddListener(_9b6, ITHit.WebDAV.Client.Upload.Events.EventName.OnLoadProgress, "_ProgressHandler", this);
            ITHit.Events.AddListener(_9b6, ITHit.WebDAV.Client.Upload.Events.EventName.OnLoadEnd, "_LoadHandler", this);
            ITHit.Events.AddListener(_9b6, ITHit.WebDAV.Client.Upload.Events.EventName.OnLoadError, "_ErrorHandler", this);
        },
        _OnUploadSessionStart: function(_9b7, _9b8) {
            _9b7._SetState(ITHit.WebDAV.Client.Upload.State.Uploading);
            if (_9b8.ProgressTracker.IsUploaded()) {
                _9b8.ProgressTracker.Reset();
            }
            var _9b9 = this._UploadersFactory.CreateFromUploadItem(_9b7);
            _9b8.Uploader = _9b9;
            this._SubscribeOnUploaderEvents(_9b9);
            _9b9.BeginUpload(_9b7);
        },
        StartUploadAsync: function(_9ba, _9bb, _9bc) {
            var _9bd = _9ba.GetState();
            if (_9bd === ITHit.WebDAV.Client.Upload.State.Uploading) {
                return;
            }
            var _9be = new ITHit.WebDAV.Client.Upload.Providers.UploadTask(null, _9ba, _9bb);
            this._UploadTasks[_9ba.GetUrl()] = _9be;
            this.UploadCounter++;
            if (_9ba._FileInfo.IsExists) {
                var that = this;
                _9be.ProgressTracker.StartResumableSessionAsync(function() {
                    that._OnUploadSessionStart(_9ba, _9be);
                });
            } else {
                _9be.ProgressTracker.StartTracking();
                this._OnUploadSessionStart(_9ba, _9be);
            }
            _9bc();
        },
        _GetTaskByItem: function(_9c0) {
            var sUrl = _9c0.GetUrl();
            return this._UploadTasks[sUrl];
        },
        _LoadStartHandler: function(_9c2, _9c3) {
            var _9c4 = this._GetTaskByItem(_9c2.UploadItem);
            _9c4.IsStarted = true;
        },
        _ProgressHandler: function(_9c5, _9c6) {
            var _9c7 = this._GetTaskByItem(_9c5.UploadItem);
            if (!_9c7) {
                return;
            }
            _9c7.ProgressTracker.UpdateBytes(_9c6.BytesLoaded, _9c6.TotalBytes);
        },
        _LoadHandler: function(_9c8, _9c9) {
            this.ProgressTracker.UpdateBytes(_9c9.Item.GetSize(), _9c9.Item.GetSize());
            this._FinaliseUploadAsync(_9c8.UploadItem, function() {
                _9c8.UploadItem._SetState(ITHit.WebDAV.Client.Upload.State.Completed);
            });
        },
        _ErrorHandler: function(_9ca, _9cb) {
            var _9cc = this._GetTaskByItem(_9ca.UploadItem);
            if (!_9cc) {
                return;
            }
            this._FinaliseUploadAsync(_9ca.UploadItem, function() {
                _9cc.UploadItem._SetState(ITHit.WebDAV.Client.Upload.State.Failed);
            });
        },
        _FinaliseUploadAsync: function(_9cd, _9ce) {
            var _9cf = this._GetTaskByItem(_9cd);
            if (!_9cf) {
                _9ce();
            }
            if (_9cf.Uploader) {
                ITHit.Events.RemoveAllListeners(_9cf.Uploader);
                _9cf.Uploader.Destruct();
            }
            var that = this;
            if (_9cd.GetState() !== ITHit.WebDAV.Client.Upload.State.Uploading) {
                _9cf.ProgressTracker.StopResumableSessionAsync(function() {
                    delete that._UploadTasks[_9cd.GetUrl()];
                    that.UploadCounter--;
                    _9ce();
                });
            } else {
                _9cf.ProgressTracker.StopTracking();
                delete that._UploadTasks[_9cd.GetUrl()];
                that.UploadCounter--;
                _9ce();
            }
        },
        PauseUpload: function(_9d1, _9d2) {
            if (_9d1.GetState() !== ITHit.WebDAV.Client.Upload.State.Uploading) {
                return;
            }
            var _9d3 = this._GetTaskByItem(_9d1);
            if (!_9d3) {
                _9d2();
                return;
            }
            this._FinaliseUploadAsync(_9d1, function() {
                _9d1._SetState(ITHit.WebDAV.Client.Upload.State.Paused);
                _9d2();
            });
        },
        _AbortNotStartedUpload: function(_9d4, _9d5) {
            _9d4._SetState(ITHit.WebDAV.Client.Upload.State.Canceled);
            _9d4._ProgressTracker.Reset();
            _9d5();
        },
        OnAbortRequestFinalised: function(_9d6, _9d7, _9d8, _9d9) {
            var that = this;
            if (!_9d6._FileInfo.IsExists) {
                var _9db = new ITHit.WebDAV.Client.Upload.Utils.RepeatableAction(function(_9dc) {
                    that._Session.DeleteAsync(_9d6.GetUrl(), null, function(_9dd) {
                        if (_9dd.IsSuccess) {
                            _9dc.Stop(_9dd);
                        } else {
                            _9dc.EndRound(_9dd);
                        }
                    });
                });
                _9db.RunAsync(_9d7, _9d8, function(_9de) {
                    if (!!_9de && _9de.IsSuccess) {
                        _9d6._SetState(ITHit.WebDAV.Client.Upload.State.Canceled);
                    } else {
                        _9d6._SetState(ITHit.WebDAV.Client.Upload.State.Failed);
                    }
                    _9d6._ProgressTracker.Reset();
                    _9d9();
                });
                return;
            }
            that._Session.CancelUploadAsync(_9d6.GetUrl(), function(_9df) {
                _9d6._SetState(ITHit.WebDAV.Client.Upload.State.Canceled);
                _9d6._ProgressTracker.Reset();
                _9d9();
            });
        },
        AbortUpload: function(_9e0, _9e1, _9e2, _9e3) {
            _9e3 = _9e3 || function() {};
            var _9e4 = this._GetTaskByItem(_9e0);
            var _9e5 = _9e0.GetState();
            if (_9e5 == ITHit.WebDAV.Client.Upload.State.Paused || _9e5 == ITHit.WebDAV.Client.Upload.State.Failed) {
                this.OnAbortRequestFinalised(_9e0, _9e1, _9e2, _9e3);
            } else {
                if (!_9e4) {
                    this._AbortNotStartedUpload(_9e0, _9e3);
                } else {
                    var that = this;
                    this._FinaliseUploadAsync(_9e0, function() {
                        if (_9e4.IsStarted) {
                            that.OnAbortRequestFinalised(_9e0, _9e1, _9e2, _9e3);
                        } else {
                            that._AbortNotStartedUpload(_9e0, _9e3);
                        }
                    });
                }
            }
        }
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Utils.Array", null, {}, {
        MapParallel: function(_9e7, _9e8, _9e9, _9ea) {
            var _9eb = [];
            var _9ec = 0;
            if (_9e7.length === 0) {
                setTimeout(_9e9.apply(_9ea, _9e7));
            }
            for (var i = 0; i < _9e7.length; i++) {
                _9e8.apply(_9ea, [_9e7[i], i, _9e7, ITHit.Utils.MakeScopeClosure(this, function(i, _9ef) {
                    _9eb[i] = _9ef;
                    _9ec++;
                    if (_9ec === _9e7.length) {
                        setTimeout(_9e9.call(_9ea, _9eb));
                    }
                }, i)]);
            }
        }
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Queue", null, {
        Uploader: null,
        _UnderlyingArray: null,
        _UploadProvider: null,
        _Session: null,
        constructor: function(_9f0) {
            this.Uploader = _9f0;
            this._Session = new ITHit.WebDAV.Client.Upload.UploaderSession();
            this._UploadProvider = new ITHit.WebDAV.Client.Upload.Providers.UploadProvider(this._Session);
            this._UnderlyingArray = [];
        },
        ShouldReplaceDuplicate: function(_9f1) {
            var _9f2 = this.GetByUrl(_9f1.Url.GetHref());
            var _9f3 = _9f2.GetState();
            return !(_9f3 === ITHit.WebDAV.Client.Upload.State.Uploading || _9f3 === ITHit.WebDAV.Client.Upload.State.Paused);
        },
        _FillExistence: function(_9f4, _9f5) {
            ITHit.WebDAV.Client.Upload.Utils.Array.MapParallel(_9f4, function(_9f6, _9f7, _9f8, _9f9) {
                this._Session.CheckExistsAsync(_9f6.Url.GetHref(), function(_9fa) {
                    if (!_9fa.IsSuccess || !_9fa.Result) {
                        _9f6.IsExists = false;
                    } else {
                        _9f6.IsExists = true;
                    }
                    _9f9(_9f6);
                });
            }, function(_9fb) {
                _9f5(_9fb);
            }, this);
        },
        AddFilesToQueue: function(_9fc, _9fd) {
            var that = this;
            this._FillExistence(_9fc, function(_9ff) {
                var _a00 = [];
                for (var i = 0; i < _9ff.length; i++) {
                    var _a02 = _9ff[i];
                    if (that.HasUrl(_a02.Url.GetHref())) {
                        if (that.ShouldReplaceDuplicate(_a02)) {
                            that.RemoveByUrl(_a02.Url.GetHref());
                        } else {
                            continue;
                        }
                    }
                    var _a03 = new ITHit.WebDAV.Client.Upload.UploadItem(that, _a02, _9fd, that._UploadProvider);
                    _a00.push(_a03);
                }
                that.AddRange(_a00);
            });
        },
        Add: function(_a04) {
            var sUrl = _a04.GetUrl();
            if (this.HasUrl(sUrl)) {
                return;
            }
            this._UnderlyingArray.push(_a04);
            _a04.AddListener(ITHit.WebDAV.Client.Upload.Events.EventName.OnStateChanged, "_TryStartNewUpload", this);
            var _a06 = new ITHit.WebDAV.Client.Upload.Events.QueueChanged(this, [_a04]);
            ITHit.Events.DispatchEvent(this, _a06.Name, [_a06]);
            this._TryStartNewUpload();
        },
        AddRange: function(_a07) {
            for (var i = 0; i < _a07.length; i++) {
                var _a09 = _a07[i];
                var sUrl = _a09.GetUrl();
                if (this.HasUrl(sUrl)) {
                    continue;
                }
                this._UnderlyingArray.push(_a09);
                _a09.AddListener(ITHit.WebDAV.Client.Upload.Events.EventName.OnStateChanged, "_TryStartNewUpload", this);
            }
            this._OnQueueChanged(_a07, null);
        },
        GetByUrl: function(sUrl) {
            return ITHit.Utils.FindBy(this._UnderlyingArray, function(_a0c) {
                return _a0c.GetUrl() === sUrl;
            });
        },
        GetLength: function() {
            return this._UnderlyingArray.length;
        },
        HasUrl: function(sUrl) {
            return !!this.GetByUrl(sUrl);
        },
        RemoveByUrl: function(sUrl) {
            var _a0f = this.GetByUrl(sUrl);
            if (!_a0f) {
                return;
            }
            var _a10 = _a0f.GetState();
            if (_a10 === ITHit.WebDAV.Client.Upload.State.Uploading || _a10 === ITHit.WebDAV.Client.Upload.State.Paused) {
                this._UploadProvider.AbortUpload(_a0f);
            }
            var _a11 = ITHit.Utils.IndexOf(this._UnderlyingArray, _a0f);
            this._UnderlyingArray.splice(_a11, 1);
            this._OnQueueChanged(null, [_a0f]);
        },
        _OnQueueChanged: function(_a12, _a13) {
            var _a14 = new ITHit.WebDAV.Client.Upload.Events.QueueChanged(this, _a12, _a13);
            ITHit.Events.DispatchEvent(this, _a14.Name, [_a14]);
            this._TryStartNewUpload();
        },
        _TryStartNewUpload: function() {
            if (this._UploadProvider.UploadCounter < this.Uploader.Settings.ConcurrentUploads) {
                var _a15 = this.GetFirstByState(ITHit.WebDAV.Client.Upload.State.Queued);
                if (_a15) {
                    _a15.StartAsync();
                }
            }
        },
        GetFirstByState: function(_a16) {
            return ITHit.Utils.FindBy(this._UnderlyingArray, function(_a17) {
                return _a17.GetState() === _a16;
            });
        },
        AddListener: function(_a18, _a19, _a1a) {
            _a1a = _a1a || null;
            switch (_a18) {
                case ITHit.WebDAV.Client.Upload.Events.EventName.OnQueueChanged:
                    ITHit.Events.AddListener(this, _a18, _a19, _a1a);
                    break;
                default:
                    throw new ITHit.WebDAV.Client.Exceptions.WebDavException("Not found event name `" + _a18 + "`");
            }
        },
        RemoveListener: function(_a1b, _a1c, _a1d) {
            ITHit.Events.RemoveListener(this, _a1b, _a1c, _a1d);
        }
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.DropZoneCollection", null, {
        _UnderlyingSet: null,
        Uploader: null,
        constructor: function(_a1e) {
            this._Uploader = _a1e;
            this._UnderlyingSet = {};
        },
        AddById: function(_a1f) {
            var _a20 = this.GetById(_a1f);
            if (_a20) {
                return _a20;
            }
            var _a21 = new ITHit.WebDAV.Client.Upload.Controls.DropZone(this._Uploader, _a1f);
            this._UnderlyingSet[_a1f] = _a21;
            return _a21;
        },
        GetById: function(_a22) {
            return this._UnderlyingSet[_a22];
        },
        RemoveById: function(_a23) {
            var _a24 = this.GetById(_a23);
            if (_a24) {
                delete this._UnderlyingSet[_a23];
            }
        }
    });
})();
(function() {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.InputCollection", null, {
        _UnderlyingSet: null,
        Uploader: null,
        constructor: function(_a25) {
            this._UnderlyingArray = [];
            this._Uploader = _a25;
        },
        AddById: function(_a26) {
            var _a27 = new ITHit.WebDAV.Client.Upload.Controls.Input(this._Uploader, _a26);
            this._UnderlyingArray[_a26] = _a27;
            return _a27;
        },
        GetById: function(_a28) {
            return this._UnderlyingArray[_a28];
        },
        RemoveById: function(_a29) {
            var _a2a = this.GetById(_a29);
            if (_a2a) {
                delete this._UnderlyingSet[_a29];
            }
        }
    });
})();
(function() {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Settings", null, {
        ConcurrentUploads: 2,
        State: ITHit.WebDAV.Client.Upload.State.Uploading
    });
})();
(function() {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Uploader", null, {
        DropZones: null,
        Inputs: null,
        Queue: null,
        Settings: null,
        _UploadProvider: null,
        constructor: function() {
            this.Inputs = new ITHit.WebDAV.Client.Upload.InputCollection(this);
            this.DropZones = new ITHit.WebDAV.Client.Upload.DropZoneCollection(this);
            this.Queue = new ITHit.WebDAV.Client.Upload.Queue(this);
            this.Settings = new ITHit.WebDAV.Client.Upload.Settings();
        },
        SetUploadUrl: function(sUrl) {
            this._UploadUrl = sUrl;
        },
        GetUploadUrl: function() {
            return this._UploadUrl;
        }
    });
})();
ITHit.Temp = {};