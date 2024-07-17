"use client";
import { useSession } from "next-auth/react";

function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Not signed in</p>;
  }

  return (
    <div>
      <p>Signed in as {session.user.email}</p>
      <p>User ID: {session.user.id}</p>
    </div>
  );
}

export default Dashboard;
