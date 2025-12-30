# Role-Based Access Control (RBAC) Implementation

## Overview
This Smart Event Planner implements a comprehensive role-based access control system using Angular Guards and JWT authentication. Three role types are supported: **ATTENDEE**, **ORGANIZER**, and **ADMIN**.

---

## 1. Guard System Architecture

### Available Guards

#### **AttendeeGuard** 
`frontend/src/app/guards/attendee.guard.ts`

**Purpose:** Protects routes accessible to attendees and above (organizers, admins)

**Access Allowed:**
- ATTENDEE - View events, book tickets
- ORGANIZER - All attendee features + event management
- ADMIN - Full system access

**Validation Logic:**
```
1. Check if JWT token exists in localStorage
   ├─ NO → Redirect to /login → Return FALSE
   └─ YES → Continue to step 2

2. Extract role from JWT token using AuthService.getRole()
   ├─ Role exists? → Continue to step 3
   └─ NO role? → Try localStorage fallback → Continue to step 3

3. Check if role is 'attendee', 'organizer', or 'admin'
   ├─ YES → Return TRUE (Allow access)
   └─ NO → Redirect to /not-authorized → Return FALSE
```

**Protected Routes:**
- `/events` - Event list view
- `/events/:id` - Event details
- `/events/:id/book` - Ticket booking form
- `/booking-confirmation/:bookingId` - Booking confirmation

**Example:**
```typescript
canActivate(): boolean {
  const token = this.auth.getToken();
  if (!token) {
    this.router.navigate(['/login']);
    return false;
  }
  
  const role = this.auth.getRole();
  if (role && ['attendee', 'organizer', 'admin'].includes(role)) {
    return true;
  }
  
  this.router.navigate(['/not-authorized']);
  return false;
}
```

---

#### **OrganizerGuard**
`frontend/src/app/guards/organizer.guard.ts`

**Purpose:** Restricts routes to organizers and admins only

**Access Allowed:**
- ORGANIZER - Event creation/management
- ADMIN - Full system access

**Access Denied:**
- ATTENDEE - Redirected to /not-authorized

**Validation Logic:**
```
1. Check if JWT token exists
   ├─ NO → Redirect to /login → Return FALSE
   └─ YES → Continue to step 2

2. Extract role from JWT
   ├─ Role exists? → Continue to step 3
   └─ NO? → Try localStorage fallback → Continue to step 3

3. Check if role is 'organizer' or 'admin'
   ├─ YES → Return TRUE (Allow access)
   └─ NO → Redirect to /not-authorized → Return FALSE
```

**Protected Routes:**
- `/organizer/dashboard` - Event management dashboard

**Example Use:**
```typescript
const routes: Routes = [
  {
    path: 'organizer',
    component: OrganizerDashboardComponent,
    canActivate: [OrganizerGuard]
  }
];
```

---

#### **AdminGuard** (NEW)
`frontend/src/app/guards/admin.guard.ts`

**Purpose:** Restricts routes to admins only

**Access Allowed:**
- ADMIN - System administration

**Access Denied:**
- ATTENDEE - Redirected to /not-authorized
- ORGANIZER - Redirected to /not-authorized

**Validation Logic:**
```
1. Check if JWT token exists
   ├─ NO → Redirect to /login → Return FALSE
   └─ YES → Continue to step 2

2. Extract role from JWT
   ├─ Role is 'admin'? → Return TRUE (Allow access)
   └─ NO? → Redirect to /not-authorized → Return FALSE
```

