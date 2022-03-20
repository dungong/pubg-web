<script>
  import { createClient } from "@urql/svelte";
  import { setClient } from "@urql/svelte";

  const client = createClient({
    url: "https://graphql-pokeapi.graphcdn.app/",
  });

  setClient(client);
</script>
