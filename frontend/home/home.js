async function loadContent() {

    const btn =
        document.getElementById("loadBtn");

    btn.disabled = true;
    btn.textContent = "Loading...";

    try {

        const country =
            document.getElementById(
                "countrySelect"
            ).value;

        const response =
            await fetch(
                `http://localhost:3000/api/home-content?country=${country}`
            );

        const data =
            await response.json();

        document.getElementById(
            "birdTips"
        ).innerHTML =
            `<p>${data.tip}</p>`;

        document.getElementById(
            "binocularTips"
        ).innerHTML =
            data.binoculars
                .map(
                    b => `
                    <div class="binocular-card">
                        <h3>${b.name}</h3>
                        <p>${b.description}</p>
                    </div>
                `
                )
                .join("");

        document.getElementById(
            "birdSites"
        ).innerHTML =
            data.hotspots
                .map(
                    h => `
                    <div class="hotspot-card">

                        <h3>${h.name}</h3>

                        <a
                            href="${h.maps}"
                            target="_blank">

                            Open In Google Maps

                        </a>

                    </div>
                `
                )
                .join("");

    }
    catch (err) {

        console.error(err);

    }
    finally {

        btn.disabled = false;
        btn.textContent = "Load";

    }

}

document
    .getElementById("loadBtn")
    .addEventListener(
        "click",
        loadContent
    );

loadContent();

setInterval(
    loadContent,
    120000
);