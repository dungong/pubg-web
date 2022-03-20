<script lang="ts">
  import { setClient } from "@urql/svelte";
  import { operationStore, query } from "@urql/svelte";

  import Header from "../components/Header.svelte";
  import HomeBanner from "../components/HomeBanner.svelte";
  import LeaderBoard from "../components/LeaderBoard.svelte";
  import PgSearch from "../components/pgSearch.svelte";
  import SearchHistorys from "../components/SearchHistorys.svelte";

  const todos = operationStore(`
  query{
  pokemons(limit:50){
    count
    next
    results{
      image
      name
    }
  }
}
  `);

  query(todos);
  console.log(todos);
</script>

<svelte:head>
  <title>베그 전적검색</title>
</svelte:head>
<svelte:body />

<main>
  {#if $todos.fetching}
    <p>Loading...</p>
  {:else if $todos.error}
    <p>Oh no... {$todos.error.message}</p>
  {:else}
    <ul>
      {#each $todos.data.pokemons.results as todo}
        <li><img src={todo.image} alt={todo.name} />{todo.name}</li>
      {/each}
    </ul>
  {/if}
  <Header />
  <HomeBanner>
    <p>안녕 우리는 베그 전적 검색 사이트를 만들고 있다.</p>
    <h1>pubg.gg</h1>
    <span>searching your history</span>
    <section class="search_wrapper">
      <PgSearch width="624px" height="50px" containerHeight="50px" />
    </section>
  </HomeBanner>
  <section class="main_contents">
    <LeaderBoard />
  </section>
</main>

<style>
  main {
    text-align: center;
    padding: 0;
    margin: 0 auto;
    height: 130vh;
  }
  p {
    margin: 0;
  }
  h1 {
    margin: 24px 0 12px 0;
  }
  .search_wrapper {
    width: fit-content;
    margin: 0 auto;
  }
  .main_contents {
    width: 326px;
  }
</style>
