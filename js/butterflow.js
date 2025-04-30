window.addEventListener("DOMContentLoaded", () => {
    loadPartials();
    setLang("en");
    setTimeout(showBackgroundImage, 500);
    loadTools();
});

async function loadPartials() {
    const header = await fetch('/partials/header.html').then(res => res.text());
    const footer = await fetch('/partials/footer.html').then(res => res.text());

    document.getElementById('site-header').innerHTML = header;
    document.getElementById('site-footer').innerHTML = footer;
}



async function loadTools() {
    try {
        const response = await fetch('/data/tools.json');
        const tools = await response.json();
        const grid = document.getElementById('tools-grid');

        tools.forEach(tool => {
            const card = document.createElement('a');
            card.className = 'tool-card';
            card.href = `/tool.html?name=${tool.name}`;

            card.innerHTML = `
                <img src="${tool.logo}" alt="${tool.name} Logo" class="tool-logo">
                <h3>${tool.name}</h3>
                <p class="tagline">${tool.tagline}</p>
                <p>${tool.description}</p>
            `;

            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading tools:', error);
    }
}





// 🌍 Language Translations
const translations = {
    en: {
        hero_sub: "When human love meets AI intelligence, automation becomes art 💛",
        cta_btn: "Start Your Journey",
        about_link: "About",
        services_link: "Services",
        contact_link: "Contact",
        about_title: "What is ButterFlow?",
        about_text: "We are more than an automation company. ButterFlow is where creative minds and machines meet to make work effortless and life sweeter.",
        services_title: "Our Services",
        service_1: "Automated Social Media Posting",
        service_2: "Smart Email Workflows",
        service_3: "Integrated Client Management",
        contact_title: "Let's Connect",
        contact_text: "Have an idea? Need automation? Let’s flow together — one smooth step at a time."
    },
    ar: {
        hero_sub: "عندما يلتقي الحب البشري بذكاء الآلة، تصبح الأتمتة فنًا 💛",
        cta_btn: "ابدأ رحلتك",
        about_link: "عنّا",
        services_link: "الخدمات",
        contact_link: "تواصل",
        about_title: "ما هي ButterFlow؟",
        about_text: "نحن أكثر من مجرد شركة أتمتة. ButterFlow هي النقطة التي يلتقي فيها الإبداع الإنساني بذكاء الآلة لصنع عالم أكثر سلاسة.",
        services_title: "خدماتنا",
        service_1: "نشر المحتوى تلقائيًا",
        service_2: "سير عمل ذكي للبريد",
        service_3: "إدارة العملاء باحتراف",
        contact_title: "تواصل معنا",
        contact_text: "عندك فكرة؟ محتاج أتمتة؟ خلينا نبدأ الرحلة سوا، بسلاسة وهدوء."
    }
};

let currentLang = "en";

function setLang(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    currentLang = lang;
    const langToggle = document.getElementById("lang-toggle");
    if (langToggle) {
        langToggle.title = lang === "en" ? "تغيير اللغة" : "Change Language";
        langToggle.setAttribute("aria-label", langToggle.title);
    }

    document.querySelectorAll("[data-key]").forEach(el => {
        const key = el.getAttribute("data-key");
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    const langLabel = document.getElementById("lang-label");
    if (langLabel) {
        langLabel.textContent = lang === "en" ? "ع" : "EN";

    }

    // 🔁 التحديث السليم للتولتيب والزر
    const btn = document.getElementById("backToTop");
    if (btn) {
        const title = lang === "ar" ? "العودة للأعلى" : "Back to top";
        btn.title = title;
        btn.setAttribute("aria-label", title);

        const tooltip = document.getElementById("top-tooltip");
        if (tooltip) tooltip.textContent = title;
    }
}


function toggleLang() {
    const newLang = currentLang === "en" ? "ar" : "en";
    setLang(newLang);
}




function typewriterEffect(message, targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    target.textContent = ""; // clear old
    let index = 0;

    function type() {
        if (index < message.length) {
            target.textContent += message.charAt(index);
            index++;
            setTimeout(type, 40); // speed of typing
        }
    }

    type();
}

function showBackgroundImage() {
    const bg = document.getElementById("hero-background");
    const lang = currentLang || "en";
    const list = dynamicSlogans[lang] || dynamicSlogans["en"];
    const random = Math.floor(Math.random() * list.length);
    const message = list[random];

    // Update subline in hero
    const subline = document.getElementById("dynamic-subline");
    if (subline) {
        typewriterEffect(message, "dynamic-subline");
    }

    // Show logo
    if (bg) {
        bg.style.display = "flex";
        bg.style.opacity = "1";
    }
}



function hideBackgroundImage() {
    const bg = document.getElementById("hero-background");
    if (bg) {
        bg.style.opacity = "0";
        setTimeout(() => {
            bg.style.display = "none";
        }, 1000);
    }
}

// Back to Top Button Logic
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = "flex";
    } else {
        backToTopBtn.style.display = "none";
    }
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// تحديث التولتيب حسب اللغة
const btn = document.getElementById("backToTop");
if (btn) {
    btn.title = currentLang === "ar" ? "العودة للأعلى" : "Back to top";
    btn.setAttribute("aria-label", btn.title);
}


const dynamicSlogans = {
    en: [
        "When human love meets AI intelligence, automation becomes art 💛",
        "Automate with heart, not just code 💚",
        "Less busywork. More real work.",
        "Designed for humans. Powered by machines 🤖❤️",
        "Let AI work, while you flow ✨"
    ],
    ar: [
        "عندما يلتقي الحب البشري بذكاء الآلة، تصبح الأتمتة فنًا 💛",
        "الأتمتة بإحساس، مش بس كود 💚",
        "أقل شغل روتيني. شغل حقيقي أكتر.",
        "مصمم للبشر. يشتغل بالآلة 🤖❤️",
        "سيب الذكاء يشتغل، وانت عيش اللحظة ✨"
    ]
};


