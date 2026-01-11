import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { App } from './app';
import { TripList } from './components/trip-list/trip-list';
import { TripForm } from './components/trip-form/trip-form';
import { DriverList } from './components/driver-list/driver-list';
import { DriverForm } from './components/driver-form/driver-form';
import { PassengerList } from './components/passenger-list/passenger-list';
//import { DatePipe } from '@angular/common';

import { VehicleList } from './components/vehicle-list/vehicle-list';
import { VehicleForm } from './components/vehicle-form/vehicle-form';
import { Navbar } from './components/navbar/navbar';
import { Home } from './components/home/home';
import { AppRoutingModule } from './app-routing-module';
import { TripDetails } from './components/trip-details/trip-details';
import { LoginPage } from './components/login-page/login-page';
import { RegisterPage } from './components/register-page/register-page';
import { TokenInterceptor } from './services/token-interceptor';

@NgModule({
  declarations: [
    App,
    TripList,
    TripForm,
    DriverList,
    DriverForm,
    PassengerList,

    VehicleList,
    VehicleForm,
    Navbar,
    Home,
    TripDetails,
    LoginPage,
    RegisterPage,
  ],
  imports: [BrowserModule, CommonModule, FormsModule, ReactiveFormsModule, AppRoutingModule],
  providers: [
    provideHttpClient(withInterceptors([TokenInterceptor])),
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App],
})
export class AppModule {}
