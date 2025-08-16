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
    return this.http.get(`http://localhost:8080/api/audio/${id}`)
  }

  // getAllAudio(): Observable<AudioCard[]> {
  //   return of(this.audioList);
  // }

  getBackBlaze(): Observable<any> {
    return this.http.get("https://f005.backblazeb2.com/file/voiceray-audios/siraj-moulana.mp3",
      { responseType: 'blob' }
    );
  }

  saveAudioMetadata(formData: FormData) {
    return this.http.post("http://localhost:8080/api/audio/upload", formData)
  }

  getAudioFile(): Observable<any> {
    return this.http.get("http://localhost:8080/api/audio/72f66f1d-2403-40d3-8f47-c8d515c97b53")
  }
}
