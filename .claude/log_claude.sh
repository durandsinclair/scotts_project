#!/bin/bash
python3 -c "
import json, sys, datetime

data = json.load(sys.stdin)
response = data.get('last_assistant_message', '')
timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
log_file = '/Users/durandsinclair/Documents/training2/scotts_portfolio/docs/conversation_log.md'

entry = f'\n**[{timestamp}] CLAUDE:** {response}\n'
with open(log_file, 'a') as f:
    f.write(entry)
"
