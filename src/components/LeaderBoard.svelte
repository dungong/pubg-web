<script>
  const platformList = ["Steam", "KAKAO"];
  const matchTypes = ["경쟁전", "경쟁전 솔로"];
  let selected = "Steam";
  let selectedMatchType = "경쟁전";
</script>

<div>
  <h3>리더보드</h3>

  <section class="button_container">
    <select bind:value={selected}>
      {#each platformList as platform}
        <option value={platform}>{platform}</option>
      {/each}
    </select>
    <form method="get" class="checkBox">
      <input type="checkbox" />
      <span>FPP</span>
    </form>
  </section>

  <section>
    {#each matchTypes as matchType}
      <button
        class={selectedMatchType === matchType ? "selectedType" : "matchType"}
        onclick={() => (selectedMatchType = matchType)}>{matchType}</button
      >
    {/each}
  </section>
</div>

<style>
  .button_container {
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  select {
    width: 148px;
    height: 36px;
    outline: none;
    font-size: 14px;
    font-weight: 500;
    margin: 0;
  }
  h3 {
    margin: 0;
    padding: 16px;
    text-align: start;
    font-size: 16px;
  }

  input {
    width: 26px;
    height: 26px;
    line-height: 26px;
    vertical-align: middle;
    margin: 0;
  }

  .checkBox {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .selectedType {
    border: 0;
    border-radius: 2px;
  }
  .matchType {
    border: 1px solid #cacaca;
    border-radius: 2px;
  }
</style>
