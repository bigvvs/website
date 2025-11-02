const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

const navToggle = $(".nav-toggle");
const siteNav = $(".site-nav");
navToggle?.addEventListener("click", () => {
    const open = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
});

$$(".site-nav .nav-link").forEach((link) =>
    link.addEventListener("click", () => {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
    })
);

function scrollToWithOffset(target) {
    const header = $(".site-header");
    const y = target.getBoundingClientRect().top + window.pageYOffset - (header?.offsetHeight || 0) - 8;
    window.scrollTo({ top: y, behavior: "smooth" });
}

$$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const el = document.querySelector(id);
        if (el) {
            e.preventDefault();
            scrollToWithOffset(el);
        }
    });
});

const sections = ["#home", "#offerings", "#partners"].map((id) => ({ id, el: $(id) })).filter(Boolean);
const linkById = new Map($$(".site-nav .nav-link").map((l) => [l.getAttribute("href"), l]));

const obs = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const href = `#${entry.target.id}`;
                $$(".site-nav .nav-link").forEach((n) => n.classList.remove("active"));
                linkById.get(href)?.classList.add("active");
            }
        });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
);
sections.forEach(({ el }) => el && obs.observe(el));

const year = new Date().getFullYear();
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(year);
