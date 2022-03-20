<script lang="ts">
  import Router from "svelte-spa-router";
  import routes from "./routers";
  import { initClient } from "@urql/svelte";
  initClient({
    url: "https://graphql-pokeapi.graphcdn.app/",
  });
</script>

<Router {routes} />
