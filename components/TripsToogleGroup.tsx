import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const TripsToogleGroup = () => {
  return (
    <ToggleGroup type="single" className="mt-10" defaultValue="trips">
      <ToggleGroupItem value="trips">Trips</ToggleGroupItem>
      <ToggleGroupItem value="gear">Gear</ToggleGroupItem>
    </ToggleGroup>
  );
};

export default TripsToogleGroup;
