export class AudioCard {
  constructor(public id: number, public title: string, public speaker: string, public audioFile: any, public uploadDate: Date, public thumbnailUrl: string, public speakerImage?: string) {
  }
}