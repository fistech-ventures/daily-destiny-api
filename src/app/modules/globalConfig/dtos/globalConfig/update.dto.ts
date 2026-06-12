import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
class IdentitySocialUrlsDTO {
  @ApiProperty({ example: "https://facebook.com/yourpage", required: false })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiProperty({ example: "https://twitter.com/yourpage", required: false })
  @IsOptional()
  @IsString()
  twitter?: string;
}

class GlobalConfigIdentityDTO {
  @ApiProperty({ example: "My App", required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: "Best app ever", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: "https://example.com/logo.png", required: false })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ example: "https://example.com/icon.png", required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ example: "support@example.com", required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: "+880123456789", required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: "Dhaka, Bangladesh", required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ type: IdentitySocialUrlsDTO, required: false })
  @IsOptional()
  @IsObject()
  socialUrls?: IdentitySocialUrlsDTO;

  @ApiProperty({ example: "+880", required: false })
  @IsOptional()
  @IsString()
  phoneCode?: string;

  @ApiProperty({ example: "BDT", required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: "MA", required: false })
  @IsOptional()
  @IsString()
  initialName?: string;

  @ApiProperty({ example: "#000000", required: false })
  @IsOptional()
  @IsString()
  themePrimaryColor?: string;

  @ApiProperty({ example: "#ffffff", required: false })
  @IsOptional()
  @IsString()
  themeSecondayColor?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  needWebView?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  allowUserRegistration?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  userRegistrationVerificationRequired?: boolean;

  @ApiProperty({
    type: Number,
    required: false,
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  readonly otpExpiresInMin?: number;
}

export class UpdateGlobalConfigDTO {
  @ApiProperty({
    type: GlobalConfigIdentityDTO,
    required: false,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GlobalConfigIdentityDTO)
  readonly identity?: GlobalConfigIdentityDTO;

  @ApiProperty({
    type: Object,
    required: false,
    example: {
      gtagId: "GTM-KL0976",
      gtmId: "PJ0976",
      gaId: "87654321898",
      fbPixelId: "32154321898",
    },
    additionalProperties: {
      type: "string",
    }, // 👈 allows arbitrary keys
  })
  @IsOptional()
  @IsObject()
  readonly trackingCodes?: Record<string, any>;

  @ApiProperty({
    type: [String],
    required: false,
    example: ["<script>bing-code</script>", "<script>google-code</script>"]
  })
  @IsOptional()
  readonly trackingScripts?: string[];

  @ApiProperty({
    type: Object,
    required: false,
    example: {
      key1: "value1",
      key2: "value2",
    },
    additionalProperties: {
      type: "string",
    }, // 👈 allows arbitrary keys
  })
  @IsOptional()
  @IsObject()
  readonly meta?: Record<string, any>;
}
