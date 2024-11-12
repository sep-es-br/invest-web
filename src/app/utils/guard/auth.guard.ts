import {
  CanActivateChildFn,
  UrlSegment,
  UrlSegmentGroup,
  UrlTree,
} from '@angular/router';

export const authGuard: CanActivateChildFn = (route, state) => {
  let logado = checarLogin();

  if (!logado && route.routeConfig?.path !== 'login') {
    return reRouteTo('login');
  }
  
  if (logado && route.routeConfig?.path === 'login') {
    return reRouteTo('home');
  }
  
  return true;



};

function reRouteTo(path : string) : UrlTree {
    return new UrlTree(
      new UrlSegmentGroup([], {
        primary: new UrlSegmentGroup([new UrlSegment(path, {})], {}),
      })
    );
}


function checarLogin() : boolean{
  const storageToken = sessionStorage.getItem('token');
  const storageUserInfo = sessionStorage.getItem('user-profile');

  return !!storageToken && !!storageUserInfo;
}