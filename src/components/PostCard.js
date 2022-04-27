import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import { usersRef } from "../firebase-config";
import { arrayRemove, doc, updateDoc } from "@firebase/firestore";

export default function PostCard({ post, showRemove }) {
    const navigate = useNavigate();
    const auth = getAuth();

    /**
     * handleClick is called when user clicks on the Article (PostCard)
     */
    function handleClick() {
        navigate(`/posts/${post.id}`);
    }

    async function handleRemoveFromFav() {
        const currentUserDocRef = doc(usersRef, auth.currentUser.uid); // reference to current authenticated user doc
        await updateDoc(currentUserDocRef, {
            favorites: arrayRemove(post.id) // updating current user's favorites field in firebase by removing post id
        }); // docs about update elements in an array: https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array
    }

    return (
        <article>
            <div>
                <UserAvatar uid={post.uid} />
                <img src={post.image} alt={post.title} />
                <h2>{post.title}</h2>
                <button onClick={handleClick}>Show details</button>
            </div>
            {showRemove ?? (
                <button className="light" onClick={handleRemoveFromFav}>
                    Remove from favorites
                </button>
            )}
        </article>
    );
}
