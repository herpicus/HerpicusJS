(function(window) {
	'use strict';

	if(window.Herpicus) {
		console.warn('HerpicusJS is already loaded');
		return;
	}

	var Herpicus = window.Herpicus = {
		$Ready: false,
		$Version: {Major: 1, Minor: 0},
		_ready: function() {
			if(Herpicus.$Ready) return;
			Herpicus.$Ready = true;

			return Herpicus;
		},
		Ready: function(callback) {
			if(!Herpicus.$Ready) {
				var tmp = setInterval(function() {
					if(Herpicus.$Ready) {
						callback.call(this);
						clearInterval(tmp);
					}
				});
			}
			else {
				callback.call(this);
			}
		},
		TypeOf: function(a) {
			return ({}).toString.call(a).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
		},
		isObject: function(a) {
			return this.TypeOf(a) === 'object';
		},
		isArray: function(a) {
			return this.TypeOf(a) === 'array';
		},
		isString: function(a) {
			return this.TypeOf(a) === 'string';
		},
		isInteger: function(a) {
			return this.TypeOf(a) === 'number';
		},
		isElement: function(a) {
			return a ? a.nodeType > 0 : false;
		},
		isFunction: function(a) {
			return typeof a === 'function';
		},
		isFloat: function(a) {
			return this.TypeOf(a) === 'float';
		},
		isBoolean: function(a) {
			return this.TypeOf(a) === 'boolean';
		},
		isDefined: function(a) {
			return typeof a !== 'undefined';
		},
		isUndefined: function(a) {
			return !this.isDefined(a);
		},
		isDate: function(d) {
			if(Object.prototype.toString.call(d) !== "[object Date]")
				return false;
			return !isNaN(d.getTime());
		},
		isIn: function(a, b) {
			if(this.isArray(b)) {
				for(var i in b) {
					if(a == b[i]) {
						return true;
					}
				}
			}
			else if(this.isObject(b)) {
				if(a.hasOwnProperty(a)) {
					return true;
				}
			}
			else if(this.isString(b)) {
				if(this.indexOf(b, a) > -1) {
					return true;
				}
			}
			return false;
		},
		indexOf: function(arr, searchElement, fromIndex) {
			if(this.isArray(arr) || this.isString(arr)) {
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
		},
		toArray: function(a) {
			if(this.isObject(a)) {
				var arr = [];
				for(var i in a) {
					if(a.hasOwnProperty(i)) {
						arr.push(a[i]);
					}
				}

				return arr;
			}
			else if(this.isArray(a))
				return a;
			else {
				try {
					var arr = [];
					for(var i in a) {
						arr.push(a[i]);
					}

					return arr;
				} catch(e) {}
			}
			return [];
		},
		toObject: function(arg) {
			if(this.isObject(arg)) {
				return arg;
			}
			else if(this.isArray(arg)) {
				return Object(arg);
			}
			else if(typeof arg === "object") {
				var rv = {};
				for(var i = 0; i < arg.length; ++i) {
					rv[i] = arg[i];
				}
				return rv;
			}
			else if(this.isString(arg)) {
				return [arg];
			}
			return {};
		},
		forEach: function(obj, callback) {
			if(Herpicus.isFunction(callback)) {
				if(Herpicus.isArray(obj)) {
					var i = 0, len = obj.length;
					while(i < len) {
						callback.call(this, i, obj[i]);
						i++;
					}
				}
				else {
					obj = Herpicus.toObject(obj);
					for(var k in obj) {
						callback.call(this, k, obj[k]);
					}
				}
			}

			return {
				then: function(c) { if(Herpicus.isFunction(c)) c.call(this, obj); },
				forEach: Herpicus.forEach
			};
		},
		Extend: function(target) {
			var extended = {};
			var i = 0;

			for(; i < arguments.length; i++) {
				for (var prop in arguments[i]) {
					if(Object.prototype.hasOwnProperty.call(arguments[i], prop)) {
						if ((Herpicus.isBoolean(arguments[0]) ? arguments[0] : false) && Herpicus.isObject(arguments[i][prop])) {
							extended[prop] = Herpicus.Extend(true, extended[prop], arguments[i][prop]);
						} else {
							extended[prop] = arguments[i][prop];
						}
					}
				}
			}

			return extended;
		},
		Safe: function(c) {
			try {
				if(Herpicus.isFunction(c)) c.call(this);
			}
			catch(e) {
				console.log(e);
			}
		},
		Extension: function(s) {
			return s.substr((~-s.lastIndexOf(".") >>> 0) + 2);
		},
		Include: function() {
			if(!Herpicus.Include.Loaded)
				Herpicus.Include.Loaded = {};

			if(arguments.length > 0) {
				Herpicus.forEach(arguments, function(_, url) {
					url = (url + (Herpicus.Extension(url) !== 'js' ? '.js' : ''));
					Herpicus.Ready(function() {
						var tmp = document.createElement('script');
						tmp.src = url;
						tmp.onload = tmp.onreadystatechange = function() {
							console.log('Herpicus.Include:', url, 'Loaded');
							Herpicus.Include.Loaded[url] = tmp;
						};
						document.body.appendChild(tmp);
					});
				});
			}
		},
		Module: function() {
			if(!Herpicus.Module.Modules) {
				Herpicus.Module.Modules = {};
			}

			var __Module__ = function(arg) {
				try {
					var isFunction = false, Arr;
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
						return Herpicus.Contains(Herpicus.Module.Modules, arg) && Herpicus.isFunction(Herpicus.Module.Modules[arg]) ? Herpicus.Module.Modules[arg] : undefined;
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
					if(Herpicus.Module.Modules[arguments[0]]) {
						console.log('Herpicus.Module: Module already registered', arguments[0]);
					}
					else {
						Herpicus.Module.Modules[arguments[0]] = arguments[1];
						console.log('Herpicus.Module: Module registered', arguments[0]);
					}
					return Herpicus.Module.Modules[arguments[0]];
				}
				else {
					console.log('Herpicus.Module: Invalid module', arguments[0]);
				}
			}

			return null;
		},
		Selector: function(selectors) {
			var elements = [];
			if(!document.querySelectorAll) {
				var style = document.createElement('style'), element;
				document.documentElement.firstChild.appendChild(style);
				document._qsa = [];

				style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
				window.scrollBy(0, 0);
				style.parentNode.removeChild(style);

				while(document._qsa.length) {
					element = document._qsa.shift();
					element.style.removeAttribute('x-qsa');
					elements.push(element);
				}
				document._qsa = null;
			}
			else elements = document.querySelectorAll(selectors);

			var tmp = [];
			for(var i in elements) {
				if(Herpicus.isElement(elements[i]))
					tmp.push(Herpicus.Element(elements[i]));
			}

			return tmp.length === 0 ? null : tmp;
		},
		String: function(str) {
		if(!Herpicus.isString(str)) {
			return null;
		}

		var $self = {};
		$self.Add = function(nstr, index) {
			index = Herpicus.isUndefined(index) ? str.length :
					Herpicus.isInteger(index) ? index : str.length;
			return str.slice(0, index) + str + str.slice(index);
		};

		$self.Capitalize = {
			All: function() {
				return str.toUpperCase();
			},
			First: function() {
				var w = [];
				Herpicus.ForEach(str.split(' '), function(_, s) {
					w.push(s.charAt(0).toUpperCase() + s.slice(1));
				});

				return w.join(' ');
			}
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
		$self.EncodeUTF8 = function() {
			return str.replace(
				/[\u0080-\u07ff]/g,
				function(c) {
					var cc = c.charCodeAt(0);
					return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f);
				}
			).replace(
				/[\u0800-\uffff]/g,
				function(c) {
					var cc = c.charCodeAt(0);
					return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f);
				}
			);
		};
		$self.DecodeUTF8 = function() {
			return str.replace(
				/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,
				function(c) {
					var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f);
					return String.fromCharCode(cc); 
				}
			).replace(
				/[\u00c0-\u00df][\u0080-\u00bf]/g,
				function(c) {
					var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
					return String.fromCharCode(cc);
				}
			);
		};
		$self.EncodeURI = function() {
			return encodeURIComponent(str);
		}
		$self.DecodeURI = function() {
			return decodeURIComponent(str);
		}
		$self.Normalize = function(opt) {};
		$self.Find = function() {};
		$self.Remove = function() {};
		$self.isEmpty = function() {};
		$self.Title = function() {};
		$self.Words = function() {};

		return $self;
	},
		Element: function(e) {
			var element = Herpicus.isElement(e) ? e : null;
			if(Herpicus.isString(e)) {
				if(e === 'comment') {
					element = document.createComment(null);
				}
				else if(e === 'text') {
					element = document.createTextNode(null);
				}
				else {
					element = document.createElement(e);
					if(e === 'input') {
						element.setAttribute('type', 'text');
						element.setAttribute('value', '');
					}
					else if(e === 'link' || e === 'style') {
						element.type = 'text/css';
						if(e === 'link') {
							element.rel = 'stylesheet';
						}
					}
					else if(e === 'script') {
						element.type = 'text/javascript';
						element.async = true;
					}
				}
			}


			var _validClassToken = function(token) {
				return (token !== "" && !(/\s/.test(token)));
			}

			if(Herpicus.isElement(element)) {
				element = Herpicus.isDefined(element.$Node) ? element.$Node : element;
				var $Element = {
					$Node: element,
					nodeType: 100,
					Class: {
						List: function() {
							return element.className.split(' ');
						},
						Has: function(e) {
							return element.className.indexOf(e) != -1;
						},
						Add: function() {
							Herpicus.forEach(arguments, function(_, n) {
								if(_validClassToken(n) && !$Element.Class.Has(n)) {
									element.className += " " + n;
									element.className = Herpicus.String(element.className).Trim();
								}
							});
							
							return $Element;
						},
						Remove: function() {
							Herpicus.forEach(arguments, function(_, n) {
								if(_validClassToken(n)) {
									element.className = Herpicus.String(element.className).Trim().replace(n, '');
								}
							})
							
							return $Element;
						},
						RemoveAll: function() {
							element.removeAttribute('class');
							return $Element;
						},
						Set: function() {
							$Element.Class.RemoveAll();
							$Element.Class.Add.apply(this, arguments);
						}
					},
					Scroll: {
						// add polyfills
						Top: function() {
							element.scrollTop = 0;
							return $Element;
						},
						Bottom: function() {
							element.scrollTop = element.scrollHeight;
							return $Element;
						},
						Set: function(e) {
							element.scrollTop = e;
							return $Element;
						},
						intoView: function() {
							element.scrollIntoView();
							return $Element;
						}
					},
					Attributes: {
						Set: function(n, v) {
							element.setAttribute(n, v);
							return $Element;
						},
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
								Herpicus.forEach(element.attributes, function(_, attribute) {
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
					ParentNode: Herpicus.Element(element.parentNode),
					Elements: function(recursive) {
						var elements = [];

						if(!$Herpicus.isBoolean(recursive)) {
							recursive = false;
						}

						var __recursiveScan = function(e) {
							if(e.nodeType) {
								if(e.childNodes.length > 0) {
									Herpicus.forEach(e.childNodes, function(_, c) {
										__recursiveScan(c);
									});
								} else {
									elements.push(e);
								}
							}
						}

						Herpicus.forEach(element.getElementsByTagName("*"), function(_, e) {
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
					Child: function(i) {
						if(Herpicus.isInteger(i) && Herpicus.isDefined(element.children[i])) {
							return $Methods.Parse(element.children[i]);
						}
						return null;
					},
					Children: function(b) {
						var children = [];
						Herpicus.forEach(element.children, function(_, child) {
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
					Items: {
						Selected: function(i, b) {
							if(element.type == "select" || element.type == "select-one") {
								if(!Herpicus.isDefined(i) && !Herpicus.isDefined(b))
									return element.options[element.options.selectedIndex].value;
								
								Herpicus.forEach(element.options, function(Key, Opt) {
									if(Herpicus.isBoolean(b) && b && i.toString() == Opt.value) {
										Opt.selected = true;
									}
									else if(Key == i) {
										Opt.selected = true;
									}
								})
							}

							return $Element;
						},
						Add: function() {
							if(element.type == "select" || element.type == "select-one") {
								if(arguments.length >= 1) {
									var o = document.createElement('option');
									var arg = Herpicus.isDefined(arguments[0]) ? arguments[0].toString() : "Undefined";
									
									if(arguments.length === 1) {
										o.text = arg;
										o.value = arg;
									}
									else if(arguments.length === 2) {
										o.value = arg;
										o.text = Herpicus.isDefined(arguments[1]) ? arguments[1].toString() : "Undefined";
									}

									element.appendChild(o);
								}
							}

							return $Element;
						}
					},
					// todo
					Style: {
						zIndex: function(i) {
							if(i === undefined) {
								return element.style.zIndex;
							} else {
								element.style.zIndex = Herpicus.isInteger(i) ? i : 0;
								return $Element;
							}
						},
						Color: function(n) {
							element.style.color = n;
							return $Element;
						},
						Background: {
							Color: function(n) {
								element.style.backgroundColor = n;
								return $Element;
							},
							Image: function(src) {
								if(src === undefined) {
									return element.style.backgroundImage;
								} else {
									element.style.backgroundImage = Herpicus.Printf("url('{0}')", src);
									return $Element;
								}
							},
							None: function() {
								element.style.background = "";
								return $Element;
							}
						},
						Padding: function(i) {
							if(i === undefined) {
								return element.style.padding;
							} else {
								element.style.padding = Herpicus.isInteger(i) ? i : 0;
								return $Element;
							}
						},
						Index: function(i) {
							if(i === undefined) {
								return element.style.zIndex;
							} else {
								element.style.zIndex = Herpicus.isInteger(i) ? i : 0;
								return $Element;
							} 
						},
						Width: function(w) {
							if(w !== undefined) {
								element.style.width = Herpicus.isInteger(w) ? w : 0;
								return $Element;
							} else {
								return element.style.width;
							}
						},
						Height: function(w) {
							if(w !== undefined) {
								element.style.height = Herpicus.isInteger(w) ? w : 0;
								return $Element;
							} else {
								return element.style.height;
							}
						},
						Position: function(n) {
							if(n === undefined) {
								return element.style.position;
							}
							else {
								n = n.toLowerCase();
								element.style.position = (
									n === 'relative' ? n : (
									n === 'absolute' ? n : (
									n === 'fixed' ? n : null
								)));

								return $Element;
							}
						},
						Left: function(pos) {
							if(pos === undefined) {
								return element.style.left;
							} else {
								element.style.left = Herpicus.isInteger(pos) ? pos : 0;
								return $Element;
							}
						},
						Right: function(pos) {
							if(pos === undefined) {
								return element.style.right;
							} else {
								element.style.right = Herpicus.isInteger(pos) ? pos : 0;
								return $Element;
							}
						},
						Bottom: function(pos) {
							if(pos === undefined) {
								return element.style.bottom;
							} else {
								element.style.bottom = Herpicus.isInteger(pos) ? pos : 0;
								return $Element;
							}
						},
						Top: function(pos) {
							if(pos === undefined) {
								return element.style.top;
							} else {
								element.style.top = Herpicus.isInteger(pos) ? pos : 0;
								return $Element;
							}
						}
					},
					CSS: function() {
						var props = {};
						if( (s = $Element.Attributes.Get('style')) !== null) {
							var tmp = s.split(';');
							for(var i = 0; i < tmp.length; i++) {
								var prop = tmp[i].split(':');
								if(prop.length === 2)
									props[prop[0]] = prop[1];
							}
						}

						if(arguments.length === 2 && Herpicus.isString(arguments[0]) && Herpicus.isString(arguments[1])) {
							props[arguments[0]] = arguments[1];
						}
						else if(arguments.length === 1 && Herpicus.isObject(arguments[0])) {
							Herpicus.forEach(arguments[0], function(prop, val) {
								props[prop] = val;
							});
						}

						var tmp = "";
						for(var k in props) {
							tmp += Herpicus.Printf("{0}:{1};", k, props[k]);
						}
						$Element.Attributes.Set('style', tmp);

						return $Element
					},
					HTML: function() {
						if(arguments.length > 0) {
							$Element.Clear();
							Herpicus.forEach(arguments, function(_, a) {
								$Element.Append(a);
							});
						}

						return $Element.$Node.innerHTML;
					},
					Href: function(href, newwindow) {
						if(Herpicus.isString(href)) {
							element.setAttribute('href', href);
							if(Herpicus.isBoolean(newwindow)) {
								element.setAttribute('target', '_blank');
							}

							return $Element;
						}

						return element.href;
					},
					Title: function(s) {
						if(Herpicus.isString(s)) {
							element.title = s;
						}
						else if(s === null) {
							element.removeAttribute('title');
						}

						return (Herpicus.isString(s) || s === null) ? $Element : element.title;
					},
					Value: function(s) {
						var n = element.tagName.toLowerCase();
						if(typeof s !== 'undefined') {
							if('value' in element) {
								element.value = s;
							}
							return $Element;
						}

						if('value' in element) {
							return element.value;
						}
						else if(n === 'select') {
							return element[element.selectedIndex].value;
						}
						return "";
					},
					Text: function(s) {
						var n = element.tagName.toLowerCase();
						if(typeof s !== 'undefined') {
							if(n === 'input') {
								element.value = s;
							} else {
								element.innerText = s;
								element.textContent = s;
							}
							return $Element;
						}

						if(n === 'input') {
							return element.text;
						}
						else if(n === 'select') {
							return element[element.selectedIndex].text;
						}
						return element.innerText;
					},
					Placeholder: function(s) {
						if(Herpicus.isString(s)) {
							$Element.Attributes.Add('placeholder', s);
						}
						return $Element;
					},
					ReadOnly: function(b) {
						if(Herpicus.isBoolean(b)) {
							element.readOnly = b ? "true" : "false";
						}
						return $Element;
					},
					Rows: function(i) {
						if(Herpicus.isInteger(i) && i > 0 && Herpicus.isDefined(element.rows)) {
							element.rows = i;
						}

						return $Element;
					},
					Autocomplete: function(b) {
						if(Herpicus.isBoolean(b)) {
							$Element.Attributes.Add('autocomplete', b ? 'on' : 'off');
						}
						return $Element;
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
										Herpicus.Printf("Cannot append ({0}) to ({1})", src, dest), src, dest
									);
								});
							}
						}

						Herpicus.forEach(arguments, function(_, e) {
							Herpicus.isArray(e) ? Herpicus.forEach(e, function(_, el) {
								__append(el, element);
							}) : __append(e, element);
						});

						return $Element;
					},
					Prepend: function(e) {
						var $e = $Methods.Parse(e);
						if($e !== null) {
							element.insertBefore($e.$Node, element.firstChild);
						}

						return $Element;
					},
					On: function(evt, callback) {
						if(Herpicus.isString(evt) && Herpicus.isFunction(callback)) {
							Herpicus.Events.Add(evt, callback, element);
						}
						return $Element;
					},
					Change: function(callback) {
						Herpicus.Events.Add('change', callback, element);
						return $Element;
					},
					Mouse: {
						Over: function(callback) {},
						Move: function(callback) {},
						Enter: function(callback) {
							Herpicus.Events.Add('mouseenter', callback, element);
							return $Element;
						},
						Leave: function(callback) {
							Herpicus.Events.Add('mouseleave', callback, element);
							return $Element;
						},
						Move: function(callback) {
							Herpicus.Events.Add('mousemove', callback, element);
							return $Element;
						},
						Hover: function() {
							if(arguments.length > 0 && Herpicus.isFunction(arguments[0])) {
								$Element.Mouse.Over(arguments[0]);
								if(arguments.length == 2 && Herpicus.isFunction(arguments[1])) {
									$Element.Mouse.Leave(arguments[1]);
								} else {
									$Element.Mouse.Leave(arguments[0]);
								}
							}

							return $Element;
						},
						Down: function(callback) {
							Herpicus.Events.Add('mousedown', callback, element);
							return $Element;
						},
						Up: function(callback) {
							Herpicus.Events.Add('mouseup', callback, element);
							return $Element;
						}
					},
					Click: function(callback) {
						Herpicus.Events.Add('mousedown', callback, element);
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
					Disabled: function(b) {
						if(Herpicus.isBoolean(b)) {
							if(b) element.setAttribute('disabled', b);
							else element.removeAttribute('disabled');
							return $Element;
						}

						return element.hasAttribute('disabled') ? element.getAttribute('disabled') : false;
					},
					Checked: function(b) {
						if(Herpicus.isBoolean(b)) {
							if(Herpicus.isDefined(element.checked)) {
								element.checked = b;
							} else {
								element.setAttribute('checked', b);
							}
							return $Element;
						}

						return element.hasAttribute('checked') ? element.getAttribute('checked') : false;
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
					Type: function(s) {
						if(Herpicus.isString(s)) {
							$Element.Attributes.Add('type', s);
						}

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
						Down: function(callback, b) {
							Herpicus.Events.Add('keydown', function(e) {
								if(Herpicus.isBoolean(b) && b) {
									callback.call(this);
								}
								else if((new RegExp("^[a-zA-Z0-9]+$")).test(String.fromCharCode(!e.charCode ? e.which : e.charCode))) {
									callback.call(this);
								};
							}, element);

							return $Element;
						},
						Up: function(callback, b) {
							Herpicus.Events.Add('keyup', function(e) {
								if(Herpicus.isBoolean(b) && b) {
									callback.call(this);
								}
								else if((new RegExp("^[a-zA-Z0-9]+$")).test(String.fromCharCode(!e.charCode ? e.which : e.charCode))) {
									callback.call(this);
								};
							}, element);

							return $Element;
						}
					},
					Focus: function(select) {
						element.focus();
						if(Herpicus.isBoolean(select) && select) {
							element.select();
						}
						return $Element;
					},
					Show: function() {
						element.style.display = "block";
						element.style.visibility = "visible";
						return $Element;
					},
					Hide: function() {
						element.style.display = "none";
						element.style.visibility = "hidden";
						return $Element;
					},
					Toggle: function() {
						return $Element.Visible() ? $Element.Hide() : $Element.Show();
					},
					Visible: function() {
						if(arguments.length === 1) {
							if(Herpicus.isBoolean(arguments[0])) {
								if(arguments[0]) {
									$Element.Show();
								} else {
									$Element.Hide();
								}
							}

							return $Element;
						} else {
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
					}
				};

				return $Element;
			}

			return null;
		},
		Print: function(str) {
			if(Herpicus.isString(str)) {
				for(var i = 1; i < arguments.length; i++) {
					str = str.replace('{' + (i - 1) + '}', arguments[i]);
				}
			}

			return str;
		},
		Events: {
			Storage: {},
			Add: function(e, fn, el, b) {
				b = !Herpicus.isBoolean(b) ? true : b;
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
					Herpicus.forEach(e, function(i, evt) {
						__registerEvent(evt);
					});
				} else if(Herpicus.isString(e)) {
					__registerEvent(e);
				}
			},
			Remove: function(e, el) {
				if(el.removeEventListener) {
					el.removeEventListener(e, function() {});
				} else {
					if(el.detachEvent) {
						el.detachEvent('on' + e, function() {});
					}
				}
			}
		}
	};

	if(document.readyState === "complete")
		return setTimeout(Herpicus._ready, 1);
	else if(document.addEventListener) {
		document.addEventListener("DOMContentLoaded", Herpicus._ready, false);
		window.addEventListener("load", Herpicus._ready, false);
	}
	else if(document.attachEvent) {
		document.attachEvent("onreadystatechange", Herpicus._ready);
		window.attachEvent("onload", Herpicus._ready);
	}
})(window);
