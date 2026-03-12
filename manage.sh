#!/bin/bash
# ============================================
# Situation Desk - Run Manager
# ============================================
# Usage: ./manage.sh [command]
#
# Commands:
#   start       Start the development server
#   stop        Stop all running instances
#   restart     Restart the server
#   status      Check if server is running
#   build       Build for production
#   preview     Preview production build
#   test        Run tests and linting
#   logs        Tail the log file
#   clean       Clean build artifacts and logs
#   setup       Initial setup (install deps, create tables)
#   health      Check API health endpoints
#   help        Show this help message
# ============================================

set -e

# Configuration
APP_NAME="situation-desk"
PORT=5173
PREVIEW_PORT=4173
LOG_DIR="./logs"
LOG_FILE="$LOG_DIR/app.log"
PID_FILE="$LOG_DIR/app.pid"
BUILD_DIR="./dist"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================
# Helper Functions
# ============================================

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

ensure_log_dir() {
    mkdir -p "$LOG_DIR"
}

get_pid() {
    if [ -f "$PID_FILE" ]; then
        cat "$PID_FILE"
    else
        # Try to find by port
        lsof -ti:$PORT 2>/dev/null || echo ""
    fi
}

is_running() {
    local pid=$(get_pid)
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
        return 0
    fi
    return 1
}

# ============================================
# Commands
# ============================================

cmd_start() {
    log "Starting $APP_NAME..."
    
    if is_running; then
        warn "Server is already running (PID: $(get_pid))"
        return 1
    fi
    
    ensure_log_dir
    
    # Start the dev server in background
    nohup npm run dev >> "$LOG_FILE" 2>&1 &
    local pid=$!
    echo $pid > "$PID_FILE"
    
    # Wait for server to start
    sleep 2
    
    if is_running; then
        success "Server started (PID: $pid)"
        log "Dev server: http://localhost:$PORT"
        log "Logs: $LOG_FILE"
    else
        error "Failed to start server. Check logs: $LOG_FILE"
        return 1
    fi
}

cmd_stop() {
    log "Stopping $APP_NAME..."
    
    local pid=$(get_pid)
    
    if [ -z "$pid" ]; then
        warn "No running server found"
        return 0
    fi
    
    # Kill the process and its children
    kill -TERM "$pid" 2>/dev/null || true
    
    # Also kill any processes on the port
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    lsof -ti:$PREVIEW_PORT | xargs kill -9 2>/dev/null || true
    
    # Clean up PID file
    rm -f "$PID_FILE"
    
    success "Server stopped"
}

cmd_restart() {
    log "Restarting $APP_NAME..."
    cmd_stop
    sleep 1
    cmd_start
}

cmd_status() {
    echo ""
    echo "═══════════════════════════════════════════"
    echo "  $APP_NAME Status"
    echo "═══════════════════════════════════════════"
    
    if is_running; then
        local pid=$(get_pid)
        success "Server is RUNNING (PID: $pid)"
        echo ""
        echo "  Dev URL:     http://localhost:$PORT"
        echo "  Preview URL: http://localhost:$PREVIEW_PORT"
        echo "  Log file:    $LOG_FILE"
        echo ""
        
        # Show resource usage
        if command -v ps &> /dev/null; then
            echo "  Resource Usage:"
            ps -p $pid -o %cpu,%mem,etime 2>/dev/null | tail -1 | awk '{print "    CPU: "$1"%  MEM: "$2"%  Uptime: "$3}'
        fi
    else
        error "Server is NOT RUNNING"
    fi
    
    echo ""
    
    # Check if build exists
    if [ -d "$BUILD_DIR" ]; then
        local build_size=$(du -sh "$BUILD_DIR" 2>/dev/null | cut -f1)
        success "Production build exists ($build_size)"
    else
        warn "No production build found. Run: ./manage.sh build"
    fi
    
    echo "═══════════════════════════════════════════"
    echo ""
}

cmd_build() {
    log "Building $APP_NAME for production..."
    
    ensure_log_dir
    
    # Run build
    npm run build 2>&1 | tee -a "$LOG_FILE"
    
    if [ -d "$BUILD_DIR" ]; then
        local build_size=$(du -sh "$BUILD_DIR" | cut -f1)
        success "Build complete: $BUILD_DIR ($build_size)"
    else
        error "Build failed"
        return 1
    fi
}

cmd_preview() {
    log "Starting production preview server..."
    
    if [ ! -d "$BUILD_DIR" ]; then
        warn "No build found. Building first..."
        cmd_build
    fi
    
    ensure_log_dir
    
    # Start preview server
    nohup npm run preview >> "$LOG_FILE" 2>&1 &
    local pid=$!
    
    sleep 2
    success "Preview server started (PID: $pid)"
    log "Preview URL: http://localhost:$PREVIEW_PORT"
}

cmd_test() {
    log "Running tests and checks..."
    echo ""
    
    ensure_log_dir
    local test_log="$LOG_DIR/test-$(date '+%Y%m%d-%H%M%S').log"
    
    # TypeScript check
    echo "── TypeScript Check ──"
    if npx tsc --noEmit 2>&1 | tee -a "$test_log"; then
        success "TypeScript: No errors"
    else
        error "TypeScript: Errors found"
    fi
    echo ""
    
    # Lint check
    echo "── ESLint Check ──"
    if npm run lint 2>&1 | tee -a "$test_log"; then
        success "ESLint: No errors"
    else
        warn "ESLint: Warnings/errors found (see above)"
    fi
    echo ""
    
    # Build check
    echo "── Build Check ──"
    if npm run build 2>&1 | tee -a "$test_log"; then
        success "Build: Successful"
    else
        error "Build: Failed"
        return 1
    fi
    echo ""
    
    success "All tests complete. Log: $test_log"
}

