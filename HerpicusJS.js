'use strict';

var Herpicus = {
	Document: {},
	Config: {
		Name: "Herpicus",
		AppName: "",
		Directive: "HerpicusApp",
		Theme: "Dark",
		Directory: {
			Config: "/Public/Config",
			Templates: "/Public/Templates",
			Javascript: "/Public/Javascript",
			Stylesheets: "/Public/Stylesheets",
			Images: "/Public/Images",
		},
		Require: {
			Javascript: {
				Async: true,
			},
			Stylesheet: {
				Async: true
			}
		},
		Templates: {
			Extension: ".tpl",
		},
		Scripts: [],
		Styles: [],
	},
	Cache: {}
};

Herpicus.Errors = [];
Herpicus.ErrorHandler = function() {
	var Wrapper, Error, Scope, Message, File, Line, Column, len = arguments.length, Methods = {
		Stacktrace: [],
		Message: null,
		File: null,
		Line: 0,
		Column: 0,
		Scope: function(){},
		toObject: function(){},
		toString: function(){}
	};
	Error = Scope = Message = File = null;
	Line = Column = 0;

	Wrapper = function(func) {
		if(!func.__isWrapped) {
			func.__isWrapped = function() {
				try {
					func.apply(this, arguments);
				} catch(e) {
					Herpicus.ErrorHandler(e);
					throw e;
				}
			}
		}

		return func.__isWrapped;
	}

	if(len == 1) {
		if(Herpicus.isFunction(arguments[0])) {
			Wrapper(arguments[0]);
		} else {
			Message = arguments[0];
		}
	} else if(len == 2) {
		Scope = arguments[0];
		Error = arguments[1];
	} else if(len == 5) {
		Message = arguments[0];
		File = arguments[1];
		Line = arguments[2];
		Column = arguments[3];
		Error = arguments[4];
	} else {
		Error = arguments;
	}

	var __Error__ = {};

	return Methods;
};

if(!document.querySelectorAll) {
	document.querySelectorAll = function(selector) {
		var doc = document,
		head = doc.documentElement.firstChild,
		styleTag = doc.createElement('STYLE');
		head.appendChild(styleTag);
		doc.__qsaels = [];

		styleTag.styleSheet.cssText = selector + "{x:expression(document.__qsaels.push(this))}";
		window.scrollBy(0, 0);

		return doc.__qsaels;
	}
}

Herpicus.Selector = function(selector) {
	var elements = document.querySelectorAll(selector), tmp = [];
	if(elements.length > 0) {
		Herpicus.ForEach(elements, function(i, element) {
			if(typeof element.nodeType !== 'undefined' && element.nodeType === 1) {
				tmp.push(Herpicus.Element(element));
			}
		});
	}
	return tmp;
}

