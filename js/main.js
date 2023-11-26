import '../style.css'
import * as THREE from 'three';
import { SmoothScroll } from './smoothScroll';

import fragment from './shaders/fragment.glsl';
import vertex from "./shaders/vertex.glsl";

const canvas = document.querySelector('.webgl')
const scrollable = document.querySelector('.scrollable');

class CanvasWebgl{
  constructor(canvas){
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.textureLoader = new THREE.TextureLoader();
    this.images = [...document.querySelectorAll('.container')];
    this.meshes = [];
 
    this.setDimensions();
    this.setup();
    this.addEventListeners()
    this.createMesh()

    // Smooth scroll
    this.smoothScroll = new SmoothScroll(scrollable);
    this.animate();
  }

  setDimensions(){
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
    this.aspectRatio = this.sizes.width / this.sizes.height 
  }

  setup(){
    this.perspective = 1000;
    this.fov = 2* Math.atan((this.sizes.height / 2) / this.perspective) * 180 / Math.PI;
    this.camera = new THREE.PerspectiveCamera(this.fov, this.aspectRatio, 0.1,1000)
    this.camera.position.z = this.perspective;
    this.scene.add(this.camera)

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
  }



  addEventListeners(){
    // Reset camera dimensions on screen resize
    window.addEventListener('resize', () => {
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight
      this.aspectRatio = this.sizes.width / this.sizes.height;
      // Update camera
    
      this.camera.aspect = this.aspectRatio;
      this.camera.fov = 2* Math.atan((this.sizes.height / 2) / this.perspective) * 180 / Math.PI;
      this.camera.updateProjectionMatrix();
  
      // Update Renderer
      this.renderer.setSize(this.sizes.width, this.sizes.height)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
    })
  }

  createMesh(){
    for(let i = 0; i < this.images.length; i++){
      let imageTexture = this.textureLoader.load(this.images[i].children[0].src);
      let mesh = new MeshItem(this.images[i], imageTexture, this.scene);
      this.meshes.push(mesh);
    
    }
  }

  animate(){
    this.smoothScroll.animate()
    for(let i = 0; i < this.meshes.length; i++){
      this.meshes[i].updateMesh();
    }
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.animate.bind(this))
  }
}


class MeshItem{
  constructor(src, texture, scene){
    this.src = src;
    this.texture = texture;
  
    // Center the texture to the plane
    this.texture.center.set(0.5, 0.5)
    this.image = this.src.children[0]
    this.scene = scene;
    this.offset = new THREE.Vector2(0,0); // Positions of mesh on screen. Will be updated below.
    this.sizes = new THREE.Vector2(0,0); //Size of mesh on screen. Will be updated below.
    this.setDimensions()
    this.createMesh()
  }

  setDimensions(){

    const {width, height, top, left} = this.src.getBoundingClientRect();

    this.sizes.set(width, height);
    this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2); 

}

  createMesh(){
  
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1,1,20,20),
      new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        // wireframe: true,
        uniforms: {
          time: {value: 0},
          uTexture: {value: this.texture},
          uTextureSize: {value: new THREE.Vector2(this.image.offsetWidth, this.image.offsetHeight)},
          uPlaneResolution: {value: new THREE.Vector2(this.src.offsetWidth, this.src.offsetHeight)}
        },
        vertexShader: vertex,
        fragmentShader: fragment
       }
      )
    )

    this.scene.add(this.mesh);
  }

  updateMesh(){

    this.setDimensions();
    this.mesh.material.uniforms.uTextureSize.value.set(this.image.offsetWidth, this.image.offsetHeight)
    this.mesh.material.uniforms.uPlaneResolution.value.set(this.src.offsetWidth, this.src.offsetHeight)
    this.mesh.position.set(this.offset.x, this.offset.y, 0);
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
  }
}
new CanvasWebgl(canvas)