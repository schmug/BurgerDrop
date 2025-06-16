#!/bin/bash

# Script to set up branch protection rules for the main branch
# This should be run by a repository administrator

echo "🔒 Setting up branch protection for BurgerDrop"
echo "============================================"
echo ""
echo "This script will guide you through setting up branch protection rules"
echo "that enforce the TDD workflow outlined in CLAUDE.md"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo "Please run: gh auth login"
    exit 1
fi

# Get repository info
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
if [ -z "$REPO" ]; then
    echo "❌ Could not determine repository. Make sure you're in a git repository."
    exit 1
fi

echo "Repository: $REPO"
echo ""

# Confirm before proceeding
read -p "Do you want to set up branch protection for the 'main' branch? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Setting up branch protection rules..."

# Create branch protection rule
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "/repos/$REPO/branches/main/protection" \
  -f "required_status_checks[strict]=true" \
  -f "required_status_checks[contexts][]=Test Suite (18.x)" \
  -f "required_status_checks[contexts][]=Test Suite (20.x)" \
  -f "required_status_checks[contexts][]=Build Verification" \
  -f "required_status_checks[contexts][]=PR Status Summary" \
  -f "enforce_admins=true" \
  -f "required_pull_request_reviews[required_approving_review_count]=1" \
  -f "required_pull_request_reviews[dismiss_stale_reviews]=true" \
  -f "required_pull_request_reviews[require_code_owner_reviews]=false" \
  -f "required_pull_request_reviews[require_last_push_approval]=true" \
  -f "restrictions=null" \
  -f "allow_force_pushes=false" \
  -f "allow_deletions=false" \
  -f "required_conversation_resolution=true" \
  -f "lock_branch=false" \
  -f "allow_auto_merge=false"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Branch protection successfully configured!"
    echo ""
    echo "The following rules are now active:"
    echo "- All tests must pass before merging"
    echo "- Build verification required"
    echo "- At least 1 approving review required"
    echo "- Stale reviews dismissed on new commits"
    echo "- Administrators must follow rules"
    echo "- Force pushes disabled"
    echo "- Branch deletion disabled"
    echo "- All conversations must be resolved"
    echo ""
    echo "These rules enforce the TDD workflow described in CLAUDE.md"
else
    echo ""
    echo "❌ Failed to set up branch protection."
    echo "You may need admin permissions on the repository."
fi