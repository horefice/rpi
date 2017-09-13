$(document).ready(function() {
	// Vars
	token = null;
	services = [];
	link = null;

	// Submit
	$("#login").submit(function(e){
		$("h1").addClass("loading");
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
				$("h1").removeClass("loading");
				$("#List").html("<span>Services: </span><select id='list' name='service'><option>None</option></select>");
				$(services).each(function(index, item){
					$("#list").append("<option value=" + item.deviceaddress + ">" + item.devicealias + "</option>");
				})
				$("#list").change(selectedService);
			}).fail(function(jqXHR, textStatus) {
				alert("Request failed: " + textStatus);
				$("#List").empty();
				$("#Connect").empty();
			});
		}).fail(function(jqXHR, textStatus) {
			alert("Request failed: " + textStatus);
			$("#List").empty();
			$("#Connect").empty();
		});
		e.preventDefault();
	});

	// Connect
	function selectedService(e) {
		service = $("#list option:selected").text()
		if (service == "None") {
			$("#Connect").empty();
			return;
		}
		$("#Connect").html("<span>" + service + " at </span>");
		$("h1").addClass("loading");
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
				$("h1").removeClass("loading");
				switch(service) {
					case "SSH-Pi":
						ssh = link.replace("http://","ssh://pi@")
						$("#Connect").append($("<a href=" + ssh + ">" + ssh + "</a>"))
						break;
					case "VNC-Pi":
						vnc = link.replace("http","vnc").replace("/vnc/vnc.php?port=",":")
						$("#Connect").append($("<a href=" + vnc + ">" + vnc + "</a>"))
						break;
					default:
						$("#Connect").append($("<a href=" + link + " target='_blank'>" + link + "</a>"))
				}
			}).fail(function(jqXHR, textStatus) {
				alert("Request failed: " + textStatus);
			});
		}, "jsonp");
	}
});