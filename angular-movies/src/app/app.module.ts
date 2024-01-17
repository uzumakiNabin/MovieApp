import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { MarkdownModule } from 'ngx-markdown';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MoviesListComponent } from './movies/movies-list/movies-list.component';
import { GenericListComponent } from './utilities/generic-list/generic-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { MenuComponent } from './menu/menu.component';
import { RatingComponent } from './utilities/rating/rating.component';
import { LifecycletstComponent } from './lifecycletst/lifecycletst.component';
import { HomeComponent } from './home/home.component';
import { IndexGenresComponent } from './genre/index-genres/index-genres.component';
import { CreateGenreComponent } from './genre/create-genre/create-genre.component';
import { IndexActorsComponent } from './actor/index-actors/index-actors.component';
import { CreateActorComponent } from './actor/create-actor/create-actor.component';
import { IndexTheatersComponent } from './theater/index-theaters/index-theaters.component';
import { CreateTheaterComponent } from './theater/create-theater/create-theater.component';
import { CreateMovieComponent } from './movies/create-movie/create-movie.component';
import { EditActorComponent } from './actor/edit-actor/edit-actor.component';
import { NotfoundComponent } from './utilities/notfound/notfound.component';
import { FormGenreComponent } from './genre/form-genre/form-genre.component';
import { MoviesFilterComponent } from './movies/movies-filter/movies-filter.component';
import { FormActorComponent } from './actor/form-actor/form-actor.component';
import { InputImgComponent } from './utilities/input-img/input-img.component';
import { InputMarkdownComponent } from './utilities/input-markdown/input-markdown.component';
import { FormTheaterComponent } from './theater/form-theater/form-theater.component';
import { MapComponent } from './utilities/map/map.component';
import { EditTheaterComponent } from './theater/edit-theater/edit-theater.component';
import { FormMovieComponent } from './movies/form-movie/form-movie.component';
import { MultipleSelectorComponent } from './utilities/multiple-selector/multiple-selector.component';
import { ActorsAutocompleteComponent } from './actor/actors-autocomplete/actors-autocomplete.component';
import { DisplayErrorsComponent } from './utilities/display-errors/display-errors.component';
import { EditGenreComponent } from './genre/edit-genre/edit-genre.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';
import { EditMovieComponent } from './movies/edit-movie/edit-movie.component';
import { AuthorizeViewComponent } from './security/authorize-view/authorize-view.component';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { AuthFormComponent } from './security/auth-form/auth-form.component';
import { JwtInterceptorService } from './security/jwt-interceptor.service';
import { IndexUsersComponent } from './security/index-users/index-users.component';

@NgModule({
  declarations: [
    AppComponent,
    MoviesListComponent,
    GenericListComponent,
    MenuComponent,
    RatingComponent,
    LifecycletstComponent,
    HomeComponent,
    IndexGenresComponent,
    CreateGenreComponent,
    IndexActorsComponent,
    CreateActorComponent,
    IndexTheatersComponent,
    CreateTheaterComponent,
    CreateMovieComponent,
    EditActorComponent,
    NotfoundComponent,
    FormGenreComponent,
    MoviesFilterComponent,
    FormActorComponent,
    InputImgComponent,
    InputMarkdownComponent,
    FormTheaterComponent,
    MapComponent,
    EditTheaterComponent,
    FormMovieComponent,
    MultipleSelectorComponent,
    ActorsAutocompleteComponent,
    DisplayErrorsComponent,
    EditGenreComponent,
    MovieDetailsComponent,
    EditMovieComponent,
    AuthorizeViewComponent,
    LoginComponent,
    RegisterComponent,
    AuthFormComponent,
    IndexUsersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MarkdownModule.forRoot(),
    LeafletModule,
    HttpClientModule,
    SweetAlert2Module.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
