#!/bin/bash

# DataMa Icons - Multi-Environment CDN Setup Script
# This script helps you set up Google Cloud Storage for hosting DataMa Icons
# Supports both staging and production environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌐 DataMa Icons Multi-Environment CDN Setup${NC}"
echo "=============================================="

# Check if user is logged in to gcloud
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}❌ You must be logged in to Google Cloud CLI${NC}"
    echo "Run: gcloud auth login"
    exit 1
fi

# Get current project
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ No Google Cloud project selected${NC}"
    echo "Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo -e "📋 Current project: ${YELLOW}$PROJECT_ID${NC}"

# Ask which environments to set up
echo ""
echo -e "${PURPLE}🎯 Which environments do you want to set up?${NC}"
echo "1. Staging only"
echo "2. Production only"
echo "3. Both environments (recommended)"
read -p "Select option (1-3): " ENV_CHOICE

case $ENV_CHOICE in
    1) SETUP_STAGING=true; SETUP_PRODUCTION=false ;;
    2) SETUP_STAGING=false; SETUP_PRODUCTION=true ;;
    3) SETUP_STAGING=true; SETUP_PRODUCTION=true ;;
    *) echo -e "${RED}❌ Invalid choice${NC}"; exit 1 ;;
esac

# Function to set up an environment
setup_environment() {
    local env_name="$1"
    local env_suffix="$2"
    
    echo ""
    echo -e "${BLUE}🔧 Setting up ${env_name} environment${NC}"
    echo "================================"
    
    # Ask for bucket name with examples
    if [ "$env_suffix" = "staging" ]; then
        read -p "🪣 Enter your ${env_name} bucket/domain name (e.g., ressources2.datama.io): " BUCKET_NAME
    else
        read -p "🪣 Enter your ${env_name} bucket/domain name (e.g., ressources.datama.io): " BUCKET_NAME
    fi
    
    if [ -z "$BUCKET_NAME" ]; then
        echo -e "${RED}❌ Bucket name cannot be empty${NC}"
        return 1
    fi
    
    # Ask for CDN path prefix
    echo ""
    echo "📁 Do you want to deploy files to a specific path in your bucket?"
    echo "   Example: /assets/js/icons for URL like https://ressources.datama.io/assets/js/icons/"
    read -p "Enter path prefix (leave empty for root, or enter like 'assets/js/icons'): " PATH_PREFIX
    
    # Construct CDN URL
    if [ -n "$PATH_PREFIX" ]; then
        # Remove leading/trailing slashes and format properly
        PATH_PREFIX=$(echo "$PATH_PREFIX" | sed 's:^/*::' | sed 's:/*$::')
        CDN_URL="https://$BUCKET_NAME/$PATH_PREFIX"
    else
        CDN_URL="https://$BUCKET_NAME"
    fi
    
    echo -e "🌐 Your CDN URL will be: ${YELLOW}$CDN_URL${NC}"
    
    # Ask for region (only once)
    if [ -z "$REGION" ]; then
        echo ""
        echo "🌍 Available regions:"
        echo "1. europe-west1 (Belgium)"
        echo "2. europe-west3 (Frankfurt)" 
        echo "3. us-central1 (Iowa)"
        echo "4. us-east1 (South Carolina)"
        echo "5. asia-southeast1 (Singapore)"
        read -p "Select region (1-5) or enter custom region: " REGION_CHOICE
        
        case $REGION_CHOICE in
            1) REGION="europe-west1" ;;
            2) REGION="europe-west3" ;;
            3) REGION="us-central1" ;;
            4) REGION="us-east1" ;;
            5) REGION="asia-southeast1" ;;
            *) REGION="$REGION_CHOICE" ;;
        esac
        
        echo -e "📍 Selected region: ${YELLOW}$REGION${NC}"
    fi
    
    # Create bucket
    echo ""
    echo -e "${BLUE}🔨 Creating ${env_name} bucket...${NC}"
    if gsutil mb -p "$PROJECT_ID" -c STANDARD -l "$REGION" "gs://$BUCKET_NAME"; then
        echo -e "${GREEN}✅ ${env_name} bucket created successfully${NC}"
    else
        echo -e "${YELLOW}⚠️ ${env_name} bucket might already exist, continuing...${NC}"
    fi
    
    # Set public read access
    echo -e "${BLUE}🔓 Setting public read access for ${env_name}...${NC}"
    gsutil iam ch allUsers:objectViewer "gs://$BUCKET_NAME"
    
    # Create service account
    SERVICE_ACCOUNT_NAME="datama-icons-deployer-${env_suffix}"
    SERVICE_ACCOUNT_EMAIL="$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com"
    
    echo -e "${BLUE}👤 Creating ${env_name} service account...${NC}"
    if gcloud iam service-accounts create "$SERVICE_ACCOUNT_NAME" \
        --display-name="DataMa Icons CDN Deployer ${env_name}" \
        --description="Service account for deploying DataMa Icons to ${env_name} CDN"; then
        echo -e "${GREEN}✅ ${env_name} service account created${NC}"
    else
        echo -e "${YELLOW}⚠️ ${env_name} service account might already exist, continuing...${NC}"
    fi
    
    # Grant permissions to service account
    echo -e "${BLUE}🔑 Granting ${env_name} bucket permissions...${NC}"
    gsutil iam ch serviceAccount:$SERVICE_ACCOUNT_EMAIL:objectAdmin "gs://$BUCKET_NAME"
    
    # Create service account key
    KEY_FILE="datama-icons-cdn-${env_suffix}-key.json"
    echo -e "${BLUE}🗝️ Creating ${env_name} service account key...${NC}"
    gcloud iam service-accounts keys create "$KEY_FILE" \
        --iam-account="$SERVICE_ACCOUNT_EMAIL"
    
    # Test deployment
    echo -e "${BLUE}🧪 Testing ${env_name} deployment...${NC}"
    echo '{"test":true,"environment":"'${env_name}'","timestamp":"'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"}' > test-${env_suffix}.json
    gsutil cp test-${env_suffix}.json "gs://$BUCKET_NAME/test/"
    
    # Verify public access
    echo -e "${BLUE}🔍 Testing ${env_name} public access...${NC}"
    if curl -s "https://storage.googleapis.com/$BUCKET_NAME/test/test-${env_suffix}.json" | grep -q '"test":true'; then
        echo -e "${GREEN}✅ ${env_name} public access working!${NC}"
    else
        echo -e "${YELLOW}⚠️ ${env_name} public access test failed, but bucket is created${NC}"
    fi
    
    # Cleanup test
    gsutil rm "gs://$BUCKET_NAME/test/test-${env_suffix}.json" 2>/dev/null || true
    rm test-${env_suffix}.json 2>/dev/null || true
    
    # Store environment configuration
    if [ "$env_suffix" = "staging" ]; then
        STAGING_BUCKET="$BUCKET_NAME"
        STAGING_SERVICE_ACCOUNT="$SERVICE_ACCOUNT_EMAIL"
        STAGING_KEY_FILE="$KEY_FILE"
        STAGING_CDN_URL="$CDN_URL"
    else
        PROD_BUCKET="$BUCKET_NAME"
        PROD_SERVICE_ACCOUNT="$SERVICE_ACCOUNT_EMAIL"
        PROD_KEY_FILE="$KEY_FILE"
        PROD_CDN_URL="$CDN_URL"
    fi
    
    echo -e "${GREEN}✅ ${env_name} environment setup complete!${NC}"
}

