import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { RouterOutlet } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import Lenis from '@studio-freight/lenis';
import { LenisService } from './services/lenis.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, HeaderComponent, RouterOutlet]
})
export class AppComponent implements OnInit {
  private lenis: Lenis | null = null;

  private lenisService = inject(LenisService);

  constructor(private meta: Meta, private title: Title) {
    this.setMetaTags();
  }

  ngOnInit() {
    this.lenisService.init();
  }

  setMetaTags() {
    this.title.setTitle('Voiceray - Inspiring Audio Talks');
    this.meta.updateTag({
      name: 'description',
      content: 'Discover impactful audio content on Voiceray - from inspiring talks by renowned speakers to insightful discussions on education, spirituality, and youth empowerment. Listen, learn, and grow.'
    });
  }
}
