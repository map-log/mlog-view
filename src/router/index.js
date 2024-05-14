import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LogInView from "@/views/LogInView.vue";
import UserInfoView from "@/views/UserInfoView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LogInView,
    },
    {
      path: "/userInfo",
      name: "userInfo",
      component: UserInfoView,
    },
  ],
});

export default router;
