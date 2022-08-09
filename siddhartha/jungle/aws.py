# Format with:
#    python3 -m black app.py

import json
import boto3
import os
import urllib3
from datetime import datetime
import dateutil.tz
import random


def lambda_handler(event, context):
    queryStringParameters = event.get("queryStringParameters", {"get_temp": "q"})
    keys = queryStringParameters.keys()
    all_keys = "_".join(keys)

    if "siddhartha" in all_keys:
        if "multiplayer_game" in keys:
            return {
                "statusCode": 200,
                "body": str(random.randint(10000, 99999)),
                "headers": {
                    "Content-Type": "text/plain",
                    "Access-Control-Allow-Origin": "*",  # Required for CORS support to work
                },
            }
        elif "set" in keys:
            game_code = queryStringParameters["game_code"]
            game_board = queryStringParameters["game_board"]
            client.put_item(
                TableName=table_name,
                Item={
                    "locationName": {"S": "siddhartha_data"},
                    "siddhartha_data": {"S": json.dumps({game_code: game_board})},
                },
            )
            return {
                "statusCode": 200,
                "body": "ok",
                "headers": {
                    "Content-Type": "text/plain",
                    "Access-Control-Allow-Origin": "*",  # Required for CORS support to work
                },
            }
        elif "get" in keys and current_window_info == "cloud_game":
            game_code = queryStringParameters["game_code"]
            all_games = json.loads(load_from_db("siddhartha_data"))
            one_game = all_games.get(game_code, "none")
            return {
                "statusCode": 200,
                "body": one_game,
                "headers": {
                    "Content-Type": "text/plain",
                    "Access-Control-Allow-Origin": "*",  # Required for CORS support to work
                },
            }
        elif "get" in keys and current_window_info == "ai_game":
            game_board = queryStringParameters["game_board"]
            game_board["piece_info"] = {
                "0_1": {"player": 0, "animal": 7},
                "0_6": {"player": 0, "animal": 6},
                "1_1": {"player": 0, "animal": 4},
                "1_5": {"player": 0, "animal": 2},
                "2_0": {"player": 0, "animal": 1},
                "2_2": {"player": 0, "animal": 5},
                "2_4": {"player": 0, "animal": 3},
                "2_6": {"player": 0, "animal": 8},
                "8_6": {"player": 1, "animal": 7},
                "8_0": {"player": 1, "animal": 6},
                "7_5": {"player": 1, "animal": 4},
                "7_1": {"player": 1, "animal": 2},
                "6_6": {"player": 1, "animal": 1},
                "6_4": {"player": 1, "animal": 5},
                "6_2": {"player": 1, "animal": 3},
                "6_0": {"player": 1, "animal": 8},
            }
        return {
            "statusCode": 200,
            "body": game_board,
            "headers": {
                "Content-Type": "text/plain",
                "Access-Control-Allow-Origin": "*",  # Required for CORS support to work
            },
        }
