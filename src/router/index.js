import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LogInView from "@/views/LogInView.vue";
import UserInfoView from "@/views/UserInfoView.vue";
import JoinView from "@/views/JoinView.vue";
import FindPassword from "@/views/FindPassword.vue";

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
    {
      path: "/join",
      name: "join",
      component: JoinView,
    },
    {
      path: "/forgot-password",
      name: "forgotPassword",
      component: FindPassword, // 새로 추가한 페이지
    },
  ],
});

export default router;
