# Supabase Backend Migration Guide
## Nairobi City County Inspectorate Management System

This document explains how to migrate the system from localStorage to Supabase backend.

## Current Status
✅ **Frontend**: Fully functional with localStorage
⏳ **Backend**: Ready for Supabase migration
🔧 **Service Layer**: Abstraction layer created (`src/app/services/backend.ts`)

## Step 1: Connect Supabase

1. Open **Make settings page**
2. Navigate to the **Supabase** section
3. Click **"Connect Supabase Project"**
4. Follow the prompts to link your Supabase account
5. Click **"Deploy Edge Function"** to create the server files

This will automatically generate:
- `utils/supabase/info.tsx` - Project ID and API keys
- `supabase/functions/server/index.tsx` - Hono server
- `supabase/functions/server/kv_store.tsx` - Key-value operations

## Step 2: Create Database Schema

Run this SQL in your Supabase SQL Editor:

\`\`\`sql
-- Employees Table
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  department TEXT NOT NULL,
  position TEXT NOT NULL,
  date_joined DATE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Records Table
CREATE TABLE daily_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  staff_name TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  activity TEXT NOT NULL,
  findings TEXT NOT NULL,
  action_taken TEXT NOT NULL,
  status TEXT CHECK (status IN ('Pending', 'Completed', 'Follow-up Required')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admins Table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approved Payroll Numbers Table
CREATE TABLE approved_payrolls (
  payroll_number TEXT PRIMARY KEY,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE approved_payrolls ENABLE ROW LEVEL SECURITY;

-- Create Policies (Allow all for now - refine based on auth requirements)
CREATE POLICY "Enable all for employees" ON employees FOR ALL USING (true);
CREATE POLICY "Enable all for daily_records" ON daily_records FOR ALL USING (true);
CREATE POLICY "Enable all for admins" ON admins FOR ALL USING (true);
CREATE POLICY "Enable all for approved_payrolls" ON approved_payrolls FOR ALL USING (true);

-- Insert default data
INSERT INTO admins (username, password, full_name) VALUES
('admin', 'admin123', 'Chief Inspectorate Officer');

INSERT INTO approved_payrolls (payroll_number) VALUES
('NCC2024001'), ('NCC2024002'), ('NCC2024003'), ('NCC2024004'), ('NCC2024005'),
('NCC2023101'), ('NCC2023102'), ('NCC2023103'), ('NCC2023104'), ('NCC2023105');

-- Create indexes for performance
CREATE INDEX idx_employees_payroll ON employees(payroll_number);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_daily_records_staff ON daily_records(staff_id);
CREATE INDEX idx_daily_records_date ON daily_records(date);
\`\`\`

## Step 3: Implement Backend API Endpoints

Update `supabase/functions/server/index.tsx`:

\`\`\`typescript
import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Employee Endpoints
app.get('/make-server-b377c14e/employees', async (c) => {
  const { data, error } = await supabase.from('employees').select('*');
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

app.post('/make-server-b377c14e/employees', async (c) => {
  const employee = await c.req.json();
  const { data, error } = await supabase.from('employees').insert([employee]).select();
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ success: true, employee: data[0] });
});

app.put('/make-server-b377c14e/employees/:id', async (c) => {
  const id = c.req.param('id');
  const updates = await c.req.json();
  const { error } = await supabase.from('employees').update(updates).eq('id', id);
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ success: true });
});

app.delete('/make-server-b377c14e/employees/:id', async (c) => {
  const id = c.req.param('id');
  const { error } = await supabase.from('employees').delete().eq('id', id);
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ success: true });
});

// Daily Records Endpoints
app.get('/make-server-b377c14e/records', async (c) => {
  const { data, error } = await supabase.from('daily_records').select('*');
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

app.post('/make-server-b377c14e/records', async (c) => {
  const record = await c.req.json();
  const { data, error } = await supabase.from('daily_records').insert([record]).select();
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ success: true, record: data[0] });
});

// Analytics Endpoints
app.get('/make-server-b377c14e/analytics/departments', async (c) => {
  const { data, error } = await supabase
    .from('employees')
    .select('department');

  if (error) return c.json({ error: error.message }, 500);

  const counts = data.reduce((acc: any, { department }) => {
    acc[department] = (acc[department] || 0) + 1;
    return acc;
  }, {});

  const result = Object.entries(counts).map(([name, value]) => ({ name, value }));
  return c.json(result);
});

Deno.serve(app.fetch);
\`\`\`

## Step 4: Enable Supabase in Frontend

In `src/app/services/backend.ts`, change:

\`\`\`typescript
const USE_SUPABASE = true; // Changed from false
\`\`\`

## Step 5: Migrate Existing Data (Optional)

If you have data in localStorage that needs to be migrated:

1. Export data from browser console:
\`\`\`javascript
console.log(JSON.stringify({
  staff: JSON.parse(localStorage.getItem('staff')),
  records: JSON.parse(localStorage.getItem('dailyRecords'))
}));
\`\`\`

2. Use Supabase Dashboard to bulk import the data

## Features Ready for Supabase

✅ Employee CRUD operations
✅ CSV bulk import
✅ Daily records management
✅ Analytics and reporting
✅ Role-based access control
✅ DataGrid with inline editing
✅ Pie chart visualizations

## Security Considerations

⚠️ **IMPORTANT**: This system currently stores passwords in plain text. For production:

1. Implement proper password hashing (bcrypt/argon2)
2. Use Supabase Auth for authentication
3. Implement proper RLS (Row Level Security) policies
4. Add API key validation
5. Implement rate limiting
6. Use HTTPS only
7. Regular security audits

## Testing Backend

After Supabase is connected:

1. Test employee creation from Employee Management tab
2. Verify CSV import functionality
3. Check pie charts in Reports tab
4. Test inline editing in DataGrid
5. Verify role-based access (Admin vs Staff)

## Support

For issues or questions:
- Check Supabase logs in Make settings
- Review server logs for errors
- Verify database connections
- Check API endpoint responses

---

**Note**: Make is not intended for production systems handling PII or sensitive data. This is a prototype for demonstration purposes.
