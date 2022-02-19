<script lang="ts">
  import { clickOutside } from "../utils/functions";

  export let height = "48px";
  export let width = "340px";

  let isClicked = false;
  let name = "world";

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "enter") {
      console.log("엔터");
    }
  };
</script>

<!-- --?? 형태의 문법은 어디서 나온 것인가 -->
<section
  on:click={() => (isClicked = true)}
  use:clickOutside={() => (isClicked = false)}
  style="--width:{width}; --height:{height}"
>
  <input
    bind:value={name}
    placeholder="이름을 입력하세요"
    on:keydown={handleKeydown}
  />
  {isClicked}
</section>

<style>
  input {
    height: var(--height);
    width: var(--width);
  }
</style>
