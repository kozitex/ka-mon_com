'use strict';

import * as THREE from 'three';

export default class Grid {

  constructor (color = 0x333333, thinColor = 0x1a1a1a) {

    // フレームサイズ
    this.size = 1600;

    this.z = 0;

    // グリッド間隔
    this.interval = 100;

    // 色
    this.color     = color;
    this.thinColor = thinColor;
    // this.gridColor     = 0x333333;
    // this.gridThinColor = 0x1a1a1a;

    // メッシュグループ
    this.group = new THREE.Group();
  }

  // フレームの作成
  createFrame = (size = this.size) => {
    const points = [];
    points.push(new THREE.Vector3(-size,  size, this.z));
    points.push(new THREE.Vector3( size,  size, this.z));
    points.push(new THREE.Vector3( size, -size, this.z));
    points.push(new THREE.Vector3(-size, -size, this.z));
    points.push(new THREE.Vector3(-size,  size, this.z));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: this.color,
      side: THREE.DoubleSide,
      transparent: true
    });
    const line = new THREE.Line(geometry, material);
    this.group.add(line);
  }

  // センターラインの作成
  createCenterLine = (size = this.size) => {
    const points = [];
    points.push(new THREE.Vector3(    0,  size, this.z));
    points.push(new THREE.Vector3(    0, -size, this.z));
    points.push(new THREE.Vector3(    0,     0, this.z));
    points.push(new THREE.Vector3( size,     0, this.z));
    points.push(new THREE.Vector3(-size,     0, this.z));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: this.color,
      side: THREE.DoubleSide,
      transparent: true
    });
    const line = new THREE.Line(geometry, material);
    this.group.add(line);
  }

  // グリッドの作成
  createGrid = (size = this.size, interval = this.interval) => {
    for (var i = 0;i <= 1;i ++) {
      var axis = -size;
      const num = (size / interval * 2) - 2;
      for (var j = 0;j <= num;j ++) {
        axis += interval;
        if (axis == 0) continue;
        const points = [];
        if (i == 0) {
          points.push( new THREE.Vector3( axis,  size, this.z));
          points.push( new THREE.Vector3( axis, -size, this.z));
        } else {
          points.push( new THREE.Vector3( size,  axis, this.z));
          points.push( new THREE.Vector3(-size,  axis, this.z));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: this.thinColor,
          side: THREE.DoubleSide,
          transparent: true
        });
        const line = new THREE.Line(geometry, material);
        this.group.add(line);
      }
    }
  }

  // 要素をグループ化して出力
  generate = (size, interval) => {
    this.createFrame(size);
    this.createCenterLine(size);
    this.createGrid(size, interval);
    return this.group;
  }

  // フェードアウト
  fadeOut = (sec, delay, duration) => {
    this.group.children.forEach((child) => {
      child.material.opacity = THREE.MathUtils.damp(1.0, 0.0, 2, (sec - delay) / duration);
      if (sec > delay + 1000) {
        child.visible = false;
      } else {
        child.visible = true;
      }
    });
  }

}
