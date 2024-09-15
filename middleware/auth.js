import { useAuthStore } from '~/store/auth';
import Cookies from 'js-cookie';

export default async function ({ app, redirect, route }) {
   const authStore = useAuthStore(app.$pinia);

   // update isAuthenticated based on token in cookies
   const token = Cookies.get('token');
   if (!token) {
      authStore.clearAdminSession();
      authStore.clearRedirectRoute();
   }
   else {
      // check if the admin is authenticated or not
      const fetchResult = await authStore.fetchAdmin();
      if (!fetchResult) {
         authStore.clearAdminSession();
      }
   }
   
   // check if there is no token and the current route is not '/login'
   if (authStore.isAuthenticated === false && route.fullPath !== '/login') {
      authStore.setRedirectRoute(route.fullPath);
      return redirect('/login');
   }

   // if there is a token and a redirect route is set, redirect to that route
   if (authStore.isAuthenticated === true && authStore.getRedirectRoute) {
      const redirectRoute = authStore.getRedirectRoute;
      // authStore.clearRedirectRoute();
      return redirect(redirectRoute);
   }

   // check if there is token and the user try to access route /login
   if (authStore.isAuthenticated === true && (route.fullPath === '/login' || route.fullPath === '/login/')) {
      return redirect('/');
   }
}