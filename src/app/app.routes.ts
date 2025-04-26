import { Routes } from '@angular/router';
import { AuthGuard } from './authentication/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./post/post-list/post-list.component').then(m => m.PostListComponent)
  },
  {
    path: 'create',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./post/post-create/post-create.component').then(m => m.PostCreateComponent)
  },
  {
    path: 'edit/:postId',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./post/post-create/post-create.component').then(m => m.PostCreateComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./authentication/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./authentication/signup/signup.component').then(m => m.SignupComponent)
  }
];
