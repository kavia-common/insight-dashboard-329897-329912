#!/bin/bash
cd /home/kavia/workspace/code-generation/insight-dashboard-329897-329912/dashboard_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

