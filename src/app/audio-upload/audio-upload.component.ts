import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AudioService } from '../services/audio.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface UploadedFile {
  file: File;
  preview?: string;
  name: string;
  size: string;
}

@Component({
  selector: 'app-audio-upload',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './audio-upload.component.html',
  styleUrl: './audio-upload.component.scss'
})
export class AudioUploadComponent {

  private audioService = inject(AudioService);
  private router = inject(Router);

  uploadedFiles: { [key: string]: UploadedFile | null } = {
    image: null,
    audio: null
  };

  dragOver: { [key: string]: boolean } = {
    image: false,
    audio: false
  };

  tagList: string[] = [];
  tagsInputValue: string = '';

  audioUpload = new FormGroup({
    topic: new FormControl('', Validators.required),
    speaker: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    tags: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    thumbnail: new FormControl<File | null>(null, Validators.required),
    audioFile: new FormControl<File | null>(null, Validators.required),
    duration: new FormControl('', Validators.required)
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
    return this.audioUpload.invalid || !this.hasFile('image') || !this.hasFile('audio') || this.tagList.length === 0;
  }
  
  async onSubmit() {
    if (!this.audioUpload.valid) return;

    const formValue = this.audioUpload.value;
    const tagsArray = this.tagList;

    const formData = new FormData();

    const metadata = {
      topic: formValue.topic,
      speakerName: formValue.speaker,
      description: formValue.description || '',
      tags: tagsArray,
      duration: formValue.duration
    };

    console.log(metadata);
    

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

    this.audioService.saveAudioMetadata(formData).subscribe({
      next: (response: any) => {
        this.router.navigate(['/']);
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

    if (fileType === 'audio') {
      const audio = document.createElement('audio');
      audio.src = URL.createObjectURL(file);

      audio.addEventListener('loadedmetadata', () => {
        const durationInSeconds = audio.duration;
        const formattedDuration = this.formatDuration(durationInSeconds);
  
        // Patch duration to form
        this.audioUpload.patchValue({
          duration: formattedDuration
        });
      });
    }
  }

  private formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.round((seconds % 3600) / 60);
  
    if (h > 0) {
      return `${h} hr ${m} mins`;
    } else {
      return `${m} mins`;
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // FIXED: Correct form control patching
  removeFile(fileType: 'image' | 'audio'): void {
    this.uploadedFiles[fileType] = null;
    
    // Fix: Use correct control names
    const controlName = fileType === 'image' ? 'thumbnail' : 'audioFile';
    this.audioUpload.patchValue({
      [controlName]: null
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

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === ',' || event.key === "Enter") {
      event.preventDefault();
      this.addTag();
      return;
    }
  
    if (event.key === 'Backspace' && this.tagsInputValue === '' && this.tagList.length > 0) {
      this.removeTag(this.tagList.length - 1);
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    
    // Process pasted content
    const tags = pastedData.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  
    // Add unique tags
    tags.forEach(tag => {
      if (!this.tagList.includes(tag)) {
        this.tagList.push(tag.charAt(0).toUpperCase() + tag.slice(1));
      }
    });
    
    this.updateTagsFormControl();
    this.tagsInputValue = '';
    
    // Force clear the input field
    setTimeout(() => {
      const inputElement = document.getElementById('tags') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }
    }, 0);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    
    // Handle comma input - automatically add tags when comma is typed
    if (value.includes(',')) {
      const parts = value.split(',');
      
      // Add all complete tags (all parts except the last one)
      for (let i = 0; i < parts.length - 1; i++) {
        const tag = parts[i].trim();
        if (tag && !this.tagList.includes(tag)) {
          this.tagList.push(tag.charAt(0).toUpperCase() + tag.slice(1));
        }
      }
      
      // Keep only the text after the last comma
      this.tagsInputValue = parts[parts.length - 1].trim();
      this.updateTagsFormControl();
      
      // Force clear input if no remaining text
      if (this.tagsInputValue === '') {
        setTimeout(() => {
          target.value = '';
        }, 0);
      }
    } else {
      // Normal typing - just update the input value
      this.tagsInputValue = value;
    }
  }

  addTag(): void {
    const trimmedValue = this.tagsInputValue.trim();
    if (trimmedValue && !this.tagList.includes(trimmedValue)) {
      this.tagList.push(trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1));
      this.tagsInputValue = '';
      this.updateTagsFormControl();
      
      // Force clear the input field
      setTimeout(() => {
        const inputElement = document.getElementById('tags') as HTMLInputElement;
        if (inputElement) {
          inputElement.value = '';
        }
      }, 0);
    }
  }

  private updateTagsFormControl(): void {
    // Update the form control value with current tags for validation
    const tagsString = this.tagList.length > 0 ? this.tagList.join(',') : '';
    this.audioUpload.patchValue({
      tags: tagsString
    });

    this.audioUpload.get('tags')?.markAsTouched();
  }

  removeTag(index: number): void {
    this.tagList.splice(index, 1);
    this.updateTagsFormControl();
  }

  private resetForm(): void {
    this.audioUpload.reset();
    this.tagList = [];
    this.tagsInputValue = '';
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