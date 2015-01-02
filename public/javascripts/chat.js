var msg = {
		name:"",
		message: ""
	}
	var ws = new WebSocket('ws://'+window.location.host);

	(function setName(){
		msg.name = prompt("Willkommen im Chat!  Wie ist dein Name?", "");
		if(msg.name == ""){
			setName();
		}
	})();

	$('#message').keydown(function(evt){
		if(evt.which==13){
			msg.message = $('#message').val();
			ws.send(JSON.stringify(msg));
			msg.message = "";
			$('#message').val("");
		}
	});
	
	$('#send').click(function(){
		msg.message = $('#message').val();
		ws.send(JSON.stringify(msg));
		msg.message = "";
		$('#message').val("");
	});
	
	ws.onmessage = function(evt){
		try{
			var message = JSON.parse(evt.data);
			$('#chat').append('<p><b>'+message.name+'</b>: ' +message.message+'<p>');
		}

		catch(e){
			$('#chat').append('<p class="error">invalid message</p>');
		}
		
}