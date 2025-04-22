import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./post/post-list/post-list.component').then(m => m.PostListComponent)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./post/post-create/post-create.component').then(m => m.PostCreateComponent)
  },
  {
    path: 'edit/:postId',
    loadComponent: () =>
      import('./post/post-create/post-create.component').then(m => m.PostCreateComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./authentication/login/login.component').then(m => m.LoginComponent)
  }
];
