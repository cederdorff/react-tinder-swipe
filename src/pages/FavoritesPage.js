import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import PostCard from "../components/PostCard";
import { getAuth } from "firebase/auth";
import { usersRef } from "../firebase-config";

export default function FavoritesPage({ showLoader }) {
    const [favPosts, setFavPosts] = useState([]);
    const auth = getAuth();

    useEffect(() => {
        async function getUser() {
            if (auth.currentUser) {
                const docRef = doc(usersRef, auth.currentUser.uid); // use auth users uid to get user data from users collection
                const userData = (await getDoc(docRef)).data();
                if (userData && userData.favorites) {
                    getUserFavPosts(userData.favorites);
                }
            }
            showLoader(false);
        }

        async function getUserFavPosts(userFavs) {
            for (const favPostRef of userFavs) {
                const favPost = (await getDoc(favPostRef)).data();
                favPost.id = favPostRef.id;
                setFavPosts(prevFavPosts => [...prevFavPosts, favPost]);
            }
        }

        getUser();
    }, [auth.currentUser, showLoader]);

    return (
        <section className="page">
            <section className="grid-container">
                {favPosts.map(post => (
                    <PostCard post={post} key={post.id} />
                ))}
            </section>
        </section>
    );
}
