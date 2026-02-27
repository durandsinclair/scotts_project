#!/bin/bash
python3 -c "
import json, sys, datetime

data = json.load(sys.stdin)
prompt = data.get('prompt', '')
timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
log_file = '/Users/durandsinclair/Documents/training2/scotts_portfolio/docs/conversation_log.md'

entry = f'\n---\n\n**[{timestamp}] USER:** {prompt}\n'
with open(log_file, 'a') as f:
    f.write(entry)
"
