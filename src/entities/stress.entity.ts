import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Stress, StressLevelEnum } from '@interfaces/stress.interface';
import { UserEntity } from '@entities/user.entity';

@Entity()
export class StressEntity extends BaseEntity implements Stress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: StressLevelEnum,
    default: StressLevelEnum.ZERO,
  })
  @IsNotEmpty()
  level: StressLevelEnum;

  @ManyToOne(() => UserEntity, user => user.stresses)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  @IsOptional()
  image: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
