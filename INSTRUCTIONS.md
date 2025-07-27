# React Router 7 + rr-next-routes Instructions

## Proje Yapısı

Bu proje **React Router 7** + **rr-next-routes** kullanıyor, Next.js App Router benzeri dosya tabanlı routing sistemi sağlıyor.

### Temel Bilgiler

1. **Framework**: React Router 7 (SPA mode, SSR: false)
2. **Routing Library**: `rr-next-routes` (Next.js App Router benzeri)
3. **UI Library**: HeroUI (NextUI'nin fork'u)
4. **Styling**: TailwindCSS v4
5. **State Management**: SWR + Zustand
6. **Icons**: Lucide React

### Dosya Yapısı ve Routing

```
src/pages/
├── layout.tsx                  # Root layout (tüm sayfalarda)
├── (auth)/
│   ├── login/page.tsx         # /login
│   └── register/page.tsx      # /register
├── (landing)/
│   ├── layout.tsx             # Landing layout
│   ├── page.tsx               # / (ana sayfa)
│   ├── navbar.tsx             # Landing navbar component
│   ├── footer.tsx             # Landing footer component
│   ├── salonlar/
│   │   ├── page.tsx           # /salonlar
│   │   └── [salonId]/page.tsx # /salonlar/:salonId
│   ├── favoriler/page.tsx     # /favoriler
│   └── randevularım/page.tsx  # /randevularım (redirect to /appointments)
├── appointments/
│   ├── index.tsx              # /appointments (randevu listesi)
│   └── new.tsx                # /appointments/new (yeni randevu)
├── dashboard/
│   ├── layout.tsx             # Dashboard layout
│   ├── page.tsx               # /dashboard
│   ├── users/page.tsx         # /dashboard/users
│   ├── analytics/page.tsx     # /dashboard/analytics
│   ├── revenue/page.tsx       # /dashboard/revenue
│   └── businesses/page.tsx    # /dashboard/businesses
└── admin/
    ├── layout.tsx             # Admin layout
    └── page.tsx               # /admin
```

### Kritik Routing Kuralları

#### 1. Dosya Adlandırma
- `page.tsx` → Route page component
- `layout.tsx` → Layout wrapper
- `[param]/page.tsx` → Dynamic route
- `(group)/` → Route grouping (URL'de görünmez)

#### 2. Navigation Yapısı
```tsx
// ✅ DOĞRU - React Router Link kullanımı
import { Link } from "react-router";

// HeroUI Button ile
<Button as={Link} to="/appointments/new">Randevu Al</Button>

// Direct Link
<Link to="/appointments">Randevularım</Link>

// ❌ YANLIŞ - href kullanmayın
<Button as={Link} href="/appointments">  // YANLIŞ!
```

#### 3. Programmatic Navigation
```tsx
// ✅ DOĞRU
import { useNavigate } from "react-router";

const navigate = useNavigate();
navigate("/appointments");

// ❌ YANLIŞ - router.push yok
import { useRouter } from "next/router";  // YANLIŞ!
```

#### 4. Redirects
```tsx
// ✅ DOĞRU - Loader ile redirect
import { redirect } from "react-router";

export function loader() {
  return redirect("/appointments");
}

// ❌ YANLIŞ - Component içinde redirect
export default function Page() {
  return <Redirect to="/appointments" />;  // YANLIŞ!
}
```

### Layout Hiyerarşisi

```
Root Layout (layout.tsx)
├── Landing Layout ((landing)/layout.tsx)
│   └── Landing Pages (/, /salonlar, etc.)
├── Dashboard Layout (dashboard/layout.tsx)
│   └── Dashboard Pages (/dashboard/*)
├── Admin Layout (admin/layout.tsx)
│   └── Admin Pages (/admin/*)
└── Appointments Pages (/appointments/*)
```

### Date Picker Kullanımı

HeroUI DatePicker için özel tip kullanımı:

```tsx
// ✅ DOĞRU
import { DateValue } from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";

const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);

<DatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  minValue={today(getLocalTimeZone())}
/>

// ❌ YANLIŞ
const [selectedDate, setSelectedDate] = useState<Date | null>(null);  // YANLIŞ!
```

### Component Import Yapısı

```tsx
// ✅ DOĞRU - HeroUI components
import {
  Button,
  Card,
  CardBody,
  Select,
  SelectItem
} from "@heroui/react";

// ✅ DOĞRU - React Router
import { Link, useNavigate, Outlet } from "react-router";

// ✅ DOĞRU - Icons
import { Calendar, User, MapPin } from "lucide-react";
```

### State Management

```tsx
// ✅ DOĞRU - SWR kullanımı
import useSWR from "swr";

const { data: appointments, mutate } = useSWR<{ items: Appointment[] }>(
  "/appointments",
  (url: string) => http.get(url).then((res) => res.data)
);

// ✅ DOĞRU - Zustand store
import { useAuthStore } from "~/store/auth-store";
```

### Type Definitions

Backend tiplerini kullan, custom interface tanımlama:

```tsx
// ✅ DOĞRU - Backend tiplerini import et
import type { Appointment, Business, Service } from "~/types";

// ❌ YANLIŞ - Custom interface tanımlama
interface CustomAppointment {  // YANLIŞ!
  id: string;
  // ...
}
```

### MVP Role System

```tsx
export enum UserRole {
  CUSTOMER = "CUSTOMER",           // Müşteri - randevu alabilir
  SALON_ADMIN = "SALON_ADMIN",     // Salon yöneticisi
  SALON_OWNER = "SALON_OWNER",     // Salon sahibi
  SUPER_ADMIN = "SUPER_ADMIN"      // Sistem yöneticisi
}
```

### Error Handling

```tsx
// ✅ DOĞRU - Toast ile hata gösterimi
import { toast } from "sonner";

try {
  await http.post("/appointments", data);
  toast.success("Randevu oluşturuldu!");
} catch (error) {
  toast.error("Hata oluştu");
}
```

### Önemli Hatalar ve Düzeltmeleri

1. **Date Picker Hatası**: `Date` yerine `DateValue` kullan
2. **Navigation Hatası**: `href` yerine `to` prop kullan
3. **Redirect Hatası**: Component render yerine loader kullan
4. **Import Hatası**: React Router'dan doğru modülleri import et
5. **Type Hatası**: Backend tiplerini kullan, custom tanımlama

### Development Commands

```bash
# Dev server
pnpm run dev

# Build
pnpm run build

# Lint
pnpm run lint

# Type check
pnpm run type-check
```

### Bu Instructions'ı Takip Et

- Her yeni sayfa oluştururken routing yapısını kontrol et
- Layout hiyerarşisini anla
- Navigation için doğru components kullan
- Type safety için backend tiplerini tercih et
- Date/Time işlemleri için HeroUI'nin gereksinimlerini takip et
