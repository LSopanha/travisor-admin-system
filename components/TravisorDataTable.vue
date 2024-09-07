<template>
  <v-container class="pa-0 mb-16" fluid>
    <v-col cols="12" class="pa-0 d-flex justify-end">
      <div class="my-2">
        <v-btn
          class="white text-capitalize font-weight-bold py-4"
          v-show="showAdd"
          @click="onAddClick"
          small
          elevation="0"
        >
          <v-icon color="primary" class="mr-1" dark> mdi-plus-circle </v-icon>
          <span class="font-size-16">Add {{ title }}</span>
        </v-btn>
      </div>
    </v-col>

    <div>
      <v-card elevation="2" class="pa-0 rounded-xl" outlined>
        <v-data-table
          :headers="headersWithActions"
          :items="items"
          loading-text="Loading... Please wait."
          item-key="id"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-tooltip bottom v-if="showView">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click="onViewClick(item.global_id)"
                  class="mx-1"
                  color="grey"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-eye
                </v-icon>
              </template>
              <span>View</span>
            </v-tooltip>

            <v-tooltip bottom v-if="showActivate && item.active === 1">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click="onDeactivateClick(item.global_id)"
                  class="mx-1"
                  :color="item.loading ? 'grey' : 'green'"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-account-check
                </v-icon>
              </template>
              <span>Deactivate</span>
            </v-tooltip>

            <v-tooltip bottom v-if="showDeactivate && item.active === 0">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click="onActivateClick(item.global_id)"
                  class="mx-1"
                  :color="item.loading ? 'grey' : 'red'"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-account-off
                </v-icon>
              </template>
              <span>Activate</span>
            </v-tooltip>

            <v-tooltip bottom v-if="showEdit">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click="onEditClick(item.global_id)"
                  class="mx-1"
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-pencil
                </v-icon>
              </template>
              <span>Edit</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </v-container>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
  },
  computed: {
    headersWithActions() {
      return [
        ...this.headers,
        { text: "Actions", value: "actions", sortable: false },
      ];
    },
    showAdd() {
      return !!this.$listeners["add-click"];
    },
    showView() {
      return !!this.$listeners["view-click"];
    },
    showEdit() {
      return !!this.$listeners["edit-click"];
    },
    showInvoice() {
      return !!this.$listeners["invoice-click"];
    },
    showDeactivate() {
      return !!this.$listeners["deactivate-click"];
    },
    showActivate() {
      return !!this.$listeners["activate-click"];
    },
    showBan() {
      return !!this.$listeners["ban-click"];
    },
    showAuthorize() {
      return !!this.$listeners["authorize-click"];
    },
  },
  methods: {
    onAddClick() {
      this.$emit("add-click");
    },
    onViewClick(id) {
      this.$emit("view-click", id);
    },
    onEditClick(id) {
      this.$emit("edit-click", id);
    },
    async onDeactivateClick(id) {
      this.updateItemStatus(id, 0, "deactivate-click");
    },
    async onActivateClick(id) {
      this.updateItemStatus(id, 1, "activate-click");
    },
    async updateItemStatus(id, status, event) {
      const index = this.items.findIndex((item) => item.global_id === id);
      if (index !== -1) {
        // Set loading state to true
        this.$set(this.items, index, { ...this.items[index], loading: true });
        try {
          this.$emit(event, id);
          // Simulate a delay for demonstration purposes
          await new Promise((resolve) => setTimeout(resolve, 1000));
          // Update the item with the new status
          this.$set(this.items, index, {
            ...this.items[index],
            active: status,
            loading: false,
          });
        } catch (error) {
          console.error("Error updating item:", error);
          // Reset loading state in case of an error
          this.$set(this.items, index, {
            ...this.items[index],
            loading: false,
          });
        }
      }
    },
  },
  watch: {
    items: {
      handler(newItems) {
        console.log("Items updated:", newItems);
      },
      deep: true,
    },
  },
};
</script>
