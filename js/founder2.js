'use strict';

import * as THREE from 'three';

export default class Founder {

  constructor() {

  }

  // 直線の方程式
  straight = (a, b, c, x, y) => {
    if (x == undefined) {
      return new THREE.Vector3((b * y - c) / a, y, 0);
    } else if (y == undefined) {
      return new THREE.Vector3(x, (a * x + c) / b, 0);
    }
  }

  // 円周上の座標を求める式（circle: {a: 中心X, b: 中心Y, r: 半径}, theta:角度）
  circumPoint(circle, theta) {
    const a = circle.a, b = circle.b, r = circle.r;
    const t = THREE.MathUtils.degToRad(theta);
    const x = a + r * Math.cos(t);
    const y = b + r * Math.sin(t);
    return new THREE.Vector3(x, y, 0);
  }

  // 円周上の座標の角度を求める式（circle: {a: 中心X, b: 中心Y, r: 半径}, v: {x: 円周上座標X, y: 円周上座標Y}）
  circumAngle(circle, v) {
    const a = circle.a, b = circle.b, x = v.x, y = v.y;
    return THREE.MathUtils.radToDeg(Math.atan2(y - b, x - a));
  }

  // 直線と円の交点を求める（r: 半径, h: 中心X座標, k: 中心Y座標, m: 直線式の傾き, n: 直線式の切片）
  interLineCircle0 = (r, h, k, m, n) => {
    var a = 1 + Math.pow(m, 2);
    var b = -2 * h + 2 * m * (n - k);
    var c = Math.pow(h, 2) + Math.pow((n - k), 2) - Math.pow(r, 2);
    var D = Math.pow(b, 2) - 4 * a * c;

    var kouten = [];
    if (D >= 0) {
      var x1 = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
      var x2 = (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
      if (D == 0) {
        kouten.push(new THREE.Vector3(x1, m * x1 + n, 0));
      } else {
        kouten.push(new THREE.Vector3(x1, m * x1 + n, 0));
        kouten.push(new THREE.Vector3(x2, m * x2 + n, 0));
      }
    }
    return kouten;
  }


  // 直線と円の交点を求める（circle: {a: 中心X ,b: 中心Y,r: 半径}, va: 直線を表す２点の座標[{x, y}, {x, y}]）
  interLineCircle = (circle, va) => {
    const cx = circle.a;
    const cy = circle.b;
    const cr = circle.r;
    const x1 = va[0].x;
    const y1 = va[0].y;
    const x2 = va[1].x;
    const y2 = va[1].y;

    const a = y2 - y1;
    const b = x2 - x1;
    const c = - (a * x1 + b * y1);

    const l = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    const ex = (x2 - x1) / l;
    const ey = (y2 - y1) / l;

    const vx = - ey;
    const vy = ex;

    const k = - (a * cx + b * cy + c) / (a * vx + b * vy);

    const px = cx + k * vx;
    const py = cy + k * vy;

    if (cr < k) {
      return false;
    } else {
      const s = Math.sqrt(cr * cr - k * k);
      const v1 = new THREE.Vector3(px + s * ex, py + s * ey, 0);
      const v2 = new THREE.Vector3(px - s * ex, py - s * ey, 0);
      return [v1, v2];
    }
  }

  // ２点の座標から直線の方程式の係数（a,b,c）を取得（v1,v2: ２点の座標）
  from2Points = (v1, v2) => {
    const x1 = v1.x, y1 = v1.y;
    const x2 = v2.x, y2 = v2.y;
    var a, b, c;
    if (y1 == y2) {
      a = 0, b = 1, c = y1;
    } else if (x1 == x2) {
      a = 1, b = 0, c = x1;
    } else {
      a = (y2 - y1) / (x2 - x1);
      b = 1;
      c = (x2 * y1 - x1 * y2) / (x2 - x1);
    }
    return {a: a, b: b, c: c};
  }

  // ２直線の交点を求める式（va1,2: [0: 直線の始点座標, 1: 直線の終点座標]）
  getIntersect(va1, va2) {
    const form1 = this.from2Points(va1[0], va1[1]);
    const form2 = this.from2Points(va2[0], va2[1]);
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

  // 座標の回転後の座標を求める(vertex: 座標、theta: 回転角度)
  rotateCoordinate = (vertex, theta) => {
    const t = THREE.MathUtils.degToRad(theta);
    const x = vertex.x;
    const y = vertex.y;
    const xd = x * Math.cos(t) - y * Math.sin(t);
    const yd = x * Math.sin(t) - y * Math.cos(t);
    return new THREE.Vector3(xd, yd, 0);
  }

  // 直線の描画座標を生成
  linePointGen = (a, b, r, f, t, d) => {
    const points = [];
    for (var i = 0;i <= d - 1;i ++) {
      const p = THREE.MathUtils.damp(f, t, 10, i / (d - 1));
      var point;
      if (b == 0) {
        point = this.straight(a, b, r, undefined, p);
      } else {
        point = this.straight(a, b, r, p, undefined);
      }
      points.push(point);
    }
    return points;
  }

  // 円弧の描画座標を生成
  circlePointGen = (a, b, r, f, t, d) => {
    const points = [];
    for (var i = 0;i <= d - 1;i ++) {
      const p = THREE.MathUtils.damp(f, t, 10, i / (d - 1));
      const point = this.circumPoint({a: a, b: b, r: r}, p);
      points.push(point);
    }
    return points;
  }

  // 円弧の図形用座標を生成
  curvePointGen = (a, b, r, f, t, c) => {
    const curve = new THREE.EllipseCurve(
      a, b,
      r, r,
      THREE.MathUtils.degToRad(f), THREE.MathUtils.degToRad(t),
      c, 0
    );
    return curve.getPoints(100);
  }

}
