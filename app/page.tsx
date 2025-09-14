import ProfileBlock from "@/components/profileBlock";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-white py-8">
      <main className="container mx-auto flex flex-col items-center justify-center text-center px-4">
        <ProfileBlock />
        <ToggleGroup type="single" className="mt-10" defaultValue="trips">
          <ToggleGroupItem value="trips">Trips</ToggleGroupItem>
          <ToggleGroupItem value="gear">Gear</ToggleGroupItem>
        </ToggleGroup>
      </main>
    </div>
  );
}
