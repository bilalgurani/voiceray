import { Component } from '@angular/core';
import { HeroComponent } from "../section/hero/hero.component";
import { FeatureComponent } from "../section/feature/feature.component";
import { WhyVoicerayComponent } from "../section/why-voiceray/why-voiceray.component";

@Component({
  selector: 'app-main',
  imports: [HeroComponent, FeatureComponent, WhyVoicerayComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
