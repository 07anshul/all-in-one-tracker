#!/bin/bash
# Vercel's "Ignored Build Step": exit 0 skips the deploy, exit 1 proceeds.
# Data-only saves commit just data/graph.json — since the app reads that
# file live from GitHub on every request, those commits don't need a
# rebuild. Real code changes still deploy as normal.
PREV="${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}"
git diff --quiet "$PREV" HEAD -- . ':(exclude)data/graph.json'
