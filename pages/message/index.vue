<template>
  <v-container>
    <v-col cols="12" class="pa-0">
      <h2 class="secondary--text text-decoration-underline my-3">
        Message Management
      </h2>
    </v-col>

    <travisor-data-table
      :title="'Message'"
      :items="messagesWithIds"
      :headers="headers"
      :isLoading="isLoading"
      @view-click="handleMessageViewClick"
    ></travisor-data-table>
  </v-container>
</template>

<script>
import { useMessageStore } from "~/store/message";
import { mapState } from "pinia";

export default {
  name: "UserPage",
  data() {
    return {
      messageStore: useMessageStore(),
      headers: [
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Phone", value: "phone" },
        { text: "Email", value: "email" },
        { text: "Message", value: "truncatedMessage" },
      ],
      isLoading: true,
    };
  },

  computed: {
    ...mapState(useMessageStore, {
      messages: "messages",
      message: "message",
    }),

    messagesWithIds() {
      return this.messages.map((message, index) => ({
        ...message,
        id: index + 1,
        truncatedMessage: this.truncateText(message.message, 100),
      }));
    },
  },

  mounted() {
    this.getMessages();
  },

  methods: {
    async getMessages() {
      try {
        await this.messageStore.fetchMessages();
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        this.isLoading = false;
      }
    },

    truncateText(text, length) {
      return text.length > length ? text.slice(0, length) + "..." : text;
    },

    handleMessageViewClick(id) {
      this.$router.push({
        name: "message-show",
        params: { id },
        query: { messageId: id },
      });
    },

    handleError(error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        this.$swal.fire({
          title: "Error!",
          text: error.response.data.message,
          icon: "error",
        });
      } else {
        console.error("Unexpected error:", error);
      }
    },
  },
};
</script>
