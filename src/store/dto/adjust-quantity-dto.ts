import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class AdjustQuantityDto {
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  quantityChange: number;
}
