import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnDestroy, AfterViewInit, ChangeDetectorRef, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { AudioService } from '../services/audio.service';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-audio-detail',
  imports: [RouterModule, CommonModule],
  templateUrl: './audio-detail.component.html',
  styleUrl: './audio-detail.component.scss'
})
export class AudioDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('audioRef') audioRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('dropdown') dropdownRef!: ElementRef;
  
  private animationFrameId: number | null = null;
  private isInitialized = false;
  private isDragging = false;
  
  isPlaying = false;
  isRepeat = false;
  currentTime = 0;
  duration = 0;
  roundedDuration = 0;
  formattedDuration = '0:00';

  isFullScreen = false;
  @ViewChild('audioPlayerContainer') audioPlayerContainer!: ElementRef;
  
  private fullScreenSub!: Subscription;

  showSpeedMenu = false;
  speedOptions = [0.5, 'Normal', 1.25, 1.5, 1.75, 2];
  selectedSpeed: number | string = 'Normal';

  id!: number;
  selectedAudio: any;
  audioUrl: string | undefined;
  thumbnailUrl: string | undefined;

  private onAudioEndedBound = this.onAudioEnded.bind(this);
  private audioSub!: Subscription;

  constructor(
    private cdr: ChangeDetectorRef, 
    private route: ActivatedRoute, 
    private audioService: AudioService) {}

  ngOnInit(): void {      
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      console.log(this.id);
      
      this.audioSub = this.audioService.getAudioById(this.id).subscribe(audio => {
        if (audio) {
          
          this.selectedAudio = audio;
          setTimeout(() => this.initializeAudio());
        }
      })
    });

    // this.audioService.getAudioFile().subscribe((data) => {
    //   console.log(data);
      
    //   this.audioUrl = URL.createObjectURL(data);
    // });

    // this.setupFullScreenListener();
  }

  // private setupFullScreenListener() {
  //   this.fullScreenSub = fromEvent(document, 'fullscreenchange').subscribe(() => {
  //     this.isFullScreen = !!document.fullscreenElement;
  //     this.cdr.detectChanges();
  //   });
  // }

  ngAfterViewInit() {
    this.initializeAudio();
  }

  toggleFullScreen() {
    const element = this.audioPlayerContainer.nativeElement;
    
    if (!this.isFullScreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) { /* Safari */
        element.webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) { /* IE11 */
        (element as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Add these listeners to detect full-screen changes
  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  fullscreenchangeHandler() {
    this.isFullScreen = !!(
      document.fullscreenElement
    );
  }

  private cleanup() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private initializeAudio() {
    if (!this.audioRef || !this.selectedAudio) return;
  
    const audio = this.audioRef.nativeElement;
    audio.src = this.selectedAudio.audioUrl;
    audio.load();

    audio.addEventListener('ended', this.onAudioEndedBound);
    
    // Set up proper event listeners
    audio.addEventListener('loadedmetadata', () => this.onMetadataLoaded());
    audio.addEventListener('error', (e) => console.error('Audio error:', e));
    audio.addEventListener('canplay', () => this.onCanPlay());
    
    // If metadata is already loaded
    if (audio.readyState >= 1) {
      this.onMetadataLoaded();
    }
  }


  private onCanPlay() {
    // Additional initialization when audio can play
    this.setupSliderListeners();
  }

  private setupSliderListeners() {
    const slider = this.getSliderElement();
    if (slider) {
      // Add mouse and touch events for better UX
      slider.addEventListener('mousedown', () => this.isDragging = true);
      slider.addEventListener('mouseup', () => this.isDragging = false);
      slider.addEventListener('touchstart', () => this.isDragging = true);
      slider.addEventListener('touchend', () => this.isDragging = false);
    }
  }

  private onMetadataLoaded() {
    const audio = this.audioRef.nativeElement;
    this.duration = audio.duration || 0;
    this.roundedDuration = Math.round(this.duration);
    this.formattedDuration = this.formatTime(this.duration);
    this.isInitialized = true;
    
    // Trigger change detection after updating properties
    this.cdr.detectChanges();
    
    // Initialize slider display
    this.updateSliderDisplay();
  }

  private onAudioEnded() {    
    this.isPlaying = false;
    this.cleanup();
    
    if (!this.isRepeat) {
      this.currentTime = 0;
      this.updateSliderDisplay();
    }
    this.cdr.detectChanges();
  }

  togglePlayPause() {
    if (!this.isInitialized) return;
    
    const audio = this.audioRef.nativeElement;
    
    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.startSmoothProgressTracking();
          })
          .catch(error => {
            console.error('Play failed:', error);
            this.isPlaying = false;
          });
      }
    } else {
      audio.pause();
      this.isPlaying = false;
      this.cleanup();
    }
  }

  seek(seconds: number) {
    if (!this.isInitialized) return;
    
    const audio = this.audioRef.nativeElement;
    const newTime = Math.max(0, Math.min(this.duration, audio.currentTime + seconds));
    
    this.seekToTime(newTime);
  }

  private seekToTime(time: number) {
    const audio = this.audioRef.nativeElement;
    const wasPlaying = this.isPlaying;
    
    // Temporarily stop tracking
    this.cleanup();
    
    // Update audio time
    audio.currentTime = time;
    this.currentTime = time;
    
    // Update slider immediately
    this.updateSliderDisplay();
    
    // Resume tracking if was playing
    if (wasPlaying) {
      // Small delay to ensure audio has time to seek
      setTimeout(() => {
        this.startSmoothProgressTracking();
      }, 50);
    }
  }

  toggleRepeat() {
    this.isRepeat = !this.isRepeat;
    this.audioRef.nativeElement.loop = this.isRepeat;
  }

  private startSmoothProgressTracking() {
    const audio = this.audioRef.nativeElement;
    
    const smoothUpdate = () => {
      if (!audio.paused && !audio.ended && this.isInitialized) {
        // Only update if not dragging to prevent conflicts
        if (!this.isDragging) {
          this.currentTime = audio.currentTime;
          this.updateSliderDisplay();
        }
        this.animationFrameId = requestAnimationFrame(smoothUpdate);
      }
    };
    
    this.animationFrameId = requestAnimationFrame(smoothUpdate);
  }

  private updateSliderDisplay() {
    const slider = this.getSliderElement();
    if (slider && this.duration > 0) {
      const progress = (this.currentTime / this.duration) * 100;
      
      // Update slider value smoothly
      slider.value = this.currentTime.toString();
      slider.max = this.duration.toString();
      
      // Update progress fill
      slider.style.setProperty('--progress', `${Math.min(100, Math.max(0, progress))}%`);
    }
  }

  private getSliderElement(): HTMLInputElement | null {
    return document.querySelector('.controls__progress-container__slider') as HTMLInputElement;
  }

  onSliderChange(event: Event) {
    if (!this.isInitialized) return;
    
    const target = event.target as HTMLInputElement;
    const newTime = parseFloat(target.value);
    
    // Validate the new time
    if (isNaN(newTime) || newTime < 0 || newTime > this.duration) {
      return;
    }
    
    // Update progress fill immediately for responsive feedback
    const progress = (newTime / this.duration) * 100;
    target.style.setProperty('--progress', `${progress}%`);
    
    // Update current time for display
    this.currentTime = newTime;
    
    // Seek to the new time
    this.seekToTime(newTime);
  }

  // Add input event for real-time slider updates
  onSliderInput(event: Event) {
    if (!this.isInitialized) return;
    
    const target = event.target as HTMLInputElement;
    const newTime = parseFloat(target.value);
    
    if (isNaN(newTime) || newTime < 0 || newTime > this.duration) {
      return;
    }
    
    // Update visual progress immediately while dragging
    const progress = (newTime / this.duration) * 100;
    target.style.setProperty('--progress', `${progress}%`);
    this.currentTime = newTime;
  }

  formatTime(time: number): string {
    if (isNaN(time) || time < 0) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  toggleSpeedMenu() {
    setTimeout(() => {
      this.showSpeedMenu = !this.showSpeedMenu;
    }, 0);
  }

  getSpeedDisplayText() {}

  setPlaybackSpeed(speed: number) {}

  selectSpeed(speed: number | string) {
    this.selectedSpeed = speed;
    this.audioRef.nativeElement.playbackRate = typeof speed === 'number' ? speed : 1;
    this.showSpeedMenu = false;
    this.cdr.detectChanges();
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (
      this.showSpeedMenu &&
      this.dropdownRef &&
      !this.dropdownRef.nativeElement.contains(target)
    ) {
      this.showSpeedMenu = false;
    }
  }

  shareAudio() {
    const shareUrl = `▶️ Play audio: ${window.location.href}`
    const message = `${shareUrl}

🕌 Assalam wa alaikum Wa Rehmatullahi wa Barakatahu!

📌 Topic: Taqwa Kya hain, Aur Kaise Parda Kara jae?
🎙️ Speaker: Ahmed Siraj Umeri Qasmi Faizabadi
    • Chairman, Aetedal Trust of Hubli, Karnataka
    • Chairman, Trust of Falahe Aam, Ayodhya, U.P, India
📝 Description: Moulana talks about Taqwa and Parda the importance of it.
📅 Date: 1 Aug 2025
⏱️ Duration: 21:06 mins

📞 Contact: +91 9620409893
New WhatsApp No: 0091 8217035914 & 0091 7899372793 

📲 Join My Telegram Group Link:
👉 https://t.me/MoulanaAhmedSiraj

🗒️ Note: Is Taqreer ko zaroor sunein.`;
    if (navigator.share) {
      navigator.share({
        title: "Dars E Hadees No. 744",
        text: message
      })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.error('Error sharing', error));
    } else {
      navigator.clipboard.writeText(message);
      alert('Sharing not supported on this browser');
    }
  }

  ngOnDestroy() {
    this.cleanup();
    this.fullScreenSub?.unsubscribe();
    if (this.isFullScreen) {
      this.toggleFullScreen();
    }
    this.audioSub?.unsubscribe();
  }

}