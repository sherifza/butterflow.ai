// Get the tool name from the URL
function getToolName() {
    const params = new URLSearchParams(window.location.search);
    return params.get("name")?.toLowerCase(); // always lowercase
}

// Load data from tools-details.json
async function loadToolData() {
    try {
        const res = await fetch("/data/tools-details.json");
        if (!res.ok) throw new Error("Failed to fetch tool data.");
        const tools = await res.json();

        const toolName = getToolName();
        if (!toolName) return;

        const tool = tools[toolName]; // ✅ بدلنا find بـ access مباشر باستخدام المفتاح

        if (!tool) {
            document.body.innerHTML = "<h1>Tool not found</h1>";
            return;
        }

        // Fill data
        document.title = tool.title || tool.name;
        document.getElementById("tool-title").textContent = tool.title || tool.name;
        document.getElementById("tool-tagline").textContent = tool.tagline;
        document.getElementById("tool-cta").textContent = tool.cta || "Book a Demo";
        document.getElementById("tool-cta").href = tool.cta_link || "#";
        document.getElementById("tool-icon").src = tool.image;

        document.getElementById("tool-problem").textContent = tool.problem;
        document.getElementById("tool-solution-title").textContent = tool.solution_title || "The Solution";
        document.getElementById("tool-solution").textContent = tool.solution;

        const stepsList = document.getElementById("tool-steps");
        if (tool.steps?.length) {
            tool.steps.forEach(step => {
                const li = document.createElement("li");
                li.textContent = step;
                stepsList.appendChild(li);
            });
        }

        const featureGrid = document.getElementById("tool-features");
        if (tool.features?.length) {
            tool.features.forEach(feat => {
                const div = document.createElement("div");
                div.className = "card";
                div.innerHTML = `
                    <h3>${feat.title}</h3>
                    <p>${feat.desc}</p>
                `;
                featureGrid.appendChild(div);
            });
        }
    } catch (err) {
        console.error("Tool Page Error:", err);
    }
}

document.addEventListener("DOMContentLoaded", loadToolData);
