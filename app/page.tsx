
import ProfileBlock from "@/components/profileBlock";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <main className="container mx-auto flex flex-col items-center justify-center text-center px-4">
        <ProfileBlock />
      </main>
    </div>
  );
}
