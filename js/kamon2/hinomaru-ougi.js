'use strict';

import * as THREE from 'three';
import Kamon from '../kamon2.js';

export default class HinomaruOugi extends Kamon {

  constructor() {

    super();

    // infoのテキスト
    this.jpNameText = '日の丸扇';
    this.jpDescText = '菊花紋はキク科キク属の植物であるキクを図案化した菊紋のうち、特に花の部分を中心に図案化した家紋のことを指します。中でも十六葉八重表菊は皇室の紋章としても知られ、日本の事実上の国章としても使われています。';
    this.enNameText = 'Hinomaru-ougi';
    this.enDescText = 'A chrysanthemum crest is a family crest that is a pattern of a chrysanthemum, a plant belonging to the Asteraceae family, Asteraceae, with a focus on the flower part. Among them, the 16-leaf double chrysanthemum is also known as the emblem of the imperial family, and is also used as the de facto national emblem of Japan.';

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






    // 円
    this.circles = [
      {a: 0, b: 0, r: 1600}, // 中骨用の補助円
      {a: 0, b: 0, r:  240}, // 要部分の補助円
      {a: 0, b: - 128, r:  900}, // 扇の地
      {a: 0, b:   192, r: 1760}, // 扇の天
      {a: 0, b:     0, r:   30}, // 要
      {a: 0, b:  1360, r:  515}, // 扇面の日の丸
      // {a: 0, b: - 832, r: 1600}, // 放射線用の補助円
      // {a: 0, b: - 832, r:  240}, // 中央の補助円
      // {a: 0, b: - 960, r:  900}, // 扇の地
      // {a: 0, b: - 640, r: 1760}, // 扇の天
      // {a: 0, b: - 832, r:   30}, // 要
      // {a: 0, b:   528, r:  515}, // 扇面の日の丸
    ];

    // 中骨の直線の式
    this.forms = [];
    for (var i = 0;i <= 4;i ++) {
      const fromAngle = - 30 * (i + 1);
      const group = [];
      for (var j = 0;j <= 2;j ++) {
        var circle;
        if (j == 0) {
          circle = this.circles[0];
        } else {
          const theta = THREE.MathUtils.degToRad(fromAngle + 270);
          const sign = (3 - j * 2);
          const a = 36 * Math.cos(theta) * sign;
          const b = 36 * Math.sin(theta) * sign;
          circle = {a: a, b: b, r: this.circles[0].r};
        }
        const lineFrom = this.circumPoint(circle, fromAngle);
        const lineTo   = this.circumPoint(circle, fromAngle + 180);
        const form = this.from2Points(lineFrom, lineTo);
        group.push(form);
      }
      this.forms.push(group);
    }

    // 
    // this.lineFroms = [];
    // for (var i = 0;i <= 4;i ++) {
    //   const center = this.circumPoint(this.circles[1], 210 + (30 * i));
    //   const circle = {a: center.x, b: center.y, r: 38};
    //   const angles = [120 + 30 * i, 300 + 30 * i];
    //   for (var j = 0;j <= 1;j ++) {
    //     const angle = angles[j];
    //     this.lineFroms.push(this.circumPoint(circle, angle))
    //   }
    // }
    // console.log(this.lineFroms);

    // this.lineFroms = [];
    // for (var i = 0;i <= 2;i ++) {
    //   for (var j = 0;j <= 4;j ++) {
    //     const center = this.circumPoint(this.circles[1], 210 + (30 * j));
    //     const circle = {a: center.x, b: center.y, r: 38 + (i - 1) * 4};
    //     const angles = [120 + 30 * j, 300 + 30 * j];
    //     for (var k = 0;k <= 1;k ++) {
    //       const angle = angles[k];
    //       this.lineFroms.push(this.circumPoint(circle, angle))
    //     }
    //   }
    // }
    // console.log(this.lineFroms);

    // this.lines = [];
    // for (var i = 0;i <= 2;i ++) {
    //   for (var j = 0;j <= 4;j ++) {
    //     // const center = this.circumPoint(this.circles[1], 210 + (30 * j));
    //     // const circle = {a: center.x, b: center.y, r: 38 + (i - 1) * 4};
    //     // const angles = [120 + 30 * j, 300 + 30 * j];
    //     for (var k = 0;k <= 1;k ++) {
    //       // const angle = angles[k];
    //       // this.lineFroms.push(this.circumPoint(circle, angle))
    //       if 
    //     }
    //   }
    // }



    // // 交点
    // this.lines = [
    //   [
    //     this.lineFroms[0],
    //     this.interLineCircle(this.circles[3], this.forms[4][1])[0],
    //   ],
    //   [
    //     this.lineFroms[1],
    //     this.interLineCircle(this.circles[3], this.forms[4][2])[0],
    //   ],
    //   [
    //     this.lineFroms[2],
    //     this.getIntersect(this.forms[3][1], this.forms[4][2]),
    //   ],
    //   [
    //     this.getIntersect(this.forms[3][1], this.forms[4][1]),
    //     this.interLineCircle(this.circles[2], this.forms[3][1])[0],
    //   ],
    //   [
    //     this.lineFroms[3],
    //     this.getIntersect(this.forms[3][2], this.forms[4][2]),
    //   ],
    //   [
    //     this.getIntersect(this.forms[3][2], this.forms[4][1]),
    //     this.interLineCircle(this.circles[2], this.forms[3][2])[0],
    //   ],
    //   [
    //     this.lineFroms[4],
    //     this.getIntersect(this.forms[2][1], this.forms[3][2]),
    //   ],
    //   [
    //     this.getIntersect(this.forms[2][1], this.forms[4][1]),
    //     this.interLineCircle(this.circles[2], this.forms[2][1])[1],
    //   ],
    //   [
    //     this.lineFroms[5],
    //     this.getIntersect(this.forms[2][2], this.forms[4][2]),
    //   ],
    //   [
    //     this.getIntersect(this.forms[2][2], this.forms[3][1]),
    //     this.interLineCircle(this.circles[2], this.forms[2][2])[1],
    //   ],
    //   [
    //     this.lineFroms[6],
    //     this.getIntersect(this.forms[1][1], this.forms[2][2]),
    //   ],
    //   [
    //     this.getIntersect(this.forms[1][1], this.forms[4][1]),
    //     this.interLineCircle(this.circles[2], this.forms[1][1])[1],
    //   ],
    //   [
    //     this.lineFroms[7],
    //     this.getIntersect(this.forms[1][2], this.forms[4][2]),
    //   ],
    //   [
    //     this.getIntersect(this.forms[1][2], this.forms[2][1]),
    //     this.interLineCircle(this.circles[2], this.forms[1][2])[1],
    //   ],
    //   [
    //     this.lineFroms[8],
    //     this.getIntersect(this.forms[0][1], this.forms[1][2]),
    //   ],
    //   [
    //     this.getIntersect(this.forms[0][1], this.forms[4][1]),
    //     this.interLineCircle(this.circles[3], this.forms[0][1])[1],
    //   ],
    //   [
    //     this.lineFroms[9],
    //     this.getIntersect(this.forms[0][2], this.forms[4][2]),
    //   ],
    //   [
    //     this.getIntersect(this.forms[0][2], this.forms[1][1]),
    //     this.interLineCircle(this.circles[2], this.forms[0][2])[1],
    //   ],
    // ];






    // 中心円
    this.center1 = {a: 0, b: 0, r: 1600};
    this.center2 = {a: 0, b: 0, r: 200};

    this.theta = 360 / 16;

    // 外周円１
    const thetaR = THREE.MathUtils.degToRad(this.theta / 2);
    const r = (1600 * Math.sin(thetaR)) / (1 + Math.sin(thetaR));
    this.outer1 = {a: 0, b: 1600 - r, r: r}
    this.outerAngle1 = [- this.theta / 2, 180 + this.theta / 2];

    // 放射線
    const c = r / Math.tan(thetaR);
    this.rad1 = [
      this.circumPoint(this.center1, 90 - this.theta / 2),
      new THREE.Vector3(0, 0, 0),
    ];
    this.rad2 = [
      new THREE.Vector3(c * Math.sin(thetaR), c * Math.cos(thetaR), 0),
      this.circumPoint(this.center2, 90 - this.theta / 2),
    ];

    // 外周円２
    const point1 = this.circumPoint(this.center1, 90 - (this.theta / 4));
    const point2 = new THREE.Vector3(0, 0, 0);
    const form = this.from2Points(point1, point2);
    const inter = this.interLineCircle(this.outer1, form);
    const angle = this.circumAngle(this.outer1, inter[0]);
    this.outerAngle2 = [angle, 180 - angle];

    this.center3 = {a: 0, b: 0, r: 1600 - r}
    const v1 = this.circumPoint(this.center3, 90 + this.theta / 2);
    this.outer3 = {a:   v1.x, b: v1.y, r: r + 4}
    this.outer4 = {a: - v1.x, b: v1.y, r: r + 4}

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
          kouten.push(new THREE.Vector3(n, - r + k, 0));
          kouten.push(new THREE.Vector3(n, r + k, 0));
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
    // const form1 = this.from2Points(va1[0], va1[1]);
    // const form2 = this.from2Points(va2[0], va2[1]);
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

  // ガイドラインを作成
  generateGuideline = () => {

    // 中骨の補助円１
    const circles1 = [this.circles[0]];
    circles1.forEach((circle) => {
      const points = this.circleLocusGen(circle, [90, 450], this.divCount);
      const mesh = this.sublineGen(points);
      mesh.geometry.translate(0, - 832, 0);
      this.guidelines.add(mesh);
    })

    // 天の円
    const circles2 = [this.circles[3]];
    circles2.forEach((circle) => {
      const points = this.circleLocusGen(circle, [90, 450], this.divCount);
      const mesh = this.guidelineGen(points);
      mesh.geometry.translate(0, - 832, 0);
      this.guidelines.add(mesh);
    })

    // 中骨の補助線
    for (var i = 0;i <= 4;i ++) {
      const form = this.forms[i][0];
      const inter = this.interLineCircle(this.circles[3], form);
      const pointFrom = inter[i <= 2 ? 0 : 1];
      const pointTo = inter[i <= 2 ? 1 : 0];
      const line = this.lineLocusGen(pointFrom, pointTo, 0, this.divCount);
      const mesh = this.sublineGen(line);
      mesh.geometry.translate(0, - 832, 0);
      this.guidelines.add(mesh);
    }

    // 中骨
    for (var i = 0;i <= 4;i ++) {
      const group = new THREE.Group();
      for (var j = 1;j <= 2;j ++) {
        const form = this.forms[i][j];
        const inter = this.interLineCircle(this.circles[3], form);
        const pointFrom = inter[i <= 2 ? 0 : 1];
        const pointTo = inter[i <= 2 ? 1 : 0];
        const line = this.lineLocusGen(pointFrom, pointTo, 0, this.divCount);
        const mesh = this.guidelineGen(line);
        mesh.geometry.translate(0, - 832, 0);
        group.add(mesh);
      }
      this.guidelines.add(group);
    }

    // 地の円
    const circles3 = [this.circles[2]];
    circles3.forEach((circle) => {
      const points = this.circleLocusGen(circle, [90, 450], this.divCount);
      const mesh = this.guidelineGen(points);
      mesh.geometry.translate(0, - 832, 0);
      this.guidelines.add(mesh);
    })

    // 中骨の補助円２
    const circles4 = [this.circles[1]];
    circles4.forEach((circle) => {
      const points = this.circleLocusGen(circle, [90, 450], this.divCount);
      const mesh = this.sublineGen(points);
      mesh.geometry.translate(0, - 832, 0);
      this.guidelines.add(mesh);
    })

    // 要の先端
    const circles5 = [this.circles[1]];
    circles5.forEach((circle) => {
      for (var i = 0;i <= 4;i ++) {
        const center = this.circumPoint(circle, 210 + (30 * i));
        const dCircle = {a: center.x, b: center.y, r: 38};
        const points = this.circleLocusGen(dCircle, [90, 450], this.divCount);
        const mesh = this.guidelineGen(points);
        mesh.geometry.translate(0, - 832, 0);
        this.guidelines.add(mesh);
      }
    })

    // 要と日の丸
    const circles6 = [this.circles[4], this.circles[5]];
    circles6.forEach((circle) => {
      const points = this.circleLocusGen(circle, [90, 450], this.divCount);
      const mesh = this.guidelineGen(points);
      mesh.geometry.translate(0, - 832, 0);
      this.guidelines.add(mesh);
    })

    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    // 天の孤の角度
    const inter1 = this.interLineCircle(this.circles[3], this.forms[0][1]);
    const inter2 = this.interLineCircle(this.circles[3], this.forms[4][2]);
    const arcFrom1 = this.circumAngle(this.circles[3], inter1[1]);
    const arcTo1   = this.circumAngle(this.circles[3], inter2[0]);

    // 地の孤の角度
    const inter3 = this.interLineCircle(this.circles[2], this.forms[0][1]);
    const inter4 = this.interLineCircle(this.circles[2], this.forms[4][1]);
    const arcFrom2 = this.circumAngle(this.circles[2], inter3[1]);
    const arcTo2   = this.circumAngle(this.circles[2], inter4[0]);

    // 円と孤
    const circles = [this.circles[2], this.circles[3], this.circles[4], this.circles[5]];
    const angles = [[arcFrom2, arcTo2], [arcFrom1, arcTo1], [0, 360], [0, 360]];
    const clockwises = [true, true, false, false];
    for (var i = 0;i <= circles.length - 1;i ++) {
      const circle = circles[i];
      const angle = angles[i];
      const clockwise = clockwises[i];
      const geo = this.curveOutlineGeoGen(circle, angle, clockwise);
      const mesh = new THREE.Mesh(geo, this.outlineMat);
      mesh.geometry.translate(0, - 832, 0);
      this.outlines.add(mesh);
    }

    // 中骨と要の先端
    const termini = [
      [
        this.interLineCircle(this.circles[3], this.forms[4][1])[0],
        this.interLineCircle(this.circles[3], this.forms[4][2])[0],
      ],
      [
        [
          this.getIntersect(this.forms[3][1], this.forms[4][2]),
          this.getIntersect(this.forms[3][1], this.forms[4][1]),
          this.interLineCircle(this.circles[2], this.forms[3][1])[0],
        ],
        [
          this.getIntersect(this.forms[3][2], this.forms[4][2]),
          this.getIntersect(this.forms[3][2], this.forms[4][1]),
          this.interLineCircle(this.circles[2], this.forms[3][2])[0],
        ],
      ],
      [
        [
          this.getIntersect(this.forms[2][1], this.forms[3][2]),
          this.getIntersect(this.forms[2][1], this.forms[4][1]),
          this.interLineCircle(this.circles[2], this.forms[2][1])[1],
        ],
        [
          this.getIntersect(this.forms[2][2], this.forms[4][2]),
          this.getIntersect(this.forms[2][2], this.forms[3][1]),
          this.interLineCircle(this.circles[2], this.forms[2][2])[1],
        ],
      ],
      [
        [
          this.getIntersect(this.forms[1][1], this.forms[2][2]),
          this.getIntersect(this.forms[1][1], this.forms[4][1]),
          this.interLineCircle(this.circles[2], this.forms[1][1])[1],
        ],
        [
          this.getIntersect(this.forms[1][2], this.forms[4][2]),
          this.getIntersect(this.forms[1][2], this.forms[2][1]),
          this.interLineCircle(this.circles[2], this.forms[1][2])[1],
        ],
      ],
      [
        [
          this.getIntersect(this.forms[0][1], this.forms[1][2]),
          this.getIntersect(this.forms[0][1], this.forms[4][1]),
          this.interLineCircle(this.circles[3], this.forms[0][1])[1],
        ],
        [
          this.getIntersect(this.forms[0][2], this.forms[4][2]),
          this.getIntersect(this.forms[0][2], this.forms[1][1]),
          this.interLineCircle(this.circles[2], this.forms[0][2])[1],
        ],
      ],
    ];

    for (var i = 0;i <= 4;i ++) {
      const center = this.circumPoint(this.circles[1], 210 + (30 * i));
      const circle = {a: center.x, b: center.y, r: 38};
      const angles = [120 + 30 * i, 300 + 30 * i];

      for (var j = 0;j <= 1;j ++) {
        const angle = angles[j];
        if (i == 0) {
          const pointFrom = this.circumPoint(circle, angle);
          const geo = this.outlineGeoGen(pointFrom, termini[i][j]);
          const mesh = new THREE.Mesh(geo, this.outlineMat);
          mesh.geometry.translate(0, - 832, 0);
          this.outlines.add(mesh);
        } else {
          for (var k = 0;k <= 1;k ++) {
            const pointFrom = k == 0 ? this.circumPoint(circle, angle) : termini[i][j][1];
            const pointTo = k == 0 ? termini[i][j][0] : termini[i][j][2];
            const geo = this.outlineGeoGen(pointFrom, pointTo);
            const mesh = new THREE.Mesh(geo, this.outlineMat);
            mesh.geometry.translate(0, - 832, 0);
            this.outlines.add(mesh);
          }
        }
      }

      const geo = this.curveOutlineGeoGen(circle, angles, false);
      const mesh = new THREE.Mesh(geo, this.outlineMat);
      mesh.geometry.translate(0, - 832, 0);
      this.outlines.add(mesh);
    }

    this.group.add(this.outlines);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    const w = 4;

    // 扇
    const c3 = this.circles[3];
    const topCircle = {a: c3.a, b: c3.b, r: c3.r - w};
    const theta1 = THREE.MathUtils.radToDeg(Math.asin((36 - w) / (c3.r - w)));
    const theta2 = THREE.MathUtils.radToDeg(Math.asin((36 + w) / (c3.r - w)));
    console.log(theta1, theta2)
    const arcFrom = 150 + theta1;
    const arcTo   =  30 + theta2;
    const topCurve = this.curvePointGen(topCircle, [arcFrom, arcTo], true);

    const c2 = this.circles[2];
    const botCircle = {a: c2.a, b: c2.b, r: c2.r + w};
    // const theta3 = THREE.MathUtils.radToDeg(Math.asin((36 - w) / (c3.r - w)));
    // const theta4 = THREE.MathUtils.radToDeg(Math.asin((36 + w) / (c3.r - w)));
    // const botFrom = 150 + theta1;
    // const botTo   =  30 + theta2;
    const botCurve = this.curvePointGen(botCircle, [arcTo, arcFrom], false);
    const points = topCurve.concat(botCurve);
    // const shape = this.curvePointGen(param, [0, 360], true);
    const geo = this.shapeGeoGen(points);
    const mesh = new THREE.Mesh(geo, this.shapeMat);
    mesh.geometry.translate(0, - 832, 0);
    this.shapes.add(mesh);


    // const w = 4;

    // // 中心円
    // [this.center2].forEach((circle) => {
    //   const param = {a: circle.a, b: circle.b, r: circle.r - w};
    //   const shape = this.curvePointGen(param, [0, 360], true);
    //   const geo = this.shapeGeoGen(shape);
    //   const mesh = new THREE.Mesh(geo, this.shapeMat);
    //   this.shapes.add(mesh);
    // });

    // const geos = [];

    // // 手前の花弁
    // const outer2 = {a: this.outer1.a, b: this.outer1.b, r: this.outer1.r - w};
    // const points1 = this.curvePointGen(outer2, this.outerAngle1, false);

    // const center2 = {a: this.center2.a, b: this.center2.b, r: this.center2.r + w};
    // const diff = THREE.MathUtils.radToDeg(Math.asin(w / center2.r));
    // const angles = [90 + this.theta / 2 - diff, 90 - this.theta / 2 + diff]
    // const points2 = this.curvePointGen(center2, angles, true);

    // const points3 = points1.concat(points2);
    // const geo1 = this.shapeGeoGen(points3);
    // geos.push(geo1);

    // // 奥の花弁
    // const angles2 = [this.outerAngle2[0] + diff, this.outerAngle2[1] - diff];
    // const points4 = this.curvePointGen(outer2, angles2, false);

    // const angles3 = [
    //   this.outerAngle2[0] + this.theta / 2 - diff - 1,
    //   this.outerAngle1[0] + this.theta / 2 + diff,
    // ];
    // const points5 = this.curvePointGen(this.outer3, angles3, true);

    // const angles4 = [
    //   this.outerAngle1[1] - this.theta / 2 - diff,
    //   this.outerAngle2[1] - this.theta / 2 + diff + 1,
    // ];
    // const points6 = this.curvePointGen(this.outer4, angles4, true);

    // const points7 = points4.concat(points5, points6);
    // const geo2 = this.shapeGeoGen(points7);
    // geos.push(geo2);

    // // メッシュの生成を16回繰り返す
    // for (var i = 0;i <= geos.length - 1;i ++) {
    //   const geo = geos[i];
    //   for (var j = 0;j <= 15;j ++) {
    //     const mesh = new THREE.Mesh(geo, this.shapeMat);
    //     const angle = i == 1 ? this.theta * (j - 0.5) : this.theta * j
    //     mesh.rotation.z = THREE.MathUtils.degToRad(angle);
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
