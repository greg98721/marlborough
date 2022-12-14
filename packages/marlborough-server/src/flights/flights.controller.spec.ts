import { addDays, formatISO } from 'date-fns';
import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from '../schedule/schedule.service';
import { FlightsController } from './flights.controller';
import { Flight, TimetableFlight } from '@marlborough/model';

describe('FlightsController', () => {
  let controller: FlightsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlightsController],
      providers: [ScheduleService],
    }).compile();

    controller = module.get<FlightsController>(FlightsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a list of flights', () => {
    const from = formatISO(addDays(new Date(), 4), { representation: 'date' });
    const till = formatISO(addDays(new Date(), 12), { representation: 'date' });
    const j = controller.getFlights('NZWB', 'NZWN', from, till);
    const flights = JSON.parse(j) as { t: TimetableFlight; f: Flight[] }[];
    expect(flights.length).toBeGreaterThan(0);
  });
});
