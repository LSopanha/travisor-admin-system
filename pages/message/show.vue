<template>
  <v-container class="my-10">
    <!-- Back button -->
    <v-card-title class="justify-end px-0">
      <div>
        <v-btn color="black" class="white--text" @click="$router.go(-1)"
          >Back</v-btn
        >
      </div>
    </v-card-title>

    <!-- Email style message -->
    <v-card class="pa-6 rounded-xl" v-if="message">
      <!-- Message Header (like the email header) -->
      <v-row class="mb-4">
        <v-col cols="12">
          <div class="d-flex justify-space-between align-center">
            <div>
              <span class="font-weight-bold text-subtitle-1">From:</span>
              <span>{{ message.name }} ({{ message.email }})</span>
            </div>
            <div>
              <span>Phone:</span>
              <span>{{ message.phone }} </span>
            </div>
            <v-chip color="info" class="white--text">{{
              formatDate(message.created_at)
            }}</v-chip>
          </div>
        </v-col>
      </v-row>

      <!-- Message Details -->
      <v-divider></v-divider>

      <!-- Message Body -->
      <v-row class="mt-4">
        <v-col cols="12">
          <h3 class="text-h6 font-weight-bold mb-4">Message</h3>
          <p>{{ message.message }}</p>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { useMessageStore } from "~/store/message";
import { mapState } from "pinia";

export default {
  data() {
    return {
      messageStore: useMessageStore(),
    };
  },

  computed: {
    ...mapState(useMessageStore, {
      message: "message",
    }),
  },

  created() {
    const messageId = this.$route.query.messageId;
    if (messageId) {
      this.fetchMessageDetails(messageId);
    }
  },

  methods: {
    async fetchMessageDetails(id) {
      try {
        await this.messageStore.fetchMessageById(id);
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    },

    formatDate(date) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(date).toLocaleDateString(undefined, options);
    },
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 16px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

.font-weight-bold {
  font-weight: bold;
}

.text-h6 {
  font-size: 1.25rem;
}

.text-subtitle-1 {
  font-size: 1rem;
}

.v-divider {
  margin: 1rem 0;
}
</style>