cmd_logs() {
    if [ ! -f "$LOG_FILE" ]; then
        warn "No log file found at $LOG_FILE"
        return 1
    fi
    
    log "Tailing $LOG_FILE (Ctrl+C to exit)..."
    echo ""
    tail -f "$LOG_FILE"
}

cmd_clean() {
    log "Cleaning build artifacts and logs..."
    
    # Stop server if running
    if is_running; then
        cmd_stop
    fi
    
    # Remove build directory
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
        success "Removed $BUILD_DIR"
    fi
    
    # Remove logs
    if [ -d "$LOG_DIR" ]; then
        rm -rf "$LOG_DIR"
        success "Removed $LOG_DIR"
    fi
    
    # Remove node_modules cache
    if [ -d "node_modules/.vite" ]; then
        rm -rf "node_modules/.vite"
        success "Removed Vite cache"
    fi
    
    success "Clean complete"
}

cmd_setup() {
    log "Setting up $APP_NAME..."
    echo ""
    
    ensure_log_dir
    
    # Install dependencies
    echo "── Installing Dependencies ──"
    npm install 2>&1 | tee -a "$LOG_FILE"
    success "Dependencies installed"
    echo ""
    
    # Build
    echo "── Building Application ──"
    npm run build 2>&1 | tee -a "$LOG_FILE"
    success "Build complete"
    echo ""
    
    # Show SQL setup instructions
    echo "── Snowflake Setup Required ──"
    echo ""
    echo "  Run the following SQL in your Snowflake worksheet:"
    echo ""
    echo "  -- Option 1: Source the file"
    echo "  !source sql/osint_tables.sql"
    echo ""
    echo "  -- Option 2: Copy/paste contents of sql/osint_tables.sql"
    echo ""
    warn "Snowflake tables must be created before data persistence works"
    echo ""
    
    success "Setup complete!"
    echo ""
    echo "  Next steps:"
    echo "    1. Run Snowflake SQL: sql/osint_tables.sql"
    echo "    2. Start backend proxy on port 8080"
    echo "    3. Run: ./manage.sh start"
    echo ""
}

cmd_health() {
    log "Checking API health..."
    echo ""
    
    local apis=(
        "USGS Earthquakes|https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=1"
        "NWS Alerts|https://api.weather.gov/alerts/active?limit=1"
        "CoinGecko|https://api.coingecko.com/api/v3/ping"
        "OpenSky|https://opensky-network.org/api/states/all?lamin=40&lomin=-74&lamax=41&lomax=-73"
        "Reddit|https://www.reddit.com/r/worldnews/hot.json?limit=1"
    )
    
    for api in "${apis[@]}"; do
        IFS='|' read -r name url <<< "$api"
        
        # Check if curl is available
        if command -v curl &> /dev/null; then
            local status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null)
            
            if [ "$status" = "200" ]; then
                success "$name: OK ($status)"
            elif [ "$status" = "000" ]; then
                error "$name: Timeout/Unreachable"
            else
                warn "$name: HTTP $status"
            fi
        else
            warn "curl not available - skipping health checks"
            break
        fi
    done
    
    echo ""
    
    # Check local server
    if is_running; then
        local local_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "http://localhost:$PORT" 2>/dev/null)
        if [ "$local_status" = "200" ]; then
            success "Local Dev Server: OK ($local_status)"
        else
            warn "Local Dev Server: HTTP $local_status"
        fi
    else
        warn "Local Dev Server: Not running"
    fi
}

cmd_help() {
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "  $APP_NAME - Run Manager"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "  Usage: ./manage.sh [command]"
    echo ""
    echo "  Commands:"
    echo "    start     Start the development server"
    echo "    stop      Stop all running instances"
    echo "    restart   Restart the server"
    echo "    status    Check if server is running"
    echo "    build     Build for production"
    echo "    preview   Preview production build"
    echo "    test      Run tests and linting"
    echo "    logs      Tail the log file"
    echo "    clean     Clean build artifacts and logs"
    echo "    setup     Initial setup (install deps)"
    echo "    health    Check API health endpoints"
    echo "    help      Show this help message"
    echo ""
    echo "  Examples:"
    echo "    ./manage.sh start      # Start dev server"
    echo "    ./manage.sh status     # Check status"
    echo "    ./manage.sh logs       # View live logs"
    echo "    ./manage.sh test       # Run all checks"
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo ""
}

# ============================================
# Main
# ============================================

main() {
    local cmd="${1:-help}"
    
    case "$cmd" in
        start)    cmd_start ;;
        stop)     cmd_stop ;;
        restart)  cmd_restart ;;
        status)   cmd_status ;;
        build)    cmd_build ;;
        preview)  cmd_preview ;;
        test)     cmd_test ;;
        logs)     cmd_logs ;;
        clean)    cmd_clean ;;
        setup)    cmd_setup ;;
        health)   cmd_health ;;
        help|-h|--help) cmd_help ;;
        *)
            error "Unknown command: $cmd"
            cmd_help
            exit 1
            ;;
    esac
}

main "$@"
