"use client";
import InputCommand from "@/app/components/InputCommand";
import { useSession } from "next-auth/react";
import { Hash } from "lucide-react";
import Meal from "@/app/components/Meal";

function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Not signed in</p>;
  }

  return (
    <div className="p-5">
      <h1 className="font-semibold mb-5">Vos courses</h1>
      {/* Info purchase */}
      <div>
        <InputCommand label={"poulet"} />
      </div>

      {/* Info meal */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="m-5">12 juillet 2024</h2>
          <Meal />
        </div>
        <div className="m-5 text-center">
          <h3 className="font-semibold mb-2">Info nutriments</h3>
          <ul>
            <li>Protéin : 200gr</li>
            <li>Lipides : 70gr</li>
            <li>Glucide : 150gr</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
