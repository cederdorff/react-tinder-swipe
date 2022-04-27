import { useState, useEffect } from "react";
import { onSnapshot, query, orderBy, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { postsRef, usersRef } from "../firebase-config";
import { getAuth } from "firebase/auth";

import PostCard from "../components/PostCard";
import TinderCard from "react-tinder-card";

export default function HomePage({ showLoader }) {
    const [posts, setPosts] = useState([]);
    const [lastDirection, setLastDirection] = useState();
    const auth = getAuth();

    useEffect(() => {
        const q = query(postsRef, orderBy("createdAt", "desc")); // order by: lastest post first
        const unsubscribe = onSnapshot(q, data => {
            const postsData = data.docs.map(doc => {
                // map through all docs (object) from post collection
                return { ...doc.data(), id: doc.id }; // changing the data structure so it's all gathered in one object
            });
            setPosts(postsData);
            showLoader(false);
        });
        return () => unsubscribe(); // tell the post component to unsubscribe from listen on changes from firestore
    }, [showLoader]);

    function swiped(direction, post) {
        console.log("Direction", direction);
        console.log("Last direction", lastDirection);
        console.log("Post", post);
        setLastDirection(direction);

        if (direction === "right") {
            handleAddToFav(post);
        }
    }

    const outOfFrame = name => {
        console.log(name + " left the screen!");
    };

    async function handleAddToFav(post) {
        const currentUserDocRef = doc(usersRef, auth.currentUser.uid); // reference to current authenticated user doc
        const postRef = doc(postsRef, post.id); // reference to the post you want to add to favorites
        await updateDoc(currentUserDocRef, {
            favorites: arrayUnion(postRef) // updating current user's favorites field in firebase by adding a doc ref to the post
        }); // docs about update elemennts in an array: https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array
    }

    return (
        <section className="page">
            <div className="cardContainer">
                {posts.map(post => (
                    <TinderCard className="swipe" key={post.id} onSwipe={dir => swiped(dir, post)} onCardLeftScreen={() => outOfFrame(post.title)}>
                        <PostCard post={post} showRemove={false} />
                    </TinderCard>
                ))}
            </div>
        </section>
    );
}
