<script>
	let playertype = 'D'; // D for detective, T for thief

	let data = {'nodevalue':null,'ticket':null};
	var socket = io();
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
	<form on:submit={handleSubmit}>
		<input type="number" max="200" min="1" value={data["nodevalue"]} on:change={handleChange} name="nodevalue" required/>
		<select on:change={handleChange} name="ticket" required>
			<option value="T">Taxi</option>
			<option value="B">Bus</option>
			<option value="U">Underground</option>
		</select>
		<button type="submit">Submit</button>
	</form>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>