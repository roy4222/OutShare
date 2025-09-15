export interface Trip {
  id: string;
  title: string;
  image: string;
  alt: string;
  location: string;
  duration: string;
  tags: string[];
}

export interface TripCardProps {
  trip: Trip;
  className?: string;
}
