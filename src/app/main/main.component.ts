import { Component } from '@angular/core';
import { HeroComponent } from "../section/hero/hero.component";
import { FeatureComponent } from "../section/feature/feature.component";
import { WhyVoicerayComponent } from "../section/why-voiceray/why-voiceray.component";
import { FooterComponent } from "../section/footer/footer.component";

@Component({
  selector: 'app-main',
  imports: [HeroComponent, FeatureComponent, WhyVoicerayComponent, FooterComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
