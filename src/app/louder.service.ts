import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class LouderService {
  serv = "https://qduzapzs99.execute-api.eu-central-1.amazonaws.com/"
  constructor(private http: HttpClient) {

  }

  findVideo() {
    return this.http.get(this.serv + "FindVideo")
  }


}
