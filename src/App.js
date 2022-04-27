import { Routes, Navigate, Route } from "react-router-dom";
import Nav from "./components/Nav";
import PostsPage from "./pages/PostsPage";
import CreatePage from "./pages/CreatePage";
import UpdatePage from "./pages/UpdatePage";
import Loader from "./components/Loader";
import { useState } from "react";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from "./pages/FavoritesPage";

function App() {
    const [showLoader, setShowLoader] = useState(true); // default value of the loader is true (loader displayed)
    const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth")); // default value comes from localStorage

    const auth = getAuth();

    onAuthStateChanged(auth, user => {
        if (user) {
            //user is authenticated / signed in
            setIsAuth(true); // set isAuth to true
            localStorage.setItem("isAuth", true); // also, save isAuth in localStorage
        } else {
            // user is not authenticated / not signed in
            setIsAuth(false); // set isAuth to false
            localStorage.removeItem("isAuth"); // remove isAuth from localStorage
        }
    });

    // variable holding all private routes including the nav bar
    const privateRoutes = (
        <>
            <Nav />
            <Routes>
                <Route path="/" element={<PostsPage showLoader={setShowLoader} />} />
                <Route path="/favorites" element={<FavoritesPage showLoader={setShowLoader} />} />
                <Route path="/create" element={<CreatePage showLoader={setShowLoader} />} />
                <Route path="/posts/:id" element={<UpdatePage showLoader={setShowLoader} />} />
                <Route path="/profile" element={<ProfilePage showLoader={setShowLoader} />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );

    // variable holding all public routes without nav bar
    const publicRoutes = (
        <Routes>
            <Route path="/sign-in" element={<SignInPage showLoader={setShowLoader} />} />
            <Route path="/sign-up" element={<SignUpPage showLoader={setShowLoader} />} />
            <Route path="*" element={<Navigate to="/sign-in" />} />
        </Routes>
    );

    // if user is authenticated, show privateRoutes, else show publicRoutes
    // also, display or display not the <Loader/> based on showLoader state
    return (
        <main>
            {isAuth ? privateRoutes : publicRoutes}
            {showLoader && <Loader />}
        </main>
    );
}

export default App;
