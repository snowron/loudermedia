import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { LouderService } from "./louder.service";

import * as THREE from 'three/src/Three';

import { OrbitControls } from 'three/examples//jsm/controls/OrbitControls.js';
import { Water } from 'three/examples//jsm/objects/Water.js';
import { Sky } from 'three/examples//jsm/objects/Sky.js';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild("video", { static: false }) video;
  title: String = 'Make Youtube Song Louder !';
  context = new AudioContext();
  source = ""
  header = "Make Youtube Song Louder !"
  selectedValues: String[] = [];
  videoLink: string;
  loading: boolean = false;
  videoExist: boolean = false;
  gainPower = 1;
  gainNode;
  filterNode; filterNode2;
  theVideo;
  constructor(private serv: LouderService) { }


  ngAfterViewInit(): void {

    var container, stats;
    var camera, scene, renderer;
    var controls, water, sun, mesh;

    init();
    animate();

    function init() {

      container = document.getElementById('wow');

      //

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      //

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
      camera.position.set(30, 30, 100);

      //

      sun = new THREE.Vector3();

      // Water

      var waterGeometry = new THREE.PlaneBufferGeometry(10000, 10000);

      water = new Water(
        waterGeometry,
        {
          textureWidth: 512,
          textureHeight: 512,
          waterNormals: new THREE.TextureLoader().load('assets/waternormals.jpg', function (texture) {

            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

          }),
          alpha: 1.0,
          sunDirection: new THREE.Vector3(),
          sunColor: 0xffffff,
          waterColor: 0x001e0f,
          distortionScale: 3.7,
          fog: scene.fog !== undefined
        }
      );

      water.rotation.x = - Math.PI / 2;

      scene.add(water);

      // Skybox

      var sky = new Sky();
      sky.scale.setScalar(10000);
      scene.add(sky);

      var uniforms = sky.material.uniforms;

      uniforms['turbidity'].value = 10;
      uniforms['rayleigh'].value = 2;
      uniforms['mieCoefficient'].value = 0.005;
      uniforms['mieDirectionalG'].value = 0.8;

      var parameters = {
        inclination: 0.49,
        azimuth: 0.205
      };

      var pmremGenerator = new THREE.PMREMGenerator(renderer);

      function updateSun() {

        var theta = Math.PI * (parameters.inclination - 0.5);
        var phi = 2 * Math.PI * (parameters.azimuth - 0.5);

        sun.x = Math.cos(phi);
        sun.y = Math.sin(phi) * Math.sin(theta);
        sun.z = Math.sin(phi) * Math.cos(theta);

        sky.material.uniforms['sunPosition'].value.copy(sun);
        water.material.uniforms['sunDirection'].value.copy(sun).normalize();


      }

      updateSun();

      //

      var geometry = new THREE.BoxBufferGeometry(30, 30, 30);
      var material = new THREE.MeshStandardMaterial({ roughness: 0 });

      mesh = new THREE.Mesh(geometry, material);


      //

      controls = new OrbitControls(camera, renderer.domElement);
      controls.maxPolarAngle = Math.PI * 0.495;
      controls.target.set(50, 10, 0);
      controls.minDistance = 40.0;
      controls.maxDistance = 200.0;
      controls.update();

      //

      window.addEventListener('resize', onWindowResize, false);

    }

    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function animate() {

      requestAnimationFrame(animate);
      render();


    }

    function render() {

      var time = performance.now() * 0.001;

      mesh.position.y = Math.sin(time) * 20 + 5;
      mesh.rotation.x = time * 0.5;
      mesh.rotation.z = time * 0.51;

      water.material.uniforms['time'].value += 1.0 / 60.0;

      renderer.render(scene, camera);

    }

    var sourceNode = this.context.createMediaElementSource(this.video.nativeElement);
    this.filterNode = this.context.createBiquadFilter();
    this.filterNode.type = 'highpass';
    this.filterNode.frequency.value = 80;
    this.filterNode2 = this.context.createBiquadFilter();
    this.filterNode2.type = 'lowshelf';
    this.filterNode2.frequency.value = 4;
    sourceNode.connect(this.gainNode).connect(this.filterNode).connect(this.filterNode2).connect(this.context.destination)

  }
  ngOnInit(): void {

    this.gainNode = this.context.createGain();
  }
  handleChange($event) {
    this.gainNode.gain.value = $event.value
  }
  findVideo(id?): void {
    let regexp = /(.+?)(\/)(watch\x3Fv=)?(embed\/watch\x3Ffeature\=player_embedded\x26v=)?([a-zA-Z0-9_-]{11})+/
    var ex = id ? id : regexp.exec(this.videoLink)[5]
    if (ex.length == 11) {
      this.context.resume().then(() => {
        this.loading = true
        this.serv.findVideo(ex).subscribe((res: any) => {
          this.loading = false
          this.videoExist = true
          this.source = "https://louderyoutube.s3.eu-central-1.amazonaws.com/" + res.video_id
          this.header = res.title
          document.getElementById("inside").style.height = "450px"
          this.theVideo = res
          this.video.nativeElement.classList.add("slide-in-top")
        })
      })
    }
  }
}
