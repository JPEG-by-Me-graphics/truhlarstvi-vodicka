document.addEventListener("DOMContentLoaded", () => {

    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");

    if (toggle && nav) {

        toggle.addEventListener("click", () => {

            const isOpen = nav.classList.toggle("is-open");

            toggle.classList.toggle("is-active", isOpen);

            toggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });


        nav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                nav.classList.remove("is-open");
                toggle.classList.remove("is-active");

                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }


    /* ==========================================
       GALERIE – FILTROVÁNÍ
    ========================================== */

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

                card.classList.toggle(
                    "is-hidden",
                    !show
                );

            });

        });

    });

});