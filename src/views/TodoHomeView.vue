<script>
import TodoHomeTabsComponent from "../components/TodoHomeTabsComponent.vue";
export default {
  name: "TodoHomeView",
  components: {
    TodoHomeTabsComponent,
  },
  data() {
    return {
      form: {
        todoText: "",
      },
    };
  },

  methods: {
    onBtnSaveTodo: function () {
      if (this.form.todoText.trim() == "") {
        this.$swal.fire({
          title: "The Internet?",
          text: "That thing is still around?",
          icon: "question",
        });
        this.$router.replace({path: "/todohome"});
        return;
      }

      this.$axios
        .post(`${import.meta.env.VITE_API_ENDPOINT}createTodo`, {
          "todoText": this.form.todoText
        })
        .then((res) => {
          if (res.status == 200) {
            this.form.todoText = "";
            this.$refs.refTodoHomeTabsComponent.onReloadTodoListTable();
            this.$router.replace({path: "/todohome"});
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="home-view">
      <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card shadow-sm p-3 mb-5 rounded" style="width: 50rem">
          <div class="card-body card-todo-main">

            <div class="input-group">
              <input
                type="text"
                class="form-control"
                placeholder="Create to here!!"
                v-model="form.todoText"
                
              />

              <button
                class="btn btn-secondary"
                type="button"
                id="button-addon2"
                @click="onBtnSaveTodo()"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-plus mb-1"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
                  />
                </svg>
              </button>
            </div>
            <!-- input -->
            <br />
            <TodoHomeTabsComponent ref="refTodoHomeTabsComponent" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>


button, .card-todo-main, .form-control {
  border-radius: 0px;
}
</style>