export interface Stress {
  id: number;
  level: StressLevelEnum;
  image: string;
}

export enum StressLevelEnum {
  ZERO = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}
