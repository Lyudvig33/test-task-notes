import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ITokenPayload } from '@common/models';

interface IRequestWithUser extends Request {
  user?: ITokenPayload;
}

export const AuthUser = createParamDecorator(
  (
    data: keyof ITokenPayload | undefined,
    ctx: ExecutionContext,
  ): ITokenPayload[keyof ITokenPayload] | ITokenPayload | undefined => {
    const request = ctx.switchToHttp().getRequest<IRequestWithUser>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
