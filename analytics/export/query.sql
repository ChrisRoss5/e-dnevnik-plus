SELECT
  event_timestamp,
  event_name,
  user_id,
  user_pseudo_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'sender') as sender,
  (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') as session_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_url') as page_url,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'school_name') as school_name,
  (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'class_year') as class_year,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'user_type') as user_type,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'id') as id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'ad_id') as ad_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'option') as option_name,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'event') as event,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'version') as version,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'previous_version') as previous_version,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'new_version') as new_version,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'error') as error
FROM `e-dnevnik-plus.analytics_465808061.events_*`
WHERE {where_clause}
