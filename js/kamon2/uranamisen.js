'use strict';

import * as THREE from 'three';
import Kamon from '../kamon2.js';

export default class Uranamisen extends Kamon {

  constructor() {

    super();

    // infoのテキスト
    this.jpNameText = '裏浪銭';
    this.jpDescText = '銭紋は貨幣の銭貨を図案化した家紋です。富を象徴する縁起物としての意味合いで用いられた家紋と、三途の川の渡し賃として死者とともに納棺する六道銭を模した信仰的な意味合いで用いられた家紋とが存在します。';
    this.enNameText = 'Uranamisen';
    this.enDescText = 'The Zenimon is a family crest that is a stylized version of a coin. There are family crests that were used as lucky charms symbolizing wealth, and family crests that were used with a religious meaning, imitating Rokudosen, which was buried with the deceased as a fare for crossing the Sanzu River.';

    // ガイドラインの表示アニメーションパラメータ
    this.guidelineParams = {
      drawIn   : [0.10, 0.40],
      drawOut  : [0.55, 0.80],
      fadeIn1  : [0.00, 0.00],
      fadeOut1 : [0.35, 0.40],
      fadeIn2  : [0.625, 0.675],
      fadeOut2 : [0.80, 0.85],
      scaleIn  : [0.00, 0.00],
      scaleOut : [0.70, 0.90],
    }

    // アウトラインの表示アニメーションパラメータ
    this.outlineParams = {
      fadeIn1  : [0.30, 0.35],
      fadeOut1 : [0.35 ,0.40],
      fadeIn2  : [0.60, 0.65],
      fadeOut2 : [0.65, 0.70],
      scaleIn  : [0.00, 0.00],
      scaleOut : [1.00, 1.00],
    }

    // 図形の表示アニメーションパラメータ
    this.shapeParams = {
      fadeIn   : [0.35, 0.40],
      fadeOut  : [0.60, 0.65],
    }

    // 説明欄の表示アニメーションパラメータ
    this.descParams = {
      fadeIn   : [0.35, 0.40],
      fadeOut  : [0.60, 0.65],
    }





    // 四角形
    this.square = [
      new THREE.Vector3(- 320,   320, 0),
      new THREE.Vector3(  320,   320, 0),
      new THREE.Vector3(  320, - 320, 0),
      new THREE.Vector3(- 320, - 320, 0),
    ];

    // 円
    this.circles = [
      {a:      0, b:      0, r: 1600},

      {a:      0, b:      0, r: 1400},
      {a:      0, b:      0, r: 1000},
      {a:      0, b:      0, r:  600},

      {a:      0, b: - 1720, r: 1400},
      {a:      0, b: - 1720, r: 1000},
      {a:      0, b: - 1720, r:  600},

      {a:   1600, b:  - 900, r: 1800},
      {a:   1600, b:  - 900, r: 1400},
      {a:   1600, b:  - 900, r: 1000},

      {a: - 1600, b:  - 900, r: 1800},
      {a: - 1600, b:  - 900, r: 1400},
      {a: - 1600, b:  - 900, r: 1000},
    ];

    // 円・直線の交点
    this.inters = [
      this.inter2Circles(this.circles[2], this.circles[10]),
      this.inter2Circles(this.circles[2], this.circles[7]),

      this.inter2Circles(this.circles[3], this.circles[10]),
      this.inter2Circles(this.circles[3], this.circles[7]),

      this.inter2Circles(this.circles[4], this.circles[1]),
      this.inter2Circles(this.circles[5], this.circles[1]),
      this.inter2Circles(this.circles[6], this.circles[1]),

      this.interLineCircle(this.circles[7], {a: 0, b: 1, c: 320}),
      this.inter2Circles(this.circles[7], this.circles[1]),

      this.inter2Circles(this.circles[8], this.circles[4]),
      this.inter2Circles(this.circles[8], this.circles[1]),

      this.inter2Circles(this.circles[9], this.circles[4]),
      this.inter2Circles(this.circles[9], this.circles[1]),

      this.inter2Circles(this.circles[10], this.circles[1]),
      this.interLineCircle(this.circles[10], {a: 0, b: 1, c: 320}),

      this.inter2Circles(this.circles[11], this.circles[1]),
      this.inter2Circles(this.circles[11], this.circles[4]),

      this.inter2Circles(this.circles[12], this.circles[1]),
      this.inter2Circles(this.circles[12], this.circles[4]),
    ];

    // console.log(this.inters)

    // 描画角度
    this.angles = [
      [0, 360],

      [0, 360],
      [
        this.circumAngle(this.circles[2], this.inters[0][1]),
        this.circumAngle(this.circles[2], this.inters[1][0]),
      ],
      [
        this.circumAngle(this.circles[3], this.inters[2][1]),
        this.circumAngle(this.circles[3], this.inters[3][0]),
      ],

      [
        this.circumAngle(this.circles[4], this.inters[4][1]),
        this.circumAngle(this.circles[4], this.inters[4][0]),
      ],
      [
        this.circumAngle(this.circles[5], this.inters[5][1]),
        this.circumAngle(this.circles[5], this.inters[5][0]),
      ],
      [
        this.circumAngle(this.circles[6], this.inters[6][1]),
        this.circumAngle(this.circles[6], this.inters[6][0]),
      ],

      [
        this.circumAngle(this.circles[7], this.inters[7][1]),
        this.circumAngle(this.circles[7], this.inters[8][0]),
      ],
      [
        this.circumAngle(this.circles[8], this.inters[9][1]),
        this.circumAngle(this.circles[8], this.inters[10][0]),
      ],
      [
        this.circumAngle(this.circles[9], this.inters[11][1]),
        this.circumAngle(this.circles[9], this.inters[12][0]),
      ],

      [
        this.circumAngle(this.circles[10], this.inters[13][1]),
        this.circumAngle(this.circles[10], this.inters[14][0]),
      ],
      [
        this.circumAngle(this.circles[11], this.inters[15][1]),
        this.circumAngle(this.circles[11], this.inters[16][0]),
      ],
      [
        this.circumAngle(this.circles[12], this.inters[17][1]),
        this.circumAngle(this.circles[12], this.inters[18][0]),
      ],
    ];

    this.clockwises = [
      true,

      true,
      true,
      true,

      true,
      true,
      true,

      true,
      true,
      true,

      true,
      true,
      true,
    ]



    // // 円
    // this.circles = [
    //   {a:    0, b:      0, r:  230}, // 中心円
    //   {a:    0, b:      0, r: 1600}, // 補助円１
    //   {a:    0, b:      0, r:  400}, // 補助円２
    //   {a:    0, b:    400, r:  100}, // 補助円３
    //   {a:  400, b:    930, r:  587.6242822}, // 輪郭円１
    //   {a:  364, b:    210, r:  324}, // 輪郭円２
    //   {a: 1190, b: - 1110, r: 1600}, // 輪郭円３
    // ];

    // // 線
    // this.lines = [
    //   [
    //     new THREE.Vector3(    0,    0, 0),
    //     new THREE.Vector3(    0, 1600, 0)
    //   ],
    //   [
    //     new THREE.Vector3(- 100,  400, 0),
    //     new THREE.Vector3(  100,  400, 0)
    //   ],
    //   [
    //     new THREE.Vector3(    0,  500, 0),
    //     new THREE.Vector3(  100,  400, 0)
    //   ],
    // ];

    // const inter1 = this.interLineCircle(this.circles[4], {a: 1, b: 0, c: 0});
    // const inter2 = this.inter2Circles(this.circles[4], this.circles[6]);
    // const inter3 = this.inter2Circles(this.circles[6], this.circles[0]);
    // const inter4 = this.inter2Circles(this.circles[5], this.circles[0]);

    // this.angles = [
    //   [
    //     this.circumAngle(this.circles[4], inter1[0]),
    //     this.circumAngle(this.circles[4], inter2[1]),
    //   ],
    //   [
    //     this.circumAngle(this.circles[6], inter2[1]),
    //     this.circumAngle(this.circles[6], inter3[0]),
    //   ],
    //   [
    //     this.circumAngle(this.circles[5], inter4[1]),
    //     this.circumAngle(this.circles[5], this.lines[2][1]),
    //   ],
    //   [
    //     this.circumAngle(this.circles[0], inter3[0]),
    //     this.circumAngle(this.circles[0], inter4[1]),
    //   ],
    // ];
  }

