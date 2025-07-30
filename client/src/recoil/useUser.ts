import { useSetRecoilState } from "recoil";
import { userAtom } from "./userAtom";
import { User } from "../types/User";

export const useUser = () => {
    const setUser = useSetRecoilState(userAtom);

    const setUserAtom = (user: User) => {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
    };

    const removeUserAtom = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    const getUserAtom = () => {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) as User : null;
    };
    return { setUserAtom, removeUserAtom, getUserAtom };
};
