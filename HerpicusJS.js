if(typeof Herpicus === 'undefined') {
	var Herpicus = new Object();
	Herpicus.$AppName = "HerpicusJS";
	Herpicus.$Version = 0.3;
	Herpicus.$Ready = false;
	Herpicus.Ready = function(callback) {
		var wait = Herpicus.Interval(function() {
			if(Herpicus.$Ready) {
				wait.Stop();
				if(Herpicus.isFunction(callback)) {
					callback.call(this);
				}
			}
		}, 10);
	}
	Herpicus.Document = document;
	//
	// Built-in Methods
	//
	Herpicus.TypeOf = function(a) {
		return ({}).toString.call(a).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	};
	Herpicus.isObject = function(a) {
		if(Herpicus.TypeOf(a) == 'object') {
			return true;
		}
		return false;
	};
	Herpicus.isArray = function(a) {
		if(Herpicus.TypeOf(a) == 'array') {
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
		if(Herpicus.TypeOf(a) == 'string') {
			return true;
		}
		return false;
	};
	Herpicus.isInteger = function(a) {
		var b = Herpicus.TypeOf(a);
		if(b == 'integer' || b == 'number') {
			return true;
		}
		return false;
	};
	Herpicus.isFloat = function(a) {
		if(Herpicus.TypeOf(a) == 'float') {
			return true;
		}
		return false;
	}
	Herpicus.isBoolean = function(a) {
		if(Herpicus.TypeOf(a) == 'boolean') {
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
	Herpicus.isNodeList = function(nodes) {
		return typeof nodes === 'object' &&
			/^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(nodes)) &&
			nodes.hasOwnProperty('length') &&
			(nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
	}
	Herpicus.isIterable = function(obj) {};
	//
	// ToObject
	//
	Herpicus.toObject = function(arg) {
		if(Herpicus.isObject(arg)) {
			return arg;
		}
		else if(typeof arg === "object") {
			var rv = {};
			for(var i = 0; i < arg.length; ++i) {
				rv[i] = arg[i];
			}
			return rv;
		}
		else if(Herpicus.isString(arg)) {
			return [arg];
		}
		return {};
	}
	//
	// (Object) Extend
	//
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
	//
	// (Array, Object) Merge
	//
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
	//
	// (Array, Object) ForEach
	//
	Herpicus.ForEach = function(obj, callback) {
		if(Herpicus.isFunction(callback)) {
			Herpicus.Safe(function() {
				obj = Herpicus.toObject(obj);
				for(var i in obj) {
					callback.call(obj, i, obj[i]);
				}
			});
		}

		return obj;
	}
	//
	// (Array, Object, String) Contains
	//
	Herpicus.Contains = function(a, b) {
		if(Herpicus.isArray(a)) {
			for(var i in a) {
				if(a[i] === b) {
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
			if(Herpicus.IndexOf(a, b) > -1) {
				return true;
			}
		} else {

		}

		return false;
	}
	//
	// (Object) Has Key
	//
	Herpicus.Has = function(obj, key) {
		return obj == Herpicus.isObject(obj) && obj.hasOwnProperty.call(obj, key);
	}
	//
	// (Object) Keys
	//
	Herpicus.Keys = function(obj) {
		'use strict';
		var hasOwnProperty = Object.prototype.hasOwnProperty,
			hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
			dontEnums = [
				'toString',
				'toLocaleString',
				'valueOf',
				'hasOwnProperty',
				'isPrototypeOf',
				'propertyIsEnumerable',
				'constructor'
			],
			dontEnumsLength = dontEnums.length;

		if(typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
			throw new TypeError('Object.keys called on non-object');
		}

		var result = [], prop, i;

		for(prop in obj) {
			if(hasOwnProperty.call(obj, prop)) {
				result.push(prop);
			}
		}

		if(hasDontEnumBug) {
			for(i = 0; i < dontEnumsLength; i++) {
				if (hasOwnProperty.call(obj, dontEnums[i])) {
					result.push(dontEnums[i]);
				}
			}
		}
		return result;
	}
	//
	// (Object) Values
	//
	Herpicus.Values = function(obj) {
		var Keys = Herpicus.Keys(obj);
		var length = Keys.length;
		var values = Array(length);

		for (var i = 0; i < length; i++) {
			values[i] = obj[keys[i]];
		}

		return values;
	};
	//
	// (Array) Insert
	//
	Herpicus.Insert = function(arr, index, item) {
		if(Herpicus.isArray(arr)) {
			return arr.splice(index, 0, item);
		}
		return arr;
	}
	//
	// (String, Array) IndexOf
	//
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
	//
	// (String, Array) LastIndexOf
	//
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
	//
	// String format
	//
	Herpicus.Printf = function(str) {
		if(Herpicus.isString(str)) {
			for(var i = 1; i < arguments.length; i++) {
				str = str.replace('{' + (i - 1) + '}', arguments[i]);
			}
		}

		return str;
	}
	//
	// (String) Sprintf
	//
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
	//
	// ErrorHandler
	//
	Herpicus.ErrorHandler = function() {
		if(!Herpicus.ErrorHandler.Errors) {
			Herpicus.ErrorHandler.Errors = new Array();
		}
		Herpicus.ForEach(arguments, function(_, arg) {
			Herpicus.ErrorHandler.Errors.push(arg);
			if(arg.name === 'TypeError') {
				console.log(arg)
			}
		})
	};
	//
	// Safe
	//
	Herpicus.Safe = function(fn, b) {
		if(Herpicus.isFunction(fn)) {
			try {
				return Herpicus.isBoolean(b) && !b ? fn : fn.call(this);
			} catch(e) {
				Herpicus.ErrorHandler(e);
			}
		}

		return fn;
	}
	//
	// Queue
	//
	Herpicus.Queue = function() {
		var queue = [];
		var $Methods = {
			Add: function(fn) {
				if(Herpicus.isFunction(fn)) {
					queue.push(Herpicus.Safe(fn, false));
				}

				return $Methods;
			},
			Clear: function() {
				queue = [];
				return $Methods;
			},
			Queued: function() {
				return queue;
			},
			Run: function() {
				if(queue.length > 0) {
					Herpicus.ForEach(queue, function(_, fn) {
						fn.call(this);
					});

					$Methods.Clear();
					return $Methods;
				}
			}
		};

		return $Methods;
	};
	Herpicus.String = function(str) {
		if(!Herpicus.isString(str)) {
			return null;
		}

		var $self = {};
		$self.Add = function(nstr, index) {
			index = Herpicus.isUndefined(index) ? str.length :
					Herpicus.isInteger(index) ? index : str.length;
			return str.slice(0, index) + str + str.slice(index);
		};

		$self.Capitalize = function(nstr) {
			return nstr.toUpperCase();
		};

		$self.Chars = function(search) {
			return str.match(/[\s\S]/g);
		};

		$self.CharCodes = function() {
			var codes = [];
			for(var i = 0; i < str.length; i++) {
				codes.push(str.charCodeAt(i));
			}
			return codes;
		};

		$self.Trim = function() {
			if(String.prototype.trim) {
				return str.trim();
			}
			return str.replace(/^\s+|\s+$/g, "");
		};

		var base64reg = /[^A-Za-z0-9\+\/\=]/g;
		$self.EncodeAscii = function(str) {
			var output = '';
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			do {
				chr1 = str.charCodeAt(i++);
				chr2 = str.charCodeAt(i++);
				chr3 = str.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if(isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if(isNaN(chr3)) {
					enc4 = 64;
				}
				output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
				chr1 = chr2 = chr3 = '';
				enc1 = enc2 = enc3 = enc4 = '';
			} while (i < str.length);
			return output;
		};

		$self.DecodeAscii = function(input) {
			var output = '';
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			if(input.match(base64reg)) {
				return '';
			}
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
			do {
				enc1 = key.indexOf(input.charAt(i++));
				enc2 = key.indexOf(input.charAt(i++));
				enc3 = key.indexOf(input.charAt(i++));
				enc4 = key.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + chr(chr1);
				if(enc3 != 64) {
					output = output + chr(chr2);
				}
				if(enc4 != 64) {
					output = output + chr(chr3);
				}
				chr1 = chr2 = chr3 = '';
				enc1 = enc2 = enc3 = enc4 = '';
			} while (i < input.length);
			return output;
		}
		$self.Base64Decode = function() {
			return decodeURIComponent(escape($self.DecodeAscii(str)));
		};
		$self.Base64Encode = function() {
			return $self.EncodeAscii(unescape(encodeURIComponent(str)));
		};
		$self.Find = function() {};
		$self.Remove = function() {};
		$self.isEmpty = function() {};
		$self.Title = function() {};
		$self.Words = function() {};

		return $self;
	};
	Herpicus.Object = function(obj) {
		var $self = {};
		return $self;
	};
	Herpicus.Array = function(arr) {
		var $self = {};
		$self.Add = function(item, index) {};
		$self.Remove = function(index, end) {};
		$self.All = function() {};
		$self.At = function(index) {};
		$self.Clone = function() {};
		$self.Compact = function() {};
		$self.Count = function() {};
		$self.ForEach = function() {};
		$self.Find = function() {};
		$self.isEmpty = function() {};
		$self.Randomize = function() {};

		return $self;
	};
	Herpicus.Integer = function(int) {
		var $self = {};
		$self.Random = function(n1, n2) {};
		$self.Range = function(start, end) {};
		$self.Abbreviate = function() {};
		$self.Bytes = function() {};
		$self.Maximum = function(max) {};
		$self.Ceil = function() {};
		$self.Char = function() {};
		$self.Floor = function() {};
		$self.Hex = function() {};
		$self.isEven = function() {};
		$self.isOdd = function() {};
		$self.Round = function() {};
		return $self;
	};
	//
	// Function Parser
	//
	Herpicus.Function = function(fn, value) {
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

			r.Arguments.str = r.str.match(/\(.*?\)/)[0].replace(/\s/gi, '').replace(/[()]/gi, '');
			Herpicus.ForEach(r.Arguments.str.split(','), function(_, value) {
				if(value !== "") {
					r.Arguments.Names.push(value);
				}
			})
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

			r.Run = function() {
				try{
					return (new Function("return " + r.str)()).call(this);
				} catch(err) {
					console.log(err);
				}

				return null;
			}
		}

		return r;
	};
	//
	// JSON
	//
	Herpicus.JSON = (function() {
		"use strict";

		var $Regex = new Object({
			Escapable: /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			Dangerous: /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
		});

		var gap, indent, rep,
		quote = function(t) {
			return $Regex.Escapable.lastIndex = 0, $Regex.Escapable.test(t) ?
				'"' + t.replace($Regex.Escapable, function (t) {
					var e = {
						"\b": "\\b",
						"	": "\\t",
						"\n": "\\n",
						"\f": "\\f",
						"\r": "\\r",
						'"': '\\"',
						"\\": "\\\\"
					}[t];
					return Herpicus.isString(e) ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4);
				}) + '"' : '"' + t + '"';
		},
		str = function(t, e) {
			var r, n, o, u, f, a = gap, i = e[t];
			switch(i && Herpicus.isFunction(rep) && (i = rep.call(e, t, i)), typeof i) {
			case "string":
				return quote(i);
			case "number":
				return isFinite(i) ? String(i) : "null";
			case "boolean":
			case "null":
				return String(i);
			case "object":
				if(!i) return "null";
				if(gap += indent, f = [], "[object Array]" === Object.prototype.toString.apply(i)) {
					for(u = i.length, r = 0; u > r; r += 1) f[r] = str(r, i) || "null";
					return o = 0 === f.length ? "[]" : gap ? "[\n" + gap + f.join(",\n" + gap) + "\n" + a + "]" : "[" + f.join(",") + "]", gap = a, o
				}
				if(rep && "object" == typeof rep)
					for(u = rep.length, r = 0; u > r; r += 1) "string" == typeof rep[r] && (n = rep[r], o = str(n, i), o && f.push(quote(n) + (gap ? ": " : ":") + o));
				else
					for(n in i) Object.prototype.hasOwnProperty.call(i, n) && (o = str(n, i), o && f.push(quote(n) + (gap ? ": " : ":") + o));
				return o = 0 === f.length ? "{}" : gap ? "{\n" + gap + f.join(",\n" + gap) + "\n" + a + "}" : "{" + f.join(",") + "}", gap = a, o
			}
		};

		var $Methods = {
			Stringify: function(t, e, r) {
				var n;
				if(gap = "", indent = "", Herpicus.isInteger(r)) {
					for(n = 0; r > n; n += 1) {
						indent += " ";
					}
				} else {
					Herpicus.isString(r) && (indent = r);
				}

				if(rep = e, e && !Herpicus.isFunction(e) && ("object" != typeof e || "number" != typeof e.length)) {
					throw new Error("JSON.stringify");
				}

				return str("", {"": t});
			},
			Parse: function(text, reviver) {
				if(Herpicus.isString(text) && text !== "") {
					function walk(t, e) {
						var r, n, o = t[e];
						if(o && "object" == typeof o)
							for(r in o) Object.prototype.hasOwnProperty.call(o, r) && (n = walk(o, r), void 0 !== n ? o[r] = n : delete o[r]);
						return reviver.call(t, e, o)
					}

					var j;
					if(
						$Regex.Dangerous.lastIndex = 0,
						$Regex.Dangerous.test(text) &&
						(text = text.replace($Regex.Dangerous, function (t) {
							return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
						})),
						/^[\],:{}\s]*$/.test(
							text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
							.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
							.replace(/(?:^|:|,)(?:\s*\[)+/g, "")
						)
					) {
						return j = eval("(" + text + ")"), Herpicus.isFunction(reviver) ? walk({"": j}, "") : j;
					}
				}

				return text;
			}
		};
		return $Methods;
	})();
	//
	// Http
	//
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
					JSON.parse($Response.Data) :
					request.responseText;

				if(Herpicus.isFunction($Config.Callback)) {
					$Config.Callback.call(this, $Response);
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
	Herpicus.Http.JSONP = function(url, callback) {};
	//
	// Generate (String|Number)
	//
	Herpicus.Generate = {};
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
	//
	// Timer: [Clear, Interval, Timeout]
	//
	Herpicus.Timers = new Object();
	Herpicus.ClearTimer = function(timer) {
		if(Herpicus.Contains(timer, "Type")) {
			timer.Type === 1 ? clearInterval(timer.Timer) :
			timer.Type === 2 ? clearTimeout(timer.Timer) :
			console.log("Could not Clear Timer:", timer);
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

			Herpicus.Timers[id] = setInterval(callback, interval);

			return {
				Id: id,
				Type: 1,
				Stop: function() { Herpicus.ClearTimer(Herpicus.Timers[id]) },
				Timer: Herpicus.Timers[id]
			}
		}
	};
	Herpicus.Timeout = function(callback, timeout) {
		if(Herpicus.isFunction(callback) && Herpicus.isInteger(timeout)) {
			var id = Herpicus.Generate.String();

			Herpicus.Timers[id] = setTimeout(callback, timeout);

			return {
				Id: id,
				Type: 2,
				Stop: function(){ Herpicus.ClearTimer(Herpicus.Timers[id]) },
				Timer: Herpicus.Timers[id]
			}
		}
	};
	Herpicus.Time = function() {
		return (new Date()).getTime();
	}
	Herpicus.UnixTime = function() {
		return Math.floor(Herpicus.Time() / 1000);
	}
	Herpicus.Date = (function() {
		$Date = {
			Months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
			Month: function(i) {
				if(Herpicus.isInteger(i)) {
					if(i >= 0 && i <= Herpicus.Date.Months.length) {
						return Herpicus.Date.Months[i];
					}
				}
			},
			Unix: function(UnixTime) {
				var d = new Date(Herpicus.isInteger(UnixTime) ? UnixTime : Herpicus.UnixTime() * 1000);
				var Hours = d.getHours(),
					Minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes(),
					Seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds(),
					Month = Herpicus.Date.Month(d.getMonth());

				return {
					Raw: d,
					Format: function(i) {
						if(Herpicus.isInteger(i)) {
							if(i == 1) {
								return Month + " " + d.getDate() + ", " + d.getFullYear() + " - " + Hours + ":" + Minutes;
							}
						}
					}
				}
			}
		};

		return $Date;
	})();

	Herpicus.Events = new Object();
	Herpicus.Events.Storage = {};
	Herpicus.Events.Add = function(e, fn, el, b) {
		b = !Herpicus.isBoolean(b) ? false : b;
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

			Herpicus.Events.Storage[n] = fn;
		}

		if(Herpicus.isArray(e)) {
			Herpicus.ForEach(e, function(i, evt) {
				__registerEvent(evt);
			});
		} else if(Herpicus.isString(e)) {
			__registerEvent(e);
		}
	};
	Herpicus.Events.Remove = function(e, fn, el) {
		if(el.removeEventListener) {
			el.removeEventListener(e, fn);
		} else {
			if(el.detachEvent) {
				el.detachEvent('on' + e, fn);
			}
		}
	};

	Herpicus.Storage = (function() {
		var data = {}, b = ('localStorage' in window);
		return {
			Set: function(key, value) { return b ? window.localStorage.setItem(key, String(value)) : (data[key] = String(value)); },
			Get: function(key) { return b ? window.localStorage.getItem(key) : (data.hasOwnProperty(key) ? data[key] : null); },
			Remove: function(key) { return b ? window.localStorage.removeItem(key) : (delete data[key]); },
			Clear: function() { return b ? window.localStorage.clear() : (data = {}); }
		};
	})();

	Herpicus.Require = function() {
		var $arguments = arguments;
		if(!Herpicus.Require.__loaded__) {
			Herpicus.Require.__loaded__ = {};
		}

		if(!Herpicus.Require.__config__) {
			Herpicus.Require.__config__ = {
				Base: "/",
				Paths: {},
				Cache: true,
				Expires: 2629744, // 1 month
			}
		}

		if($arguments.length > 0) {
			var $Scripts = {},
				$Callback = Herpicus.isFunction($arguments[1]) ? $arguments[1] : null;

			if(Herpicus.isArray($arguments[0])) {
				var $i = 0;
				Herpicus.ForEach($arguments[0], function(_, n) {
					var $opts = {
						Source: null,
						Async: true,
						Cache: true,
						Defer: false,
						Callback: null
					};

					if(Herpicus.isString(n)) {
						if(Herpicus.Contains(Herpicus.Require.__config__.Paths, n)) {
							$opts.Source = Herpicus.Require.__config__.Paths[n];
						} else {
							$opts.Source = n;
						}
					}
					else if(Herpicus.isObject(n)) {
						$opts = Herpicus.Extend($opts, n);
					}

					if(!Herpicus.isBoolean($opts.Cache)) {
						$opts.Cache = true;
					}

					if(Herpicus.isString($opts.Source)) {
						if(!/^https?:\/\/|^\/\//i.test($opts.Source)) {
							$opts.Source = ($opts.Source.substr(0, Herpicus.Require.__config__.Base.length - 1) != Herpicus.Require.__config__.Base ? Herpicus.Require.__config__.Base : "") + (Herpicus.Require.__config__.Base.substr(0, Herpicus.Require.__config__.Base.length-1) !== "/" ? "/" : "") + $opts.Source;

							if(Herpicus.IndexOf($opts.Source, ".js") === -1) {
								$opts.Source += ".js";
							}
						}

						var __getScript = function() {
							Herpicus.Http.Get($opts.Source, function(Response) {
								if(Response.Status.Code === 200) {
									try {
										$Scripts[n] = Response.Data;
										Herpicus.Storage.Set($opts.Source, Herpicus.JSON.Stringify({
											Expires: Herpicus.UnixTime() + ($opts.Cache ? Herpicus.Require.__config__.Expires : 0),
											Script: Response.Data
										}));
										(new Function(Response.Data)).call(this);

										if(Herpicus.isFunction($opts.Callback)) {
											$opts.Callback.call(this);
										}
									} catch(e) {
										$Scripts[n] = undefined;
										console.log(e);
									}
								} else {
									$Scripts[n] = undefined;
									console.log($opts.Source + ' not found');
								}

								$i++;
							});
						}

						Herpicus.Require.__config__.Cache = false;
						if(Herpicus.Require.__config__.Cache && $opts.Cache && (g = Herpicus.Storage.Get($opts.Source)) !== null) {
							var s = Herpicus.JSON.Parse(g);
							if(s.Expires <= Herpicus.UnixTime()) {
								__getScript();
							} else {
								try {
									$Scripts[n] = (new Function(s.Script));
									$Scripts[n].call(this);
								} catch(err) {
									$Scripts[n] = undefined;
									console.log(err);
								}
								$i++;
							}
						} else {
							 __getScript();
						}
					}
				});

				var wait = Herpicus.Interval(function() {
					if($arguments[0].length === $i && $Callback !== null) {
						wait.Stop();

						Herpicus.Safe(function() {
							var $Loaded = [];
							Herpicus.ForEach($arguments[0], function(_, n) {
								if(Herpicus.Contains($Scripts, n)) {
									$Loaded.push($Scripts[n]);
								}
							});

							$Callback.apply(this, $Loaded);
						});
					}
				}, 50);
			}
		}

		return Herpicus;
	};

	Herpicus.Require.Config = function(obj) {
		if(!Herpicus.Require.__config__) {
			Herpicus.Require.__config__ = {
				Base: "/",
				Paths: {},
				Cache: true,
				Expires: 2629744, // 1 month
			}
		};

		Herpicus.Require.__config__ = Herpicus.Extend(Herpicus.Require.__config__, obj);
		return Herpicus.Require;
	}

	// add modules cache
	// return precache if exist etc
	// module(name, cb)
	Herpicus.Module = function() {
		if(!Herpicus.Module.Modules) {
			Herpicus.Module.Modules = {};
		}

		var __Module__ = function(arg) {
			try {
				var isFunction = false;
				if((Arr = Herpicus.isFunction(arg) ?
					((isFunction = true), Herpicus.Function(arg).Arguments.Names) : (
					Herpicus.isArray(arg) ? arg : [])
				), Arr.length > 0) {
					var modules = [];
					Herpicus.ForEach(Arr, function(_, Name) {
						modules.push(
							Herpicus.Contains(Herpicus.Module.Modules, Name) &&
							Herpicus.isFunction(Herpicus.Module.Modules[Name]) ?
								Herpicus.Module.Modules[Name] : undefined
						);
					});

					if(isFunction) {
						arg.apply(this, modules);
					}
					return modules;
				}
				else if(Herpicus.isString(arg)) {
					return Herpicus.Contains(Herpicus.Module.Modules, Name) && Herpicus.isFunction(Herpicus.Module.Modules[Name]) ? Herpicus.Module.Modules[Name] : undefined;
				}
			} catch(err) {
				console.log(err);
			}

			return undefined;
		}

		if(arguments.length === 1) {
			return __Module__(arguments[0]);
		}
		else if(arguments.length === 2) {
			if(
				Herpicus.isString(arguments[0]) &&
				Herpicus.isFunction(arguments[1])
			) {
				Herpicus.Module.Modules[arguments[0]] = arguments[1];
				return Herpicus.Module.Modules[arguments[0]];
			}
		}

		return null;
	}

	Herpicus.DOM = (function() {
		var $Methods = new Object({
			NodeTypes: {
				1: "DOMElement",
				3: "DOMTextNode",
				8: "DOMComment",
				9: "document",
				100: "Herpicus.Element",
				101: "Herpicus.TextNode",
				102: "Herpicus.Comment"
			},
			Create: function(type) {
				if(Herpicus.isString(type)) {
					type = type.toLowerCase();

					var element;
					if(type === 'comment') {
						element = document.createComment(null);
					}
					else if(type === 'text') {
						element = document.createTextNode(null);
					}
					else {
						element = document.createElement(type);
						if(type === 'input') {
							element.type = 'text';
							element.value = '';
						}
						else if(type === 'link' || type === 'style') {
							element.type = 'text/css';
							if(type === 'link') {
								element.rel = 'stylesheet';
							}
						}
						else if(type === 'script') {
							element.type = 'text/javascript';
							element.async = true;
						}
					}

					return $Methods.Parse(element);
				}

				return null;
			},
			Parse: function() {
				if(arguments.length > 0) {
					var elements = new Array();
					Herpicus.ForEach(arguments, function(_, argument) {
						if(Herpicus.isElement(argument)) {
							if(Herpicus.Contains($Methods.NodeTypes, argument.nodeType)) {
								elements.push(argument.nodeType > 99 ? argument.$Node : argument);
							} else {
								console.log("Unsupported node type: " + argument.nodeType);
							}
						} else if(Herpicus.isString(argument)) {
							var WrapperMap = {
									option: [ 1, "<select multiple='multiple'>", "</select>" ],
									legend: [ 1, "<fieldset>", "</fieldset>" ],
									area: [ 1, "<map>", "</map>" ],
									param: [ 1, "<object>", "</object>" ],
									thead: [ 1, "<table>", "</table>" ],
									tr: [ 2, "<table><tbody>", "</tbody></table>" ],
									col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
									td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
									_default: [ 1, "<div>", "</div>"  ]
								},
								element = document.createElement('div'),
								match = /<\s*\w.*?>/g.exec(argument);
							if(match !== null) {
								var tag = match[0].replace(/</g, '').replace(/>/g, '');
								if(tag.toLowerCase() === 'body') {
									var body = document.createElement("body");

									element.innerHTML = argument.replace(/<body/g, '<div').replace(/<\/body>/g, '</div>');
									body.innerHTML = argument;

									var attrs = element.firstChild.attributes;
									for(var i=0; i < attrs.length; i++) {
										body.setAttribute(attrs[i].name, attrs[i].value);
									}

									elements.push(body);
								} else {
									var map = WrapperMap[tag] || WrapperMap._default, element;

									element.innerHTML = map[1] + html + map[2];
									var j = map[0] + 1;
									while(j--) {
										element = element.lastChild;
									}
									elements.push(element);
								}
							} else {
								element.innerHTML = argument;
								elements.push(element.lastChild);
							}
						} else if(Herpicus.TypeOf(argument) == "HTMLCollection") {
							var HTMLCollection = new Array();
							Herpicus.ForEach(argument, function(_, el) {
								if(Herpicus.isElement(el)) {
									HTMLCollection.push(el);
								}
							});
							elements.push(HTMLCollection);
						} else {
							elements.push(null);
						}
					});

					if(elements.length > 0) {
						Herpicus.ForEach(elements, function(index, element) {
							if(Herpicus.isArray(element)) {
								Herpicus.ForEach(element, function(cIndex, e) {
									element[cIndex] = $Methods.Parse(e);
								});
								elements[index] = element;
							}
							else if(Herpicus.isElement(element)) {
								elements[index] = (
									element.nodeType === 1 ? Herpicus.Safe(function() {
										var $Element = new Object({
											$Node: element,
											nodeType: 100,
											Class: {
												List: (function() {
													return element.className.split(' ');
												})(),
												Contains: function(e) {
													if(Herpicus.Contains(element.className.split(' '), e))
														return true;
													return false;
												},
												Add: function(e) {
													if(!$Element.Class.Contains(e)) {
														if($Element.Class.List.length > 0)
															element.className += " ";
														element.className += e;
													}
													return $Element;
												},
												Remove: function(e) {
													var arr = $Methods.Parse(element).List;
													if(arr.indexOf(e) > 0) {
														var r = new Array();
														for(var c in arr) {
															if(arr[c] != e) {
																r.push(arr[c]);
															}
														}
														element.className = r.join(" ");
													}
													return $Element;
												},
												RemoveAll: function() {
													element.removeAttribute('class');
													return $Element;
												}
											},
											Scroll: {
												// add polyfills
												Top: (function() {
													element.scrollTop = 0;
													return $Element;
												})(),
												Bottom: (function() {
													element.scrollTop = element.scrollHeight;
													return $Element;
												})(),
												Set: function(e) {
													element.scrollTop = i;
													return $Element;
												}
											},
											Attributes: {
												Add: function(n, v) {
													element.setAttribute(n, v);
													return $Element;
												},
												Remove: function(n) {
													element.removeAttribute(n);
													return $Element;
												},
												RemoveAll: function() {
													for(var i = 0; i < element.attributes.length; i++) {
														element.removeAttribute(element.attributes[i].name);
													}
													return $Element;
												},
												Contains: function(n) {
													if(element.hasAttribute) {
														return element.hasAttribute(n);
													} else {
														Herpicus.ForEach(element.attributes, function(_, attribute) {
															if(n == attribute) {
																return true;
															}
														});

														return false;
													}
												},
												Get: function(n) {
													if($Element.Attributes.Contains(n)) {
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
												return $Element;
											},
											ParentNode: $Methods.Parse(element.parentNode),
											Elements: function(recursive) {
												var elements = [];

												if(!$Herpicus.isBoolean(recursive)) {
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
												if($Element.$Node.parentNode) {
													$Element.$Node.parentNode.insertBefore(newNode, $Element.$Node);
												}

												return $Element;
											},
											InsertAfter: function(newNode) {
												if($Element.$Node.parentNode) {
													$Element.$Node.parentNode.insertBefore(newNode, $Element.$Node.nextSibling);
												}

												return $Element;
											},
											Children: function(b) {
												var children = [];
												Herpicus.ForEach(element.children, function(_, child) {
													if(typeof child === "object") {
														children.push((Herpicus.isBoolean(b) && b === true) ? $Methods.Parse(child) : child);
													}
												});

												return children;
											},
											Nodes: element.childNodes,
											Node: function(i) {
												if(i >= 0 && i <= element.childNodes.length) {
													return $Methods.Parse(element.childNodes[i]);
												}

												return null;
											},
											isEmpty: function() {
												if(element.children.length === 0 || element.innerHTML === "")
													return true;
												return false;
											},
											Clear: function() {
												element.innerHTML = "";
												return $Element;
											},
											ClearAll: function() {
												element.innerHTML = "";
												$Element.Class.RemoveAll();
												$Element.Attributes.RemoveAll();
												return $Element;
											},
											Delete: function() {
												element = element.outerHTML = null;
												return element;
											},
											// todo
											Style: function(style) {},
											CSS: function(css) {
												// todo
												if(Herpicus.isObject(css)) {}
												else if($Herpicus.isString(css)) {
													if(style.styleSheet) {
														element.styleSheet.cssText = css;
													}
													else {
														element.appendChild(document.createTextNode(css));
													}
												}
												return $Element
											},
											HTML: function(s) {
												return (s = !Herpicus.isDefined(s) ? true : s),
													Herpicus.isBoolean(s) ?
														element[s ? "outerHTML" : "innerHTML"] :
														$Element.Clear().Append(s);
											},
											Text: function(s) {
												if(typeof s !== 'undefined') {
													if(element.tagName.toLowerCase() === 'input') {
														element.value = s;
													} else {
														element.innerText = s;
														element.textContent = s;
													}
													return $Element;
												}

												if(element.tagName.toLowerCase() === 'input') {
													return element.value;
												}
												return element.innerText;
											},
											AppendTo: function(e) {
												if(Herpicus.isFunction(e.Append)) {
													e.Append(element);
												} else {
													$Methods.Parse(e).Append(element);
												}

												return $Element;
											},
											Append: function() {
												var __append = function(src, dest) {
													if(Herpicus.isElement(dest)) {
														dest = dest.nodeType > 99 ? dest.$Node : dest;
														Herpicus.isElement(src) ? (
															Herpicus.isElement(src.$Node) || src.nodeType === 1 || src.nodeType === 8 ? dest.appendChild(
																src.nodeType === 1 || src.nodeType === 8 ? src : src.$Node
															) : Herpicus.isFunction(src.HTML) || src.nodeType === 3 ? dest.innerHTML += (
																src.nodeType === 3 ? src : src.HTML()
															) : Herpicus.Safe(function() {
																dest.innerHTML += src;
															})
														) : Herpicus.Safe(function() {
															Herpicus.isString(src) || Herpicus.isInteger(src) ?
															(dest.innerHTML += String(src)) : console.log(
																Herpicus.Printf("Cannot append ({0}) to ({1})", src, dest)
															);
														});
													}
												}

												Herpicus.ForEach(arguments, function(_, e) {
													Herpicus.isArray(e) ? Herpicus.ForEach(e, function(_, el) {
														__append(el, element);
													}) : __append(e, element);
												});

												return $Element;
											},
											Change: function(callback) {
												Herpicus.Events.Add('change', callback, element);
												return $Element;
											},
											MouseOver: function(callback) {},
											MouseEnter: function(callback) {
												Herpicus.Events.Add('mouseenter', callback, element);
												return $Element;
											},
											MouseLeave: function(callback) {
												Herpicus.Events.Add('mouseleave', callback, element);
												return $Element;
											},
											Hover: function() {
												if(arguments.length > 0 && Herpicus.isFunction(arguments[0])) {
													$Element.MouseOver(arguments[0]);
													if(arguments.length == 2 && Herpicus.isFunction(arguments[1])) {
														$Element.MouseLeave(arguments[1]);
													} else {
														$Element.MouseLeave(arguments[0]);
													}
												}

												return $Element;
											},
											Click: function(fn) {
												Herpicus.Events.Add('mousedown', fn, element);
												return $Element;
											},
											FadeIn: function(time, callback) {
												var op = 1;
												var timer = setInterval(function () {
													if(op <= 0.1) {
														clearInterval(timer);
														element.style.display = 'none';
														if(Herpicus.isFunction(callback)) {
															callback.call(this);
														}
													}
													element.style.opacity = op;
													element.style.filter = 'alpha(opacity=' + op * 100 + ")";
													op -= op * 0.1;
												}, Herpicus.isInteger(time) ? time : 50);

												return $Element;
											},
											FadeOut: function(time, callback) {
												var op = 0.1;
												element.style.display = 'block';
												var timer = setInterval(function () {
													if(op >= 1) {
														clearInterval(timer);
														if(Herpicus.isFunction(callback)) {
															callback.call(this);
														}
													}
													element.style.opacity = op;
													element.style.filter = 'alpha(opacity=' + op * 100 + ")";
													op += op * 0.1;
												}, Herpicus.isInteger(time) ? time : 10);
												return $Element;
											},
											Key: {
												Code: function(keyCode, fn, preventDefault) {
													Herpicus.Events.Add('keydown', function(e) {
														if(e.keyCode == keyCode) {
															if(Herpicus.isBoolean(preventDefault) && preventDefault) {
																e.preventDefault();
															}
															fn.call(this);
														}
													}, element);
													return $Element;
												},
												Press: function(callback) {
													Herpicus.Events.Add('keypress', function(e) {
														if((new RegExp("^[a-zA-Z0-9]+$")).test(String.fromCharCode(!e.charCode ? e.which : e.charCode))) {
															callback.call(this);
														};
													}, element);

													return $Element;
												},
												Down: function(callback) {
													Herpicus.Events.Add('keydown', function(e) {
														if((new RegExp("^[a-zA-Z0-9]+$")).test(String.fromCharCode(!e.charCode ? e.which : e.charCode))) {
															callback.call(this);
														};
													}, element);

													return $Element;
												},
												Up: function(callback) {
													Herpicus.Events.Add('keyup', function(e) {
														if((new RegExp("^[a-zA-Z0-9]+$")).test(String.fromCharCode(!e.charCode ? e.which : e.charCode))) {
															callback.call(this);
														};
													}, element);

													return $Element;
												}
											},
											Focus: function() {
												element.focus();
												return $Element;
											},
											Show: function() {
												element.style.display = "block";
												return $Element;
											},
											Hide: function() {
												element.style.display = "none";
												return $Element;
											},
											Toggle: function() {
												return $Element.Visible() ? $Element.Hide() : $Element.Show();
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
											}
										});

										return $Element;
									}) : element.nodeType === 3 || element.nodeType === 8 ? Herpicus.Safe(function() {
										var $TextNode = new Object({
											$Node: element,
											nodeType: element.nodeType === 3 ? 101 : 102,
											Text: function(str) {
												if(Herpicus.isDefined(str)) {
													element.nodeValue = String(str);
													return $TextNode;
												} else {
													return element.nodeValue;
												}
											}
										});

										return $TextNode;
									}) : element.nodeType === 9 ? element : null
								);
							}
						});
						return elements.length === 1 ? elements[0] : elements;
					}
				}
				return null;
			}
		});

		return $Methods;
	})();

	Herpicus.Selector = function(selector) {
		var elements = [], tmp = [];
		if(Herpicus.isString(selector)) {
			if(selector === 'head') {
				return Herpicus.Document.Head ? Herpicus.Document.Head : (Herpicus.Document.Head = Herpicus.DOM.Parse(Herpicus.Document.head ? Herpicus.Document.head : Herpicus.Document.getElementsByTagName('head')[0]), Herpicus.Document.Head);
			}
			else if(selector === 'body') {
				return Herpicus.Document.Body ? Herpicus.Document.Body : (Herpicus.Document.Body = Herpicus.DOM.Parse(Herpicus.Document.body ? Herpicus.Document.body : Herpicus.Document.getElementsByTagName('body')[0]), Herpicus.Document.Body);
			}
			elements = document.querySelectorAll ? document.querySelectorAll(selector) : (function() {
				var style = document.createElement('style'), tmp = [], e;
				document.documentElement.firstChild.appendChild(style);
				document._qsa = [];

				style.styleSheet.cssText = selector + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
				window.scrollBy(0, 0);
				style.parentNode.removeChild(style);

				while(document._qsa.length) {
					e = document._qsa.shift();
					e.style.removeAttribute('x-qsa');
					tmp.push(e);
				}
				document._qsa = null;
				return tmp;
			})();
		}

		if(elements.length > 0) {
			Herpicus.ForEach(elements, function(i, element) {
				var e = Herpicus.DOM.Parse(element);
				if(e !== null) {
					tmp.push(e);
				}
			});
		}

		return tmp.length > 0 ? (tmp.length === 1 ? tmp[0] : tmp) : null;
	}

	var documentReady = Herpicus.Interval(function() {
		if(document.readyState === "complete") {
			documentReady.Stop();
			documentReady = undefined;
			Herpicus.$Ready = true;
		}
	}, 10);
} else {
	console.log('HerpicusJS already loaded.');
}
