-- =============================================
-- DATA WAREHOUSE BUILD: PREDICTIVE MAINTENANCE
-- =============================================
-- This script builds a complete data warehouse with Bronze, Silver, and Gold layers
-- for predictive maintenance analysis.

-- =============================================
-- BRONZE LAYER: RAW DATA INGESTION
-- =============================================

-- Create database for the project
-- Expected: New database 'maintanence_db' created
CREATE DATABASE IF NOT EXISTS maintanence_db;

-- Switch to the new database
-- Expected: Database context changed to maintanence_db
USE maintanence_db;

-- Create staging table to hold raw CSV data
-- Expected: New table 'staging_tbl' created with 18 varchar columns
CREATE TABLE IF NOT EXISTS staging_tbl(
    Time_stamp varchar(255),
    MachineID varchar(255),
    Days_Since_Last_Repair varchar(255),
    Failure_Imminent varchar(255),
    Component_Failed varchar(255),
    Temperature_C varchar(255),
    Vibration_RMS varchar(255),
    Power_KW varchar(255),
    Process_Mode varchar(255),
    Material_Type varchar(255),
    Tool_ID varchar(255),
    Operator_ID varchar(255),
    Ambient_Temp_C varchar(255),
    Accumulated_Stress_Index varchar(255),
    Batch_ID varchar(255),
    Units_Produced varchar(255),
    Quality_Pass varchar(255),
    Revenue_Impact varchar(255)
);

-- =============================================
-- DATA QUALITY CHECKS - BRONZE LAYER
-- =============================================

-- Check for fully duplicated rows in staging table
-- Expected: Returns list of duplicate rows with their count
SELECT
    Time_stamp,
    MachineID,
    Days_Since_Last_Repair,
    Failure_Imminent,
    Component_Failed,
    Temperature_C,
    Vibration_RMS,
    Power_KW,
    Process_Mode,
    Material_Type,
    Tool_ID,
    Operator_ID,
    Ambient_Temp_C,
    Accumulated_Stress_Index,
    Batch_ID,
    Units_Produced,
    Quality_Pass,
    Revenue_Impact,
    COUNT(*) AS DuplicateCount
FROM staging_tbl
GROUP BY
    Time_stamp,
    MachineID,
    Days_Since_Last_Repair,
    Failure_Imminent,
    Component_Failed,
    Temperature_C,
    Vibration_RMS,
    Power_KW,
    Process_Mode,
    Material_Type,
    Tool_ID,
    Operator_ID,
    Ambient_Temp_C,
    Accumulated_Stress_Index,
    Batch_ID,
    Units_Produced,
    Quality_Pass,
    Revenue_Impact
HAVING COUNT(*) > 1;

-- Create view to preserve raw data in bronze layer
-- Expected: View 'bornzeLayer' created pointing to staging_tbl
CREATE VIEW IF NOT EXISTS bornzeLayer AS 
SELECT * FROM staging_tbl;

-- =============================================
-- DEDUPLICATION PROCESS
-- =============================================

-- Step 1: Create temporary table with unique rows only
-- Expected: New table 'temp_unique' created with deduplicated data
CREATE TABLE IF NOT EXISTS temp_unique AS
SELECT
    Time_stamp,
    MachineID,
    Days_Since_Last_Repair,
    Failure_Imminent,
    Component_Failed,
    Temperature_C,
    Vibration_RMS,
    Power_KW,
    Process_Mode,
    Material_Type,
    Tool_ID,
    Operator_ID,
    Ambient_Temp_C,
    Accumulated_Stress_Index,
    Batch_ID,
    Units_Produced,
    Quality_Pass,
    Revenue_Impact
FROM staging_tbl
GROUP BY
    Time_stamp,
    MachineID,
    Days_Since_Last_Repair,
    Failure_Imminent,
    Component_Failed,
    Temperature_C,
    Vibration_RMS,
    Power_KW,
    Process_Mode,
    Material_Type,
    Tool_ID,
    Operator_ID,
    Ambient_Temp_C,
    Accumulated_Stress_Index,
    Batch_ID,
    Units_Produced,
    Quality_Pass,
    Revenue_Impact;

-- Step 2: Clear original staging table
-- Expected: All rows removed from staging_tbl
TRUNCATE TABLE staging_tbl;

-- Step 3: Reinsert unique rows back to staging
-- Expected: staging_tbl repopulated with deduplicated data
INSERT INTO staging_tbl
SELECT * FROM temp_unique;

-- Step 4: Clean up temporary table
-- Expected: temp_unique table dropped
DROP TABLE IF EXISTS temp_unique;

-- =============================================
-- SILVER LAYER: DATA CLEANING AND TYPING
-- =============================================

-- Create silver layer table with proper data types
-- Expected: New table 'silver_telemetry_tbl' with typed columns
CREATE TABLE IF NOT EXISTS silver_telemetry_tbl (
    Time_stamp TIMESTAMP,
    MachineID VARCHAR(50),
    Days_Since_Last_Repair FLOAT,
    Failure_Imminent INT,
    Component_Failed VARCHAR(50),
    Temperature_C FLOAT,
    Vibration_RMS FLOAT,
    Power_KW FLOAT,
    Process_Mode VARCHAR(50),
    Material_Type VARCHAR(50),
    Tool_ID VARCHAR(50),
    Operator_ID VARCHAR(50),
    Ambient_Temp_C FLOAT,
    Accumulated_Stress_Index FLOAT,
    Batch_ID VARCHAR(50),
    Units_Produced INT,
    Quality_Pass FLOAT,
    Revenue_Impact FLOAT
);

-- Insert cleaned data with type conversion and outlier handling
-- Expected: Data moved from staging_tbl to silver_telemetry_tbl with proper types
INSERT INTO silver_telemetry_tbl
SELECT
    -- Convert string timestamp to datetime
    CAST(Time_stamp AS datetime),
    MachineID,
    -- Convert numeric strings to float
    CAST(Days_Since_Last_Repair AS FLOAT),
    CAST(Failure_Imminent AS decimal),
    Component_Failed,
    -- Handle temperature outliers: values > 100.0 set to NULL
    CASE WHEN CAST(Temperature_C AS FLOAT) > 100.0 THEN NULL ELSE CAST(Temperature_C AS FLOAT) END,
    -- Handle vibration outliers: negative values set to NULL
    CASE WHEN CAST(Vibration_RMS AS FLOAT) < 0.0 THEN NULL ELSE CAST(Vibration_RMS AS FLOAT) END,
    CAST(Power_KW AS FLOAT),
    Process_Mode,
    Material_Type,
    Tool_ID,
    Operator_ID,
    CAST(Ambient_Temp_C AS FLOAT),
    CAST(Accumulated_Stress_Index AS FLOAT),
    Batch_ID,
    -- Convert units produced to integer
    CAST(Units_Produced AS Decimal),
    CAST(Quality_Pass AS FLOAT),
    CAST(Revenue_Impact AS FLOAT)
