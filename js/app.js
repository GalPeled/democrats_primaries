let candidates = [];

const grid = document.getElementById("candidateGrid");
const searchBox = document.getElementById("searchBox");

const modal = document.getElementById("candidateModal");
const closeModal = document.getElementById("closeModal");

async function loadCandidates() {

    const response = await fetch(
        "data/candidates.json"
    );

    candidates = await response.json();

    renderCandidates(candidates);
}

function renderCandidates(list) {

    grid.innerHTML = "";

    list.forEach(candidate => {

        const card = document.createElement("div");

        card.className = "candidate-card";

        card.innerHTML = `
            <h3>${candidate.name}</h3>
            <p>${candidate.role}</p>
        `;

        card.addEventListener("click", () => {
            openCandidate(candidate);
        });

        grid.appendChild(card);
    });
}

function openCandidate(candidate) {

    document.getElementById("modalName").textContent =
        candidate.name;

    document.getElementById("modalState").textContent =
        candidate.state;

    document.getElementById("modalAge").textContent =
        candidate.age;

    document.getElementById("modalRole").textContent =
        candidate.role;

    document.getElementById("modalDescription").textContent =
        candidate.description;

    const positions =
        document.getElementById("modalPositions");

    positions.innerHTML = "";

    candidate.positions.forEach(position => {

        const li = document.createElement("li");

        li.textContent = position;

        positions.appendChild(li);
    });

    modal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

modal.addEventListener("click", (event) => {

    if (event.target === modal) {
        modal.classList.add("hidden");
    }
});

searchBox.addEventListener("input", () => {

    const text =
        searchBox.value.toLowerCase();

    const filtered =
        candidates.filter(candidate =>
            candidate.name
                .toLowerCase()
                .includes(text)
        );

    renderCandidates(filtered);
});

loadCandidates();