# Set up environments
if [ "$SETUP_STAGING" = true ]; then
    setup_environment "Staging" "staging"
fi

if [ "$SETUP_PRODUCTION" = true ]; then
    setup_environment "Production" "prod"
fi

# Show final configuration
echo ""
echo -e "${GREEN}🎉 Multi-Environment CDN Setup Complete!${NC}"
echo "=========================================="
echo ""
echo -e "${BLUE}📋 Configuration Summary:${NC}"
echo "• Project ID: $PROJECT_ID"
echo "• Region: $REGION"

if [ "$SETUP_STAGING" = true ]; then
    echo "• Staging Bucket: $STAGING_BUCKET"
    echo "• Staging Service Account: $STAGING_SERVICE_ACCOUNT"
    echo "• Staging CDN URL: $STAGING_CDN_URL"
fi

if [ "$SETUP_PRODUCTION" = true ]; then
    echo "• Production Bucket: $PROD_BUCKET"
    echo "• Production Service Account: $PROD_SERVICE_ACCOUNT"
    echo "• Production CDN URL: $PROD_CDN_URL"
fi

echo ""
echo -e "${BLUE}🔧 GitHub Secrets to Add:${NC}"
echo "================================"

if [ "$SETUP_STAGING" = true ]; then
    echo ""
    echo -e "${PURPLE}📝 STAGING Environment Secrets:${NC}"
    echo ""
    echo "GCP_SERVICE_ACCOUNT_KEY_STAGING:"
    cat "$STAGING_KEY_FILE"
    echo ""
    echo "GCS_BUCKET_STAGING:"
    echo "$STAGING_BUCKET"
    echo ""
    echo "GCS_CDN_URL_STAGING:"
    echo "$STAGING_CDN_URL"
