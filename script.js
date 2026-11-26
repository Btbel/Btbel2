function startAnim() {
  var title = document.getElementById("welcome-title");
  var video = document.getElementById("bg-video");

  // из интернета, (делает заголовок прозрачным и опускает его чуть вниз перед началом анимации)
  title.style.opacity = "0";
  title.style.transform = "translateY(25px)";
  title.style.transition = "opacity 1.5s ease, transform 1.5s ease";

  // из интернета, (через долю секунды проявляет заголовок и поднимает его на место)
  setTimeout(function() {
    title.style.opacity = "1";
    title.style.transform = "translateY(0px)";
  }, 150);

  // из интернета, (видео и принудительно запускает его с самого начала ровно в момент окончания, чтобы не было паузы между циклами)
  video.addEventListener("ended", function() {
    video.currentTime = 0;
    video.play();
  });
}