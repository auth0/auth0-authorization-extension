#!/bin/bash
set -e

resolve_path() {
    local env="$1"
    local base_path="$2"

    case "$env" in
        dev)
            echo "$base_path/develop/$EXTENSION_NAME"
            ;;
        prod)
            echo "$base_path/$EXTENSION_NAME"
            ;;
        *)
            echo "Invalid environment. Use 'prod' or 'develop'." >&2
            exit 1
            ;;
    esac
}

upload_to_s3() {
  local local_file=$1
  local s3_path=$2
  local cache_control=$3
  local web_path=$4

  if [ -z "$cache_control" ]; then
    aws s3 cp "$local_file" "$s3_path" --region "$REGION" --acl public-read
  else
    aws s3 cp "$local_file" "$s3_path" --region "$REGION" --acl public-read --cache-control "$cache_control"
  fi

  echo -e "$local_file uploaded to the $s3_path ✅"
  echo -e "It's now available at: $web_path 🌐 \n"
}

upload_bundle() {
  echo -e "1. Uploading backend assets ⚙️: \n"

  local local_bundle="$EXTENSION_NAME.extension.$CURRENT_VERSION.js"
  local bundle_local_path="dist/$local_bundle"

  if [[ ! -f "$bundle_local_path" ]]; then
      echo "Error: Missing asset - $bundle_local_path"
      exit 1
  fi

  # upload bundle with full version:
  local remote_bundle="$EXTENSION_NAME-$CURRENT_VERSION.js"
  local bundle_s3_path="$S3_PATH/$remote_bundle"
  local web_path="$CDN_PATH/$remote_bundle"
  upload_to_s3 "$bundle_local_path" "$bundle_s3_path" "" "$web_path"

  # upload bundle with major.minor version:
  local remote_bundle="$EXTENSION_NAME-$MAJOR_MINOR_VERSION.js"
  local bundle_s3_path="$S3_PATH/$remote_bundle"
  local web_path="$CDN_PATH/$remote_bundle"
  upload_to_s3 "$bundle_local_path" "$bundle_s3_path" "" "$web_path"
}

upload_assets() {
  echo -e "2. Uploading frontend assets 💅: \n"

  local assets=(
    "$EXTENSION_NAME.ui.$CURRENT_VERSION.js"
    "$EXTENSION_NAME.ui.$CURRENT_VERSION.css"
    "$EXTENSION_NAME.ui.vendors.$CURRENT_VERSION.js"
    "manifest.json"
  )

  for asset in "${assets[@]}"; do
    local asset_local_path="dist/$asset"
    local asset_s3_path="$S3_PATH/assets/$asset"
    local web_path="$CDN_PATH/assets/$asset"

    if [[ ! -f "$asset_local_path" ]]; then
        echo "Error: Missing asset - $asset"
        exit 1
    fi

    upload_to_s3 "$asset_local_path" "$asset_s3_path" "60" "$web_path"
  done
}

MODE="$1" # "dev" or "prod"

CURRENT_VERSION=$(node tools/get_version.js)
MAJOR_MINOR_VERSION=$(echo "$CURRENT_VERSION" | cut -d '.' -f 1,2)

EXTENSION_NAME="auth0-authz"
REGION="us-west-1"

S3_PATH=$(resolve_path "$MODE" "s3://assets.us.auth0.com/extensions")
CDN_PATH=$(resolve_path "$MODE" "https://cdn.auth0.com/extensions")

upload_bundle
upload_assets

echo -e "\n🎉 Success! The extension has been successfully uploaded to the CDN. 🚀"
