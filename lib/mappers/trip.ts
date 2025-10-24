import { Trip } from '@/lib/types/trip';
import { Equipment } from '@/lib/types/equipment';
import { mapGearList, type GearWithRelations } from '@/lib/mappers/equipment';

export interface TripRecord {
  id: string;
  title: string;
  images: string[] | null;
  description: string | null;
  location: string | null;
  duration: string | null;
  tags: string[] | null;
}

export interface TripWithGear extends TripRecord {
  trip_gear: Array<{
    gear: GearWithRelations;
  }>;
}

export function mapTrip(record: TripRecord): Trip {
  return {
    id: record.id,
    title: record.title,
    image: record.images ?? [],
    alt: record.title,
    location: record.location ?? '',
    duration: record.duration ?? '',
    tags: record.tags ?? [],
    description: record.description ?? undefined,
  };
}

export function mapTripList(records: TripRecord[]): Trip[] {
  return records.map(mapTrip);
}

export function mapTripWithEquipment(
  record: TripWithGear
): { trip: Trip; equipment: Equipment[] } {
  const trip = mapTrip(record);
  const equipment = mapGearList(
    record.trip_gear.map((relation) => relation.gear),
    { includeTrips: false }
  );

  return { trip, equipment };
}
