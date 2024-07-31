'use strict';

import * as THREE from 'three';
import Kamon from '../kamon2.js';

export default class DakiMyouga extends Kamon {

  constructor() {

    super();

    // infoのテキスト
    this.jpNameText = '抱き茗荷';
    this.jpDescText = '茗荷紋は、香味野菜として知られるミョウガをモチーフにした家紋で、日本十代家紋の一つに数えられます。茗荷紋は摩多羅神のシンボルと言われており、摩多羅神が日光東照宮に祀られたことがきっかけで広まったとされています。また、仏教用語である冥加（神仏からの目に見えない加護）と発音が同じであることも縁起が良いとされ、普及した要因の一つと言われています。';
    this.enNameText = 'Daki-Myouga';
    this.enDescText = 'Myougamon is a family crest with a motif of Japanese ginger, which is known as a flavorful vegetable, and is considered one of the ten Japanese family crests. The Myouga crest is said to be a symbol of the god Matara, and it is said that it became popular when Matara was enshrined at Nikko Toshogu Shrine. It is also said to have the same pronunciation as the Buddhist term Myouga (invisible protection from the gods and Buddha), which is said to be auspicious, and is said to be one of the reasons for its popularity.';

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

    this.circles = [
      [
        {a:      0, b:      0, r: 1600},
      ],
      [
        {a: -  208, b: - 1404, r:  180},
        {a:      0, b: -  880, r:  570},
        {a: - 1415, b: - 1020, r:  853},
      ],
      [
        {a: -  300, b: -  840, r:  768},
        {a:    670, b: -  820, r: 1000},
      ],
      [
        {a: - 1800, b: -  550, r: 1168},
      ],
      [
        {a: -   70, b: -  650, r: 1168},
        {a: - 2470, b:    670, r: 2450},
      ],
      [
        {a: - 1700, b:    240, r: 1068},
      ],
      [
        {a: -   60, b:     55, r: 1018},
        {a: - 2470, b:   1150, r: 2450},
      ],
      [
        {a: - 1655, b:   1130, r: 1118},
      ],
      [
      // 左側の２こぶ
        {a: -  512, b:   1427, r:   85},
        {a: -  390, b:   1484, r:   65},
      // 右側の２こぶ
        {a: -   96, b:   1126, r:   85},
        {a: -   80, b:   1240, r:   65},
      // 左側のくぼみ
        {a: -  215, b:   1360, r:  150},
        {a: -  330, b:   1340, r:   33},
        {a: -  595, b:   1455, r:  320},
      // 右側のくぼみ
        {a: -  250, b:   1370, r:  150},
        {a: -  225, b:   1255, r:   33},
        {a: -   40, b:   1034, r:  320},
      // 中央の３こぶ
        {a: -  205, b:   1508, r:   75},
        {a: -   90, b:   1532, r:   65},
        {a: -  100, b:   1425, r:   75},
      ],

    ]

    // 輪郭
    this.frames = [
      [
        {r: this.circles[1][2],  f: 101.8, t:    5,   c: true,  s: 0, o: true},
        {r: this.circles[1][1],  f: 186.5, t:  230,   c: false, s: 2, o: true},
        {r: this.circles[1][0],  f: 152,   t: - 95,   c: true,  s: 0, o: true},
        {r: this.circles[0][0],  f: 262,   t:  186.8, c: true,  s: 0, o: true},
      ],
      [
        {r: this.circles[2][1],  f: 135.7, t:  204,   c: false, s: 2, o: true},
        {r: this.circles[1][0],  f: 103,   t:  150,   c: false, s: 2, o: false},
        {r: this.circles[1][1],  f: 228,   t:  185,   c: true,  s: 0, o: false},
        {r: this.circles[1][2],  f:   6,   t:   51.6, c: false, s: 2, o: false},
        {r: this.circles[2][0],  f: 140,   t:   70.2, c: true,  s: 0, o: true},
      ],
      [
        {r: this.circles[3][0],  f:  74.6, t:   18.7, c: true,  s: 0, o: true},
        {r: this.circles[2][0],  f: 120.8, t:  140,   c: false, s: 2, o: false},
        {r: this.circles[1][2],  f:  52.4, t:  101.8, c: false, s: 2, o: false},
        {r: this.circles[0][0],  f: 186.4, t:  159.0 ,c: true,  s: 0, o: true},
      ],
      [
        {r: this.circles[4][1],  f: - 3.5, t: - 18.0, c: true,  s: 0, o: true },
        {r: this.circles[2][0],  f:  78.4, t:  120.4, c: false, s: 2, o: false},
        {r: this.circles[3][0],  f:  19.4, t:   38.6, c: false, s: 2, o: false},
        {r: this.circles[4][0],  f: 134.6, t:   88.0, c: true,  s: 0, o: true },
      ],
      [
        {r: this.circles[5][0],  f:  57.1, t:    7.0, c: true,  s: 0, o: true },
        {r: this.circles[4][0],  f: 119.4, t:  134.4, c: false, s: 2, o: false},
        {r: this.circles[3][0],  f:  39.8, t:   74.5, c: false, s: 2, o: false},
        {r: this.circles[0][0],  f: 158.7, t:  134.6, c: true,  s: 0, o: true },
      ],
      [
        {r: this.circles[6][1],  f: - 2.0, t: - 14.9, c: true,  s: 0, o: true},
        {r: this.circles[4][0],  f:  91.4, t:  119.0, c: false, s: 2, o: false},
        {r: this.circles[5][0],  f:   8.2, t:   30.0, c: false, s: 2, o: false},
        {r: this.circles[6][0],  f: 134.6, t:   87.9, c: true,  s: 0, o: true},
      ],
      [
        {r: this.circles[7][0],  f:  18.4, t: -  9.4, c: true,  s: 0, o: true},
        {r: this.circles[6][0],  f: 119,   t:  134.6, c: false, s: 2, o: false},
        {r: this.circles[5][0],  f:  32.2, t:   57.0, c: false, s: 2, o: false},
        {r: this.circles[0][0],  f: 134.6, t:  112,   c: true,  s: 0, o: true},
      ],
      [
      // 中央の３こぶ
        {r: this.circles[8][10], f: 179,   t:   42,   c: true,  s: 0, o: true},
        {r: this.circles[8][11], f: 156,   t: - 54,   c: true,  s: 0, o: true},
        {r: this.circles[8][12], f: 408,   t:  282,   c: true,  s: 0, o: true},
      // 右側のくぼみ
        {r: this.circles[8][9],  f:  98,   t:  128.8, c: false, s: 2, o: true},
        {r: this.circles[8][8],  f: 118,   t:  300  , c: false, s: 2, o: true},
        {r: this.circles[8][7],  f: 286,   t:  324.2, c: false, s: 2, o: true},
      // 右側の２こぶ
        {r: this.circles[8][3],  f: 514,   t:  312  , c: true,  s: 0, o: true},
        {r: this.circles[8][2],  f: 410,   t:  324  , c: true,  s: 0, o: true},
      // 根本の輪郭
        {r: this.circles[6][0],  f:  88.4, t:  134.0, c: false, s: 2, o: false},
        {r: this.circles[7][0],  f: - 9.0, t:   17.4, c: false, s: 2, o: false},
      // 左側の２こぶ
        {r: this.circles[8][0],  f: 150.4, t:   45  , c: true,  s: 0, o: true},
        {r: this.circles[8][1],  f: 174,   t: - 45  , c: true,  s: 0, o: true},
      // 左側のくぼみ
        {r: this.circles[8][4],  f: 148.5, t:  190  , c: false, s: 2, o: true},
        {r: this.circles[8][5],  f: 190  , t:  360  , c: false, s: 2, o: true},
        {r: this.circles[8][6],  f: 338.8, t:  370  , c: false, s: 2, o: true},

      ],
    ];

    // ひだ
    this.folds = [
      [
        {a:     10, b: -   22, r: 1512, f: 189.8, t:  240,   c: false},
        {a: - 2155, b: - 1477, r: 1377, f:  59.2, t:   20,   c: true},
        {a: - 1480, b: - 1045, r:  760, f:  89.5, t:   10,   c: true},
      ],
      [
        {a: -  330, b: -  665, r:  510, f:  76.9, t:  145,   c: false},
        {a:     33, b: -  828, r:  750, f: 117.6, t:  160.8, c: false},
        {a:    450, b: -  785, r:  900, f: 137,   t:  188,   c: false},
      ],
      [
        {a: -   90, b:     75, r: 1400, f: 164.3, t:  186,   c: false},
        {a: - 2565, b: -  505, r: 1500, f:  39.2, t:   14,   c: true},
        {a: - 1610, b: -  270, r:  750, f:  76.8, t:   10,   c: true},
      ],
      [
        {a: -  115, b: -  440, r:  850, f:  91,   t:  138,   c: false},
        {a:    515, b: -  580, r: 1200, f: 125.4, t:  152,   c: false},
        {a: - 1020, b:    480, r:  900, f: - 4.2, t: - 35,   c: true},
      ],
      [
        {a: - 1710, b:    290, r:  910, f:  46.8, t:   13,   c: true},
        {a: - 1910, b:    570, r:  900, f:  26.3, t: -  8,   c: true},
        {a: -  435, b:    375, r:  900, f: 138,   t:  165,   c: false},
      ],
      [
        {a: -   70, b:    115, r:  850, f:  92.2, t:  135,   c: false},
        {a:    595, b:     40, r: 1200, f: 130.6, t:  157,   c: false},
        {a: -  995, b:   1030, r:  900, f: - 4,   t: - 32,   c: true},
      ],
      [
        {a: -  510, b:    885, r:  500, f: 106,   t:  152,   c: false},
        {a: -   75, b:    880, r:  750, f: 140,   t:  175,   c: false},
        {a: - 1215, b:   1165, r:  600, f:  18.6, t: - 20,   c: true},
      ],
      [
        {a: -  490, b:   1020, r:   98, f:  115.0, t:   1.7, c: true},
        {a: - 1350, b:   1350, r:  900, f: - 14.6, t:   4,   c: false},
        {a: -   42, b:    603, r:  600, f:  127.4, t:  98,   c: true},
        {a:   1597, b: -  177, r: 2400, f:  147.7, t: 135,   c: true},
      ],
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

  // 円弧のアウトライン座標を生成（circle: {a: 円の中心X,b: 円の中心Y,r: 円の半径}, angle: 弧の角度[0: 始点, 1:終点], clockwise: 時計回りか否かtrue/false）
  curveOutlinePointGen = (circle, angle, clockwise) => {
    const w = 4;
    const arc1 = {a: circle.a, b: circle.b, r: circle.r + w};
    const arc2 = {a: circle.a, b: circle.b, r: circle.r - w};
    const point1 = this.curvePointGen(arc1, [angle[0], angle[1]], clockwise);
    const point2 = this.curvePointGen(arc2, [angle[1], angle[0]], !clockwise);
    const points = point2.concat(point1);
    return points;
  }

  // ガイドラインを作成
  generateGuideline = () => {

    const pointSum = [];

    // 輪郭部分の軌跡座標を生成
    this.circles.forEach((array) => {
      const group = [];
      array.forEach((param) => {
        const points = this.circleLocusGen(param, [90, 450], this.divCount);
        group.push(points);
      })
      pointSum.push(group);
    })

    // ひだ部分の軌跡座標を生成
    this.folds.forEach((array) => {
      const group = [];
      array.forEach((param) => {
        const points = this.circleLocusGen(param, [90, 450], this.divCount);
        group.push(points);
      })
      pointSum.push(group);
    })

    // 座標からメッシュを生成（反転側も生成）
    const mirror = new THREE.Group();
    for (var i = 0;i <= 1;i ++) {
      const mat = i == 0 ? this.guideMat : this.subMat;
      pointSum.forEach((group) => {
        const main = new THREE.Group();
        group.forEach((points) => {
          const geo = new THREE.BufferGeometry().setFromPoints(points);
          const mesh = new THREE.Line(geo, mat);
          mesh.rotation.y = THREE.MathUtils.degToRad(180 * i);
          mesh.position.z = - 1 * i;
          i == 0 ? main.add(mesh) : mirror.add(mesh);
        })
        if (i == 0) this.guidelines.add(main);
      })
    }
    this.guidelines.add(mirror);

    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    // 輪郭部分のメッシュを生成
    for (var i = 0;i <= 1;i ++) {
      this.frames.forEach((group) => {
        group.forEach((param) => {
          if (param.o) {
            const geo = this.curveOutlineGeoGen(param.r, [param.f, param.t], param.c);
            const mesh = new THREE.Mesh(geo, this.outlineMat);
            mesh.rotation.y = THREE.MathUtils.degToRad(180 * i);
            this.outlines.add(mesh);
          }
        })
      })
    }

    // ひだ部分のメッシュを生成
    for (var i = 0;i <= 1;i ++) {
      this.folds.forEach((group) => {
        group.forEach((param) => {
          const geo = this.curveOutlineGeoGen(param, [param.f, param.t], param.c);
          const mesh = new THREE.Mesh(geo, this.outlineMat);
          mesh.rotation.y = THREE.MathUtils.degToRad(180 * i);
          this.outlines.add(mesh);
        })
      })
    }

    this.group.add(this.outlines);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    const w = 4;
    const geos = [];

    for (var i = 0;i <= this.frames.length - 1;i ++) {
      // 輪郭の座標からシェイプを生成
      var shapes = [];
      const frameGroup = this.frames[i];
      frameGroup.forEach((param) => {
        const circle = param.r;
        const side = param.s - 1;
        const circleParam = {a: circle.a, b: circle.b, r: circle.r + w * side};
        const points = this.curvePointGen(circleParam, [param.f, param.t], param.c);
        shapes = shapes.concat(points);
      })
      const shape = new THREE.Shape(shapes);

      // ひだの座標から生成したパスを輪郭のシェイプから除外してジオメトリを生成
      const foldsGroup = this.folds[i];
      foldsGroup.forEach((param) => {
        const points = this.curveOutlinePointGen(param, [param.f, param.t], param.c);
        const path = new THREE.Path(points);
        shape.holes.push(path);
      })
      const geo = new THREE.ShapeGeometry(shape);
      geos.push(geo);
    }

    // ジオメトリからメッシュを生成（反転分も生成）
    for (var i = 0;i <= 1;i ++) {
      geos.forEach((geo) => {
        const mesh = new THREE.Mesh(geo, this.shapeMat);
        mesh.rotation.y = THREE.MathUtils.degToRad(180 * i);
        this.shapes.add(mesh);
      })
    }

    this.group.add(this.shapes);
  }

}
