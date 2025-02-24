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
import SalariesView from "../views/SalariesView.vue";
import AddSalary from "../views/AddSalary.vue";
import UpdateSalaryView from "../views/UpdateSalaryView.vue";

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
  { path: "/salaries", name: "salaires", component: SalariesView },
  { path: "/add-salary", name: "addSalary", component: AddSalary },
  {
    path: "/update-salary/:id",
    name: "updateSalary",
    component: UpdateSalaryView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
