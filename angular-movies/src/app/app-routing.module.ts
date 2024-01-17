import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { IndexGenresComponent } from './genre/index-genres/index-genres.component';
import { CreateGenreComponent } from './genre/create-genre/create-genre.component';
import { EditGenreComponent } from './genre/edit-genre/edit-genre.component';
import { IndexActorsComponent } from './actor/index-actors/index-actors.component';
import { CreateActorComponent } from './actor/create-actor/create-actor.component';
import { IndexTheatersComponent } from './theater/index-theaters/index-theaters.component';
import { CreateTheaterComponent } from './theater/create-theater/create-theater.component';
import { EditTheaterComponent } from './theater/edit-theater/edit-theater.component';
import { CreateMovieComponent } from './movies/create-movie/create-movie.component';
import { EditActorComponent } from './actor/edit-actor/edit-actor.component';
import { NotfoundComponent } from './utilities/notfound/notfound.component';
import { MoviesFilterComponent } from './movies/movies-filter/movies-filter.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';
import { EditMovieComponent } from './movies/edit-movie/edit-movie.component';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { IndexUsersComponent } from './security/index-users/index-users.component';

import { isAdminGuard } from './is-admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'genres',
    component: IndexGenresComponent,
    canActivate: [isAdminGuard()],
  },
  {
    path: 'genres/create',
    component: CreateGenreComponent,
    canActivate: [isAdminGuard()],
  },
  {
    path: 'genres/edit/:id',
    component: EditGenreComponent,
    canActivate: [isAdminGuard()],
  },
  {
    path: 'actors',
    component: IndexActorsComponent,
    canActivate: [isAdminGuard()],
  },
  {
    path: 'actors/create',
    component: CreateActorComponent,
    canActivate: [isAdminGuard()],
  },
  {
    path: 'actors/edit/:id',
    component: EditActorComponent,
    canActivate: [isAdminGuard()],
  },
  {
    path: 'theaters',
    component: IndexTheatersComponent,
    canActivate: [isAdminGuard()],
  },
  {
    path: 'theaters/create',
    component: CreateTheaterComponent,
    canActivate: [isAdminGuard()],
  },
  {
    path: 'theaters/edit/:id',
    component: EditTheaterComponent,
    canActivate: [isAdminGuard()],
  },
  {
    path: 'movies/create',
    component: CreateMovieComponent,
    canActivate: [isAdminGuard()],
  },
  { path: 'movies/filter', component: MoviesFilterComponent },
  { path: 'movies/:id', component: MovieDetailsComponent },
  {
    path: 'movies/edit/:id',
    component: EditMovieComponent,
    canActivate: [isAdminGuard()],
  },
  {
    path: 'users',
    component: IndexUsersComponent,
    canActivate: [isAdminGuard()],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
