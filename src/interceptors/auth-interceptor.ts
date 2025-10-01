import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Pega o token do localStorage
  const token = localStorage.getItem('token');

  // Se o token existir, clona a requisição e adiciona o header de Authorization
  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedReq);
  }

  // Se não houver token, apenas continua com a requisição original
  return next(req);
};