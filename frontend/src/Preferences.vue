<template>
  <dialog ref="dialog">
    <form class="pure-form pure-form-aligned">
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
  .device {
    width: 100%;
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
import { Device } from 'vcs-realtime-sdk';

export default {
  data() {
    return {
      devices: [],
      agc: false
    };
  },

  async created() {
    this.devices = await Device.getDevices();
    this.agc = Device.autoGainControl;
  },

  methods: {
    async show() {
      this.$refs.dialog.showModal();
    },
    setPreferredDevice(kind) {
      const deviceId = this.$refs[kind].value;
      Device.setPreferredDevice(deviceId, kind);
    },
    setAgc(e) {
      Device.autoGainControl = !!e.target.checked;
    }
  }
};
</script>
