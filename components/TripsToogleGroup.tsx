import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface TripsToogleGroupProps {
  value: string;
  onValueChange: (value: string) => void;
}

const TripsToogleGroup = ({ value, onValueChange }: TripsToogleGroupProps) => {
  return (
    <ToggleGroup 
      type="single" 
      className="mt-10" 
      value={value}
      onValueChange={onValueChange}
    >
      <ToggleGroupItem value="trips">Trips</ToggleGroupItem>
      <ToggleGroupItem value="gear">Gear</ToggleGroupItem>
    </ToggleGroup>
  );
};

export default TripsToogleGroup;
