'use strict';
import Kageigeta from './kamon/kageigeta.js';
import HidariFutatsuDomoe from './kamon/hidari-futatsu-domoe.js';
import Kikyou from './kamon/kikyou.js';
import GenjiGuruma from './kamon/genji-guruma.js';

window.addEventListener('DOMContentLoaded', () => {
  init();
});

const init = () => {
  let resizeTimeout = 0;
  let promptTimeout = 0;
  let autoScrolling = false;

  // const kamon = new Kageigeta();
  // const kamon = new HidariFutatsuDomoe();
  // const kamon = new Kikyou();
  const kamon = new GenjiGuruma();

  // テーマカラーを適用
  const changeTheme = (theme) => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    kamon.changeTheme(theme);
    localStorage.setItem('theme', theme);
  }

  // 読み込み後に動きがなければガイドを表示
  const prompt = document.getElementById('prompt');
  promptTimeout = setTimeout(() => {
    if (window.scrollY <= 0) {
      prompt.classList.remove('hide');
    }
  }, 10000);

  // スクロール量をキャンバスに渡す
  kamon.scrolled(window.scrollY);

  // 画面スクロール時の処理
  window.addEventListener('scroll', () => {
    // ガイド表示タイマーをクリア・リセット
    if (promptTimeout) clearTimeout(promptTimeout);
    promptTimeout = setTimeout(() => {
      if (window.scrollY <= 0) {
        prompt.classList.remove('hide');
      }
    }, 10000);
  
    // スクロール量をキャンバスに渡す
    kamon.scrolled(window.scrollY);

    // ガイドを非表示
    if (window.scrollY > 0) {
      prompt.classList.add('hide');
    }

    // 画面の端に着いたらオートプレイボタンを初期化
    if (window.scrollY == 0) {
      autoScrolling = false;
      forward.classList.remove('disabled');
      backward.classList.add('disabled');
      backward.classList.remove('running');
    } else if (window.scrollY == terminus) {
      autoScrolling = false;
      backward.classList.remove('disabled');
      forward.classList.add('disabled');
      forward.classList.remove('running');
    } else if (!autoScrolling) {
      forward.classList.remove('disabled');
      backward.classList.remove('disabled');
    }

  });

  // 画面リサイズ時の処理
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(kamon.windowResize, 200);
    terminus = roll.scrollHeight - window.innerHeight;
  });

  // テーマ名が保存されていたら適用
  const myTheme = localStorage.getItem('theme');
  if (myTheme) {
    changeTheme(myTheme);
    const target = document.getElementById(myTheme);
    target.checked = true;
  }

  // ラジオボタンクリックでテーマ変更
  const themeChangers = document.getElementsByName('themeChanger');
  themeChangers.forEach((themeChanger) => {
    themeChanger.addEventListener('change', () => changeTheme(themeChanger.value));
  })

  // アニメーションスクロール関数の定義
  const autoScroll = (target, duration = 10000) => {
    const initialPosition = window.scrollY;
    const targetPosition = target;
    const animationStart = performance.now();
    const adjustDur = Math.abs(initialPosition - targetPosition) / terminus * duration;

    const performAnimation = (currentTime) => {
      const elapsedTime = currentTime - animationStart;
      const progress = elapsedTime / adjustDur;

      if (progress < 1) {
        const easedProgress = progress;
        const currentPosition = initialPosition +
          ((targetPosition - initialPosition) * easedProgress);
        window.scrollTo(0, currentPosition);
        requestAnimationFrame(performAnimation);
      } else {
        window.scrollTo(0, targetPosition);
      }
    };
    requestAnimationFrame(performAnimation);
  };

  // forward、backwardボタンの制御
  const roll = document.getElementById('roll');
  var terminus = roll.scrollHeight - window.innerHeight;
  const scrollDur = kamon.scrollDur;

  const forward = document.getElementById('forward');
  forward.addEventListener('click', () => {
    if (window.scrollY < terminus) {
      autoScrolling = true;
      forward.classList.add('running');
      backward.classList.add('disabled');
      autoScroll(terminus, scrollDur);
    }
  });

  const backward = document.getElementById('backward');
  backward.addEventListener('click', () => {
    if (window.scrollY > 0) {
      autoScrolling = true;
      forward.classList.add('disabled');
      backward.classList.add('running');
      autoScroll(0, scrollDur);
    }
  });

}