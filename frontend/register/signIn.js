const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

if (signupForm) {

    signupForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {

            const response = await fetch(
                "http://localhost:3000/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            alert(data.message);

            if (data.success) {
                window.location.href = "../home/home.html";
            }

        } catch (err) {

            console.error(err);
            alert("Could not connect to server");

        }

    });

}

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {

            const response = await fetch(
                "http://localhost:3000/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (data.success) {

                localStorage.setItem(
                    "token",
                    data.token
                );

                localStorage.setItem(
                    "username",
                    data.username
                );

                window.location.href = "../home/home.html";

            } else {

                alert(data.message);

            }

        } catch (err) {

            console.error(err);
            alert("Could not connect to server");

        }

    });

}