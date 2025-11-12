import { Equipment } from '@/lib/types/equipment';

export type GearSpecs = {
  brand?: string;
  weight_g?: number;
  price_twd?: number;
  buy_link?: string;
  link_name?: string;
  [key: string]: unknown;
};

export interface GearWithRelations {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
  specs: GearSpecs | null;
  tags: string[] | null;
  trip_gear?: Array<{
    trip?: {
      title: string;
    } | null;
  }>;
}

export function mapGear(
  gear: GearWithRelations,
  options: { includeTrips?: boolean } = {}
): Equipment {
  const specs = (gear.specs ?? {}) as GearSpecs;

  const trips =
    options.includeTrips && gear.trip_gear
      ? gear.trip_gear
          .map((relation) => relation.trip?.title)
          .filter((title): title is string => Boolean(title))
      : undefined;

  return {
    id: gear.id,
    name: gear.name,
    brand: specs.brand ?? '',
    weight: specs.weight_g ?? 0,
    price: specs.price_twd ?? 0,
    tags: gear.tags ?? [],
    buy_link: specs.buy_link ?? undefined,
    link_name: specs.link_name ?? undefined,
    image: gear.image_url ?? undefined,
    category: gear.category ?? '',
    trips,
  };
}

export function mapGearList(
  gearList: GearWithRelations[],
  options: { includeTrips?: boolean } = {}
): Equipment[] {
  return gearList.map((gear) => mapGear(gear, options));
}
