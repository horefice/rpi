$(document).ready(function() {
	// Vars
	token = null;
	services = [];
	link = null;

	// Submit
	$("#login").submit(function(e){
		$.get({
			url: "https://api.weaved.com/v22/api/user/login/h.orefice@gmail.com/" + $("#password").val(),
			contentType: "application/json",
			headers: {"apikey":"WeavedDemoKey\$2015"}
		}).done(function(msg) {
			token = msg.token;
			console.log("token:" + token);
			$.get({
				url: "https://api.weaved.com/v22/api/device/list/all",
				contentType: "application/json",
				headers: {
					"apikey": "WeavedDemoKey\$2015",
					"token": token
				}
			}).done(function(msg) {
				services = msg.devices.slice(1);
				console.log("services:" + services.length);
				$(services).each(function(index, item){
					$("#list").append('<option value="' + item.deviceaddress + '">' + item.devicealias + '</option>');
				})
			}).fail(function(jqXHR, textStatus) {
				alert( "Request failed: " + textStatus );
			});
		}).fail(function(jqXHR, textStatus) {
			alert( "Request failed: " + textStatus );
		});
		e.preventDefault();
	});

	// Connect
	$("#list").change(function(e){
		confirm("Request link to connect?");
		$.get("http://ipinfo.io", function(response) {
			hostip = response.ip;
			$.post({
				url: "https://api.weaved.com/v22/api/device/connect",
				contentType: "application/json",
				data: JSON.stringify({
					deviceaddress: e.target.value,
					hostip: hostip,
					wait: true
				}),
				headers: {
					"apikey": "WeavedDemoKey\$2015",
					"token": token
				}
			}).done(function(msg) {
				link = msg.connection.proxy;
				console.log(link);
				$("#Connect").html("<span>" + link + "</span>")
			}).fail(function(jqXHR, textStatus) {
				alert( "Request failed: " + textStatus );
			});
		}, "jsonp");
	});
});