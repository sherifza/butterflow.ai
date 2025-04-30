// === TOOL PAGE ===

window.addEventListener("DOMContentLoaded", async () => {
    const currentLang = localStorage.getItem("lang") || "en";
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

    await loadPartials(currentLang);
    initToolPage(currentLang);
});

async function loadPartials(currentLang) {
    const header = await fetch("/partials/header.html").then(res => res.text());
    const footer = await fetch("/partials/footer.html").then(res => res.text());
    document.getElementById("site-header").innerHTML = header;
    document.getElementById("site-footer").innerHTML = footer;

    const langToggle = document.getElementById("lang-toggle");
    if (langToggle) {
        langToggle.addEventListener("click", () => {
            const newLang = currentLang === "en" ? "ar" : "en";
            localStorage.setItem("lang", newLang);
            location.reload();
        });
    }
}

async function initToolPage(currentLang) {
    const toolName = new URLSearchParams(window.location.search).get("name")?.toLowerCase();
    if (!toolName) return;

    try {
        const res = await fetch("/data/tools-details.json");
        const tools = await res.json();
        const tool = tools[toolName];

        if (!tool) {
            document.getElementById("tool-title").textContent = currentLang === "ar" ? "الأداة غير موجودة" : "Tool not found";
            return;
        }

        renderTool(tool, currentLang);
    } catch (err) {
        console.error("Failed to load tool data:", err);
    }
}

function renderTool(tool, lang) {
    document.getElementById("tool-title").textContent = tool.title[lang];
    document.getElementById("tool-tagline").textContent = tool.tagline[lang];
    document.getElementById("tool-cta").textContent = tool.cta[lang];
    document.getElementById("tool-cta").href = tool.cta_link || "#";
    document.getElementById("tool-icon").src = tool.image;

    document.getElementById("tool-problem-title").textContent = lang === "ar" ? "المشكلة" : "The Problem";
    document.getElementById("tool-problem").textContent = tool.problem[lang];

    document.getElementById("tool-solution-title").textContent = tool.solution_title[lang];
    document.getElementById("tool-solution").textContent = tool.solution[lang];

    document.querySelector(".how-it-works-list").previousElementSibling.textContent = lang === "ar" ? "كيف يعمل؟" : "How It Works";
    const stepsList = document.getElementById("tool-steps");
    stepsList.innerHTML = "";
    stepsList.style.direction = lang === "ar" ? "rtl" : "ltr";
    tool.steps[lang].forEach(step => {
        const li = document.createElement("li");
        li.textContent = step;
        stepsList.appendChild(li);
    });

    document.querySelector("#tool-features").previousElementSibling.textContent = lang === "ar" ? "أهم الميزات" : "Top Features";
    const featuresGrid = document.getElementById("tool-features");
    featuresGrid.innerHTML = "";
    tool.features.forEach(feature => {
        const div = document.createElement("div");
        div.className = "feature-card";
        div.innerHTML = `
            <h3>${feature.title[lang]}</h3>
            <p>${feature.desc[lang]}</p>
        `;
        featuresGrid.appendChild(div);
    });
}
