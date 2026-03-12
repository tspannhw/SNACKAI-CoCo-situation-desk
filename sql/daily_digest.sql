-- ============================================
-- Daily Email Digest for Situation Desk
-- Database: DEMO.DEMO
--
-- This script creates the infrastructure for
-- automated daily OSINT digest emails.
--
-- Prerequisites:
--   - EMAIL_INTEGRATION notification integration
--   - INGEST warehouse (or modify WAREHOUSE clause)
--   - Tables: TRAVELADVISORIES, NOAAWEATHER, NYCTRAFFIC,
--             SERVICEALERTS, AIRQUALITY2, CRYPTO, ADSB_AIRCRAFT_DATA,
--             THERMAL_SENSOR_DATA, MESHTASTIC_DATA
--
-- Usage:
--   1. Run this script to create all objects
--   2. Add subscribers: INSERT INTO DIGEST_SUBSCRIBERS (EMAIL, NAME) VALUES ('you@email.com', 'Your Name');
--   3. Resume the task: ALTER TASK DAILY_DIGEST_TASK RESUME;
--   4. Or run manually: CALL GENERATE_DAILY_DIGEST();
-- ============================================

-- Subscriber configuration table
CREATE TABLE IF NOT EXISTS DEMO.DEMO.DIGEST_SUBSCRIBERS (
    EMAIL VARCHAR(255) NOT NULL PRIMARY KEY,
    NAME VARCHAR(255),
    IS_ACTIVE BOOLEAN DEFAULT TRUE,
    CREATED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

COMMENT ON TABLE DEMO.DEMO.DIGEST_SUBSCRIBERS IS 'Email subscribers for the daily OSINT digest';

-- Stored procedure to generate and send digest
CREATE OR REPLACE PROCEDURE DEMO.DEMO.GENERATE_DAILY_DIGEST()
RETURNS VARCHAR
LANGUAGE SQL
AS
$$
DECLARE
    email_body VARCHAR;
    recipient_list VARCHAR;
    travel_section VARCHAR;
    weather_section VARCHAR;
    traffic_section VARCHAR;
    transit_section VARCHAR;
    airquality_section VARCHAR;
    crypto_section VARCHAR;
    aviation_section VARCHAR;
    thermal_section VARCHAR;
    meshtastic_section VARCHAR;
    digest_date VARCHAR;
BEGIN
    -- Get current date for header
    digest_date := TO_CHAR(CURRENT_DATE(), 'Month DD, YYYY');
    
    -- Build Travel Advisories section (Level 3-4 warnings)
    SELECT COALESCE(LISTAGG('<li><b>' || TITLE || '</b></li>', '') WITHIN GROUP (ORDER BY TITLE), '<li>No high-risk advisories</li>')
    INTO :travel_section
    FROM (SELECT TITLE FROM DEMO.DEMO.TRAVELADVISORIES WHERE CATEGORY LIKE '%Level 4%' OR CATEGORY LIKE '%Level 3%' LIMIT 10);
    
    -- Build Weather section (latest reading per station) with dates
    -- OBSERVATION_TIME_RFC822 is VARCHAR in RFC822 format
    SELECT COALESCE(LISTAGG('<li>' || LOCATION || ': ' || WEATHER || ', ' || TEMPERATURE_STRING || ' <span style="color:#666;font-size:12px;">(' || OBS_DATE || ')</span></li>', '') WITHIN GROUP (ORDER BY LOCATION), '<li>No weather data available</li>')
    INTO :weather_section
    FROM (
        SELECT LOCATION, WEATHER, TEMPERATURE_STRING, TO_CHAR(TRY_TO_TIMESTAMP_TZ(OBSERVATION_TIME_RFC822, 'DY, DD MON YYYY HH24:MI:SS TZHTZM'), 'Mon DD HH24:MI') AS OBS_DATE
        FROM DEMO.DEMO.NOAAWEATHER
        WHERE OBSERVATION_TIME_RFC822 IS NOT NULL
        QUALIFY ROW_NUMBER() OVER (PARTITION BY STATION_ID ORDER BY OBSERVATION_TIME_RFC822 DESC) = 1
        LIMIT 8
    );
    
    -- Build Traffic section (congested links) with dates
    -- DATA_AS_OF is VARCHAR in ISO format (2025-05-28T21:09:03.000)
    SELECT COALESCE(LISTAGG('<li>' || BOROUGH || ' - ' || LINK_NAME || ': ' || SPEED || ' mph <span style="color:#666;font-size:12px;">(' || TRAFFIC_DATE || ')</span></li>', '') WITHIN GROUP (ORDER BY BOROUGH), '<li>No traffic data available</li>')
    INTO :traffic_section
    FROM (
        SELECT BOROUGH, LINK_NAME, SPEED, TO_CHAR(TRY_TO_TIMESTAMP(DATA_AS_OF), 'Mon DD HH24:MI') AS TRAFFIC_DATE
        FROM DEMO.DEMO.NYCTRAFFIC
        WHERE STATUS != 0
        QUALIFY ROW_NUMBER() OVER (PARTITION BY LINK_ID ORDER BY DATA_AS_OF DESC) = 1
        LIMIT 8
    );
    
    -- Build Transit Alerts section with dates
    -- TS is TEXT containing epoch milliseconds
    SELECT COALESCE(LISTAGG('<li>' || ROUTE || ': ' || ALERT_TEXT || ' <span style="color:#666;font-size:12px;">(' || ALERT_DATE || ')</span></li>', '') WITHIN GROUP (ORDER BY TS DESC), '<li>No active transit alerts</li>')
    INTO :transit_section
    FROM (
        SELECT COALESCE(ROUTEID, 'System') AS ROUTE, LEFT(COALESCE(ALERTTEXT, DESCRIPTIONTEXT, 'Service alert'), 100) AS ALERT_TEXT, TS, TO_CHAR(TO_TIMESTAMP(TS::NUMBER, 3), 'Mon DD HH24:MI') AS ALERT_DATE
        FROM DEMO.DEMO.SERVICEALERTS
        WHERE ALERTTEXT IS NOT NULL OR DESCRIPTIONTEXT IS NOT NULL
        LIMIT 8
    );
    
    -- Build Air Quality section with dates
    SELECT COALESCE(LISTAGG('<li>' || REPORTINGAREA || ', ' || STATECODE || ': AQI ' || AQI || ' (' || CATEGORYNAME || ') <span style="color:#666;font-size:12px;">(' || AQ_DATE || ')</span></li>', '') WITHIN GROUP (ORDER BY AQI DESC), '<li>No air quality data available</li>')
    INTO :airquality_section
    FROM (
        SELECT REPORTINGAREA, STATECODE, AQI, CATEGORYNAME, DATEOBSERVED || ' ' || LPAD(HOUROBSERVED, 2, '0') || ':00' AS AQ_DATE
        FROM DEMO.DEMO.AIRQUALITY2
        QUALIFY ROW_NUMBER() OVER (PARTITION BY REPORTINGAREA, STATECODE ORDER BY DATEOBSERVED DESC, HOUROBSERVED DESC) = 1
        LIMIT 8
    );
    
    -- Build Crypto Markets section with dates
    -- QUOTELASTUPDATED is TEXT in ISO format with Z (2025-05-09T17:51:00.000Z)
    SELECT COALESCE(LISTAGG('<li>' || NAME || ' (' || SYMBOL || '): $' || ROUND(QUOTEPRICE, 2) || ' (' || 
           CASE WHEN QUOTEPERCENTCHANGE24H >= 0 THEN '+' ELSE '' END || ROUND(QUOTEPERCENTCHANGE24H, 2) || '%) <span style="color:#666;font-size:12px;">(' || CRYPTO_DATE || ')</span></li>', '') 
           WITHIN GROUP (ORDER BY QUOTEMARKETCAP DESC), '<li>No crypto data available</li>')
    INTO :crypto_section
    FROM (
        SELECT NAME, SYMBOL, QUOTEPRICE, QUOTEPERCENTCHANGE24H, QUOTEMARKETCAP, TO_CHAR(TRY_TO_TIMESTAMP_TZ(QUOTELASTUPDATED), 'Mon DD HH24:MI') AS CRYPTO_DATE
        FROM DEMO.DEMO.CRYPTO
        WHERE QUOTEPRICE IS NOT NULL
        LIMIT 10
    );
    
    -- Build Aviation section with dates
    SELECT COALESCE(LISTAGG('<li>' || FLIGHT_ID || ' - Alt: ' || ALTITUDE || ' ft, Speed: ' || SPEED || ' kts <span style="color:#666;font-size:12px;">(' || FLIGHT_DATE || ')</span></li>', '') 
           WITHIN GROUP (ORDER BY TS DESC), '<li>No recent aircraft data</li>')
    INTO :aviation_section
    FROM (
        SELECT COALESCE(FLIGHT, ICAO_HEX) AS FLIGHT_ID, ROUND(ALTITUDE_BARO, 0) AS ALTITUDE, ROUND(GROUND_SPEED, 0) AS SPEED, INGESTION_TIMESTAMP AS TS, TO_CHAR(INGESTION_TIMESTAMP, 'Mon DD HH24:MI') AS FLIGHT_DATE
        FROM DEMO.DEMO.ADSB_AIRCRAFT_DATA
        WHERE FLIGHT IS NOT NULL
        LIMIT 8
    );
    
    -- Build Thermal Sensors section
    SELECT COALESCE(LISTAGG('<li>' || HOSTNAME || ': ' || ROUND(TEMPERATURE, 1) || '°F, ' || ROUND(HUMIDITY, 1) || '% RH, CO2: ' || ROUND(CO2, 0) || ' ppm <span style="color:#666;font-size:12px;">(' || SENSOR_DATE || ')</span></li>', '') 
           WITHIN GROUP (ORDER BY DATETIMESTAMP DESC), '<li>No thermal sensor data available</li>')
    INTO :thermal_section
    FROM (
        SELECT HOSTNAME, TEMPERATURE, HUMIDITY, CO2, DATETIMESTAMP, TO_CHAR(DATETIMESTAMP, 'Mon DD HH24:MI') AS SENSOR_DATE
        FROM DEMO.DEMO.THERMAL_SENSOR_DATA
        WHERE TEMPERATURE IS NOT NULL
        QUALIFY ROW_NUMBER() OVER (PARTITION BY HOSTNAME ORDER BY DATETIMESTAMP DESC) = 1
        LIMIT 8
    );
    
    -- Build Meshtastic Mesh Network section
    SELECT COALESCE(LISTAGG('<li>Node ' || FROM_ID || ': ' || 
           CASE WHEN LATITUDE IS NOT NULL THEN ROUND(LATITUDE, 4) || '°, ' || ROUND(LONGITUDE, 4) || '°' ELSE 'No GPS' END ||
           ', Alt: ' || COALESCE(ROUND(ALTITUDE, 0)::VARCHAR, 'N/A') || 'm, SNR: ' || ROUND(RX_SNR, 1) || ' dB <span style="color:#666;font-size:12px;">(' || MESH_DATE || ')</span></li>', '') 
           WITHIN GROUP (ORDER BY INGESTED_AT DESC), '<li>No mesh network data available</li>')
    INTO :meshtastic_section
    FROM (
        SELECT FROM_ID, LATITUDE, LONGITUDE, ALTITUDE, RX_SNR, RX_RSSI, INGESTED_AT, TO_CHAR(INGESTED_AT, 'Mon DD HH24:MI') AS MESH_DATE
        FROM DEMO.DEMO.MESHTASTIC_DATA
        WHERE FROM_ID IS NOT NULL
        QUALIFY ROW_NUMBER() OVER (PARTITION BY FROM_ID ORDER BY INGESTED_AT DESC) = 1
        LIMIT 8
    );
    
    -- Compose full HTML email
    email_body := '<!DOCTYPE html><html><head><style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 10px 0 0 0; opacity: 0.8; }
        .content { background: white; padding: 25px; border-radius: 0 0 10px 10px; }
        .section { margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
        .section:last-child { border-bottom: none; margin-bottom: 0; }
        .section h2 { color: #1a1a2e; font-size: 18px; margin: 0 0 15px 0; }
        ul { margin: 0; padding-left: 20px; }
        li { margin-bottom: 8px; line-height: 1.5; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style></head><body>
    <div class="header">
        <h1>Situation Desk Daily Digest</h1>
        <p>' || :digest_date || '</p>
    </div>
    <div class="content">
        <div class="section"><h2>Travel Advisories (High Risk)</h2><ul>' || :travel_section || '</ul></div>
        <div class="section"><h2>Weather Conditions</h2><ul>' || :weather_section || '</ul></div>
        <div class="section"><h2>NYC Traffic</h2><ul>' || :traffic_section || '</ul></div>
        <div class="section"><h2>Transit Alerts</h2><ul>' || :transit_section || '</ul></div>
        <div class="section"><h2>Air Quality</h2><ul>' || :airquality_section || '</ul></div>
        <div class="section"><h2>Thermal Sensors</h2><ul>' || :thermal_section || '</ul></div>
        <div class="section"><h2>Meshtastic Mesh Network</h2><ul>' || :meshtastic_section || '</ul></div>
        <div class="section"><h2>Crypto Markets</h2><ul>' || :crypto_section || '</ul></div>
        <div class="section"><h2>Aviation Tracking</h2><ul>' || :aviation_section || '</ul></div>
    </div>
    <div class="footer">
        <p>Generated by Situation Desk | Powered by Snowflake</p>
        <p>To unsubscribe, contact your administrator</p>
    </div>
    </body></html>';
    
    -- Get active subscribers
    SELECT LISTAGG(EMAIL, ',') INTO :recipient_list FROM DEMO.DEMO.DIGEST_SUBSCRIBERS WHERE IS_ACTIVE = TRUE;
    
    -- Send email if there are subscribers
    IF (recipient_list IS NOT NULL AND LENGTH(recipient_list) > 0) THEN
        CALL SYSTEM$SEND_EMAIL(
            'EMAIL_INTEGRATION',
            :recipient_list,
            'Situation Desk Daily Digest - ' || :digest_date,
            :email_body,
            'text/html'
        );
        RETURN 'Digest sent to ' || :recipient_list;
    ELSE
        RETURN 'No active subscribers found. Add subscribers to DEMO.DEMO.DIGEST_SUBSCRIBERS table.';
    END IF;
END;
$$;

COMMENT ON PROCEDURE DEMO.DEMO.GENERATE_DAILY_DIGEST() IS 'Generates and sends daily OSINT digest email to all active subscribers';

-- Scheduled task (runs daily at 7 AM ET)
CREATE OR REPLACE TASK DEMO.DEMO.DAILY_DIGEST_TASK
    WAREHOUSE = INGEST
    SCHEDULE = 'USING CRON 0 7 * * * America/New_York'
    COMMENT = 'Sends daily OSINT digest email at 7 AM ET'
AS
    CALL DEMO.DEMO.GENERATE_DAILY_DIGEST();

-- ============================================
-- Post-deployment steps (run manually):
-- ============================================

-- 1. Add subscriber(s):
-- INSERT INTO DEMO.DEMO.DIGEST_SUBSCRIBERS (EMAIL, NAME) VALUES ('your-email@example.com', 'Your Name');

-- 2. Resume the task to start scheduled execution:
-- ALTER TASK DEMO.DEMO.DAILY_DIGEST_TASK RESUME;

-- 3. Test manually (optional):
-- CALL DEMO.DEMO.GENERATE_DAILY_DIGEST();

-- 4. Check task status:
-- SHOW TASKS LIKE 'DAILY_DIGEST_TASK' IN SCHEMA DEMO.DEMO;

-- 5. View task execution history:
-- SELECT * FROM TABLE(INFORMATION_SCHEMA.TASK_HISTORY(TASK_NAME => 'DAILY_DIGEST_TASK')) ORDER BY SCHEDULED_TIME DESC;

-- 6. Manage subscribers:
-- SELECT * FROM DEMO.DEMO.DIGEST_SUBSCRIBERS;
-- UPDATE DEMO.DEMO.DIGEST_SUBSCRIBERS SET IS_ACTIVE = FALSE WHERE EMAIL = 'someone@example.com';
