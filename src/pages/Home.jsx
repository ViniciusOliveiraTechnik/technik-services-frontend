import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function Home() {
  const { getMe, user, setUser } = useAuth();

  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        try {
          const responeUser = await getMe();
          console.log(responeUser);
          setUser(responeUser);
        } catch (err) {
          console.error(err);
        }
      };

      fetchUser();
    }
  }, []);

  return <h1>{user ? user.id : "Carregando..."}</h1>;
}
