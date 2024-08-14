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
    this.squares = [];
    this.sides = [360, 260];
    this.sides.forEach((side) => {
      const square = [];
      const points = [
        new THREE.Vector3(- side,   side, 0),
        new THREE.Vector3(  side,   side, 0),
        new THREE.Vector3(  side, - side, 0),
        new THREE.Vector3(- side, - side, 0),
      ];
      for (var i = 0;i <= points.length - 1;i ++) {
        square.push([points[i], points[i == 3 ? 0 :i + 1]]);
      }
      this.squares.push(square);
    })

    // 円
    this.circles = [
      {a:      0, b:      0, r: 1600}, // 0

      {a:      0, b:      0, r: 1400}, // 1
      {a:      0, b:      0, r: 1000},
      {a:      0, b:      0, r:  600},

      {a:      0, b: - 1710, r: 1400}, // 4
      {a:      0, b: - 1710, r: 1000},
      {a:      0, b: - 1710, r:  600},

      {a:   1600, b: -  950, r: 1800}, // 7
      {a:   1600, b: -  950, r: 1400},
      {a:   1600, b: -  950, r: 1000},

      {a: - 1600, b: -  950, r: 1800}, // 10
      {a: - 1600, b: -  950, r: 1400},
      {a: - 1600, b: -  950, r: 1000},
    ];

    this.forms = [
      {a: 1, b: 0, c:   this.sides[0]},
      {a: 1, b: 0, c: - this.sides[0]}
    ];
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
    // if (D >= 0) {
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
          kouten.push(new THREE.Vector3(n, k + Math.sqrt(r ** 2 - (h - n) ** 2), 0));
          kouten.push(new THREE.Vector3(n, k - Math.sqrt(r ** 2 - (h - n) ** 2), 0));
        } else {
          kouten.push(new THREE.Vector3(x1, m * x1 + n, 0));
          kouten.push(new THREE.Vector3(x2, m * x2 + n, 0));
        }
      }
    // }
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

    const subCircles = [
      {a: 0, b: 0, r: Math.sqrt(this.sides[0] ** 2 * 2)},
      {a: 0, b: 0, r: Math.sqrt(this.sides[1] ** 2 * 2)},
    ];

    const objects = [
      [
        {c: true,  s: false, o: this.circles[0]},
      ],
      [
        {c: true,  s: true,  o: subCircles[0]},
        {c: true,  s: true,  o: subCircles[1]},
      ],
      [
        {c: false, s: false, o: this.squares[0][0]},
        {c: false, s: false, o: this.squares[0][1]},
        {c: false, s: false, o: this.squares[0][2]},
        {c: false, s: false, o: this.squares[0][3]},
      ],
      [
        {c: false, s: false, o: this.squares[1][0]},
        {c: false, s: false, o: this.squares[1][1]},
        {c: false, s: false, o: this.squares[1][2]},
        {c: false, s: false, o: this.squares[1][3]},
      ],
      [
        {c: true,  s: false, o: this.circles[3]},
        {c: true,  s: false, o: this.circles[6]},
        {c: true,  s: false, o: this.circles[12]},
        {c: true,  s: false, o: this.circles[9]},
      ],
      [
        {c: true,  s: false, o: this.circles[2]},
        {c: true,  s: false, o: this.circles[5]},
        {c: true,  s: false, o: this.circles[11]},
        {c: true,  s: false, o: this.circles[8]},
      ],
      [
        {c: true,  s: false, o: this.circles[1]},
        {c: true,  s: false, o: this.circles[4]},
        {c: true,  s: false, o: this.circles[10]},
        {c: true,  s: false, o: this.circles[7]},
      ],
    ];

    objects.forEach((object) => {
      const group = new THREE.Group();
      object.forEach((param) => {
        const points = param.c
          ? this.circleLocusGen(param.o, [270, - 90], this.divCount)
          : this.lineLocusGen(param.o[0], param.o[1], 0, this.divCount);
        const mesh = param.s ? this.sublineGen(points) : this.guidelineGen(points);
        group.add(mesh);
      })
      this.guidelines.add(group);
    })

    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    // 円
    const circles = this.circles;
    circles.push(this.circles[4]);

    // 円・直線の交点
    const inters = [
      this.inter2Circles(this.circles[2], this.circles[10]),
      this.inter2Circles(this.circles[2], this.circles[7]),

      this.inter2Circles(this.circles[3], this.circles[10]),
      this.inter2Circles(this.circles[3], this.circles[7]),

      this.inter2Circles(this.circles[4], this.circles[1]),
      this.inter2Circles(this.circles[5], this.circles[1]),
      this.inter2Circles(this.circles[6], this.circles[1]),

      this.interLineCircle(this.circles[7], {a: 1, b: 0, c: this.sides[0]}),
      this.inter2Circles(this.circles[7], this.circles[1]),

      this.interLineCircle(this.circles[8], {a: 1, b: 0, c: this.sides[0]}),
      this.inter2Circles(this.circles[8], this.circles[1]),

      this.inter2Circles(this.circles[9], this.circles[4]),
      this.inter2Circles(this.circles[9], this.circles[1]),

      this.inter2Circles(this.circles[10], this.circles[1]),
      this.interLineCircle(this.circles[10], {a: 1, b: 0, c: - this.sides[0]}),

      this.inter2Circles(this.circles[11], this.circles[1]),
      this.interLineCircle(this.circles[11], {a: 1, b: 0, c: - this.sides[0]}),

      this.inter2Circles(this.circles[12], this.circles[1]),
      this.inter2Circles(this.circles[12], this.circles[4]),

      this.interLineCircle(this.circles[4], {a: 1, b: 0, c: - this.sides[0]}),
      this.interLineCircle(this.circles[4], {a: 1, b: 0, c: this.sides[0]}),
    ];

    // 描画角度
    const angles = [
      [0, 360],

      [0, 360],
      [
        this.circumAngle(this.circles[2], inters[0][1]),
        this.circumAngle(this.circles[2], inters[1][0]),
      ],
      [
        this.circumAngle(this.circles[3], inters[2][1]),
        this.circumAngle(this.circles[3], inters[3][0]),
      ],

      [
        this.circumAngle(this.circles[4], inters[4][1]),
        this.circumAngle(this.circles[4], inters[19][0]),
      ],
      [
        this.circumAngle(this.circles[5], inters[5][1]),
        this.circumAngle(this.circles[5], inters[5][0]),
      ],
      [
        this.circumAngle(this.circles[6], inters[6][1]),
        this.circumAngle(this.circles[6], inters[6][0]),
      ],

      [
        this.circumAngle(this.circles[7], inters[7][0]),
        this.circumAngle(this.circles[7], inters[8][0]),
      ],
      [
        this.circumAngle(this.circles[8], inters[9][0]),
        this.circumAngle(this.circles[8], inters[10][0]),
      ],
      [
        this.circumAngle(this.circles[9], inters[11][1]),
        this.circumAngle(this.circles[9], inters[12][0]),
      ],

      [
        this.circumAngle(this.circles[10], inters[13][1]),
        this.circumAngle(this.circles[10], inters[14][0]),
      ],
      [
        this.circumAngle(this.circles[11], inters[15][1]),
        this.circumAngle(this.circles[11], inters[16][0]),
      ],
      [
        this.circumAngle(this.circles[12], inters[17][1]),
        this.circumAngle(this.circles[12], inters[18][0]),
      ],
      [
        this.circumAngle(this.circles[4], inters[4][0]),
        this.circumAngle(this.circles[4], inters[20][0]),
      ],
    ];

    // 描画方向
    const clockwises = [
      true,
      true, true, true,
      true, true, true,
      true, true, true,
      true, true, true,
    ]

    const geos = [];

    // 四角形
    this.squares.forEach((square) => {
      square.forEach((points) => {
        geos.push(this.outlineGeoGen(points[0], points[1]));
      })
    })

    for (var i = 0;i <= circles.length - 1;i ++) {
      const circle = circles[i];
      const angle = angles[i];
      const clockwise = clockwises[i];
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

    const w = 4;

    const geos = [];
    const circles0 = [], circles2 = [];

    this.circles.forEach((circle) => {
      circles0.push({a: circle.a, b: circle.b, r: circle.r - w});
      circles2.push({a: circle.a, b: circle.b, r: circle.r + w});
    })

    const forms = [
      {a: 1, b: 0, c:   this.sides[0] + w},
      {a: 1, b: 0, c: - this.sides[0] - w}
    ];

    // 中心円
    const shape = this.curvePointGen(circles0[0], [0, 360], true);
    const path = this.curvePointGen(circles2[1], [0, 360], true);
    geos.push(this.shapeGeoGen(shape, path));

    // 四角形
    const apices = [];
    const sides = [this.sides[0] - w, this.sides[1] + w];
    sides.forEach((side) => {
      apices.push([
        new THREE.Vector3(- side,   side, 0),
        new THREE.Vector3(  side,   side, 0),
        new THREE.Vector3(  side, - side, 0),
        new THREE.Vector3(- side, - side, 0),
      ]);
    })
    geos.push(this.shapeGeoGen(apices[0], apices[1]));

    // 浪
    const inters = [
      this.inter2Circles(circles0[1], circles2[10])[1], // 0
      this.inter2Circles(circles0[1], circles2[7])[0],
      this.inter2Circles(circles2[7], circles2[2])[0],
      this.inter2Circles(circles2[2], circles2[10])[1],

      this.inter2Circles(circles0[2], circles2[10])[1], // 4
      this.inter2Circles(circles0[2], circles2[7])[0],
      this.inter2Circles(circles2[7], circles2[3])[0],
      this.inter2Circles(circles2[3], circles2[10])[1],

      this.inter2Circles(circles0[3], circles2[10])[1], // 8
      this.inter2Circles(circles0[3], circles2[7])[0],
      this.interLineCircle(circles2[7], forms[0])[0],
      this.interLineCircle(circles2[10], forms[1])[0],

      this.inter2Circles(circles0[4], circles0[1])[1], // 12
      this.interLineCircle(circles0[4], forms[1])[0],
      this.interLineCircle(circles0[4], forms[0])[0],
      this.inter2Circles(circles0[4], circles0[1])[0],
      this.inter2Circles(circles0[1], circles2[5])[0],
      this.inter2Circles(circles0[1], circles2[5])[1],

      this.inter2Circles(circles0[5], circles0[1])[1], // 18
      this.inter2Circles(circles0[5], circles0[1])[0],
      this.inter2Circles(circles0[1], circles2[6])[0],
      this.inter2Circles(circles0[1], circles2[6])[1],

      this.inter2Circles(circles0[6], circles0[1])[1], // 22
      this.inter2Circles(circles0[6], circles0[1])[0],

      this.interLineCircle(circles0[7], forms[0])[0], // 24
      this.inter2Circles(circles0[7], circles0[1])[0],
      this.inter2Circles(circles0[1], circles2[8])[0],
      this.interLineCircle(circles2[8], forms[0])[0],

      this.interLineCircle(circles0[8], forms[0])[0], // 28
      this.inter2Circles(circles0[8], circles0[1])[0],
      this.inter2Circles(circles0[1], circles2[9])[0],
      this.inter2Circles(circles2[9], circles2[4])[1],
      this.interLineCircle(circles2[4], forms[0])[0],

      this.inter2Circles(circles0[9], circles2[4])[1], // 33
      this.inter2Circles(circles0[9], circles0[1])[0],
      this.inter2Circles(circles0[1], circles2[4])[0],

      this.interLineCircle(circles0[10], forms[1])[0], // 36
      this.inter2Circles(circles0[10], circles0[1])[1],
      this.inter2Circles(circles0[1], circles2[11])[1],
      this.interLineCircle(circles2[11], forms[1])[0],

      this.interLineCircle(circles0[11], forms[1])[0], // 40
      this.inter2Circles(circles0[11], circles0[1])[1],
      this.inter2Circles(circles0[1], circles2[12])[1],
      this.inter2Circles(circles2[12], circles2[4])[0],
      this.interLineCircle(circles2[4], forms[1])[0],

      this.inter2Circles(circles0[12], circles2[4])[0], // 45
      this.inter2Circles(circles0[12], circles0[1])[1],
      this.inter2Circles(circles0[1], circles2[4])[1],

    ];

    const circleArr = [
      [circles0[1], circles2[7], circles2[2], circles2[10]],
      [circles0[2], circles2[7], circles2[3], circles2[10]],
      [circles0[3], circles2[7], circles2[10]],
      [circles0[4], circles0[4], circles0[1], circles2[5], circles0[1]],
      [circles0[5], circles0[1], circles2[6], circles0[1]],
      [circles0[6], circles0[1]],
      [circles0[7], circles0[1], circles2[8]],
      [circles0[8], circles0[1], circles2[9], circles2[4]],
      [circles0[9], circles0[1], circles2[4]],
      [circles0[10], circles0[1], circles2[11]],
      [circles0[11], circles0[1], circles2[12], circles2[4]],
      [circles0[12], circles0[1], circles2[4]],
    ];

    const angleArr = [
      [
        [this.circumAngle(circles0[1],  inters[0]), this.circumAngle(circles0[1],  inters[1])],
        [this.circumAngle(circles2[7],  inters[1]), this.circumAngle(circles2[7],  inters[2])],
        [this.circumAngle(circles2[2],  inters[2]), this.circumAngle(circles2[2],  inters[3])],
        [this.circumAngle(circles2[10], inters[3]), this.circumAngle(circles2[10], inters[0])],
      ],
      [
        [this.circumAngle(circles0[2],  inters[4]), this.circumAngle(circles0[2],  inters[5])],
        [this.circumAngle(circles2[7],  inters[5]), this.circumAngle(circles2[7],  inters[6])],
        [this.circumAngle(circles2[3],  inters[6]), this.circumAngle(circles2[3],  inters[7])],
        [this.circumAngle(circles2[10], inters[7]), this.circumAngle(circles2[10], inters[4])],
      ],
      [
        [this.circumAngle(circles0[3],  inters[8]), this.circumAngle(circles0[3],  inters[9])],
        [this.circumAngle(circles2[7],  inters[9]), this.circumAngle(circles2[7],  inters[10])],
        [this.circumAngle(circles2[10], inters[11]), this.circumAngle(circles2[10], inters[8])],
      ],
      [
        [this.circumAngle(circles0[4],  inters[12]), this.circumAngle(circles0[4],  inters[13])],
        [this.circumAngle(circles0[4],  inters[14]), this.circumAngle(circles0[4],  inters[15])],
        [this.circumAngle(circles0[1],  inters[15]), this.circumAngle(circles0[1],  inters[16])],
        [this.circumAngle(circles2[5],  inters[16]), this.circumAngle(circles2[5],  inters[17])],
        [this.circumAngle(circles0[1],  inters[17]), this.circumAngle(circles0[1],  inters[12])],
      ],
      [
        [this.circumAngle(circles0[5],  inters[18]), this.circumAngle(circles0[5],  inters[19])],
        [this.circumAngle(circles0[1],  inters[19]), this.circumAngle(circles0[1],  inters[20])],
        [this.circumAngle(circles2[6],  inters[20]), this.circumAngle(circles2[6],  inters[21])],
        [this.circumAngle(circles0[1],  inters[21]), this.circumAngle(circles0[1],  inters[18])],
      ],
      [
        [this.circumAngle(circles0[6],  inters[22]), this.circumAngle(circles0[6],  inters[23])],
        [this.circumAngle(circles0[1],  inters[23]), this.circumAngle(circles0[1],  inters[22])],
      ],
      [
        [this.circumAngle(circles0[7],  inters[24]), this.circumAngle(circles0[7],  inters[25])],
        [this.circumAngle(circles0[1],  inters[25]), this.circumAngle(circles0[1],  inters[26])],
        [this.circumAngle(circles2[8],  inters[26]), this.circumAngle(circles2[8],  inters[27])],
      ],
      [
        [this.circumAngle(circles0[8],  inters[28]), this.circumAngle(circles0[8],  inters[29])],
        [this.circumAngle(circles0[1],  inters[29]), this.circumAngle(circles0[1],  inters[30])],
        [this.circumAngle(circles2[9],  inters[30]), this.circumAngle(circles2[9],  inters[31])],
        [this.circumAngle(circles2[4],  inters[31]), this.circumAngle(circles2[4],  inters[32])],
      ],
      [
        [this.circumAngle(circles0[9],  inters[33]), this.circumAngle(circles0[9],  inters[34])],
        [this.circumAngle(circles0[1],  inters[34]), this.circumAngle(circles0[1],  inters[35])],
        [this.circumAngle(circles2[4],  inters[35]), this.circumAngle(circles2[4],  inters[33])],
      ],
      [
        [this.circumAngle(circles0[10],  inters[36]), this.circumAngle(circles0[10],  inters[37])],
        [this.circumAngle(circles0[1],  inters[37]), this.circumAngle(circles0[1],  inters[38])],
        [this.circumAngle(circles2[11],  inters[38]), this.circumAngle(circles2[11],  inters[39])],
      ],
      [
        [this.circumAngle(circles0[11],  inters[40]), this.circumAngle(circles0[11],  inters[41])],
        [this.circumAngle(circles0[1],  inters[41]), this.circumAngle(circles0[1],  inters[42])],
        [this.circumAngle(circles2[12],  inters[42]), this.circumAngle(circles2[12],  inters[43])],
        [this.circumAngle(circles2[4],  inters[43]), this.circumAngle(circles2[4],  inters[44])],
      ],
      [
        [this.circumAngle(circles0[12],  inters[45]), this.circumAngle(circles0[12],  inters[46])],
        [this.circumAngle(circles0[1],  inters[46]), this.circumAngle(circles0[1],  inters[47])],
        [this.circumAngle(circles2[4],  inters[47]), this.circumAngle(circles2[4],  inters[45])],
      ],
    ];

    const clockwiseArr = [
      [true, false, false, false],
      [true, false, false, false],
      [true, false, false],
      [true, true,  true,  false, true],
      [true, true,  false, true],
      [true, true],
      [true, true,  false],
      [true, true,  false, false],
      [true, true,  false],
      [false, false,  true],
      [false, false,  true, true],
      [false, false,  true],
    ];

    for (var i = 0;i <= circleArr.length - 1;i ++) {
      var points = [];
      const circles = circleArr[i];
      const angles = angleArr[i];
      const clockwises = clockwiseArr[i];
      for (var j = 0;j <= circles.length - 1;j ++) {
        const circle = circles[j];
        const angle = angles[j];
        const clockwise = clockwises[j];
        points = points.concat(this.curvePointGen(circle, angle, clockwise));
      }
      geos.push(this.shapeGeoGen(points));
    }

    geos.forEach((geo) => {
      const mesh = new THREE.Mesh(geo, this.shapeMat);
      this.shapes.add(mesh);
    })

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
