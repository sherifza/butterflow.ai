document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const toolName = params.get("name");

    if (!toolName) return;

    try {
        const res = await fetch("/data/tools.json");
        const data = await res.json();
        const tool = data[toolName];

        if (!tool) return;

        document.getElementById("tool-title").textContent = tool.title;
        document.getElementById("tool-tagline").textContent = tool.tagline;
        document.getElementById("tool-cta").textContent = tool.cta;
        document.getElementById("tool-icon").src = tool.image;
        document.getElementById("tool-problem").textContent = tool.problem;
        document.getElementById("tool-solution").textContent = tool.solution;

        // Steps
        const stepsList = document.getElementById("tool-steps");
        stepsList.innerHTML = "";
        tool.steps.forEach(step => {
            const li = document.createElement("li");
            li.textContent = "✔️ " + step;
            stepsList.appendChild(li);
        });

        // Features
        const featuresGrid = document.getElementById("tool-features");
        featuresGrid.innerHTML = "";
        tool.features.forEach(f => {
            const div = document.createElement("div");
            div.className = "card";
            div.innerHTML = `<div class="card-icon">${f.icon}</div><h3>${f.title}</h3><p>${f.desc}</p>`;
            featuresGrid.appendChild(div);
        });
    } catch (err) {
        console.error("Error loading tool data", err);
    }
});
