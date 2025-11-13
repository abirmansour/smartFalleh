import { Injectable, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // 👇 استثناء المسارات المفتوحة من الحماية
    const isPublicRoute =
      request.path === '/auth/login' ||
      request.path === '/auth/register' ||
      request.path === '/auth/refresh-token' ||
      request.path === '/users/request-password-reset' || 
      request.path === '/users/reset-password' ||          // ✅ وهذا
      (request.path === '/demandes' && request.method === 'POST'); // 👈 هنا زدنا الاستثناء

    if (isPublicRoute) {
      return true; // نخلي route مفتوح
    }

    // 🧠 للباقي، نطبّق الـ JWT guard العادي
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('Utilisateur non autorisé');
    }

    const request = context.switchToHttp().getRequest();

    // 👇 règles pour créer/modifier/supprimer un utilisateur
    if (request.method === 'POST' && request.path.startsWith('/users')) {
      if (user.role !== 'admin') {
        throw new ForbiddenException(
          'Seul un administrateur peut créer un utilisateur.',
        );
      }
    }

    // 👇 règles pour créer/modifier/supprimer une coopérative
    if (
      ['POST', 'PATCH', 'DELETE'].includes(request.method) &&
      request.path.startsWith('/cooperatives')
    ) {
      if (user.role !== 'admin') {
        throw new ForbiddenException(
          'Seul un administrateur peut gérer les coopératives.',
        );
      }
    }

    return user;
  }
}
