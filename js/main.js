'use strict';
import Kageigeta from './crests/kageigeta.js';

window.addEventListener('DOMContentLoaded', () => {
  init();
});

const init = () => {

  const kageigeta = new Kageigeta();

  // テーマカラーを適用
  const changeTheme = (theme) => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    kageigeta.onChangeTheme(theme);
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
  kageigeta.scrolled(window.scrollY);

  window.addEventListener('scroll', () => {
    // スクロール量をキャンバスに渡す
    kageigeta.scrolled(window.scrollY);

    // ガイドを非表示
    if (window.scrollY > 0) {
      guide.classList.add('hide');
    }

    if (window.scrollY == 0 || window.scrollY == terminus) {
      forward.classList.remove('active');
      backward.classList.remove('active');
    }
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
  const easingFunction = (t) => (
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  );

  // アニメーションスクロール関数の定義
  const autoScroll = (target, duration = 10000) => {
    const initialPosition = window.scrollY;
    const targetPosition = target;
    const animationStart = performance.now();

    const performAnimation = (currentTime) => {
      const elapsedTime = currentTime - animationStart;
      const progress = elapsedTime / duration;

      if (progress < 1) {
        const easedProgress = easingFunction(progress);
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
  const terminus = scroller.scrollHeight - window.innerHeight;

  const forward = document.getElementById('forward');
  forward.addEventListener('click', () => {
    if (window.scrollY < terminus) {
      forward.classList.add('active');
      autoScroll(terminus);
      kageigeta.logRecord('- Animation has started playing.');
    }
  });

  const backward = document.getElementById('backward');
  backward.addEventListener('click', () => {
    if (window.scrollY > 0) {
      backward.classList.add('active');
      autoScroll(0);
      kageigeta.logRecord('- Started playing the animation in reverse.');
    }
  });

}