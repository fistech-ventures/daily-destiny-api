import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GlobalRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    return next.handle().pipe(
      map((response: any) => {
        try {
          const user = request?.verifiedUser;
          const method = request?.method;

          // 🚫 Skip if no user or invalid method
          if (!user || !method) return response;

          // 🚫 Skip if response is not an object
          if (!response || typeof response !== 'object') return response;

          // Extract data safely
          const data = response?.data;

          // 🚫 Skip if no valid data object
          if (!data || typeof data !== 'object') return response;

          // 🚫 Skip arrays (optional, depending on your use case)
          if (Array.isArray(data)) return response;

          // ✅ Apply audit fields safely
          switch (method) {
            case 'POST':
              data.createdBy = user;
              break;

            case 'PUT':
            case 'PATCH':
              data.updatedBy = user;
              break;

            case 'DELETE':
              data.deletedBy = user ?? null;
              break;

            default:
              break;
          }

          return response;
        } catch (error) {
          // 🛡️ Never break response pipeline
          console.error('GlobalRequestInterceptor error:', error);
          return response;
        }
      }),
    );
  }
}