import { Airport, AirRoute } from '@marlborough/model';
import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from '../schedule/schedule.service';
import { AirRoutesController } from './airRoutes.controller';

describe('RoutesController', () => {
  let airRoutesController: AirRoutesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirRoutesController],
      providers: [ScheduleService],
    }).compile();

    airRoutesController = module.get<AirRoutesController>(AirRoutesController);
  });

  it('should be defined', () => {
    expect(airRoutesController).toBeDefined();
  });

  it('should return a list of origins', () => {
    const a = airRoutesController.getOrigins();
    expect(a).toContain('NZDN');
    expect(a).toContain('NZWN');
  });

  it('should return a list of routes', () => {
    const a = airRoutesController.getRoutes('NZWN');
    expect(a.length).toBeGreaterThan(0);
    const b = a.find((r) => r.destination === 'NZWB');
    expect(b).toBeDefined();
  });

  it('should only work with a valid airport', () => {
    expect(() => {
      airRoutesController.getRoutes('EGLL');
    }).toThrowError(TypeError);
  });
});
