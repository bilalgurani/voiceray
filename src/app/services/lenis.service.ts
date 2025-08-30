import { Injectable, OnDestroy } from '@angular/core';
import Lenis from '@studio-freight/lenis';

@Injectable({
  providedIn: 'root'
})
export class LenisService implements OnDestroy {
  private lenis: Lenis | null = null;
  private animationFrameId: number | null = null;

  init() {
    this.lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: .5,
    });
    const animate = (time: number) => {
      this.lenis?.raf(time);
      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  scrollTo(target: string | number | HTMLElement, options?: any) {
    this.lenis?.scrollTo(target, options);
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.lenis?.destroy();
    this.lenis = null;
  }
}
