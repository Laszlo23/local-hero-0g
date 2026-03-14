
-- NFT Drops table - represents drops left by users for others to find
CREATE TABLE public.nft_drops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_device_id text NOT NULL,
  claimer_device_id text,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  drop_type text NOT NULL DEFAULT 'token', -- 'token', 'nft', 'seed_phrase', 'mystery_box'
  content_encrypted text NOT NULL DEFAULT '', -- encrypted payload (seed phrase, token amount, etc.)
  token_amount integer NOT NULL DEFAULT 0,
  nft_metadata jsonb DEFAULT '{}',
  latitude double precision,
  longitude double precision,
  qr_code text UNIQUE, -- QR identifier for physical drops
  chain_tx_hash text, -- on-chain transaction hash once deployed
  chain_contract_address text, -- smart contract address
  chain_token_id text, -- NFT token ID on chain
  chain_network text NOT NULL DEFAULT '0g-chain',
  status text NOT NULL DEFAULT 'active', -- 'active', 'claimed', 'expired', 'pending_mint'
  expires_at timestamptz,
  claimed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.nft_drops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active drops" ON public.nft_drops FOR SELECT USING (true);
CREATE POLICY "Anyone can create drops" ON public.nft_drops FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update drops" ON public.nft_drops FOR UPDATE USING (true);

-- Index for QR lookups
CREATE INDEX idx_nft_drops_qr ON public.nft_drops(qr_code);
CREATE INDEX idx_nft_drops_status ON public.nft_drops(status);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.nft_drops;
