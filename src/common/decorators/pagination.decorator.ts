

import {applyDecorators} from "@nestjs/common";
import {ApiQuery} from "@nestjs/swagger";

export function PaginationQuery(page: number = 1, limit: number = 10) {
  return applyDecorators(
    ApiQuery({name: "page", type: "integer", example: page, required: false}),
    ApiQuery({name: "limit", type: "integer", example: limit, required: false})
  );
}
