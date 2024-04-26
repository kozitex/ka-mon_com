'use strict';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

window.addEventListener('DOMContentLoaded', () => {
  new Kageigeta_proto();
});

export default class Kageigeta_proto {
  constructor() {
    this.frontColor    = 0xffffff;
    this.backColor     = 0x111111;
    this.guideColor    = 0x666666;
    this.gridColor     = 0x333333;
    this.gridThinColor = 0x1a1a1a;

    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight

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
    this.grids = [];
    this.guidelines = [];
    this.mainlines = [];
    this.mainfills = [];
    this.count = 0;
    this.guideAxises = [
      [ 1,  1,  1,  1],
      [ 1, -1,  1, -1],
      [-1,  1, -1, -1],
      [-1, -1, -1,  1]
    ];
    this.mainAxises = [
      {x:  1, y:  1},
      {x: -1, y:  1},
      {x: -1, y: -1},
      {x:  1, y: -1},
    ];
    this.nums = [1280, 1180, 1060, 960, 500, 400];
    this.crossGroups = [
      [
        [{type: 0, num: 2}, {type: 3, num: 2}],
        [{type: 3, num: 2}, {type: 0, num: 0}],
        [{type: 0, num: 0}, {type: 3, num: 5}],
        [{type: 3, num: 5}, {type: 0, num: 2}],
        [{type: 0, num: 2}, {type: 2, num: 5}],
        [{type: 2, num: 5}, {type: 0, num: 0}],
        [{type: 0, num: 0}, {type: 2, num: 2}],
        [{type: 2, num: 2}, {type: 0, num: 2}],
      ],
      [
        [{type: 0, num: 3}, {type: 3, num: 3}],
        [{type: 3, num: 3}, {type: 0, num: 1}],
        [{type: 0, num: 1}, {type: 3, num: 4}],
        [{type: 3, num: 4}, {type: 0, num: 3}],
        [{type: 0, num: 3}, {type: 2, num: 4}],
        [{type: 2, num: 4}, {type: 0, num: 1}],
        [{type: 0, num: 1}, {type: 2, num: 3}],
        [{type: 2, num: 3}, {type: 0, num: 3}],
      ],
      [
        [{type: 3, num: 4}, {type: 0, num: 4}],
        [{type: 0, num: 4}, {type: 2, num: 4}],
      ],
      [
        [{type: 3, num: 5}, {type: 0, num: 5}],
        [{type: 0, num: 5}, {type: 2, num: 5}],
      ],
    ];

    // フレーム・グリッドの描画
    this.drawFrame();
    this.drawGrid();

    // ガイドラインの描画
    this.drawGuideline();

    // 本線の描画
    this.drawMainLine();

    // 塗りつぶし図形の描画
    // this.drawMainFill();

    const controls = new OrbitControls( this.camera, this.renderer.domElement);
    controls.target.set( 0, 0, 0 );
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;
    controls.update();

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
      {x: - this.ceiling, y:              0},
      {x:   this.ceiling, y:              0},
      {x:              0, y:              0},
      {x:              0, y:   this.ceiling},
      {x:              0, y: - this.ceiling},
    ];
    const points = [];
    framePoints.forEach((point) => {
      points.push( new THREE.Vector3(point.x, point.y, 0));
    });
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial({
      color: this.gridColor,
      side: THREE.DoubleSide,
      transparent: true
    });
    const line = new THREE.Line( geometry, material );
    this.grids.push(line);
    this.scene.add( line );
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
          side: THREE.DoubleSide,
          transparent: true
        });
        const line = new THREE.Line( geometry, material );
        this.grids.push(line);
        this.scene.add(line);
      }
    }
  }

  // ガイドラインの描画
  drawGuideline = () => {
    for (var i = 0;i <= 3;i ++) {
      const lines = [];
      for (var j = 0;j <= 5;j ++) {
        const points = this.getGuidelineVector(i, j);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.setDrawRange(0, 0);
        const material = new THREE.LineBasicMaterial({
          color: this.guideColor,
          side: THREE.DoubleSide,
          transparent: true
          // opacity: 1.0
        });
        const line = new THREE.Line( geometry, material );
        lines.push(line);
        this.scene.add(line);
      }
      this.guidelines.push(lines);
    }
  }

  guidelineEqY = (index, num, x) => {
    var pm = this.guideAxises[index];
    return pm[0] * 0.8 * x + pm[1] * this.nums[num];
  }

  guidelineEqX = (index, num, y) => {
    var pm = this.guideAxises[index];
    return pm[2] * 1.25 * y - pm[3] * 1.25 * this.nums[num];
  }

  // ガイドラインの始点・終点の座標を取得
  getGuidelineVector = (index, num) => {
    var points = [];
    var interX, interY;
    switch (index) {
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
    const start = {x: interX, y: this.guidelineEqY(index, num, interX)};
    const end   = {x: this.guidelineEqX(index, num, interY), y: interY};

    points.push(new THREE.Vector3(start.x, start.y, 0));
    const divCount = 200;
    for (var k = 0;k <= divCount - 1;k ++) {
      const midX = THREE.MathUtils.damp(start.x, end.x, 10, k / divCount);
      const mid = {x: midX, y: this.guidelineEqY(index, num, midX)}
      points.push(new THREE.Vector3(mid.x, mid.y, 0));
    }
    points.push(new THREE.Vector3(end.x, end.y, 0));
    return points;
  }

  // 本線の描画
  drawMainLine = () => {
    this.crossGroups.forEach((crossLines) => {
      const lines = [];
      this.mainAxises.forEach((pm) => {
        for (var i = 0;i <= crossLines.length - 1;i ++) {
          const points = [];
          const crossLine = crossLines[i];
          var coor = this.intersect(crossLine[0].type, crossLine[0].num, crossLine[1].type, crossLine[1].num);
          // console.log(coor);
          if (i > 0) {
            const preTypeNum = crossLines[i - 1];
            const preCoor = this.intersect(preTypeNum[0].type, preTypeNum[0].num, preTypeNum[1].type, preTypeNum[1].num);
            const divCount = 150;
            for (var j = 0;j <= divCount - 1;j ++) {
              const divX = THREE.MathUtils.damp(coor.x, preCoor.x, 10, j / divCount);
              const divY = this.guidelineEqY(preTypeNum[1].type, preTypeNum[1].num, divX);
              points.push(new THREE.Vector3(divX * pm.x, divY * pm.y, 0));
            }
          }
          points.push(new THREE.Vector3(coor.x * pm.x, coor.y * pm.y, 0));
          const material = new THREE.LineBasicMaterial({
            color: this.frontColor,
            side: THREE.DoubleSide,
            transparent: true
          });
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          geometry.setDrawRange(0, 0);
          const line = new THREE.Line(geometry, material);
          line.computeLineDistances();
          lines.push(line);
          this.scene.add(line);
        }
      })
      this.mainlines.push(lines);
    })
  }

  // ２直線の交点を求める式
  intersect = (type1, num1, type2, num2) => {
    var pm1 = this.guideAxises[type1];
    var pm2 = this.guideAxises[type2];
    const interX = (-pm1[1] * this.nums[num1] + pm2[1] * this.nums[num2]) / (0.8 * (pm1[0] - pm2[0]));
    const interY = pm1[0] * 0.8 * interX + pm1[1] * this.nums[num1];
    return {x: interX, y: interY};
  }

  // 塗りつぶし図形の描画
  drawMainFill = () => {
    for (var k = 0;k <= 2;k += 2) {
      const shape = new THREE.Shape();
      for (var j = 0;j <= this.mainAxises.length - 1;j ++) {
        const pm = this.mainAxises[j];
        const count = this.crossGroups[k].length - 1;
        for (var i = 0;i <= count;i ++) {
          var crossLine = this.crossGroups[k][j == 0 || j == 2 ? i : (count - i)];
          const inter = this.intersect(crossLine[0].type, crossLine[0].num, crossLine[1].type, crossLine[1].num);
          if (i == 0) {
            shape.moveTo(inter.x * pm.x, inter.y * pm.y);
          } else {
            shape.lineTo(inter.x * pm.x, inter.y * pm.y);
          }
        }
      }
      const path = new THREE.Path();
      for (var j = 0;j <= this.mainAxises.length - 1;j ++) {
        const pm = this.mainAxises[j];
        const count = this.crossGroups[k].length - 1;
        for (var i = 0;i <= count;i ++) {
          var crossLine = this.crossGroups[k + 1][j == 0 || j == 2 ? i : (count - i)];
          const inter = this.intersect(crossLine[0].type, crossLine[0].num, crossLine[1].type, crossLine[1].num);
          if (i == 0) {
            path.moveTo(inter.x * pm.x, inter.y * pm.y);
          } else {
            path.lineTo(inter.x * pm.x, inter.y * pm.y);
          }
        }
      }

      shape.holes.push(path);

      const material = new THREE.MeshBasicMaterial({
        color: this.frontColor,
        side: THREE.DoubleSide,
        opacity: 0.0,
        transparent: true
      });
      const geometry = new THREE.ShapeGeometry(shape);
      const mesh = new THREE.Mesh(geometry, material);
      this.mainfills.push(mesh);
      this.scene.add(mesh);
    }
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

    const tSec = Math.trunc(sec);

    if (sec > 0.5) {

      this.guidelines.forEach((lines) => {
        const num = lines.length - 1;
        for (var i = 0;i <= num;i ++) {
          const delay = THREE.MathUtils.lerp(0, 90, i / 6);
          lines[num - i].geometry.setDrawRange(0, this.count - delay);
        }
      });

      for (var i = 0;i <= this.mainlines.length - 1;i ++) {
        this.mainlines[i].forEach((mainline) => {
          mainline.geometry.setDrawRange(0, this.count - (160 + (i * 5)));
        });
      }

      // for (var i = 0;i <= this.mainfills.length - 1;i ++) {
      //   this.mainfills[i].material.opacity = THREE.MathUtils.damp(0.0, 1.0, 2, (this.count - 250) / 60);
      // }

      // this.guidelines.forEach((lines) => {
      //   const num = lines.length - 1;
      //   for (var i = 0;i <= num;i ++) {
      //     lines[i].material.opacity = THREE.MathUtils.damp(1.0, 0.0, 2, (this.count - 250) / 60);
      //   }
      // });

      // this.grids.forEach((grid) => {
      //   // console.log(this.grids.length);
      //   // const num = grid.length - 1;
      //   // for (var i = 0;i <= num;i ++) {
      //     grid.material.opacity = THREE.MathUtils.damp(1.0, 0.0, 2, (this.count - 250) / 60);
      //     // grid.visible = false;
      //   // }
      // });

      // if (sec > 6) {
      //   this.guidelines.forEach((lines) => {
      //     const num = lines.length - 1;
      //     for (var i = 0;i <= num;i ++) {
      //       // lines[i].material.opacity = THREE.MathUtils.damp(1.0, 0.0, 2, (this.count - 250) / 60);
      //       lines[i].visible = false;
      //     }
      //   });
  
      //   this.grids.forEach((grid) => {
      //       grid.visible = false;
      //   });
      // }

      if (tSec%1 == 0) {
        this.count ++;
      }

    }

    // 画面に表示
    this.renderer.render(this.scene, this.camera);
  }
}
