import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LouderService {
  serv = 'https://louderyoutube.video:3001/';
  constructor(private http: HttpClient) { }
  findVideo(link) {
    return this.http.get(this.serv + 'FindVideo/' + link);
  }
  randomVideo() {
    return this.http.get(this.serv + 'Random');
  }
}
