import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";
import { CreateClientDto } from "./create-client.dto";

export class RegisterClientDto extends CreateClientDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;
}
