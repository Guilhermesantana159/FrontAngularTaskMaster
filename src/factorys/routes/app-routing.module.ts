import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { LoginComponent } from 'src/app/pages/entities/login/login.component';
import { RegisterComponent } from 'src/app/pages/entities/register/register.component';
import { RecoverPasswordComponent } from 'src/app/pages/entities/recoverPassword/recoverPassword.component';
import { MainComponent } from 'src/app/pages/entities/main/main.component';
import { LandingPageComponent } from 'src/app/pages/entities/landing-page/landing-page.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'login/recuperar-senha', component: RecoverPasswordComponent},
  { path: 'login/nova-conta', component: RegisterComponent},
  { path: 'main-dashboard', component: MainComponent, loadChildren: () => import('../../app/pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
