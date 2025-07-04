# Salon Randevu Sistemi - Gemini CLI Kılavuzu

Bu belge, Gemini CLI aracısının Salon Randevu Sistemi projesiyle daha verimli çalışabilmesi için gerekli bilgileri içermektedir.

## Proje Yapısı

Bu proje bir monorepo olup, [Turborepo](https://turbo.build/) ile yönetilmektedir. Ana uygulamalar `apps/` dizini altında bulunmaktadır:

- `apps/client`: React tabanlı frontend uygulaması.
- `apps/server`: NestJS tabanlı backend API uygulaması.

## Genel Komutlar (Kök Dizin)

Projenin kök dizininde çalıştırılabilecek ana komutlar `package.json` dosyasında tanımlanmıştır:

- `pnpm dev`: Hem client hem de server uygulamalarını geliştirme modunda başlatır.
- `pnpm build`: Hem client hem de server uygulamalarını üretim için derler.
- `pnpm lint`: Tüm projedeki lint kurallarını çalıştırır ve sorunları düzeltir.
- `pnpm format`: Tüm projedeki kod formatlama kurallarını çalıştırır.
- `pnpm check-types`: Tüm projedeki TypeScript tip kontrolünü yapar.
- `pnpm copy-env`: `.env` dosyasını `apps/client/.env` ve `apps/server/.env` konumlarına kopyalar. (Genellikle `predev`, `prebuild`, `prestart` script'leri tarafından otomatik olarak çalıştırılır.)

## Uygulama Bazında Komutlar

### `apps/client` (Frontend)

- **Teknoloji:** React, Tailwind CSS, heroui
- **Geliştirme:** `pnpm dev` (kök dizinden) veya `pnpm --filter client dev`
- **Derleme:** `pnpm build` (kök dizinden) veya `pnpm --filter client build`
- **Linting:** `pnpm lint` (kök dizinden) veya `pnpm --filter client lint`
- **Formatlama:** `pnpm format` (kök dizinden) veya `pnpm --filter client format`
- **Tip Kontrolü:** `pnpm type-check` (kök dizinden) veya `pnpm --filter client type-check`
- **Test:** Bu projede client tarafında özel bir test komutu tanımlanmamıştır.

### `apps/server` (Backend)

- **Teknoloji:** NestJS, Prisma (ORM), Vitest (Test)
- **Geliştirme:** `pnpm dev` (kök dizinden) veya `pnpm --filter server dev`
- **Derleme:** `pnpm build` (kök dizinden) veya `pnpm --filter server build`
- **Linting:** `pnpm lint` (kök dizinden) veya `pnpm --filter server lint`
- **Formatlama:** `pnpm format` (kök dizinden) veya `pnpm --filter server format`
- **Tip Kontrolü:** `pnpm type-check` (kök dizinden) veya `pnpm --filter server type-check`
- **Veritabanı İşlemleri:**
    - `pnpm --filter server db:generate`: Prisma client'ı oluşturur.
    - `pnpm --filter server db:push`: Veritabanı şemasını senkronize eder.
- **Test:**
    - `pnpm --filter server test`: Tüm testleri çalıştırır.
    - `pnpm --filter server test:watch`: Testleri izleme modunda çalıştırır.

## Kodlama Standartları ve Stil

- **Linting:** ESLint kuralları `eslint.config.ts` (client) ve `eslint.config.mjs` (server) dosyalarında tanımlanmıştır. `pnpm lint` komutu ile uygulanır.
- **Formatlama:** Prettier kuralları `.prettierrc` dosyasında tanımlanmıştır. `pnpm format` komutu ile uygulanır.
- **TypeScript:** Her iki uygulama da TypeScript kullanmaktadır. Tip kontrolü `pnpm check-types` komutu ile yapılır.

## Ek Notlar

- `.env` dosyası hassas bilgileri içerdiğinden, bu dosyanın içeriği doğrudan okunmamalı veya değiştirilmemelidir.
- `node_modules` ve `dist` dizinleri `.gitignore` tarafından göz ardı edilir ve versiyon kontrolüne dahil edilmez.
- `pnpm` paket yöneticisi kullanılmaktadır.
- `apps/client` uygulaması, dosya tabanlı yönlendirme için `rr-next-routes` kullanır. Bu, Next.js App Router'a benzer şekilde çalışır.
