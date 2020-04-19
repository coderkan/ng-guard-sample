# Angular Role Based Route Guard

Hi everyone,

In this tutorial, I would like to show you how to implement role-based access control using Angular 9. 

Demo's scenario;

I have created a simple application that includes **Admin**, **User** roles. On the main page the guest will see the showcase to see the web site images.

If the user login as **admin**, the user can access the **/admin** route. If the user login as a user, the user can access /user route in the application. If he is a guest, he only can access /home page, neither /admin nor /user route.

I will examine how to implement role-based access between routes.

I will use the Angular Guard's to protect routes.

## What's an Angular Guard?

The interfaces that inform whether the requested route is allowed are called guards. While performing these operations, the guards look at the return values of the implemented interfaces' methods.

There are different types of guard methods I listed below.

What's these methods?

- `CanActivate`
    - Controls whether a route can be activated. Interface that a class can implement to be a guard deciding if a route can be activated. If all guards return true, navigation will continue. If any guard returns false, navigation will be cancelled.
- `CanActivateChild`
    - Interface that a class can implement to be a guard deciding if a child route can be activated. If all guards return true, navigation will continue. If any guard returns false, navigation will be canceled.
- `CanDeactivate`
    - Interface that a class can implement to be a guard deciding if a route can be deactivated. If all guards return true, navigation will continue. If any guard returns false, navigation will be canceled.
- `CanLoad`
    - Interface that a class can implement to be a guard deciding if children can be loaded.
- `Resolve`
    - Interface that classes can implement to be a data provider. A data provider class can be used with the router to resolve data during navigation.

In this blog post, I will use the `CanActivate` guard to protect the router's link. You can easily implement role-based protection for your router, you could use like  `CanActivateChild` like the same way.

## Let's begin

- [Angular Role Based Route Guard](#angular-role-based-route-guard)
  - [What's an Angular Guard?](#whats-an-angular-guard)
  - [Let's begin](#lets-begin)
    - [**AuthService**](#authservice)
    - [**AuthGuard Implementation**](#authguard-implementation)
    - [**Routing Module Implementation**](#routing-module-implementation)


Let's examine these topics.


### **AuthService**

I have created an Auth service that provides information about the user's login status and roles.

I don't have any integration about jwt token implementation. This is just a simple simulation for login and getting roles. 

login() function takes a string argument and store a user login state and role. The value entered as an argument to the role.

logout() function removes the user's information about login from local storage.

isLoggedIn() function inform us whether the user is logged into the system.

getRole() function gives us the user's role from local storage.

AuthService

```javascript
    @Injectable({
      providedIn: 'root'
    })
    export class AuthService {
      isLogin = false;
    
      roleAs: string;
    
      constructor() { }
    
      login(value: string) {
        this.isLogin = true;
        this.roleAs = value;
        localStorage.setItem('STATE', 'true');
        localStorage.setItem('ROLE', this.roleAs);
        return of({ success: this.isLogin, role: this.roleAs });
      }
    
      logout() {
        this.isLogin = false;
        this.roleAs = '';
        localStorage.setItem('STATE', 'false');
        localStorage.setItem('ROLE', '');
        return of({ success: this.isLogin, role: '' });
      }
    
      isLoggedIn() {
        const loggedIn = localStorage.getItem('STATE');
        if (loggedIn == 'true')
          this.isLogin = true;
        else
          this.isLogin = false;
        return this.isLogin;
      }
    
      getRole() {
        this.roleAs = localStorage.getItem('ROLE');
        return this.roleAs;
      }
    
    }
```

### **AuthGuard Implementation**

AuthGuard.ts

To create a guard you should use angular-cli command. This can be like below.

Create auth-guard

n generate guard auth

The method that will run before each request to the router is the `CanActivate` interface method.

In this method we will check if the user is logged in and has a correct role.

checkUserLogin() method takes 2 parameters. These are `ActivatedRouteSnapshot` and  `url` .

We control the role stored in the value of the `data` object given to the router. If it has a correct role the method will return `true`, otherwise return false and navigate to `/home` route. 

```javascript
    @Injectable({
      providedIn: 'root'
    })
    export class AuthGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {
    
    
      constructor(private authService: AuthService, private router: Router) { }
    
      canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        let url: string = state.url;
        return this.checkUserLogin(next, url);
      }
      canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.canActivate(next, state);
      }
      canDeactivate(
        component: unknown,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return true;
      }
      canLoad(
        route: Route,
        segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return true;
      }
    
      checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
        if (this.authService.isLoggedIn()) {
          const userRole = this.authService.getRole();
          if (route.data.role && route.data.role.indexOf(userRole) === -1) {
            this.router.navigate(['/home']);
            return false;
          }
          return true;
        }
    
        this.router.navigate(['/home']);
        return false;
      }
    }
```

### **Routing Module Implementation**

We will provide the Routes object with information about the role. This process is simple. All you have to do is add a `guard` and add your `data`to the role.

Adding guard like below,
 `canActivate: [AuthGuard]`
You can give the role information that will access that page like below,

```json
    data: {
          role: 'ROLE_ADMIN'
     }`
```

routing-module.ts

```javascript
    const routes: Routes = [
    
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      {
        path: 'admin', component: AdminDashboardComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'user', component: UserDashboardComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_USER'
        }
      },
      { path: '**', component: NotFoundComponent }
    
    ];
    
    @NgModule({
      imports: [RouterModule.forRoot(routes)],
      exports: [RouterModule]
    })
    export class AppRoutingModule { }
```

With the above scenario, you can protect your routes based on role.

This is a very simple project to implement it.  I am adding a video showing how it works.

[Youtube Link](https://bit.ly/2VjzVzH)

The source code of the project on github. 

I hope you enjoy when reading.

Have a nice coding.

References

- [angular.io](https://angular.io/guide/router)
