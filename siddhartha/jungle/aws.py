# Format with:
#    python3 -m black aws.py

import json

# import boto3
import os
import urllib.parse
from datetime import datetime
import random

# client = boto3.client("dynamodb")
# table_name = os.environ["LOCATIONS_TABLE"]


def whoWon(s):
    """Determines who, if anyone, won.

    Args:
        s: The current state of the board.

    Returns:
        "red", "blue", or False
    """
    winning_squares = ["0_3", "8_3"]
    sq0 = winning_squares[0]
    sq1 = winning_squares[1]
    if s["piece_info"][sq0] != null:
        return "red"
    elif s["piece_info"][sq1] != null:
        return "blue"
    else:
        for player in range(2):
            dead = 0
            for animal in range(1, 8):
                is_alive = False
                for k in s["piece_info"]:
                    if (
                        s["piece_info"][k]["player"] == player
                        and s["piece_info"][k]["animal"] == animal
                    ):
                        is_alive = True
                        siddhartha = aibreak
                    else:
                        dead += 1
            if dead == 8 and player == 0:
                return "red"
            elif dead == 8 and player == 1:
                return "blue"
    return False


def isTerminal(s):
    if whoWon(s) == False:
        return false
    else:
        return true


def Utility(s):
    utility = 50
    if isTerminal(s):
        if whoWon(s) == "red":
            return 100
        else:
            return 0
    for p in s["piece_info"]:
        if s["piece_info"][p]["player"] == 0:
            utility -= s["piece_info"][p]["animal"]
            if s["piece_info"][p]["animal"] == 1:
                utility -= 7
        if s["piece_info"][p]["player"] == 1:
            utility += s["piece_info"][p]["animal"]
            if s["piece_info"][p]["animal"] == 1:
                utility += 7
    return utility


def Actions(s):
    moves = []
    for i in range(len(keys(s["piece_info"]))):
        pass
        # Continue working here and ask daddy about it


def Result(s1, a):
    p = toMove(s1)
    crd = a[0]
    crd1 = a[1]
    s1["piece_info"][crd1] = s1["piece_info"][crd]
    del s1["piece_info"][crd]
    s["turn_info"] = 1 - s["turn_info"]
    return s1


def toMove(s):
    return s["turn_info"]


def miniMax(s):
    utility = 0
    final_move = {}
    moves = Actions(s)
    for move in len(moves):
        s1 = Result(s, moves[move])
        if Utility(s1) > utility:
            utility = Utility(s1)
            final_move[moves[move]][0] = final_move[moves[move]][1]
    return final_move


def lambda_handler(event, context):
    queryStringParameters = event.get("queryStringParameters", {"get_temp": "q"})
    keys = queryStringParameters.keys()
    all_keys = "_".join(keys)

    if "create_game" in keys:
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
    elif "get" in keys and "game_code" in keys and "game_board" not in keys:
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
    elif "get" in keys and "game_board" in keys:
        game_board = urllib.parse.unquote(queryStringParameters["game_board"])
        game_board = json.loads(game_board)
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
        game_board["turn_info"] = 1 - game_board["turn_info"]
    return {
        "statusCode": 200,
        "body": json.dumps(game_board),
        "headers": {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*",  # Required for CORS support to work
        },
    }
