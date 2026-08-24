$(document).ready(function () {

  /* =================================================================
     PARTICLE SYSTEM
     ================================================================= */
  var canvas = document.getElementById('particle-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouse = { x: null, y: null };

    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    function initParticles() {
      particles = [];
      var count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 120);
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
          o: Math.random() * 0.4 + 0.1
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 255, ' + p.o + ')';
        ctx.fill();
      }

      // Connect nearby particles
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(0, 212, 255, ' + (0.1 * (1 - dist / 100)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Mouse interaction — draw lines to cursor
      if (mouse.x !== null) {
        for (var k = 0; k < particles.length; k++) {
          var dx2 = particles[k].x - mouse.x;
          var dy2 = particles[k].y - mouse.y;
          var dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (dist2 < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[k].x, particles[k].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = 'rgba(0, 212, 255, ' + (0.18 * (1 - dist2 / 150)) + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawParticles);
    }

    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', function () {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();
    initParticles();
    drawParticles();

    window.addEventListener('resize', function () {
      resizeCanvas();
      initParticles();
    });
  }


  /* =================================================================
     TYPING EFFECT
     ================================================================= */
  var typingEl = document.getElementById('typing-text');
  if (typingEl) {
    var words = ['Data Scientist', 'Full Stack Developer', 'AI Researcher', 'Problem Solver'];
    var wordIdx = 0;
    var charIdx = 0;
    var deleting = false;

    function typeLoop() {
      var word = words[wordIdx % words.length];

      if (deleting) {
        charIdx--;
        typingEl.textContent = word.substring(0, charIdx);
      } else {
        charIdx++;
        typingEl.textContent = word.substring(0, charIdx);
      }

      var speed = deleting ? 35 : 70;

      if (!deleting && charIdx === word.length) {
        speed = 2000;
        deleting = true;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        wordIdx++;
        speed = 400;
      }

      setTimeout(typeLoop, speed);
    }

    setTimeout(typeLoop, 1200);
  }


  /* =================================================================
     NAVBAR — scroll background & active link
     ================================================================= */
  $(window).on('scroll', function () {
    var st = $(this).scrollTop();

    // Add/remove scrolled class
    if (st > 60) {
      $('#navbar').addClass('scrolled');
    } else {
      $('#navbar').removeClass('scrolled');
    }

    // Highlight active nav link
    var scrollPos = st + 120;
    $('section, header').each(function () {
      var top = $(this).offset().top;
      var bottom = top + $(this).outerHeight();
      var id = $(this).attr('id');
      if (id && scrollPos >= top && scrollPos < bottom) {
        $('.nav-links a').removeClass('active');
        $('.nav-links a[href="#' + id + '"]').addClass('active');
      }
    });
  });


  /* =================================================================
     MOBILE NAV TOGGLE
     ================================================================= */
  $('#nav-toggle-btn').on('click', function () {
    $(this).toggleClass('active');
    $('#nav-links').toggleClass('open');
  });

  // Close nav when a link is clicked
  $('.nav-links a').on('click', function () {
    $('#nav-toggle-btn').removeClass('active');
    $('#nav-links').removeClass('open');
  });


  /* =================================================================
     SMOOTH SCROLL
     ================================================================= */
  $('a[href*="#"]:not([href="#"])').on('click', function (e) {
    if (
      location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') &&
      location.hostname === this.hostname
    ) {
      var target = $(this.hash);
      if (target.length) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: target.offset().top - 70 }, 800);
      }
    }
  });


  /* =================================================================
     SCROLL REVEAL (IntersectionObserver)
     ================================================================= */
  var revealEls = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    revealEls.forEach(function (el) {
      el.classList.add('revealed');
    });
  }


  /* =================================================================
     COUNTER ANIMATION
     ================================================================= */
  var counted = false;

  function animateCounters() {
    if (counted) return;
    var $stats = $('.stats-row');
    if (!$stats.length) return;

    var top = $stats.offset().top;
    var bottom = top + $stats.outerHeight();
    var viewTop = $(window).scrollTop();
    var viewBottom = viewTop + $(window).height();

    if (top < viewBottom && bottom > viewTop) {
      counted = true;
      $('.counter').each(function () {
        var $el = $(this);
        var target = parseFloat($el.data('target'));
        var isDecimal = target % 1 !== 0;
        var duration = 1600;
        var startTime = null;

        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          var val = target * eased;
          $el.text(isDecimal ? val.toFixed(1) : Math.floor(val));
          if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
      });
    }
  }

  $(window).on('scroll', animateCounters);
  animateCounters();

  /* =================================================================
     THEME TOGGLE
     ================================================================= */
  var themeBtn = document.getElementById('theme-toggle');
  var themeIcon = document.getElementById('theme-icon');
  var savedTheme = localStorage.getItem('portfolio-theme');

  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeIcon.className = 'fa fa-sun-o';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      document.body.classList.toggle('light-mode');
      var isLight = document.body.classList.contains('light-mode');
      themeIcon.className = isLight ? 'fa fa-sun-o' : 'fa fa-moon-o';
      localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    });
  }
});
