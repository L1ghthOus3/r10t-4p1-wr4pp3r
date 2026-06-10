import { IsIn } from "class-validator";
import { REGIONAL_CLUSTER } from "src/utils/config";

export class RegionQueryDto {
    @IsIn(Object.keys(REGIONAL_CLUSTER))
    region!: string;
}
