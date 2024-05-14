'use strict';

import * as THREE from 'three';
import Grid from './grid.js';

export default class HidariFutatsuDomoe {
  constructor() {

    // 基本カラー
    this.frontColor    = 0xffffff;
    this.backColor     = 0x111111;
    this.guideColor    = 0x999999;

    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight

    // スクローラーの高さ
    const scrollerHeight = 2000;
    this.scroller = document.getElementById('scroller');
    this.scroller.style = 'height: ' + scrollerHeight + 'vh;'
    this.scrollerH = this.scroller.scrollHeight - this.h;

    // スクロールの所要時間
    this.scrollDur = 10000;

    // スクロール量
    this.scrollY = 0;

    // マウス座標
    this.mouse = new THREE.Vector2(0, 0);

    // // マウスボタン長押しの間増加する値
    // this.increment = 0;

    // // 図形の回転角度
    // this.rad = 0;

    // // 回転時の図形の位置
    // this.shapePosX = 0;

    // // 図形の回転加速度
    // this.accel = 0.2;

    // // 回転時の図形の最大位置
    // this.maxGap = 1000;

    // // 図形の加減速用のタイマー
    // this.accelTimer = 0;
    // this.gentleTImer = 0;


    // レンダラー
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(this.w, this.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  
    // DOMにレンダラーのcanvasを追加
    this.crest = document.getElementById('crest');
    this.crest.appendChild(this.renderer.domElement);

    // カメラ
    this.camZ = 4000;
    this.camera = new THREE.PerspectiveCamera(45, this.w / this.h, 1, 10000);
    this.camera.position.set(0, 0, this.camZ);

    // ロガーのDOMを取得
    this.logger = document.getElementById('logger');

    // シーン
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.backColor);

    this.guidelines = [];
    this.mainVers = [];
    this.outlines = [];
    this.shapeGroup = new THREE.Group();

    // フレーム・グリッドの描画
    this.grid = new Grid();
    this.gridGroup = this.grid.draw();
    this.scene.add(this.gridGroup);

    // // 動画の準備
    // this.currentNum = 0;
    // this.videoArr = [
    //   '',
    //   '/img/water01.mov',
    //   '/img/water02.mov',
    //   '/img/water03.mov',
    //   '/img/water04.mov',
    //   '/img/water05.mov',
    //   '/img/water06.mov',
    //   '/img/water07.mov',
    //   '/img/water08.mov',
    //   '/img/water09.mov',
    //   '/img/water10.mov',
    //   '/img/water11.mov',
    //   '/img/water12.mov',
    //   '/img/water13.mov',
    // ]
    // const video = document.getElementById('video');
    // // video.srcObject = stream;
    // video.src = "/img/water01.mov";
    // video.load();
    // video.loop = true;
    // video.play();
    // video.autoplay = true;
    // this.videoTexture = new THREE.VideoTexture(video);
    // this.videoTexture.magFilter = THREE.LinearFilter;
    // this.videoTexture.minFilter = THREE.LinearFilter;
    // this.videoTexture.format = THREE.RGBFormat;
    // this.videoTexture.minFilter = THREE.LinearFilter;

    // ガイドラインの作成
    this.generateGuideline();

    // アウトラインの作成
    this.generateOutLine();

    // 塗りつぶし図形の描画
    this.generateShape();

    // this.textureTest();

    // infoの準備
    this.jpName = document.getElementById('jpName');
    this.jpDesc = document.getElementById('jpDesc');
    this.enName = document.getElementById('enName');
    this.enDesc = document.getElementById('enDesc');

    this.jpName.textContent = '左二つ巴';
    this.jpDesc.textContent = '巴紋は鞆（とも）という弓の道具を図案化した説、勾玉を図案化した説など、由来には諸説あります。水が渦を巻く様子にも見えることから、平安時代には火除けの印として瓦の紋様にも取り入れられました。家紋だけでなく、神社の神紋などにも多く使用されています。';
    this.enName.textContent = 'Hidari-Futatsu-Domoe';
    this.enDesc.textContent = 'There are various theories about the origin of the Tomoe crest, including one theory that it is a design of a bow tool called a tomo, and another theory that it is a design of a magatama. Because it looks like water swirling, it was incorporated into the pattern of roof tiles during the Heian period as a symbol to protect against fire. It is often used not only for family crests but also for shrine emblems.';


    // 描画ループ開始
    this.render();
  }

