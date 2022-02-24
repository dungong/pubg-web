<script lang="ts">
  export let data: {
    rank: number;
    name: string;
    rp: number;
    nunOfMathces: number;
  };
</script>

<div class="wrapper">
  <span class="rank">{data.rank}</span>
  <span>{data.name}</span>
  <span>{data.rp}</span>
  <span>{data.nunOfMathces}</span>
</div>

<style>
  .wrapper {
    display: flex;
  }
  .rank {
  }
</style>
