(function () {
  'use strict';

  var header = document.getElementById('header');
  var menuToggle = document.getElementById('menuToggle');
  var sideMenu = document.getElementById('sideMenu');
  var sideMenuClose = document.getElementById('sideMenuClose');
  var sideMenuOverlay = document.getElementById('sideMenuOverlay');
  var body = document.body;
  var navLinks = document.querySelectorAll('.nav-link');
  var sideMenuLinks = document.querySelectorAll('.side-menu-link');
  var sections = document.querySelectorAll('section[id]');
  var faqItems = document.querySelectorAll('.faq-item');
  var revealElements = document.querySelectorAll('[class*="reveal-"]');
  var statNumbers = document.querySelectorAll('.stat-number');
  var statCards = document.querySelectorAll('.stat-card');
  var statsAnimated = false;

  function toggleSideMenu(open) {
    if (open) {
      sideMenu.classList.add('active');
      sideMenuOverlay.classList.add('active');
      menuToggle.classList.add('active');
      body.classList.add('no-scroll');
    } else {
      sideMenu.classList.remove('active');
      sideMenuOverlay.classList.remove('active');
      menuToggle.classList.remove('active');
      body.classList.remove('no-scroll');
    }
  }

  menuToggle.addEventListener('click', function () {
    var isOpen = sideMenu.classList.contains('active');
    toggleSideMenu(!isOpen);
  });

  sideMenuClose.addEventListener('click', function () {
    toggleSideMenu(false);
  });

  sideMenuOverlay.addEventListener('click', function () {
    toggleSideMenu(false);
  });

  sideMenuLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      toggleSideMenu(false);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      toggleSideMenu(false);
    }
  });

  var lastScroll = 0;
  window.addEventListener('scroll', function () {
    var scroll = window.pageYOffset || document.documentElement.scrollTop;

    if (scroll > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    var currentSection = '';
    sections.forEach(function (section) {
      var top = section.offsetTop - 120;
      var height = section.offsetHeight;
      if (scroll >= top && scroll < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    if (currentSection) {
      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
          link.classList.add('active');
        }
      });
      sideMenuLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
          link.classList.add('active');
        }
      });
    }

    if (statCards.length > 0 && !statsAnimated) {
      var statsTop = statCards[0].getBoundingClientRect().top;
      if (statsTop < window.innerHeight - 100) {
        statsAnimated = true;
        animateStats();
      }
    }

    lastScroll = scroll;
  });

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    question.addEventListener('click', function () {
      var isActive = item.classList.contains('active');
      faqItems.forEach(function (other) {
        other.classList.remove('active');
      });
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  function animateStats() {
    statNumbers.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var duration = 2000;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        el.textContent = current.toLocaleString('en-US');
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString('en-US');
        }
      }
      requestAnimationFrame(step);
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      }
    });
  });

  function handleEmptyImages() {
    var aboutImg = document.querySelector('.about-image');
    if (aboutImg) {
      var placeholder = aboutImg.parentElement.querySelector('.about-image-placeholder');
      if (aboutImg.getAttribute('src') === '' || !aboutImg.getAttribute('src')) {
        if (placeholder) placeholder.style.display = 'flex';
        aboutImg.style.display = 'none';
      } else {
        if (placeholder) placeholder.style.display = 'none';
        aboutImg.style.display = 'block';
      }
    }

    document.querySelectorAll('.gallery-img').forEach(function (img) {
      var placeholder = img.parentElement.querySelector('.gallery-placeholder');
      if (img.getAttribute('src') === '' || !img.getAttribute('src')) {
        if (placeholder) placeholder.style.display = 'flex';
        img.style.display = 'none';
      } else {
        if (placeholder) placeholder.style.display = 'none';
        img.style.display = 'block';
      }
    });

    document.querySelectorAll('.blog-image').forEach(function (img) {
      var placeholder = img.parentElement.querySelector('.blog-image-placeholder');
      if (img.getAttribute('src') === '' || !img.getAttribute('src')) {
        if (placeholder) placeholder.style.display = 'flex';
        img.style.display = 'none';
      } else {
        if (placeholder) placeholder.style.display = 'none';
        img.style.display = 'block';
      }
    });
  }

  handleEmptyImages();

  window.addEventListener('load', function () {
    handleEmptyImages();
  });
})();
