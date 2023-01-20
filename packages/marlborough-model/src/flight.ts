export interface Flight {
  flightNumber: string;
  date: Date;
  emptySeats: number;
  /** NZD */
  price: number;
  departed: Date | undefined;
  arrived: Date | undefined;
}
