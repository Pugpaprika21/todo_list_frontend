<script>
import IconTodoHomeTabsBtnEdit from "./icons/IconTodoHomeTabsBtnEdit.vue";
import IconTodoHomeTabsBtnDelete from "./icons/IconTodoHomeTabsBtnDelete.vue";
import TodoUpdateModal from "./TodoUpdateModal.vue";
export default {
  name: "TodoHomeTabsComponent",
  components: {
    IconTodoHomeTabsBtnEdit,
    IconTodoHomeTabsBtnDelete,
    TodoUpdateModal,
  },
  data() {
    return {
      form: {
        todoText: "",
        todos: [],
        todoStatusPending: [],
        todoStatusSuccess: [],
      },
      components: {
        openModal: false,
      },
    };
  },
  mounted() {
    this.onReloadTodoListTable();
  },
  methods: {
    onReloadTodoListTable: function () {
      this.form.todoStatusPending = [];
      this.form.todoStatusSuccess = [];

      this.$axios
        .get(`${import.meta.env.VITE_API_ENDPOINT}getTodos`)
        .then((res) => {
          if (res.status == 200) {
            res.data.data.forEach((data) => {
              if (data.todo_status == "pending") {
                this.form.todoStatusPending.push(data);
              } else if (data.todo_status == "success") {
                this.form.todoStatusSuccess.push(data);
              }
            });

            this.form.todos = res.data.data;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    onUpdateTodo: function (todo) {
      let todoText = "";
      if (this.form.todoText == "") {
        todoText = todo.todo_text;
      } else {
        todoText = this.form.todoText;
      }

      this.$axios
        .put(`${import.meta.env.VITE_API_ENDPOINT}updateTodo/${todo.id}`, {
          todoText: todoText,
        })
        .then(() => {
          this.form.todoText = "";
          this.onReloadTodoListTable();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    onBtnDeleteTodo: function (todo) {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$axios
              .delete(
                `${import.meta.env.VITE_API_ENDPOINT}deleteTodo/${todo.id}`
              )
              .then((res) => {
                if (res.status == 200) {
                  this.$swal
                    .fire({
                      title: "Deleted!",
                      text: "Your file has been deleted.",
                      icon: "success",
                      timer: 1500,
                    })
                    .then(() => {
                      this.onReloadTodoListTable();
                      this.$router.replace({ path: "/todohome" });
                    });
                }
              })
              .catch((err) => {
                console.error(err);
              });
          }
        });
    },
  },
};
</script>

<template>
  <div class="todo-tabs">
    <nav>
      <div class="nav nav-underline" id="nav-tab" role="tablist">
        <button
          class="nav-link active"
          id="todo-all-tab"
          data-bs-toggle="tab"
          data-bs-target="#todo-all"
          type="button"
          role="tab"
          aria-controls="todo-all"
          aria-selected="true"
        >
          todos ({{ form.todos.length }}.)
        </button>
        <button
          class="nav-link"
          id="nav-pending-tab"
          data-bs-toggle="tab"
          data-bs-target="#nav-pending"
          type="button"
          role="tab"
          aria-controls="nav-pending"
          aria-selected="false"
        >
          pending ({{ form.todoStatusPending.length }}.)
        </button>
        <button
          class="nav-link"
          id="nav-inspect-tab"
          data-bs-toggle="tab"
          data-bs-target="#nav-inspect"
          type="button"
          role="tab"
          aria-controls="nav-inspect"
          aria-selected="false"
        >
          success ({{ form.todoStatusSuccess.length }}.)
        </button>
      </div>
    </nav>
    <div class="tab-content mt-3" id="nav-tabContent">
      <div
        class="tab-pane fade show active"
        id="todo-all"
        role="tabpanel"
        aria-labelledby="todo-all-tab"
        tabindex="0"
      >
        <div class="table-todo-all">
          <div class="table-responsive">
            <table class="table table-sm text-center">
              <thead>
                <tr>
                  <td>#</td>
                  <td>todo</td>
                  <td>status</td>
                  <td>created</td>
                  <td>action</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(todo, index) in form.todos" :key="todo.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ todo.todo_text }}</td>
                  <td
                    v-if="todo.todo_status == 'pending'"
                    style="color: #ffffff; background-color: #4f77da"
                  >
                    {{ todo.todo_status }}
                  </td>
                  <td
                    v-else-if="todo.todo_status == 'success'"
                    style="color: #ffffff; background-color: #45cb59"
                  >
                    {{ todo.todo_status }}
                  </td>
                  <td>{{ todo.created_at }}</td>
                  <td>
                    <div
                      class="btn-group btn-group-sm btn-group-todo"
                      role="group"
                    >
                      <button
                      v-if="todo.todo_status == 'pending'"
                        type="button"
                        class="btn btn-outline-primary"
                        data-bs-toggle="modal"
                        :data-bs-target="'#modal-edit-' + todo.id"
                      >
                        <IconTodoHomeTabsBtnEdit />
                      </button>

                      <div
                        class="modal fade"
                        :id="'modal-edit-' + todo.id"
                        tabindex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div class="modal-dialog">
                          <div class="modal-content">
                            <form @submit.prevent="onUpdateTodo(todo)">
                              <div class="modal-header">
                                <h1
                                  class="modal-title fs-5"
                                  id="exampleModalLabel"
                                >
                                  update todo
                                </h1>
                                <button
                                  type="button"
                                  class="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div class="modal-body">
                                <input
                                  type="text"
                                  class="form-control"
                                  :placeholder="todo.todo_text"
                                  :value="todo.todo_text"
                                  @input="form.todoText = $event.target.value"
                                />
                              </div>
                              <div class="modal-footer">
                                <button
                                  type="button"
                                  class="btn btn-secondary"
                                  data-bs-dismiss="modal"
                                >
                                  Close
                                </button>
                                <button type="submit" class="btn btn-primary">
                                  Save
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        class="btn btn-outline-danger"
                        @click="onBtnDeleteTodo(todo)"
                      >
                        <IconTodoHomeTabsBtnDelete />
                      </button>



                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="nav-pending"
        role="tabpanel"
        aria-labelledby="nav-pending-tab"
        tabindex="0"
      >
        <table class="table table-sm text-center">
          <thead>
            <tr>
              <td>#</td>
              <td>todo</td>
              <td>status</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(todo, index) in form.todoStatusPending" :key="todo.id">
              <td>{{ index + 1 }}</td>
              <td>{{ todo.todo_text }}</td>
              <td>{{ todo.todo_status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="tab-pane fade"
        id="nav-inspect"
        role="tabpanel"
        aria-labelledby="nav-inspect-tab"
        tabindex="0"
      >
        <table class="table table-sm text-center">
          <thead>
            <tr>
              <td>#</td>
              <td>todo</td>
              <td>status</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(todo, index) in form.todoStatusSuccess" :key="todo.id">
              <td>{{ index + 1 }}</td>
              <td>{{ todo.todo_text }}</td>
              <td>{{ todo.todo_status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn,
.form-control,
.modal-content {
  border-radius: 0px;
}
</style>