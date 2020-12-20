import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { LouderService } from './louder.service';
import { DeviceDetectorService } from 'ngx-device-detector';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('video', { static: false }) video;
  title = 'Make Youtube Song Louder !';
  context = new AudioContext();
  source = '';
  header = 'Make Youtube Song Louder !';
  videoLink = '';
  loading = false;
  videoExist = false;
  gainPower = 1;
  gainNode;
  filterNode; filterNode2;
  theVideo;
  remainSecondsTimer; remainSecondsForNext = 0;

  constructor(private serv: LouderService, private deviceService: DeviceDetectorService) {

  }
  ngAfterViewInit(): void {
    this.callEventListeners();
    this.initAudioAPI();
    const isMobile = this.deviceService.isMobile();
    if (!isMobile) {
    }
  }
  callEventListeners() {
    this.video.nativeElement.addEventListener('pause', (event) => {
      clearInterval(this.remainSecondsTimer);
    });
    this.video.nativeElement.addEventListener('seeking', (event) => {
      this.remainSecondsForNext = parseInt(this.video.nativeElement.duration) - parseInt(this.video.nativeElement.currentTime);
    });
    this.video.nativeElement.addEventListener('play', (event) => {
      this.remainSecondsTimer = setInterval(() => {
        this.remainSecondsForNext -= 1;
        if (this.remainSecondsForNext === 1) {
          this.findVideo(this.theVideo.nextVideo.id);
          clearInterval(this.remainSecondsTimer);
        }
      }, 1000);
    });
  }
  initAudioAPI() {
    this.gainNode = this.context.createGain();
    const sourceNode = this.context.createMediaElementSource(this.video.nativeElement);
    this.filterNode = this.context.createBiquadFilter();
    this.filterNode.type = 'highpass';
    this.filterNode.frequency.value = 80;
    this.filterNode2 = this.context.createBiquadFilter();
    this.filterNode2.type = 'lowshelf';
    this.filterNode2.frequency.value = 4;
    sourceNode.connect(this.gainNode).connect(this.filterNode).connect(this.filterNode2).connect(this.context.destination);

  }
  handleChange($event) {
    this.gainNode.gain.value = $event.value;
  }
  findVideo(id?): void {
    if (this.videoLink.length > 0) {
      const regexp = /(.+?)(\/)(watch\x3Fv=)?(embed\/watch\x3Ffeature\=player_embedded\x26v=)?([a-zA-Z0-9_-]{11})+/;
      const expression = id ? id : regexp.exec(this.videoLink)[5];
      if (expression.length === 11) {
        this.context.resume().then(() => {
          this.loading = true;
          this.serv.findVideo(expression).subscribe((res: any) => {
            this.loading = false;
            this.videoExist = true;
            this.source = 'https://louderyoutube.video:3002/' + res.url;
            this.header = res.title;
            this.theVideo = res;
            this.video.nativeElement.classList.add('slide-in-bck-center');
            this.remainSecondsForNext = res.length;
          }, error => alert('Not Found Try Again With Another Link'));
        });
      }
    } else {
      alert('The box is empty, Give me a link');
    }
  }
  randomVideo(): void {
    this.context.resume().then(() => {
      this.loading = true;
      this.serv.randomVideo().subscribe((res: any) => {
        this.loading = false;
        this.videoExist = true;
        this.videoLink = res.video_url
        this.source = 'https://louderyoutube.video:3002/' + res.url;
        this.header = res.title;
        this.theVideo = res;
        this.video.nativeElement.classList.add('slide-in-bck-center');
        this.remainSecondsForNext = res.length;
      }, error => alert('Wow! That is my fault'));
    });
  }
  formatRemainSecondsForNext(remainSecondsForNext) {
    return Math.floor(remainSecondsForNext / 60) + ':' + remainSecondsForNext % 60;
  }

}
