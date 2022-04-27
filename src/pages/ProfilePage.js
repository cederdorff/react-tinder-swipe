import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { usersRef } from "../firebase-config";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import imgPlaceholder from "../assets/img/img-placeholder.jpg";

export default function ProfilePage({ showLoader }) {
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const auth = getAuth();

    useEffect(() => {
        showLoader(true);

        async function getUser() {
            if (auth.currentUser) {
                setEmail(auth.currentUser.email); // set the email state from the auth user objects email property
                // get more info about the user from users collection
                const docRef = doc(usersRef, auth.currentUser.uid); // use auth users uid to get user data from users collection
                const userData = (await getDoc(docRef)).data();
                if (userData) {
                    // if userData exists set states with values from userData (data from firestore)
                    setName(userData.name);
                    setTitle(userData.title || "");
                    setImage(userData.image || imgPlaceholder);
                }
            }
            showLoader(false);
        }

        getUser();
    }, [auth.currentUser, showLoader]); // dependencies: useEffect is executed when auth.currentUser changes

    async function handleSubmit(event) {
        event.preventDefault();
        showLoader(true);

        const userToUpdate = { name: name, title: title, image: image }; // create an object to hold the user to update properties
        console.log(userToUpdate);
        const docRef = doc(usersRef, auth.currentUser.uid); // create reference to the user in firestore
        await updateDoc(docRef, userToUpdate); // set/update the user in firestore with the values from userToUpdate/values from input fields
        showLoader(false);
    }

    function handleSignOut() {
        signOut(auth); // sign out from firebase/auth
    }

    /**
     * handleImageChange is called every time the user chooses an image in the fire system.
     * The event is fired by the input file field in the form
     */
    function handleImageChange(event) {
        const file = event.target.files[0];
        if (file.size < 500000) {
            // image file size must be below 0,5MB
            const reader = new FileReader();
            reader.onload = event => {
                setImage(event.target.result);
            };
            reader.readAsDataURL(file);
            setErrorMessage(""); // reset errorMessage state
        } else {
            // if not below 0.5MB display an error message using the errorMessage state
            setErrorMessage("The image file is too big!");
        }
    }

    return (
        <section className="page">
            <h1>Profile</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name
                    <input type="text" value={name} onChange={e => setName(e.target.value)} name="name" placeholder="Type name" />
                </label>
                <label>
                    Email
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} name="email" placeholder="Type email" disabled />
                </label>
                <label>
                    Title
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} name="title" placeholder="Type your title" />
                </label>
                <label>
                    Image
                    <input type="file" className="file-input" accept="image/*" onChange={handleImageChange} />
                    <img className="image-preview" src={image} alt="Choose" onError={event => (event.target.src = imgPlaceholder)} />
                </label>
                <p className="text-error">{errorMessage}</p>
                <button>Save User</button>
            </form>
            <button className="btn-outline" onClick={handleSignOut}>
                Sign Out
            </button>
        </section>
    );
}
