import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandDto } from './dto/brand.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Brand, BrandsList } from './schemas/brands.schema';
import { DuplicateKeyInterceptor } from '../../common/interceptors/duplicate-key.interceptor';
import {
  BadRequestResponse,
  NotFoundResponse,
  UnprocessableEntityResponse,
} from '../../common/swagger/responses';
import { MongoIdValidationPipe } from '../../common/pipes/mongo-id-validation.pipe';
import { ParseSortPipe } from '../../common/pipes/parse-sort.pipe';
import { MatchValidationPipe } from '../../common/pipes/match-validation.pipe';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandService: BrandsService) {}

  @ApiOkResponse({
    description: '`List`',
    type: BrandsList,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    example: '+id,-name',
  })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @Get()
  public async list(
    @Query('sort', new ParseArrayPipe({ optional: true }), new ParseSortPipe())
    sort: Record<string, number>[],
    @Query('page', new MatchValidationPipe(/^\d+$/, { default: 1 }))
    page: number,
    @Query('limit', new MatchValidationPipe(/^\d+$/, { default: 10 }))
    limit: number,
  ) {
    return this.brandService.findAll({
      sort: sort,
      page: page,
      limit: limit,
    });
  }

  @ApiOkResponse({
    description: '`Brand`',
    type: Brand,
  })
  @ApiBadRequestResponse({
    description: '`Bad Request`',
    type: BadRequestResponse,
  })
  @ApiNotFoundResponse({
    description: '`Not Found`',
    type: NotFoundResponse,
  })
  @Get(':id')
  public async getById(@Param('id', new MongoIdValidationPipe()) id: string) {
    const brand = await this.brandService.findById(id);
    if (!brand) {
      throw new NotFoundException();
    }
    return brand;
  }

  @ApiCreatedResponse({
    description: '`Created`',
    type: Brand,
  })
  @ApiBadRequestResponse({
    description: '`Bad Request`',
    type: BadRequestResponse,
  })
  @ApiUnprocessableEntityResponse({
    description: '`Unprocessable Entity`',
    type: UnprocessableEntityResponse,
  })
  @UseInterceptors(DuplicateKeyInterceptor)
  @Post()
  public async create(@Body() payload: BrandDto) {
    return this.brandService.create(payload);
  }

  @ApiNoContentResponse({ description: '`No Content`' })
  @ApiBadRequestResponse({
    description: '`Bad Request`',
    type: BadRequestResponse,
  })
  @ApiNotFoundResponse({
    description: '`Not Found`',
    type: NotFoundResponse,
  })
  @ApiUnprocessableEntityResponse({
    description: '`Unprocessable Entity`',
    type: UnprocessableEntityResponse,
  })
  @UseInterceptors(DuplicateKeyInterceptor)
  @HttpCode(204)
  @Patch(':id')
  public async update(
    @Param('id', new MongoIdValidationPipe()) id: string,
    @Body() payload: BrandDto,
  ) {
    const result = await this.brandService.update(id, payload);
    if (result.matchedCount === 0) {
      throw new NotFoundException();
    }
  }

  @ApiNoContentResponse({ description: '`No Content`' })
  @ApiBadRequestResponse({
    description: '`Bad Request`',
    type: BadRequestResponse,
  })
  @ApiNotFoundResponse({
    description: '`Not Found`',
    type: NotFoundResponse,
  })
  @HttpCode(204)
  @Delete(':id')
  public async delete(@Param('id', new MongoIdValidationPipe()) id: string) {
    const result = await this.brandService.delete(id);
    if (result.deletedCount === 0) {
      throw new NotFoundException();
    }
  }
}
