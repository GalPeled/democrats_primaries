import csv
import json

# Define file paths
csv_file_path = 'D:\Python_Projects\democrats_primaries\data\candidates.csv'
json_file_path = 'D:\Python_Projects\democrats_primaries\data\candidates.json'

# Read CSV and write to JSON
with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
    # DictReader automatically uses the first row as dictionary keys
    csv_reader = csv.DictReader(csv_file)
    data = list(csv_reader)

with open(json_file_path, mode='w', encoding='utf-8') as json_file:
    # indent=4 makes the JSON file human-readable (pretty-printed)
    json.dump(data, json_file, indent=4, ensure_ascii=False)