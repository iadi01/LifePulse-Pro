import csv
import json
import os
import re
from collections import defaultdict, Counter

OUTPUT_DIR = '/Users/aadi/.gemini/antigravity/scratch/lifepulse/public/data'
os.makedirs(OUTPUT_DIR, exist_ok=True)

SPOTIFY_PATH = '/Users/aadi/Downloads/archive/spotify_history.csv'
TRANSACTIONS_PATH = '/Users/aadi/Downloads/archive/archive (2)/Augmented_IndiaTransactMultiFacet2024.csv'
HOUSEHOLD_PATH = '/Users/aadi/Downloads/Daily Household Transactions.csv'

print('Starting data preprocessing for LifePulse...')

# -------------------------------------------------------------
# 1. PROCESS HOUSEHOLD TRANSACTIONS
# -------------------------------------------------------------
print('Processing Household Transactions...')
household_rows = []
household_summary = {
    'total_income': 0.0,
    'total_expense': 0.0,
    'total_investment': 0.0,
    'total_records': 0,
    'categories': defaultdict(lambda: {'count': 0, 'amount': 0.0, 'type': 'Expense'}),
    'payment_modes': defaultdict(lambda: {'count': 0, 'amount': 0.0}),
    'monthly_trends': defaultdict(lambda: {'income': 0.0, 'expense': 0.0, 'investment': 0.0})
}

with open(HOUSEHOLD_PATH, 'r', encoding='utf-8', errors='replace') as f:
    reader = csv.DictReader(f)
    idx = 1
    for row in reader:
        date_str = (row.get('Date') or '').strip()
        mode = (row.get('Mode') or '').strip() or 'Unknown Mode'
        category = (row.get('Category') or '').strip() or 'Uncategorized'
        subcategory = (row.get('Subcategory') or '').strip() or 'None'
        note = (row.get('Note') or '').strip() or 'No note'
        amt_raw = (row.get('Amount') or '0').strip().replace(',', '')
        try:
            amt = float(amt_raw)
        except:
            amt = 0.0
        
        inc_exp = (row.get('Income/Expense') or '').strip() or 'Expense'
        currency = (row.get('Currency') or 'INR').strip()

        # Monthly key e.g. YYYY-MM
        month_key = 'Unknown'
        if date_str:
            parts = date_str.split(' ')[0].split('/')
            if len(parts) == 3:
                # dd/MM/yyyy
                day, month, year = parts
                if len(year) == 4 and len(month) <= 2:
                    month_key = f'{year}-{int(month):02d}'

        is_investment = 'investment' in category.lower() or 'fund' in category.lower() or 'deposit' in category.lower() or 'share' in category.lower()
        
        if inc_exp == 'Income':
            household_summary['total_income'] += amt
            if month_key != 'Unknown':
                household_summary['monthly_trends'][month_key]['income'] += amt
        else: # Expense or Transfer-Out
            household_summary['total_expense'] += amt
            if month_key != 'Unknown':
                household_summary['monthly_trends'][month_key]['expense'] += amt
            if is_investment:
                household_summary['total_investment'] += amt
                if month_key != 'Unknown':
                    household_summary['monthly_trends'][month_key]['investment'] += amt

        household_summary['categories'][category]['count'] += 1
        household_summary['categories'][category]['amount'] += amt
        household_summary['categories'][category]['type'] = inc_exp

        household_summary['payment_modes'][mode]['count'] += 1
        household_summary['payment_modes'][mode]['amount'] += amt

        clean_record = {
            'id': f'hh-{idx}',
            'date': date_str,
            'month': month_key,
            'mode': mode,
            'category': category,
            'subcategory': subcategory,
            'note': note,
            'amount': amt,
            'type': inc_exp,
            'currency': currency,
            'is_investment': is_investment
        }
        household_rows.append(clean_record)
        idx += 1

household_summary['total_records'] = len(household_rows)

