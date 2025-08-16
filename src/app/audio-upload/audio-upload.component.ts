import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AudioService } from '../services/audio.service';
import { CommonModule } from '@angular/common';

interface UploadedFile {
  file: File;
  preview?: string;
  name: string;
  size: string;
}

@Component({
  selector: 'app-audio-upload',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './audio-upload.component.html',
  styleUrl: './audio-upload.component.scss'
})
export class AudioUploadComponent {

  private audioService = inject(AudioService);

  uploadedFiles: { [key: string]: UploadedFile | null } = {
    image: null,
    audio: null
  };

  dragOver: { [key: string]: boolean } = {
    image: false,
    audio: false
  };

  audioUpload = new FormGroup({
    topic: new FormControl('', Validators.required),
    speaker: new FormControl('', Validators.required),
    tags: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    thumbnail: new FormControl<File | null>(null, Validators.required),
    audioFile: new FormControl<File | null>(null, Validators.required)
  });

  get topic() {
    return this.audioUpload.get('topic');
  }

  get speaker() {
    return this.audioUpload.get('speaker');
  }

  get description() {
    return this.audioUpload.get('description');
  }

  get tags() {
    return this.audioUpload.get('tags');
  }

  get thumbnail() {
    return this.audioUpload.get('thumbnail');
  }

  get audioFile() {
    return this.audioUpload.get('audioFile');
  }
  
  isFormValid() {
    return this.audioUpload.invalid || !this.hasFile('image') || !this.hasFile('audio')
  }
  

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
        this.resetForm();
      }, 
      error: (err: any) => {
        console.error('Upload failed', err);
      }
    })
    
  }

  onFileSelected(event: Event, fileType: 'image' | 'audio') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.handleFileUpload(file, fileType);
    }
  }

  private handleFileUpload(file: File, fileType: 'image' | 'audio'): void {
    const uploadedFile: UploadedFile = {
      file: file,
      name: file.name,
      size: this.formatFileSize(file.size)
    };

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedFile.preview = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    this.uploadedFiles[fileType] = uploadedFile;
    
    // Update form control based on file type
    const controlName = fileType === 'image' ? 'thumbnail' : 'audioFile';
    this.audioUpload.patchValue({
      [controlName]: file
    });
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  removeFile(fileType: 'image' | 'audio'): void {
    this.uploadedFiles[fileType] = null;
    this.audioUpload.patchValue({
      [`${fileType}File`]: ''
    });
    
    // Reset file input
    const fileInput = document.getElementById(`${fileType}-file`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  getFileInfo(fileType: 'image' | 'audio'): UploadedFile | null {
    return this.uploadedFiles[fileType];
  }

  hasFile(fileType: 'image' | 'audio'): boolean {
    return this.uploadedFiles[fileType] !== null;
  }

  isDragOver(fileType: 'image' | 'audio'): boolean {
    return this.dragOver[fileType];
  }

  onDragOver(event: DragEvent, fileType: 'image' | 'audio'): void {
    event.preventDefault();
    this.dragOver[fileType] = true;
  }

  // Handle drag leave events
  onDragLeave(event: DragEvent, fileType: 'image' | 'audio'): void {
    event.preventDefault();
    this.dragOver[fileType] = false;
  }

  onDrop(event: DragEvent, fileType: 'image' | 'audio'): void {
    event.preventDefault();
    this.dragOver[fileType] = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      const isValidType = fileType === 'image' ? 
        file.type.startsWith('image/') : 
        file.type.startsWith('audio/');
      
      if (isValidType) {
        this.handleFileUpload(file, fileType);
      } else {
        alert(`Please upload a valid ${fileType} file.`);
      }
    }
  }



  private resetForm(): void {
    this.audioUpload.reset();
    this.uploadedFiles = {
      image: null,
      audio: null
    };
    
    // Reset file inputs
    const imageInput = document.getElementById('image-file') as HTMLInputElement;
    const audioInput = document.getElementById('audio-file') as HTMLInputElement;
    
    if (imageInput) imageInput.value = '';
    if (audioInput) audioInput.value = '';
  }

}
