export type TravelPace = "relax" | "balanced" | "active";

export interface TravelRoute {
  id: string;
  title: string;
  duration: string;
  summary: string;
  stops: string[];
  bestFor: string;
  pace: TravelPace;
}
