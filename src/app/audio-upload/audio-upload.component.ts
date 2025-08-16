import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-audio-upload',
  imports: [ReactiveFormsModule],
  templateUrl: './audio-upload.component.html',
  styleUrl: './audio-upload.component.scss'
})
export class AudioUploadComponent {

  private audioService = inject(AudioService);

  audioUpload = new FormGroup({
    topic: new FormControl('', Validators.required),
    speaker: new FormControl('', Validators.required),
    tags: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    thumbnail: new FormControl<File | null>(null, Validators.required),
    audioFile: new FormControl<File | null>(null, Validators.required)
  });
  

  async onSubmit() {
    if (!this.audioUpload.valid) return;

    const formValue = this.audioUpload.value;

    const tagsArray = (formValue.tags || '')
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);

    const formData = new FormData();

    const metadata = {
      topic: formValue.topic,
      speakerName: formValue.speaker,
      description: formValue.description || '',
      tags: tagsArray
    };

    const metadataBlob = new Blob([JSON.stringify(metadata)], {
      type: 'application/json'
    });

    formData.append('metadata', metadataBlob);

    if (formValue.thumbnail) {
      formData.append('thumbnail', formValue.thumbnail);
    }
    if (formValue.audioFile) {
      formData.append('audioFile', formValue.audioFile);
    }

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    this.audioService.saveAudioMetadata(formData).subscribe({
      next: (response: any) => {
        console.log('Upload successful', response);
        this.audioUpload.reset();
      }, 
      error: (err: any) => {
        console.error('Upload failed', err);
      }
    })
    
  }

  onFileSelected(event: Event, controlName: 'thumbnail' | 'audioFile') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];

      this.audioUpload.get(controlName)?.setValue(file);
      input.value = '';
    }
  }

}
