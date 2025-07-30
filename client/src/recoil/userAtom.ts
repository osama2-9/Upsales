
import { atom } from "recoil";

export const userAtom = atom({
  key: "userAtom",
  default: (() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  })(),
});
