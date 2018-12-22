Herpicus.Module('Herpicus.RouteHandler', function() {
	var $RouteHandler = {}, Routes = {}, NotFound = null, onLocationChange = null;

	$RouteHandler.Routes = function() {
		return Routes;
	};
	$RouteHandler.Route = function() {
		if(arguments.length === 2) {
			var Route = null, Handler = null;
			if(Herpicus.isString(arguments[0])) {
				Route = arguments[0];
			}

			if(Herpicus.isFunction(arguments[1])) {
				Handler = arguments[1];
			}

			if(Route !== null && Handler !== null) {
				Routes[Route] = Handler;
			}
		}

		return $RouteHandler;
	};

	$RouteHandler.Parse = function(loc, arr) {
		if(!Herpicus.isArray(loc)) {
			if(Herpicus.isString(loc)) {
				loc = loc.split('/');
				loc[0] = "/";
			} else {
				return "/";
			}
		}

		var r = "";
		Herpicus.ForEach(loc, function(i, v) {
			r += v + (i >= 1 ? "/" : "");
		});

		if(r.length > 1) {
			if(r.slice(-1) === "/") {
				r = r.slice(0, -1);
			}
		}

		if(Herpicus.isBoolean(arr) && arr) {
			r = r.split('/');
			r[0] = "/";
		}

		return r;
	};

	$RouteHandler.Location = function(i) {
		var loc = window.location.hash.split("/");
		loc[0] = "/";

		if(Herpicus.isInteger(i)) {
			if(Herpicus.isDefined(loc[i])) {
				if(i === 0) {
					return "/";
				}
				else if(Herpicus.isDefined(loc[i])) {
					return loc[i];
				}
			}
			return null;
		} else if(Herpicus.isBoolean(i) && i) {
			return loc;
		}

		return $RouteHandler.Parse(loc);
	};

	$RouteHandler.Location.Set = function(n) {
		var h = "#!/";
		if(Herpicus.isString(n)) {
			h += n;
		}
		else if(Herpicus.isInteger(n)) {
			if((w = $RouteHandler.Location(true)), Herpicus.isDefined(w[n])) {
				var tmp = [];
				for(var i = 0; i < (n + 1); i++) {
					tmp[i] = w[i];
				}

				var t = tmp.join("/");
				if(t.substring(0, 1) == "/") 
					t = t.substring(1);
				h += t; 
			}
		}

		window.location.hash = h;
	};

	$RouteHandler.Location.Back = function(n) {
		var a = $RouteHandler.Location(true);
		a.shift();
		a.pop();
		
		if(Herpicus.isInteger(n) && n < a.length) {
			for(var i = 0; i < n; i++) {
				a.pop();
			}
		}
		
		$RouteHandler.Location.Set(a.join("/"));
	}

	$RouteHandler.Location.Change = function(callback) {
		if(Herpicus.isFunction(callback)) {
			onLocationChange = callback;
		}

		return $RouteHandler;
	}

	$RouteHandler.NotFound = function(callback) {
		if(Herpicus.isFunction(callback)) {
			NotFound = callback;
		}

		return $RouteHandler;
	}

	$RouteHandler.onHashChange = function() {
		if(window.location.hash === "" || window.location.hash === "#") {
			window.location.hash = "#!/";
		}

		var doRoute = function() {
			var location = $RouteHandler.Location(true), found = false;
			Herpicus.ForEach(Routes, function(r, callback) {
				var route = $RouteHandler.Parse(r, true);
				if(location.length === route.length) {
					var params = {};

					Herpicus.ForEach(route, function(i, segment) {
						if(segment.match(/[^{}]+(?=\})/g) !== null) {
							route[i] = params[segment.replace(/[{}]+/g, "")] = location[i];
						}
					});

					if(route.join("/") === location.join("/")) {
						found = true;
						Herpicus.Safe(function() {
							callback.call(this, params);
						});
					}
				}
			});

			if(!found && Herpicus.isFunction(NotFound)) {
				NotFound.call(this);
			}
		}

		if(Herpicus.isFunction(onLocationChange)) {
			onLocationChange.call(this);
			doRoute();
		} else {
			doRoute();
		}
	};

	Herpicus.Ready(function() {
		$RouteHandler.onHashChange();
	});

	Herpicus.Events.Add('hashchange', function(e) {
		$RouteHandler.onHashChange();
		e.preventDefault();
	}, window);

	return $RouteHandler;
});
