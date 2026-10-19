#!/usr/bin/env bash
set -euo pipefail

version="v26.10.10"
sha256="15db760bfbc24c0492ee997784b48a7b5e1bc5032950d617cd252fc2195f7ac7"
url="https://github.com/2dust/AndroidLibXrayLite/releases/download/${version}/libv2ray.aar"
destination="android/app/libs/libv2ray.aar"

mkdir -p "$(dirname "$destination")"
temporary_file="$(mktemp)"
trap 'rm -f "$temporary_file"' EXIT

curl --fail --location --silent --show-error "$url" --output "$temporary_file"
printf '%s  %s\n' "$sha256" "$temporary_file" | sha256sum --check --status
install -m 0644 "$temporary_file" "$destination"