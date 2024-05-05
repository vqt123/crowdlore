<script lang="ts">
	import type { PageData } from './$types';

	// data props

	export let data: PageData;
	// get props from server
</script>

<svelte:head>
	<title>Level</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<pre>
		
		{JSON.stringify(data, null, 2)}
	</pre>
</section>