  // 画面のスクロール量を取得
  scrolled = (y) => {
    this.scrollY = y;
  }

  // addTexToShape = (e) => {
  //   const canvas = document.getElementsByTagName('canvas')[0];
  //   if (e.target != canvas) return;

  //   // this.texTimer = setInterval(() => {
  //     this.shapeGroup.children.forEach((shape) => {
  //       shape.material.map = this.videoTexture;
  //     })
  //     // this.increment ++;
  //     // this.rad = - this.accel * this.increment ** 2;
  //     // if (this.shapePosX < this.maxGap) {
  //     //   this.shapePosX = 0.1 * this.increment ** 2;
  //     // } else {
  //     //   this.shapePosX = this.maxGap;
  //     // }
  //   // }, 50);

  //   document.addEventListener('pointerup', () => {
  //     this.shapeGroup.children.forEach((shape) => {
  //       shape.material.map = '';
  //     })
  //   })

  // }

  // changeShapeTexture = (e) => {
  //   const canvas = document.getElementsByTagName('canvas')[0];
  //   if (e.target != canvas) return;

  //   if (this.currentNum == this.videoArr.length - 1) {
  //     this.currentNum = 0;
  //   } else {
  //     this.currentNum ++;
  //   }

  //   const video = document.getElementById('video');

  //   if (this.videoArr[this.currentNum] == '') {
  //     this.videoTexture = '';
  //   } else {
  //     video.src = this.videoArr[this.currentNum];
  //     video.load();
  //     video.loop = true;
  //     video.play();
  //     video.autoplay = true;
  //     this.videoTexture = new THREE.VideoTexture(video);
  //   }

  //   this.shapeGroup.children.forEach((shape) => {
  //     shape.material.map = this.videoTexture;
  //   })

  // }

  // // 図形を加速しながら回転
  // shapeAccelRotation = (e) => {
  //   const canvas = document.getElementsByTagName('canvas')[0];
  //   if (e.target != canvas) return;
  //   const memRad = this.rad - (Math.trunc(this.rad / 360) * 360);
  //   const memInc = Math.sqrt(- memRad * 2);
  //   this.increment = memInc;
  //   this.rad = 0;
  //   this.shapePosX = 0;
  //   clearInterval(this.accelTimer);
  //   clearInterval(this.gentleTimer);

  //   this.accelTimer = setInterval(() => {
  //     this.increment ++;
  //     this.rad = - this.accel * this.increment ** 2;
  //     if (this.shapePosX < this.maxGap) {
  //       this.shapePosX = 0.1 * this.increment ** 2;
  //     } else {
  //       this.shapePosX = this.maxGap;
  //     }
  //   }, 50);

  //   document.addEventListener('pointerup', 
  //     () => this.shapeGentleRotation(), { once: true }
  //   )
  // }

  // // 図形を減速しながら回転
  // shapeGentleRotation = () => {
  //   const p = this.increment * 2;
  //   const q = this.rad * 2;
  //   clearInterval(this.accelTimer);
  //   clearInterval(this.gentleTimer);

  //   this.gentleTimer = setInterval(() => {
  //     this.increment ++;
  //     this.rad = this.accel * (this.increment - p) ** 2 + q;
  //     const tempPosX = this.accel * (this.increment - p) ** 2;
  //     if (tempPosX <= this.maxGap) {
  //       this.shapePosX = this.accel * (this.increment - p) ** 2;
  //     } else {
  //       this.shapePosX = this.maxGap;
  //     }

  //     if(this.increment >= p){
  //       clearInterval(this.gentleTimer);
  //       const memRad = this.rad - (Math.trunc(this.rad / 360) * 360);
  //       const memInc = Math.sqrt(- memRad * 2);
  //       this.increment = memInc;
  //     }
  //   }, 50);
  // }

  // 円の方程式
  circle = (a, b, r, s) => {
    return new THREE.Vector3(a + r * Math.cos(s), b + r * Math.sin(s), 0);
  }

