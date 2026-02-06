// Quick test file to verify product categorization
import { supabase } from '@/lib/supabase/client'

async function testCategories() {
    const { data, error } = await supabase
        .from('products')
        .select('id, name, category, is_official_vendor')
        .limit(10)

    console.log('Products with categories:', data)
    console.log('Error:', error)
}

export { testCategories }
