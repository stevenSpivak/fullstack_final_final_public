const seenInput = document.getElementById("seenInput");
const wishInput = document.getElementById("wishInput");

const addSeenBtn = document.getElementById("addSeenBtn");
const addWishBtn = document.getElementById("addWishBtn");

const seenList = document.getElementById("seenList");
const wishList = document.getElementById("wishList");

const count_seen_birds = document.getElementById("count_seen_birds");
const count_want_to_see = document.getElementById("count_want_to_see");

let seenBirds = [];
let wishBirds = [];

const token = localStorage.getItem("token");

async function loadLists() {

    const response = await fetch("http://localhost:3000/birds", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    seenBirds = data.seenBirds;
    wishBirds = data.wishlistBirds;
    count_seen_birds.innerText = `seen birds: ${seenBirds.length}`;
    count_want_to_see.innerText = `want to see: ${wishBirds.length}`;
    renderLists();
}

function createListItem(birdName, listType) {

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = birdName;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";

    removeBtn.addEventListener("click", async () => {

        await fetch("http://localhost:3000/birds/remove", {

            method: "POST",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                bird: birdName,
                list: listType
            })

        });

        loadLists();

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

addSeenBtn.addEventListener("click", async () => {

    const bird = seenInput.value.trim();

    if (bird === "") return;

    await fetch("http://localhost:3000/birds/add", {

        method: "POST",

        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            bird,
            list: "seen"
        })

    });

    seenInput.value = "";

    loadLists();

});

addWishBtn.addEventListener("click", async () => {

    const bird = wishInput.value.trim();

    if (bird === "") return;

    await fetch("http://localhost:3000/birds/add", {

        method: "POST",

        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            bird,
            list: "wish"
        })

    });

    wishInput.value = "";

    loadLists();

});

seenInput.addEventListener("keypress", e => {

    if (e.key === "Enter")
        addSeenBtn.click();

});

wishInput.addEventListener("keypress", e => {

    if (e.key === "Enter")
        addWishBtn.click();

});

loadLists();