# Format sorted monthly trends
sorted_hh_months = sorted([k for k in household_summary['monthly_trends'].keys() if k != 'Unknown'])
monthly_list = []
for m in sorted_hh_months:
    monthly_list.append({
        'month': m,
        'income': round(household_summary['monthly_trends'][m]['income'], 2),
        'expense': round(household_summary['monthly_trends'][m]['expense'], 2),
        'investment': round(household_summary['monthly_trends'][m]['investment'], 2),
    })

# Format category breakdown
cat_list = []
for cat, d in household_summary['categories'].items():
    cat_list.append({
        'category': cat,
        'count': d['count'],
        'amount': round(d['amount'], 2),
        'type': d['type']
    })
cat_list.sort(key=lambda x: x['amount'], reverse=True)

# Format payment mode breakdown
mode_list = []
for mode, d in household_summary['payment_modes'].items():
    mode_list.append({
        'mode': mode,
        'count': d['count'],
        'amount': round(d['amount'], 2)
    })
mode_list.sort(key=lambda x: x['amount'], reverse=True)

final_household = {
    'summary': {
        'total_income': round(household_summary['total_income'], 2),
        'total_expense': round(household_summary['total_expense'], 2),
        'total_investment': round(household_summary['total_investment'], 2),
        'net_balance': round(household_summary['total_income'] - household_summary['total_expense'], 2),
        'total_records': household_summary['total_records'],
        'avg_transaction': round(household_summary['total_expense'] / max(1, household_summary['total_records']), 2)
    },
    'categories': cat_list,
    'payment_modes': mode_list,
    'monthly_trends': monthly_list,
    'records': household_rows
}

with open(f'{OUTPUT_DIR}/household.json', 'w', encoding='utf-8') as f:
    json.dump(final_household, f, separators=(',', ':'))
print(f'Household written: {len(household_rows)} records')

# -------------------------------------------------------------
# 2. PROCESS INDIA TRANSACTIONS
# -------------------------------------------------------------
print('Processing India Transactions...')
tx_rows = []
fraud_count = 0
safe_count = 0
unknown_fraud_count = 0
total_tx_amount = 0.0
total_fraud_amount = 0.0
highest_amount = 0.0

category_stats = defaultdict(lambda: {'count': 0, 'fraud_count': 0, 'amount': 0.0, 'fraud_amount': 0.0})
state_stats = defaultdict(lambda: {'count': 0, 'fraud_count': 0, 'amount': 0.0, 'fraud_amount': 0.0})
monthly_tx_stats = defaultdict(lambda: {'count': 0, 'fraud_count': 0, 'amount': 0.0})

