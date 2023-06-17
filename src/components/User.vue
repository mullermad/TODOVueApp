<script setup>
import gql from "graphql-tag";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { RouterLink } from "vue-router";
import { reactive } from "vue";


const query = gql`
  query MyQuery {
    user {
      id
      name
      last_seen
      created_at
    }
  }
`;

const { error, result, loading } = useQuery(query);

//add newUser

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $last_seen: timestamptz!) {
    insert_user_one(object: { name: $name, last_seen: $last_seen }) {
      id
      name
      last_seen
      created_at
    }
  }
`;

const { mutate: createUser, loading: createLoading } = useMutation(CREATE_USER);

const newUser = reactive({
  name: "",
  last_seen: "",
});
const onCreateUser = async () => {
  try {
    const result = await createUser({
      name: newUser.name,
      last_seen: newUser.last_seen,
    });
    console.log(result.data.insert_user_one); // log new user data
    newUser.name = "";
    newUser.last_seen = "";
  } catch (error) {
    console.error(error);
  }
};

//updatin user
const EDIT_USER = gql`
  mutation EditUser($id: Int!, $name: String!, $lastSeen: timestamptz!) {
    update_user_by_pk(
      pk_columns: { id: $id }
      _set: { name: $name, last_seen: $lastSeen }
    ) {
      id
      name
      last_seen
      created_at
    }
  }
`;

const editedUser = reactive({
  id: null,
  name: "",
  last_seen: "",
});

const { mutate: editUser, loading: editLoading } = useMutation(EDIT_USER);
const onEditUser = async () => {
  try {
    const result = await editUser({
      id: editedUser.id,
      name: editedUser.name,
      lastSeen: editedUser.last_seen,
    });
    console.log(result.data.update_user_by_pk); // log updated user data
    editedUser.id = null;
    editedUser.name = "";
    editedUser.last_seen = "";
  } catch (error) {
    console.error(error);
  }
};

//delete user
const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    delete_user_by_pk(id: $id) {
      id
    }
  }
`;


const { mutate: deleteUser, loading: deleteLoading } = useMutation(DELETE_USER);
const onDeleteUser = async (id) => {
  try {
    const result = await deleteUser({ id });
    console.log(result.data.delete_user_by_pk);
  } catch (error) {
    console.error(error);
  }
};





</script>
<template>
  <div class="flex flex-col items-center">
    <div class="text-4xl mt-12 mb-8">Users</div>
    <div class="bg-gray-100 p-4 w-full md:w-3/4 lg:w-1/2">
      <!-- New User Form -->
      <form @submit.prevent="onCreateUser" class="mb-8">
        <div class="flex flex-col mb-4">
          <label for="new-name" class="text-gray-800 font-bold mb-2"
            >Name</label
          >
          <input
            type="text"
            id="new-name"
            v-model="newUser.name"
            class="border border-gray-400 p-2 rounded-lg"
          />
        </div>
        <div class="flex flex-col mb-4">
          <label for="new-last_seen" class="text-gray-800 font-bold mb-2"
            >Last seen</label
          >
          <input
            type="text"
            id="new-last_seen"
            v-model="newUser.last_seen"
            class="border border-gray-400 p-2 rounded-lg"
          />
        </div>
        <button
          :disabled="createLoading"
          @click="onCreateUser"
          class="bg-green-600 text-white py-2 px-4 rounded-lg"
        >
          Create User
        </button>
      </form>
      <!-- User List -->
      <div
        v-for="usr in result.user"
        :key="usr.id"
        class="bg-white rounded-lg shadow-lg p-4 mb-8"
       >
        <div class="text-gray-500 mb-2">ID: {{ usr.id }}</div>
        <div class="text-gray-800 font-bold text-xl mb-2">{{ usr.name }}</div>
        <div class="text-gray-500 mb-2">Last seen: {{ usr.last_seen }}</div>
        <div class="text-gray-500 mb-2">Created at: {{ usr.created_at }}</div>
        <div
          v-if="editLoading && usr.id === editedUser.id"
          class="text-gray-500"
        >
          Saving...
        </div>
        <div v-else-if="usr.id === editedUser.id" class="flex flex-col">
          <div class="flex flex-col mb-4">
            <label for="name" class="text-gray-800 font-bold mb-2">Name</label>
            <input
              type="text"
              id="name"
              v-model="editedUser.name"
              class="border border-gray-400 p-2 rounded-lg"
            />
          </div>
          <div class="flex flex-col mb-4">
            <label for="last_seen" class="text-gray-800 font-bold mb-2"
              >Last seen</label
            >
            <input
              type="text"
              id="last_seen"
              v-model="editedUser.last_seen"
              class="border border-gray-400 p-2 rounded-lg"
            />
          </div>
          <button
            :disabled="editLoading"
            @click="onEditUser"
            class="bg-green-600 text-white py-2 px-4 rounded-lg"
          >
            Save
          </button>
        </div>
        <div v-else class="flex justify-end">
          <button
            @click="
              editedUser.id = usr.id;
              editedUser.name = usr.name;
              editedUser.last_seen = usr.last_seen;
            "
            class="bg-blue-600 text-white py-2 px-4 rounded-lg mr-2"
          >
            Edit
          </button>
          <button
            @click="onDeleteUser(usr.id)"
            class="bg-red-600 text-white py-2 px-4 rounded-lg mr-2"
            :disabled="deleteLoading"
          >
            Delete
          </button>
          <RouterLink
            :to="{ name: 'Task', params: { userId: usr.id } }"
            class="bg-green-600 text-white py-2 px-4 rounded-lg"
            >View Todo</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>