Herpicus.Type = function(a) {
	return ({}).toString.call(a).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
Herpicus.isObject = function(a) {
	if(Herpicus.Type(a) == 'object') {
		return true;
	}
	return false;
};
Herpicus.isArray = function(a) {
	if(Herpicus.Type(a) == 'array') {
		return true;
	}
	return false;
};
Herpicus.isFunction = function(a) {
	if(typeof a == 'function') {
		return true;
	}
	return false;
};
Herpicus.isString = function(a) {
	if(Herpicus.Type(a) == 'string') {
		return true;
	}
	return false;
};
Herpicus.isInteger = function(a) {
	var b = Herpicus.Type(a);
	if(b == 'integer' || b == 'number') {
		return true;
	}
	return false;
};
Herpicus.isBoolean = function(a) {
	if(Herpicus.Type(a) == 'boolean') {
		return true;
	}
	return false;
};
Herpicus.isUndefined = function(a) {
	if(typeof a === 'undefined') {
		return true;
	}
	return false;
}
Herpicus.isDefined = function(a) {
	return !Herpicus.isUndefined(a);
}
Herpicus.isElement = function(value) {
	return value ? value.nodeType > 0 : false;
}
Herpicus.isTextNode = function(el) {
	return el && el.nodeType && el.nodeType === 3;
}
Herpicus.isWindow = function(a) {
	if(Herpicus.Type(a) == 'window') {
		return true;
	}
	return false;
};

Herpicus.Contains = function(a, b) {
	if(Herpicus.isArray(a)) {
		for(var i in a) {
			if(a[i] == b) {
				return true;
			}
		}
	}
	else if(Herpicus.isObject(a)) {
		if(a.hasOwnProperty(b)) {
			return true;
		}
	}
	else if(Herpicus.isString(a)) {
		if(a.indexOf(b) > -1) {
			return true;
		}
	}

	return false;
}

Herpicus.Has = function(obj, key) {
	return obj == Herpicus.isObject(obj) && obj.hasOwnProperty.call(obj, key);
}

Herpicus.Keys = function(obj) {
	var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

	var collectNonEnumProps = function(obj, keys) {
		var nonEnumIdx = nonEnumerableProps.length;
		var constructor = obj.constructor;
		var proto = (Herpicus.isFunction(constructor) && constructor.prototype) || ObjProto;

		var prop = 'constructor';
		if(Herpicus.Has(obj, prop) && !Herpicus.Contains(keys, prop)) {
			keys.push(prop);
		}

		while (nonEnumIdx--) {
			prop = nonEnumerableProps[nonEnumIdx];
			if(prop in obj && obj[prop] !== proto[prop] && !Herpicus.Contains(keys, prop)) {
				keys.push(prop);
			}
		}
	};

	var Keys = [];
	if(!Herpicus.isObject(obj)) {
		return Keys;
	}

	for(var key in obj) {
		if(Herpicus.Has(obj, key)) {
			keys.push(key);
		}
	}

	if(hasEnumBug) {
		collectNonEnumProps(obj, Keys);
	}

	return Keys;
}

Herpicus.Values = function(obj) {
	var Keys = Herpicus.Keys(obj);
	var length = Keys.length;
	var values = Array(length);

	for (var i = 0; i < length; i++) {
		values[i] = obj[keys[i]];
	}

	return values;
};

Herpicus.ForEach = function(obj, callback) {
	if(Herpicus.isFunction(callback)) {
		var value, i = 0;

		if(Herpicus.isArray(obj)) {
			for (; i < obj.length; i++) {
				value = callback.call(obj[i], i, obj[i]);

				if(value === false) {
					break;
				}
			}
		} else {
			for(i in obj) {
				value = callback.call(obj[i], i, obj[i]);

				if(value === false) {
					break;
				}
			}
		}
	}

	return obj;
}

Herpicus.Extend = function(dest) {
	if(!Herpicus.isObject(dest)) {
		dest = {};
	}

	if(Herpicus.isObject(arguments[1])) {
		for(var i in arguments[1]) {
			if(arguments[1].hasOwnProperty(i)) {
				var source = arguments[1][i];
				for(var prop in source) {
					if(source.hasOwnProperty(prop)) {
						dest[i] = source;
					}
				}
			}
		}
	}

	return dest;
};

Herpicus.Merge = function(target, source) {
	target = target || {};
	for(var i in source) {
		if(Herpicus.isObject(source[i])) {
			target[i] = Herpicus.Extend(target[i], source[i]);
		} else {
			target[i] = source[i];
		}
	}
	return target;
}

Herpicus.Insert = function(arr, index, item) {
	if(Herpicus.isArray(arr)) {
		return arr.splice(index, 0, item);
	}
	return arr;
}

Herpicus.Trim = function(str) {
	if(Herpicus.isString(str)) {
		if(String.prototype.trim) {
			return str.trim();
		}
		return str.replace(/^\s+|\s+$/g, "");
	}

	return str;
}

Herpicus.IndexOf = function(arr, searchElement, fromIndex) {
	if(Herpicus.isArray(arr) || Herpicus.isString(arr)) {
		if(Array.prototype.indexOf) {
			return arr.indexOf(searchElement, fromIndex);
		}

		var k;
		var O = Object(this);
		var len = O.length >>> 0;
		if(len === 0) {
			return -1;
		}

		var n = +fromIndex || 0;
		if(Math.abs(n) === Infinity) {
			n = 0;
		}

		if(n >= len) {
			return -1;
		}

		k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
		while(k < len) {
			if(k in O && O[k] === searchElement) {
				return k;
			}
			k++;
		}
	}

	return -1;
}

Herpicus.LastIndexOf = function(arr, searchElement) {
	if(Herpicus.isArray(arr)) {
		if(Array.prototype.lastIndexOf) {
			return arr.lastIndexOf(searchElement);
		}

		var n, k,
			t = Object(arr),
			len = t.length >>> 0;
		if(len === 0) {
			return -1;
		}
		n = len - 1;
		if(arguments.length > 1) {
			n = Number(arguments[1]);
			if(n != n) {
				n = 0;
			} else if(n != 0 && n != (1 / 0) && n != -(1 / 0)) {
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}
		for(k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--) {
			if(k in t && t[k] === searchElement) {
				return k;
			}
		}
	}
	return -1;
}

Herpicus.Sprintf = function() {
	var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
	var a = arguments;
	var i = 0;
	var format = a[i++];
	var pad = function(str, len, chr, leftJustify) {
		if(!chr) {
			chr = ' ';
		}
		var padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0).join(chr);
		return leftJustify ? str + padding : padding + str;
	};
	var justify = function(value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
		var diff = minWidth - value.length;
		if(diff > 0) {
			if(leftJustify || !zeroPad) {
				value = pad(value, minWidth, customPadChar, leftJustify);
			} else {
				value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
			}
		}
		return value;
	};
	var formatBaseX = function(value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
		var number = value >>> 0;
		prefix = prefix && number && {
			'2': '0b',
			'8': '0',
			'16': '0x'
		}[base] || '';
		value = prefix + pad(number.toString(base), precision || 0, '0', false);
		return justify(value, prefix, leftJustify, minWidth, zeroPad);
	};
	var formatString = function(value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
		if(precision != null) {
			value = value.slice(0, precision);
		}
		return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
	};
	var doFormat = function(substring, valueIndex, flags, minWidth, _, precision, type) {
		var number, prefix, method, textTransform, value;
		if(substring === '%%') {
			return '%';
		}
		var leftJustify = false;
		var positivePrefix = '';
		var zeroPad = false;
		var prefixBaseX = false;
		var customPadChar = ' ';
		var flagsl = flags.length;
		for(var j = 0; flags && j < flagsl; j++) {
			switch(flags.charAt(j)) {
				case ' ':
					positivePrefix = ' ';
					break;
				case '+':
					positivePrefix = '+';
					break;
				case '-':
					leftJustify = true;
					break;
				case "'":
					customPadChar = flags.charAt(j + 1);
					break;
				case '0':
					zeroPad = true;
					customPadChar = '0';
					break;
				case '#':
					prefixBaseX = true;
					break;
			}
		}
		if(!minWidth) {
			minWidth = 0;
		} else if(minWidth === '*') {
			minWidth = +a[i++];
		} else if(minWidth.charAt(0) == '*') {
			minWidth = +a[minWidth.slice(1, -1)];
		} else {
			minWidth = +minWidth;
		}
		if(minWidth < 0) {
			minWidth = -minWidth;
			leftJustify = true;
		}
		if(!isFinite(minWidth)) {
			throw new Error('sprintf: (minimum-)width must be finite');
		}
		if(!precision) {
			precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined;
		} else if(precision === '*') {
			precision = +a[i++];
		} else if(precision.charAt(0) == '*') {
			precision = +a[precision.slice(1, -1)];
		} else {
			precision = +precision;
		}
		value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];
		switch(type) {
			case 's':
				return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
			case 'c':
				return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
			case 'b':
				return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
			case 'o':
				return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
			case 'x':
				return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
			case 'X':
				return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
			case 'u':
				return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
			case 'i':
			case 'd':
				number = +value || 0;
				number = Math.round(number - number % 1);
				prefix = number < 0 ? '-' : positivePrefix;
				value = prefix + pad(String(Math.abs(number)), precision, '0', false);
				return justify(value, prefix, leftJustify, minWidth, zeroPad);
			case 'e':
			case 'E':
			case 'f':
			case 'F':
			case 'g':
			case 'G':
				number = +value;
				prefix = number < 0 ? '-' : positivePrefix;
				method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
				textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
				value = prefix + Math.abs(number)[method](precision);
				return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
			default:
				return substring;
		}
	};
	return format.replace(regex, doFormat);
}


Herpicus.Time = function() {
	return new Date().getTime();
}
Herpicus.UnixTime = function() {
	return Math.floor(Herpicus.Time() / 1000);
}
Herpicus.Date = {};
Herpicus.Date.Months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
Herpicus.Date.Month = function(i) {
	if(typeof i == 'number') {
		if(i >= 0 && i <= Herpicus.Date.Months.length) {
			return Herpicus.Date.Months[i];
		}
	}
}
Herpicus.Date.Unix = function(UnixTime) {
	var d = new Date(UnixTime * 1000);
	var Hours = d.getHours(),
		Minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes(),
		Seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds(),
		Month = Herpicus.Date.Month(d.getMonth());

	return {
		Raw: d,
		Format: function(i) {
			if(typeof i == 'number') {
				if(i == 1) {
					return Month + " " + d.getDate() + ", " + d.getFullYear() + " - " + Hours + ":" + Minutes;
				}
			}
		}
	}
}

