import { inject, Injectable } from '@angular/core';
import { AudioCard } from '../model/audio-details.model';
import { catchError, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private http = inject(HttpClient);
  private metadataLoaded = false;
  allMetadata: any;

  getAudioById(id: number): Observable<any> {
    if (this.metadataLoaded) {
      const audio = this.allMetadata.find((item: any) => item.id === id);
      if (audio) {
        return of(audio)
      }
    }
    
    return this.http.get(`https://voiceray-service.onrender.com/api/audio/${id}`)
  }

  loadAllMetadata(): Observable<any[]> {
    if (this.allMetadata) {
      return of(this.allMetadata);
    }
    return this.http.get('https://voiceray-service.onrender.com/api/audio/allMetadata').pipe(
      tap((metadata: any) => {
        this.allMetadata = metadata;
        this.metadataLoaded = true;
      }),
      catchError(() => of([]))
    );
  }

  saveAudioMetadata(formData: FormData) {
    return this.http.post("https://voiceray-service.onrender.com/api/audio/upload", formData).pipe(
      tap(() => {
        this.metadataLoaded = false;
        this.allMetadata = [];
      })
    )
  }
}
