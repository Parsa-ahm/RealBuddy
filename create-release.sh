#!/bin/bash
set -e

# Create and push the v1.0.0 tag
git tag v1.0.0 2>/dev/null || true
git push origin v1.0.0

echo "Release tag v1.0.0 created and pushed!"
echo "GitHub Actions will automatically build and create the release."
echo "Check: https://github.com/Parsa-ahm/RealBuddy/actions"
