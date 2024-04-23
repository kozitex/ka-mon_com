'use strict';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class Kageigeta {
  constructor() {
    this.frontColor = 0xffffff;
    this.backColor  = 0x111111;
    this.guideColor = 0x808080;
    this.gridColor = 0x333333;
    this.gridThinColor = 0x1a1a1a;

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
    this.camera.position.set( 0, 0, 5000 );

    // シーン
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( this.backColor );

    this.ceiling = 1600;
    this.guidelines = [];
    this.mainlines = [];
    this.count = 0;
    this.clock = 0;
    this.f =[1280, 1180, 1060, 960, 500, 400];
    this.typeNum = [
      [{type: 0, num: 2}, {type: 3, num: 2}],
      [{type: 3, num: 2}, {type: 0, num: 0}],
      [{type: 0, num: 0}, {type: 3, num: 5}],
      [{type: 3, num: 5}, {type: 0, num: 2}],
      [{type: 0, num: 2}, {type: 2, num: 5}],
      [{type: 2, num: 5}, {type: 0, num: 0}],
      [{type: 0, num: 0}, {type: 2, num: 2}],
      [{type: 2, num: 2}, {type: 0, num: 2}],
    ];

    // フレーム・グリッドの描画
    this.drawFrame();
    this.drawGrid();

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
    this.drawMainLine();
    // this.drawMainLine(mainOuter1);
    // this.drawMainLine(mainOuter2);
    // this.drawMainLine(mainInner1);
    // this.drawMainLine(mainInner2);

    // 塗りつぶし図形の描画
    // this.drawMainFill(mainOuter1, mainOuter2);
    // this.drawMainFill(mainInner1, mainInner2);

    const controls = new OrbitControls( this.camera, this.renderer.domElement);
    controls.target.set( 0, 0, 0 );
    controls.update();

    controls.addEventListener( 'change', this.render );

    window.addEventListener( 'resize', this.onWindowResize );

    // 描画ループ開始
    this.render();
  }

  // フレームの描画
  drawFrame = () => {
    const framePoints = [
      {x: - this.ceiling, y:   this.ceiling},
      {x:   this.ceiling, y:   this.ceiling},
      {x:   this.ceiling, y: - this.ceiling},
      {x: - this.ceiling, y: - this.ceiling},
      {x: - this.ceiling, y:   this.ceiling},
      {x: - this.ceiling, y:            0},
      {x:   this.ceiling, y:            0},
      {x:            0, y:            0},
      {x:            0, y:   this.ceiling},
      {x:            0, y: - this.ceiling},
    ];
    const points = [];
    framePoints.forEach((point) => {
      points.push( new THREE.Vector3(point.x, point.y, 0));
    });
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial({
      color: this.gridColor,
      side: THREE.DoubleSide
    });
    this.line = new THREE.Line( geometry, material );
    this.scene.add( this.line );
  }

  // グリッドの描画
  drawGrid = () => {
    const start = - this.ceiling;
    for (var i = 0;i <= 1;i ++) {
      var axis = start;
      for (var j = 0;j <= 30;j ++) {
        axis += 100;
        if (axis == 0) continue;
        const points = [];
        if (i == 0) {
          points.push( new THREE.Vector3(axis,   this.ceiling, 0));
          points.push( new THREE.Vector3(axis, - this.ceiling, 0));
        } else {
          points.push( new THREE.Vector3(   this.ceiling, axis, 0));
          points.push( new THREE.Vector3( - this.ceiling, axis, 0));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.LineBasicMaterial({
          color: this.gridThinColor,
          side: THREE.DoubleSide
        });
        this.line = new THREE.Line( geometry, material );
        this.scene.add( this.line );
      }
    }
  }

  // ガイドラインの描画
  drawGuideline = () => {
    for (var i = 0;i <= 3;i ++) {
      for (var j = 0;j <= 5;j ++) {
        const points = this.getGuidelineVector(i, j);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: this.guideColor,
          side: THREE.DoubleSide,
        });
        const line = new THREE.Line( geometry, material );
        this.guidelines.push(line);
        this.scene.add( line );
      }
    }
  }

  // ガイドラインの方程式
  guidelineEq = (type, num, x, y) => {
    // const f =[1280, 1180, 1060, 960, 500, 400];
    var pm = this.getPmType(type);
    if (y == undefined) {
      return pm[0] * 0.8 * x + pm[1] * this.f[num];
    } else {
      return pm[2] * 1.25 * y - pm[3] * 1.25 * this.f[num];
    }
  }

  // 正負タイプを返す
  getPmType = (type) => {
    var pm = [];
    switch (type) {
      case 0:
        pm = [1, 1, 1, 1];
        break;
      case 1:
        pm = [1, -1, 1, -1];
        break;
      case 2:
        pm = [-1, 1, -1, -1];
        break;
      case 3:
        pm = [-1, -1, -1, 1];
        break;
    }
    return pm;
  } 

  // ガイドラインの始点・終点の座標を取得
  getGuidelineVector = (i, j) => {
    var points = [];
    var interX, interY;
    switch (i) {
      case 0:
        interX = -1600, interY =  1600;
        break;
      case 1:
        interX =  1600, interY = -1600;
        break;
      case 2:
        interX =  1600, interY =  1600;
        break;
      case 3:
        interX = -1600, interY = -1600;
        break;
    }
    const start = {x: interX, y: this.guidelineEq(i, j, interX, undefined)};
    const end   = {x: this.guidelineEq(i, j, undefined, interY), y: interY};

    points.push(new THREE.Vector3(start.x, start.y, 0));

    const pitch = (end.x - start.x) / 100;
    for (var k = 0;k <= 99;k ++) {
      const midX = start.x + (pitch * k);
      const mid = {x: midX, y: this.guidelineEq(i, j, midX, undefined)}
      points.push(new THREE.Vector3(mid.x, mid.y, 0));
    }
    points.push(new THREE.Vector3(end.x, end.y, 0));
    return points;
  }

  // 本線の描画
  // drawMainLine = (vertices) => {
  //   const material = new THREE.LineBasicMaterial({
  //     color: this.frontColor,
  //     side: THREE.DoubleSide,
  //   });
  //   const points = [];
  //   const num = vertices.length - 1;
  //   for (var i = 0;i <= 3;i ++) {
  //     for (var j = 0;j <= num;j ++) {
  //       var cooX;
  //       var cooY;
  //       if (i == 0) {
  //         cooX = vertices[j].x;
  //         cooY = vertices[j].y;
  //       } else if (i == 1) {
  //         cooX = - vertices[num - j].x;
  //         cooY = vertices[num - j].y;
  //       } else if (i == 2) {
  //         cooX = - vertices[j].x;
  //         cooY = - vertices[j].y;

  //       } else if (i == 3) {
  //         cooX = vertices[num - j].x;
  //         cooY = - vertices[num - j].y;
  //       }
  //       points.push(new THREE.Vector3(cooX, cooY, 0));
  //     }
  //   }
  //   const geometry = new THREE.BufferGeometry().setFromPoints(points);
  //   const line = new THREE.Line(geometry, material);
  //   this.scene.add(line);
  // }


  drawMainLine = () => {
    for (var k = 0;k <= 3;k ++) {
      const points = [];
      for (var i = 0;i <= this.typeNum.length - 1;i ++) {
        const typeNum = this.typeNum[i];
        var coor = this.intersect(typeNum[0].type, typeNum[0].num, typeNum[1].type, typeNum[1].num);
        if (k == 1) {
          coor.x = - coor.x;
        } else if (k == 2) {
          coor.x = - coor.x, coor.y = - coor.y;
        } else if (k == 3) {
          coor.y = - coor.y;
        }
        // console.log(k, coor.x, coor.y);
        // if (i > 0) {
        //   const preTypeNum = this.typeNum[i - 1];
        //   const preCoor = this.intersect(preTypeNum[0].type, preTypeNum[0].num, preTypeNum[1].type, preTypeNum[1].num);
        //   if (k == 1) {
        //     preCoor.x = - preCoor.x;
        //   } else if (k == 2) {
        //     preCoor.x = - preCoor.x, preCoor.y = - preCoor.y;
        //   } else if (k == 3) {
        //     preCoor.y = - preCoor.y;
        //   }
        //   console.log(k, preCoor.x, preCoor.y);
        //   const pitch = (coor.x - preCoor.x) / 10;
        //   for (var j = 0;j <= 9;j ++) {
        //     const divX = preCoor.x + (pitch * j);
        //     const divY = this.guidelineEq(preTypeNum[1].type, preTypeNum[1].num, divX, undefined);
        //     points.push(new THREE.Vector3(divX, divY, 0));
        //   }
        // }
        // console.log(coor.x, coor.y);
        points.push(new THREE.Vector3(coor.x, coor.y, 0));
      }
      const material = new THREE.LineBasicMaterial({
        color: this.frontColor,
        side: THREE.DoubleSide,
      });
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      this.mainlines.push(line);
      this.scene.add(line);
    }
  }

  // ２直線の交点を求める式
  intersect = (type1, num1, type2, num2) => {
    var pm1 = this.getPmType(type1);
    var pm2 = this.getPmType(type2);
    // console.log(pm1, pm2);
    const interX = (-pm1[1] * this.f[num1] + pm2[1] * this.f[num2]) / (0.8 * (pm1[0] - pm2[0]));
    const interY = pm1[0] * 0.8 * interX + pm1[1] * this.f[num1];
    // console.log(interX, interY);
    return {x: interX, y: interY};
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

    this.clock ++;

    // console.log(this.count, this.count - 50);
    this.guidelines.forEach((guideline) => {
      guideline.geometry.setDrawRange(0, this.count);
    });
    this.mainlines.forEach((mainline) => {
      mainline.geometry.setDrawRange(0, this.count - 110);
    });
    if (this.clock%2 == 0) this.count ++;

    // 画面に表示
    this.renderer.render(this.scene, this.camera);
  }
}