  // オブジェクトを生成
  init = () => {

    // ガイドラインの作成
    this.generateGuideline();

    // アウトラインの作成
    this.generateOutline();

    // 塗りつぶし図形の描画
    this.generateShape();

  }

  // 直線と円の交点を求める（r: 半径, h: 中心X座標, k: 中心Y座標, m: 直線式の傾き, n: 直線式の切片）
  interLineCircle = (circle, form) => {
    const h = circle.a;
    const k = circle.b;
    const r = circle.r;
    const m = form.a;
    const n = form.c;

    var a = 1 + Math.pow(m, 2);
    var b = - 2 * h + 2 * m * (n - k);
    var c = Math.pow(h, 2) + Math.pow((n - k), 2) - Math.pow(r, 2);
    var D = Math.pow(b, 2) - 4 * a * c;

    var kouten = [];
    if (D >= 0) {
      if (form.b == 0) {
        var x1 = n;
        var x2 = n;
      } else {
        var x1 = (- b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
        var x2 = (- b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
      }
      if (D == 0) {
        kouten.push(new THREE.Vector3(x1, m * x1 + n, 0));
      } else {
        if (form.b == 0) {
          kouten.push(new THREE.Vector3(n, k + Math.sqrt(r ** 2 - h ** 2), 0));
          kouten.push(new THREE.Vector3(n, k - Math.sqrt(r ** 2 - h ** 2), 0));
        } else {
          kouten.push(new THREE.Vector3(x1, m * x1 + n, 0));
          kouten.push(new THREE.Vector3(x2, m * x2 + n, 0));
        }
      }
    }
    return kouten;
  }

  // ２直線の交点を求める式（form1,2: 直線の式）
  getIntersect(form1, form2) {
    const a1 = form1.a;
    const b1 = form1.b;
    const c1 = form1.c;
    const a2 = form2.a;
    const b2 = form2.b;
    const c2 = form2.c;
    var x, y;
    if (b1 == 0) {
      x = c1;
      y = (a2 * c1 + c2) / b2;
    } else if (b2 == 0) {
      x = c2;
      y = (a1 * c2 + c1) / b1;
    } else {
      x = (c2 - c1) / (a1 - a2);
      y = ((a1 * c2) - (a2 * c1)) / (a1 - a2);
    }
    return new THREE.Vector3(x, y, 0);
  }

  // 直線座標の平行移動
  lineShift = (v1, v2, w) => {
    const form = this.from2Points(v1, v2);
    const theta = Math.atan(- 1 / form.a);
    const p = w * Math.cos(theta);
    const q = w * Math.sin(theta);
    const point1 = new THREE.Vector3(v1.x + p, v1.y + q, 0);
    const point2 = new THREE.Vector3(v2.x + p, v2.y + q, 0);
    return [point1, point2];
  }

  // ガイドラインを作成
  generateGuideline = () => {

    const objects = [
      {c: true,  o: this.circles[0]},
      {c: false, o: [this.square[0], this.square[1]]},
      {c: false, o: [this.square[1], this.square[2]]},
      {c: false, o: [this.square[2], this.square[3]]},
      {c: false, o: [this.square[3], this.square[0]]},

      {c: true,  o: this.circles[6]},
      {c: true,  o: this.circles[5]},
      {c: true,  o: this.circles[4]},

      {c: true,  o: this.circles[12]},
      {c: true,  o: this.circles[11]},
      {c: true,  o: this.circles[10]},

      {c: true,  o: this.circles[9]},
      {c: true,  o: this.circles[8]},
      {c: true,  o: this.circles[7]},

      {c: true,  o: this.circles[3]},
      {c: true,  o: this.circles[2]},
      {c: true,  o: this.circles[1]},
    ];

    objects.forEach((object) => {
      const points = object.c
        ? this.circleLocusGen(object.o, [270, - 90], this.divCount)
        : this.lineLocusGen(object.o[0], object.o[1], 0, this.divCount);
      const mesh = this.guidelineGen(points);
      this.guidelines.add(mesh);
    })

    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    const geos = [];

    // 四角形
    const square = [
      this.outlineGeoGen(this.square[0], this.square[1]),
      this.outlineGeoGen(this.square[1], this.square[2]),
      this.outlineGeoGen(this.square[2], this.square[3]),
      this.outlineGeoGen(this.square[3], this.square[0]),
    ];
    square.forEach((line) => {
      geos.push(line);
    })

    for (var i = 0;i <= this.circles.length - 1;i ++) {
      const circle = this.circles[i];
      const angle = this.angles[i];
      const clockwise = this.clockwises[i];
      geos.push(this.curveOutlineGeoGen(circle, angle, clockwise));
    }

    geos.forEach((geo) => {
      const mesh = new THREE.Mesh(geo, this.outlineMat);
      this.outlines.add(mesh);
    })

    this.group.add(this.outlines);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    // const w = 4;

    // // 中心円
    // const circle0 = {a: this.circles[0].a, b: this.circles[0].b, r: this.circles[0].r - w};
    // const shape = this.curvePointGen(circle0, [0, 360], true);
    // const geo = this.shapeGeoGen(shape);
    // const mesh = new THREE.Mesh(geo, this.shapeMat);
    // this.shapes.add(mesh);

    // const circle4 = {a: this.circles[4].a, b: this.circles[4].b, r: this.circles[4].r - w};
    // const circle5 = {a: this.circles[5].a, b: this.circles[5].b, r: this.circles[5].r - w};
    // const circle6 = {a: this.circles[6].a, b: this.circles[6].b, r: this.circles[6].r + w};
    // const circle7 = {a: this.circles[0].a, b: this.circles[0].b, r: this.circles[0].r + w};
    // const line2 = this.lineShift(this.lines[2][0], this.lines[2][1], w);

    // const inter1 = this.interLineCircle(circle4, {a: 1, b: 0, c: 0});
    // const inter2 = this.inter2Circles(circle4, circle6);
    // const inter3 = this.inter2Circles(circle6, circle7);
    // const inter4 = this.inter2Circles(circle5, circle7);

    // const angles = [
    //   [
    //     this.circumAngle(circle4, inter1[0]),
    //     this.circumAngle(circle4, inter2[1]),
    //   ],
    //   [
    //     this.circumAngle(circle6, inter2[1]),
    //     this.circumAngle(circle6, inter3[0]),
    //   ],
    //   [
    //     this.circumAngle(circle5, inter4[1]),
    //     this.circumAngle(circle5, this.lines[2][1]),
    //   ],
    //   [
    //     this.circumAngle(circle7, inter3[0]),
    //     this.circumAngle(circle7, inter4[1]),
    //   ],
    // ];

    // const points = [
    //   this.curvePointGen(circle4, angles[0], true),
    //   this.curvePointGen(circle6, angles[1], false),
    //   this.curvePointGen(circle7, angles[3], false),
    //   this.curvePointGen(circle5, angles[2], true),
    //   new THREE.Vector3(0, line2[0].y, 0),
    // ];

    // var shapes = [];
    // points.forEach((point) => {
    //   shapes = shapes.concat(point);
    // })
    // const geo1 = this.shapeGeoGen(shapes);

    // for (var i = 0;i <= 1;i ++) {
    //   for (var j = 0;j <= 2;j ++) {
    //     const mesh = new THREE.Mesh(geo1, this.shapeMat);
    //     const angleY = THREE.MathUtils.degToRad(180 * i);
    //     const angleZ = THREE.MathUtils.degToRad(120 * j);
    //     mesh.rotation.set(0, angleY, angleZ);
    //     this.shapes.add(mesh);
    //   }
    // }

    this.group.add(this.shapes);
  }

  // ガイドラインの表示制御
  guidelineDisplayControl = (progRatio) => {
    const param = this.guidelineParams;
    const drawInRatio   = THREE.MathUtils.smoothstep(progRatio, param.drawIn[0]  , param.drawIn[1]  );
    const drawOutRatio  = THREE.MathUtils.smoothstep(progRatio, param.drawOut[0] , param.drawOut[1] );
    const fadeInRatio1  = THREE.MathUtils.smoothstep(progRatio, param.fadeIn1[0] , param.fadeIn1[1] );
    const fadeOutRatio1 = THREE.MathUtils.smoothstep(progRatio, param.fadeOut1[0], param.fadeOut1[1]);
    const fadeInRatio2  = THREE.MathUtils.smoothstep(progRatio, param.fadeIn2[0] , param.fadeIn2[1] );
    const fadeOutRatio2 = THREE.MathUtils.smoothstep(progRatio, param.fadeOut2[0], param.fadeOut2[1]);
    const scaleInRatio  = THREE.MathUtils.smoothstep(progRatio, param.scaleIn[0] , param.scaleIn[1] );
    const scaleOutRatio = THREE.MathUtils.smoothstep(progRatio, param.scaleOut[0], param.scaleOut[1]);

    // 描画アニメーションの進捗
    const drawDelayFactor = 0.03;
    const maxDrawDelay = drawDelayFactor * this.guidelines.children.length;
    const drawRatio = drawInRatio - drawOutRatio;

    // スケールアニメーションの進捗
    const scaleDelayFactor = 0.04;
    const maxScaleDelay = scaleDelayFactor * this.guidelines.children.length;
    const scaleRatio = scaleInRatio - scaleOutRatio;

    // フェードアニメーションの進捗
    const fadeRatio = (fadeInRatio1 - fadeOutRatio1) + (fadeInRatio2 - fadeOutRatio2);

    for (var i = 0;i <= this.guidelines.children.length - 1;i ++) {
      const drawDelay = drawDelayFactor * i;
      const drawRatioD = THREE.MathUtils.inverseLerp(drawDelay, 1.0 + drawDelay - maxDrawDelay, drawRatio);

      const scaleDelay = scaleDelayFactor * (this.guidelines.children.length - i);
      const scaleRatioD = THREE.MathUtils.smootherstep(scaleRatio, scaleDelay, 1.0 + scaleDelay - maxScaleDelay);

      const control = (mesh) => {
        mesh.geometry.setDrawRange(0, this.divCount * drawRatioD);
        mesh.material.opacity = fadeRatio;
        mesh.scale.set(scaleRatioD, scaleRatioD);
      }

      const child = this.guidelines.children[i];
      if (child.isGroup) {
        child.children.forEach((mesh) => control(mesh));
      } else {
        control(child);
      }
    }
  }

}
