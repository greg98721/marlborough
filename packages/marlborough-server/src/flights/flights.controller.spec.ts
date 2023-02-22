import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ScheduleService } from '../schedule/schedule.service';
import { FlightsController } from './flights.controller';

describe('FlightsController', () => {
  let controller: FlightsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlightsController],
      providers: [ScheduleService, JwtAuthGuard],
    }).compile();

    controller = module.get<FlightsController>(FlightsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a list of flights', () => {
    const flights = controller.getFlights('NZWB', 'NZWN');
    expect(flights.length).toBeGreaterThan(0);
  });
});
