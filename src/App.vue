<template>
  <div id="app">
    {{ message }}
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">This is my config for dev title</h1>
          <h2 class="mytitle subtitle">Nothing will change subtitle</h2>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
export default {
  data() {
    return {
      message: "This message come from Vue component"
    };
  }
};
</script>


<style scoped lang="scss">
</style>