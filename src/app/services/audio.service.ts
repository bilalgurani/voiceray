import { inject, Injectable } from '@angular/core';
import { AudioCard } from '../model/audio-details.model';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private http = inject(HttpClient);

  getAudioById(id: number): Observable<any> {
    return this.http.get(`https://voiceray-service.onrender.com/api/audio/${id}`)
  }

  getAllMetadata(): Observable<any> {
    return this.http.get('https://voiceray-service.onrender.com/api/audio/allMetadata');
  }

  saveAudioMetadata(formData: FormData) {
    return this.http.post("https://voiceray-service.onrender.com/api/audio/upload", formData)
  }
}
