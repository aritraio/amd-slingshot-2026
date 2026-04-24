#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# NutriScan — One-Click GCP Cloud Run Deployment
# ═══════════════════════════════════════════════════════════════

set -e

# ─── Configuration ──────────────────────────────────────────────
PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="nutriscan"
GOOGLE_API_KEY="${GOOGLE_API_KEY:?Error: GOOGLE_API_KEY environment variable is required}"

echo "🥗 NutriScan — Deploying to GCP Cloud Run"
echo "──────────────────────────────────────────"
echo "Project:  $PROJECT_ID"
echo "Region:   $REGION"
echo "Service:  $SERVICE_NAME"
echo ""

# ─── Enable APIs ────────────────────────────────────────────────
echo "📦 Enabling required APIs..."
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com --project="$PROJECT_ID"

# ─── Deploy ─────────────────────────────────────────────────────
echo "🚀 Building and deploying..."
gcloud run deploy "$SERVICE_NAME" \
    --source . \
    --region "$REGION" \
    --project "$PROJECT_ID" \
    --allow-unauthenticated \
    --set-env-vars "GOOGLE_API_KEY=$GOOGLE_API_KEY" \
    --memory 512Mi \
    --cpu 1 \
    --timeout 120 \
    --min-instances 0 \
    --max-instances 3

# ─── Get URL ────────────────────────────────────────────────────
URL=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --project="$PROJECT_ID" --format="value(status.url)")

echo ""
echo "══════════════════════════════════════════"
echo "✅ NutriScan deployed successfully!"
echo "🌐 URL: $URL"
echo "══════════════════════════════════════════"
