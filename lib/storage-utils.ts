import { supabase } from "./supabase";

export async function deleteImageFromStorage(imageUrl: string) {
  if (!imageUrl) return;

  try {
    // Determine the bucket and path from the URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    
    // Find the 'public' segment index
    const publicIndex = pathParts.indexOf('public');
    if (publicIndex === -1 || publicIndex + 2 >= pathParts.length) {
      console.warn("Could not parse storage URL:", imageUrl);
      return;
    }

    const bucket = pathParts[publicIndex + 1];
    // Join the rest of the path parts to get the file path
    const filePath = decodeURIComponent(pathParts.slice(publicIndex + 2).join('/'));

    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error("[Storage] Error deleting image:", error);
    } else {
      if (data && data.length === 0) {
        // Optional: warn if nothing was deleted, but don't spam success logs
        console.warn("[Storage] Warning: Supabase returned success but no files were reported as deleted. Check RLS policies.");
      }
    }
  } catch (error) {
    // Fail silently/gracefully so we don't block the main flow (e.g. updating profile)
    console.warn("Error processing deleteImageFromStorage (non-fatal):", error);
  }
}
