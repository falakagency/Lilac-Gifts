import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ewebjuscuiwzooeqhnwc.supabase.co";
const supabaseKey = "sb_publishable_7fOaKDn7X9Y5T1wxAQekUQ_RtcYavfI";

export const supabase = createClient(supabaseUrl, supabaseKey);

export const PRODUCTS_BUCKET = "products";

export type DbCategory = {
  id: number;
  name: string;
  icon: string | null;
};

export type DbProduct = {
  id: number;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  gallery: string[] | null;
  category_id: number | null;
  bestseller: boolean | null;
  rating: number | null;
  reviews: number | null;
  created_at?: string;
};
