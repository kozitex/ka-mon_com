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
    document.body.appendChild( this.renderer.domElement );

    // カメラ
    this.camera = new THREE.PerspectiveCamera( 45, this.w / this.h, 1, 10000 );
    this.camera.position.set( 0, 0, 4000 );

    // シーン
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( this.backColor );

    // 外枠の描画
    // this.drawLine();
    this.drawFrame();

    // ガイドラインの描画
    this.drawGuideline();

    // 頂点の座標
    const mainOuter1 = [
      {x: -1031, y:     0},
      {x: -1136, y:    78},
      {x:  -836, y:   312},
      {x:  -728, y:   231},
      {x:  -301, y:   559},
      {x:  -406, y:   641},
      {x:  -105, y:   873},
      {x:     0, y:   791},
    ];

    const mainOuter2 = [
      {x:  -935, y:     0},
      {x: -1039, y:    80},
      {x:  -835, y:   237},
      {x:  -730, y:   157},
      {x:  -205, y:   560},
      {x:  -308, y:   641},
      {x:  -104, y:   797},
      {x:     0, y:   717},
    ];

    const mainInner1 = [
      {x:  -525, y:     0},
      {x:     0, y:   403},
    ];

    const mainInner2 = [
      {x:  -427, y:     0},
      {x:     0, y:   328},
    ];

    // 本線の描画（外側の表）
    this.drawMainLine(mainOuter1);
    this.drawMainLine(mainOuter2);
    this.drawMainLine(mainInner1);
    this.drawMainLine(mainInner2);

    // 塗りつぶし図形の描画
    this.drawMainFill(mainOuter1, mainOuter2);
    this.drawMainFill(mainInner1, mainInner2);

    const controls = new OrbitControls( this.camera, this.renderer.domElement);
    controls.target.set( 0, 0, 0 );
    controls.update();

    controls.addEventListener( 'change', this.render );

    window.addEventListener( 'resize', this.onWindowResize );

    // 描画ループ開始
    this.render();
  }

  // drawLine = () => {
  //   const vertex = 1240;
  //   const shape = new THREE.Shape()
  //           .moveTo(- vertex,   vertex)
  //           .lineTo(  vertex,   vertex)
  //           .lineTo(  vertex, - vertex)
  //           .lineTo(- vertex, - vertex)
  //           .lineTo(- vertex,   vertex);
  //   const material = new THREE.LineBasicMaterial({
  //   // const material = new THREE.MeshBasicMaterial({
  //     color: this.guideColor,
  //     side: THREE.DoubleSide,
      
  //   });
  //   // shape.autoClose = true;

  //   const points = shape.getPoints();
  //   const geometry = new THREE.BufferGeometry().setFromPoints( points );


  //   // const geometry = new THREE.ShapeGeometry(shape);
  //   const mesh = new THREE.Line(geometry, material);
  //   this.scene.add(mesh);

  // }

  // フレームの描画
  drawFrame = () => {
    // 外枠の描画
    const material = new THREE.LineBasicMaterial({
      color: this.guideColor,
      side: THREE.DoubleSide
    });
    const vertex = 1240;
    // this.vertex = 0;
    const points = [];
    points.push( new THREE.Vector3(- vertex,   vertex, 0));
    points.push( new THREE.Vector3(  vertex,   vertex, 0));
    points.push( new THREE.Vector3(  vertex, - vertex, 0));
    points.push( new THREE.Vector3(- vertex, - vertex, 0));
    points.push( new THREE.Vector3(- vertex,   vertex, 0));
    // points.push( new THREE.Vector3(- this.vertex.value,   this.vertex.value, 0));
    // points.push( new THREE.Vector3(  this.vertex.value,   this.vertex.value, 0));
    // points.push( new THREE.Vector3(  this.vertex.value, - this.vertex.value, 0));
    // points.push( new THREE.Vector3(- this.vertex.value, - this.vertex.value, 0));
    // points.push( new THREE.Vector3(- this.vertex.value,   this.vertex.value, 0));
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    this.line = new THREE.Line( geometry, material );
    this.scene.add( this.line );

    // // 外枠の描画（背景付き）
    // const vertex = 1240;
    // const shape = new THREE.Shape()
    //         .moveTo(- vertex,   vertex)
    //         .lineTo(  vertex,   vertex)
    //         .lineTo(  vertex, - vertex)
    //         .lineTo(- vertex, - vertex);
    // const material = new THREE.MeshBasicMaterial({
    //   color: this.frontColor,
    //   side: THREE.DoubleSide
    // });
    // const geometry = new THREE.ShapeGeometry(shape);
    // const mesh = new THREE.Mesh(geometry, material);
    // this.scene.add(mesh);
  }

  // ガイドラインの描画
  drawGuideline = () => {
    const base = new THREE.Vector3(16130, 12390, 0);
    const guideVertices = [
      {start: {x: -1239, y:     0}, end: {x:   374, y:  1239}},
      {start: {x: -1239, y:   -74}, end: {x:   472, y:  1239}},
      {start: {x: -1239, y:  -160}, end: {x:   584, y:  1239}},
      {start: {x: -1239, y:  -234}, end: {x:   680, y:  1239}},
      {start: {x: -1239, y:  -550}, end: {x:  1092, y:  1239}},
      {start: {x: -1239, y:  -623}, end: {x:  1187, y:  1239}},
      {start: {x: -1186, y: -1239}, end: {x:  1239, y:   622}},
      {start: {x: -1091, y: -1239}, end: {x:  1239, y:   549}},
      {start: {x:  -680, y: -1239}, end: {x:  1239, y:   234}},
      {start: {x:  -584, y: -1239}, end: {x:  1239, y:   160}},
      {start: {x:  -469, y: -1239}, end: {x:  1239, y:    71}},
      {start: {x:  -373, y: -1239}, end: {x:  1239, y:     0}},
    ];
    for(var i = 0;i <= 1;i ++) {
      guideVertices.forEach((vertex) => {
        const material = new THREE.LineBasicMaterial({
          color: this.guideColor,
          side: THREE.DoubleSide,
        });
        const points = [];
        // const startX = i == 0 ? vertex.start.x : -vertex.start.x;
        // const endX = i == 0 ? vertex.end.x : -vertex.end.x;
        // const start = new THREE.Vector3(startX, vertex.start.y, 0);
        // const end = new THREE.Vector3(endX, vertex.end.y, 0);
        const start = new THREE.Vector3(i == 0 ? vertex.start.x - 16130 : - vertex.start.x + 16130, vertex.start.y - 12390, 0);
        const end = new THREE.Vector3(i == 0 ? vertex.end.x + 16130 : - vertex.end.x - 16130, vertex.end.y + 12390, 0);
        points.push(i == 0 ? start : start.negate());
        points.push(i == 0 ? end : end.negate());
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line( geometry, material );
        this.scene.add( line );
      });
    }
  }

  // 本線の描画
  drawMainLine = (vertices) => {
    const material = new THREE.LineBasicMaterial({
      color: this.frontColor,
      side: THREE.DoubleSide,
    });
    const points = [];
    const num = vertices.length - 1;
    for (var i = 0;i <= 3;i ++) {
      for (var j = 0;j <= num;j ++) {
        var cooX;
        var cooY;
        if (i == 0) {
          cooX = vertices[j].x;
          cooY = vertices[j].y;
        } else if (i == 1) {
          cooX = - vertices[num - j].x;
          cooY = vertices[num - j].y;
        } else if (i == 2) {
          cooX = - vertices[j].x;
          cooY = - vertices[j].y;

        } else if (i == 3) {
          cooX = vertices[num - j].x;
          cooY = - vertices[num - j].y;
        }
        points.push(new THREE.Vector3(cooX, cooY, 0));
      }
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
  }

  // 塗りつぶし図形の描画
  drawMainFill = (shapeVer, pathVer) => {
    // 塗りつぶす範囲を描画
    const shape = new THREE.Shape();
    const shapeNum = shapeVer.length - 1;
    for (var i = 0;i <= 3;i ++) {
      for (var j = 0;j <= shapeNum;j ++) {
        var shapeVerX;
        var shapeVerY;
        if (i == 0) {
          shapeVerX = shapeVer[j].x;
          shapeVerY = shapeVer[j].y;
        } else if (i == 1) {
          shapeVerX = - shapeVer[shapeNum - j].x;
          shapeVerY = shapeVer[shapeNum - j].y;
        } else if (i == 2) {
          shapeVerX = - shapeVer[j].x;
          shapeVerY = - shapeVer[j].y;
        } else if (i == 3) {
          shapeVerX = shapeVer[shapeNum - j].x;
          shapeVerY = - shapeVer[shapeNum - j].y;
        }
        if (j == 0) {
          shape.moveTo(shapeVerX, shapeVerY);
        } else {
          shape.lineTo(shapeVerX, shapeVerY);
        }
      }
    }

    // 切り抜く範囲を描画
    const path = new THREE.Path();
    const pathNum = pathVer.length - 1;
    for (var i = 0;i <= 3;i ++) {
      for (var j = 0;j <= pathNum;j ++) {
        var pathVerX;
        var pathVerY;
        if (i == 0) {
          pathVerX = pathVer[j].x;
          pathVerY = pathVer[j].y;
        } else if (i == 1) {
          pathVerX = - pathVer[pathNum - j].x;
          pathVerY = pathVer[pathNum - j].y;
        } else if (i == 2) {
          pathVerX = - pathVer[j].x;
          pathVerY = - pathVer[j].y;
        } else if (i == 3) {
          pathVerX = pathVer[pathNum - j].x;
          pathVerY = - pathVer[pathNum - j].y;
        }
        if (j == 0) {
          path.moveTo(pathVerX, pathVerY);
        } else {
          path.lineTo(pathVerX, pathVerY);
        }
      }
    }

    shape.holes.push(path);

    const material = new THREE.MeshBasicMaterial({
      color: this.frontColor,
      side: THREE.DoubleSide
    });
    const geometry = new THREE.ShapeGeometry(shape);
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
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

    const vertex = 1240;
    const points = [];
    points.push( new THREE.Vector3(- vertex,   vertex, 0));
    points.push( new THREE.Vector3(  vertex,   vertex, 0));
    points.push( new THREE.Vector3(  vertex, - vertex, 0));
    points.push( new THREE.Vector3(- vertex, - vertex, 0));
    // points.push( new THREE.Vector3(- vertex,   vertex, 0));

    // this.line.geometry. .setFromPoints(points);
    this.line.geometry.setDrawRange(0, 2);

    // 画面に表示
    this.renderer.render(this.scene, this.camera);
  }
}
