/*
OFFICIAL RECOMMENDATION:
https://developer.chrome.com/docs/extensions/how-to/integrate/google-analytics-4#debugging

MEASUREMENT PROTOCOL:
https://developers.google.com/analytics/devguides/collection/protocol/ga4

EXAMPLE FROM:
https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/tutorial.google-analytics/scripts/google-analytics.js

CONVERTED TO TYPESCRIPT & ADDED MORE PARAMS
*/

const GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";
const GA_DEBUG_ENDPOINT = "https://www.google-analytics.com/debug/mp/collect";

// Get via https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#recommended_parameters_for_reports
const MEASUREMENT_ID = "G-YM0ZN005N7";
const API_SECRET = "cuphSSrgSquPlU0oJl1Jww";
const DEFAULT_ENGAGEMENT_TIME_MSEC = 100;

// Duration of inactivity after which a new session is created
const SESSION_EXPIRATION_IN_MIN = 30;

class Analytics {
  private readonly useDebugEndpoint: boolean;
  private readonly useDebugMode: boolean;

  constructor(useDebugEndpoint = false, useDebugMode = false) {
    this.useDebugEndpoint = useDebugEndpoint;
    this.useDebugMode = useDebugMode;
  }

  // Returns the client id, or creates a new one if one doesn't exist.
  // Stores client id in local storage to keep the same client id as long as
  // the extension is installed.
  async getOrCreateClientId() {
    let { clientId } = await chrome.storage.local.get("clientId");
    if (!clientId) {
      // Generate a unique client ID, the actual value is not relevant
      clientId = self.crypto.randomUUID();
      await chrome.storage.local.set({ clientId });
    }
    return clientId;
  }

  // Returns the current session id, or creates a new one if one doesn't exist or
  // the previous one has expired.
  async getOrCreateSessionId() {
    // Use storage.session because it is only in memory
    // SESSION STORAGE IS NOT SUPPORTED IN CONTENT SCRIPTS
    let { sessionData } = await chrome.storage.session.get("sessionData");
    const currentTimeInMs = Date.now();
    // Check if session exists and is still valid
    if (sessionData?.timestamp) {
      // Calculate how long ago the session was last updated
      const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;
      // Check if last update lays past the session expiration threshold
      if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
        // Clear old session id to start a new session
        sessionData = null;
      } else {
        // Update timestamp to keep session alive
        sessionData.timestamp = currentTimeInMs;
        await chrome.storage.session.set({ sessionData });
      }
    }
    if (!sessionData) {
      // Create and store a new session
      sessionData = {
        session_id: currentTimeInMs.toString(),
        timestamp: currentTimeInMs.toString(),
      };
      await chrome.storage.session.set({ sessionData });
    }
    return sessionData.session_id;
  }

  // Fires an event with optional params. Event names must only include letters and underscores.
  async fireEvent(userId: string | null, name: string, params = {} as any) {
    // Configure session id and engagement time if not present, for more details see:
    // https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#recommended_parameters_for_reports
    if (!params.session_id)
      params.session_id = await this.getOrCreateSessionId();
    if (!params.engagement_time_msec)
      params.engagement_time_msec = DEFAULT_ENGAGEMENT_TIME_MSEC;
    if (this.useDebugMode) params.debug_mode = true; // ADDED THIS LINE

    try {
      if (this.useDebugMode) {
        console.log("Firing event: ", name, " for user ID: ", userId);
        console.log("Params:", params);
      }

      const response = await fetch(
        `${
          this.useDebugEndpoint ? GA_DEBUG_ENDPOINT : GA_ENDPOINT
        }?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
        {
          method: "POST",
          body: JSON.stringify({
            client_id: await this.getOrCreateClientId(),
            user_id: userId, // ADDED THIS LINE
            user_data: {}, // https://www.weltpixel.com/blog/post/google-analytics-4-how-to-fix-events-not-being-tracked-when-using-measurement-protocol
            events: [
              {
                name,
                params,
              },
            ],
          }),
        },
      );
      if (!this.useDebugEndpoint) return;
      console.log(await response.text());
    } catch (e) {
      console.error("Google Analytics request failed with an exception", e);
    }
  }
}

const analytics = new Analytics(false, false); // TODO before publishing: Set all params to false
