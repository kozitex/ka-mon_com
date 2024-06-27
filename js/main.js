'use strict';
import Canvas from './canvas.js';

window.addEventListener('DOMContentLoaded', () => {
  init();
});

const init = () => {

  let resizeTimeout = 0;
  let promptTimeout = 0;
  let nowPlaying = false;

  document.body.classList.remove('loading');

  const roll = document.getElementById('roll');
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const backBtn = document.getElementById('backBtn');
  const forwardBtn = document.getElementById('forwardBtn');
  var terminus;
  var myTheme = localStorage.getItem('theme');

  const canvas = new Canvas();
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 30);

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
        if (nowPlaying) requestAnimationFrame(performAnimation);
      } else {
        window.scrollTo(0, targetPosition);
      }
    };
    requestAnimationFrame(performAnimation);
  };

  // テーマカラーを適用
  const changeTheme = (theme) => {
    myTheme = theme;
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    canvas.changeTheme(theme);
    localStorage.setItem('theme', theme);
  }

  // クリック音を再生
  const soundPlay = () => {
    const sound = document.getElementById('sound');
    sound.currentTime = 0;
    sound.play();
  }

  // アニメーションを再生
  const play = () => {
    if (window.scrollY < terminus) {
      const scrollDur = canvas.scrollDur;
      nowPlaying = true;
      playBtn.classList.add('running');
      pauseBtn.classList.remove('disabled');
      forwardBtn.classList.add('disabled');
      backBtn.classList.add('disabled');
      autoScroll(terminus, scrollDur);
    }
    document.body.classList.remove('loading');
  }

  // アニメーションを一時停止
  const pause = () => {
    nowPlaying = false;
    playBtn.classList.remove('running');
    pauseBtn.classList.add('disabled');
    forwardBtn.classList.remove('disabled');
    backBtn.classList.remove('disabled');
  }

  // アニメーションを先頭まで戻す
  const back = () => {
    if (window.scrollY == 0) {
      canvas.draw('back');
      window.scrollTo(0, terminus);
    } else {
      window.scrollTo(0, 0);
      canvas.scrolled(window.scrollY);
    }
  }

  // アニメーションを先頭まで戻す
  const forward = () => {
    if (window.scrollY == terminus) {
      canvas.draw('forward');
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, terminus);
      canvas.scrolled(window.scrollY);
    }
  }

  terminus = roll.scrollHeight - window.innerHeight;
  play();

  // 読み込み後に動きがなければガイドを表示
  const prompt = document.getElementById('prompt');
  promptTimeout = setTimeout(() => {
    if (window.scrollY <= 0) {
      prompt.classList.remove('hide');
    }
  }, 10000);

  // スクロール量をキャンバスに渡す
  canvas.scrolled(window.scrollY);

  // 画面スクロール時の処理
  window.addEventListener('scroll', async () => {

    // ガイド表示タイマーをクリア・リセット
    if (promptTimeout) clearTimeout(promptTimeout);
    promptTimeout = setTimeout(() => {
      if (window.scrollY <= 0) {
        prompt.classList.remove('hide');
      }
    }, 10000);
  
    // スクロール量をキャンバスに渡す
    canvas.scrolled(window.scrollY);

    // ガイドを非表示
    if (window.scrollY > 0) prompt.classList.add('hide');

    // 画面の端に着いたらオートプレイボタンを初期化
    if (window.scrollY == 0) {
      if (!nowPlaying) {
        playBtn.classList.remove('disabled', 'running');
      }
    } else if (window.scrollY > 0 && window.scrollY < terminus) {
      playBtn.classList.remove('disabled');
      if (!nowPlaying) {
        forwardBtn.classList.remove('disabled');
        backBtn.classList.remove('disabled');
      }
    } else if (window.scrollY == terminus) {
      playBtn.classList.remove('running');
      pauseBtn.classList.add('disabled');
      forwardBtn.classList.remove('disabled');
      backBtn.classList.remove('disabled');
      if (nowPlaying) {
        document.body.classList.add('loading');
        setTimeout(() => {
          canvas.draw('forward');
          window.scrollTo(0, 0);
          play();
        }, 1);
      }
    }
  });

  // 画面リサイズ時の処理
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(canvas.windowResize, 200);
    terminus = roll.scrollHeight - window.innerHeight;
  });

  // テーマ名が保存されていたら適用
  if (myTheme) {
    changeTheme(myTheme);
    const target = document.getElementById(myTheme);
    target.checked = true;
  }

  // ラジオボタンクリックでテーマ変更
  const themeChangers = document.getElementsByName('themeChanger');
  themeChangers.forEach((themeChanger) => {
    themeChanger.addEventListener('change', () => {
      soundPlay();
      changeTheme(themeChanger.value);
    });
  })

  playBtn.addEventListener('click', () => {
    soundPlay();
    play();
  });

  pauseBtn.addEventListener('click', () => {
    soundPlay();
    pause();
  });

  backBtn.addEventListener('click', () => {
    soundPlay();
    back();
  });

  forwardBtn.addEventListener('click', () => {
    soundPlay();
    forward();
  });
}
