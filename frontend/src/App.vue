<template>
  <router-view />
</template>

<style lang="less">
button {
  border-radius: 4px;
}
.pure-form select {
  height: auto; // purecss fix
}
</style>

<script>
import { setLogger } from 'vcs-realtime-sdk';

export default {
  async created() {
    // Set SDK logger to log to console
    setLogger(console);
  }
};
</script>
