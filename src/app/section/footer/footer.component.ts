import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  email = "bilalahamedgurani@gmail.com";
  phoneNo = "+91 70192 57913";

  getYear() {
    return new Date().getFullYear();
  }

  scrollToTop(event: Event) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
