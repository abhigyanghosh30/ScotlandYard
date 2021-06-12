<script>
	import LondonMap from './map_final.svelte';
	let user = {'username':null,'playertype':'D','roomName':null,'authenticated':false,'players':[]}; // D for detective, T for thief
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
		console.log(data);
	}
	
	function handleSubmit(){
		event.preventDefault();
		if (data['nodevalue']>0) {
			socket.emit(user['playertype'], JSON.stringify(data));
			data['nodevalue']=null;
			data['ticket']=null;
		}
	}

	socket.on('D',function(res){
		var response = JSON.parse(res);
		console.log(response);
	});

	socket.on('user',(res)=>{
		var response = JSON.parse(res);
		console.log(response);
		user['roomName'] = response['roomName'];
		user['players'] = response['players'];
		console.log(user);
	});

	function handleChange(){
		event.preventDefault();
		data[event.target.name] = event.target.value;
		console.log(data);
	}

	function userChanges(){
		event.preventDefault();
		user[event.target.name] = event.target.value;
		console.log(user);
	}

	function postUser(){
		event.preventDefault();
		socket.emit('user',JSON.stringify(user));
	}
</script>
<main>
	{#if user.authenticated==false}
	<div class="container">
		<form class="col" on:submit={postUser}>
			<input type="text" placeholder="username" on:change={userChanges} name="username" value={user["username"]} required>
			<input type="text" placeholder="roon-name" on:change={userChanges} name="roomName" value={user["roomName"]} >
			<button type="submit">Submit</button>
		</form>
		<div class="col">
			<ul>
				{#each user.players as player }
				<li>{player.username}</li>
				{/each}
			</ul>

		</div>
	</div>
	<button class="btn btn-primary" on:click={()=>{user.authenticated=true;}}>Start Game</button>
	{:else}
	<div class="container-fluid">
		<div class="row">
			{user.roomName}
		</div>
		<div class="row">
			<div class="col-10 overflow-scroll" style="max-height: 90vh ;">
				<LondonMap handleClick={handleClick}/>
			</div>
			<form class="col-2" on:submit={handleSubmit}>
				<!-- <input type="number" max="200" min="1" value={data["nodevalue"]} on:change={handleChange} name="nodevalue" required/> -->
				<select on:change={handleChange} name="ticket" default="T" required>
					<option value="T">Taxi</option>
					<option value="B">Bus</option>
					<option value="U">Underground</option>
				</select>
				<button type="submit">Submit</button>
			</form>
		</div>
	</div>
	{/if}
</main>