import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let configService: DeepMocked<ConfigService>;

  beforeEach(() => {
    configService = createMock<ConfigService>();
    configService.getOrThrow.mockReturnValue('SECRET');
    authGuard = new AuthGuard(configService);
    authGuard.onModuleInit();
  });
  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  // happy path
  it('should return true if the api key is correct', () => {
    const result = authGuard.canActivate(
      createMock<ExecutionContext>({
        switchToHttp() {
          return {
            getRequest() {
              return {
                headers: {
                  'x-api-key': 'SECRET',
                },
              };
            },
          };
        },
      }),
    );
    expect(result).toBe(true);
  });

  // unhappy path
  it('should throw an error if the api key is incorrect', () => {
    const result = () =>
      authGuard.canActivate(
        createMock<ExecutionContext>({
          switchToHttp() {
            return {
              getRequest() {
                return {
                  headers: {
                    'x-api-key': 'INCORRECT_SECRET',
                  },
                };
              },
            };
          },
        }),
      );
    expect(result).toThrow(UnauthorizedException);
  });
});