**Future Protected Routes:**
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/analytics` - System analytics

**Ready for Implementation:**
```typescript
const routes: Routes = [
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard]
  }
];
```

---

## 2. Authentication Flow

### JWT Token Structure

```typescript
JWT Payload {
  sub: "user@example.com",
  role: "organizer",           // Stored as LOWERCASE
  iat: 1234567890,            // Issued at
  exp: 1234571490             // Expires in 2 hours
}
```

### Login Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ User visits http://localhost:4200                           │
├─────────────────────────────────────────────────────────────┤
│ 1. Root route "/" redirects to "/login"                     │
│    (AppRoutingModule checks root redirect)                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ LoginComponent displays login form                           │
│ User enters: email + password                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ AuthService.login(email, password) called                   │
│ POST /api/auth/login sent to backend                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Backend Auth Controller processes:                           │
│ 1. Find user by email in database                           │
│ 2. Compare password with bcrypt hash                        │
│ 3. Generate JWT with role from DB                           │
│ 4. Return token in response                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Frontend stores token:                                       │
│ localStorage.setItem('token', jwtToken)                     │
│ Extracts role: AuthService.getRole()                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Router.navigate(['/events'])                                │
│ User redirected to protected route                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ AttendeeGuard.canActivate() checks:                         │
│ 1. Token exists? YES ✓                                      │
│ 2. Role valid? YES (attendee/organizer/admin) ✓             │
│ 3. Return TRUE → Route allowed                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ EventListComponent loads                                     │
│ TokenInterceptor attaches Authorization header to requests: │
│ Authorization: Bearer {jwtToken}                            │
│ Backend validates token + processes request                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Route Protection Matrix

### Access Control by Role

| Route | Path | Component | Guard | ATTENDEE | ORGANIZER | ADMIN |
|-------|------|-----------|-------|----------|-----------|-------|
| Login | `/login` | LoginComponent | None | ✅ | ✅ | ✅ |
| Events List | `/events` | EventListComponent | AttendeeGuard | ✅ | ✅ | ✅ |
| Event Details | `/events/:id` | EventDetailsComponent | AttendeeGuard | ✅ | ✅ | ✅ |
| Book Ticket | `/events/:id/book` | TicketBookingComponent | AttendeeGuard | ✅ | ✅ | ✅ |
| Confirmation | `/booking-confirmation/:id` | BookingConfirmationComponent | AttendeeGuard | ✅ | ✅ | ✅ |
| **Organizer Dashboard** | **/organizer/dashboard** | **OrganizerDashboardComponent** | **OrganizerGuard** | ❌ | ✅ | ✅ |
| **Admin Panel** (Future) | **/admin/dashboard** | **AdminDashboardComponent** | **AdminGuard** | ❌ | ❌ | ✅ |
| Not Authorized | `/not-authorized` | NotAuthorizedComponent | None | ✅ | ✅ | ✅ |

### Behavior by Access Level

#### Scenario 1: Unauthenticated User Accessing Protected Route
```
User URL: http://localhost:4200/events
Guard Check: AttendeeGuard.canActivate()
  ├─ getToken() → null
  └─ Redirect to /login
Result: Login form displayed
```

#### Scenario 2: Attendee Accessing Organizer Route
```
User Role: ATTENDEE
User URL: http://localhost:4200/organizer/dashboard
Guard Check: OrganizerGuard.canActivate()
  ├─ getToken() → exists ✓
  ├─ getRole() → "attendee"
  ├─ Check: role === 'organizer' OR role === 'admin'? 
  ├─ Result: FALSE
  └─ Redirect to /not-authorized
Result: Not authorized page displayed
```

#### Scenario 3: Organizer Accessing Organizer Route
```
User Role: ORGANIZER
User URL: http://localhost:4200/organizer/dashboard
Guard Check: OrganizerGuard.canActivate()
  ├─ getToken() → exists ✓
  ├─ getRole() → "organizer"
  ├─ Check: role === 'organizer' OR role === 'admin'?
  ├─ Result: TRUE ✓
  └─ Continue to component
Result: OrganizerDashboardComponent loads
```

#### Scenario 4: Admin Accessing Any Route
```
User Role: ADMIN
Guard Check: Any Guard (AttendeeGuard, OrganizerGuard, AdminGuard)
Result: All checks pass (admin has all permissions)
```

---

## 4. Implementation Details

### AuthService Methods

**Location:** `frontend/src/app/services/auth.service.ts`

```typescript
// Get stored JWT token
getToken(): string | null {
  return localStorage.getItem('token');
}

// Extract role from JWT payload (decoded, no secret needed)
getRole(): string | null {
  const token = this.getToken();
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    return payload.role ? payload.role.toLowerCase() : null;
  } catch {
    return null;
  }
}

// Check if user is authenticated
isLoggedIn(): boolean {
  return !!this.getToken();
}

