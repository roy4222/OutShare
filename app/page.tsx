import ProfileBlock from "@/components/profileBlock";
import TripsToogleGroup from "@/components/TripsToogleGroup";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-white py-8">
      <main className="container mx-auto flex flex-col items-center justify-center text-center px-4">
        <ProfileBlock />
        <TripsToogleGroup />
      </main>
    </div>
  );
}
