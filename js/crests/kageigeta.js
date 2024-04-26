'use strict';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Grid from './grid.js';

export default class Kageigeta {
  constructor() {
    this.frontColor    = 0xffffff;
    this.backColor     = 0x111111;
    this.guideColor    = 0x666666;
    this.gridColor     = 0x333333;
    this.gridThinColor = 0x1a1a1a;

    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight

    // フレームのサイズ
    this.size = 1600;

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

    this.a = [0.8, -0.8];
    this.b = [1280, 1180, 1060, 960, 500, 400];
    

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
    this.grid = new Grid();
    this.scene.add(this.grid.generate());

    // ガイドラインの作成
    this.generateGuideline();

    // 本線の作成
    this.generateMainLine();




    // this.guideGroup1 = new THREE.Group();
    // const as = [0.8, -0.8];
    // const bs = [1280,  1180, -1280, -1180];
    // as.forEach((a) => {
    //   bs.forEach((b) => {
    //     var startX, endY;
    //     if ((a > 0 && b > 0) || (a < 0 && b < 0)) {
    //       startX = -1600;
    //     } else {
    //       startX = 1600;
    //     }
    //     if (b > 0) {
    //       endY = 1600;
    //     } else {
    //       endY = -1600;
    //     }
    //     const start = {x: startX, y: a * startX + b};
    //     const end   = {x: (endY - b) / a, y: endY};

    //     // console.log(a, b, start, end);

    //     var points = [];
    //     const divCount = 200;
    //     for (var k = 0;k <= divCount - 1;k ++) {
    //       const midX = THREE.MathUtils.damp(start.x, end.x, 10, k / divCount);
    //       const mid = {x: midX, y: a * midX + b};
    //       points.push(new THREE.Vector3(mid.x, mid.y, 0));
    //     }
    //     const geometry = new THREE.BufferGeometry().setFromPoints(points);
    //     // geometry.setDrawRange(0, 0);
    //     const material = new THREE.LineBasicMaterial({
    //       color: this.guideColor,
    //       side: THREE.DoubleSide,
    //       transparent: true
    //     });
    //     const line = new THREE.Line(geometry, material);
    //     this.guideGroup1.add(line);
    //     this.scene.add(line);
    //   })
    // })

    // for (var i = 0;i <= as.length - 1;i ++) {
    //   for (var j = 0;j <= bs.length - 1;j ++) {

      
    //   }
    // }


    // this.drawGuideline();

    // 本線の描画
    // this.drawMainLine();

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

  // ガイドラインを作成
  generateGuideline = () => {
    const a = 0.8;
    const bs = [400, 500, 960, 1060, 1180, 1280];
    const g = this.size;
    const divCount = 200;
    var start, end;
    this.guidelineGroup = [];
    bs.forEach((b) => {
      const group = [];
      for (var q = 0;q <= 3;q ++) {
        var points = [];
        if (q == 0) {
          start = {x: (-g), y: (a * -g + b)};
          end   = {x: ((g - b) / a), y: (g)};
          for (var d = 0;d <= divCount - 1;d ++) {
            const midX = THREE.MathUtils.damp(start.x, end.x, 10, d / divCount);
            const mid = {x: midX, y: (a) * midX + (b)};
            points.push(new THREE.Vector3(mid.x, mid.y, 0));
          }
        } else if (q == 1) {
          start = {x: ((g - b) / -a), y: (g)};
          end   = {x: (g), y: (-a * g + b)};
          for (var d = 0;d <= divCount - 1;d ++) {
            const midX = THREE.MathUtils.damp(start.x, end.x, 10, d / divCount);
            const mid = {x: midX, y: (-a) * midX + (b)};
            points.push(new THREE.Vector3(mid.x, mid.y, 0));
          }
        } else if (q == 2) {
          start = {x: (g), y: (a * g - b)};
          end   = {x: ((-g + b) / a), y: (-g)};
          for (var d = 0;d <= divCount - 1;d ++) {
            const midX = THREE.MathUtils.damp(start.x, end.x, 10, d / divCount);
            const mid = {x: midX, y: (a) * midX + (-b)};
            points.push(new THREE.Vector3(mid.x, mid.y, 0));
          }
        } else if (q == 3) {
          start = {x: ((-g + b) / -a), y: (-g)};
          end   = {x: (-g), y: (-a * -g - b)};
          for (var d = 0;d <= divCount - 1;d ++) {
            const midX = THREE.MathUtils.damp(start.x, end.x, 10, d / divCount);
            const mid = {x: midX, y: (-a) * midX + (-b)};
            points.push(new THREE.Vector3(mid.x, mid.y, 0));
          }
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.setDrawRange(0, 0);
        const material = new THREE.LineBasicMaterial({
          color: this.guideColor,
          side: THREE.DoubleSide,
          transparent: true
        });
        const line = new THREE.Line(geometry, material);
        group.push(line);
        this.scene.add(line);
      }
      this.guidelineGroup.push(group);
    })
  }

  // 本線を作成
  generateMainLine = () => {
    const a = 0.8;
    // const bs = [400, 500, 960, 1060, 1180, 1280];
    const bs = [400, 500, 960, 1060, 500, 500, 400, 400, 1180, 1180, 1280, 1280, 960, 960, 1060, 1060];
    const g = 0;
    const divCount = 200;
    var start, end;
    this.mainlineGroup = [];
    var index = 0;
    bs.forEach((b) => {
      const group = [];
      for (var q = 0;q <= 3;q ++) {
        var points = [];
        if (index <= 1) {
          var a1, b1, a2, b2, a3, b3;
          if (q == 0) {
            a1 =  a, b1 =  b;
            a2 = -a, b2 = -b;
            a3 = -a, b3 =  b;
          } else if (q == 1) {
            a1 = -a, b1 =  b;
            a2 =  a, b2 =  b;
            a3 =  a, b3 = -b;
          } else if (q == 2) {
            a1 =  a, b1 = -b;
            a2 = -a, b2 =  b;
            a3 = -a, b3 = -b;
          } else if (q == 3) {
            a1 = -a, b1 = -b;
            a2 =  a, b2 = -b;
            a3 =  a, b3 =  b;
          }
        } else if (index == 2) {
          var a1, b1, a2, b2, a3, b3;
          const c = 500;
          if (q == 0) {
            a1 =  a, b1 =  b;
            a2 = -a, b2 = -c;
            a3 = -a, b3 =  c;
          } else if (q == 1) {
            a1 = -a, b1 =  b;
            a2 =  a, b2 =  c;
            a3 =  a, b3 = -c;
          } else if (q == 2) {
            a1 =  a, b1 = -b;
            a2 = -a, b2 =  c;
            a3 = -a, b3 = -c;
          } else if (q == 3) {
            a1 = -a, b1 = -b;
            a2 =  a, b2 = -c;
            a3 =  a, b3 =  c;
          }
        } else if (index == 3) {
          var a1, b1, a2, b2, a3, b3;
          const c = 400;
          if (q == 0) {
            a1 =  a, b1 =  b;
            a2 = -a, b2 = -c;
            a3 = -a, b3 =  c;
          } else if (q == 1) {
            a1 = -a, b1 =  b;
            a2 =  a, b2 =  c;
            a3 =  a, b3 = -c;
          } else if (q == 2) {
            a1 =  a, b1 = -b;
            a2 = -a, b2 =  c;
            a3 = -a, b3 = -c;
          } else if (q == 3) {
            a1 = -a, b1 = -b;
            a2 =  a, b2 = -c;
            a3 =  a, b3 =  c;
          }
        } else if (index == 4) {
          var a1, b1, a2, b2, a3, b3;
          const c = 960;
          const d = 1180;
          if (q == 0) {
            a1 = -a, b1 = -b;
            a2 =  a, b2 =  c;
            a3 =  a, b3 =  d;
          } else if (q == 1) {
            a1 =  a, b1 =  b;
            a2 = -a, b2 =  c;
            a3 = -a, b3 =  d;
          } else if (q == 2) {
            a1 = -a, b1 =  b;
            a2 =  a, b2 = -c;
            a3 =  a, b3 = -d;
          } else if (q == 3) {
            a1 =  a, b1 = -b;
            a2 = -a, b2 = -c;
            a3 = -a, b3 = -d;
          }
        } else if (index == 5) {
          var a1, b1, a2, b2, a3, b3;
          const c = 960;
          const d = 1180;
          if (q == 0) {
            a1 = -a, b1 =  b;
            a2 =  a, b2 =  c;
            a3 =  a, b3 =  d;
          } else if (q == 1) {
            a1 =  a, b1 = -b;
            a2 = -a, b2 =  c;
            a3 = -a, b3 =  d;
          } else if (q == 2) {
            a1 = -a, b1 = -b;
            a2 =  a, b2 = -c;
            a3 =  a, b3 = -d;
          } else if (q == 3) {
            a1 =  a, b1 =  b;
            a2 = -a, b2 = -c;
            a3 = -a, b3 = -d;
          }
        } else if (index == 6) {
          var a1, b1, a2, b2, a3, b3;
          const c = 1060;
          const d = 1280;
          if (q == 0) {
            a1 = -a, b1 = -b;
            a2 =  a, b2 =  c;
            a3 =  a, b3 =  d;
          } else if (q == 1) {
            a1 =  a, b1 =  b;
            a2 = -a, b2 =  c;
            a3 = -a, b3 =  d;
          } else if (q == 2) {
            a1 = -a, b1 =  b;
            a2 =  a, b2 = -c;
            a3 =  a, b3 = -d;
          } else if (q == 3) {
            a1 =  a, b1 = -b;
            a2 = -a, b2 = -c;
            a3 = -a, b3 = -d;
          }
        } else if (index == 7) {
          var a1, b1, a2, b2, a3, b3;
          const c = 1060;
          const d = 1280;
          if (q == 0) {
            a1 = -a, b1 =  b;
            a2 =  a, b2 =  c;
            a3 =  a, b3 =  d;
          } else if (q == 1) {
            a1 =  a, b1 = -b;
            a2 = -a, b2 =  c;
            a3 = -a, b3 =  d;
          } else if (q == 2) {
            a1 = -a, b1 = -b;
            a2 =  a, b2 = -c;
            a3 =  a, b3 = -d;
          } else if (q == 3) {
            a1 =  a, b1 =  b;
            a2 = -a, b2 = -c;
            a3 = -a, b3 = -d;
          }
        } else if (index == 8) {
          var a1, b1, a2, b2, a3, b3;
          const c = 500;
          const d = 960;
          if (q == 0) {
            a1 =  a, b1 =  b;
            a2 = -a, b2 = -c;
            a3 = -a, b3 = -d;
          } else if (q == 1) {
            a1 = -a, b1 =  b;
            a2 =  a, b2 =  c;
            a3 =  a, b3 =  d;
          } else if (q == 2) {
            a1 =  a, b1 = -b;
            a2 = -a, b2 =  c;
            a3 = -a, b3 =  d;
          } else if (q == 3) {
            a1 = -a, b1 = -b;
            a2 =  a, b2 = -c;
            a3 =  a, b3 = -d;
          }
        } else if (index == 9) {
          var a1, b1, a2, b2, a3, b3;
          const c = 500;
          const d = 960;
          if (q == 0) {
            a1 =  a, b1 =  b;
            a2 = -a, b2 =  c;
            a3 = -a, b3 =  d;
          } else if (q == 1) {
            a1 = -a, b1 =  b;
            a2 =  a, b2 = -c;
            a3 =  a, b3 = -d;
          } else if (q == 2) {
            a1 =  a, b1 = -b;
            a2 = -a, b2 = -c;
            a3 = -a, b3 = -d;
          } else if (q == 3) {
            a1 = -a, b1 = -b;
            a2 =  a, b2 =  c;
            a3 =  a, b3 =  d;
          }
        } else if (index == 10) {
          var a1, b1, a2, b2, a3, b3;
          const c = 400;
          const d = 1060;
          if (q == 0) {
            a1 =  a, b1 =  b;
            a2 = -a, b2 = -c;
            a3 = -a, b3 = -d;
          } else if (q == 1) {
            a1 = -a, b1 =  b;
            a2 =  a, b2 =  c;
            a3 =  a, b3 =  d;
          } else if (q == 2) {
            a1 =  a, b1 = -b;
            a2 = -a, b2 =  c;
            a3 = -a, b3 =  d;
          } else if (q == 3) {
            a1 = -a, b1 = -b;
            a2 =  a, b2 = -c;
            a3 =  a, b3 = -d;
          }
        } else if (index == 11) {
          var a1, b1, a2, b2, a3, b3;
          const c = 400;
          const d = 1060;
          if (q == 0) {
            a1 =  a, b1 =  b;
            a2 = -a, b2 =  c;
            a3 = -a, b3 =  d;
          } else if (q == 1) {
            a1 = -a, b1 =  b;
            a2 =  a, b2 = -c;
            a3 =  a, b3 = -d;
          } else if (q == 2) {
            a1 =  a, b1 = -b;
            a2 = -a, b2 = -c;
            a3 = -a, b3 = -d;
          } else if (q == 3) {
            a1 = -a, b1 = -b;
            a2 =  a, b2 =  c;
            a3 =  a, b3 =  d;
          }
        } else if (index == 12) {
          var a1, b1, a2, b2, a3, b3;
          const c = 1180;
          const d = 960;
          if (q == 0) {
            a1 = -a, b1 = -b;
            a2 =  a, b2 =  c;
            a3 =  a, b3 =  d;
          } else if (q == 1) {
            a1 =  a, b1 =  b;
            a2 = -a, b2 =  c;
            a3 = -a, b3 =  d;
          } else if (q == 2) {
            a1 = -a, b1 =  b;
            a2 =  a, b2 = -c;
            a3 =  a, b3 = -d;
          } else if (q == 3) {
            a1 =  a, b1 = -b;
            a2 = -a, b2 = -c;
            a3 = -a, b3 = -d;
          }
        } else if (index == 13) {
          var a1, b1, a2, b2, a3, b3;
          const c = 1180;
          const d = 960;
          if (q == 0) {
            a1 = -a, b1 =  b;
            a2 =  a, b2 =  c;
            a3 =  a, b3 =  d;
          } else if (q == 1) {
            a1 =  a, b1 = -b;
            a2 = -a, b2 =  c;
            a3 = -a, b3 =  d;
          } else if (q == 2) {
            a1 = -a, b1 = -b;
            a2 =  a, b2 = -c;
            a3 =  a, b3 = -d;
          } else if (q == 3) {
            a1 =  a, b1 =  b;
            a2 = -a, b2 = -c;
            a3 = -a, b3 = -d;
          }
        } else if (index == 14) {
          var a1, b1, a2, b2, a3, b3;
          const c = 1280;
          const d = 1060;
          if (q == 0) {
            a1 = -a, b1 = -b;
            a2 =  a, b2 =  c;
            a3 =  a, b3 =  d;
          } else if (q == 1) {
            a1 =  a, b1 =  b;
            a2 = -a, b2 =  c;
            a3 = -a, b3 =  d;
          } else if (q == 2) {
            a1 = -a, b1 =  b;
            a2 =  a, b2 = -c;
            a3 =  a, b3 = -d;
          } else if (q == 3) {
            a1 =  a, b1 = -b;
            a2 = -a, b2 = -c;
            a3 = -a, b3 = -d;
          }
        } else if (index == 15) {
          var a1, b1, a2, b2, a3, b3;
          const c = 1280;
          const d = 1060;
          if (q == 0) {
            a1 = -a, b1 =  b;
            a2 =  a, b2 =  c;
            a3 =  a, b3 =  d;
          } else if (q == 1) {
            a1 =  a, b1 = -b;
            a2 = -a, b2 =  c;
            a3 = -a, b3 =  d;
          } else if (q == 2) {
            a1 = -a, b1 = -b;
            a2 =  a, b2 = -c;
            a3 =  a, b3 = -d;
          } else if (q == 3) {
            a1 =  a, b1 =  b;
            a2 = -a, b2 = -c;
            a3 = -a, b3 = -d;
          }
        }

        start = {x: (b2 - b1) / (a1 - a2), y: (a1 * b2 - a2 * b1) / (a2 - a1)};
        end   = {x: (b3 - b1) / (a1 - a3), y: (a1 * b3 - a3 * b1) / (a3 - a1)};
        for (var d = 0;d <= divCount - 1;d ++) {
          const midX = THREE.MathUtils.damp(start.x, end.x, 10, d / divCount);
          const mid = {x: midX, y: a1 * midX + b1};
          points.push(new THREE.Vector3(mid.x, mid.y, 0));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.setDrawRange(0, 0);
        const material = new THREE.LineBasicMaterial({
          color: this.frontColor,
          side: THREE.DoubleSide,
          transparent: true
        });
        const line = new THREE.Line(geometry, material);
        group.push(line);
        this.scene.add(line);
        // index ++;
      }
      this.mainlineGroup.push(group);
      index ++;
    })
    // console.log(this.mainlineGroup);
  }

  // guidelineEqY = (index, num, x) => {
  //   var pm = this.guideAxises[index];
  //   return pm[0] * 0.8 * x + pm[1] * this.nums[num];
  // }

  // guidelineEqX = (index, num, y) => {
  //   var pm = this.guideAxises[index];
  //   return pm[2] * 1.25 * y - pm[3] * 1.25 * this.nums[num];
  // }

  // // ガイドラインの始点・終点の座標を取得
  // getGuidelineVector = (index, num) => {
  //   var points = [];
  //   var interX, interY;
  //   switch (index) {
  //     case 0:
  //       interX = -1600, interY =  1600;
  //       break;
  //     case 1:
  //       interX =  1600, interY = -1600;
  //       break;
  //     case 2:
  //       interX =  1600, interY =  1600;
  //       break;
  //     case 3:
  //       interX = -1600, interY = -1600;
  //       break;
  //   }
  //   const start = {x: interX, y: this.guidelineEqY(index, num, interX)};
  //   const end   = {x: this.guidelineEqX(index, num, interY), y: interY};

  //   points.push(new THREE.Vector3(start.x, start.y, 0));
  //   const divCount = 200;
  //   for (var k = 0;k <= divCount - 1;k ++) {
  //     const midX = THREE.MathUtils.damp(start.x, end.x, 10, k / divCount);
  //     const mid = {x: midX, y: this.guidelineEqY(index, num, midX)}
  //     points.push(new THREE.Vector3(mid.x, mid.y, 0));
  //   }
  //   points.push(new THREE.Vector3(end.x, end.y, 0));
  //   return points;
  // }

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

    const sec = performance.now();

    // ガイドラインの表示アニメーション
    for (var i = 0;i <= this.guidelineGroup.length - 1;i ++) {
      const lines = this.guidelineGroup[i];
      const linesLen = lines.length;
      for(var j = 0;j <= linesLen - 1;j ++) {
        const num = 24;
        const line = lines[j];
        const index = (i * linesLen) + j;
        const delay = THREE.MathUtils.lerp(0, 3000, index / num);
        if (i <= 1) {
          line.geometry.setDrawRange(0, (sec - (500 + delay)) / 30);
        } else if (i <= 4) {
          line.geometry.setDrawRange(0, (sec - (1800 + delay)) / 30);
        } else {
          line.geometry.setDrawRange(0, (sec - (2400 + delay)) / 30);
        }
      }
    }

    // 本線の表示アニメーション
    for (var i = 0;i <= this.mainlineGroup.length - 1;i ++) {
      const lines = this.mainlineGroup[i];
      const linesLen = lines.length;
      for(var j = 0;j <= linesLen - 1;j ++) {
        const num = 16;
        const line = lines[j];
        const index = (i * linesLen) + j;
        const delay = THREE.MathUtils.lerp(0, (500 - (i * 31)), j / linesLen);
        if (i <= 1) {
          line.geometry.setDrawRange(0, (sec - (1600 + (i * 300) + delay)) / (30 - (i * 2)));
        } else {
          line.geometry.setDrawRange(0, (sec - (3200 + (i * 300) + delay)) / (20 - (i * 1)));
        }
      }
    }


    // 本線を描画
    // for (var i = 0;i <= this.mainlines.length - 1;i ++) {
    //   this.mainlines[i].forEach((mainline) => {
    //     mainline.geometry.setDrawRange(0, (sec - (2500 + i * 100)) / 20 );
    //   });
    // }

    // 塗りつぶし図形をフェードイン
    // for (var i = 0;i <= this.mainfills.length - 1;i ++) {
    //   this.mainfills[i].material.opacity = THREE.MathUtils.damp(0.0, 1.0, 2, (sec - 4200) / 1200 );
    // }

    // ガイドラインをフェードアウト
    // this.guidelines.forEach((lines) => {
    //   const num = lines.length - 1;
    //   for (var i = 0;i <= num;i ++) {
    //     lines[i].material.opacity = THREE.MathUtils.damp(1.0, 0.0, 2, (sec - 5000) / 1000);
    //     if (sec > 6500) lines[i].visible = false;
    //   }
    // });

    // グリッドをフェードアウト
    // this.grid.fadeOut((sec - 5000) / 1000);

    // 画面に表示
    this.renderer.render(this.scene, this.camera);
  }
}
