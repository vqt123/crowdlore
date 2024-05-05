<script lang="ts">
	import type { PageData } from './$types';

	// data props

	export let data: PageData;
	const worlds = data.worlds;
	// get props from server

	export let createWorld = async (e: any) => {
		e.preventDefault();
		const worldName = e.target.worldName.value;
		const res = await fetch('/api/worlds', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: worldName })
		});
		const data = await res.json();
		console.log(data);
	};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<!-- create world form -->
	<!-- 	
		<input type="text" placeholder="World Name" name="worldName" />
		<button type="submit">Create</button> -->

	<form on:submit={createWorld}>
		<input type="text" placeholder="World Name" name="worldName" />
		<button type="submit">Create</button>
	</form>

	<section>
		<h2>Worlds</h2>
		<ul>
			{#each worlds as world}
				<li>
					<button on:click={() => console.log(world)}>View</button>

					{world.name}
				</li>
			{/each}
		</ul>
	</section>
	<pre>
		
		{JSON.stringify(data, null, 2)}
	</pre>
</section>
