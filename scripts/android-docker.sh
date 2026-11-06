#!/usr/bin/env bash
#
# Build the Android app inside the reactnativecommunity/react-native-android
# Docker image, adding the exact NDK version required by this project.
#
# Usage:
#   scripts/android-docker.sh                    # :app:assembleRelease
#   scripts/android-docker.sh :app:assembleDebug
#   scripts/android-docker.sh :app:assembleRelease -PreactNativeArchitectures=arm64-v8a
#
# Environment overrides:
#   RN_ANDROID_IMAGE       derived image tag      (default: cutmer-rn-android:ndk27)
#   RN_ANDROID_BASE_IMAGE  upstream image          (default: reactnativecommunity/react-native-android:latest)
#   RN_ANDROID_NDK_VERSION NDK required by RN      (default: 27.1.12297006)
#   RN_ANDROID_GRADLE_HOME isolated Gradle cache   (default: ~/.cache/cutmer-docker/gradle-home)

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE="${RN_ANDROID_IMAGE:-cutmer-rn-android:ndk27}"
BASE_IMAGE="${RN_ANDROID_BASE_IMAGE:-reactnativecommunity/react-native-android:latest}"
NDK_VERSION="${RN_ANDROID_NDK_VERSION:-27.1.12297006}"
GRADLE_HOME_DIR="${RN_ANDROID_GRADLE_HOME:-$HOME/.cache/cutmer-docker/gradle-home}"

TASK="${1:-:app:assembleRelease}"
shift || true

if [[ ! -x "$ROOT/android/gradlew" ]]; then
  echo "error: $ROOT/android/gradlew not found. Run 'npx expo prebuild --platform android' first." >&2
  exit 1
fi

if ! docker image inspect "$IMAGE" >/dev/null 2>&1; then
  echo "==> Building $IMAGE from $BASE_IMAGE (adding NDK $NDK_VERSION)"
  docker build -t "$IMAGE" -f - "$ROOT/scripts" <<EOF
FROM $BASE_IMAGE
RUN yes | sdkmanager "ndk;$NDK_VERSION" >/dev/null
EOF
fi

# Reuse the host's downloaded dependencies to avoid re-fetching ~1.7 GB.
# Hardlinks keep this free in disk space, but also link the host daemon's lock
# files, so drop them afterwards to let the container create its own.
mkdir -p "$GRADLE_HOME_DIR/caches" "$GRADLE_HOME_DIR/wrapper"
for dir in caches/modules-2 wrapper/dists; do
  if [[ -d "$HOME/.gradle/$dir" && ! -e "$GRADLE_HOME_DIR/$dir" ]]; then
    cp -al "$HOME/.gradle/$dir" "$GRADLE_HOME_DIR/$dir" 2>/dev/null || true
  fi
done
find "$GRADLE_HOME_DIR" -name '*.lock' -delete 2>/dev/null || true

echo "==> Running ./gradlew $TASK"
docker run --rm \
  --user "$(id -u):$(id -g)" \
  -e HOME=/tmp \
  -e GRADLE_USER_HOME=/gradle-home \
  -e CI=1 \
  -e EXPO_NO_TELEMETRY=1 \
  -v "$ROOT:$ROOT" \
  -v "$GRADLE_HOME_DIR:/gradle-home" \
  -w "$ROOT/android" \
  "$IMAGE" \
  ./gradlew "$TASK" "$@" --no-daemon --console=plain

echo "==> Artifacts in $ROOT/android/app/build/outputs/apk/"
