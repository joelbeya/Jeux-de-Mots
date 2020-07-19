import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './account/profile/profile.component';
import { SignInComponent } from './account/sign-in/sign-in.component';
import { CreateAccountComponent } from './account/create-account/create-account.component';
import { ResearchComponent } from './research/research.component';
import { ResearchFormComponent } from './research/research-form/research-form.component';
import { ResultComponent } from './research/result/result.component';
import { NgxPaginationModule } from 'ngx-pagination';

import { RaffinementComponent } from './research/result/raffinement/raffinement.component';
import { RelationComponent } from './research/result/relation/relation.component';
import { CheckBoxModule  } from '@syncfusion/ej2-angular-buttons';
import { AutoCompleteModule, DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';

const routes: Routes = [
  { path: '', component: ResearchFormComponent },
  { path: 'about', component: CreateAccountComponent },
  { path: 'research', component: ResearchFormComponent },
  { path: 'research/:wordAsked', component: ResultComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfileComponent,
    SignInComponent,
    CreateAccountComponent,
    ResearchComponent,
    ResearchFormComponent,
    ResultComponent,
    RaffinementComponent,
    RelationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    AutoCompleteModule,
    CheckBoxModule,
    DropDownListModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
