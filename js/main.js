'use strict';
import Kageigeta from './crests/kageigeta.js';
import HidariFutatsuDomoe from './crests/hidari-futatsu-domoe.js';

window.addEventListener('DOMContentLoaded', () => {
  init();
});

const init = () => {
  let timeoutId = 0;

  // const kamon = new Kageigeta();
  const kamon = new HidariFutatsuDomoe();

  // テーマカラーを適用
  const changeTheme = (theme) => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    kamon.changeTheme(theme);
    localStorage.setItem('theme', theme);
  }

  // 読み込み後に動きがなければガイドを表示
  const guide = document.getElementById('guide');
  setTimeout(() => {
    if (window.scrollY <= 0) {
      guide.classList.remove('hide');
    }
  }, 10000);

  // スクロール量をキャンバスに渡す
  kamon.scrolled(window.scrollY);

  // 画面スクロール時の処理
  window.addEventListener('scroll', () => {
    // スクロール量をキャンバスに渡す
    kamon.scrolled(window.scrollY);

    // ガイドを非表示
    if (window.scrollY > 0) {
      guide.classList.add('hide');
    }

    if (window.scrollY == 0 || window.scrollY == terminus) {
      forward.classList.remove('active');
      backward.classList.remove('active');
    }
  });

  // 画面リサイズ時の処理
  window.addEventListener('resize', () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(kamon.windowResize, 200);
    terminus = scroller.scrollHeight - window.innerHeight;
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

  // イージング関数を定義
  // const easingFunction = (t) => (
  //   t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  // );

  // アニメーションスクロール関数の定義
  const autoScroll = (target, duration = 10000) => {
    const initialPosition = window.scrollY;
    const targetPosition = target;
    const animationStart = performance.now();
    const adjustDur = Math.abs(initialPosition - targetPosition) / terminus * duration;
    // console.log(initialPosition, targetPosition, terminus, adjustDur);

    const performAnimation = (currentTime) => {
      const elapsedTime = currentTime - animationStart;
      const progress = elapsedTime / adjustDur;

      if (progress < 1) {
        // const easedProgress = easingFunction(progress);
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
  const scroller = document.getElementById('scroller');
  var terminus = scroller.scrollHeight - window.innerHeight;

  const forward = document.getElementById('forward');
  forward.addEventListener('click', () => {
    if (window.scrollY < terminus) {
      forward.classList.add('active');
      autoScroll(terminus, 7000);
      kamon.logRecord('- the animation has started playing.');
    }
  });

  const backward = document.getElementById('backward');
  backward.addEventListener('click', () => {
    if (window.scrollY > 0) {
      backward.classList.add('active');
      autoScroll(0, 7000);
      kamon.logRecord('- started playing the animation in reverse.');
    }
  });

}