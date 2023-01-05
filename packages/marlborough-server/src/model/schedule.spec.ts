import { TimetableFlight } from '@marlborough/model';

import {
  createSchedule,
  getFlights,
  getOrigins,
  getRoutes,
  getTimetable,
  Schedule,
} from './schedule';

describe('Schedule', () => {
  let schedule: Schedule;

  beforeEach(async () => {
    schedule = createSchedule();
  });

  it('has a collection of air routes', () => {
    expect(schedule.routes.length).toBeGreaterThan(0);
  });

  it('schedule has a collection of origins', () => {
    const airports = getOrigins(schedule);
    expect(airports).toContain('NZDN');
    expect(airports).toContain('NZWB');
    expect(airports.length).toBe(12);
  });

  it('Dunedin has a set of routes starting there', () => {
    const routes = getRoutes(schedule, 'NZDN');
    expect(routes.find((a) => a.destination === 'NZCH')).toBeDefined();
    expect(routes.find((a) => a.destination === 'NZNS')).toBeDefined();
    expect(routes.find((a) => a.destination === 'NZWN')).toBeDefined();
    expect(routes.find((a) => a.destination === 'NZAA')).toBeUndefined();
  });

  const checkDunedinTimetable = (timetable: TimetableFlight[]) => {
    // first flight to wellington
    const wellington = timetable.filter((t) => t.route.destination === 'NZWN');
    const nelson = timetable.filter((t) => t.route.destination === 'NZNS');
    const christchurch = timetable.filter(
      (t) => t.route.destination === 'NZCH',
    );
    expect(wellington.length).toBe(7);
    expect(nelson.length).toBe(2);
    expect(christchurch.length).toBe(7);
  };

  it('can get full timetable for Dunedin', () => {
    const timetable = getTimetable(schedule, 'NZDN');
    checkDunedinTimetable(timetable);
  });

  it('random generation is constant', () => {
    const newPlymouthTimetable = getTimetable(schedule, 'NZAA');
    expect(newPlymouthTimetable.length).toBeGreaterThan(0);
    const dunedinTimetable = getTimetable(schedule, 'NZDN');
    checkDunedinTimetable(dunedinTimetable);
  });

  it('can create flights over the next 7 days', () => {
    const flights = getFlights(schedule, 'NZWB', 'NZWN');
    expect(flights.length).toBeGreaterThan(0);
  });
});