fi

if [ "$SETUP_PRODUCTION" = true ]; then
    echo ""
    echo -e "${GREEN}📝 PRODUCTION Environment Secrets:${NC}"
    echo ""
    echo "GCP_SERVICE_ACCOUNT_KEY_PROD:"
    cat "$PROD_KEY_FILE"
    echo ""
    echo "GCS_BUCKET_PROD:"
    echo "$PROD_BUCKET"
    echo ""
    echo "GCS_CDN_URL_PROD:"
    echo "$PROD_CDN_URL"
fi

echo ""
echo -e "${BLUE}🚀 How the New Pipeline Works:${NC}"
echo "================================="
echo ""
echo -e "${PURPLE}🧪 STAGING Deployments:${NC}"
echo "• Triggered by: git push origin staging"
echo "• Purpose: Testing and development"
echo "• Creates: timestamped builds (e.g., 1.1.0-staging.20240319.143022)"

if [ "$SETUP_STAGING" = true ]; then
    echo "• URL: $STAGING_CDN_URL/latest/"
fi

echo ""
echo -e "${GREEN}🚀 PRODUCTION Deployments:${NC}"
echo "• Triggered by: git push origin main (development) OR git tag v1.1.0 (release)"
echo "• Purpose: Live production usage"
echo "• Development builds: timestamped (e.g., 1.1.0-main.20240319.143022)"
echo "• Release builds: versioned (e.g., 1.1.0) + NPM publishing"

if [ "$SETUP_PRODUCTION" = true ]; then
    echo "• URL: $PROD_CDN_URL/latest/"
fi

echo ""
echo -e "${BLUE}🔄 Usage Examples:${NC}"
echo "=================="
echo ""
echo "# Deploy to staging for testing"
echo "git checkout staging"
echo "git merge main"
echo "git push origin staging"
echo ""
echo "# Deploy to production (development)"
echo "git checkout main"
echo "git push origin main"
echo ""
echo "# Create production release"
echo "./scripts/release.sh patch  # Creates tag and GitHub release"

echo ""
echo -e "${YELLOW}⚠️ Next Steps:${NC}"
echo "=================="
echo "1. Add ALL the GitHub secrets shown above to your repository:"
echo "   → Settings → Secrets and variables → Actions"
echo ""
if [ "$SETUP_STAGING" = true ]; then
    echo "2. Test staging deployment:"
    echo "   → git push origin staging"
    echo ""
fi
echo "3. Test production deployment:"
echo "   → git push origin main"
echo ""
echo "4. Create your first release:"
echo "   → ./scripts/release.sh patch"
echo ""
echo "5. Your CDN will be live after the first successful deployment!"

echo ""
echo -e "${BLUE}💾 Files created:${NC}"
if [ "$SETUP_STAGING" = true ]; then
    echo "• $STAGING_KEY_FILE (staging credentials)"
fi
if [ "$SETUP_PRODUCTION" = true ]; then
    echo "• $PROD_KEY_FILE (production credentials)"
fi

echo ""
echo -e "${RED}⚠️ SECURITY: Keep the key files secure and never commit them to git!${NC}"

# Optional: Set up custom domains
echo ""
read -p "🌐 Do you want to set up custom domains? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${BLUE}🌐 Custom Domain Setup${NC}"
    echo "================================"
    echo ""
    echo "To use custom domains:"
    echo ""
    
    echo "Your domains are already configured!"
    echo ""
    
    if [ "$SETUP_STAGING" = true ]; then
        echo -e "${PURPLE}Staging: $STAGING_CDN_URL${NC}"
        echo "Make sure your DNS points $STAGING_BUCKET to your GCS bucket"
        echo ""
    fi
    
    if [ "$SETUP_PRODUCTION" = true ]; then
        echo -e "${GREEN}Production: $PROD_CDN_URL${NC}"
        echo "Make sure your DNS points $PROD_BUCKET to your GCS bucket"
        echo ""
    fi
    
    echo "3. (Optional) Set up HTTPS with a load balancer:"
    echo "   https://cloud.google.com/storage/docs/hosting-static-website"
fi

echo ""
echo -e "${GREEN}✅ Multi-Environment Setup Completed!${NC}" 
echo -e "${PURPLE}🧪 Staging ready for development testing${NC}"
echo -e "${GREEN}🚀 Production ready for live deployment${NC}" 