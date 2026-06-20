const seenInput = document.getElementById("seenInput");
const wishInput = document.getElementById("wishInput");

const addSeenBtn = document.getElementById("addSeenBtn");
const addWishBtn = document.getElementById("addWishBtn");

const seenList = document.getElementById("seenList");
const wishList = document.getElementById("wishList");

let seenBirds = JSON.parse(localStorage.getItem("seenBirds")) || [];
let wishBirds = JSON.parse(localStorage.getItem("wishBirds")) || [];

function saveLists() {
    localStorage.setItem("seenBirds", JSON.stringify(seenBirds));
    localStorage.setItem("wishBirds", JSON.stringify(wishBirds));
}

function createListItem(birdName, listType) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = birdName;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";

    removeBtn.addEventListener("click", () => {
        if (listType === "seen") {
            seenBirds = seenBirds.filter(bird => bird !== birdName);
        } else {
            wishBirds = wishBirds.filter(bird => bird !== birdName);
        }

        saveLists();
        renderLists();
    });

    li.appendChild(span);
    li.appendChild(removeBtn);

    return li;
}

function renderLists() {
    seenList.innerHTML = "";
    wishList.innerHTML = "";

    seenBirds.forEach(bird => {
        seenList.appendChild(createListItem(bird, "seen"));
    });

    wishBirds.forEach(bird => {
        wishList.appendChild(createListItem(bird, "wish"));
    });
}

addSeenBtn.addEventListener("click", () => {
    const bird = seenInput.value.trim();

    if (bird === "") return;

    seenBirds.push(bird);

    saveLists();
    renderLists();

    seenInput.value = "";
});

addWishBtn.addEventListener("click", () => {
    const bird = wishInput.value.trim();

    if (bird === "") return;

    wishBirds.push(bird);

    saveLists();
    renderLists();

    wishInput.value = "";
});

seenInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        addSeenBtn.click();
    }
});

wishInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        addWishBtn.click();
    }
});

renderLists();