with open(TRANSACTIONS_PATH, 'r', encoding='utf-8', errors='replace') as f:
    reader = csv.DictReader(f)
    idx = 1
    for r in reader:
        raw_id = (r.get('trans_id') or '').strip()
        if raw_id.endswith('.0'): raw_id = raw_id[:-2]
        tx_id = raw_id if raw_id else f'TX{idx:06d}'

        date_time = (r.get('trans_date_trans_time') or '').strip() or 'Unknown Date'
        month_key = 'Unknown'
        if date_time and date_time != 'Unknown Date':
            date_part = date_time.split(' ')[0]
            parts = date_part.split('/')
            if len(parts) == 3:
                # m/d/yyyy
                m, d, y = parts
                if len(y) == 4:
                    try:
                        month_key = f'{y}-{int(m):02d}'
                    except:
                        pass

        # Card mask: Never expose full cc_num
        raw_cc = (r.get('cc_num') or '').strip()
        if raw_cc.endswith('.0'): raw_cc = raw_cc[:-2]
        masked_cc = f'•••• •••• •••• {raw_cc[-4:]}' if len(raw_cc) >= 4 else '•••• •••• •••• ••••'

        raw_merchant = (r.get('merchant') or '').strip()
        display_merchant = raw_merchant
        if display_merchant.startswith('fraud_'):
            display_merchant = display_merchant[6:]
        display_merchant = display_merchant or 'Unknown Merchant'

        raw_cat = (r.get('category') or '').strip()
        clean_cat = raw_cat.replace('_', ' ').title() if raw_cat else 'No Category'

        amt_raw = (r.get('amt') or '0').strip()
        try:
            amt = round(float(amt_raw), 2)
        except:
            amt = 0.0

        if amt > highest_amount:
            highest_amount = amt
        total_tx_amount += amt

        is_fraud_val = (r.get('is_fraud') or '').strip()
        if is_fraud_val in ('1.0', '1'):
            risk_status = 'Fraud'
            fraud_count += 1
            total_fraud_amount += amt
        elif is_fraud_val in ('0.0', '0'):
            risk_status = 'Safe'
            safe_count += 1
        else:
            risk_status = 'Unknown'
            unknown_fraud_count += 1

        first_name = (r.get('first') or '').strip() or 'Anonymous'
        last_name = (r.get('last') or '').strip()
        customer_name = f'{first_name} {last_name}'.strip()
        gender = (r.get('gender') or '').strip() or 'Not specified'
        job = (r.get('job') or '').strip() or 'Not specified'
        city = (r.get('city') or '').strip() or 'Unknown City'
        state = (r.get('state') or '').strip() or 'Unknown State'

        def parse_coord(k):
            v = (r.get(k) or '').strip()
            try:
                return round(float(v), 5)
            except:
                return None

        lat = parse_coord('lat')
        long = parse_coord('long')
        merch_lat = parse_coord('merch_lat')
        merch_long = parse_coord('merch_long')

        category_stats[clean_cat]['count'] += 1
        category_stats[clean_cat]['amount'] += amt
        if risk_status == 'Fraud':
            category_stats[clean_cat]['fraud_count'] += 1
            category_stats[clean_cat]['fraud_amount'] += amt

        state_stats[state]['count'] += 1
        state_stats[state]['amount'] += amt
        if risk_status == 'Fraud':
            state_stats[state]['fraud_count'] += 1
            state_stats[state]['fraud_amount'] += amt

        if month_key != 'Unknown':
            monthly_tx_stats[month_key]['count'] += 1
            monthly_tx_stats[month_key]['amount'] += amt
            if risk_status == 'Fraud':
                monthly_tx_stats[month_key]['fraud_count'] += 1

        tx_rows.append({
            'id': tx_id,
            'date': date_time,
            'month': month_key,
            'merchant': display_merchant,
            'raw_merchant': raw_merchant or 'Unknown',
            'category': clean_cat,
            'amount': amt,
            'risk': risk_status,
            'customer': customer_name,
            'gender': gender,
            'job': job,
            'city': city,
            'state': state,
            'lat': lat,
            'long': long,
            'masked_cc': masked_cc
        })
        idx += 1

# Category summary list
cat_summary = []
for c, s in category_stats.items():
    rate = (s['fraud_count'] / s['count'] * 100) if s['count'] > 0 else 0.0
    cat_summary.append({
        'category': c,
        'count': s['count'],
        'fraud_count': s['fraud_count'],
        'fraud_rate': round(rate, 1),
        'amount': round(s['amount'], 2),
        'fraud_amount': round(s['fraud_amount'], 2)
    })
cat_summary.sort(key=lambda x: x['fraud_count'], reverse=True)

# State summary list
state_summary = []
for s, st in state_stats.items():
    rate = (st['fraud_count'] / st['count'] * 100) if st['count'] > 0 else 0.0
    state_summary.append({
        'state': s,
        'count': st['count'],
        'fraud_count': st['fraud_count'],
        'fraud_rate': round(rate, 1),
        'amount': round(st['amount'], 2)
    })
state_summary.sort(key=lambda x: x['count'], reverse=True)

# Monthly trends
sorted_tx_months = sorted([k for k in monthly_tx_stats.keys() if k != 'Unknown'])
monthly_tx_list = []
for m in sorted_tx_months:
    tot = monthly_tx_stats[m]['count']
    fc = monthly_tx_stats[m]['fraud_count']
    sc = tot - fc
    monthly_tx_list.append({
        'month': m,
        'total': tot,
        'fraud': fc,
        'safe': max(0, sc),
        'amount': round(monthly_tx_stats[m]['amount'], 2)
    })

