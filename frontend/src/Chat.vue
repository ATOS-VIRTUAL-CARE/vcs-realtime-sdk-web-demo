<template>
  <dialog ref="dialog" style="width: 600px">
    <form class="pure-form pure-form-aligned">
      <fieldset>
        <legend>Send message to other participant or all participants</legend>
        <div class="pure-control-group">
          <label>Participant address</label>
          <select class="pure-input-1-2" ref="conferenceRoomType" v-model="selected">
            <option value="">All participants</option>
            <option v-for="p in participants" :value="p.address">{{ p.name || p.address }}</option>
          </select>
        </div>
        <div class="pure-control-group">
          <label>Message</label>
          <input class="pure-input-1-2" v-model="message" />
        </div>
      </fieldset>
    </form>
    <menu>
      <button @click="$refs.dialog.close()" class="pure-button pure-button-secondary">Cancel</button>
      <button @click="sendMessage()" class="pure-button pure-button-primary">Send</button>
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
    button {
      margin-left: 5px;
    }
  }
  &::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>

<script>

export default {
  props: {
    participants: Array
  },

  data() {
    return {
      selected: '',
      message: null
    };
  },

  async created() {

  },

  methods: {
    async show() {
      this.$refs.dialog.showModal();
    },
    async sendMessage() {
      await this.$emit('send', {
        message: this.message,
        participants: this.selected
      });
      this.message = null;
      this.$refs.dialog.close();
    }
  }
};
</script>
