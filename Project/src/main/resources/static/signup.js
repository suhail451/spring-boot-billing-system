async function signup(){

    const fullName =
        document.getElementById("fullName").value;

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    try {

        const response = await fetch(
            "http://localhost:8080/auth/signup",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName,
                    username,
                    password
                })
            }
        );

        if(response.ok){

            alert("Account Created Successfully");

            window.location.href =
                "login.html";
        }
        else{

            const error =
                await response.text();

            alert(error);
        }

    }
    catch(error){

        alert("Signup Failed");
    }
}