Herpicus.Func = function(fn, value) {
	var r = {
		Name: "",
		Value: null,
		Arguments: {
			str: "",
			Count: 0,
			Names: []
		},
		str: "",
		Scope: null,
		Inject: function(){},
		Call: function(){}
	}

	if(Herpicus.isFunction(fn)) {
		r.str = fn.toString();

		var tmp = ((fn.name && ['', fn.name]) || r.str.match(/function ([^\(]+)/));
		r.Name = (tmp && tmp[1] || 'anonymous');

		r.Arguments.str = r.str.match(/\(.*?\)/)[0].replace(/\s/gi, '');
		r.Arguments.Names = r.Arguments.str.replace(/[()]/gi, '').split(',');
		r.Arguments.Count = r.Arguments.Names.length;

		if(Herpicus.isBoolean(value)) {
			if(value === true) {
				r.Value = fn.call(this);
			}
		}
		r.Inject = function(scope) {
			var s = r.str, i = s.indexOf('{'), vars = "";
			Herpicus.ForEach(scope, function(key, value) {
				vars += Herpicus.Sprintf("var %s=Herpicus.JSON.Parse(%s);", key, Herpicus.JSON.Stringify(value));
			});

			r.str = s.substr(0, i + 1) + vars + s.substr(i+1);

			return r;
		}

		r.Call = function() {
			return new Function("return " + r.str)();
		}
	}

	return r;
}

Herpicus.Directive = function(name, callback) {
	if(!Herpicus.Contains(Herpicus.Cache, "__Directives__")) {
		Herpicus.Cache["__Directives__"] = {};
	}

	if(Herpicus.isString(name) && !Herpicus.Contains(Herpicus.Cache["__Directives__"], name) && Herpicus.isFunction(callback)) {
		Herpicus.Cache["__Directives__"][name] = callback;
	}

	return Herpicus;
}

Herpicus.Controller = function(callback) {
	if(Herpicus.isFunction(callback)) {
		var directives = [];
		Herpicus.ForEach(Herpicus.Func(callback).Arguments.Names, function(_, Name) {
			if(Herpicus.Contains(Herpicus.Cache["__Directives__"], Name)) {
				directives.push(Herpicus.Cache["__Directives__"][Name].call(this));
			}
		});

		callback.apply(this, directives);
	}

	return Herpicus;
}



Herpicus.Validate = function(str) {
	var methods = {
		Directory: false,
		FilePath: false
	};

	// write validators

	return methods;
}

Herpicus.Http = function(Config) {
	if(!Herpicus.isObject(Config)) {
		return false;
	}

	var $Config = Herpicus.Merge({
		URL: null,
		Method: "GET",
		Params: "",
		Data: {},
		Cache: false,
		Async: true,
		Headers: [
			{"Content-Type": "application/x-www-form-urlencoded"}
		],
		Type: "text",
		Timeout: 5,
		Callback: null,
		Success: null,
		Error: null
	}, Config),
	ValidMethods = ["POST", "GET"],
	$Response = {
		readyState: 0,
		Data: {},
		Status: {
			Code: null,
			Text: null,
		},
		Headers: function(HeaderName) {},
		Config: $Config,
	};

	if(Herpicus.isString($Config.Method)) {
		$Config.Method = $Config.Method.toUpperCase();
	}

	if(!Herpicus.Contains(ValidMethods, $Config.Method)) {
		return false;
	}

	var request = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('MSXML2.XMLHTTP.3.0');
	request.open($Config.Method, $Config.URL, $Config.Async);

	if($Config.Method == "POST") {
		if(Herpicus.isObject($Config.Data)) {
			var params = [];
			Herpicus.ForEach($Config.Data, function(key, value) {
				params.push(Herpicus.Sprintf("%s=%s", key, value));
			});

			$Config.Params = params.join("&");
		}
	}

	Herpicus.ForEach($Config.Headers, function(i, v) {
		if(Herpicus.isObject(v)) {
			Herpicus.ForEach(v, function(Key, Value) {
				request.setRequestHeader(Key, Value);
			});
		}
	});

	request.onreadystatechange = function() {
		$Response.readyState = request.readyState;
		$Response.Status.Code = request.status;
		$Response.Status.Text = request.statusText;
		$Response.Data = request.responseText;
		$Response.XHR = request;

		if($Response.readyState === 4) {
			$Response.Data = $Config.Type === "json" ?
				Herpicus.JSON.Parse($Response.Data) :
				request.responseText;

			if(Herpicus.isFunction($Config.Callback)) {
				$Config.Callback.call(this, $Response);
			}

			if($Response.Status.Code === 200) {
				if(Herpicus.isFunction($Config.Success)) {
					$Config.Success.call(this, $Response.Data);
				}
			} else {
				if(Herpicus.isFunction($Config.Error)) {
					$Config.Error.call(this, $Response.Status);
				}
			}
		}
	}

	request.send($Config.Method === "POST" ? $Config.Params : null);
}
Herpicus.Http.Get = function(url, callback) {
	return Herpicus.Http({
		URL: url,
		Method: "GET",
		Callback: callback
	});
}
Herpicus.Http.Post = function(url, args, callback) {
	return Herpicus.Http({
		URL: url,
		Method: "POST",
		Data: args,
		Callback: callback
	});
}
Herpicus.Http.JSON = function(url, callback) {
	return Herpicus.Http({
		URL: url,
		Method: "GET",
		Type: "json",
		Callback: callback
	});
}
Herpicus.Http.JSONP = function(url, callback) {}

Herpicus.Generate = function() {};
Herpicus.Generate.String = function(i, characters) {
	var text = "";
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var length = 8;

	if(Herpicus.isDefined(arguments[0]) && Herpicus.isInteger(arguments[0]) && arguments[0] >= 1) {
		length = arugments[0];
	}

	for(var i = 0; i < length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		text += chars.substring(rnum, rnum+1);
	}

	return text;
};
Herpicus.Generate.Number = function(min, max) {};

Herpicus.Cookie = {};
Herpicus.Cookie.Defaults = {
	Path: "/",
	Domain: "." + window.location.hostname,
	Expires: 0,
	Secure: false
};
Herpicus.Cookie.Expire = {};
Herpicus.Cookie.Expire.Minute = 60;
Herpicus.Cookie.Expire.Hour = 3600;
Herpicus.Cookie.Expire.Day = 86400;
Herpicus.Cookie.Expire.Week = 604800;
Herpicus.Cookie.Expire.Month = 2629744;
Herpicus.Cookie.Expire.Year = 31556926;
Herpicus.Cookie.Get = function(name)
{
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if(parts.length == 2) {
		return parts.pop().split(";").shift();
	}

	return null;
};
Herpicus.Cookie.Set = function(name, value, expires, args) {
	var opts = Herpicus.Cookie.Defaults;
	if(Herpicus.isObject(args)) {
		opts = Herpicus.Merge(args, Herpicus.Cookie.Defaults);
	}

	if(Herpicus.isInteger(expires)) {
		expires = new Date(expires > 0 ? Herpicus.Time() + expires * 1000 : opts.Expires).toGMTString();
	} else {
		if(Herpicus.isInteger(opts.Expires)) {
			expires = opts.Expires;
		} else {
			expires = 0;
		}
	}

	document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + expires + ";domain=" + Herpicus.Cookie.Defaults.Domain + ";path=" + Herpicus.Cookie.Defaults.Path + ";";
};
Herpicus.Cookie.Delete = function(name)
{
	if(Herpicus.Cookie.Get(name)) {
		document.cookie = name + "=;expires=Thu, 01-Jan-70 00:00:01 GMT;domain=" + Herpicus.Cookie.Defaults.Domain + ";path=" + Herpicus.Cookie.Defaults.Path + ";";
	}
};

Herpicus.Timers = {};
Herpicus.ClearTimer = function(timer) {
	if(Herpicus.Contains(timer, "Type")) {
		if(timer.Type == "Interval") {
			clearInterval(timer.Timer);
		}
		else if(timer.Type == "Timeout") {
			clearTimeout(timer.Timer);
		}
	} else {
		try {
			clearInterval(timer);
		} catch(e) {
			try {
				clearTimeout(timer);
			} catch(ex) {
				console.log(e, ex);
			}
		}
	}
};
Herpicus.Interval = function(callback, interval) {
	if(Herpicus.isFunction(callback) && Herpicus.isInteger(interval)) {
		var id = Herpicus.Generate.String();
		if(interval < 10) {
			interval = 10;
		}

		Herpicus.Timers[id] = setInterval(callback, interval);

		return {
			Id: id,
			Type: "Interval",
			Stop: function() { Herpicus.ClearTimer(Herpicus.Timers[id]) },
			Timer: Herpicus.Timers[id]
		}
	}
};
Herpicus.Timeout = function(callback, timeout) {
	if(Herpicus.isFunction(callback) && Herpicus.isInteger(timeout)) {
		var id = Herpicus.Generate.String();
		if(timeout < 10) {
			timeout = 10;
		}

		Herpicus.Timers[id] = setTimeout(callback, timeout);

		return {
			Id: id,
			Type: "Timeout",
			Stop: function(){ Herpicus.ClearTimer(Herpicus.Timers[id]) },
			Timer: Herpicus.Timers[id]
		}
	}
};

// --------JSON 3--------- //
Herpicus.JSON = {};
/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
(function(){function N(p,r){function q(a){if(q[a]!==w)return q[a];var c;if("bug-string-char-index"==a)c="a"!="a"[0];else if("json"==a)c=q("json-stringify")&&q("json-parse");else{var e;if("json-stringify"==a){c=r.stringify;var b="function"==typeof c&&s;if(b){(e=function(){return 1}).toJSON=e;try{b="0"===c(0)&&"0"===c(new t)&&'""'==c(new A)&&c(u)===w&&c(w)===w&&c()===w&&"1"===c(e)&&"[1]"==c([e])&&"[null]"==c([w])&&"null"==c(null)&&"[null,null,null]"==c([w,u,null])&&'{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}'==
c({a:[e,!0,!1,null,"\x00\b\n\f\r\t"]})&&"1"===c(null,e)&&"[\n 1,\n 2\n]"==c([1,2],null,1)&&'"-271821-04-20T00:00:00.000Z"'==c(new C(-864E13))&&'"+275760-09-13T00:00:00.000Z"'==c(new C(864E13))&&'"-000001-01-01T00:00:00.000Z"'==c(new C(-621987552E5))&&'"1969-12-31T23:59:59.999Z"'==c(new C(-1))}catch(f){b=!1}}c=b}if("json-parse"==a){c=r.parse;if("function"==typeof c)try{if(0===c("0")&&!c(!1)){e=c('{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}');var n=5==e.a.length&&1===e.a[0];if(n){try{n=!c('"\t"')}catch(d){}if(n)try{n=
1!==c("01")}catch(g){}if(n)try{n=1!==c("1.")}catch(m){}}}}catch(X){n=!1}c=n}}return q[a]=!!c}p||(p=k.Object());r||(r=k.Object());var t=p.Number||k.Number,A=p.String||k.String,H=p.Object||k.Object,C=p.Date||k.Date,G=p.SyntaxError||k.SyntaxError,K=p.TypeError||k.TypeError,L=p.Math||k.Math,I=p.JSON||k.JSON;"object"==typeof I&&I&&(r.stringify=I.stringify,r.parse=I.parse);var H=H.prototype,u=H.toString,v,B,w,s=new C(-0xc782b5b800cec);try{s=-109252==s.getUTCFullYear()&&0===s.getUTCMonth()&&1===s.getUTCDate()&&
10==s.getUTCHours()&&37==s.getUTCMinutes()&&6==s.getUTCSeconds()&&708==s.getUTCMilliseconds()}catch(Q){}if(!q("json")){var D=q("bug-string-char-index");if(!s)var x=L.floor,M=[0,31,59,90,120,151,181,212,243,273,304,334],E=function(a,c){return M[c]+365*(a-1970)+x((a-1969+(c=+(1<c)))/4)-x((a-1901+c)/100)+x((a-1601+c)/400)};(v=H.hasOwnProperty)||(v=function(a){var c={},e;(c.__proto__=null,c.__proto__={toString:1},c).toString!=u?v=function(a){var c=this.__proto__;a=a in(this.__proto__=null,this);this.__proto__=
c;return a}:(e=c.constructor,v=function(a){var c=(this.constructor||e).prototype;return a in this&&!(a in c&&this[a]===c[a])});c=null;return v.call(this,a)});B=function(a,c){var e=0,b,f,n;(b=function(){this.valueOf=0}).prototype.valueOf=0;f=new b;for(n in f)v.call(f,n)&&e++;b=f=null;e?B=2==e?function(a,c){var e={},b="[object Function]"==u.call(a),f;for(f in a)b&&"prototype"==f||v.call(e,f)||!(e[f]=1)||!v.call(a,f)||c(f)}:function(a,c){var e="[object Function]"==u.call(a),b,f;for(b in a)e&&"prototype"==
b||!v.call(a,b)||(f="constructor"===b)||c(b);(f||v.call(a,b="constructor"))&&c(b)}:(f="valueOf toString toLocaleString propertyIsEnumerable isPrototypeOf hasOwnProperty constructor".split(" "),B=function(a,c){var e="[object Function]"==u.call(a),b,h=!e&&"function"!=typeof a.constructor&&F[typeof a.hasOwnProperty]&&a.hasOwnProperty||v;for(b in a)e&&"prototype"==b||!h.call(a,b)||c(b);for(e=f.length;b=f[--e];h.call(a,b)&&c(b));});return B(a,c)};if(!q("json-stringify")){var U={92:"\\\\",34:'\\"',8:"\\b",
12:"\\f",10:"\\n",13:"\\r",9:"\\t"},y=function(a,c){return("000000"+(c||0)).slice(-a)},R=function(a){for(var c='"',b=0,h=a.length,f=!D||10<h,n=f&&(D?a.split(""):a);b<h;b++){var d=a.charCodeAt(b);switch(d){case 8:case 9:case 10:case 12:case 13:case 34:case 92:c+=U[d];break;default:if(32>d){c+="\\u00"+y(2,d.toString(16));break}c+=f?n[b]:a.charAt(b)}}return c+'"'},O=function(a,c,b,h,f,n,d){var g,m,k,l,p,r,s,t,q;try{g=c[a]}catch(z){}if("object"==typeof g&&g)if(m=u.call(g),"[object Date]"!=m||v.call(g,
"toJSON"))"function"==typeof g.toJSON&&("[object Number]"!=m&&"[object String]"!=m&&"[object Array]"!=m||v.call(g,"toJSON"))&&(g=g.toJSON(a));else if(g>-1/0&&g<1/0){if(E){l=x(g/864E5);for(m=x(l/365.2425)+1970-1;E(m+1,0)<=l;m++);for(k=x((l-E(m,0))/30.42);E(m,k+1)<=l;k++);l=1+l-E(m,k);p=(g%864E5+864E5)%864E5;r=x(p/36E5)%24;s=x(p/6E4)%60;t=x(p/1E3)%60;p%=1E3}else m=g.getUTCFullYear(),k=g.getUTCMonth(),l=g.getUTCDate(),r=g.getUTCHours(),s=g.getUTCMinutes(),t=g.getUTCSeconds(),p=g.getUTCMilliseconds();
g=(0>=m||1E4<=m?(0>m?"-":"+")+y(6,0>m?-m:m):y(4,m))+"-"+y(2,k+1)+"-"+y(2,l)+"T"+y(2,r)+":"+y(2,s)+":"+y(2,t)+"."+y(3,p)+"Z"}else g=null;b&&(g=b.call(c,a,g));if(null===g)return"null";m=u.call(g);if("[object Boolean]"==m)return""+g;if("[object Number]"==m)return g>-1/0&&g<1/0?""+g:"null";if("[object String]"==m)return R(""+g);if("object"==typeof g){for(a=d.length;a--;)if(d[a]===g)throw K();d.push(g);q=[];c=n;n+=f;if("[object Array]"==m){k=0;for(a=g.length;k<a;k++)m=O(k,g,b,h,f,n,d),q.push(m===w?"null":
m);a=q.length?f?"[\n"+n+q.join(",\n"+n)+"\n"+c+"]":"["+q.join(",")+"]":"[]"}else B(h||g,function(a){var c=O(a,g,b,h,f,n,d);c!==w&&q.push(R(a)+":"+(f?" ":"")+c)}),a=q.length?f?"{\n"+n+q.join(",\n"+n)+"\n"+c+"}":"{"+q.join(",")+"}":"{}";d.pop();return a}};r.stringify=function(a,c,b){var h,f,n,d;if(F[typeof c]&&c)if("[object Function]"==(d=u.call(c)))f=c;else if("[object Array]"==d){n={};for(var g=0,k=c.length,l;g<k;l=c[g++],(d=u.call(l),"[object String]"==d||"[object Number]"==d)&&(n[l]=1));}if(b)if("[object Number]"==
(d=u.call(b))){if(0<(b-=b%1))for(h="",10<b&&(b=10);h.length<b;h+=" ");}else"[object String]"==d&&(h=10>=b.length?b:b.slice(0,10));return O("",(l={},l[""]=a,l),f,n,h,"",[])}}if(!q("json-parse")){var V=A.fromCharCode,W={92:"\\",34:'"',47:"/",98:"\b",116:"\t",110:"\n",102:"\f",114:"\r"},b,J,l=function(){b=J=null;throw G();},z=function(){for(var a=J,c=a.length,e,h,f,k,d;b<c;)switch(d=a.charCodeAt(b),d){case 9:case 10:case 13:case 32:b++;break;case 123:case 125:case 91:case 93:case 58:case 44:return e=
D?a.charAt(b):a[b],b++,e;case 34:e="@";for(b++;b<c;)if(d=a.charCodeAt(b),32>d)l();else if(92==d)switch(d=a.charCodeAt(++b),d){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:e+=W[d];b++;break;case 117:h=++b;for(f=b+4;b<f;b++)d=a.charCodeAt(b),48<=d&&57>=d||97<=d&&102>=d||65<=d&&70>=d||l();e+=V("0x"+a.slice(h,b));break;default:l()}else{if(34==d)break;d=a.charCodeAt(b);for(h=b;32<=d&&92!=d&&34!=d;)d=a.charCodeAt(++b);e+=a.slice(h,b)}if(34==a.charCodeAt(b))return b++,e;l();default:h=
b;45==d&&(k=!0,d=a.charCodeAt(++b));if(48<=d&&57>=d){for(48==d&&(d=a.charCodeAt(b+1),48<=d&&57>=d)&&l();b<c&&(d=a.charCodeAt(b),48<=d&&57>=d);b++);if(46==a.charCodeAt(b)){for(f=++b;f<c&&(d=a.charCodeAt(f),48<=d&&57>=d);f++);f==b&&l();b=f}d=a.charCodeAt(b);if(101==d||69==d){d=a.charCodeAt(++b);43!=d&&45!=d||b++;for(f=b;f<c&&(d=a.charCodeAt(f),48<=d&&57>=d);f++);f==b&&l();b=f}return+a.slice(h,b)}k&&l();if("true"==a.slice(b,b+4))return b+=4,!0;if("false"==a.slice(b,b+5))return b+=5,!1;if("null"==a.slice(b,
b+4))return b+=4,null;l()}return"$"},P=function(a){var c,b;"$"==a&&l();if("string"==typeof a){if("@"==(D?a.charAt(0):a[0]))return a.slice(1);if("["==a){for(c=[];;b||(b=!0)){a=z();if("]"==a)break;b&&(","==a?(a=z(),"]"==a&&l()):l());","==a&&l();c.push(P(a))}return c}if("{"==a){for(c={};;b||(b=!0)){a=z();if("}"==a)break;b&&(","==a?(a=z(),"}"==a&&l()):l());","!=a&&"string"==typeof a&&"@"==(D?a.charAt(0):a[0])&&":"==z()||l();c[a.slice(1)]=P(z())}return c}l()}return a},T=function(a,b,e){e=S(a,b,e);e===
w?delete a[b]:a[b]=e},S=function(a,b,e){var h=a[b],f;if("object"==typeof h&&h)if("[object Array]"==u.call(h))for(f=h.length;f--;)T(h,f,e);else B(h,function(a){T(h,a,e)});return e.call(a,b,h)};r.parse=function(a,c){var e,h;b=0;J=""+a;e=P(z());"$"!=z()&&l();b=J=null;return c&&"[object Function]"==u.call(c)?S((h={},h[""]=e,h),"",c):e}}}r.runInContext=N;return r}var K=typeof define==="function"&&define.amd,F={"function":!0,object:!0},G=F[typeof exports]&&exports&&!exports.nodeType&&exports,k=F[typeof window]&&
window||this,t=G&&F[typeof module]&&module&&!module.nodeType&&"object"==typeof global&&global;!t||t.global!==t&&t.window!==t&&t.self!==t||(k=t);if(G&&!K)N(k,G);else{var L=k.JSON,Q=k.JSON3,M=!1,A=N(k,k.JSON3={noConflict:function(){M||(M=!0,k.JSON=L,k.JSON3=Q,L=Q=null);return A}});k.JSON={parse:A.parse,stringify:A.stringify}}K&&define(function(){return A})}).call(this);

Herpicus.JSON3 = JSON3.noConflict();
Herpicus.JSON.Stringify = Herpicus.JSON3.stringify;
Herpicus.JSON.Parse = function(str) {
	if(Herpicus.isString(str)) {
		try {
			var ev = (new Function('return ' + Herpicus.Trim(str)))();
			if(Herpicus.isObject(ev) || Herpicus.isArray(ev)) {
				return ev;
			} else {
				return (window.JSON ? window.JSON : Herpicus.JSON3).parse(ev);
			}
		} catch(e) {

		}
	}

	return str;
};

Herpicus.Recaptcha = {};
Herpicus.Recaptcha.Key = null;
Herpicus.Recaptcha.Check = function(){};

Herpicus.Require = function() {};
Herpicus.Require.Javascript = function() {
	if(arguments.length > 0) {
		var loaded = 0, scripts = [], arg = arguments[1];
		var args = (
			Herpicus.isFunction(arg) ? function(){arg.call(this)} :
			Herpicus.isArray(arg) ? function(){Herpicus.Require.Javascript(arg)} :
			null
		);

		var createScript = function(Source, Async, Callback) {
			if(!Herpicus.isBoolean(Async)) {
				Async = Herpicus.Config.Require.Javascript.Async;
			}

			var script = document.createElement('script');
			script.src = Source;
			script.type = "text/javascript";
			script.charset = "utf-8";
			script.async = Async;

			script.onreadystatechange = script.onload = function() {
				if(args !== null) {
					loaded++;
					if(loaded == scripts.length) {
						if(args !== null) {
							args.call(this);
						}
					}
				}

				if(Herpicus.isFunction(Callback)) {
					Callback.call(this);
				}
			}

			if(!Herpicus.Contains(Herpicus.Cache, Source)) {
				Herpicus.Cache[Source] = script;
				Herpicus.Document.Head.Append(script);
			}

			return script;
		}

		if(Herpicus.isArray(arguments[0])) {
			Herpicus.ForEach(arguments[0], function(i, obj) {
				var Script = {
					Source: null,
					Async: null,
					Callback: null
				};

				if(Herpicus.isString(obj)) {
					if(obj !== "" || obj.length > 0) {
						Script.Source = Herpicus.Config.Directory.Javascript + "/" + obj + ".js";
						args !== null ? scripts.push(Script) : createScript(Script.Source);
					}
				}
				else if(Herpicus.isObject(obj)) {
					if(Herpicus.Contains(obj, "Name")) {
						Script.Source = Herpicus.isString(obj.Name) ? Herpicus.Config.Directory.Javascript + "/" + obj.Name + ".js" : null;
					}
					else if(Herpicus.Contains(obj, "Source")) {
						Script.Source = Herpicus.isString(obj.Source) ? obj.Source : null;
					}

					if(Herpicus.Contains(obj, "Async")) {
						Script.Async = Herpicus.isBoolean(obj.Async) ? obj.Async : null;
					}

					if(Herpicus.Contains(obj, "Callback")) {
						Script.Callback = Herpicus.isFunction(obj.Callback) ? obj.Callback : null;
					}

					Script.Source !== null ? (args !== null ? scripts.push(Script) : createScript(Script.Source, Script.Async, Script.Callback)) : null;
				}
			});

			if(args !== null) {
				Herpicus.ForEach(scripts, function(i, script) {
					createScript(script.Source, script.Async, script.Callback);
				});
			}
		}

		return Herpicus.Require;
	}
}

Herpicus.Require.Stylesheet = function(arr) {
	var Stylesheets = [];
	if(Herpicus.isString(arr)) {
		Stylesheets.push(arr);
	}
	else if(Herpicus.isArray(arr)) {
		Stylesheets = arr;
	}

	Herpicus.ForEach(Stylesheets, function(i, n) {
		var path = null;
		if(Herpicus.isString(n)) {
			path = Herpicus.Config.Directory.Stylesheets + "/" + n + ".css";
		}
		else if(Herpicus.isObject(n)) {
			if(n.hasOwnProperty('Name')) {
				path = Herpicus.Config.Directory.Stylesheets + "/" + n.Name + ".css";
			}
			else if(n.hasOwnProperty('Source')) {
				path = n.Source;
			}
		}

		if(path !== null) {
			if(!Herpicus.Contains(Herpicus.Cache, path)) {
				var link = document.createElement('link');
				link.href = path;
				link.rel = "stylesheet";

				Herpicus.Cache[path] = link;
				Herpicus.Document.Head.Append(link);
			}
		}
	});

	return Herpicus.Require;
}

Herpicus.Event = {};
Herpicus.Event.Add = function(e, fn, el, b) {
	if(!Herpicus.isBoolean(b)) {
		b = false;
	}

	var __registerEvent = function(e) {
		if(el.addEventListener) {
			el.addEventListener(e, fn, b);
		} else {
			var n = 'on' + e;
			if(el.attachEvent) {
				el.attachEvent(n, fn, b);
			} else {
				el[n] = fn;
			}
		}
	}

	if(Herpicus.isArray(e)) {
		Herpicus.ForEach(e, function(i, evt) {
			__registerEvent(evt);
		});
	} else if(Herpicus.isString(e)) {
		__registerEvent(e);
	}
};
Herpicus.Event.Remove = function(e, fn, el) {
	if(el.removeEventListener) {
		el.removeEventListener(e, fn);
	} else {
		if(el.detachEvent) {
			el.detachEvent('on' + e, fn);
		}
	}
};
Herpicus.Element = function(element) {
	var self = this;
	try {
		if(typeof element.nodeType === 'undefined') {
			if(Herpicus.isDefined(element.Source)) {
				element = element.Source;
			} else if(element.nodeType) {
				if(element.nodeType === 1) {
					// continue;
				} else if(element.nodeType === 3) {
					element = element.parentNode;
				}
			} else if(Herpicus.isString(element)) {
				var tmp = document.createElement('div');
				tmp.innerHTML = element;
				element = tmp.childNodes[0];

				tmp = null;
			} else if(Herpicus.Type(element) == "htmlcollection") {
				var elements = [];
				Herpicus.ForEach(element, function(_, el) {
					var e = Herpicus.Element(el);
					if(e !== null) {
						elements.push(e);
					}
				});
				return elements;
			} else {
				// console.log("Herpicus.Element -> Could not parse element: ", element);
				return null;
			}
		}

		var Class = {
			List: function() {
				return element.className.split(' ');
			},
			Contains: function(e) {
				if(element.className.split(' ').indexOf(e) > 0)
					return true;
				return false;
			},
			Add: function(e) {
				if(!Class.Contains(e)) {
					if(Class.List().length > 0)
						element.className += " ";
					element.className += e;
				}
				return self.Element(element);
			},
			Remove: function(e) {
				var arr = self.Element(element).List;
				if(arr.indexOf(e) > 0) {
					var r = new Array();
					for(var c in arr) {
						if(arr[c] != e) {
							r.push(arr[c]);
						}
					}
					element.className = r.join(" ");
				}
				return self.Element(element);
			},
			RemoveAll: function() {
				element.removeAttribute('class');
				return self.Element(element);
			}
		}
		var Find = {
			Id: function() {
				return self.Element(document.getElementById(element));
			}
		}
		var Scroll = {};
		Scroll.Top = function() {
			element.scrollTop = 0;
			return self.Element(element);
		};
		Scroll.Bottom = function() {
			element.scrollTop = element.scrollHeight;
			return self.Element(element);
		};
		Scroll.Set = function(i) {
			element.scrollTop = i;
			return self.Element(element);
		};
		var List = {};
		List.Count = function() {}
		List.Add = function(a) {
			var e = self.Element(element);
			var item = self.Create.Element('li');
			item.Class.Add('HerpicusJS-List-Item');
			item.HTML(a);
			e.Append(item);
		};
		List.Remove = function(i) {};
		List.Clear = function() {};

		return {
			Source: element,
			Class: Class,
			Find: Find,
			Scroll: Scroll,
			List: List,
			Attributes: {
				Add: function(n, v) {
					element.setAttribute(n, v);
					return self.Element(element);
				},
				Remove: function(n) {
					element.removeAttribute(n);
					return self.Element(element);
				},
				RemoveAll: function() {
					for(var i = 0; i < element.attributes.length; i++) {
						element.removeAttribute(element.attributes[i].name);
					}
				},
				Contains: function(n) {
					if(element.hasAttribute) {
						return element.hasAttribute(n);
					} else {
						Herpicus.ForEach(element.attributes, function(_, attribute) {
							if(n === attribute) {
								return true;
							}
						});

						return false;
					}
				},
				Get: function(n) {
					if(self.Element(element).Attributes.Contains(n)) {
						return element.getAttribute(n);
					}

					return null;
				},
				List: (function() {
					return element.attributes;
				})()
			},
			Id: function(id) {
				element.id = id;
				return self.Element(element);
			},
			ParentNode: self.Element(element.parentNode),
			Elements: function(recursive) {
				var elements = [];

				if(!Herpicus.isBoolean(recursive)) {
					recursive = false;
				}

				var __recursiveScan = function(e) {
					if(e.nodeType) {
						if(e.childNodes.length > 0) {
							Herpicus.ForEach(e.childNodes, function(_, c) {
								__recursiveScan(c);
							});
						} else {
							elements.push(e);
						}
					}
				}

				Herpicus.ForEach(element.getElementsByTagName("*"), function(_, e) {
					e.nodeType ? (recursive ? __recursiveScan(e) : elements.push(e)) : null;
				});

				return elements;
			},
			InsertBefore: function(newNode) {
				var e = self.Element(element);
				try {
					if(e.Source.parentNode) {
						e.Source.parentNode.insertBefore(newNode, e.Source);
					}
				} catch(err) {
					console.log(err);
				}

				return e;
			},
			InsertAfter: function(newNode) {
				var e = self.Element(element);
				try {
					if(e.Source.parentNode) {
						e.Source.parentNode.insertBefore(newNode, e.Source.nextSibling);
					}
				} catch(err) {
					console.log(err);
				}

				return e;
			},
			Children: function(b) {
				var children = [];
				Herpicus.ForEach(element.children, function(_, child) {
					if(typeof child === "object") {
						children.push((Herpicus.isBoolean(b) && b === true) ? self.Element(child) : child);
					}
				});

				return children;
			},
			Nodes: element.childNodes,
			Node: function(i) {
				if(i >= 0 && i <= element.childNodes.length) {
					return self.Element(element.childNodes[i]);
				}

				return null;
			},
			// Nodes: (function() {
			// 	var nodes = [];
			// 	Herpicus.ForEach(element.getElementsByTagName("*"), function(_, node) {
			// 		nodes.push(Herpicus.Element(node));
			// 	});
			//
			// 	return nodes;
			// })(),
			Contents: function() {
				if(typeof element.innerHTML !== "undefined") {
					return element.innerHTML;
				} else if(typeof element.innerText !== "undefined") {
					return element.innerText;
				} else {
					return "";
				}
			},
			isEmpty: function() {
				if(element.children.length === 0 || element.innerHTML === "")
					return true;
				return false;
			},
			Clear: function() {
				element.innerHTML = "";
				return self.Element(element);
			},
			ClearAll: function() {
				element.innerHTML = "";
				Class.RemoveAll();
				for(var i = 0; i < element.attributes.length; i++) {
					element.removeAttribute(element.attributes[i].name);
				}
				return self.Element(element);
			},
			Remove: function() {
				element = element.outerHTML = null;
				return element;
			},
			HTML: function(s) {
				var e = self.Element(element);
				try {
					if(typeof s === 'undefined') {
						return element.outerHTML;
					}

					e.Clear();
					if(s !== null) {
						e.Append(s);
					}
				} catch(e) {
					console.log(e);
					return "undefined";
				}
				return e;
			},
			Text: function(s) {
				if(typeof s !== 'undefined') {
					if(element.tagName.toLowerCase() == 'input') {
						element.value = s;
					} else {
						element.innerHTML = s;
						element.innerText = s;
						element.textContent = s;
					}
					return self.Element(element);
				}
				if(element.tagName.toLowerCase() == 'input') {
					return element.value;
				}
				return element.innerText;
			},
			AppendTo: function(e) {
				if(Herpicus.isFunction(e.Append)) {
					e.Append(element);
				} else {
					self.Element(e).Append(element);
				}

				return self.Element(e);
			},
			Append: function() {
				if(element.nodeType == 1) {
					var __append = function(src, dest) {
						if(!Herpicus.isUndefined(dest.Type)) {
							if(dest.Type === "Herpicus.Element") {
								dest = src.Source;
							}
						}

						try {
							if(Herpicus.Contains(src, "Source")) {
								dest.appendChild(src.Source);
							} else if(Herpicus.isFunction(src.Contents)) {
								dest.innerHTML += src.Contents();
							} else if(src.nodeType) {
								if(src.nodeType === 1) {
									dest.appendChild(src);
								} else if(src.nodeType === 3) {
									dest.innerHTML += src;
								} else if(src.nodeType === 8) {
									dest.appendChild(src);
								}
							} else {
								try {
									dest.innerHTML += src;
								} catch(err) {
									console.log(err);
								}
							}
						} catch(err) {
							console.log(err);
						}
					}

					Herpicus.ForEach(arguments, function(_, e) {
						if(Herpicus.isArray(e)) {
							Herpicus.ForEach(e, function(_, el) {
								__append(el, element);
							});
						} else {
							__append(e, element);
						}
					});
				}
				return self.Element(element);
			},
			Render: function(scope) {
				var e = self.Element(element);
				Herpicus.Controller(function($Template) {
					e.HTML($Template.Render(e.Contents(), scope));
				});

				return e;
			},
			MouseOver: function(callback) {},
			MouseLeave: function(callback) {},
			MouseEnter: function(callback) {
				Herpicus.Event.Add('mouseenter', callback, element);
				return Herpicus.Element(element);
			},
			MouseLeave: function(callback) {
				Herpicus.Event.Add('mouseleave', callback, element);
				return Herpicus.Element(element);
			},
			Hover: function() {
				if(arguments.length > 0 && Herpicus.isFunction(arguments[0])) {
					var e = Herpicus.Element(element);
					e.MouseOver(arguments[0]);
					if(arguments.length == 2 && Herpicus.isFunction(arguments[1])) {
						e.MouseLeave(arguments[1]);
					} else {
						e.MouseLeave(arguments[0]);
					}
				}

				return Herpicus.Element(element);
			},
			Click: function(fn) {
				Herpicus.Event.Add('mousedown', fn, element);
				return self.Element(element);
			},
			FadeIn: function(time, callback) {
				if(!Herpicus.isInteger(time)) {
					time = 50;
				}

				var op = 1;
				var timer = setInterval(function () {
					if (op <= 0.1) {
						clearInterval(timer);
						element.style.display = 'none';
						if(!Herpicus.isFunction(callback)) {
							callback.call(this);
						}
					}
					element.style.opacity = op;
					element.style.filter = 'alpha(opacity=' + op * 100 + ")";
					op -= op * 0.1;
				}, time);

				return Herpicus.Element(element);
			},
			FadeOut: function(time, callback) {
				if(!Herpicus.isInteger(time)) {
					time = 10;
				}

				var op = 0.1;
				element.style.display = 'block';
				var timer = setInterval(function () {
					if (op >= 1){
						clearInterval(timer);
						if(!Herpicus.isFunction(callback)) {
							callback.call(this);
						}
					}
					element.style.opacity = op;
					element.style.filter = 'alpha(opacity=' + op * 100 + ")";
					op += op * 0.1;
				}, time);
			},
			KeyPress: function(keyCode, fn, preventDefault) {
				if(typeof preventDefault !== 'boolean') {
					preventDefault = false;
				}
				Herpicus.Event.Add('keydown', function(e) {
					if(e.keyCode == keyCode) {
						if(preventDefault) {
							e.preventDefault();
						}
						fn();
					}
				}, element);
				return self.Element(element);
			},
			Focus: function() {
				element.focus();
				return self.Element(element);
			},
			Show: function() {
				self.Element(element).Source.style.display = "block";
				return self.Element(element);
			},
			Hide: function() {
				self.Element(element).Source.style.display = "none";
				return self.Element(element);
			},
			Toggle: function() {
				if(self.Element(element).Visible()) {
					self.Element(element).Hide();
				} else {
					self.Element(element).Show();
				}
			},
			Visible: function() {
				var fn = {
					d: function(e) {
						while(e = e.parentNode) {
							if(e == document) {
								return true;
							}
						}
						return false;
					},
					s: function(el, property) {
						if(window.getComputedStyle) {
							return document.defaultView.getComputedStyle(el, null)[property];
						}
						if(el.currentStyle) {
							return el.currentStyle[property];
						}
					}
				};
				if(!fn.d(element))
					return false;
				if(element.nodeType === 9)
					return true;
				if(
					fn.s(element, 'display') == 'none' ||
					fn.s(element, 'visibility') == 'hidden' ||
					fn.s(element, 'opacity') == 0
				) {
					return false;
				}
				var r = element.getBoundingClientRect();
				if(
					r.top <= 0 &&
					r.left <= 0 &&
					r.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
					r.right >= (window.innerWidth || document.documentElement.clientWidth)
				) {
					return false;
				}
				return true;
			},
			Type: 'Herpicus.Element'
		}
	} catch(exception) {
		// console.log(exception);
	}

	return;
}

Herpicus.Create = {};
Herpicus.Create.Element = function(s)
{
	var e = document.createElement(s);
	if(e == 'input') {
		e.type = 'text';
		e.value = "";
	}
	return Herpicus.Element(e);
}
Herpicus.Create.Element.Stylesheet = function(css)
{
	var style = Herpicus.Create.Element('link').Source;
	style.type = "text/css";
	style.rel = "stylesheet";

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	}
	else {
		style.appendChild(document.createTextNode(css));
	}

	return css;
};