total_tx = len(tx_rows)
fraud_rate = (fraud_count / (total_tx - unknown_fraud_count) * 100) if (total_tx - unknown_fraud_count) > 0 else 0.0

tx_summary = {
    'total_transactions': total_tx,
    'fraud_count': fraud_count,
    'safe_count': safe_count,
    'unknown_count': unknown_fraud_count,
    'fraud_rate': round(fraud_rate, 2),
    'total_amount': round(total_tx_amount, 2),
    'avg_amount': round(total_tx_amount / max(1, total_tx), 2),
    'total_fraud_amount': round(total_fraud_amount, 2),
    'highest_amount': round(highest_amount, 2),
    'high_value_count': sum(1 for r in tx_rows if r['amount'] >= 10000),
    'category_stats': cat_summary,
    'state_stats': state_summary[:20],
    'monthly_trends': monthly_tx_list
}

with open(f'{OUTPUT_DIR}/transactions_summary.json', 'w', encoding='utf-8') as f:
    json.dump(tx_summary, f, separators=(',', ':'))

with open(f'{OUTPUT_DIR}/transactions.json', 'w', encoding='utf-8') as f:
    json.dump({'records': tx_rows}, f, separators=(',', ':'))

print(f'Transactions written: {len(tx_rows)} rows (Fraud: {fraud_count}, Safe: {safe_count}, Unknown: {unknown_fraud_count})')

# -------------------------------------------------------------
# 3. PROCESS SPOTIFY STREAMING HISTORY (149k rows)
# -------------------------------------------------------------
print('Processing Spotify Listening History...')
total_plays = 0
total_ms = 0
skipped_count = 0
shuffle_on_count = 0
shuffle_off_count = 0

platforms = Counter()
reasons_start = Counter()
reasons_end = Counter()
artists_data = defaultdict(lambda: {'plays': 0, 'ms': 0, 'skipped': 0, 'tracks': set()})
tracks_data = defaultdict(lambda: {'plays': 0, 'ms': 0, 'skipped': 0, 'artist': '', 'album': ''})
timeline_yearly = defaultdict(lambda: {'plays': 0, 'ms': 0})
timeline_monthly = defaultdict(lambda: {'plays': 0, 'ms': 0})

recent_sample = []

with open(SPOTIFY_PATH, 'r', encoding='utf-8', errors='replace') as f:
    reader = csv.DictReader(f)
    for r in reader:
        total_plays += 1
        ms = int(r.get('ms_played') or 0)
        total_ms += ms
        
        is_skipped = (r.get('skipped') or '').strip().upper() == 'TRUE'
        if is_skipped: skipped_count += 1

        is_shuffle = (r.get('shuffle') or '').strip().upper() == 'TRUE'
        if is_shuffle: shuffle_on_count += 1
        else: shuffle_off_count += 1

        plat = (r.get('platform') or '').strip() or 'Unknown'
        platforms[plat] += 1

        r_start = (r.get('reason_start') or '').strip() or 'unknown'
        r_end = (r.get('reason_end') or '').strip() or 'unknown'
        reasons_start[r_start] += 1
        reasons_end[r_end] += 1

        artist = (r.get('artist_name') or '').strip() or 'Unknown Artist'
        track = (r.get('track_name') or '').strip() or 'Unknown Track'
        album = (r.get('album_name') or '').strip() or 'Unknown Album'
        ts = (r.get('ts') or '').strip()

        artists_data[artist]['plays'] += 1
        artists_data[artist]['ms'] += ms
        if is_skipped: artists_data[artist]['skipped'] += 1
        artists_data[artist]['tracks'].add(track)

        track_key = f'{track} - {artist}'
        tracks_data[track_key]['plays'] += 1
        tracks_data[track_key]['ms'] += ms
        if is_skipped: tracks_data[track_key]['skipped'] += 1
        tracks_data[track_key]['artist'] = artist
        tracks_data[track_key]['album'] = album
        tracks_data[track_key]['track'] = track

        if ts and len(ts) >= 7:
            yr = ts[:4]
            mo = ts[:7]
            timeline_yearly[yr]['plays'] += 1
            timeline_yearly[yr]['ms'] += ms
            timeline_monthly[mo]['plays'] += 1
            timeline_monthly[mo]['ms'] += ms

        # Keep a rich representative sample of 1500 streams for exploration
        if total_plays % 100 == 0 and len(recent_sample) < 1500:
            recent_sample.append({
                'id': f'sp-{total_plays}',
                'ts': ts,
                'track': track,
                'artist': artist,
                'album': album,
                'duration_sec': round(ms / 1000, 1),
                'platform': plat,
                'shuffle': is_shuffle,
                'skipped': is_skipped,
                'reason_start': r_start,
                'reason_end': r_end
            })

