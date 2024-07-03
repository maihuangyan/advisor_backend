import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CreateConfigurationDto } from "../dto/create-configuration.dto";
import { UpdateConfigurationDto } from "../dto/update-configuration.dto";

@Entity()
export class Configuration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column({ type: "text", default: "" })
  value: string;

  constructor(dto: CreateConfigurationDto) {
    if (dto) {
      this.key = dto.key;
      this.value = dto.value;
    }
  }

  update(dto: UpdateConfigurationDto) {
    this.key = dto.key;
    this.value = dto.value;
  }
}
