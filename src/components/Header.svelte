<script>
  import PgSearch from "./PgSearch.svelte";
  const tabs = ["홈", "랭킹", "커뮤니티"];
</script>

<div class="wrapper">
  <ul>
    {#each tabs as tab}
      <li>{tab}</li>
    {/each}
  </ul>
  <PgSearch defaultValue="abc" />
</div>

<style>
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 86px;
  }
  ul {
    margin: 0;
    padding: 0;
    display: flex;
    gap: 32px;
  }
  input {
    border: none;
    outline: none;
  }
</style>
