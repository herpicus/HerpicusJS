Herpicus.Module("Tooltip", function(options) {
	var Config = {
		Id: 'HerpicusTooltip',
		Attr: 'HerpicusTooltip',
		Padding: 7,
		Font: {
			Size: 12,
			Style: 'normal',
			Family: 'Arial, Helvetica, Sans-serif'
		},
		Color: '#FFF',
		Background: 'rgba(7,12,33,0.9)',
		// Shadow: {
		// 	Box: {
		// 		Color: '#000',
		// 		Size: [0, 0, 3]
		// 	},
		// 	Text: {
		// 		Color: '#000',
		// 		Size: [1, 1]
		// 	}
		// },
		Border: {
			Color: '#777777',
			Size: 1,
			Type: 'solid',
			Radius: 3
		}
	}

	Config = Herpicus.Extend(Config, options);

	Herpicus.Ready(function() {
		var Tooltip = Herpicus.DOM.Create('div').Id(Config.Id);
		var p = Herpicus.Selector('body');
		Tooltip.Attributes.Add('style', 'font-size:' + Config.Font.Size + 'px;font-style:' + Config.Font.Style + ';font-family:' + Config.Font.Family + ';color:' + Config.Color + ';background:' + Config.Background + ';border: ' + Config.Border.Size + 'px ' + Config.Border.Type + ' ' + Config.Border.Color + ';')
			.Style.Position('absolute')
			.Style.Index(99999)
			.Style.Padding(Config.Padding).Hide();
		var tooltips = Herpicus.Selector("[" + Config.Attr + "]");

		if(tooltips !== null) {
			if(tooltips.length === 1) {
				tooltips[tooltips];
			}

			Herpicus.ForEach(tooltips, function(_, el) {
				el.MouseEnter(function() {
					Tooltip.HTML(el.Attributes.Get(Config.Attr)).Show();
				}).MouseLeave(function() {
					Tooltip.Hide().Clear();
				}).MouseMove(function(e) {
					Tooltip.Style.Left(e.pageX - (Tooltip.Style.Width() / 2)).Style.Top(e.pageY + 25);
				});
			});
			
		}
		p.Prepend(Tooltip);
	});
});
