<script lang="ts">
  export let message: string
  export let redirection: string = ''

  if(redirection) {
    location.href = redirection
  }
</script>


<p>{message}</p>


<style>
  p {
    color: red;
    font-weight: 700;
  }
</style>