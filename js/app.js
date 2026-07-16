let candidates = [];

const grid = document.getElementById("candidateGrid");
const searchBox = document.getElementById("searchBox");

const modal = document.getElementById("candidateModal");
const closeModal = document.getElementById("closeModal");

const STATUS = {
    LIKE: "like",
    MAYBE: "maybe",
    DISLIKE: "dislike"
};

const filterStatus =
    document.getElementById(
        "filterStatus"
    );

function getCandidateStatuses() {
    return JSON.parse(
        localStorage.getItem("candidateStatuses") || "{}"
    );
}

function setCandidateStatus(candidateName, status) {

    const statuses = getCandidateStatuses();

    statuses[candidateName] = status;

    localStorage.setItem(
        "candidateStatuses",
        JSON.stringify(statuses)
    );

    renderCandidates(candidates);
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

    candidates = await response.json();

    renderCandidates(candidates);
}

function renderCandidates(list) {

    grid.innerHTML = "";

    const statuses = getCandidateStatuses();

    const selectedFilter = filterStatus.value;

    // סינון לפי סטטוס
    if (selectedFilter !== "all") {
        list = list.filter(candidate =>
            statuses[candidate.Name] === selectedFilter
        );
    }

    list.forEach(candidate => {

        const card = document.createElement("div");

        card.className = "candidate-card";

        // תמונת רקע
        if (candidate.img) {
            card.style.backgroundImage =
                `url('${candidate.img}')`;
        }

        // צבע מסגרת לפי סטטוס
        const status = statuses[candidate.Name];

        if (status) {
            card.classList.add(`status-${status}`);
        }

        card.innerHTML = `
            <div class="candidate-actions">

                <button class="like-btn" title="תומך">
                    👍
                </button>

                <button class="maybe-btn" title="לא החלטתי">
                    🤔
                </button>

                <button class="dislike-btn" title="נפסל">
                    👎
                </button>

            </div>

            <div class="card-overlay">
                <h3>${candidate.Name}</h3>
                <p>${formatSummary(candidate.values)}</p>
            </div>
        `;

        // פתיחת המודל בלחיצה על הכרטיס
        card.addEventListener("click", () => {
            openCandidate(candidate);
        });

        // 👍
        card.querySelector(".like-btn")
            .addEventListener("click", e => {

                e.stopPropagation();

                setCandidateStatus(
                    candidate.Name,
                    STATUS.LIKE
                );
            });

        // 🤔
        card.querySelector(".maybe-btn")
            .addEventListener("click", e => {

                e.stopPropagation();

                setCandidateStatus(
                    candidate.Name,
                    STATUS.MAYBE
                );
            });

        // 👎
        card.querySelector(".dislike-btn")
            .addEventListener("click", e => {

                e.stopPropagation();

                setCandidateStatus(
                    candidate.Name,
                    STATUS.DISLIKE
                );
            });

        grid.appendChild(card);
    });

    updateStats();
}



function openCandidate(candidate) {
    document.getElementById("modalName").textContent = candidate.Name;
    document.getElementById("modalValues").innerHTML = formatText(candidate.values);
    document.getElementById("modalPromises").innerHTML = formatText(candidate.doing);
    document.getElementById("modalAchievements").innerHTML = formatText(candidate.acivment);
    document.getElementById("modalCriticism").innerHTML = formatText(candidate.review);
    document.getElementById("modalChannel").textContent = candidate.poisen;
    modal.classList.remove("hidden");
    document.querySelectorAll(".accordion-content")
    .forEach(content => {
        content.classList.remove("open");
    });

    document.querySelectorAll(".accordion-title span")
    .forEach(span => {
        span.textContent = "▼";
    });
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
        candidate.Name.toLowerCase().includes(text)
    );
    renderCandidates(filtered);
});

document.querySelectorAll(".accordion-title")
    .forEach(title => {

        title.addEventListener("click", () => {

            const content =
                title.nextElementSibling;

            content.classList.toggle("open");

            const arrow =
                title.querySelector("span");

            if (content.classList.contains("open")) {
                arrow.textContent = "▲";
            } else {
                arrow.textContent = "▼";
            }
        });

    });

filterStatus.addEventListener(
    "change",
    () => renderCandidates(candidates)
);


function updateStats() {

    const statuses =
        getCandidateStatuses();

    const likes =
        Object.values(statuses)
            .filter(x => x === "like")
            .length;

    const maybes =
        Object.values(statuses)
            .filter(x => x === "maybe")
            .length;

    const dislikes =
        Object.values(statuses)
            .filter(x => x === "dislike")
            .length;

    document.getElementById(
        "stats"
    ).innerHTML = `
        👍 ${likes}
        |
        🤔 ${maybes}
        |
        👎 ${dislikes}
    `;
}

loadCandidates();