# Format top 100 artists
top_artists_list = []
for art, d in sorted(artists_data.items(), key=lambda x: x[1]['plays'], reverse=True)[:100]:
    rate = round((d['skipped'] / d['plays'] * 100), 1) if d['plays'] > 0 else 0.0
    top_artists_list.append({
        'artist': art,
        'plays': d['plays'],
        'hours': round(d['ms'] / (1000 * 3600), 1),
        'unique_tracks': len(d['tracks']),
        'skip_rate': rate
    })

# Format top 100 tracks
top_tracks_list = []
for tkey, d in sorted(tracks_data.items(), key=lambda x: x[1]['plays'], reverse=True)[:100]:
    rate = round((d['skipped'] / d['plays'] * 100), 1) if d['plays'] > 0 else 0.0
    top_tracks_list.append({
        'track': d['track'],
        'artist': d['artist'],
        'album': d['album'],
        'plays': d['plays'],
        'hours': round(d['ms'] / (1000 * 3600), 2),
        'minutes': round(d['ms'] / (1000 * 60), 1),
        'skip_rate': rate
    })

# Platform breakdown
plat_list = []
for p, c in platforms.most_common():
    plat_list.append({
        'platform': p,
        'count': c,
        'percentage': round(c / total_plays * 100, 1)
    })

# Timeline lists
timeline_yr_list = []
for y in sorted(timeline_yearly.keys()):
    timeline_yr_list.append({
        'period': y,
        'plays': timeline_yearly[y]['plays'],
        'hours': round(timeline_yearly[y]['ms'] / (1000 * 3600), 1)
    })

timeline_mo_list = []
for m in sorted(timeline_monthly.keys()):
    timeline_mo_list.append({
        'period': m,
        'plays': timeline_monthly[m]['plays'],
        'hours': round(timeline_monthly[m]['ms'] / (1000 * 3600), 1)
    })

spotify_summary = {
    'kpis': {
        'total_plays': total_plays,
        'total_hours': round(total_ms / (1000 * 3600), 1),
        'unique_artists': len(artists_data),
        'unique_tracks': len(tracks_data),
        'skip_count': skipped_count,
        'skip_rate': round(skipped_count / total_plays * 100, 2),
        'shuffle_on_count': shuffle_on_count,
        'shuffle_off_count': shuffle_off_count,
        'shuffle_rate': round(shuffle_on_count / total_plays * 100, 2)
    },
    'top_artists': top_artists_list,
    'top_tracks': top_tracks_list,
    'platforms': plat_list,
    'reasons_start': [{'reason': k, 'count': v} for k, v in reasons_start.most_common(8)],
    'reasons_end': [{'reason': k, 'count': v} for k, v in reasons_end.most_common(8)],
    'timeline_yearly': timeline_yr_list,
    'timeline_monthly': timeline_mo_list,
    'sample_streams': recent_sample
}

with open(f'{OUTPUT_DIR}/spotify_summary.json', 'w', encoding='utf-8') as f:
    json.dump(spotify_summary, f, separators=(',', ':'))

print(f'Spotify written: {total_plays} plays, {len(artists_data)} artists, {len(tracks_data)} tracks')
print('Data preprocessing finished successfully!')
