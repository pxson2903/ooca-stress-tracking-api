import { IsInt, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { StressLevelEnum } from '@interfaces/stress.interface';

export class BaseStressDto {
  @Type(() => Number)
  @IsInt()
  @IsEnum(StressLevelEnum, {
    message: () => {
      const values = [];
      for (const key in StressLevelEnum) {
        values.push(StressLevelEnum[key]);
      }
      return `Level must be on of following values ${values.join(',')}`;
    },
  })
  level: StressLevelEnum;
}

export class CreateStressDto extends BaseStressDto {
  @IsInt()
  user: number;

  @IsString()
  image: string;
}
