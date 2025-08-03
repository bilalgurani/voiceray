import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyVoicerayComponent } from './why-voiceray.component';

describe('WhyVoicerayComponent', () => {
  let component: WhyVoicerayComponent;
  let fixture: ComponentFixture<WhyVoicerayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyVoicerayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyVoicerayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
