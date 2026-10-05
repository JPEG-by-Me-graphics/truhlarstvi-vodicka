document.addEventListener("DOMContentLoaded", () => {

    /* ===== MOBILE MENU ===== */

    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("is-open");

            toggle.classList.toggle("is-active", isOpen);
            toggle.setAttribute("aria-expanded", String(isOpen));
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("is-open");
                toggle.classList.remove("is-active");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }


    /* ===== HEADER SCROLL ===== */

    const header = document.querySelector(".site-header");

    if (header) {
        const updateHeader = () => {
            header.classList.toggle("is-scrolled", window.scrollY > 30);
        };

        updateHeader();
        window.addEventListener("scroll", updateHeader);
    }


    /* ===== COOKIE CONSENT ===== */

    const cookieBanner = document.querySelector("#cookie-banner");
    const cookieAccept = document.querySelector("#cookie-accept");
    const cookieReject = document.querySelector("#cookie-reject");
    const cookieConsent = localStorage.getItem("cookieConsent");

    if (cookieBanner && !cookieConsent) {
        cookieBanner.classList.add("is-visible");
    }

    if (cookieAccept && cookieBanner) {
        cookieAccept.addEventListener("click", () => {
            localStorage.setItem("cookieConsent", "accepted");
            cookieBanner.classList.remove("is-visible");
        });
    }

    if (cookieReject && cookieBanner) {
        cookieReject.addEventListener("click", () => {
            localStorage.setItem("cookieConsent", "rejected");
            cookieBanner.classList.remove("is-visible");
        });
    }


    /* ===== REALIZATIONS LIGHTBOX ===== */

    const galleryImages = [
        ...document.querySelectorAll(".realization-item img")
    ];

    const lightbox = document.querySelector("#realizations-lightbox");

    if (galleryImages.length && lightbox) {
        const track = lightbox.querySelector("#realizations-lightbox-track");
        const counter = lightbox.querySelector(".realizations-lightbox__counter");
        const prevButton = lightbox.querySelector("[data-lightbox-prev]");
        const nextButton = lightbox.querySelector("[data-lightbox-next]");
        const closeButtons = lightbox.querySelectorAll("[data-lightbox-close]");

        if (track && counter && prevButton && nextButton) {
            let currentIndex = 0;
            let isProgrammaticScroll = false;
            let snapTimeout = null;

            track.innerHTML = "";

            galleryImages.forEach((sourceImage, index) => {
                const slide = document.createElement("div");
                slide.className = "realizations-lightbox__slide";

                const image = document.createElement("img");
                image.className = "realizations-lightbox__image";
                image.src = sourceImage.getAttribute("src");
                image.alt = sourceImage.getAttribute("alt") || "Truhlářská realizace";
                image.loading = index === 0 ? "eager" : "lazy";
                image.decoding = "async";

                slide.appendChild(image);
                track.appendChild(slide);

                const item = sourceImage.closest(".realization-item");

                if (item) {
                    item.setAttribute("tabindex", "0");
                    item.setAttribute("role", "button");
                    item.setAttribute("aria-label", `Otevřít fotografii ${index + 1}`);
                    item.style.cursor = "zoom-in";

                    item.addEventListener("click", () => {
                        openLightbox(index);
                    });

                    item.addEventListener("keydown", event => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openLightbox(index);
                        }
                    });
                }
            });

            const slides = [...track.querySelectorAll(".realizations-lightbox__slide")];

            function updateCounter() {
                counter.textContent = `${currentIndex + 1} / ${slides.length}`;
            }

            function getNearestSlideIndex() {
                const trackCenter = track.scrollLeft + (track.clientWidth / 2);

                let nearestIndex = 0;
                let nearestDistance = Infinity;

                slides.forEach((slide, index) => {
                    const slideCenter =
                        slide.offsetLeft + (slide.offsetWidth / 2);

                    const distance = Math.abs(trackCenter - slideCenter);

                    if (distance < nearestDistance) {
                        nearestDistance = distance;
                        nearestIndex = index;
                    }
                });

                return nearestIndex;
            }

            function goToSlide(index, behavior = "smooth") {
                if (!slides.length) {
                    return;
                }

                if (index < 0) {
                    index = slides.length - 1;
                }

                if (index >= slides.length) {
                    index = 0;
                }

                currentIndex = index;
                updateCounter();

                isProgrammaticScroll = true;

                track.scrollTo({
                    left: slides[currentIndex].offsetLeft,
                    behavior: behavior
                });

                window.setTimeout(() => {
                    isProgrammaticScroll = false;
                }, behavior === "smooth" ? 400 : 60);
            }

            function openLightbox(index) {
                lightbox.classList.add("is-open");
                lightbox.setAttribute("aria-hidden", "false");
                document.body.classList.add("lightbox-open");

                goToSlide(index, "auto");
            }

            function closeLightbox() {
                lightbox.classList.remove("is-open");
                lightbox.setAttribute("aria-hidden", "true");
                document.body.classList.remove("lightbox-open");
            }

            function snapToNearestSlide() {
                if (!lightbox.classList.contains("is-open")) {
                    return;
                }

                const nearestIndex = getNearestSlideIndex();
                goToSlide(nearestIndex, "smooth");
            }

            prevButton.addEventListener("click", () => {
                goToSlide(currentIndex - 1);
            });

            nextButton.addEventListener("click", () => {
                goToSlide(currentIndex + 1);
            });

            closeButtons.forEach(button => {
                button.addEventListener("click", closeLightbox);
            });

            track.addEventListener("scroll", () => {
                if (!lightbox.classList.contains("is-open") || isProgrammaticScroll) {
                    return;
                }

                currentIndex = getNearestSlideIndex();
                updateCounter();

                clearTimeout(snapTimeout);

                snapTimeout = window.setTimeout(() => {
                    snapToNearestSlide();
                }, 120);
            });

            track.addEventListener("touchend", () => {
                window.setTimeout(() => {
                    snapToNearestSlide();
                }, 80);
            }, { passive: true });

            track.addEventListener("mouseup", () => {
                window.setTimeout(() => {
                    snapToNearestSlide();
                }, 80);
            });

            document.addEventListener("keydown", event => {
                if (!lightbox.classList.contains("is-open")) {
                    return;
                }

                if (event.key === "Escape") {
                    closeLightbox();
                }

                if (event.key === "ArrowLeft") {
                    goToSlide(currentIndex - 1);
                }

                if (event.key === "ArrowRight") {
                    goToSlide(currentIndex + 1);
                }
            });

            window.addEventListener("resize", () => {
                if (lightbox.classList.contains("is-open")) {
                    goToSlide(currentIndex, "auto");
                }
            });
        }
    }


    /* ===== GALLERY FILTERING ===== */

    const filters = document.querySelectorAll(".gallery-filter");
    const cards = document.querySelectorAll(".gallery-card");

    filters.forEach(filter => {
        filter.addEventListener("click", () => {
            const selected = filter.dataset.filter;

            filters.forEach(item => {
                item.classList.remove("is-active");
            });

            filter.classList.add("is-active");

            cards.forEach(card => {
                const show =
                    selected === "all" ||
                    card.dataset.category === selected;

                card.classList.toggle("is-hidden", !show);
            });
        });
    });

});