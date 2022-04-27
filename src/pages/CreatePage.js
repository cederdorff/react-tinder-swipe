import { addDoc, serverTimestamp } from "@firebase/firestore";
import { useEffect } from "react";
import { postsRef } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import { getAuth } from "firebase/auth";

export default function CreatePage({ showLoader }) {
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        showLoader(false);
    }, [showLoader]);

    async function handleSubmit(newPost) {
        showLoader(true); // show the loader
        newPost.createdAt = serverTimestamp(); // timestamp (now)
        newPost.uid = auth.currentUser.uid; // uid of auth user / signed in user
        await addDoc(postsRef, newPost); // add new doc - new post object

        showLoader(false); // hiode the loader
        navigate("/");
    }

    return (
        <section className="page">
            <h1>Create Page</h1>
            <PostForm savePost={handleSubmit} />
        </section>
    );
}
