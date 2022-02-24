<script lang="ts">
  import Header from "../components/Header.svelte";
  export let title: string;
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
<svelte:body />

<main>
  <Header />
  <p />
</main>

<style>
  main {
    text-align: center;
    padding: 0;
    margin: 0 auto;
  }
</style>
