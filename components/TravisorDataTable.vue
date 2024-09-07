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
          <!-- Profile Picture Slot -->
          <template v-slot:item.profile_picture="{ item }">
            <v-img
              :src="item.profile_picture"
              max-height="35"
              max-width="35"
              alt="Profile Picture"
              class="rounded-circle"
            ></v-img>
          </template>

          <!-- Status Slot -->
          <template v-slot:item.active="{ item }">
            <div class="text-center" v-show="showDeactivate || showActivate">
              <v-chip
                class="white--text pa-0 d-flex justify-center align-center"
                label
                color="green"
                style="width: 100px"
                @click="onDeactivateClick(item.global_id)"
                v-if="item.active == 1"
              >
                Activated
              </v-chip>
              <v-chip
                class="white--text pa-0 d-flex justify-center align-center"
                label
                color="red"
                style="width: 100px"
                @click="onActivateClick(item.global_id)"
                v-else
              >
                Deactivated
              </v-chip>
            </div>
          </template>

          <!-- Actions Slot -->
          <template v-slot:item.actions="{ item }">
            <v-tooltip bottom v-if="showView">
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  class="text-center pa-0 px-1"
                  label
                  color="cyan"
                  style="height: 35px"
                >
                  <v-icon
                    @click="onViewClick(item.global_id)"
                    class="mx-1"
                    color="white"
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-eye
                  </v-icon>
                </v-chip>
              </template>
              <span>View</span>
            </v-tooltip>

            <v-tooltip bottom v-if="showEdit">
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  class="text-center pa-0 px-1"
                  label
                  color="orange"
                  style="height: 35px"
                >
                  <v-icon
                    @click="onEditClick(item.global_id)"
                    class="mx-1"
                    color="white"
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-pencil
                  </v-icon>
                </v-chip>
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
    showDeactivate() {
      return !!this.$listeners["deactivate-click"];
    },
    showActivate() {
      return !!this.$listeners["activate-click"];
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
        this.$set(this.items, index, { ...this.items[index], loading: true });
        try {
          this.$emit(event, id);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          this.$set(this.items, index, {
            ...this.items[index],
            active: status,
            loading: false,
          });
        } catch (error) {
          console.error("Error updating item:", error);
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
