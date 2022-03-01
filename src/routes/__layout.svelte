<script>
	import Navbar from '../components/Navbar.svelte';

	import '../app.css';
</script>

<div class="container mx-auto px-5">
	<Navbar />
	<slot />
</div>
