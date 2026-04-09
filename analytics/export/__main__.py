import argparse

from . import main

parser = argparse.ArgumentParser(description="Export GA4 data from BigQuery")
parser.add_argument("--full", action="store_true", help="Full re-export (ignore existing data)")
args = parser.parse_args()
main(full=args.full)
