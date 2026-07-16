let candidates = [];

const grid = document.getElementById("candidateGrid");
const searchBox = document.getElementById("searchBox");

const modal = document.getElementById("candidateModal");
const closeModal = document.getElementById("closeModal");


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

    return text
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.startsWith("-"))
        .map(line => {
            const withoutBullet = line.replace(/^-+\s*/, "");
            const colonIndex = withoutBullet.indexOf(":");

            return colonIndex >= 0
                ? withoutBullet.slice(0, colonIndex).trim()
                : withoutBullet.trim();
        })
        .join("\n");
}

async function loadCandidates() {
    const response = await fetch("data/candidates.json");
    const candidates = await response.json();

    renderCandidates(candidates);
}

function renderCandidates(list) {
    grid.innerHTML = "";

    list.forEach(candidate => {
        const card = document.createElement("div");
        card.className = "candidate-card";

        card.innerHTML = `
            <h3>${candidate.Name}</h3>
            <p>${formatSummary(candidate.values)}</p>
        `;

        card.addEventListener("click", () => {
            openCandidate(candidate);
        });

        grid.appendChild(card);
    });
}

function openCandidate(candidate) {
    document.getElementById("modalName").textContent = candidate.Name;
    document.getElementById("modalValues").innerHTML = formatText(candidate.values);
    document.getElementById("modalPromises").innerHTML = formatText(candidate.doing);
    document.getElementById("modalAchievements").innerHTML = formatText(candidate.acivment);
    document.getElementById("modalCriticism").innerHTML = formatText(candidate.review);
    document.getElementById("modalChannel").textContent = candidate.poisen;
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
