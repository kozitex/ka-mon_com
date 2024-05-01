'use strict';
import Kageigeta from './crests/kageigeta.js';

window.addEventListener('DOMContentLoaded', () => {
  init();
});

const init = () => {
  const kageigeta = new Kageigeta();

  const themes = document.getElementsByName('theme');
  themes.forEach((theme) => {
    theme.addEventListener('change', () => {
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(theme.value);
      kageigeta.onChangeTheme(theme.value);
    })
  })
}