import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMenuOpen = false;

  scrollToTop(event: Event) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleBurgerMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
