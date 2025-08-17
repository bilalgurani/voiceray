import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'timeAgo',
  pure: false
})

export class TimeAgoPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const now = new Date().getTime();
    const upload = new Date(value).getTime();
    const diffInSeconds = Math.floor((now - upload) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} sec ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} min ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hr ago`;
    } else if (diffInSeconds < 2592000) {
      return `${Math.floor(diffInSeconds / 86400)} day ago`;
    } else {
      return new Date(value).toLocaleDateString();
    }
  }
}