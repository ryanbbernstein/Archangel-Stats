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
	
	if (!("total" in json)) {
		statisticError(null, "parsererror", "Response did not contain key 'total'!");
		return;
	}

	number.text(json.total);
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
	setInterval(update, 10000);
	update();
});
