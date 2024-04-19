'use strict';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class Kageigeta {
  constructor() {
    this.frontColor = 0xffffff;
    this.backColor  = 0x111111;
    this.guideColor = 0x808080;

    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight

    // スクロール量
    this.scroll = 0;

    // レンダラー
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(this.w, this.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  
    // DOMにレンダラーのcanvasを追加
    // const room = document.getElementById('room');
    // room.appendChild(this.renderer.domElement);
    document.body.appendChild( this.renderer.domElement );

    // カメラ
    // this.camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 10, -10);
    this.camera = new THREE.PerspectiveCamera( 45, this.w / this.h, 1, 10000 );
    this.camera.position.set( 0, 0, 4000 );

    // シーン
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( this.backColor );

    // 外枠の描画
    const material = new THREE.LineBasicMaterial( { color: this.guideColor } );
    const points = [];
    points.push( new THREE.Vector3( -1240,  1240, 0 ) );
    points.push( new THREE.Vector3(  1240,  1240, 0 ) );
    points.push( new THREE.Vector3(  1240, -1240, 0 ) );
    points.push( new THREE.Vector3( -1240, -1240, 0 ) );
    points.push( new THREE.Vector3( -1240,  1240, 0 ) );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line( geometry, material );
    this.scene.add( line );

    // ガイドラインの描画
    const guideXys = [
      {start: {x: -1239, y:     0}, end: {x:   374, y: 1239}},
      {start: {x: -1239, y:   -74}, end: {x:   472, y: 1239}},
      {start: {x: -1239, y:  -160}, end: {x:   584, y: 1239}},
      {start: {x: -1239, y:  -234}, end: {x:   680, y: 1239}},
      {start: {x: -1239, y:  -550}, end: {x:  1092, y: 1239}},
      {start: {x: -1239, y:  -623}, end: {x:  1187, y: 1239}},
      {start: {x: -1186, y: -1239}, end: {x:  1239, y:  622}},
      {start: {x: -1091, y: -1239}, end: {x:  1239, y:  549}},
      {start: {x:  -680, y: -1239}, end: {x:  1239, y:  234}},
      {start: {x:  -584, y: -1239}, end: {x:  1239, y:  160}},
      {start: {x:  -469, y: -1239}, end: {x:  1239, y:    71}},
      {start: {x:  -373, y: -1239}, end: {x:  1239, y:    0}},
      {start: {x:  1239, y:     0}, end: {x:  -374, y: 1239}},
      {start: {x:  1239, y:   -74}, end: {x:  -472, y: 1239}},
      {start: {x:  1239, y:  -160}, end: {x:  -584, y: 1239}},
      {start: {x:  1239, y:  -234}, end: {x:  -680, y: 1239}},
      {start: {x:  1239, y:  -550}, end: {x: -1092, y: 1239}},
      {start: {x:  1239, y:  -623}, end: {x: -1187, y: 1239}},
      {start: {x:  1186, y: -1239}, end: {x: -1239, y:  622}},
      {start: {x:  1091, y: -1239}, end: {x: -1239, y:  549}},
      {start: {x:   680, y: -1239}, end: {x: -1239, y:  234}},
      {start: {x:   584, y: -1239}, end: {x: -1239, y:  160}},
      {start: {x:   469, y: -1239}, end: {x: -1239, y:   71}},
      {start: {x:   373, y: -1239}, end: {x: -1239, y:    0}},
    ];
    guideXys.forEach((xy) => {
      const material = new THREE.LineBasicMaterial( { color: this.guideColor } );
      const points = [];
      points.push( new THREE.Vector3( xy.start.x, xy.start.y, 0 ) );
      points.push( new THREE.Vector3( xy.end.x, xy.end.y, 0 ) );
      const geometry = new THREE.BufferGeometry().setFromPoints( points );
      const line = new THREE.Line( geometry, material );
      this.scene.add( line );
    });

    // 本線の描画（外側の表）
    const mainXys1 = [
      {x: -1031, y:     0},
      {x: -1136, y:    78},
      {x:  -836, y:   312},
      {x:  -728, y:   231},
      {x:  -301, y:   559},
      {x:  -406, y:   641},
      {x:  -105, y:   873},
      {x:     0, y:   791},
      {x:   105, y:   873},
      {x:   406, y:   641},
      {x:   301, y:   559},
      {x:   728, y:   231},
      {x:   836, y:   312},
      {x:  1136, y:    78},
      {x:  1031, y:     0},
      {x:  1136, y:   -78},
      {x:   836, y:  -312},
      {x:   728, y:  -231},
      {x:   301, y:  -559},
      {x:   406, y:  -641},
      {x:   105, y:  -873},
      {x:     0, y:  -791},
      {x:  -105, y:  -873},
      {x:  -406, y:  -641},
      {x:  -301, y:  -559},
      {x:  -728, y:  -231},
      {x:  -836, y:  -312},
      {x: -1136, y:   -78},
      {x: -1031, y:     0},
    ];
    const mainMat1 = new THREE.LineBasicMaterial( { color: this.frontColor } );
    const mainPoints1 = [];
    mainXys1.forEach((xy) => {
      mainPoints1.push( new THREE.Vector3( xy.x, xy.y, 0 ) );
    });
    const mainGeo1 = new THREE.BufferGeometry().setFromPoints( mainPoints1 );
    const mainLine1 = new THREE.Line( mainGeo1, mainMat1 );
    this.scene.add( mainLine1 );

    // 本線の描画（外側の裏）
    const mainXys2 = [
      {x:  -935, y:     0},
      {x: -1039, y:    80},
      {x:  -835, y:   237},
      {x:  -730, y:   157},
      {x:  -205, y:   560},
      {x:  -308, y:   641},
      {x:  -104, y:   797},
      {x:     0, y:   717},
      {x:   104, y:   797},
      {x:   308, y:   641},
      {x:   205, y:   560},
      {x:   730, y:   157},
      {x:   835, y:   237},
      {x:  1039, y:    80},
      {x:   935, y:     0},
      {x:  1039, y:   -80},
      {x:   835, y:  -237},
      {x:   730, y:  -157},
      {x:   205, y:  -560},
      {x:   308, y:  -641},
      {x:   104, y:  -797},
      {x:     0, y:  -717},
      {x:  -104, y:  -797},
      {x:  -308, y:  -641},
      {x:  -205, y:  -560},
      {x:  -730, y:  -157},
      {x:  -835, y:  -237},
      {x: -1039, y:   -80},
      {x:  -935, y:     0},
    ];
    const mainMat2 = new THREE.LineBasicMaterial( { color: this.frontColor } );
    const mainPoints2 = [];
    mainXys2.forEach((xy) => {
      mainPoints2.push( new THREE.Vector3( xy.x, xy.y, 0 ) );
    });
    const mainGeo2 = new THREE.BufferGeometry().setFromPoints( mainPoints2 );
    const mainLine2 = new THREE.Line( mainGeo2, mainMat2 );
    this.scene.add( mainLine2 );

    // 本線の描画（内側の表）
    const mainXys3 = [
      {x:  -525, y:     0},
      {x:     0, y:   403},
      {x:   525, y:     0},
      {x:     0, y:  -403},
      {x:     0, y:  -403},
      {x:  -525, y:     0},
    ];
    const mainMat3 = new THREE.LineBasicMaterial( { color: this.frontColor } );
    const mainPoints3 = [];
    mainXys3.forEach((xy) => {
      mainPoints3.push( new THREE.Vector3( xy.x, xy.y, 0 ) );
    });
    const mainGeo3 = new THREE.BufferGeometry().setFromPoints( mainPoints3 );
    const mainLine3 = new THREE.Line( mainGeo3, mainMat3 );
    this.scene.add( mainLine3 );

    // 本線の描画（内側の裏）
    const mainXys4 = [
      {x:  -427, y:     0},
      {x:     0, y:   328},
      {x:   427, y:     0},
      {x:     0, y:  -328},
      {x:     0, y:  -328},
      {x:  -427, y:     0},
    ];
    const mainMat4 = new THREE.LineBasicMaterial( { color: this.frontColor } );
    const mainPoints4 = [];
    mainXys4.forEach((xy) => {
      mainPoints4.push( new THREE.Vector3( xy.x, xy.y, 0 ) );
    });
    const mainGeo4 = new THREE.BufferGeometry().setFromPoints( mainPoints4 );
    const mainLine4 = new THREE.Line( mainGeo4, mainMat4 );
    this.scene.add( mainLine4 );



    // const mainXys = [
    //   {start: {x: -1031, y:     0}, end: {x: -1136, y:    78}},
    //   {start: {x: -1136, y:    78}, end: {x:  -836, y:   312}},
    //   {start: {x:  -836, y:   312}, end: {x:  -728, y:   231}},
    //   {start: {x:  -728, y:   231}, end: {x:  -301, y:   559}},
    //   {start: {x:  -301, y:   559}, end: {x:  -406, y:   641}},
    //   {start: {x:  -406, y:   641}, end: {x:  -105, y:   873}},
    //   {start: {x:  -105, y:   873}, end: {x:     0, y:   791}},
    //   {start: {x:     0, y:   791}, end: {x:   105, y:   873}},
    //   {start: {x:   105, y:   873}, end: {x:   406, y:   641}},
    //   {start: {x:   406, y:   641}, end: {x:   301, y:   559}},
    //   {start: {x:   301, y:   559}, end: {x:   728, y:  231}},
    //   {start: {x:   728, y:   231}, end: {x:   836, y:   312}},
    //   {start: {x:   836, y:   312}, end: {x:  1136, y:    78}},
    //   {start: {x:  1136, y:    78}, end: {x:  1031, y:     0}},
    //   // {start: {x:  -469, y: -1239}, end: {x:  1239, y:    71}},
    //   // {start: {x:  -373, y: -1239}, end: {x:  1239, y:    0}},
    //   // {start: {x:  1239, y:     0}, end: {x:  -374, y: 1239}},
    //   // {start: {x:  1239, y:   -74}, end: {x:  -472, y: 1239}},
    //   // {start: {x:  1239, y:  -160}, end: {x:  -584, y: 1239}},
    //   // {start: {x:  1239, y:  -234}, end: {x:  -680, y: 1239}},
    //   // {start: {x:  1239, y:  -550}, end: {x: -1092, y: 1239}},
    //   // {start: {x:  1239, y:  -623}, end: {x: -1187, y: 1239}},
    //   // {start: {x:  1186, y: -1239}, end: {x: -1239, y:  622}},
    //   // {start: {x:  1091, y: -1239}, end: {x: -1239, y:  549}},
    //   // {start: {x:   680, y: -1239}, end: {x: -1239, y:  234}},
    //   // {start: {x:   584, y: -1239}, end: {x: -1239, y:  160}},
    //   // {start: {x:   469, y: -1239}, end: {x: -1239, y:   71}},
    //   // {start: {x:   373, y: -1239}, end: {x: -1239, y:    0}},
    // ];
    // mainXys.forEach((xy) => {
    //   const material = new THREE.LineBasicMaterial( { color: this.frontColor } );
    //   const points = [];
    //   points.push( new THREE.Vector3( xy.start.x, xy.start.y, 0 ) );
    //   points.push( new THREE.Vector3( xy.end.x, xy.end.y, 0 ) );
    //   const geometry = new THREE.BufferGeometry().setFromPoints( points );
    //   const line = new THREE.Line( geometry, material );
    //   this.scene.add( line );
    // });

    const controls = new OrbitControls( this.camera, this.renderer.domElement );
    controls.target.set( 0, 0, 0 );
    controls.update();

    controls.addEventListener( 'change', this.render );

    window.addEventListener( 'resize', this.onWindowResize );

    // 描画ループ開始
    this.render();
  }

  onWindowResize = () => {
    this.w = window.innerWidth;
    this.h = window.innerHeight

    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.w, this.h);

    this.render();
  }

  render = () => {
    // 次のフレームを要求
    requestAnimationFrame(() => this.render());

    const sec = performance.now() / 1000;

    // 画面に表示
    this.renderer.render(this.scene, this.camera);
  }
}
