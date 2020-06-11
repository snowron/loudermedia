import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { LouderService } from "./louder.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild("video", { static: false }) video;
  title: String = 'loudermedia';
  context = new AudioContext();
  test = ""
  header = "Make Youtube Song Louder !"
  selectedValues: String[] = [];
  videoLink: String;
  loading: boolean = false;
  videoExist: boolean = false;
  gainPower = 1;
  gainNode;
  cardStyle = { width: '470px', height: '100px' }
  constructor(private serv: LouderService) { }
  ngAfterViewInit(): void {
    var sourceNode = this.context.createMediaElementSource(this.video.nativeElement);
    sourceNode.connect(this.gainNode).connect(this.context.destination)
  }

  ngOnInit(): void {
    this.gainNode = this.context.createGain();
  }
  handleChange($event) {
    this.gainNode.gain.value = $event.value
  }
  findVideo(): void {
    this.loading = true
    this.serv.findVideo().subscribe((res: any) => {
      this.loading = false
      this.videoExist = true
      this.test = "https://testtss.s3.amazonaws.com/cat2.mp4"
      this.header = "song name 2"
      document.getElementById("inside").style.height = "450px"
      this.cardStyle.height = "450px"
      this.video.nativeElement.classList.add("slide-in-top")
      alert(res)

    })
  }
}
