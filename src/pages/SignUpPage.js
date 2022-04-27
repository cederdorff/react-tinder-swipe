import { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { doc, setDoc } from "@firebase/firestore";
import { usersRef } from "../firebase-config";

export default function SignUpPage({ showLoader }) {
    const [name, setName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const auth = getAuth();

    useEffect(() => {
        showLoader(false);
    }, [showLoader]);

    function handleSignUp(event) {
        event.preventDefault();
        const mail = event.target.mail.value; // mail value from inout field in sign in form
        const password = event.target.password.value; // password value from inout field in sign in form

        // read the docs: https://firebase.google.com/docs/auth/web/password-auth#create_a_password-based_account
        createUserWithEmailAndPassword(auth, mail, password)
            .then(userCredential => {
                // Created and signed in
                const user = userCredential.user;
                const docRef = doc(usersRef, user.uid); // create reference to the user in firestore
                setDoc(docRef, { name }); // set/update the user in firestore with the values from userToUpdate/values from input fields
            })
            .catch(error => {
                let code = error.code; // saving error code in variable
                console.log(code);
                code = code.replaceAll("-", " "); // some JS string magic to display error message. See the log above in the console
                code = code.replaceAll("auth/", "");
                setErrorMessage(code);
            });
    }

    return (
        <section className="page">
            <h1>Sign Up</h1>
            <form onSubmit={handleSignUp}>
                <input type="text" value={name} onChange={e => setName(e.target.value)} name="name" placeholder="Type your name" />
                <input type="email" name="mail" placeholder="Type your mail" />
                <input type="password" name="password" placeholder="Type your password" />
                <p className="text-error">{errorMessage}</p>
                <button>Sign Up</button>
            </form>
            <p className="text-center">
                Already have an account? <Link to="/sign-in">Sign In</Link>
            </p>
        </section>
    );
}
