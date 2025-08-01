import { Component } from '@angular/core';
import { HeroComponent } from "../section/hero/hero.component";
import { FeatureComponent } from "../section/feature/feature.component";

@Component({
  selector: 'app-main',
  imports: [HeroComponent, FeatureComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
