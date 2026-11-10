import { useAuthStore } from '@org/api-client';
import { Roles } from '@org/enums';
import { createRouter, createWebHistory } from 'vue-router';

import type { Component } from 'vue';

type AuthKind = 'client' | 'employee';

declare module 'vue-router' {
  interface RouteMeta {
    auth?: AuthKind;
    roles?: Roles[];
    title?: string;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: (): Promise<Component> => import('@org/auth-page').then((m) => m.LoginPage),
      meta: { title: 'Вход' },
    },
    {
      path: '/register',
      name: 'Register',
      component: (): Promise<Component> => import('@org/auth-page').then((m) => m.RegisterPage),
      meta: { title: 'Регистрация' },
    },
    {
      path: '/portal',
      component: (): Promise<Component> => import('@org/app-layout').then((m) => m.ClientLayout),
      meta: { auth: 'client' },
      children: [
        {
          path: '',
          name: 'ClientProfile',
          component: (): Promise<Component> => import('@org/client-portal').then((m) => m.ProfilePage),
          meta: { auth: 'client', title: 'Профиль' },
        },
        {
          path: 'cards',
          name: 'ClientCards',
          component: (): Promise<Component> => import('@org/client-portal').then((m) => m.CardsPage),
          meta: { auth: 'client', title: 'Мои карты' },
        },
        {
          path: 'payments',
          name: 'ClientPayments',
          component: (): Promise<Component> => import('@org/client-portal').then((m) => m.PaymentsPage),
          meta: { auth: 'client', title: 'Платежи' },
        },
        {
          path: 'reports',
          name: 'ClientReports',
          component: (): Promise<Component> => import('@org/client-portal').then((m) => m.ReportsPage),
          meta: { auth: 'client', title: 'Обращения' },
        },
      ],
    },
    {
      path: '/admin',
      component: (): Promise<Component> => import('@org/app-layout').then((m) => m.AdminLayout),
      meta: { auth: 'employee' },
      children: [
        {
          path: '',
          name: 'AdminDashboard',
          component: (): Promise<Component> => import('@org/admin-portal').then((m) => m.DashboardPage),
          meta: {
            auth: 'employee',
            roles: [Roles.HEAD_OF_DEPARTMENT, Roles.SUPERADMIN],
            title: 'Обзор',
          },
        },
        {
          path: 'clients',
          name: 'AdminClients',
          component: (): Promise<Component> => import('@org/admin-portal').then((m) => m.ClientsPage),
          meta: {
            auth: 'employee',
            roles: [Roles.HEAD_OF_DEPARTMENT, Roles.SUPERADMIN],
            title: 'Клиенты',
          },
        },
        {
          path: 'employees',
          name: 'AdminEmployees',
          component: (): Promise<Component> => import('@org/admin-portal').then((m) => m.EmployeesPage),
          meta: { auth: 'employee', roles: [Roles.SUPERADMIN], title: 'Сотрудники' },
        },
        {
          path: 'cards',
          name: 'AdminCards',
          component: (): Promise<Component> => import('@org/admin-portal').then((m) => m.CardsPage),
          meta: { auth: 'employee', title: 'Карты' },
        },
        {
          path: 'payments',
          name: 'AdminPayments',
          component: (): Promise<Component> => import('@org/admin-portal').then((m) => m.PaymentsPage),
          meta: { auth: 'employee', title: 'Платежи' },
        },
        {
          path: 'reports',
          name: 'AdminReports',
          component: (): Promise<Component> => import('@org/admin-portal').then((m) => m.ReportsPage),
          meta: {
            auth: 'employee',
            roles: [Roles.HEAD_OF_DEPARTMENT, Roles.SUPERADMIN],
            title: 'Обращения',
          },
        },
        {
          path: 'themes',
          name: 'AdminThemes',
          component: (): Promise<Component> => import('@org/admin-portal').then((m) => m.ThemesPage),
          meta: {
            auth: 'employee',
            roles: [Roles.HEAD_OF_DEPARTMENT, Roles.SUPERADMIN],
            title: 'Темы',
          },
        },
        {
          path: 'logs',
          name: 'AdminLogs',
          component: (): Promise<Component> => import('@org/admin-portal').then((m) => m.LogsPage),
          meta: {
            auth: 'employee',
            roles: [Roles.HEAD_OF_DEPARTMENT, Roles.SUPERADMIN],
            title: 'Журнал',
          },
        },
        {
          path: 'settings',
          name: 'AdminSettings',
          component: (): Promise<Component> => import('@org/admin-portal').then((m) => m.SettingsPage),
          meta: { auth: 'employee', title: 'Настройки' },
        },
      ],
    },
    {
      path: '/',
      redirect: '/portal',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/portal',
    },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  await auth.init();

  if (to.meta.auth === undefined) {
    if (auth.isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
      return auth.homeRoute;
    }

    return true;
  }

  if (!auth.isAuthenticated) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    };
  }

  if (auth.userType !== to.meta.auth) {
    return auth.homeRoute;
  }

  if (to.meta.roles && to.meta.roles.length > 0) {
    const role = auth.role;

    if (!role || !to.meta.roles.includes(role)) {
      if (role === Roles.OPERATIONIST) return '/admin/cards';
      if (role === Roles.HEAD_OF_DEPARTMENT || role === Roles.SUPERADMIN) return '/admin';

      return '/admin/settings';
    }
  }

  return true;
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · Банк` : 'Банк';
});

export default router;
