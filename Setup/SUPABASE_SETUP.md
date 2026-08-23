# Supabase Setup Guide

## Overview
Your website is now connected to Supabase for database, authentication, and storage management. Both the `web` and `admin` projects share the same Supabase backend.

## Configuration

### 1. Get Your Supabase Credentials
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (ID: `tgzlgigkfmfsxyabvelk`)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon (public) Key** → `VITE_SUPABASE_ANON_KEY`

### 2. Update Environment Variables
Update `.env.local` files in both projects:

**web/.env.local**
```
VITE_SUPABASE_URL=https://tgzlgigkfmfsxyabvelk.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**admin/.env.local**
```
VITE_SUPABASE_URL=https://tgzlgigkfmfsxyabvelk.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Available Database Tables

### Products
- Display pottery and clay products
- Multilingual support (English, Hindi, Gujarati)
- Featured products support
- Category organization

### Categories
- Product categories with multilingual names

### Settings
- Business information (name, contact, social links)
- Business hours
- Address and location
- Logo and branding

### About Content
- Multilingual about/information sections
- Images and descriptions

### Gallery Images
- Gallery display with captions

### Testimonials
- Customer reviews and feedback
- Rating system
- Display order control

### Guides
- Multilingual guides and tutorials
- Clay care guides support

### Profiles
- User profiles linked to authentication
- Role-based access (admin/user)

### User Roles
- Granular role management for users

## Using Supabase in Your Code

### Web Project

**Import the Supabase client:**
```typescript
import { supabase } from '@/lib/supabase';
```

**Use pre-built queries:**
```typescript
import { 
  getProducts, 
  getFeaturedProducts, 
  getCategories,
  getSettings,
  getTestimonials,
  getGuides,
  signIn,
  signOut
} from '@/lib/supabase-queries';

// Fetch products
const products = await getProducts();

// Fetch featured products
const featured = await getFeaturedProducts();

// Authenticate
await signIn('user@example.com', 'password');
```

**Direct Supabase queries:**
```typescript
// Get all products with a specific category
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('category_id', categoryId);

// Insert a testimonial
const { data, error } = await supabase
  .from('testimonials')
  .insert([{
    customer_name: 'John',
    message: 'Great products!',
    rating: 5,
    is_active: false // Needs admin approval
  }]);
```

### Admin Project

Use the same approach:
```typescript
import { supabase } from '@/lib/supabase';

// Manage products
const { data, error } = await supabase
  .from('products')
  .update({ visible: true })
  .eq('id', productId);

// Upload images to storage
const { data, error } = await supabase.storage
  .from('product-images')
  .upload(`products/${filename}`, file);
```

## File Structure

```
web/
├── src/lib/
│   ├── supabase.ts           # Supabase client initialization
│   ├── supabase-queries.ts   # Pre-built utility functions
│   └── types.ts              # TypeScript types for database
└── .env.local                # Environment variables

admin/
├── src/lib/
│   ├── supabase.ts           # Supabase client initialization
│   └── types.ts              # TypeScript types for database
└── .env.local                # Environment variables
```

## Authentication

### Sign Up
```typescript
import { signUp } from '@/lib/supabase-queries';

await signUp('user@example.com', 'password');
```

### Sign In
```typescript
import { signIn } from '@/lib/supabase-queries';

const { data: { user } } = await signIn('user@example.com', 'password');
```

### Sign Out
```typescript
import { signOut } from '@/lib/supabase-queries';

await signOut();
```

### Get Current User
```typescript
import { getCurrentUser } from '@/lib/supabase-queries';

const user = await getCurrentUser();
```

## Storage (File Uploads)

Supabase supports file uploads for images:

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('product-images')
  .upload(`products/${filename}`, file);

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('product-images')
  .getPublicUrl(`products/${filename}`);
```

## Real-time Subscriptions

Subscribe to real-time changes:

```typescript
// Listen for product changes
supabase
  .from('products')
  .on('*', payload => {
    console.log('Change received!', payload)
  })
  .subscribe();
```

## Row Level Security (RLS)

Your database has RLS policies configured to:
- Allow public read access to visible products and content
- Allow authenticated users to manage their testimonials
- Restrict admin operations to admin users

## Next Steps

1. **Update `.env.local`** with your actual Supabase credentials
2. **Test the connection** by running the dev server
3. **Migrate data** if coming from another backend
4. **Configure RLS policies** for your specific use cases
5. **Set up storage buckets** for images in Supabase console

## Troubleshooting

### Missing Environment Variables
- Check `.env.local` files exist in both projects
- Ensure `VITE_` prefix is used (required by Vite)
- Restart dev server after changing env vars

### Connection Errors
- Verify Supabase URL and key are correct
- Check network connectivity
- Ensure Supabase project is active in console

### Type Errors
- Run `npm install` to ensure dependencies are up to date
- Check that `types.ts` is properly imported

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase React Guide](https://supabase.com/docs/guides/getting-started/quickstarts/react)
- [@supabase/supabase-js](https://github.com/supabase/supabase-js)
