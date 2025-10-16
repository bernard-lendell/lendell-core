<template>
  <div></div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "NotifyMessage",
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  created() {
    this.$q.notify({
      progress: true,
      type: this.type,
      message: this.message.toUpperCase(),
    });
  },
});
</script>
