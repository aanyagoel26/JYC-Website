-- V58.0.5: the trigger is internal; no API role needs EXECUTE.
revoke execute on function public.jyc_guard_media_album_publication() from authenticated;