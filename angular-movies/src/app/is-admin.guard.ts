import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from './security/security.service';

export function isAdminGuard(): CanActivateFn {
  return () => {
    const securityService: SecurityService = inject(SecurityService);
    const router: Router = inject(Router);

    if (securityService.getRole() === 'admin') {
      return true;
    }
    router.navigate(['/login']);
    return false;
  };
}
