<script lang="ts">
  export let height: string;
  export let headerHeight: string;
  let currentTab = "최근검색";
</script>

<div class="wrapper" style="--height:{height}">
  <div class="head" style="--h_height:{headerHeight}">
    <section
      class={currentTab === "최근검색" && "selected"}
      on:click={() => (currentTab = "최근검색")}
    >
      최근검색
    </section>
    <section
      class={currentTab === "즐겨찾기" && "selected"}
      on:click={() => (currentTab = "즐겨찾기")}
    >
      즐겨찾기
    </section>
  </div>
</div>

<style>
  .wrapper {
    box-shadow: 4px 4px 8px 0 rgb(0 0 0 / 30%);
    position: absolute;
    width: 100%;
    height: var(--height);
    margin-top: -1px;
    background-color: #fff;
    z-index: 1;
  }
  .head {
    line-height: var(--h_height);
    height: var(--h_height);

    display: flex;
  }
  .selected {
    background-color: #fff;
  }
  section {
    width: 100%;
    columns: #758592;
    font-size: 12px;
    background-color: #ebeef1;
  }
</style>
