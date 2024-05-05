<script lang="ts">
	import type { PageData } from './$types';

	// data props

	export let data: PageData;
	const region = data.region!;
	// get props from server
</script>

<svelte:head>
	<title>Level</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h2>Region</h2>
	<h3>{region.name}</h3>
	<h4>Level: {region.level}</h4>

	<a target="_self" href={`/region/${region.parentId}`}>Parent: {region.parentId}</a>

	<h4>Children:</h4>
	<section class="grid grid-cols-5 gap-4 items-center justify-around">
		{#each region.children as child}
			<div class="flex items-center justify-center">
				<a href={`/region/${child.id}`} target="_self">
					{child.breadcrumb}
				</a>
			</div>
		{/each}
	</section>

	<pre>
		
		{JSON.stringify(data, null, 2)}
	</pre>
</section>
