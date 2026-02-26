document.addEventListener("DOMContentLoaded", function () {

    const slides = document.querySelectorAll(".hero-slide");

    let currentIndex = 0;
    const slideInterval = 4000; // 4 seconds

    function showNextSlide() {

        // remove active from current slide
        slides[currentIndex].classList.remove("active");

        // move to next
        currentIndex++;

        // reset if at end
        if (currentIndex >= slides.length) {
            currentIndex = 0;
        }

        // add active to new slide
        slides[currentIndex].classList.add("active");
    }

    setInterval(showNextSlide, slideInterval);

});
