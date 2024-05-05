<script>
	import Header from './Header.svelte';
	import './styles.css';
</script>

<div class="app">
	<main>
		<slot />
	</main>
</div>

<!-- global styles-->
<style lang="postcss" global>
	:global(*, button, section, div) {
		@apply bg-gray-400 bg-opacity-5 p-[1px] m-[1px] rounded-sm  border-[1px] border-white border-opacity-50;
	}
</style>
