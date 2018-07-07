function ucfirst(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function statisticError(xhr, status, type) {
	let error = $("#js-request-error");
	let number = $("#js-number-playing");
	switch(status) {
		case "parsererror":
			error.text("Malformed matchmaking data!");
			break;
		case "error":
			error.text(type === "" ? "Unknown HTTP Error" : "HTTP Error: " + ucfirst(type));
			break;
		default:
			error.text("Unknown error, see console.")
	}
	number.text("Unknown");
	console.error(`Status: '${status}' Error: '${type}'`);
	error.show();
}

function statisticSuccess(json) {
	let number = $("#js-number-playing");
	let information = $("#js-statistics-content");
	information.empty();

	if (!("total" in json) || !("averageWaitTime" in json)) {
		statisticError(null, "parsererror", "Response did not contain key 'total' or 'averageWaitTime'!");
		return;
	}

	let regions = [];
	if ("regions" in json) {
		let reg = json.regions;
		for (let key in reg) {
			if (reg.hasOwnProperty(key)) {
				regions.push({
					"region": key,
					"players": reg[key]
				})
			}
		}
	}

	if (regions.length > 0) {
		information.append("<span>Region (Players):</span>");
		let list = $("<ul class='information-list'></ul>");
		regions.forEach(function (region) {
			let formatted = region.region + " (" + region.players + ")";
			list.append($("<li></li>").text(formatted));
		});
		information.append(list);
	}

	let time =  "Wait Time: ~" + Math.ceil(json.averageWaitTime/1000) + " s";
	information.append($("<span></span>").text(time));
	number.text(json.total);
}

function setup() {
	$("#js-statistics-toggle").click(function() {
		let information = $("#js-statistics-content");
		information.toggle();
	});

	$("#js-settings-toggle").click(function() {
		let settings = $("#js-settings-content");
		settings.toggle();
	})
}

function update() {
	$.ajax({
		"url": "https://aa.sdawsapi.com/matchmaking/stats",
		"dataType": "json",
		"crossDomain": true,
		"timeout": 2000,
		"success": statisticSuccess,
		"error": statisticError
	})
}

$(function() {
	setup();
	update();
	setInterval(update, 10000);
});
