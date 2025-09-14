import ModalCard from "@/components/ModalCard";
import ProfileBlock from "@/components/profileBlock";
import TripsToogleGroup from "@/components/TripsToogleGroup";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-white py-8 max-w-lg mx-auto border border-green-500">
      <main className="container">
        <ProfileBlock />
        <div className="flex items-center justify-center border border-red-500 pb-4">
          <TripsToogleGroup />
        </div>
        <div className="w-full flex items-center justify-center border border-blue-500">
          <ModalCard />
        </div>
      </main>
    </div>
  );
}
