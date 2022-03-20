<script lang="ts">
  import { clickOutside } from "../utils/functions";
  import SearchHistorys from "./SearchHistorys.svelte";

  export let height = "32px";
  export let containerHeight = "48px";
  export let width = "340px";

  let isClicked = false;
  export let value = "";

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "enter") {
      console.log("엔터");
    }
  };
</script>

<!-- --?? 형태의 문법은 어디서 나온 것인가 -->
<form
  on:click={() => (isClicked = true)}
  use:clickOutside={() => (isClicked = false)}
  style="--width:{width}; --c_height:{containerHeight};"
  method="get"
>
  <input
    bind:value
    placeholder="이름을 입력하세요"
    on:keydown={handleKeydown}
    style="--height:{height}"
  />
  {#if isClicked}
    <SearchHistorys headerHeight="34px" height="228px" />
  {/if}
</form>

<style>
  form {
    position: relative;
    line-height: var(--c_height);
    height: var(--c_height);
    width: var(--width);
    vertical-align: middle;
  }
  input {
    height: var(--height);
    width: var(--width);
    margin: 0;
    outline: none;
  }
</style>
