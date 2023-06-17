<script setup>
import gql from "graphql-tag";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const query = gql`
  query MyQuery($userId: Int!) {
    todos(where: { todos_user: { id: { _eq: $userId } } }) {
      id
      title
      is_completed
    }
  }
`;

const mutationAddTodo = gql`
  mutation MyMutation(
    $title: String!
    $is_completed: Boolean!
    $user_id: Int!
  ) {
    insert_todos_one(
      object: { title: $title, is_completed: $is_completed, user_id: $user_id }
    ) {
      id
      title
      is_completed
    }
  }
`;
const mutationEditTodo = gql`
  mutation MyMutation($id: Int!, $title: String!, $is_completed: Boolean!) {
    update_todos_by_pk(
      pk_columns: { id: $id }
      _set: { title: $title, is_completed: $is_completed }
    ) {
      id
      title
      is_completed
    }
  }
`;
const mutationDeleteTodo = gql`
  mutation MyMutation($id: Int!) {
    delete_todos_by_pk(id: $id) {
      id
      title
      is_completed
    }
  }
`;

const { userId } = useRoute().params;
const { push } = useRouter();


const { result: todosResult, loading: todosLoading } = useQuery(query, {
  userId: parseInt(userId),
});

const { mutate: addTodo, loading: addLoading } = useMutation(mutationAddTodo, {
  variables: { title: "", is_completed: false, user_id: parseInt(userId) },
});

const { mutate: editTodo, loading: editLoading } = useMutation(mutationEditTodo, {
  variables: { id: null, title: "", is_completed: false },
});

const { mutate: deleteTodo, loading: deleteLoading } = useMutation(
  mutationDeleteTodo,
  {
    variables: { id: null },
  }
);

const newTodo = ref({
  title: "",
  is_completed: false,
});

const editedTodo = ref({
  id: null,
  title: "",
  is_completed: false,
});

const todos = computed(() => {
  if (todosResult.value) {
    return todosResult.value.todos;
  }
  return [];
});

function isEditing(todo) {
  return editedTodo.value.id === todo.id;
}

function onAdd() {
  addTodo({ title: newTodo.value.title, is_completed: newTodo.value.is_completed })
    .then(() => {
      newTodo.value.title = "";
      newTodo.value.is_completed = false;
    })
    .catch((err) => {
      console.error(err);
    });
}

function onEdit(todo) {
  editedTodo.value.id = todo.id;
  editedTodo.value.title = todo.title;
  editedTodo.value.is_completed = todo.is_completed;
}

function onEditSubmit(todo) {
  editTodo({
    id: todo.id,
    title: editedTodo.value.title,
    is_completed: editedTodo.value.is_completed,
  })
    .then(() => {
      editedTodo.value.id = null;
      editedTodo.value.title = "";
      editedTodo.value.is_completed = false;
    })
    .catch((err) => {
      console.error(err);
    });
}

function onCancelEdit() {
  editedTodo.value.id = null;
  editedTodo.value.title = "";
  editedTodo.value.is_completed = false;
}

function onDelete(id) {
  deleteTodo({ id })
    .then(() => {
      console.log("Todo deleted successfully");
    })
    .catch((err) => {
      console.error(err);
    });
}
</script>

<template>
  <div class="w-[60%] ml-[15%]">
    <h1 class="text-2xl font-bold m-4 ml-[20%]">Todos</h1>
    <div class="mb-4">
      <label class="font-bold block">New Todo:</label>
      <div class="flex items-center">
        <input v-model="newTodo.title" class="border rounded-lg py-2 px-4 w-full mr-2 " placeholder="Enter a new Todo" />
        <div class="flex items-center">
          <label for="is_completed" class="mr-2">Is_Completed</label>
          <input v-model="newTodo.is_completed" type="checkbox" id="is_completed" class="form-checkbox h-5 w-5 text-green-600" />
        </div>
        <button
          @click="onAdd"
          :disabled="addLoading || !newTodo.title"
          class="bg-green-600 text-white py-2 px-4 rounded-lg ml-2"
        >
          Add
        </button>
      </div>
    </div>
    <div v-if="todosLoading" class="text-center">Loading...</div>
    <div v-else>
      <div v-if="todos.length === 0">No Todos Found.</div>
      <div v-else>
        <ul>
          <li v-for="todo in todos" :key="todo.id" class="bg-white rounded-lg shadow-md mb-2 p-4">
            <div v-if="!isEditing(todo)">
              <div class="font-bold">ID: {{ todo.id }}</div>
              <div class="font-bold">Todo: {{ todo.title }}</div>
              <div class="font-bold">Is_Completed: <span v-if="todo.is_completed" class="text-green-600">Yes</span><span v-else class="text-red-600">No</span></div>
              <div class="flex justify-end mt-2">
                <button
                  @click="onEdit(todo)"
                  class="bg-blue-600 text-white py-2 px-4 rounded-lg mr-2"
                >
                  Edit
                </button>
                <button
                  @click="onDelete(todo.id)"
                  class="bg-red-600 text-white py-2 px-4 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
            <div v-else>
              <div class="font-bold">ID: {{ todo.id }}</div>
              <div class="flex items-center">
                <input v-model="editedTodo.title" class="border rounded-lg py-2 px-4 w-full mr-2" />
                <div class="flex items-center">
                  <label for="edited_is_completed" class="mr-2">Is_Completed</label>
                  <input v-model="editedTodo.is_completed" type="checkbox" id="edited_is_completed" class="form-checkbox h-5 w-5 text-green-600" />
                </div>
                <button
                  @click="onEditSubmit(todo)"
                  class="bg-green-600 text-white py-2 px-4 rounded-lg mr-2"
                >
                  Save
                </button>
                <button
                  @click="onCancelEdit()"
                  class="bg-gray-600 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>