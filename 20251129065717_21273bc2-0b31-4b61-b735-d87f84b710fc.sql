-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create staff table
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create invoice services table
CREATE TABLE public.invoice_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) NOT NULL,
  staff_id UUID REFERENCES public.staff(id),
  base_price DECIMAL(10,2) NOT NULL,
  discount_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  final_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.invoice_services ENABLE ROW LEVEL SECURITY;

-- Create invoice products table
CREATE TABLE public.invoice_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.invoice_products ENABLE ROW LEVEL SECURITY;

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  payment_mode TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create salon settings table
CREATE TABLE public.salon_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_name TEXT NOT NULL DEFAULT 'Elegant Salon',
  branch_address TEXT NOT NULL DEFAULT '123 Beauty Street',
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.salon_settings ENABLE ROW LEVEL SECURITY;

-- Insert default salon settings
INSERT INTO public.salon_settings (salon_name, branch_address) 
VALUES ('Elegant Salon', '123 Beauty Street, City');

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Security definer function to check if user has any role
CREATE OR REPLACE FUNCTION public.is_staff_or_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for staff
CREATE POLICY "Staff and admins can view staff"
  ON public.staff FOR SELECT
  USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Admins can manage staff"
  ON public.staff FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for services
CREATE POLICY "Staff and admins can view services"
  ON public.services FOR SELECT
  USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for products
CREATE POLICY "Staff and admins can view products"
  ON public.products FOR SELECT
  USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for invoices
CREATE POLICY "Staff and admins can view invoices"
  ON public.invoices FOR SELECT
  USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and admins can create invoices"
  ON public.invoices FOR INSERT
  WITH CHECK (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Admins can manage invoices"
  ON public.invoices FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for invoice_services
CREATE POLICY "Staff and admins can view invoice services"
  ON public.invoice_services FOR SELECT
  USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and admins can create invoice services"
  ON public.invoice_services FOR INSERT
  WITH CHECK (public.is_staff_or_admin(auth.uid()));

-- RLS Policies for invoice_products
CREATE POLICY "Staff and admins can view invoice products"
  ON public.invoice_products FOR SELECT
  USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and admins can create invoice products"
  ON public.invoice_products FOR INSERT
  WITH CHECK (public.is_staff_or_admin(auth.uid()));

-- RLS Policies for payments
CREATE POLICY "Staff and admins can view payments"
  ON public.payments FOR SELECT
  USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and admins can create payments"
  ON public.payments FOR INSERT
  WITH CHECK (public.is_staff_or_admin(auth.uid()));

-- RLS Policies for salon_settings
CREATE POLICY "Staff and admins can view salon settings"
  ON public.salon_settings FOR SELECT
  USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Admins can update salon settings"
  ON public.salon_settings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_salon_settings_updated_at
  BEFORE UPDATE ON public.salon_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();