FROM staging_tbl;

-- Fix data types that need adjustment
-- Expected: Failure_Imminent column changed from DECIMAL to INT
ALTER TABLE silver_telemetry_tbl
MODIFY COLUMN Failure_Imminent INT;

-- Expected: Units_Produced column changed from DECIMAL to INT
ALTER TABLE silver_telemetry_tbl
MODIFY COLUMN Units_Produced INT;

-- Expected: Time_stamp column explicitly set as TIMESTAMP type
ALTER TABLE silver_telemetry_tbl
MODIFY COLUMN Time_stamp TIMESTAMP;

-- Verify silver layer data
-- Expected: Display first few rows of cleaned data
SELECT * FROM silver_telemetry_tbl LIMIT 10;

-- =============================================
-- NULL VALUE ANALYSIS - SILVER LAYER
-- =============================================

-- Analyze NULL value distribution across key columns
-- Expected: Count of NULLs in each numeric/sensor column
SELECT 
    COUNT(*) as Total_Rows,
    SUM(CASE WHEN Temperature_C IS NULL THEN 1 ELSE 0 END) as Null_Temperature,
    SUM(CASE WHEN Vibration_RMS IS NULL THEN 1 ELSE 0 END) as Null_Vibration,
    SUM(CASE WHEN Power_KW IS NULL THEN 1 ELSE 0 END) as Null_Power,
    SUM(CASE WHEN Quality_Pass IS NULL THEN 1 ELSE 0 END) as Null_Quality,
    SUM(CASE WHEN Ambient_Temp_C IS NULL THEN 1 ELSE 0 END) as Null_AmbientTemp,
    SUM(CASE WHEN Accumulated_Stress_Index IS NULL THEN 1 ELSE 0 END) as Null_StressIndex,
    SUM(CASE WHEN Units_Produced IS NULL THEN 1 ELSE 0 END) as Null_Units,
    SUM(CASE WHEN Revenue_Impact IS NULL THEN 1 ELSE 0 END) as Null_Revenue
FROM silver_telemetry_tbl;

-- =============================================
-- ENHANCED SILVER LAYER WITH NULL HANDLING
-- =============================================

-- Create enhanced table with NULL tracking columns
-- Expected: New table 'silver_telemetry_enhanced' with imputation flags
CREATE TABLE IF NOT EXISTS silver_telemetry_enhanced (
    Time_stamp TIMESTAMP,
    MachineID VARCHAR(50),
    Days_Since_Last_Repair FLOAT,
    Failure_Imminent INT,
    Component_Failed VARCHAR(50),
    Temperature_C FLOAT,
    Vibration_RMS FLOAT,
    Power_KW FLOAT,
    Process_Mode VARCHAR(50),
    Material_Type VARCHAR(50),
    Tool_ID VARCHAR(50),
    Operator_ID VARCHAR(50),
    Ambient_Temp_C FLOAT,
    Accumulated_Stress_Index FLOAT,
    Batch_ID VARCHAR(50),
    Units_Produced INT,
    Quality_Pass FLOAT,
    Revenue_Impact FLOAT,
    -- Data quality tracking columns
    Temperature_Imputed BOOLEAN DEFAULT FALSE,
    Vibration_Imputed BOOLEAN DEFAULT FALSE,
    Power_Imputed BOOLEAN DEFAULT FALSE,
    Quality_Imputed BOOLEAN DEFAULT FALSE
);

-- Insert data with comprehensive NULL handling
-- Expected: Data moved to enhanced table with NULLs handled and imputation tracked
INSERT INTO silver_telemetry_enhanced (
    Time_stamp, MachineID, Days_Since_Last_Repair, Failure_Imminent, 
    Component_Failed, Temperature_C, Vibration_RMS, Power_KW, 
    Process_Mode, Material_Type, Tool_ID, Operator_ID, Ambient_Temp_C,
    Accumulated_Stress_Index, Batch_ID, Units_Produced, Quality_Pass, Revenue_Impact
)
SELECT 
    -- Handle invalid timestamps - set to epoch time if NULL/empty
    CASE 
        WHEN Time_stamp IS NULL OR Time_stamp = '' THEN '1970-01-01 00:00:00'
        ELSE STR_TO_DATE(Time_stamp, '%Y-%m-%d %H:%i:%s')
    END as Time_stamp,
    
    -- MachineID is critical - set default if missing
    COALESCE(NULLIF(MachineID, ''), 'UNKNOWN_MACHINE') as MachineID,
    
    -- Numeric conversions with NULL handling
    CASE 
        WHEN Days_Since_Last_Repair IS NULL OR Days_Since_Last_Repair = '' THEN 0
        ELSE CAST(Days_Since_Last_Repair AS FLOAT)
    END as Days_Since_Last_Repair,
    
    CASE 
        WHEN Failure_Imminent IS NULL OR Failure_Imminent = '' THEN 0
        ELSE CAST(Failure_Imminent AS UNSIGNED)
    END as Failure_Imminent,
    
    -- Component failed - set default if NULL
    COALESCE(NULLIF(Component_Failed, ''), 'None') as Component_Failed,
    
    -- Sensor readings - leave NULLs for imputation in next step
    CASE 
        WHEN Temperature_C IS NULL OR Temperature_C = '' OR Temperature_C = 'NULL' THEN NULL
        ELSE CAST(Temperature_C AS FLOAT)
    END as Temperature_C,
    
    CASE 
        WHEN Vibration_RMS IS NULL OR Vibration_RMS = '' OR Vibration_RMS = 'NULL' THEN NULL
        ELSE CAST(Vibration_RMS AS FLOAT)
    END as Vibration_RMS,
    
    CASE 
        WHEN Power_KW IS NULL OR Power_KW = '' OR Power_KW = 'NULL' THEN NULL
        ELSE CAST(Power_KW AS FLOAT)
    END as Power_KW,
    
    -- Categorical data - set defaults for NULLs
    COALESCE(NULLIF(Process_Mode, ''), 'UNKNOWN') as Process_Mode,
    COALESCE(NULLIF(Material_Type, ''), 'UNKNOWN_MATERIAL') as Material_Type,
    COALESCE(NULLIF(Tool_ID, ''), 'UNKNOWN_TOOL') as Tool_ID,
    COALESCE(NULLIF(Operator_ID, ''), 'UNKNOWN_OPERATOR') as Operator_ID,
    
    -- Ambient temperature
    CASE 
        WHEN Ambient_Temp_C IS NULL OR Ambient_Temp_C = '' THEN NULL
        ELSE CAST(Ambient_Temp_C AS FLOAT)
    END as Ambient_Temp_C,
    
    -- Accumulated stress index
    CASE 
        WHEN Accumulated_Stress_Index IS NULL OR Accumulated_Stress_Index = '' THEN NULL
        ELSE CAST(Accumulated_Stress_Index AS FLOAT)
    END as Accumulated_Stress_Index,
    
    -- Batch ID
    COALESCE(NULLIF(Batch_ID, ''), 'UNKNOWN_BATCH') as Batch_ID,
    
    -- Units produced - set to 0 if NULL
    CASE 
        WHEN Units_Produced IS NULL OR Units_Produced = '' THEN 0
        ELSE CAST(Units_Produced AS UNSIGNED)
    END as Units_Produced,
    
    -- Quality pass - leave NULL for imputation
    CASE 
        WHEN Quality_Pass IS NULL OR Quality_Pass = '' OR Quality_Pass = 'NULL' THEN NULL
        ELSE CAST(Quality_Pass AS FLOAT)
    END as Quality_Pass,
    
    -- Revenue impact - set to 0 if NULL
    CASE 
        WHEN Revenue_Impact IS NULL OR Revenue_Impact = '' THEN 0
        ELSE CAST(Revenue_Impact AS FLOAT)
    END as Revenue_Impact
    