Herpicus.ReadyState = false;
Herpicus.Ready = function(callback) {
	var wait = setInterval(function() {
		if(Herpicus.ReadyState) {
			callback.call(this, Herpicus);
			clearInterval(wait);
		}
	}, 50);

	return Herpicus;
}

Herpicus.App = function(appName, arg) {
	if(!Herpicus.isString(appName)) {
		return;
	}

	Herpicus.Config = Herpicus.Merge(Herpicus.Config, Herpicus.isObject(arg) ? arg : {});
	Herpicus.Config.AppName = appName;

	var wait = setInterval(function() {
		var Elements = Herpicus.Selector("[" + Herpicus.Config.Directive + "]");

		if(Elements.length > 0) {
			clearInterval(wait);

			Herpicus.Document.Root = Elements[0];
			var head = document.getElementsByTagName('head')[0];
			var body = document.body;

			if(head && head.nodeType === 1) {
				Herpicus.Document.Head = Herpicus.Element(head);
			}

			if(body && body.nodeType === 1) {
				Herpicus.Document.Body = Herpicus.Element(body);
			} else {
				Herpicus.Document.Body = Herpicus.Create.Element('body');
				Herpicus.Document.Root.Append(Herpicus.Document.Body);
			}

			Herpicus.Document.Container = Herpicus.Create.Element('div').Id("HerpicusJS_Container").Attributes.Add("HerpicusJS", "Container");

			var __appReady = function() {
				document.title = Herpicus.Config.Name;

				Herpicus.ReadyState = true;
				Herpicus.Require.Stylesheet('Theme.' + Herpicus.Config.Theme);

				Herpicus.Document.Body.HTML(Herpicus.Document.Container);
				Herpicus.Require.Javascript(Herpicus.Config.Scripts);
				Herpicus.Require.Stylesheet(Herpicus.Config.Styles);
			}

			if(Herpicus.isArray(Herpicus.Config.Directives)) {
				var directives = [];
				Herpicus.ForEach(Herpicus.Config.Directives, function(i, n) {
					directives.push({ Name: "Directives/" + n, Async: false  })
				});

				Herpicus.Require.Javascript(directives, __appReady);
			} else {
				__appReady();
			}
		}
	}, 50);

	return Herpicus;
}
