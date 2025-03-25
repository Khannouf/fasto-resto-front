import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ConnectedUser } from "../types/type"; // adapte le chemin
import { isTokenValid } from "../components/tokenInfo";

interface UserContextType {
  user: ConnectedUser | null;
  addUser: (user: ConnectedUser) => void;
  editUser: (user: Partial<ConnectedUser>) => void;
  deleteUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ConnectedUser | null>(null);

  // Charger le user depuis localStorage au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem("connectedUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const addUser = (newUser: ConnectedUser) => {
    setUser(newUser);
    localStorage.setItem("connectedUser", JSON.stringify(newUser));
    localStorage.setItem("token", newUser.token);
  };

  const editUser = (updatedFields: Partial<ConnectedUser>) => {
    setUser((prev) => {
      if (prev) {
        const updatedUser = { ...prev, ...updatedFields };
        localStorage.setItem("connectedUser", JSON.stringify(updatedUser));
        return updatedUser;
      }
      return prev;
    });
  };

  const deleteUser = () => {
    setUser(null);
    localStorage.removeItem("connectedUser");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if(user){
      const tokenValid = isTokenValid(user.token);
          if (tokenValid) {
            console.log("token valide");
          } else {
            console.log("token invalide");
            localStorage.removeItem("connectedUser");
            deleteUser()
        }
    }
  }, [user])
  

  return (
    <UserContext.Provider value={{ user, addUser, editUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
