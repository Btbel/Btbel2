var adTimer = null;

function initPage() {
  // плавное затухание при переходе между страницами из интернета (проявляет страницу при загрузке)
  document.body.style.opacity = "1";

  var title = document.getElementById("welcome-title");
  var video = document.getElementById("bg-video");

  if (title) {
    // из интернета, (делает заголовок прозрачным и опускает его чуть вниз перед началом анимации)
    title.style.opacity = "0";
    title.style.transform = "translateY(25px)";
    title.style.transition = "opacity 1.5s ease, transform 1.5s ease";

    // из интернета, (через долю секунды плавно проявляет заголовок и поднимает его на место)
    setTimeout(function() {
      title.style.opacity = "1";
      title.style.transform = "translateY(0px)";
    }, 150);
  }

  if (video) {
    // из интернета, (следит за видео и принудительно запускает его с самого начала ровно в момент окончания, чтобы не было паузы между циклами)
    video.addEventListener("ended", function() {
      video.currentTime = 0;
      video.play();
    });
  }

  // плавное затухание при переходе между страницами из интернета (перехватывает клик по ссылке, затемняет экран и переходит)
  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function(e) {
      var href = this.getAttribute("href");
      if (href && href.indexOf("tel:") !== 0 && href.charAt(0) !== "#") {
        e.preventDefault();
        document.body.style.opacity = "0";
        setTimeout(function() {
          window.location.href = href;
        }, 380);
      }
    });
  }

  // из интернета, (единая память браузера sessionStorage, чтобы реклама запоминала шаг и время между переходами по вкладкам)
  syncAdSystem();
}

function syncAdSystem() {
  var savedStep = sessionStorage.getItem("btbel_ad_step");
  var step = savedStep !== null ? parseInt(savedStep) : 0;
  var status = sessionStorage.getItem("btbel_ad_status");
  var nextTime = sessionStorage.getItem("btbel_ad_next_time");
  var now = Date.now();

  if (status === "finished") {
    return;
  }

  if (status === "open") {
    showAd(step);
    return;
  }

  if (nextTime === null) {
    var firstShow = now + 5000;
    sessionStorage.setItem("btbel_ad_step", "0");
    sessionStorage.setItem("btbel_ad_status", "waiting");
    sessionStorage.setItem("btbel_ad_next_time", firstShow.toString());
    adTimer = setTimeout(function() { showAd(0); }, 5000);
  } else {
    var delay = parseInt(nextTime) - now;
    if (delay <= 0) {
      showAd(step);
    } else {
      adTimer = setTimeout(function() { showAd(step); }, delay);
    }
  }
}

// из интернета, (ловит момент, когда курсор уводят вверх за пределы сайта на закрытие вкладки, и выкидывает финальное окно)
document.addEventListener("mouseleave", function(e) {
  if (e.clientY <= 0 && sessionStorage.getItem("btbel_exit_shown") !== "true") {
    sessionStorage.setItem("btbel_exit_shown", "true");
    clearTimeout(adTimer);
    showAd(4);
  }
});

function showAd(step) {
  sessionStorage.setItem("btbel_ad_step", step.toString());
  sessionStorage.setItem("btbel_ad_status", "open");

  var bg = document.getElementById("ad-modal-bg");
  var badge = document.getElementById("ad-badge");
  var title = document.getElementById("ad-title");
  var media = document.getElementById("ad-media");
  var mileage = document.getElementById("ad-mileage");
  var price = document.getElementById("ad-price");

  if (!bg) return;

  if (step === 0) {
    badge.innerHTML = "ГОРЯЧЕЕ ПРЕДЛОЖЕНИЕ";
    title.innerHTML = "Купите УАЗ Фермер, 2013 г.";
    media.innerHTML = '<img src="uaz1.jpg" alt="УАЗ Фермер">';
    mileage.innerHTML = "Пробег: 741 324 км";
    price.innerHTML = "Цена: 500 000 р.";
  } else if (step === 1) {
    badge.innerHTML = "СКИДКА И ОБКАТКА!";
    title.innerHTML = "УАЗ Фермер, 2013 г. — свежее предложение";
    media.innerHTML = '<img src="uaz2.jpg" alt="УАЗ Фермер">';
    mileage.innerHTML = 'Пробег: <span class="strike">741 324 км</span> <strong>310 200 км</strong>';
    price.innerHTML = "Цена: 500 000 р.";
  } else if (step === 2) {
    badge.innerHTML = "ТОЛЬКО ДЛЯ ВАС!";
    title.innerHTML = "Спеццена на УАЗ Фермер, 2013 г.";
    media.innerHTML = '<img src="uaz2.jpg" alt="УАЗ Фермер">';
    mileage.innerHTML = 'Пробег: <span class="strike">741 324 км</span> <strong>310 200 км</strong>';
    price.innerHTML = 'Цена: <span class="strike">500 000 р.</span> <strong>400 000 р.</strong>';
  } else if (step === 3) {
    badge.innerHTML = "ФИНАЛЬНЫЙ ОБВАЛ ЦЕН!";
    title.innerHTML = "УАЗ Фермер, 2013 г. — на ходу!";
    media.innerHTML = '<video autoplay loop muted playsinline><source src="uaz3.webm" type="video/webm"></video>';
    mileage.innerHTML = "Пробег: 310 200 км (почти не ездил)";
    price.innerHTML = 'Цена: <span class="strike">400 000 р.</span> <strong>100 000 р.</strong>';
  } else {
    badge.innerHTML = "КРИК ДУШИ";
    title.innerHTML = "УАЗ Фермер, 2013 г.";
    media.innerHTML = '<img src="uaz4.jpg" alt="УАЗ Фермер">';
    mileage.innerHTML = "Пробег: 310 200 км (честное слово)";
    price.innerHTML = '<span class="red-despair">Заберите его, пожалуйста!</span>';
  }

  bg.style.display = "block";
}

function closeAd() {
  var bg = document.getElementById("ad-modal-bg");
  bg.style.display = "none";
  document.getElementById("ad-media").innerHTML = "";

  var currentStep = parseInt(sessionStorage.getItem("btbel_ad_step") || "0");
  var nextStep = currentStep + 1;

  if (nextStep <= 4) {
    var waitMs = (currentStep === 0) ? 7000 : 5000;
    var nextTimestamp = Date.now() + waitMs;
    sessionStorage.setItem("btbel_ad_step", nextStep.toString());
    sessionStorage.setItem("btbel_ad_status", "waiting");
    sessionStorage.setItem("btbel_ad_next_time", nextTimestamp.toString());
    adTimer = setTimeout(function() { showAd(nextStep); }, waitMs);
  } else {
    sessionStorage.setItem("btbel_ad_status", "finished");
  }
}

function calcCredit() {
  var price = parseFloat(document.getElementById("car-price").value);
  var months = parseInt(document.getElementById("months").value);
  var res = document.getElementById("credit-result");
  if (!price || price <= 0) {
    res.innerHTML = "Введите нормальную цену автомобиля.";
    return false;
  }
  var monthly = Math.round((price * 1.35) / months);
  res.innerHTML = "Примерный платёж: <strong>" + monthly + "&nbsp;руб./мес.</strong> (одобряем даже без паспорта, под честное слово).";
  return false;
}
