import { createRouter, createWebHistory } from "vue-router";
import User from "./components/User.vue";
import Task from "./components/Task.vue";

const routes = [
  {
    path: "/",
    name: "User",
    component: User,
  },
  {
    path: "/Task/:userId", // include dynamic segment for userId parameter
    name: "Task",
    component: Task,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
