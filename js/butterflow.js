// === INIT BUTTERFLOW ===

let currentLang = localStorage.getItem("lang") || "en";
let translations = {};
let slogans = [];
let sloganInterval;
let sloganIndex = 0;
let tabActive = true;

const fixedStartSlogan = {
    en: "🦋 Automate, Fly & Grow.",
    ar: "🦋 أتمت، حلّق، وتطوّر."
};

function showDefaultSlogan() {
    const subline = document.getElementById("dynamic-subline");
    if (subline) subline.textContent = fixedStartSlogan[currentLang];
}

async function fetchSlogans() {
    try {
        const res = await fetch("/data/slogans.json");
        const data = await res.json();
        slogans = data[currentLang] || data["en"];
        setTimeout(() => startSloganRotation(), 3000); // delay after default slogan
    } catch (err) {
        slogans = [fixedStartSlogan[currentLang]];
    }
}

function startSloganRotation() {
    clearInterval(sloganInterval);
    const subline = document.getElementById("dynamic-subline");
    if (!subline || slogans.length === 0) return;

    const typewriter = (text) => {
        subline.textContent = "";
        let i = 0;
        const interval = setInterval(() => {
            if (!tabActive) return clearInterval(interval);
            subline.textContent += text.charAt(i);
            i++;
            if (i >= text.length) clearInterval(interval);
        }, 40);
    };

    typewriter(slogans[sloganIndex]);

    sloganInterval = setInterval(() => {
        if (!tabActive) return;
        sloganIndex = (sloganIndex + 1) % slogans.length;
        typewriter(slogans[sloganIndex]);
    }, 6000);
}

document.addEventListener("visibilitychange", () => {
    tabActive = !document.hidden;
});

window.addEventListener("DOMContentLoaded", async () => {
    await loadPartials();
    await loadTranslations();
    await setLang(currentLang);
    showDefaultSlogan();
    setTimeout(fetchSlogans, 3000);
});

async function loadTranslations() {
    if (!Object.keys(translations).length) {
        translations = await fetch("/data/translations.json").then(res => res.json());
    }
}

async function loadPartials() {
    const header = await fetch("/partials/header.html").then(res => res.text());
    const footer = await fetch("/partials/footer.html").then(res => res.text());
    document.getElementById("site-header").innerHTML = header;
    document.getElementById("site-footer").innerHTML = footer;
    applyTranslation();
    updateNavDirection();
    fixTestimonialScrolling();
    styleBackToTop();
}

// Handle smart section navigation
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("nav-link")) {
        e.preventDefault();
        const target = e.target.getAttribute("data-target");
        const isHome = location.pathname === "/" || location.pathname === "/index.html";

        if (isHome) {
            const el = document.getElementById(target);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            window.location.href = `/#${target}`;
        }
    }
});

function updateNavDirection() {
    const navList = document.querySelector("#site-header nav ul");
    if (navList) {
        navList.style.flexDirection = currentLang === "ar" ? "row-reverse" : "row";
        navList.style.justifyContent = "flex-start";
    }
}

function fixTestimonialScrolling() {
    const carousel = document.querySelector(".testi-carousel");
    if (carousel) {
        carousel.style.overflowX = "auto";
        carousel.style.display = "flex";
        carousel.style.gap = "1rem";
        carousel.style.scrollSnapType = "x mandatory";
        carousel.style.scrollBehavior = "smooth";
        carousel.querySelectorAll(".testi-card").forEach(card => {
            card.style.minWidth = "250px";
            card.style.scrollSnapAlign = "start";
        });
    }
}

function styleBackToTop() {
    const btn = document.getElementById("backToTop");
    if (btn) {
        btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up" viewBox="0 0 24 24">
        <path d="m18 15-6-6-6 6" />
      </svg>
      <span class="tooltip" id="top-tooltip"></span>
    `;
        btn.style.position = "fixed";
        btn.style.bottom = "20px";
        btn.style.right = currentLang === "ar" ? "unset" : "20px";
        btn.style.left = currentLang === "ar" ? "20px" : "unset";
        btn.style.background = "#fff";
        btn.style.border = "1px solid #ccc";
        btn.style.borderRadius = "50%";
        btn.style.width = "40px";
        btn.style.height = "40px";
        btn.style.justifyContent = "center";
        btn.style.alignItems = "center";
        btn.style.display = "none";
        btn.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
        btn.style.cursor = "pointer";
        btn.style.zIndex = "1000";
    }
}

async function setLang(lang) {
    currentLang = lang;
    document.title = currentLang === "ar"
        ? "ButterFlow.ai – أتمت، حلّق، وتطوّر"
        : "ButterFlow.ai – Automate, Fly & Grow";

    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    applyTranslation();
    updateNavDirection();
    showDefaultSlogan();
    await loadTools();
    await loadContactFlowSection();
    clearInterval(sloganInterval);
    fetchSlogans();
}

function toggleLang() {
    const newLang = currentLang === "en" ? "ar" : "en";
    localStorage.setItem("lang", newLang);
    window.location.reload();
}

function applyTranslation() {
    document.querySelectorAll("[data-key]").forEach(el => {
        const key = el.getAttribute("data-key");
        if (translations[currentLang] && translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });

    const langToggle = document.getElementById("lang-toggle");
    const langLabel = document.getElementById("lang-label");
    if (langToggle && langLabel) {
        langToggle.title = currentLang === "en" ? "تغيير اللغة" : "Change Language";
        langLabel.textContent = currentLang === "en" ? "ع" : "EN";
    }

    const btn = document.getElementById("backToTop");
    const tooltip = document.getElementById("top-tooltip");
    if (btn && tooltip) {
        const title = currentLang === "ar" ? "العودة للأعلى" : "Back to top";
        btn.title = title;
        btn.setAttribute("aria-label", title);
        tooltip.textContent = title;
    }
}

async function loadTools() {
    const response = await fetch("/data/tools.json");
    const tools = await response.json();
    const grid = document.getElementById("tools-grid");
    if (!grid) return;
    grid.innerHTML = "";

    tools.filter(t => t.type !== "service").forEach(tool => {
        const card = document.createElement("a");
        card.className = "tool-card";
        card.href = `/tool.html?name=${tool.name}`;
        card.innerHTML = `
      <img src="${tool.logo}" alt="${tool.name} Logo" class="tool-logo">
      <h3>${tool.name}</h3>
      <p class="tagline">${tool.tagline[currentLang]}</p>
      <p>${tool.description[currentLang]}</p>
    `;
        grid.appendChild(card);
    });
}

async function loadContactFlowSection() {
    if (!document.getElementById("cf-title")) return;
    const response = await fetch("/data/tools.json");
    const tools = await response.json();
    const tool = tools.find(t => t.name.toLowerCase() === "contactflow");
    if (!tool) return;

    document.getElementById("cf-title").innerHTML = tool.title[currentLang];
    document.getElementById("cf-text").innerHTML = tool.text[currentLang];
    document.getElementById("cf-note").innerText = tool.note[currentLang];
    document.getElementById("cf-cta").innerText = tool.cta[currentLang];
}

function hideBackgroundImage() {
    const bg = document.getElementById("hero-background");
    if (bg) {
        bg.style.opacity = "0";
        setTimeout(() => bg.style.display = "none", 3000);
    }
}

const backToTopBtn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
    backToTopBtn.style.display = window.scrollY > 300 ? "flex" : "none";
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
