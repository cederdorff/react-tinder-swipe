import { doc, getDoc, updateDoc, deleteDoc } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostForm from "../components/PostForm";
import { postsRef } from "../firebase-config";

export default function UpdatePage({ showLoader }) {
    const params = useParams(); // url parameter
    const postId = params.id; // get post id from url parameter
    const [post, setPost] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        async function getPost() {
            showLoader(true);
            const docRef = doc(postsRef, postId); // create post ref based on postId from url parameter
            const docData = await getDoc(docRef); // get post data (one specific post)
            setPost(docData.data()); // setting post state with data from firestore
            showLoader(false);
        }

        getPost();
    }, [showLoader, postId]); // called every time postId changes

    /**
     * handleSubmit updates and existing post based on a postId
     * handleSubmit is called by the PostForm component
     */
    async function handleSubmit(postToUpdate) {
        showLoader(true);
        const docRef = doc(postsRef, postId); // create post ref based on postId
        await updateDoc(docRef, postToUpdate); // update post using the docRef and postToUpdate object (coming from PostForm)
        navigate("/");
    }

    async function deletePost() {
        const confirmDelete = window.confirm(`Do you want to delete post, ${post.title}?`); // show confirm delete dialog
        if (confirmDelete) {
            // if user click "OK" then delete post
            showLoader(true);
            const docRef = doc(postsRef, postId); // create post ref based on postId
            await deleteDoc(docRef); // delete doc
            navigate("/");
        }
    }

    return (
        <section className="page">
            <h1>Update Page</h1>
            <PostForm savePost={handleSubmit} post={post} />
            <button className="btn-outline" onClick={deletePost}>
                Delete Post
            </button>
        </section>
    );
}
