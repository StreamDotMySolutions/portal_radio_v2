# Portal Radio v2 Memory Index

## Key Patterns & Solutions

### [FormData _method Override Pattern](memory/formdata_method_override.md)
Correct pattern for sending file uploads with PUT/PATCH requests. Use POST with `_method=PUT` field in FormData. Applied to Station and ChatUser updates.

### [Station Edit FormData Fix](memory/fix_station_edit_formdata.md)
Fixed Edit modal not saving any fields. Changed from direct PUT to POST with `_method=PUT` override for FormData compatibility.

## Station CMS (2026-03-11)
Full Station CMS with Laravel backend and React admin panel. Flat model with user ownership, category enum, social URLs, and activity logging.

## Mini Audio Player (2026-03-09)
Added inline mini audio player to station grid cards. Shared HLS streaming with animated audio bars when playing.

## Livestream Management & Analytics (2026-03-12)
Complete livestream management system with analytics tracking. Global Settings model for configuration extensibility.
