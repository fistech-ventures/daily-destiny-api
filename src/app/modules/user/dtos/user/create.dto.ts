import { ApiProperty } from '@nestjs/swagger';
import { ENUM_ACL_DEFAULT_ROLES } from '@src/shared';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly isActive!: boolean;

  @ApiProperty({
    type: String,
    required: true,
    example: 'user@wh.com',
  })
  @IsNotEmpty()
  @IsString()
  readonly email!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Zahid Hassan',
  })
  @IsNotEmpty()
  @IsString()
  readonly fullName!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '8801612345678',
  })
  @IsNotEmpty()
  @IsString()
  readonly phoneNumber?: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  readonly password?: string;

  @ApiProperty({
    type: [String],
    required: true,
    example: Object.values(ENUM_ACL_DEFAULT_ROLES).map((r) => r),
  })
  @IsOptional()
  @IsArray()
  roles!: string[];
}
