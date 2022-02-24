<script>
  import PgSearch from "./PgSearch.svelte";
  import { PUBG_MUSTARD } from "../utils/constants";
  import SearchHistorys from "./SearchHistorys.svelte";
  const tabs = ["홈", "랭킹", "커뮤니티"];
  let currentTab = "홈";
</script>

<div class="wrapper" style="--background-color:{PUBG_MUSTARD}">
  <ul>
    <!-- 조건부 또는 반복문은 블록으로 래핑해야 하고, 꼭 닫아줘야함. -->
    {#each tabs as tab}
      <li class={currentTab === tab && "selectedTab"}>{tab}</li>
    {/each}
  </ul>
  <PgSearch value="" />
</div>

<style>
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 86px;
    background-color: var(--background-color);
  }

  ul {
    margin: 0;
    padding: 0;
    display: flex;
    gap: 32px;
  }

  li {
    color: #ffe2c1;
    font-weight: 500;
    cursor: pointer;
  }

  .selectedTab {
    color: #fff;
    font-weight: 700;
    cursor: pointer;
  }
  .search_wrapper {
    height: 48px;
  }
</style>
