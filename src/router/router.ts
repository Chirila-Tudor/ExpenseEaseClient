import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import LoginView from "../views/LoginView.vue";
import NewUser from "../views/NewUser.vue";
import ChangePassword from "../views/ChangePassword.vue";
import ExpenseView from "../views/ExpenseView.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import VerifySecurityCode from "../views/VerifySecurityCode.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", name: "default", component: LoginView },
  { path: "/new-user", name: "newUser", component: NewUser },
  {
    path: "/change-password",
    name: "changePassword",
    component: ChangePassword,
  },
  { path: "/expenses", name: "expenses", component: ExpenseView },
  { path: "/recovery", name: "recovery", component: ForgotPassword },
  { path: "/verify-code", name: "verify", component: VerifySecurityCode },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
