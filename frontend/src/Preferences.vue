<template>
  <dialog ref="dialog" style="width: 600px">
    <form class="pure-form pure-form-aligned">
      <fieldset>
        <legend>Room Settings</legend>
        <div class="pure-control-group">
          <label>Conference Room Type</label>
          <select class="pure-input-1-2" ref="conferenceRoomType" @change="setConferenceRoomType()">
            <option v-for="roomType in ['MESH (E2E encrypted conference)', 'SFU (Server-based conference)']" :selected="conferenceRoomType === roomType" :value="roomType">{{ roomType }}</option>
          </select>
        </div>
      </fieldset>
      <fieldset>
        <legend>Preferred Devices</legend>
        <div class="pure-control-group">
          <label>Microphone</label>
          <select class="pure-input-1-2" ref="audioinput" @change="setPreferredDevice('audioinput')">
            <option v-if="!devices.audioInput" selected="true">Use default</option>
            <option v-for="d in devices.audioInputList" :selected="devices.audioInput?.deviceId === d.deviceId" :value="d.deviceId">{{ d.label }}</option>
          </select>
        </div>
        <div class="pure-control-group">
          <label>Camera</label>
          <select class="pure-input-1-2" ref="videoinput" @change="setPreferredDevice('videoinput')">
            <option v-if="!devices.videInput" selected="true">Use default</option>
            <option v-for="d in devices.videoInputList" :selected="devices.videoInput?.deviceId === d.deviceId" :value="d.deviceId">{{ d.label }}</option>
          </select>
        </div>
        <div class="pure-control-group">
          <label>Audio output</label>
          <select class="pure-input-1-2" ref="audiooutput" @change="setPreferredDevice('audiooutput')">
            <option v-if="!devices.audioOutput" selected="true">Use default</option>
            <option v-for="d in devices.audioOutputList" :selected="devices.audioOutput?.deviceId === d.deviceId" :value="d.deviceId">{{ d.label }}</option>
          </select>
        </div>
      </fieldset>
      <fieldset>
        <legend>Video Settings</legend>
        <div class="pure-control-group">
          <label>Preferred video codec</label>
          <select class="pure-input-1-2" ref="videocodec" @change="setPreferredVideoCodec()">
            <option v-for="codec in ['VP8', 'VP9', 'H264']" :selected="videocodec === codec" :value="codec">{{ codec }}</option>
          </select>
        </div>
        <div class="pure-control-group">
          <label>Use HD video by default </label>
          <input type="checkbox" :checked="defaultHdVideo" @click="setDefaultHdVideo" />
        </div>
      </fieldset>
      <fieldset>
        <legend>Audio Settings</legend>
        <div class="pure-control-group">
          <label>Auto Gain Control</label>
          <input type="checkbox" :checked="agc" @click="setAgc" />
        </div>
      </fieldset>
    </form>
    <menu>
      <button @click="$refs.dialog.close()" class="pure-button pure-button-primary">Done</button>
    </menu>
  </dialog>
</template>

<style lang="less" scoped>
dialog {
  border: none;
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
  border-radius: 5px;
  .pure-form-aligned .pure-control-group label {
    width: 15em;
  }
  menu {
    text-align: right;
    margin-bottom: 0px;
  }
  &::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>

<script>
import { Device, Settings } from 'vcs-realtime-sdk';

export default {
  data() {
    return {
      devices: [],
      videocodec: '',
      agc: false,
      defaultHdVideo: false,
      conferenceRoomType: ''
    };
  },

  async created() {
    this.devices = await Device.getDevices();
    this.videocodec = Settings.preferredVideoCodec;
    this.agc = Device.autoGainControl;
    this.defaultHdVideo = Settings.defaultHdVideo;
    this.conferenceRoomType = 'MESH';
  },

  mounted() {
    const dialog = document.querySelector('dialog');
    dialogPolyfill.registerDialog(dialog);
  },

  methods: {
    async show() {
      this.$refs.dialog.showModal();
    },
    setPreferredDevice(kind) {
      const deviceId = this.$refs[kind].value;
      Device.setPreferredDevice(deviceId, kind);
    },
    setPreferredVideoCodec() {
      Settings.preferredVideoCodec = this.$refs['videocodec'].value;
    },
    setDefaultHdVideo(e) {
      Settings.defaultHdVideo = !!e.target.checked;
    },
    setAgc(e) {
      Device.autoGainControl = !!e.target.checked;
    },
    setConferenceRoomType() {
      this.conferenceRoomType = this.$refs['conferenceRoomType'].value;
      this.$store.state.conferenceRoomType = this.conferenceRoomType;
    }
  }
};
</script>
