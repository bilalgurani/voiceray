import { Injectable } from '@angular/core';
import { AudioCard } from '../model/audio-details.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioList: AudioCard[] = [

  ]

  getAudioById(id: number): Observable<AudioCard | undefined> {
    return of(this.audioList.find(audio => audio.id === id));
  }

  getAllAudio(): Observable<AudioCard[]> {
    return of(this.audioList);
  }
}
