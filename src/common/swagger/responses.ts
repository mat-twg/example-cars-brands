import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HttpResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: any;
}

export class ForbiddenResponse extends HttpResponse {
  @ApiPropertyOptional({ example: 403 })
  statusCode: number;

  @ApiPropertyOptional({
    type: String,
    example: 'Forbidden',
  })
  message: string;
}

export class NotFoundResponse extends HttpResponse {
  @ApiPropertyOptional({ example: 404 })
  statusCode: number;

  @ApiPropertyOptional({
    type: String,
    example: 'Not Found',
  })
  message: string;
}

export class HttpErrorResponse extends HttpResponse {
  @ApiPropertyOptional()
  error: string;
}

export class BadRequestResponse extends HttpErrorResponse {
  @ApiPropertyOptional({ example: 400 })
  statusCode: number;

  @ApiPropertyOptional({
    type: String,
    example: ['error message'],
    isArray: true,
  })
  message: string[];

  @ApiPropertyOptional({ example: 'Bad Request' })
  error: string;
}

export class UnprocessableEntityResponse extends HttpResponse {
  @ApiPropertyOptional({ example: 422 })
  statusCode: number;

  @ApiPropertyOptional({ type: String, example: 'error message' })
  message: string;

  @ApiPropertyOptional({ example: 'Unprocessable Entity' })
  error: string;
}
