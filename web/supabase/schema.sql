-- CapTable AI — Full Database Schema
-- Run this in the Supabase SQL editor

-- businesses (one row per user)
CREATE TABLE businesses (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                     uuid REFERENCES auth.users UNIQUE NOT NULL,
  business_name               text NOT NULL,
  industry                    text,
  employees                   integer DEFAULT 0,
  annual_revenue              numeric DEFAULT 0,
  net_income                  numeric DEFAULT 0,
  ebit                        numeric DEFAULT 0,
  interest_expense            numeric DEFAULT 0,
  business_description        text,
  growth_story                text,
  competitive_moat            text,
  reason_for_sale             text,
  owner_role                  text,
  readiness_clean_books       integer DEFAULT 0,
  readiness_revenue_quality   integer DEFAULT 0,
  readiness_owner_independent integer DEFAULT 0,
  readiness_no_concentration  integer DEFAULT 0,
  readiness_growing           integer DEFAULT 0,
  anthropic_api_key           text,
  created_at                  timestamptz DEFAULT now(),
  updated_at                  timestamptz DEFAULT now()
);
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own" ON businesses FOR ALL USING (auth.uid() = user_id);

-- balance_sheet_items
CREATE TABLE balance_sheet_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users NOT NULL,
  name          text NOT NULL,
  category      text NOT NULL,
  value         numeric NOT NULL,
  type          text CHECK (type IN ('ASSET', 'LIABILITY')),
  interest_rate numeric DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);
ALTER TABLE balance_sheet_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own" ON balance_sheet_items FOR ALL USING (auth.uid() = user_id);

-- chat_history
CREATE TABLE chat_history (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users NOT NULL,
  role       text CHECK (role IN ('user', 'assistant')),
  content    text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own" ON chat_history FOR ALL USING (auth.uid() = user_id);

-- cap_table_entries
CREATE TABLE cap_table_entries (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  uuid REFERENCES auth.users NOT NULL,
  name                     text NOT NULL,
  share_class              text NOT NULL,
  shares_held              bigint NOT NULL,
  purchase_price_per_share numeric DEFAULT 0,
  created_at               timestamptz DEFAULT now()
);
ALTER TABLE cap_table_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own" ON cap_table_entries FOR ALL USING (auth.uid() = user_id);

-- due_diligence_checks
CREATE TABLE due_diligence_checks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users NOT NULL,
  item_key    text NOT NULL,
  is_complete boolean DEFAULT false,
  UNIQUE(user_id, item_key)
);
ALTER TABLE due_diligence_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own" ON due_diligence_checks FOR ALL USING (auth.uid() = user_id);

-- ebitda_add_backs
CREATE TABLE ebitda_add_backs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users NOT NULL,
  label      text NOT NULL,
  amount     numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE ebitda_add_backs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own" ON ebitda_add_backs FOR ALL USING (auth.uid() = user_id);

-- business_snapshots (daily financial snapshots for sparkline)
CREATE TABLE business_snapshots (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid REFERENCES auth.users NOT NULL,
  business_id    uuid REFERENCES businesses NOT NULL,
  annual_revenue numeric,
  net_income     numeric,
  ebit           numeric,
  health_score   integer,
  snapshot_date  date NOT NULL,
  created_at     timestamptz DEFAULT now(),
  UNIQUE(user_id, snapshot_date)
);
ALTER TABLE business_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own" ON business_snapshots FOR ALL USING (auth.uid() = user_id);
