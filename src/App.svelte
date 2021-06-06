<script>
	let nodevalue=0;
	var socket = io();
	function handleSubmit(){
		event.preventDefault();
		if (nodevalue>0) {
			socket.emit('chat-message', nodevalue);
			nodevalue = 0;
		}
	}
	function handleChange(){
		nodevalue = event.target.value;
		console.log(nodevalue);
	}
</script>
<main>
	<form on:submit={handleSubmit}>
		<input type="number" max="200" min="1" value={nodevalue} on:change={handleChange} required/>
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