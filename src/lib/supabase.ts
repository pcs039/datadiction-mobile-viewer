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
 * Fetch newsletter pages dynamically from Supabase filtered by municipality slug,
 * joining newsletters and page_contents tables.
 * Returns null if not configured or query fails.
 */
export async function fetchNewsletterPages(municipalityId: string): Promise<SubPage[] | null> {
  if (!supabase) return null;

  const nameMap: Record<string, string> = {
    haenam: '해남군',
    wando: '완도군',
    jindo: '진도군'
  };
  const dbName = nameMap[municipalityId.toLowerCase()] || '해남군';

  try {
    const { data, error } = await supabase
      .from('sub_pages')
      .select(`
        id,
        newsletter_id,
        page_number,
        title,
        category,
        layout_settings,
        newsletters!inner (
          id,
          municipality_name,
          issue_number,
          publish_date,
          cover_image_url,
          status
        ),
        page_contents (
          id,
          page_id,
          sort_order,
          content_type,
          body_text
        )
      `)
      .eq('newsletters.municipality_name', dbName)
      .order('page_number', { ascending: true });

    if (error) {
      console.warn(`Supabase fetchNewsletterPages for ${dbName} failed:`, error);
      return null;
    }

    if (!data || data.length === 0) return null;

    // Format the database layout into the UI model
    const formattedData = (data as any[]).map((subPage) => {
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
        description: `${dbNewsletter.issue_number || ''} · ${dbNewsletter.publish_date || ''}`,
        status: dbNewsletter.status || 'PENDING'
      } : null;

      return {
        id: subPage.id,
        newsletter_id: subPage.newsletter_id,
        title: subPage.title || '',
        page_number: subPage.page_number || 1,
        category: subPage.category || '',
        newsletters: newsletter,
        page_contents: pageContents,
        municipality_slug: municipalityId.toLowerCase()
      };
    });

    return formattedData as SubPage[];
  } catch (err) {
    console.error('Supabase fetchNewsletterPages connection error:', err);
    return null;
  }
}

/**
 * Update the status of a newsletter to 'APPROVED' in Supabase.
 * Returns true if successful, false if it fails or is not configured.
 */
export async function approveNewsletter(newsletterId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('newsletters')
      .update({ status: 'APPROVED' })
      .eq('id', newsletterId);

    if (error) {
      console.warn("Supabase approveNewsletter failed:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase approveNewsletter connection error:", err);
    return false;
  }
}

/**
 * Insert a new newsletter page and related contents into Supabase.
 * Returns true if successful, false on error.
 */
export async function createNewsletterPage(pageData: {
  municipalityId: string;
  issueNumber: string;
  publishDate: string;
  pageNumber: number;
  category: string;
  title: string;
  body: string;
  youtubeUrl?: string;
  attractionName?: string;
  attractionPhone?: string;
}): Promise<boolean> {
  if (!supabase) return false;

  const nameMap: Record<string, string> = {
    haenam: '해남군',
    wando: '완도군',
    jindo: '진도군'
  };
  const dbName = nameMap[pageData.municipalityId.toLowerCase()] || '해남군';

  try {
    // 1. Find or Insert Newsletter Issue
    let newsletterId = '';
    
    const { data: existingNewsletters, error: selectErr } = await supabase
      .from('newsletters')
      .select('id')
      .eq('municipality_name', dbName)
      .eq('issue_number', pageData.issueNumber)
      .limit(1);

    if (selectErr) {
      console.warn("Supabase find newsletter failed, trying to insert:", selectErr);
    }

    if (existingNewsletters && existingNewsletters.length > 0) {
      newsletterId = existingNewsletters[0].id;
    } else {
      // Insert new newsletter
      const { data: newNewsletter, error: insertNewsErr } = await supabase
        .from('newsletters')
        .insert({
          municipality_name: dbName,
          issue_number: pageData.issueNumber,
          publish_date: pageData.publishDate
        })
        .select('id')
        .single();

      if (insertNewsErr) {
        console.error("Supabase insert newsletter failed:", insertNewsErr);
        return false;
      }
      newsletterId = newNewsletter.id;
    }

    // 2. Insert SubPage
    const { data: newSubPage, error: insertSubErr } = await supabase
      .from('sub_pages')
      .insert({
        newsletter_id: newsletterId,
        page_number: pageData.pageNumber,
        title: pageData.title,
        category: pageData.category
      })
      .select('id')
      .single();

    if (insertSubErr) {
      console.error("Supabase insert sub_pages failed:", insertSubErr);
      return false;
    }
    const pageId = newSubPage.id;

    // 3. Prepare Page Contents
    const contentsToInsert: any[] = [];
    let sortOrder = 1;

    // Add main body paragraph(s)
    const paragraphs = pageData.body.split('\n\n').filter(p => p.trim() !== '');
    paragraphs.forEach((p) => {
      contentsToInsert.push({
        page_id: pageId,
        sort_order: sortOrder++,
        content_type: 'text',
        body_text: p.trim()
      });
    });

    // Add YouTube link paragraph (if provided)
    if (pageData.youtubeUrl && pageData.youtubeUrl.trim() !== '') {
      contentsToInsert.push({
        page_id: pageId,
        sort_order: sortOrder++,
        content_type: 'video',
        body_text: `기관 공식 유튜브 동영상 링크:\n• 동영상: ${pageData.youtubeUrl.trim()}`
      });
    }

    // Add Local Attraction paragraph (if provided)
    if (pageData.attractionName && pageData.attractionName.trim() !== '') {
      const attractionPhoneText = pageData.attractionPhone ? `\n• 연락처: ${pageData.attractionPhone.trim()}` : '';
      contentsToInsert.push({
        page_id: pageId,
        sort_order: sortOrder++,
        content_type: 'widget',
        body_text: `지역 추천 관광 명소 가이드:\n• 명소: ${pageData.attractionName.trim()}${attractionPhoneText}`
      });
    }

    // 4. Insert Page Contents
    const { error: insertContentsErr } = await supabase
      .from('page_contents')
      .insert(contentsToInsert);

    if (insertContentsErr) {
      console.error("Supabase insert page_contents failed:", insertContentsErr);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Supabase createNewsletterPage connection error:", err);
    return false;
  }
}


