import { createClient } from '@supabase/supabase-js';
import { SubPage } from './newsletterData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Safely verify if Supabase is fully configured
export const isSupabaseConfigured = 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '' &&
  supabaseUrl !== 'YOUR_SUPABASE_URL' &&
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-api-key-string...';

// Initialize the client only if configured, otherwise provide a proxy or null to avoid runtime crashes
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch newsletter pages dynamically from Supabase, joining newsletters and page_contents tables.
 * Returns null if not configured or query fails.
 */
export async function fetchNewsletterPages(): Promise<SubPage[] | null> {
  if (!supabase) return null;

  try {
    // We adjust the selected columns and relation fields according to the actual Supabase database schema
    const { data, error } = await supabase
      .from('sub_pages')
      .select(`
        id,
        newsletter_id,
        page_number,
        title,
        category,
        layout_settings,
        newsletters (
          id,
          municipality_name,
          issue_number,
          publish_date,
          cover_image_url
        ),
        page_contents (
          id,
          page_id,
          sort_order,
          content_type,
          body_text
        )
      `)
      .order('page_number', { ascending: true });

    if (error) {
      console.warn('Supabase fetchNewsletterPages failed:', error);
      return null;
    }

    if (!data || data.length === 0) return null;

    // Hard-code to unconditionally grab the first row from the table
    const firstRowData = [data[0]];

    // Format the database layout into the UI model
    const formattedData = firstRowData.map((subPage) => {
      const dbContents = subPage.page_contents || [];
      // Sort page contents by sort_order
      dbContents.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
      
      // Map body_text to body to keep interface compatibility
      const pageContents = dbContents.map((content: any) => ({
        id: String(content.id),
        sub_page_id: content.page_id,
        body: content.body_text || '',
        sort_order: content.sort_order || 0
      }));

      // Map newsletters information (handles case where Supabase returns relation as an array)
      const dbNewsletterRaw = subPage.newsletters;
      const dbNewsletter = Array.isArray(dbNewsletterRaw)
        ? dbNewsletterRaw[0]
        : dbNewsletterRaw;

      const newsletter = dbNewsletter ? {
        id: dbNewsletter.id,
        title: dbNewsletter.municipality_name || '',
        description: `${dbNewsletter.issue_number || ''} · ${dbNewsletter.publish_date || ''}`
      } : null;

      return {
        id: subPage.id,
        newsletter_id: subPage.newsletter_id,
        title: subPage.title || '',
        page_number: subPage.page_number || 1,
        category: subPage.category || '',
        newsletters: newsletter,
        page_contents: pageContents
      };
    });

    return formattedData as SubPage[];
  } catch (err) {
    console.error('Supabase fetchNewsletterPages connection error:', err);
    return null;
  }
}
