import { EntityRepository, Repository } from 'typeorm';
import { CreateStressDto } from '@dtos/stress.dto';
import { StressEntity } from '@entities/stress.entity';
import { HttpException } from '@exceptions/HttpException';
import { Stress } from '@interfaces/stress.interface';
import { isEmpty } from '@utils/util';

@EntityRepository()
class StressService extends Repository<StressEntity> {
  public async findAll(): Promise<Stress[]> {
    const stresses: Stress[] = await StressEntity.find();
    return stresses;
  }

  public async findAllByUserId(userId: number): Promise<Stress[]> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    const findStresses: Stress[] = await StressEntity.find({ where: { user: userId } });
    return findStresses;
  }

  public async createStress(stressData: CreateStressDto): Promise<Stress> {
    if (isEmpty(stressData)) throw new HttpException(400, 'stressData is empty');

    const createStressData: Stress = await StressEntity.create({
      ...stressData,
      user: {
        id: stressData.user,
      },
    }).save();
    return createStressData;
  }

  // public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
  //   if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

  //   const findUser: User = await StressEntity.findOne({ where: { id: userId } });
  //   if (!findUser) throw new HttpException(409, "User doesn't exist");

  //   const hashedPassword = await hash(userData.password, 10);
  //   await StressEntity.update(userId, { ...userData, password: hashedPassword });

  //   const updateUser: User = await StressEntity.findOne({ where: { id: userId } });
  //   return updateUser;
  // }

  // public async deleteUser(userId: number): Promise<User> {
  //   if (isEmpty(userId)) throw new HttpException(400, "UserId is empty");

  //   const findUser: User = await StressEntity.findOne({ where: { id: userId } });
  //   if (!findUser) throw new HttpException(409, "User doesn't exist");

  //   await StressEntity.delete({ id: userId });
  //   return findUser;
  // }
}

export default StressService;
