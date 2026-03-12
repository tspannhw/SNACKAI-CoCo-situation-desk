/**
 * Situation Desk Backend Server
 * 
 * This server handles Snowflake queries via Cortex CLI and proxies
 * data to the frontend application.
 * 
 * Run with: node server.js
 * Default port: 8080
 */

import express from 'express'
import cors from 'cors'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
const app = express()
const PORT = process.env.PORT || 8080

// Middleware
app.use(cors())
app.use(express.json())

// Snowflake connection name
const SNOWFLAKE_CONNECTION = 'tspann1'

/**
 * Execute a Snowflake SQL query using cortex CLI
 */
async function executeSnowflakeQuery(sql) {
  try {
    // Use cortex CLI to execute the query
    const { stdout, stderr } = await execAsync(
      `cortex sql "${sql.replace(/"/g, '\\"')}" --connection ${SNOWFLAKE_CONNECTION} --output json`,
      { maxBuffer: 50 * 1024 * 1024 } // 50MB buffer for large results
    )
    
    if (stderr && !stderr.includes('Warning')) {
      console.error('Snowflake stderr:', stderr)
    }
    
    return JSON.parse(stdout)
  } catch (error) {
    console.error('Snowflake query error:', error.message)
    throw error
  }
}

/**
 * POST /api/snowflake/query
 * Execute a Snowflake query and return results
 */
app.post('/api/snowflake/query', async (req, res) => {
  const { sql } = req.body
  
  if (!sql) {
    return res.status(400).json({ error: 'SQL query is required' })
  }
  
  console.log(`[${new Date().toISOString()}] Executing query:`, sql.substring(0, 100) + '...')
  
  try {
    const results = await executeSnowflakeQuery(sql)
    res.json({ success: true, data: results })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: 'Failed to execute Snowflake query'
    })
  }
})

/**
 * POST /api/snowflake/execute
 * Alias for /query - handles execute requests
 */
app.post('/api/snowflake/execute', async (req, res) => {
  const { sql, query } = req.body
  const sqlQuery = sql || query
  
  if (!sqlQuery) {
    return res.status(400).json({ error: 'SQL query is required' })
  }
  
  console.log(`[${new Date().toISOString()}] Executing:`, sqlQuery.substring(0, 100) + '...')
  
  try {
    const results = await executeSnowflakeQuery(sqlQuery)
    res.json({ success: true, data: results })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: 'Failed to execute Snowflake query'
    })
  }
})

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    connection: SNOWFLAKE_CONNECTION
  })
})

/**
 * GET /api/snowflake/test
 * Test Snowflake connection
 */
app.get('/api/snowflake/test', async (req, res) => {
  try {
    const results = await executeSnowflakeQuery('SELECT CURRENT_TIMESTAMP() as now, CURRENT_USER() as user')
    res.json({ 
      success: true, 
      message: 'Snowflake connection successful',
      data: results
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Snowflake connection failed'
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    SITUATION DESK SERVER                        ║
╠════════════════════════════════════════════════════════════════╣
║  Backend API running on: http://localhost:${PORT}                 ║
║  Snowflake connection:   ${SNOWFLAKE_CONNECTION}                            ║
║                                                                  ║
║  Endpoints:                                                      ║
║    POST /api/snowflake/query   - Execute SQL queries             ║
║    POST /api/snowflake/execute - Execute SQL (alias)             ║
║    GET  /api/snowflake/test    - Test connection                 ║
║    GET  /api/health            - Health check                    ║
╚════════════════════════════════════════════════════════════════╝
  `)
})
