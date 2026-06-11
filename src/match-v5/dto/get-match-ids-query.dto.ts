import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";
import { RegionQueryDto } from "../../common/dto/region-query.dto";

export class GetMatchIdsQueryDto extends RegionQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    start: number = 0;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(100)
    count: number = 20;
}
