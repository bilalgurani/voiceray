import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AudioService } from '../../services/audio.service';
import { Subscription } from 'rxjs';
import { TimeAgoPipe } from "../../pipes/time-ago.pipe";

@Component({
  selector: 'app-feature',
  imports: [CommonModule, RouterModule, TimeAgoPipe],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.scss'
})
export class FeatureComponent implements OnInit {
  private audioService = inject(AudioService);
  
  private subscription: Subscription = new Subscription();

  audioUrl: any;
  cardData: any;

  ngOnInit(): void {
    this.fetchAllMetadata();
  }

  fetchAllMetadata() {
    this.audioService.loadAllMetadata().subscribe((data) => {      
      this.cardData = data;
    });
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.audioUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.audioUrl);
    }
  }

}