// Clear token on logout
logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  this.router.navigate(['/login']);
}
```

### TokenInterceptor

**Location:** `frontend/src/app/services/token.interceptor.ts`

**Purpose:** Automatically attach JWT to all HTTP requests

```typescript
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const token = this.auth.getToken();
  
  if (token) {
    // Clone request and add Authorization header
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next.handle(req);
}
```

**Behavior:**
- Runs on every HTTP request
- If token exists in localStorage, adds `Authorization: Bearer {token}` header
- Backend middleware validates token on protected routes
- If token invalid/expired, backend returns 401 (Unauthorized)

---

## 5. Backend Authorization Middleware

**Location:** `backend/src/middleware/auth.middleware.ts`

### authenticateJWT Middleware

```typescript
authenticateJWT(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }
  
  const token = authHeader.split(' ')[1]; // Extract from "Bearer {token}"
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    (req as any).user = decoded;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}
```

### authorizeRole Middleware

```typescript
authorizeRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    
    if (!user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    
    if (!roles.includes(user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    
    next();
  };
}
```

### Protected Endpoint Example

```typescript
// Only ORGANIZER or ADMIN can create events
router.post(
  '/',
  authenticateJWT,
  authorizeRole('ORGANIZER', 'ADMIN'),
  createEvent
);
```

---

## 6. Testing Role-Based Access

### Test Users

#### Attendee Account
```
Email: attendee@example.com
Password: Attendee@123
Role: ATTENDEE
```

**Can Access:**
- ✅ /events (event list)
- ✅ /events/{id} (event details)
- ✅ /events/{id}/book (booking form)
- ❌ /organizer/dashboard (redirects to /not-authorized)

**Test Flow:**
1. Login with attendee credentials
2. View event list
3. Click event to view details
4. Attempt to book tickets
5. Try accessing `/organizer/dashboard` → Should see "Not Authorized"

---

#### Organizer Account
```
Email: test@example.com
Password: Test@123
Role: ORGANIZER
```

**Can Access:**
- ✅ /events (event list - as attendee)
- ✅ /events/{id} (event details - as attendee)
- ✅ /events/{id}/book (booking form - as attendee)
- ✅ /organizer/dashboard (event management)

**Test Flow:**
1. Login with organizer credentials
2. Access organizer dashboard
3. Create new event with image
4. Edit/delete events
5. Should be able to book own events as well
6. View all event management features

---

### Test Case: Unauthorized Access

**Step 1:** Open browser DevTools (F12)
```javascript
// Clear token from localStorage
localStorage.removeItem('token');
localStorage.removeItem('userRole');
```

**Step 2:** Try accessing protected route
```
URL: http://localhost:4200/events
Result: Redirected to /login
```

**Step 3:** Try accessing organizer route while logged in as attendee
```
1. Login as attendee
2. URL: http://localhost:4200/organizer/dashboard
3. Guard redirects to /not-authorized
```

---

## 7. Role Hierarchy

```
┌─────────────────────────────────────┐
│          ADMIN (Highest)             │
│  Full system access, all features    │
└─────────────────────────────────────┘
            ▲
            │ (includes organizer permissions)
            │
┌─────────────────────────────────────┐
│       ORGANIZER (Mid-level)          │
│  Create/manage events, view bookings │
└─────────────────────────────────────┘
            ▲
            │ (includes attendee permissions)
            │
┌─────────────────────────────────────┐
│      ATTENDEE (Base level)           │
│   Browse/book events                 │
└─────────────────────────────────────┘
```

**Permission Inheritance:**
- ADMIN includes all ORGANIZER permissions + additional admin features
- ORGANIZER includes all ATTENDEE permissions + event management
- ATTENDEE has basic access (browse, book)

---

## 8. Future Enhancements

### Admin Panel Routes (Ready to Implement)

```typescript
{
  path: 'admin',
  canActivate: [AdminGuard],
  children: [
    {
      path: 'dashboard',
      component: AdminDashboardComponent
    },
    {
      path: 'users',
      component: UserManagementComponent
    },
    {
      path: 'analytics',
      component: AnalyticsComponent
    }
  ]
}
```

### Admin Features
- User management (create/edit/delete users, assign roles)
- System analytics and reporting
- Event moderation
- Payment/booking management
- System configuration

---

## 9. Security Considerations

### Token Management
- ✅ JWT stored in localStorage (persist across page refresh)
- ✅ Token expiration set to 2 hours
- ✅ Role extracted from JWT (no tampering without secret key)
- ⚠️ LocalStorage accessible to XSS attacks - consider sessionStorage for higher security

### Password Security
- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ Never stored or transmitted in plain text
- ✅ Backend validates password match during login

### Route Protection
- ✅ All sensitive routes protected by guards
- ✅ Backend validates token + role on every request
- ✅ Unauthorized access returns appropriate redirect/error

### File Upload Security
- ✅ Multer validates MIME types (image/* only)
- ✅ Files stored outside web root for serving via Express static
- ✅ Filename sanitized with timestamp to prevent collisions

---

## 10. Configuration Summary

### Environment Variables

**Backend (.env):**
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Manasa.07
DB_NAME=smart_event_planner
JWT_SECRET=your-secret-key-here
PORT=5000
```

**Frontend (environment.ts):**
```typescript
export const environment = {
  apiUrl: 'http://localhost:5000/api'
};
```

### Ports
- Backend API: `http://localhost:5000`
- Frontend App: `http://localhost:4200`
- Image Upload: `http://localhost:5000/uploads/{path}`

---

## Summary

The Smart Event Planner now implements comprehensive role-based access control through:

1. **Three Guard Types:** AttendeeGuard, OrganizerGuard, AdminGuard
2. **JWT Authentication:** Token-based auth with role extraction
3. **Token Interceptor:** Automatic JWT attachment to all HTTP requests
4. **Protected Routes:** All sensitive routes require appropriate role
5. **Backend Validation:** Server-side authorization on protected endpoints
6. **Test Users:** Ready-to-use accounts for testing each role

Users can now securely access features based on their assigned roles, with proper redirects for unauthorized access attempts.
