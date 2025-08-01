import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { SpeakersComponent } from './speakers/speakers.component';
import { MainComponent } from './main/main.component';
import { AudioDetailComponent } from './audio-detail/audio-detail.component';

export const routes: Routes = [
  {path: '', component: MainComponent, pathMatch: 'full'},
  {path: 'audio/:id', component: AudioDetailComponent},
  {path: 'about', component: AboutComponent},
  {path: 'speakers', component: SpeakersComponent}
];
