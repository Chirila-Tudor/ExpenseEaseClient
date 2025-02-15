import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import LoginView from "../views/LoginView.vue";
import NewUser from "../views/NewUser.vue";
import ChangePassoword from "../views/ChangePassoword.vue";
import ExpenseView from "../views/ExpenseView.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", name: "default", component: LoginView },
  { path: "/new-user", name: "newUser", component: NewUser },
  {
    path: "/change-password",
    name: "changePassword",
    component: ChangePassoword,
  },
  { path: "/expenses", name: "expenses", component: ExpenseView },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
