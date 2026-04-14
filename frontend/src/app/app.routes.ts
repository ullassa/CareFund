import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { CustomerSignupComponent } from './components/customer-signup/customer-signup.component';
import { CharitySignupComponent } from './components/charity-signup/charity-signup.component';
import { ImpactComponent } from './components/impact/impact.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { DonateComponent } from './components/donate/donate.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'customer-signup', component: CustomerSignupComponent },
  { path: 'charity-signup', component: CharitySignupComponent },
  { path: 'impact', component: ImpactComponent },
  { path: 'blogs', component: BlogsComponent },
  { path: 'donate', component: DonateComponent },
  { path: '**', redirectTo: '' }
];
