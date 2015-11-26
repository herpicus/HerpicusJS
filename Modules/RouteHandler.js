Herpicus.Module('RouteHandler', function() {
	var $RouteHandler = {}, Routes = {}, NotFound = null;

	$RouteHandler.Routes = function() {
		return routes;
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

	$RouteHandler.Location.Set = function(str) {
		if(Herpicus.isString(str)) {
			window.location.hash = "#!/" + str;
		}
	};

	$RouteHandler.NotFound = function(callback) {
		if(Herpicus.isFunction(callback)) {
			NotFound = callback;
		}

		return $RouteHandler;
	}

	$RouteHandler.onHashChange = function() {
		var location = $RouteHandler.Location(true), found = false;
		Herpicus.ForEach(Routes, function(r, callback) {
			var route = $RouteHandler.Parse(r, true);
			if(location.length === route.length) {
				var params = {};

				Herpicus.ForEach(route, function(i, segment) {
					if(segment.match(/[^{}]+(?=\})/g) !== null) {
						var p = segment.replace(/[{}]+/g, "");
						route[i] = params[p] = location[i];
					}
				});

				if(route.join("/") === location.join("/")) {
					found = true;
					callback.call(this, params);
				}
			}
		});

		if(!found && NotFound !== null) {
			NotFound.call(this);
		}
	};

	Herpicus.Ready(function() {
		if(window.location.hash === "" || window.location.hash === "#") {
			window.location.hash = "#!/";
		}
		$RouteHandler.onHashChange();
	});

	Herpicus.Events.Add('hashchange', function(e) {
		$RouteHandler.onHashChange();
		e.preventDefault();
	}, window);

	return $RouteHandler;
});
