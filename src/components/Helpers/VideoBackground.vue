<template>
  <div class="video-background">
    <video autoplay muted loop class="video-background__video">
      <source src="~assets/video-background.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<script>
export default {
  name: "VideoBackground",
};
</script>

<style scoped>
.video-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1; /* Ensure the video is behind other content */
}

.video-background__video {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensure the video covers the entire background */
}
</style>
