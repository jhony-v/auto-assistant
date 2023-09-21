<script setup>
import { messages, input } from "./store";
import { pubsub } from "./data/v1/engine";
import "./data/v1/broadcast";

async function onSubmit() {
  // pubsub.emit('MESSAGE_SEND_BY_OWN',input.value);
  // pubsub.emit('MESSAGE_SEND',input.value);
}
</script>
<template>
  <div>
    <form @submit.prevent="onSubmit">
      <textarea
        rows="5"
        placeholder="tell me something"
        v-model="input.message"
      />
      <button type="submit" autofocus>send</button>
    </form>

    <div>
      <article
        v-for="message in messages"
        :key="message.id"
        :data-own="message.own"
      >
        {{ message.message }}
      </article>
    </div>
  </div>
</template>
<style scoped></style>
