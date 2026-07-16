let candidates = [];

const grid = document.getElementById("candidateGrid");
const searchBox = document.getElementById("searchBox");

const modal = document.getElementById("candidateModal");
const closeModal = document.getElementById("closeModal");

const fieldMap = {
    "שם המועמד/ת": "name",
    "ערכים מובילים": "values",
    "מה אומר שיעשה חבר כנסת": "promises",
    "הישגים ונקודות גאווה": "achievements",
    "ביקורת ודעת האופוזיציה": "criticism",
    "אקטיבי ברשת": "social",
    "ערוץ 14": "channel"
};

function normalizeCandidate(rawCandidate) {
    const candidate = {};

    Object.entries(rawCandidate).forEach(([rawKey, value]) => {
        const normalizedKey = rawKey.trim();
        const mappedKey = fieldMap[normalizedKey];

        if (mappedKey) {
            candidate[mappedKey] = typeof value === "string"
                ? value.trim()
                : value;
        } else {
            candidate[normalizedKey] = value;
        }
    });

    candidate.name = candidate.name || "מועמד/ת לא מזוהה";
    candidate.values = candidate.values || "";
    candidate.promises = candidate.promises || "";
    candidate.achievements = candidate.achievements || "";
    candidate.criticism = candidate.criticism || "";
    candidate.social = candidate.social || "";
    candidate.channel = candidate.channel || "";

    return candidate;
}

function formatText(text) {
    return text
        ? text
            .replace(/\r/g, "")
            .replace(/\n/g, "<br>")
        : "";
}

function formatSummary(text, maxLength = 120) {
    if (!text) {
        return "";
    }

    const firstLine = text.split(/\r?\n/)[0].trim();
    return firstLine.length <= maxLength
        ? firstLine
        : `${firstLine.slice(0, maxLength).trim()}…`;
}

async function loadCandidates() {
    const response = await fetch("data/candidates.json");
    const rawCandidates = await response.json();

    candidates = rawCandidates.map(normalizeCandidate);
    renderCandidates(candidates);
}

function renderCandidates(list) {
    grid.innerHTML = "";

    list.forEach(candidate => {
        const card = document.createElement("div");
        card.className = "candidate-card";

        card.innerHTML = `
            <h3>${candidate.name}</h3>
            <p>${formatSummary(candidate.values)}</p>
        `;

        card.addEventListener("click", () => {
            openCandidate(candidate);
        });

        grid.appendChild(card);
    });
}

function openCandidate(candidate) {
    document.getElementById("modalName").textContent = candidate.name;
    document.getElementById("modalValues").innerHTML = formatText(candidate.values);
    document.getElementById("modalPromises").innerHTML = formatText(candidate.promises);
    document.getElementById("modalAchievements").innerHTML = formatText(candidate.achievements);
    document.getElementById("modalCriticism").innerHTML = formatText(candidate.criticism);
    document.getElementById("modalSocial").textContent = candidate.social;
    document.getElementById("modalChannel").textContent = candidate.channel;
    modal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

modal.addEventListener("click", event => {
    if (event.target === modal) {
        modal.classList.add("hidden");
    }
});

searchBox.addEventListener("input", () => {
    const text = searchBox.value.toLowerCase();
    const filtered = candidates.filter(candidate =>
        candidate.name.toLowerCase().includes(text)
    );
    renderCandidates(filtered);
});

loadCandidates();
