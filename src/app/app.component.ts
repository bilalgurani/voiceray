import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { RouterOutlet } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, HeaderComponent, RouterOutlet]
})
export class AppComponent {
  constructor(private meta: Meta, private title: Title) {
    this.setMetaTags();
  }

  setMetaTags() {
    this.title.setTitle('Voiceray - Inspiring Audio Talks');
    this.meta.updateTag({
      name: 'description',
      content: 'Discover impactful audio content on Voiceray - from inspiring talks by renowned speakers to insightful discussions on education, spirituality, and youth empowerment. Listen, learn, and grow.'
    });
  }
}
