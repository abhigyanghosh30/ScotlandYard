<script>
	import LondonMap from './map_final.svelte';
	import { onMount } from 'svelte';

	let user = {'username':null,'playertype':'D','roomName':null,'authenticated':false,'players':[]}; // D for detective, T for thief
	let data = {'nodevalue':null,'ticket':null};
	let nodetravel = [];
	let london_map_data = {};
	var socket = io();

	onMount(async()=>{
		fetch('http://localhost:3000/map',
		{
			method:"GET",
		})
		.then((res)=>{return res.json()})
		.then((resp)=>{london_map_data=resp;});
	});

	// Form and State Changes

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
	//
	function refreshGraphic(){
		user.room.players.forEach(()=>{
			;;
		});
	}

	// Socket Emit Events

	function postUser(){
		event.preventDefault();
		socket.emit('user',JSON.stringify(user));
	}

	function playMove(){
		event.preventDefault();
		if (data['nodevalue']>0) {
			socket.emit(user['playertype'], JSON.stringify(data));
			data['nodevalue']=null;
			data['ticket']=null;
		}
	}

	function startGame(){
		event.preventDefault();
		socket.emit('start');
	}

	// Socket Recieve Event 

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

	socket.on('start',(res)=>{
		console.log(res);
		res.forEach(element => {
			if(element.username == user.username){
				nodetravel.push(element.nodes.slice(-1)[0]);
			}
		});
		refreshGraphic();
		user.authenticated=true;
	});
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
	<button class="btn btn-primary" on:click={startGame}>Start Game</button>
	{:else}
	<div class="container-fluid">
		<div class="row">
			{user.roomName}
		</div>
		<div class="row">
			<div class="col-10 overflow-scroll" style="max-height: 90vh ;">
				<LondonMap handleClick={handleClick}/>
			</div>
			<form class="col-2" on:submit={playMove}>
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