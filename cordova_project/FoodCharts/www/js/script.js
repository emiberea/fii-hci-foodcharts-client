(function(){
  var asideMenu = document.querySelector('.aside-menu'),
      mainContainer = document.querySelector('.main-container'),
      menuTrigger = document.querySelector('.menu-trigger');

  menuTrigger.addEventListener('click', function() {
    asideMenu.classList.toggle('menu-hidden');
  });

})();
