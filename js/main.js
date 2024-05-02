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

  // スクロール量をキャンバスに渡す
  kageigeta.scrolled(window.scrollY);
  window.addEventListener('scroll', () => kageigeta.scrolled(window.scrollY));

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

}