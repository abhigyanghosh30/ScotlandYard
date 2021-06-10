<script>
	import LondonMap from './map_final.svelte';
	let user = {'username':null,'playertype':null}; // D for detective, T for thief
	let data = {'nodevalue':null,'ticket':null};
	var socket = io();

	function handleClick(){
		event.preventDefault();
		console.log(event.target);
		var currTag = event.target;
		while(!currTag.id.startsWith('node')){
			currTag = currTag.parentNode;
		}
		data['nodevalue']=currTag.id.substring(4);
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

	function userChanges(){
		user[event.target.name] = event.target.value;
	}

	function postNick(){
		
	}
</script>
<main>
	{#if user.username==null}
	<form on:submit={postNick}>
		<input type="text" on:change={userChanges} name="username" value={user["username"]} required>
		<button type="submit">Submit</button>
	</form>

	{:else}
	<div class="w-75 h-75 overflow-scroll">
		<LondonMap handleClick={handleClick}/>
	</div>
	<form on:submit={handleSubmit}>
		<!-- <input type="number" max="200" min="1" value={data["nodevalue"]} on:change={handleChange} name="nodevalue" required/> -->
		<select on:change={handleChange} name="ticket" required>
			<option value="T">Taxi</option>
			<option value="B">Bus</option>
			<option value="U">Underground</option>
		</select>
		<button type="submit">Submit</button>
	</form>
	{/if}
</main>