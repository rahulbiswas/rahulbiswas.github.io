# Format with:
#    python3 -m black aws.py

import dataclasses
import json

# import boto3
import os
import urllib.parse
from datetime import datetime
import random

# client = boto3.client("dynamodb")
# table_name = os.environ["LOCATIONS_TABLE"]


@dataclasses.dataclass
class WaterJump:
    """Holds a possible jump over water for lions and tigers.

    Attributes:
        destination: FILL_IN.
        water: FILL_IN.
    """

    destination: list
    water: int


_VALID_MOVE_WATER = {
    "2_1": [WaterJump("6_1", ["3_1", "4_1", "5_1"])],
    "2_2": [WaterJump("6_2", ["3_2", "4_2", "5_2"])],
    "3_0": [WaterJump("3_3", ["3_1", "3_2"])],
    "4_0": [WaterJump("4_3", ["4_1", "4_2"])],
    "5_0": [WaterJump("5_3", ["5_1", "5_2"])],
    "6_1": [WaterJump("2_1", ["5_1", "4_1", "3_1"])],
    "6_2": [WaterJump("2_2", ["5_2", "4_2", "3_2"])],
    "3_3": [WaterJump("3_0", ["3_2", "3_1"]), WaterJump("3_6", ["3_4", "3_5"])],
    "4_3": [WaterJump("4_0", ["4_2", "4_1"]), WaterJump("4_6", ["4_4", "4_5"])],
    "5_3": [WaterJump("5_0", ["5_2", "5_1"]), WaterJump("5_6", ["5_4", "5_5"])],
    "2_4": [WaterJump("6_4", ["3_4", "4_4", "5_4"])],
    "2_5": [WaterJump("6_5", ["3_5", "4_5", "5_5"])],
    "3_6": [WaterJump("3_3", ["3_5", "3_4"])],
    "4_6": [WaterJump("4_3", ["4_5", "4_4"])],
    "5_6": [WaterJump("5_3", ["5_5", "5_4"])],
    "6_4": [WaterJump("2_4", ["5_4", "4_4", "3_4"])],
    "6_5": [WaterJump("2_5", ["5_5", "4_5", "3_5"])],
}


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
    if sq0 in s["piece_info"]:
        return "red"
    elif sq1 in s["piece_info"]:
        return "blue"
    else:
        for player in range(2):
            dead = 0
            for animal in range(0, 8):
                is_alive = False
                for k in s["piece_info"]:
                    if (
                        s["piece_info"][k]["player"] == player
                        and s["piece_info"][k]["animal"] == animal
                    ):
                        is_alive = True
                        break
                    else:
                        dead += 1
            if dead == 8 and player == 0:
                return "red"
            elif dead == 8 and player == 1:
                return "blue"
    return False


def isTerminal(s):
    if whoWon(s) == False:
        return False
    else:
        return True


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


def checkPossibleTurn(first_click_key, pieces, current_window):
    possibleMoves = []
    for column in range(8):
        for row in range(10):
            second_click_key = str(row) + "_" + str(column)
            if validMove(first_click_key, pieces, second_click_key, current_window):
                possibleMove = second_click_key
                possibleMoves.append(possibleMove)
    return possibleMoves


def Actions(s):
    moves = set()
    for i in (s["piece_info"]).keys():
        move = checkPossibleTurn(i, s["piece_info"], "ai_game")
        for x in move:
            if s["piece_info"][i]["player"] == s["turn_info"]:
                move1 = (i, x)
                moves.add(move1)
    return moves


def Result(s1, a):
    s2 = s1[:]
    p = toMove(s1)
    crd = a[0]
    crd1 = a[1]
    s1["piece_info"][crd1] = s1["piece_info"][crd]
    del s1["piece_info"][crd]
    s1["turn_info"] = 1 - s1["turn_info"]
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

_RAT = 1
_TIGER = 6
_LION = 7
_ELEPHANT = 8

_BLUE_PLAYER = 0
_RED_PLAYER = 1

_BLUE_TRAPS = ["0_2", "1_3", "0_4"]
_RED_TRAPS = ["8_2", "7_3", "8_4"]

_BLUE_DEN = "0_3"
_RED_DEN = "8_3"

_WATER = [
    [3, 1],
    [4, 1],
    [5, 1],
    [3, 2],
    [4, 2],
    [5, 2],
    [3, 4],
    [4, 4],
    [5, 4],
    [3, 5],
    [4, 5],
    [5, 5],
]

