import Image from "next/image";
import { auth } from '@/app/api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-5xl font-bold mb-8">Welcome to LaunchDock</h1>

      {session ? (
        <div className="flex flex-col items-center">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt="User Avatar"
              width={96}
              height={96}
              className="rounded-full mb-4"
            />
          )}
          <p className="text-2xl">Hello, {session.user?.name || session.user?.email}!</p>
        </div>
      ) : (
        <p className="text-xl">Please log in to continue.</p>
      )}
    </main>
  );
}
