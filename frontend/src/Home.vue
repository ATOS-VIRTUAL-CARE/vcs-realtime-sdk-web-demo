<template>
  <Preferences ref="preferences"></Preferences>
  <div class="version">
    <div><a target="_blank" href="https://github.com/atos-virtual-care/vcs-realtime-sdk-web-demo">App Version: v{{ $store.state.version }}</a></div>
    <div><a target="_blank" href="https://sdk.virtualcareservices.net">SDK Version: v{{ $store.state.sdkVersion }}</a></div>
  </div>
  <div class="home">
    <div class="tune">
      <svg-icon @click="$refs.preferences.show()" type="mdi" :path="mdiTune"></svg-icon>
    </div>
    <div class="spacer"></div>
    <div class="title">
      <img width="100" alt="" src="/logo.svg" />
      <div>vcs-realtime-sdk demo</div>
    </div>
    <div class="pure-form pure-form-aligned">
      <div class="pure-control-group">
        <label>Room name</label>
        <input v-model="roomName" />
        <span class="pure-form-message-inline">This is a required field.</span>
      </div>
      <div class="pure-control-group">
        <label>Your name</label>
        <input v-model="user.name" />
      </div>
      <div class="pure-control-group">
        <label>Your country</label>
        <select v-model="user.country">
          <option v-for="country in countries" :key="country.id" :value="country.id">{{ country.name }}</option>
        </select>
      </div>
      <div class="pure-control-group">
        <label>Join with</label>
        <select v-model="mediaPreselection">
          <option value="both">audio and video</option>
          <option value="audio">audio only</option>
          <option value="video">video only</option>
        </select>
      </div>
      <div class="pure-controls">
        <button @click="join(true)" :disabled="!roomName" class="pure-button pure-button-primary">Create room</button>
        <button @click="join()" :disabled="!roomName" class="pure-button pure-button-primary">Join room</button>
      </div>
    </div>
    <div class="spacer"></div>
  </div>
</template>

<style lang="less" scoped>
.tune {
  color: #555;
  position: absolute;
  top: 20px;
  right: 20px;
  &:hover {
    color: black;
    cursor: pointer;
  }
}
.version {
  position: absolute;
  left: 10px;
  bottom: 10px;
  a {
    text-decoration: none;
    color: black;
  }
}
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #b9e4e1;

  .title {
    text-align: center;
  }
  .pure-form {
    margin-top: 50px;
    margin-bottom: 50px;
  }
  input,
  select {
    width: 240px;
  }
  button {
    margin: 3px;
  }
  .spacer {
    flex: 1;
  }
}
</style>

<script>
import { countries } from 'countries-list';
import randomWords from 'random-words';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiTune } from '@mdi/js';
import Preferences from './Preferences.vue';

export default {
  components: {
    Preferences,
    SvgIcon
  },

  data() {
    return {
      roomName: null,
      countries: [],
      user: {},
      mediaPreselection: 'both',
      version: '',
      mdiTune
    };
  },

  async created() {
    // Fetch config backend
    await this.$store.dispatch('fetchConfig');

    this.roomName = this.$store.state.activeRoom || randomWords({ exactly: 1, maxLength: 5, wordsPerString: 2, separator:' ' })[0];

    this.countries = Object.keys(countries)
      .map(id => ({ id, name: countries[id].name }))
      .sort((a, b) => ('' + a.name).localeCompare(b.name));

    this.user = this.$store.getters.user;
    if (!this.user.country) {
      this.user.country = navigator.language.toUpperCase().split('-')[1];
    }
  },

  methods: {
    join(create) {
      this.$store
        .dispatch(create ? 'createRoom' : 'fetchRoom', this.roomName)
        .then(() => {
          this.$store.state.mediaPreselection = this.mediaPreselection;
          this.$store.commit('setUser', this.user);
          this.$router.push({ path: 'room', query: { id: this.roomName } });
        })
        .catch(err => {
          console.error(err);
          alert(err);
        });
    }
  }
};
</script>
