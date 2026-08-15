#!/usr/bin/env bash
# Deploys src/ to the S3 + CloudFront production bucket.
#
# The only non-literal step: css/site.css is minified on the way out.
# The source in src/css/site.css stays hand-authored/readable in git —
# this script generates a temporary minified copy and uploads that
# instead, so a plain `aws s3 sync` never overwrites it with the
# readable version. That's the whole reason this script exists instead
# of just running aws s3 sync directly.
set -euo pipefail

PROFILE="${AWS_PROFILE:-work}"
BUCKET="mac-precitec-india-site"
DIST_ID="E2C76S57OWFSXZ"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$ROOT/src"

echo "==> Minifying css/site.css for deploy (source stays readable in git)"
TMP_CSS="$(mktemp -t site.min.XXXXXX.css)"
trap 'rm -f "$TMP_CSS"' EXIT
npx --yes csso-cli "$SRC/css/site.css" -o "$TMP_CSS"
echo "    $(wc -c < "$SRC/css/site.css") bytes -> $(wc -c < "$TMP_CSS") bytes"

echo "==> Syncing non-HTML assets (long cache, immutable)"
aws s3 sync "$SRC" "s3://$BUCKET/" --delete --profile "$PROFILE" \
  --exclude "*.html" --exclude "css/site.css" \
  --cache-control "public,max-age=31536000,immutable"

echo "==> Uploading minified css/site.css"
aws s3 cp "$TMP_CSS" "s3://$BUCKET/css/site.css" --profile "$PROFILE" \
  --cache-control "public,max-age=31536000,immutable" --content-type "text/css"

echo "==> Syncing HTML (must-revalidate)"
aws s3 sync "$SRC" "s3://$BUCKET/" --delete --profile "$PROFILE" \
  --exclude "*" --include "*.html" \
  --cache-control "public,max-age=0,must-revalidate"

echo "==> Syncing sitemap.xml (must-revalidate, not immutable — it changes)"
aws s3 cp "$SRC/sitemap.xml" "s3://$BUCKET/sitemap.xml" --profile "$PROFILE" \
  --cache-control "public,max-age=0,must-revalidate" --content-type "application/xml"

echo "==> Invalidating CloudFront"
aws cloudfront create-invalidation --profile "$PROFILE" --distribution-id "$DIST_ID" --paths "/*" \
  --query '{Id:Invalidation.Id,Status:Invalidation.Status}' --output table

echo "==> Done."
