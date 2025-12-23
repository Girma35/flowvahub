-- 1. Create Redeemables Table
CREATE TABLE IF NOT EXISTS public.redeemables (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text,
  cost integer NOT NULL,
  icon text,
  color_class text,
  status text DEFAULT 'available',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. Enable RLS
ALTER TABLE public.redeemables ENABLE ROW LEVEL SECURITY;

-- 3. Create Select Policy
CREATE POLICY "Anyone can view redeemables" ON public.redeemables FOR SELECT USING (true);

INSERT INTO public.redeemables (title, description, cost, icon, color_class, status)
VALUES 
('Apple Gift Card', 'Redeem for apps, games, music, movies, and more on the App Store and iTunes.', 500, 'fa-brands fa-apple', 'text-white', 'available'),
('Google Play Card', 'Use to purchase apps, games, movies, books, and more on the Google Play Store.', 1000, 'fa-brands fa-google-play', 'text-green-400', 'available'),
('Amazon Gift Card', 'Get a $5 digital gift card to spend on your favorite tools or platforms.', 500, 'fa-solid fa-cart-shopping', 'text-yellow-500', 'available'),
('Bank Transfer', 'The $5 equivalent will be transferred to your bank account.', 500, 'fa-solid fa-building-columns', 'text-blue-400', 'available'),
('PayPal International', 'Receive a $5 PayPal balance transfer directly to your PayPal account email.', 1000, 'fa-brands fa-paypal', 'text-blue-500', 'available'),
('Virtual Visa Card', 'Use your $5 prepaid card to shop anywhere Visa is accepted online.', 500, 'fa-brands fa-cc-visa', 'text-blue-300', 'available');
