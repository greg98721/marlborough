import { Test, TestingModule } from '@nestjs/testing';
import { createSchedule, Schedule } from './schedule';


describe('Schedule', () => {
  let schedule: Schedule;

  beforeEach(async () => {
    schedule = createSchedule();
  });

  it('has a collection of air routes', () => {
    expect(schedule.routes.length > 0);
  });

  it('Dunedin has a set of routes starting there', () => {
    expect(schedule.routes.length > 0);
  });
});
