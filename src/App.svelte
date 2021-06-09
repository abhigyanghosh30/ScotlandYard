<script>
	import LondonMap from './map_final.svelte';
	let playertype = 'D'; // D for detective, T for thief
	let data = {'nodevalue':null,'ticket':null};
	var socket = io();

	function handleClick(){
		event.preventDefault();
		data['nodevalue']=event.target.id;
		console.log(data);
	}
	
	function handleSubmit(){
		event.preventDefault();
		if (data['nodevalue']>0) {
			socket.emit(playertype, JSON.stringify(data));
			delete data['nodevalue'];
			delete data['ticket'];
		}
	}

	socket.on('D',function(res){
		var response = JSON.parse(res);
		console.log(response);
	});

	function handleChange(){
		data[event.target.name] = event.target.value;
		console.log(data);
	}
</script>
<main>
	<LondonMap/>
	<form on:submit={handleSubmit}>
		<!-- <input type="number" max="200" min="1" value={data["nodevalue"]} on:change={handleChange} name="nodevalue" required/>
		<select on:change={handleChange} name="ticket" required>
			<option value="T">Taxi</option>
			<option value="B">Bus</option>
			<option value="U">Underground</option>
		</select> -->
		<button type="submit">Submit</button>
	</form>
</main>