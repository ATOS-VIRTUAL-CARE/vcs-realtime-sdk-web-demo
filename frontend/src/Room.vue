<template>
  <div v-if="room" ref="room" class="room" :class="{ mobile }">
    <div class="text">
      <div data-autotest="displayedRoomName" v-if="room.name">Room: {{ room.name }}</div>
    </div>
    <div class="actions">
      <button data-autotest="toggleCamera" @click="switchCamera" v-if="mobile" class="pure-button pure-button-primary switch-camera">
        <svg-icon type="mdi" :path="mdiCameraFlip"></svg-icon>
      </button>
      <button data-autotest="toggleVideo" @click="toggleVideo" class="pure-button pure-button-primary toggle-video">
        <svg-icon v-if="hasVideo" type="mdi" :path="mdiVideo"></svg-icon>
        <svg-icon v-else type="mdi" :path="mdiVideoOff"></svg-icon>
      </button>
      <button data-autotest="hangUp" @click="leave" class="pure-button pure-button-primary hangup">
        <svg-icon type="mdi" :path="mdiPhoneHangup"></svg-icon>
      </button>
      <button data-autotest="toggleMicrophone" @click="toggleMute" class="pure-button pure-button-primary toggle-mic">
        <svg-icon v-if="isMuted" type="mdi" :path="mdiMicrophoneOff"></svg-icon>
        <svg-icon v-else type="mdi" :path="mdiMicrophone"></svg-icon>
      </button>
    </div>
    <audio id="audio" ref="audio" autoplay></audio>
    <div data-autotest="localParticipantVideo" id="localStream" ref="localStream"></div>
    <div class="call-stage">
      <div v-for="participant in room.remoteParticipants" :key="participant.address">
        <div class="text">
          <img alt="" class="flag" v-if="getFlag(participant)" :src="getFlag(participant)" />
          <div data-autotest="displayedUser">{{ participant.name }}</div>
        </div>
        <div class="video">
          <video data-autotest="remoteParticipantVideo" :id="`video-${participant.address}`" autoplay playsinline></video>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="error" class="error">
    <div>{{ error }}</div>
    <button data-autotest="errorButton" class="pure-button pure-button-primary" @click="$router.push('/')">Start over</button>
  </div>
</template>

<style lang="less" scoped>
button {
  border-radius: 4px;
  height: 40px;
  margin: 5px;
}

.room {
  &:hover {
    .actions {
      display: block;
    }
  }
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: black;

  .text {
    line-height: 25px;
    position: absolute;
    left: 10px;
    top: 10px;
    font-size: 18px;
    z-index: 1;
    div {
      mix-blend-mode: difference;
      color: #fff;
      display: inline;
    }
    .flag {
      width: 20px;
      margin-right: 8px;
      border: solid #555 1px;
      margin-bottom: -1px;
    }
  }

  #localStream {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 1;

    ::v-deep(video) {
      width: 200px;
      object-fit: contain;
    }
  }

  .actions {
    display: none;
    position: absolute;
    bottom: 50px;
    z-index: 2;
    .hangup {
      color: white;
      background: red;
    }
  }

  .call-stage {
    width: 100%;
    height: 100%;
    align-items: center;
    display: flex;
    > div {
      flex: 1 1 0px;
      position: relative;
      text {
        position: absolute;
      }
      video {
        width: 100%;
        height: 100%;
      }
    }
  }

  &.mobile {
    .actions {
      bottom: 0px;
      opacity: 0.5;
    }

    #localStream {
      ::v-deep(video) {
        width: 120px;
        height: 160px;
        object-fit: cover;
      }
    }
  }
}

.error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #b9e4e1;
  button {
    margin: 30px;
  }
}
</style>

<script>
import { nextTick } from 'vue';
import { joinRoom } from 'vcs-realtime-sdk';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiVideo, mdiVideoOff, mdiMicrophone, mdiMicrophoneOff, mdiPhoneHangup, mdiCameraFlip } from '@mdi/js';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
  components: {
    SvgIcon
  },

  data() {
    return {
      room: null,
      isMuted: false,
      hasVideo: true,
      error: null,
      mdiVideo,
      mdiVideoOff,
      mdiMicrophone,
      mdiMicrophoneOff,
      mdiPhoneHangup,
      mdiCameraFlip
    };
  },

  computed: {
    mobile() {
      return this.isMobile();
    }
  },

  async mounted() {
    try {
      const room = this.$route.query?.id;

      if (!room) {
        // TODO: Show error page with link to home
        this.$router.push('/');
      }

      // Make sure config is loaded
      await this.$store.dispatch('fetchConfig');

      let token = this.$store.state.tokens[room];
      if (!token) {
        // Fetch room. This may be a navigation directly to this url.
        token = await this.$store.dispatch('fetchRoom', room);
      }
      if (!token) {
        // TODO: Show error page with link to home
        this.$router.push('/');
      }

      // Remember room
      this.$store.state.activeRoom = room;

      this.room = await joinRoom(token, {
        audio: this.$store.getters.useAudio,
        video: this.$store.getters.useVideo,
        hdVideo: this.$store.getters.useVideo,
        name: this.$store.state.user?.name,
        participantInfo: { country: this.$store.state.user?.country },
        host: this.$store.state.config.VCS_HOST
      });

      this.isMuted = this.room.isMuted();
      this.hasVideo = this.room.hasVideo();

      // nextTick allows the $refs below to be ready
      await nextTick();

      // Attach participant to a div. SDK will handle creating and updating video
      // element inside that div.
      this.room.localParticipant.attach(this.$refs.localStream);

      // Manually update the video elements srcObject. Another option would be
      // to use the participant.attach API and let the SDK maintain the video
      // elements like the local participant above.
      this.room.on('remoteStream', p => {
        const el = this.$refs.room.querySelector(`#video-${p.address}`);
        el && (el.srcObject = p.mediaStream);
      });

      this.room.on('remoteAudioStream', stream => {
        const el = this.$refs.room.querySelector('#audio');
        el && (el.srcObject = stream);
      });

      // Create new video element, or remove video element via v-for binding
      this.room.on('participantJoined', this.$forceUpdate);
      this.room.on('participantLeft', this.$forceUpdate);
    } catch (err) {
      console.log('Error loading room: ', err);
      this.error = err;
    }
  },

  methods: {
    getFlag(participant) {
      const country = participant?.participantInfo?.country;
      if (!country) {
        return null;
      }
      return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`;
    },
    async toggleVideo() {
      this.hasVideo = await this.room.toggleVideo();
    },
    async switchCamera() {
      await this.room.switchCamera();
    },
    toggleMute() {
      this.isMuted = this.room.toggleMute();
    },
    leave() {
      this.room.leave();
      setTimeout(() => {
        this.$router.push('/');
      }, 300);
    },
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  }
};
</script>
