import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import Lenis from '@studio-freight/lenis';
import { LenisService } from '../services/lenis.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private lenis: Lenis | null = null;
  private animationFrameId: number | null = null;

  private lenisService = inject(LenisService);

  isMenuOpen = false;

  ngOnInit() {
    this.lenis = new Lenis();

    const animate = (time: number) => {
      this.lenis?.raf(time);
      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  scrollToTop(event: Event) {
    event.preventDefault();
    this.lenisService.scrollTo(0, {
      duration: 2,
      easing: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    });
  }

  toggleBurgerMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollToSection(event: Event, target: string) {
    event.preventDefault();
    // Use the service
    this.lenisService.scrollTo(target, {
      offset: -10,
      duration: 2,
      easing: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    });
  }
}
