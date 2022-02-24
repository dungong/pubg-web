<script lang="ts">
  export let width: string;
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
    position: absolute;
    width: 100%;
    height: 228px;
    background-color: #fff;
  }
  .head {
    line-height: var(--height);
    height: var(--height);

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
