import { defineStore } from 'pinia';

export const useMessageStore = defineStore('message', {
   state: () => ({
      messages: [],
      message: {},
   }),

   actions: {
      setMessages(messages) {
         this.messages = messages;
      },
      setMessage(message) {
         this.message = message;
      },
      async fetchMessages() {
         const response = await this.$axios.get('messages');
         this.setMessages(response.data.data); 
         return response;
      },
      async fetchMessageById(id) {
         const response = await this.$axios.get(`messages/${id}`);
         this.setMessage(response.data.data);
         return response;
      },
  },
});