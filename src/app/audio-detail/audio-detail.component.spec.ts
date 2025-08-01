import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioDetailComponent } from './audio-detail.component';

describe('AudioDetailComponent', () => {
  let component: AudioDetailComponent;
  let fixture: ComponentFixture<AudioDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudioDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
