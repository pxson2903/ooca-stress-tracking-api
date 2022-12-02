import { Router } from 'express';
import StressController from '@controllers/stress.controller';
import { BaseStressDto } from '@dtos/stress.dto';
import { Route } from '@interfaces/route.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import uploaderMiddleware from '@middlewares/uploader.middleware';

class StressesRoute implements Route {
  public path = '/stresses';
  public router = Router();
  public stressController = new StressController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.stressController.getStresses);
    this.router.post(
      `${this.path}`,
      authMiddleware,
      uploaderMiddleware('image'),
      validationMiddleware(BaseStressDto, 'body'),
      this.stressController.createStress,
    );
  }
}

export default StressesRoute;
