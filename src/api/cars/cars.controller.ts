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
import { ParseSortPipe } from '../../common/pipes/parse-sort.pipe';
import { MatchValidationPipe } from '../../common/pipes/match-validation.pipe';
import { Car, CarsList } from './schemas/cars.schema';
import { CarsService } from './cars.service';
import {
  BadRequestResponse,
  NotFoundResponse,
  UnprocessableEntityResponse,
} from '../../common/swagger/responses';
import { DuplicateKeyInterceptor } from '../../common/interceptors/duplicate-key.interceptor';
import { CarDto } from './dto/car.dto';
import { MongoIdValidationPipe } from '../../common/pipes/mongo-id-validation.pipe';

@ApiTags('Cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carService: CarsService) {}

  @ApiOkResponse({
    description: '`List`',
    type: CarsList,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    example: '+id,-brand.name',
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
    return this.carService.findAll({
      sort: sort,
      page: page,
      limit: limit,
    });
  }

  @ApiOkResponse({
    description: '`Car`',
    type: Car,
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
    const car = await this.carService.findById(id);
    if (!car) {
      throw new NotFoundException();
    }
    return car;
  }

  @ApiCreatedResponse({
    description: '`Created`',
    type: Car,
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
  public async create(@Body() payload: CarDto) {
    return this.carService.create(payload);
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
    @Body() payload: CarDto,
  ) {
    const result = await this.carService.update(id, payload);
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
    const result = await this.carService.delete(id);
    if (result.deletedCount === 0) {
      throw new NotFoundException();
    }
  }
}