  // ガイドラインを作成
  generateGuideline = () => {
    const circles = [
      {a:    0, b:    0, r: 1600},
      {a:    0, b:  825, r:  750},
      {a:    0, b: -825, r:  750},
      {a: -110, b:  490, r: 1100},
      {a:  110, b: -490, r: 1100},
    ];
    const divCount = 1000;
    circles.forEach((circle) => {
      const points = [];
      const a = circle.a;
      const b = circle.b;
      const r = circle.r;
      for (var i = 0;i <= divCount - 1;i ++) {
        const deg = THREE.MathUtils.damp(90, 450, 10, i / (divCount - 1));
        const s = deg * (Math.PI / 180);
        const mid = this.circle(a, b, r, s);
        points.push(mid);
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      geometry.setDrawRange(0, 0);
      const material = new THREE.LineBasicMaterial({
        color: this.guideColor,
        transparent: true
      });
      const line = new THREE.Line(geometry, material);
      this.guidelines.push(line);
      this.scene.add(line);
    })
  }

  // アウトラインを作成
  generateOutLine = () => {
    const circles = [
      {a:    0, b:    0, r: 1600, f: -73, t: 110},
      {a:    0, b:    0, r: 1600, f: 107, t: 290},
      {a:    0, b:  825, r:  750, f: 421, t: 218},
      {a:    0, b: -825, r:  750, f: 240, t:  38},
      {a: -110, b:  490, r: 1100, f: 470, t: 309.5},
      {a:  110, b: -490, r: 1100, f: 290, t: 129.5},
    ];
    const divCount = 1000;
    circles.forEach((circle) => {

      const gs = [0, 1, -1, 2, -2, 3, -3];
      gs.forEach((g) => {
        const points = [];
        const a = circle.a;
        const b = circle.b;
        const r = circle.r + g;
        const f = circle.f;
        const t = circle.t;
        for (var i = 0;i <= divCount - 1;i ++) {
          const deg = THREE.MathUtils.damp(f, t, 10, i / (divCount - 1));
          const s = deg * (Math.PI / 180);
          const mid = this.circle(a, b, r, s);
          points.push(mid);
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.setDrawRange(0, 0);
        const material = new THREE.LineBasicMaterial({
          color: this.frontColor,
          transparent: true
        });
        const line = new THREE.Line(geometry, material);
        this.outlines.push(line);
        this.scene.add(line);
      })
    })
  }

  // 塗りつぶし図形を生成
  generateShape = () => {
    const figures = [
      [
        {a:    0, b:  825, r:  750, f:  217, t:  420, g: -6},
        {a: -110, b:  490, r: 1100, f:   70, t:  110, g: -6},
        {a:    0, b:    0, r: 1600, f:  110, t:  270, g: -6},
        {a:  110, b: -490, r: 1100, f:  -95, t: -231, g:  6},
      ],
      [
        {a:    0, b: -825, r:  750, f:   37, t:  240, g: -6},
        {a:  110, b: -490, r: 1100, f:  250, t:  290, g: -6},
        {a:    0, b:    0, r: 1600, f:  280, t:  450, g: -6},
        {a: -110, b:  490, r: 1100, f:   85, t:  -51, g:  6},
      ]
    ];
    const divCount = 2000;
    figures.forEach((figure) => {
      const points = [];
      figure.forEach((arc) => {
        const a  = arc.a;
        const b  = arc.b;
        const r  = arc.r + arc.g;
        const f  = arc.f;
        const t  = arc.t;
        for (var i = 0;i <= divCount - 1;i ++) {
          const deg = THREE.MathUtils.damp(f, t, 10, i / (divCount - 1));
          const s = deg * (Math.PI / 180);
          const mid = this.circle(a, b, r, s);
          points.push(mid);
        }
      })
      const shape = new THREE.Shape(points);

      // const loader = new THREE.TextureLoader();
      // const texture = loader.load('/img/05.jpg');
      // texture.wrapS = THREE.RepeatWrapping;
      // texture.wrapT = THREE.RepeatWrapping;
      // texture.offset.set(1,1000000000000000);
      // texture.repeat.set( 40, 40 );
      
      const material = new THREE.MeshBasicMaterial({
        color: this.frontColor,
        side: THREE.DoubleSide,
        opacity: 0.0,
        transparent: true,
        // map: texture,
        // map: this.videoTexture,
      });
      const geometry = new THREE.ShapeGeometry(shape);
      // geometry.scale(1,1,1)

      // function setUV(geometry){
        // let pos = geometry.attributes.position;
        // let b3 = new THREE.Box3().setFromBufferAttribute(pos);
        // let size = new THREE.Vector3();
        // b3.getSize(size);
        // let uv = [];
        // let v3 = new THREE.Vector2();
        // for(let i = 0; i < pos.count; i++){
        //   v3.fromBufferAttribute(pos, i);
        //   v3.sub(b3.min).divide(size);
        //   uv.push(v3.x, v3.y);
        // }
        // geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      // }
      
      const mesh = new THREE.Mesh(geometry, material);
      this.shapeGroup.add(mesh);
  
    })
    this.scene.add(this.shapeGroup);
  }

  textureTest = () => {
    const side = Math.min(this.w, this.h) / 1;
    const loader = new THREE.TextureLoader();
    const texture = loader.load('/img/05.jpg');
    // const geometry = new THREE.BoxBufferGeometry(side, side, side);
    const geometry = new THREE.BoxGeometry(800, 450, 100);
    const material = new THREE.MeshBasicMaterial({map: texture});
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

  }

  // ウィンドウサイズ変更
  windowResize = () => {
    this.w = window.innerWidth;
    this.h = window.innerHeight

    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.w, this.h);

    this.scrollerH = this.scroller.scrollHeight - this.h;

    this.render();
  }

  // テーマカラー変更
  changeTheme = (theme) => {
    if (theme == 'dark') {
      this.frontColor    = 0xffffff;
      this.backColor     = 0x111111;
      this.guideColor    = 0x999999;
      this.gridColor     = 0x333333;
      this.gridThinColor = 0x1a1a1a;
    } else {
      this.frontColor    = 0x111111;
      this.backColor     = 0xffffff;
      this.guideColor    = 0x333333;
      this.gridColor     = 0xcccccc;
      this.gridThinColor = 0xe6e6e6;
    }

    // 背景色を変更
    this.scene.background = new THREE.Color(this.backColor);

    // グリッド色を変更
    this.grid.changeTheme(this.gridColor, this.gridThinColor);

    // ガイドラインの色を変更
    this.guidelines.forEach((line) => {
      line.material.color = new THREE.Color(this.guideColor);
    })

    // アウトラインの色を変更
    this.outlines.forEach((line) => {
      line.material.color = new THREE.Color(this.frontColor);
    })

    // 図形の色を変更
    this.shapeGroup.children.forEach((figure) => {
      figure.material.color = new THREE.Color(this.frontColor);
    })

  }

  // プログレスバーのアニメーション制御
  progressBarControl = (id, tick) => {
    const bar = document.querySelector('#' + id + ' .bar');
    const rate = document.querySelector('#' + id + ' .rate');
    const ratio = tick * 100;
    rate.textContent = ratio.toFixed(1) + '%';
    bar.style.strokeDashoffset = 283 * (1 - tick);
  }

  // ガイドラインの描画アニメーション制御
  guidelineDrawAnimeControl = (tick) => {
    const divCount = 1333;
    const start = 0.05;
    const end   = 0.35;
    const ratio = THREE.MathUtils.smoothstep(tick, start, end);

    for (var i = 0;i <= this.guidelines.length - 1;i ++) {
      const line = this.guidelines[i];
      var delay = i * 0.05;
      line.geometry.setDrawRange(0, divCount * (ratio - delay));
    }
  }

  // アウトラインの表示アニメーション制御
  outlineDrawAnimeControl = (tick) => {
    const divCount = 1000;
    const start = 0.35;
    const end   = 0.5;
    const ratio = THREE.MathUtils.smoothstep(tick, start, end);

    this.outlines.forEach((outline) => {
      outline.geometry.setDrawRange(0, divCount * ratio);
    });
  }

  // 塗りつぶし図形のアニメーション制御
  shapeAnimeControl = (tick) => {
    const start = 0.5;
    const end   = 0.6;
    const ratio = THREE.MathUtils.smoothstep(tick, start, end);

    this.shapeGroup.children.forEach((shape) => {
      shape.material.opacity = ratio;
    });
  }

  // ガイドラインのフェードアウトアニメーション制御
  guidelineFadeOutAnimeControl = (tick) => {
    const start = 0.45;
    const end   = 0.55;
    const ratio = THREE.MathUtils.smoothstep(tick, start, end);

    this.guidelines.forEach((line) => {
      line.visible = true;
      if (ratio >= 1) line.visible = false;
      line.material.opacity = 1.0 - ratio;
    });
  }

  // アウトラインのフェードアウトアニメーション制御
  outlineFadeOutAnimeControl = (tick) => {
    const start = 0.5;
    const end   = 0.6;
    const ratio = THREE.MathUtils.smoothstep(tick, start, end);

    this.outlines.forEach((line) => {
      line.visible = true;
      if (ratio >= 1) line.visible = false;
      line.material.opacity = 1.0 - ratio;
    });
  }

  // 図形を回転させるアニメーション制御
  shapeRotateAnimeControl = (tick) => {
    const start = 0.6;
    const end   = 1.0;
    const ratio = THREE.MathUtils.smoothstep(tick, start, end);

    // if (tick < end) {
      // this.increment = 0;
      // this.rad = 0;
      // this.shapePosX = 0;
      // clearInterval(this.accelTimer);
      // clearInterval(this.gentleTimer);

      for (var i = 0;i <= this.shapeGroup.children.length - 1;i ++) {
        const shape = this.shapeGroup.children[i];
        const posRatio = - 4 * ratio ** 2 + 4 * ratio;
        const pos = 1500 * posRatio;
        if (i == 0) {
          shape.position.set(-pos, 0, 0);
        } else {
          shape.position.set(pos, 0, 0);
        }
      }
      this.shapeGroup.rotation.x = -360 * ratio * (Math.PI / 180);
      this.shapeGroup.rotation.z = -360 * ratio * (Math.PI / 180);
    // } else {
    //   for (var i = 0;i <= this.shapeGroup.children.length - 1;i ++) {
    //     const shape = this.shapeGroup.children[i];
    //     if (i == 0) {
    //       shape.position.set(- this.shapePosX, 0, 0);
    //     } else {
    //       shape.position.set(  this.shapePosX, 0, 0);
    //     }
    //   }
    //   this.shapeGroup.rotation.z = this.rad * Math.PI / 180;
    //   console.log(this.increment, this.shapeGroup.rotation.z);
    // }
  }

  // descのアニメーション制御
  descAnimeControl = (tick) => {
    const start = 0.8;
    const end   = 0.9;
    const ratio = THREE.MathUtils.smoothstep(tick, start, end);
    const trRatio = (1 - ratio) * 100;

    this.jpName.style = "opacity: " + ratio + ";transform: translateX(-" + trRatio +"%);"
    this.jpDesc.style = "opacity: " + ratio + ";transform: translateY( " + trRatio +"%);"
    this.enName.style = "opacity: " + ratio + ";transform: translateX( " + trRatio +"%);"
    this.enDesc.style = "opacity: " + ratio + ";transform: translateY( " + trRatio +"%);"
  }

  render = () => {
    // const sec = performance.now();

    const tick = this.scrollY / this.scrollerH;

    // プログレスバーのアニメーション制御
    this.progressBarControl('progress', tick);

    // ガイドラインの表示アニメーション制御
    this.guidelineDrawAnimeControl(tick);

    // アウトラインの表示アニメーション制御
    this.outlineDrawAnimeControl(tick);

    // 塗りつぶし図形をフェードイン
    this.shapeAnimeControl(tick);

    // ガイドラインをフェードアウト
    this.guidelineFadeOutAnimeControl(tick);

    // アウトラインをフェードアウト
    this.outlineFadeOutAnimeControl(tick);

    // グリッドをフェードアウト
    this.grid.fadeOut(tick, 0.35, 0.5);

    // 図形を回転
    this.shapeRotateAnimeControl(tick);

    // descのアニメーションを制御
    this.descAnimeControl(tick);

    // 画面に表示
    this.renderer.render(this.scene, this.camera);

    // 次のフレームを要求
    requestAnimationFrame(this.render);
  }
}