FROM staging_tbl;

-- =============================================
-- MACHINE STATISTICS FOR IMPUTATION
-- =============================================

-- Create table to store machine-specific statistics
-- Expected: New table 'machine_statistics' for imputation reference
CREATE TABLE IF NOT EXISTS machine_statistics (
    MachineID VARCHAR(50) PRIMARY KEY,
    Avg_Temperature FLOAT,
    Median_Temperature FLOAT,
    Std_Temperature FLOAT,
    Avg_Vibration FLOAT,
    Median_Vibration FLOAT,
    Std_Vibration FLOAT,
    Avg_Power FLOAT,
    Median_Power FLOAT,
    Std_Power FLOAT,
    Avg_Quality FLOAT,
    Median_Quality FLOAT,
    Total_Records INT,
    Last_Updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calculate and store machine statistics using averages as median proxies
-- Expected: machine_statistics populated with statistical summaries per machine
INSERT INTO machine_statistics (
    MachineID, Avg_Temperature, Median_Temperature, Std_Temperature,
    Avg_Vibration, Median_Vibration, Std_Vibration,
    Avg_Power, Median_Power, Std_Power, Avg_Quality, Total_Records
)
SELECT 
    MachineID,
    AVG(Temperature_C) as Avg_Temperature,
    AVG(Temperature_C) as Median_Temperature, -- Using average as median proxy
    COALESCE(STDDEV_SAMP(Temperature_C), 0) as Std_Temperature,
    AVG(Vibration_RMS) as Avg_Vibration,
    AVG(Vibration_RMS) as Median_Vibration, -- Using average as median proxy
    COALESCE(STDDEV_SAMP(Vibration_RMS), 0) as Std_Vibration,
    AVG(Power_KW) as Avg_Power,
    AVG(Power_KW) as Median_Power, -- Using average as median proxy
    COALESCE(STDDEV_SAMP(Power_KW), 0) as Std_Power,
    AVG(Quality_Pass) as Avg_Quality,
    COUNT(*) as Total_Records
FROM silver_telemetry_enhanced
GROUP BY MachineID;

-- Verify machine statistics calculation
-- Expected: Display sample of machine statistics
SELECT 
    MachineID,
    Avg_Temperature,
    Median_Temperature,
    Std_Temperature,
    Avg_Vibration,
    Median_Vibration,
    Std_Vibration,
    Total_Records
FROM machine_statistics
LIMIT 10;

-- Check for NULL values in statistics
-- Expected: Show count of NULLs in statistical columns
SELECT 
    COUNT(*) as Total_Machines,
    SUM(CASE WHEN Avg_Temperature IS NULL THEN 1 ELSE 0 END) as Null_AvgTemp,
    SUM(CASE WHEN Median_Temperature IS NULL THEN 1 ELSE 0 END) as Null_MedianTemp,
    SUM(CASE WHEN Avg_Vibration IS NULL THEN 1 ELSE 0 END) as Null_AvgVibe
FROM machine_statistics;

-- =============================================
-- GOLD LAYER: DIMENSIONAL MODEL
-- =============================================

-- Create Time Dimension table for time-series analysis
-- Expected: New table 'dim_time' with time hierarchy columns
CREATE TABLE IF NOT EXISTS dim_time (
    time_key INT AUTO_INCREMENT PRIMARY KEY,
    timestamp TIMESTAMP UNIQUE NOT NULL,
    date DATE,
    year INT,
    quarter INT,
    month INT,
    week INT,
    day INT,
    hour INT,
    minute INT,
    day_of_week INT,
    is_weekend BOOLEAN,
    shift VARCHAR(20),
    period_of_day VARCHAR(20)
);

-- Create Machine Dimension table
-- Expected: New table 'dim_machine' with machine metadata
CREATE TABLE IF NOT EXISTS dim_machine (
    machine_id VARCHAR(50) PRIMARY KEY,
    department VARCHAR(50),
    product_sku VARCHAR(50),
    model VARCHAR(50),
    install_date DATE,
    manufacturer VARCHAR(50),
    rated_capacity_tons FLOAT,
    software_version VARCHAR(20),
    is_critical_asset BOOLEAN,
    replacement_cost DECIMAL(12,2),
    base_temp FLOAT,
    base_vibe FLOAT,
    base_power FLOAT,
    total_repairs_lifetime INT,
    machine_age_days INT
);

-- Create Component Dimension table
-- Expected: New table 'dim_component' with component types
CREATE TABLE IF NOT EXISTS dim_component (
    component_id INT AUTO_INCREMENT PRIMARY KEY,
    component_type VARCHAR(50) UNIQUE NOT NULL,
    component_category VARCHAR(50),
    expected_lifetime_hours INT,
    replacement_cost DECIMAL(10,2)
);

-- Create Operator Dimension table
-- Expected: New table 'dim_operator' with operator information
CREATE TABLE IF NOT EXISTS dim_operator (
    operator_id VARCHAR(50) PRIMARY KEY,
    experience_level VARCHAR(20),
    department VARCHAR(50),
    shift_preference VARCHAR(20)
);

-- Add column to track machines operated by each operator
-- Expected: Column 'total_machines_operated' added to dim_operator
ALTER TABLE dim_operator
ADD COLUMN total_machines_operated INT;

-- Create Material Dimension table
-- Expected: New table 'dim_material' with material specifications
CREATE TABLE IF NOT EXISTS dim_material (
    material_type VARCHAR(50) PRIMARY KEY,
    material_category VARCHAR(50),
    cost_per_unit DECIMAL(10,2),
    hardness_rating VARCHAR(20),
    supplier VARCHAR(50)
);

-- Create Tool Dimension table
-- Expected: New table 'dim_tool' with tool information
CREATE TABLE IF NOT EXISTS dim_tool (
    tool_id VARCHAR(50) PRIMARY KEY,
    tool_type VARCHAR(50),
    tool_category VARCHAR(50),
    expected_life_hours INT,
    current_usage_hours INT
);

-- Create Batch Dimension table
-- Expected: New table 'dim_batch' with batch information
CREATE TABLE IF NOT EXISTS dim_batch (
    batch_id VARCHAR(50) PRIMARY KEY,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    total_units INT,
    target_quality FLOAT,
    product_type VARCHAR(50)
);

-- Create main Fact Table for predictive features
-- Expected: New table 'fact_machine_telemetry' as central fact table
CREATE TABLE IF NOT EXISTS fact_machine_telemetry (
    telemetry_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    time_key INT,
    machine_id VARCHAR(50),
    component_id INT,
    operator_id VARCHAR(50),
    material_type VARCHAR(50),
    tool_id VARCHAR(50),
    batch_id VARCHAR(50),
    
    -- Sensor Measurements (Features for ML)
    temperature_c FLOAT,
    vibration_rms FLOAT,
    power_kw FLOAT,
    ambient_temp_c FLOAT,
    accumulated_stress_index FLOAT,
    
    -- Operational Context
    process_mode VARCHAR(50),
    days_since_last_repair FLOAT,
    
    -- Production Metrics
    units_produced INT,
    quality_pass FLOAT,
    
    -- Target Variables for ML
    failure_imminent INT,
    component_failed VARCHAR(50),
    
    -- Business Metrics
    revenue_impact DECIMAL(12,2),
    operational_efficiency FLOAT,
    
    -- Data Quality Flags
    temperature_imputed BOOLEAN DEFAULT FALSE,
    vibration_imputed BOOLEAN DEFAULT FALSE,
    power_imputed BOOLEAN DEFAULT FALSE,
    
    -- Foreign key constraints
    FOREIGN KEY (time_key) REFERENCES dim_time(time_key),
    FOREIGN KEY (machine_id) REFERENCES dim_machine(machine_id),
    FOREIGN KEY (component_id) REFERENCES dim_component(component_id),
    FOREIGN KEY (operator_id) REFERENCES dim_operator(operator_id),
    FOREIGN KEY (material_type) REFERENCES dim_material(material_type),
    FOREIGN KEY (tool_id) REFERENCES dim_tool(tool_id),
    FOREIGN KEY (batch_id) REFERENCES dim_batch(batch_id)
);

-- =============================================
-- POPULATE DIMENSION TABLES
-- =============================================

-- Populate Time Dimension from enhanced silver data
-- Expected: dim_time populated with time hierarchy from telemetry data
INSERT INTO dim_time (
    timestamp, date, year, quarter, month, week, day, hour, minute,
    day_of_week, is_weekend, shift, period_of_day
)
SELECT DISTINCT
    Time_stamp,
    DATE(Time_stamp),
    YEAR(Time_stamp),
    QUARTER(Time_stamp),
    MONTH(Time_stamp),
    WEEK(Time_stamp),
    DAY(Time_stamp),
    HOUR(Time_stamp),
    MINUTE(Time_stamp),
    DAYOFWEEK(Time_stamp),
    CASE WHEN DAYOFWEEK(Time_stamp) IN (1,7) THEN TRUE ELSE FALSE END,
    CASE 
        WHEN HOUR(Time_stamp) BETWEEN 6 AND 14 THEN 'Morning'
        WHEN HOUR(Time_stamp) BETWEEN 14 AND 22 THEN 'Evening'
        ELSE 'Night'
    END,
    CASE 
        WHEN HOUR(Time_stamp) BETWEEN 5 AND 12 THEN 'Morning'
        WHEN HOUR(Time_stamp) BETWEEN 12 AND 17 THEN 'Afternoon'
        WHEN HOUR(Time_stamp) BETWEEN 17 AND 21 THEN 'Evening'
        ELSE 'Night'
    END
FROM silver_telemetry_enhanced;

-- Populate Machine Dimension using statistical data
-- Expected: dim_machine populated with machine profiles and base values
INSERT INTO dim_machine (
    machine_id, department, product_sku, model, install_date,
    manufacturer, rated_capacity_tons, software_version,
    is_critical_asset, replacement_cost, base_temp, base_vibe,
    base_power, total_repairs_lifetime, machine_age_days
)
WITH machine_stats AS (
    SELECT 
        MachineID,
        -- Extract department from MachineID pattern
        CASE 
            WHEN MachineID LIKE 'CAS-%' THEN 'Casting'
            WHEN MachineID LIKE 'MAC-%' THEN 'Machining' 
            WHEN MachineID LIKE 'ASS-%' THEN 'Assembly'
            WHEN MachineID LIKE 'FIN-%' THEN 'Finishing'
            WHEN MachineID LIKE 'PAC-%' THEN 'Packaging'
            ELSE 'Unknown'
        END as department,
        
        -- Calculate base values from actual data
        AVG(Temperature_C) as avg_temp,
        AVG(Vibration_RMS) as avg_vibe, 
        AVG(Power_KW) as avg_power,
        
        -- Estimate repairs from failure patterns
        SUM(Failure_Imminent) as failure_count,
        COUNT(*) as total_readings
        
    FROM silver_telemetry_enhanced
    GROUP BY MachineID
)
SELECT 
    ms.MachineID as machine_id,
    ms.department,
    -- Generate synthetic product SKU
    CONCAT('SKU-', FLOOR(100 + RAND() * 900)) as product_sku,
    -- Assign models based on department
    CASE 
        WHEN ms.department = 'Casting' THEN 'M-2000X'
        WHEN ms.department = 'Machining' THEN 'H-550'
        WHEN ms.department = 'Assembly' THEN 'Z-999-Pro' 
        WHEN ms.department = 'Finishing' THEN 'Alpha-500'
        WHEN ms.department = 'Packaging' THEN 'Pack-Master'
        ELSE 'Generic'
    END as model,
    -- Generate random install dates (1-5 years ago)
    DATE_SUB(CURDATE(), INTERVAL FLOOR(365 + RAND() * 1460) DAY) as install_date,
    -- Random manufacturer assignment
    CASE FLOOR(RAND() * 5)
        WHEN 0 THEN 'Siemens'
        WHEN 1 THEN 'Fanuc'
        WHEN 2 THEN 'Mazak'
        WHEN 3 THEN 'Haas'
        ELSE 'LocalFab'
    END as manufacturer,
    -- Capacity based on department
    CASE 
        WHEN ms.department = 'Casting' THEN ROUND(30.0 + RAND() * 20.0, 2)
        WHEN ms.department = 'Machining' THEN ROUND(15.0 + RAND() * 15.0, 2)
        WHEN ms.department = 'Assembly' THEN ROUND(8.0 + RAND() * 12.0, 2)
        WHEN ms.department = 'Finishing' THEN ROUND(5.0 + RAND() * 10.0, 2)
        WHEN ms.department = 'Packaging' THEN ROUND(3.0 + RAND() * 7.0, 2)
        ELSE ROUND(10.0 + RAND() * 15.0, 2)
    END as rated_capacity_tons,
    -- Software version
    CASE FLOOR(RAND() * 4)
        WHEN 0 THEN '1.0.1'
        WHEN 1 THEN '1.0.5'
        WHEN 2 THEN '2.1.0'
        ELSE '2.5.5'
    END as software_version,
    -- 25% of machines are critical assets
    CASE WHEN FLOOR(RAND() * 4) = 0 THEN TRUE ELSE FALSE END as is_critical_asset,
    -- Replacement cost based on department
    CASE 
        WHEN ms.department = 'Casting' THEN FLOOR(250000 + RAND() * 250000)
        WHEN ms.department = 'Machining' THEN FLOOR(150000 + RAND() * 150000)
        WHEN ms.department = 'Assembly' THEN FLOOR(100000 + RAND() * 100000)
        WHEN ms.department = 'Finishing' THEN FLOOR(75000 + RAND() * 75000)
        WHEN ms.department = 'Packaging' THEN FLOOR(50000 + RAND() * 50000)
        ELSE FLOOR(100000 + RAND() * 100000)
    END as replacement_cost,
    -- Base values from actual data averages
    ms.avg_temp as base_temp,
    ms.avg_vibe as base_vibe, 
    ms.avg_power as base_power,
    -- Total repairs from failure count
    ms.failure_count as total_repairs_lifetime,
    -- Machine age in days
    DATEDIFF(CURDATE(), DATE_SUB(CURDATE(), INTERVAL FLOOR(365 + RAND() * 1460) DAY)) as machine_age_days
FROM machine_stats ms;

-- Verify machine dimension population
-- Expected: Show machine count and sample records
SELECT COUNT(*) as machine_count FROM dim_machine;
SELECT * FROM dim_machine LIMIT 5;

-- Populate Operator Dimension with unique operators
-- Expected: dim_operator populated with operator profiles
INSERT INTO dim_operator (operator_id, experience_level, department, shift_preference, total_machines_operated)
SELECT 
    Operator_ID,
    -- Determine experience level from operator ID pattern
    CASE 
        WHEN RIGHT(Operator_ID, 1) IN ('1','2','3') THEN 'Senior'
        WHEN RIGHT(Operator_ID, 1) IN ('4','5','6') THEN 'Mid'
        ELSE 'Junior'
    END as experience_level,
    -- Determine department from machine patterns
    (SELECT 
        CASE 
            WHEN MachineID LIKE 'CAS-%' THEN 'Casting'
            WHEN MachineID LIKE 'MAC-%' THEN 'Machining'
            WHEN MachineID LIKE 'ASS-%' THEN 'Assembly'
            WHEN MachineID LIKE 'FIN-%' THEN 'Finishing' 
            WHEN MachineID LIKE 'PAC-%' THEN 'Packaging'
            ELSE 'General'
        END
     FROM silver_telemetry_enhanced ste2
     WHERE ste2.Operator_ID = ste1.Operator_ID
     GROUP BY 
        CASE 
            WHEN MachineID LIKE 'CAS-%' THEN 'Casting'
            WHEN MachineID LIKE 'MAC-%' THEN 'Machining'
            WHEN MachineID LIKE 'ASS-%' THEN 'Assembly'
            WHEN MachineID LIKE 'FIN-%' THEN 'Finishing' 
            WHEN MachineID LIKE 'PAC-%' THEN 'Packaging'
            ELSE 'General'
        END
     ORDER BY COUNT(*) DESC
     LIMIT 1
    ) as department,
    -- Determine shift preference from working hours
    CASE 
        WHEN AVG(HOUR(Time_stamp)) BETWEEN 6 AND 14 THEN 'Morning'
        WHEN AVG(HOUR(Time_stamp)) BETWEEN 14 AND 22 THEN 'Evening'
        ELSE 'Night'
    END as shift_preference,
    -- Count distinct machines operated
    COUNT(DISTINCT MachineID) as total_machines_operated
FROM silver_telemetry_enhanced ste1
GROUP BY Operator_ID;

-- Verify operator dimension
-- Expected: Show operator count and sample records
SELECT COUNT(*) as operator_count FROM dim_operator;
SELECT * FROM dim_operator LIMIT 10;

-- Populate Component Dimension with predefined values
-- Expected: dim_component populated with component types
INSERT INTO dim_component (component_type, component_category, expected_lifetime_hours, replacement_cost)
VALUES 
    ('Bearing', 'Mechanical', 5000, 2500.00),
    ('Motor', 'Electrical', 8000, 15000.00),
    ('Pump', 'Hydraulic', 6000, 8000.00),
    ('Tooling', 'Cutting', 2000, 5000.00),
    ('None', 'None', 0, 0.00);

-- Populate Material Dimension with predefined values
-- Expected: dim_material populated with material specifications
INSERT INTO dim_material (material_type, material_category, cost_per_unit, hardness_rating, supplier)
VALUES 
    ('Steel A36', 'Metal', 50.00, 'High', 'SteelCo'),
    ('Aluminum 6061', 'Metal', 35.00, 'Medium', 'AlumCorp'),
    ('Plastic ABS', 'Polymer', 15.00, 'Low', 'PlasticInc'),
    ('Copper Alloy', 'Metal', 70.00, 'High', 'CopperMine'),
    ('Composite', 'Composite', 85.00, 'Medium', 'CompMaterials');

-- Populate Tool Dimension using INSERT IGNORE to handle duplicates
-- Expected: dim_tool populated with tool information, skipping duplicates
INSERT IGNORE INTO dim_tool (tool_id, tool_type, tool_category, expected_life_hours, current_usage_hours)
SELECT DISTINCT
    Tool_ID,
    Tool_ID as tool_type,
    -- Categorize tools based on name patterns
    CASE 
        WHEN Tool_ID LIKE '%Cutter%' THEN 'Cutting'
        WHEN Tool_ID LIKE '%Drill%' THEN 'Drilling'
        WHEN Tool_ID LIKE '%Press%' THEN 'Forming'
        WHEN Tool_ID LIKE '%Welding%' THEN 'Joining'
        WHEN Tool_ID LIKE '%Laser%' THEN 'Cutting'
        ELSE 'General'
    END as tool_category,
    -- Expected life based on tool type
    CASE 
        WHEN Tool_ID LIKE '%Cutter%' THEN 500
        WHEN Tool_ID LIKE '%Drill%' THEN 300
        WHEN Tool_ID LIKE '%Press%' THEN 800
        WHEN Tool_ID LIKE '%Welding%' THEN 400
        WHEN Tool_ID LIKE '%Laser%' THEN 600
        ELSE 350
    END as expected_life_hours,
    -- Simulated current usage
    FLOOR(RAND() * 200) + 50 as current_usage_hours
FROM silver_telemetry_enhanced;

-- Populate Batch Dimension with batch summaries
-- Expected: dim_batch populated with batch information, ignoring duplicates
INSERT IGNORE INTO dim_batch (batch_id, start_time, end_time, total_units, target_quality, product_type)
SELECT 
    Batch_ID,
    MIN(Time_stamp) as start_time,
    MAX(Time_stamp) as end_time,
    SUM(Units_Produced) as total_units,
    0.95 as target_quality,
    -- Determine product type from material
    CASE 
        WHEN Material_Type LIKE '%Steel%' THEN 'Metal Parts'
        WHEN Material_Type LIKE '%Aluminum%' THEN 'Lightweight Parts'
        WHEN Material_Type LIKE '%Plastic%' THEN 'Polymer Parts'
        ELSE 'General Parts'
    END as product_type
FROM silver_telemetry_enhanced
GROUP BY Batch_ID, Material_Type;

-- =============================================
-- POPULATE FACT TABLE
-- =============================================

-- Populate main Fact Table by joining all dimensions
-- Expected: fact_machine_telemetry populated with all telemetry data linked to dimensions
INSERT INTO fact_machine_telemetry (
    time_key, machine_id, component_id, operator_id, material_type,
    tool_id, batch_id, temperature_c, vibration_rms, power_kw,
    ambient_temp_c, accumulated_stress_index, process_mode,
    days_since_last_repair, units_produced, quality_pass,
    failure_imminent, component_failed, revenue_impact,
    temperature_imputed, vibration_imputed, power_imputed,
    operational_efficiency
)
SELECT 
    dt.time_key,
    ste.MachineID as machine_id,
    dc.component_id,
    ste.Operator_ID as operator_id,
    ste.Material_Type as material_type,
    ste.Tool_ID as tool_id,
    ste.Batch_ID as batch_id,
    ste.Temperature_C as temperature_c,
    ste.Vibration_RMS as vibration_rms,
    ste.Power_KW as power_kw,
    ste.Ambient_Temp_C as ambient_temp_c,
    ste.Accumulated_Stress_Index as accumulated_stress_index,
    ste.Process_Mode as process_mode,
    ste.Days_Since_Last_Repair as days_since_last_repair,
    ste.Units_Produced as units_produced,
    ste.Quality_Pass as quality_pass,
    ste.Failure_Imminent as failure_imminent,
    ste.Component_Failed as component_failed,
    ste.Revenue_Impact as revenue_impact,
    COALESCE(ste.Temperature_Imputed, FALSE) as temperature_imputed,
    COALESCE(ste.Vibration_Imputed, FALSE) as vibration_imputed,
    COALESCE(ste.Power_Imputed, FALSE) as power_imputed,
    -- Calculate operational efficiency based on process mode and quality
    CASE 
        WHEN ste.Process_Mode = 'RUN_HIGH' AND ste.Quality_Pass > 0.85 THEN 0.95
        WHEN ste.Process_Mode = 'RUN_HIGH' AND ste.Quality_Pass > 0.75 THEN 0.85
        WHEN ste.Process_Mode = 'RUN_LOW' THEN 0.75
        WHEN ste.Process_Mode = 'IDLE' THEN 0.10
        ELSE 0.60
    END as operational_efficiency
FROM silver_telemetry_enhanced ste
JOIN dim_time dt ON ste.Time_stamp = dt.timestamp
JOIN dim_component dc ON ste.Component_Failed = dc.component_type
JOIN dim_machine dm ON ste.MachineID = dm.machine_id
JOIN dim_operator op ON ste.Operator_ID = op.operator_id
JOIN dim_material mat ON ste.Material_Type = mat.material_type
JOIN dim_tool tool ON ste.Tool_ID = tool.tool_id
JOIN dim_batch batch ON ste.Batch_ID = batch.batch_id;

-- Verify fact table population
-- Expected: Show fact record count and data quality metrics
SELECT 
    COUNT(*) as total_fact_records,
    AVG(failure_imminent) as failure_rate,
    SUM(temperature_imputed) as imputed_temperatures,
    SUM(vibration_imputed) as imputed_vibrations
FROM fact_machine_telemetry;

-- =============================================
-- PERFORMANCE OPTIMIZATION
-- =============================================

-- Create indexes for optimal query performance
-- Expected: Indexes created on frequently queried columns
CREATE INDEX idx_fact_time ON fact_machine_telemetry(time_key);
CREATE INDEX idx_fact_machine ON fact_machine_telemetry(machine_id);
CREATE INDEX idx_fact_failure ON fact_machine_telemetry(failure_imminent);
CREATE INDEX idx_fact_component ON fact_machine_telemetry(component_id);
CREATE INDEX idx_fact_batch ON fact_machine_telemetry(batch_id);
CREATE INDEX idx_time_timestamp ON dim_time(timestamp);
CREATE INDEX idx_machine_dept ON dim_machine(department);

-- =============================================
-- GOLD LAYER: ANALYTICAL VIEWS
-- =============================================

-- Create ML Features View for predictive modeling
-- Expected: View 'gold_ml_features' created with engineered features
CREATE VIEW gold_ml_features AS
SELECT 
    ft.telemetry_id,
    ft.time_key,
    dt.timestamp,
    ft.machine_id,
    dm.department,
    dm.model,
    
    -- Raw sensor features
    ft.temperature_c,
    ft.vibration_rms,
    ft.power_kw,
    ft.ambient_temp_c,
    ft.accumulated_stress_index,
    
    -- Derived features (feature engineering)
    ft.temperature_c - dm.base_temp as temp_deviation,
    ft.vibration_rms - dm.base_vibe as vibration_deviation,
    ft.power_kw - dm.base_power as power_deviation,
    (ft.temperature_c - dm.base_temp) / NULLIF(dm.base_temp, 0) as temp_deviation_pct,
    
    -- Time-based features
    dt.hour,
    dt.shift,
    dt.is_weekend,
    dt.period_of_day,
    
    -- Machine context features
    dm.is_critical_asset,
    dm.machine_age_days,
    ft.days_since_last_repair,
    dm.total_repairs_lifetime,
    
    -- Operational context
    ft.process_mode,
    op.experience_level,
    mat.material_category,
    tool.tool_category,
    
    -- Production metrics
    ft.units_produced,
    ft.quality_pass,
    ft.operational_efficiency,
    
    -- Rolling averages for trend analysis
    AVG(ft.temperature_c) OVER (
        PARTITION BY ft.machine_id 
        ORDER BY dt.timestamp 
        ROWS BETWEEN 12 PRECEDING AND CURRENT ROW
    ) as temp_rolling_avg_6min,
    
    AVG(ft.vibration_rms) OVER (
        PARTITION BY ft.machine_id 
        ORDER BY dt.timestamp 
        ROWS BETWEEN 60 PRECEDING AND CURRENT ROW
    ) as vibe_rolling_avg_30min,
    
    -- Target variables for ML
    ft.failure_imminent,
    ft.component_failed,
    
    -- Data quality flags
    ft.temperature_imputed,
    ft.vibration_imputed,
    ft.power_imputed
    
FROM fact_machine_telemetry ft
JOIN dim_time dt ON ft.time_key = dt.time_key
JOIN dim_machine dm ON ft.machine_id = dm.machine_id
JOIN dim_operator op ON ft.operator_id = op.operator_id
JOIN dim_material mat ON ft.material_type = mat.material_type
JOIN dim_tool tool ON ft.tool_id = tool.tool_id;

-- Create Equipment Health Dashboard View
-- Expected: View 'gold_equipment_health' created with machine health scores
CREATE VIEW gold_equipment_health AS
SELECT 
    dm.machine_id,
    dm.department,
    dm.model,
    dm.is_critical_asset,
    COUNT(*) as total_readings,
    AVG(ft.temperature_c) as avg_temperature,
    MAX(ft.temperature_c) as max_temperature,
    AVG(ft.vibration_rms) as avg_vibration,
    MAX(ft.vibration_rms) as max_vibration,
    AVG(ft.power_kw) as avg_power,
    SUM(ft.failure_imminent) as failure_alerts,
    AVG(ft.quality_pass) as avg_quality,
    MAX(ft.days_since_last_repair) as current_days_since_repair,
    AVG(ft.operational_efficiency) as avg_efficiency,
    
    -- Health score calculation (0-100, higher is better)
    CASE 
        WHEN SUM(ft.failure_imminent) = 0 AND AVG(ft.quality_pass) > 0.9 THEN 95
        WHEN SUM(ft.failure_imminent) = 0 AND AVG(ft.quality_pass) > 0.8 THEN 85
        WHEN SUM(ft.failure_imminent) < 3 THEN 75
        WHEN SUM(ft.failure_imminent) < 10 THEN 60
        ELSE 40
    END as health_score,
    
    -- Maintenance priority based on failure patterns
    CASE 
        WHEN SUM(ft.failure_imminent) > 5 OR AVG(ft.quality_pass) < 0.7 THEN 'HIGH'
        WHEN SUM(ft.failure_imminent) > 2 OR AVG(ft.quality_pass) < 0.8 THEN 'MEDIUM'
        ELSE 'LOW'
    END as maintenance_priority
    
FROM fact_machine_telemetry ft
JOIN dim_machine dm ON ft.machine_id = dm.machine_id
GROUP BY dm.machine_id, dm.department, dm.model, dm.is_critical_asset;

-- Create Maintenance Prediction Signals View
-- Expected: View 'gold_maintenance_signals' created with maintenance alerts
CREATE VIEW gold_maintenance_signals AS
SELECT 
    ft.telemetry_id,
    ft.machine_id,
    dm.department,
    dm.model,
    dt.timestamp,
    ft.temperature_c,
    ft.vibration_rms,
    ft.power_kw,
    ft.accumulated_stress_index,
    ft.days_since_last_repair,
    ft.failure_imminent,
    ft.component_failed,
    
    -- Warning level classification
    CASE 
        WHEN ft.temperature_c > (dm.base_temp + 15) THEN 'CRITICAL_TEMP'
        WHEN ft.vibration_rms > (dm.base_vibe + 5) THEN 'CRITICAL_VIBE'
        WHEN ft.temperature_c > (dm.base_temp + 10) THEN 'HIGH_TEMP'
        WHEN ft.vibration_rms > (dm.base_vibe + 3) THEN 'HIGH_VIBE'
        WHEN ft.accumulated_stress_index > 20 THEN 'HIGH_STRESS'
        WHEN ft.accumulated_stress_index > 15 THEN 'MEDIUM_STRESS'
        ELSE 'NORMAL'
    END as warning_level,
    
    -- Maintenance urgency score (0-100)
    LEAST(100, GREATEST(0,
        (ft.temperature_c - dm.base_temp) * 2 +
        (ft.vibration_rms - dm.base_vibe) * 10 +
        (ft.accumulated_stress_index / 2) +
        (ft.days_since_last_repair / 7)
    )) as maintenance_urgency_score,
    
    -- Recommended maintenance action
    CASE 
        WHEN ft.temperature_c > (dm.base_temp + 15) OR ft.vibration_rms > (dm.base_vibe + 5) THEN 'IMMEDIATE_SHUTDOWN'
        WHEN ft.failure_imminent = 1 THEN 'URGENT_REPAIR'
        WHEN (ft.temperature_c - dm.base_temp) > 8 OR (ft.vibration_rms - dm.base_vibe) > 4 THEN 'SCHEDULED_MAINTENANCE'
        WHEN ft.days_since_last_repair > 180 THEN 'ROUTINE_MAINTENANCE'
        ELSE 'MONITOR_ONLY'
    END as recommended_action
    
FROM fact_machine_telemetry ft
JOIN dim_time dt ON ft.time_key = dt.time_key
JOIN dim_machine dm ON ft.machine_id = dm.machine_id
WHERE ft.failure_imminent = 1 
   OR ft.temperature_c > (dm.base_temp + 5)
   OR ft.vibration_rms > (dm.base_vibe + 2)
   OR ft.days_since_last_repair > 90
   OR ft.accumulated_stress_index > 10;

-- Create Production Efficiency Analysis View
-- Expected: View 'gold_production_efficiency' created with batch performance metrics
CREATE VIEW gold_production_efficiency AS
SELECT 
    db.batch_id,
    db.start_time,
    db.end_time,
    db.total_units,
    db.target_quality,
    db.product_type,
    dm.department,
    dm.machine_id,
    
    -- Batch statistics
    COUNT(ft.telemetry_id) as batch_records,
    AVG(ft.quality_pass) as actual_avg_quality,
    AVG(ft.operational_efficiency) as avg_efficiency,
    SUM(ft.failure_imminent) as failure_count,
    SUM(ft.units_produced) as total_units_produced,
    
    -- Quality status classification
    CASE 
        WHEN AVG(ft.quality_pass) >= db.target_quality THEN 'TARGET_MET'
        WHEN AVG(ft.quality_pass) >= db.target_quality * 0.9 THEN 'NEAR_TARGET'
        ELSE 'BELOW_TARGET'
    END as quality_status,
    
    -- Batch duration in hours
    TIMESTAMPDIFF(HOUR, db.start_time, db.end_time) as batch_duration_hours,
    
    -- Production rate
    SUM(ft.units_produced) / NULLIF(TIMESTAMPDIFF(HOUR, db.start_time, db.end_time), 0) as units_per_hour
    
FROM fact_machine_telemetry ft
JOIN dim_batch db ON ft.batch_id = db.batch_id
JOIN dim_machine dm ON ft.machine_id = dm.machine_id
GROUP BY db.batch_id, db.start_time, db.end_time, db.total_units, db.target_quality, db.product_type, dm.department, dm.machine_id;

-- =============================================
-- DATA QUALITY AND VALIDATION
-- =============================================

-- Create comprehensive data quality report
-- Expected: View 'gold_data_quality_report' created with data quality metrics
CREATE VIEW gold_data_quality_report AS
SELECT 
    'Gold Layer Complete' as status,
    (SELECT COUNT(*) FROM dim_machine) as machine_count,
    (SELECT COUNT(*) FROM dim_time) as time_records,
    (SELECT COUNT(*) FROM dim_operator) as operator_count,
    (SELECT COUNT(*) FROM fact_machine_telemetry) as fact_records,
    (SELECT COUNT(*) FROM gold_ml_features) as ml_features_count,
    (SELECT AVG(failure_imminent) FROM fact_machine_telemetry) as overall_failure_rate,
    (SELECT ROUND(100.0 * SUM(temperature_imputed) / COUNT(*), 2) FROM fact_machine_telemetry) as pct_imputed_temps,
    (SELECT MIN(timestamp) FROM dim_time) as data_start_date,
    (SELECT MAX(timestamp) FROM dim_time) as data_end_date;

-- Analyze failure distribution by department
-- Expected: Show failure patterns across different departments
SELECT 
    dm.department,
    COUNT(DISTINCT dm.machine_id) as machine_count,
    SUM(ft.failure_imminent) as total_failures,
    ROUND(100.0 * SUM(ft.failure_imminent) / COUNT(*), 4) as failure_rate_pct,
    AVG(ft.quality_pass) as avg_quality
FROM fact_machine_telemetry ft
JOIN dim_machine dm ON ft.machine_id = dm.machine_id
GROUP BY dm.department
ORDER BY failure_rate_pct DESC;

-- =============================================
-- FINAL TESTING AND VALIDATION
-- =============================================

-- Test ML Features View
-- Expected: Display sample of ML-ready features
SELECT 'ML Features Sample' as test_name;
SELECT * FROM gold_ml_features LIMIT 5;

-- Test Equipment Health View
-- Expected: Display sample of equipment health scores
SELECT 'Equipment Health Sample' as test_name;
SELECT * FROM gold_equipment_health LIMIT 5;

-- Test Maintenance Signals View
-- Expected: Display sample of maintenance alerts
SELECT 'Maintenance Signals Sample' as test_name;
SELECT * FROM gold_maintenance_signals LIMIT 5;

-- Test Production Efficiency View
-- Expected: Display sample of production efficiency metrics
SELECT 'Production Efficiency Sample' as test_name;
SELECT * FROM gold_production_efficiency LIMIT 5;

-- Test Data Quality Report
-- Expected: Display overall data quality summary
SELECT 'Data Quality Report' as test_name;
SELECT * FROM gold_data_quality_report;

-- Analyze feature correlations for predictive modeling
-- Expected: Show correlation coefficients between features and failure target
SELECT 
    CORR(temperature_c, failure_imminent) as temp_failure_corr,
    CORR(vibration_rms, failure_imminent) as vibe_failure_corr,
    CORR(accumulated_stress_index, failure_imminent) as stress_failure_corr,
    CORR(days_since_last_repair, failure_imminent) as repair_failure_corr
FROM gold_ml_features;

-- =============================================
-- DATA EXPORT FOR MACHINE LEARNING (OPTIONAL)
-- =============================================

-- Export ML-ready dataset (uncomment if your database supports file export)
/*
SELECT * FROM gold_ml_features 
WHERE temperature_imputed = FALSE 
   AND vibration_imputed = FALSE
   AND power_imputed = FALSE
ORDER BY timestamp, machine_id
INTO OUTFILE '/tmp/ml_ready_data.csv'
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
*/

-- =============================================
-- COMPLETION SUMMARY
-- =============================================

-- Final success message
SELECT 'PREDICTIVE MAINTENANCE DATA WAREHOUSE BUILD COMPLETE!' as completion_status;

-- Show final table counts
SELECT 
    'Bronze Layer: ' as layer, (SELECT COUNT(*) FROM staging_tbl) as record_count
UNION ALL
SELECT 
    'Silver Layer: ', (SELECT COUNT(*) FROM silver_telemetry_enhanced)
UNION ALL
SELECT 
    'Gold Layer - Fact: ', (SELECT COUNT(*) FROM fact_machine_telemetry)
UNION ALL
SELECT 
    'Gold Layer - ML Features: ', (SELECT COUNT(*) FROM gold_ml_features);