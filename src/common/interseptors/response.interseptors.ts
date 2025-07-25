import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, { result: string; data: T }>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<{ result: string; data: T }> {
    return next.handle().pipe(
      map((data: T) => ({
        result: 'success',
        data,
      })),
    );
  }
}
