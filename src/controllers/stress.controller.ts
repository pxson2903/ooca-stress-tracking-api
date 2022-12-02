import { NextFunction, Response } from 'express';
import { BaseStressDto, CreateStressDto } from '@dtos/stress.dto';
import { Stress } from '@interfaces/stress.interface';
import { User } from '@interfaces/user.interface';
import { RequestWithUser } from '@interfaces/auth.interface';
import StressService from '@services/stress.service';
import { ImageQueue } from '@/queue';
import { join } from 'path';

class StressController {
  public stressService = new StressService();

  public getStresses = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const findAllUsersData: Stress[] = await this.stressService.findAllByUserId(userData.id);

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public createStress = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stressData: BaseStressDto = req.body;
      const userData: User = req.user;
      const createStressData: Stress = await this.stressService.createStress({
        ...stressData,
        user: userData.id,
        image: join('static', 'images', req.file.filename),
      } as CreateStressDto);

      if (req.file.path) ImageQueue.add({ img: req.file.path, imgName: req.file.filename });

      res.status(201).json({ data: createStressData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}

export default StressController;