def BiggerEatSmaller(pieces, second_click_key, attacking_animal, attacking_player):
    if second_click_key in pieces and pieces[second_click_key]["animal"] <= attacking_animal and pieces[second_click_key]["player"] != attacking_player:
        return True
    return None

def validMoveWater(first_click_key, pieces, second_click_key, attacking_animal, attacking_player, second_coords):
    valid_moves = _VALID_MOVE_WATER.get(first_click_key, None)
    if valid_moves:
        for valid_move in valid_moves:
            if valid_move.destination != second_click_key:
                continue
            if attacking_animal != _LION and attacking_animal != _TIGER:
                continue
            for water_square in valid_move.water:
                if water_square in pieces:
                    return False
            for water_square in valid_move.water:
                if water_square in pieces:
                    return False
                elif second_click_key not in pieces:
                    return True
                elif BiggerEatSmaller(pieces, second_click_key, attacking_animal, attacking_player):
                    return True

    is_moving_to_water_square = False
    for w_s_i in _WATER:
        if w_s_i == second_coords:
            is_moving_to_water_square = True
    if is_moving_to_water_square:
        if attacking_animal != _RAT:
            return False
    return None

def validMoveTraps(attacking_player, second_click_key):
    if (attacking_player == _BLUE_PLAYER and second_click_key in _BLUE_TRAPS) or (
        attacking_player == _RED_PLAYER and second_click_key in _RED_TRAPS
    ):
        return True
    if (attacking_player == _RED_PLAYER and second_click_key in _BLUE_TRAPS) or (
        attacking_player == _BLUE_PLAYER and second_click_key in _RED_TRAPS
    ):
        return False
    return None

def validMoveRatElephant(pieces, second_click_key, attacking_animal, defending_animal):
    if pieces[second_click_key] != None:
        if attacking_animal == _ELEPHANT and defending_animal == _RAT:
            return False
        elif (
            attacking_animal < defending_animal and attacking_animal != _RAT
        ):
            return False
    return None

def ratWater(first_coords, is_moving_from_water_square, second_click_key, pieces):
    if first_coords in _WATER:
        is_moving_from_water_square = True
    if is_moving_from_water_square and second_click_key not in pieces:
        return True
    if is_moving_from_water_square and pieces[second_click_key]["animal"] == 8:
        return False
    return None

def validMove(first_click_key, pieces, second_click_key):
    first_coords = first_click_key.split("_")
    first_coords = [int(n) for n in first_coords]
    second_coords = second_click_key.split("_")
    second_coords = [int(n) for n in second_coords]
    if (
        second_coords[0] < 0
        or second_coords[1] < 0
        or second_coords[0] > 8
        or second_coords[1] > 6
    ):
        return False
    attacking_animal = pieces[first_click_key]["animal"]
    attacking_player = pieces[first_click_key]["player"]
    water_validness = validMoveWater(first_click_key, pieces, second_click_key, attacking_animal, attacking_player, second_coords)
    # Allow tigers and lions to jump over water.
    if water_validness != None:
        return water_validness
    is_attacking_own_den = False
    if attacking_player == 0:
        if second_click_key == _BLUE_DEN:
            is_attacking_own_den = True
    else:
        if second_click_key == _RED_DEN:
            is_attacking_own_den = True
    if is_attacking_own_den:
        return False
    x_diff = abs(first_coords[0] - second_coords[0])
    y_diff = abs(first_coords[1] - second_coords[1])
    if x_diff == 1 and y_diff == 1:
        return False
    elif x_diff > 1:
        return False
    elif y_diff > 1:
        return False
    if BiggerEatSmaller(pieces, second_click_key, attacking_animal, attacking_player):
        return True
    is_moving_from_water_square = False
    ratWater_validness = ratWater(first_coords, is_moving_from_water_square, second_click_key, pieces)
    if ratWater_validness != None:
        return ratWater_validness
    if second_click_key not in pieces:
        return True
    defending_animal = pieces[second_click_key]["animal"]
    defending_player = pieces[second_click_key]["player"]
    if attacking_player == defending_player:
        return False
    trap_validness = validMoveTraps(attacking_player, second_click_key)
    if trap_validness != None:
        return trap_validness
    rat_validness = validMoveRatElephant(pieces, second_click_key, attacking_animal, defending_animal)
    if rat_validness != None:
        return rat_validness
    return True
