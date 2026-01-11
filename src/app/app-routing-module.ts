import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverForm } from './components/driver-form/driver-form';
import { DriverList } from './components/driver-list/driver-list';
import { Home } from './components/home/home';
import { PassengerList } from './components/passenger-list/passenger-list';
import { TripForm } from './components/trip-form/trip-form';
import { TripList } from './components/trip-list/trip-list';
import { VehicleForm } from './components/vehicle-form/vehicle-form';
import { VehicleList } from './components/vehicle-list/vehicle-list';
import { TripDetails } from './components/trip-details/trip-details';
import { LoginPage } from './components/login-page/login-page';
import { RegisterPage } from './components/register-page/register-page';
import { AppGuard } from './app-guard';

const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'trips', component: TripList, canActivate: [AppGuard] },
  { path: 'trips/create', component: TripForm, canActivate: [AppGuard] },
  { path: 'trips/edit/:id', component: TripForm, canActivate: [AppGuard] },
  { path: 'trips/details/:id', component: TripDetails, canActivate: [AppGuard] },
  { path: 'trips/:id', component: TripForm, canActivate: [AppGuard] },
  { path: 'drivers', component: DriverList, canActivate: [AppGuard] },
  { path: 'drivers/create', component: DriverForm, canActivate: [AppGuard] },
  { path: 'drivers/edit/:id', component: DriverForm, canActivate: [AppGuard] },
  { path: 'vehicles', component: VehicleList, canActivate: [AppGuard] },
  { path: 'vehicles/create', component: VehicleForm, canActivate: [AppGuard] },
  { path: 'vehicles/edit/:id', component: VehicleForm, canActivate: [AppGuard] },
  { path: 'passengers', component: PassengerList, canActivate: [AppGuard] },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
