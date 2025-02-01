import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import HomePageView from "../views/HomePageView.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", name: "default", component: HomePageView },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
