return Herpicus.Module('RouteHandler', function() {
	var $RouteHandler = new Object();

	$RouteHandler.Routes = new Object();
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
				$RouteHandler.Routes[Route] = Handler;
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

	var __eventHandler = function() {
		var location = $RouteHandler.Location(true);
		Herpicus.ForEach($RouteHandler.Routes, function(r, h) {
			var route = $RouteHandler.Parse(r, true);

			if(location.length === route.length) {
				var vars = {};
				Herpicus.ForEach(route, function(i, v) {
					if(v.indexOf('{') > -1) {
						vars[v.substr(1, v.length - 2)] = route[i] = location[i];
					}
				});

				if(route.join("/") === location.join("/")) {
					Herpicus.Function(h).Inject(vars).Run();
				}
			}
		});
	};

	var wait = Herpicus.Interval(function() {
		if(Herpicus.Ready) {
			if(window.location.hash === "" || window.location.hash === "#") {
				window.location.hash = "#!/";
			}
			__eventHandler();
			wait.Stop();
		}
	}, 25);

	Herpicus.Events.Add('hashchange', function(event) {
		__eventHandler();
	}, window);

	return $RouteHandler;
});
