# Format with:
#    python3 -m black app.py

import json
import boto3
import os
import urllib3
from datetime import datetime
import dateutil.tz
import random

# client = boto3.client("dynamodb")
# table_name = os.environ["LOCATIONS_TABLE"]
# http = urllib3.PoolManager()


# def load_from_db(key):
#     all_data = client.scan(TableName=table_name)["Items"]
#     for key_value_pair in all_data:
#         if key_value_pair["locationName"]["S"] == key:
#             return key_value_pair[key]["S"]
#     return []


# def celsius_to_farhenheit(celsius):
#     return (celsius * 1.8) + 32


# def get_temp():
#     access_token_data = client.get_item(
#         TableName=table_name, Key={"locationName": {"S": "access_token"}}
#     )
#     try:
#         access_token = access_token_data["Item"]["access_token"]["S"]
#     except:
#         return {"statusCode": 200, "body": "No access token"}
#     response = http.request(
#         "GET",
#         "https://smartdevicemanagement.googleapis.com/v1/enterprises/74e2da9a-bc7f-4720-bdaa-45bc1d19d33e/devices",
#         headers={
#             "Content-Type": "application/json",
#             "Authorization": "Bearer " + access_token,
#         },
#     )
#     decoded_response = response.data.decode("utf-8")
#     print(decoded_response)
#     jj = json.loads(decoded_response)
#     if "devices" not in jj:
#         return get_access_token_with_refresh_token()
#     j = jj["devices"][0]["traits"]
#     now = datetime.now(dateutil.tz.gettz("US/Pacific"))
#     dt_string = now.strftime("%Y-%m-%d %H:%M:%S")
#     summary = {
#         "time": dt_string,
#         "mode": j["sdm.devices.traits.ThermostatMode"]["mode"],
#         "status": j["sdm.devices.traits.ThermostatHvac"]["status"],
#         "target_temp": round(
#             celsius_to_farhenheit(
#                 j["sdm.devices.traits.ThermostatTemperatureSetpoint"].get("coolCelsius",0)
#             ),
#             1,
#         ),
#         "current_temp": round(
#             celsius_to_farhenheit(
#                 j["sdm.devices.traits.Temperature"]["ambientTemperatureCelsius"]
#             ),
#             1,
#         ),
#     }
#     thermostat_data = json.loads(load_from_db("thermostat_data"))
#     thermostat_data = thermostat_data[max(0,len(thermostat_data)-864):len(thermostat_data)]
#     thermostat_data.append(summary)
#     data = client.put_item(
#         TableName=table_name,
#         Item={
#             "locationName": {"S": "thermostat_data"},
#             "thermostat_data": {"S": json.dumps(thermostat_data)},
#         },
#     )
#     return {"statusCode": 200, "body": json.dumps(thermostat_data, indent=2)}


# def get_access_token_with_code(queryStringParameters):
#     code = queryStringParameters.get("code", "none")
#     access_token_url = (
#         "https://www.googleapis.com/oauth2/v4/token?client_id=276848611057-8h000nmh58neamsjn46qm2clnuom95ag.apps.googleusercontent.com&client_secret=vTUYN80w9THIaA2zAwRqe41F&code="
#         + code
#         + "&grant_type=authorization_code&redirect_uri=https://06z51kydsh.execute-api.us-west-2.amazonaws.com/Prod/hello"
#     )
#     response = http.request("POST", access_token_url)
#     j = json.loads(response.data.decode("utf-8"))
#     access_token = j.get("access_token", "no_access_token")
#     data = client.put_item(
#         TableName=table_name,
#         Item={
#             "locationName": {"S": "access_token"},
#             "access_token": {"S": access_token},
#         },
#     )
#     refresh_token = j.get("refresh_token", "no_refresh_token")
#     data = client.put_item(
#         TableName=table_name,
#         Item={
#             "locationName": {"S": "refresh_token"},
#             "refresh_token": {"S": refresh_token},
#         },
#     )
#     return {"statusCode": 200, "body": json.dumps(j, indent=2)}


# def get_access_token_with_refresh_token():
#     refresh_token = load_from_db("refresh_token")
#     access_token_url = (
#         "https://www.googleapis.com/oauth2/v4/token?client_id=276848611057-8h000nmh58neamsjn46qm2clnuom95ag.apps.googleusercontent.com&client_secret=vTUYN80w9THIaA2zAwRqe41F&refresh_token="
#         + refresh_token
#         + "&grant_type=refresh_token&redirect_uri=https://06z51kydsh.execute-api.us-west-2.amazonaws.com/Prod/hello"
#     )
#     response = http.request("POST", access_token_url)
#     j = json.loads(response.data.decode("utf-8"))
#     access_token = j.get("access_token", "no_access_token")
#     data = client.put_item(
#         TableName=table_name,
#         Item={
#             "locationName": {"S": "access_token"},
#             "access_token": {"S": access_token},
#         },
#     )
#     return {"statusCode": 200, "body": json.dumps(j, indent=2)}


# def login_to_nest():
#     login_url = "https://nestservices.google.com/partnerconnections/74e2da9a-bc7f-4720-bdaa-45bc1d19d33e/auth?redirect_uri=https://06z51kydsh.execute-api.us-west-2.amazonaws.com/Prod/hello&access_type=offline&prompt=consent&client_id=276848611057-8h000nmh58neamsjn46qm2clnuom95ag.apps.googleusercontent.com&response_type=code&scope=https://www.googleapis.com/auth/sdm.service"
#     html = '<a href="' + login_url + '">Log in to Nest</a>'
#     return {
#         "statusCode": 200,
#         "body": html,
#         "headers": {
#             "Content-Type": "text/html",
#         },
#     }


# def show_all_data():
#     thermostat_data = json.loads(load_from_db("thermostat_data"))
#     return {"statusCode": 200, "body": json.dumps(thermostat_data, indent=2)}


# def chart():
#     thermostat_data = json.loads(load_from_db("thermostat_data"))
#     thermostat_data = thermostat_data[-265:len(thermostat_data):1]
#     temp_data = [t["current_temp"] for t in thermostat_data]
#     temp_labels_original = [t["time"] for t in thermostat_data]
#     temp_labels_parsed = [datetime.strptime(t, "%Y-%m-%d %H:%M:%S") for t in temp_labels_original]
#     temp_labels = [datetime.strftime(t, "%I:%M %p") for t in temp_labels_parsed]
#     status_data = [t["status"] for t in thermostat_data]
#     cooling_data = ['"#0000ff"' if s == "COOLING" else '"444444"' for s in status_data]
#     html_prefix = (
#     "<html>"
#     "<head>"
#     '<meta charset="utf-8"/>'
#     "<title>Temperature History</title>"
#     '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>'
#     "</script>"
#     "</head>"
#     "<body>"
#     '<canvas id="temps"></canvas>'
#     "<script>"
#     )
#     js_temps = 'var temps = document.getElementById("temps").getContext("2d");'
#     labels = ",".join([f'"{s}"' for s in temp_labels])
#     js_labels = f"const labels = [{labels}];"
#     data = ",".join(f"{s}" for s in temp_data)
#     borderColor = ",".join(cooling_data)
#     js_data = (
#     'const data = {labels: labels,datasets: [{label: "Actual Temperature"'
#     ',data: [' + data + ']'
#     ',backgroundColor: [' + borderColor + ']'
#     ',borderColor: [' + borderColor + ']'
#     ',stepped:true}]};'
#     "const config = {type: 'bar',data,options: { scales: { y: { beginAtZero: false } }    }};"
#     )
#     js_chart = "new Chart(temps,config)"
#     html_suffix = "</script></body>"
#     html = "\n".join([html_prefix, js_temps, js_labels, js_data, js_chart, html_suffix])
#     return {
#         "statusCode": 200,
#         "body": html,
#         "headers": {
#             "Content-Type": "text/html",
#         },
#     }

def lambda_handler(event, context):
    queryStringParameters = event.get("queryStringParameters", {"get_temp": "q"})
    keys = queryStringParameters.keys()
    all_keys = "_".join(keys)
    
    if 'siddhartha' in all_keys:
        if 'multiplayer_game' in keys:
            return {
                "statusCode": 200,
                "body": str(random.randint(10000,99999)),
                "headers": {
                    "Content-Type": "text/plain",
                    "Access-Control-Allow-Origin": "*" # Required for CORS support to work
                }
            }
        elif 'set' in keys:
            game_code = queryStringParameters['game_code']
            game_board = queryStringParameters['game_board']
            client.put_item(
                TableName=table_name,
                Item={
                    "locationName": {"S": "siddhartha_data"},
                    "siddhartha_data": {"S": json.dumps({game_code:game_board})},
                },
            )
            return {
                "statusCode": 200,
                "body": 'ok',
                "headers": {
                    "Content-Type": "text/plain",
                    "Access-Control-Allow-Origin": "*" # Required for CORS support to work
                }
            }
        elif "get" in keys and current_window_info == 'cloud_game':
            game_code = queryStringParameters['game_code']
            all_games = json.loads(load_from_db("siddhartha_data"))
            one_game = all_games.get(game_code,'none')
            return {
                "statusCode": 200,
                "body": one_game,
                "headers": {
                    "Content-Type": "text/plain",
                    "Access-Control-Allow-Origin": "*" # Required for CORS support to work
                }
        elif "get" in keys and current_window_info == 'ai_game':
            game_board = queryStringParameters['game_board']
            game_board['piece_info'] = {
	"0_1": {
		"player": 0,
		"animal": 7
	},
	"0_6": {
		"player": 0,
		"animal": 6
	},
	"1_1": {
		"player": 0,
		"animal": 4
	},
	"1_5": {
		"player": 0,
		"animal": 2
	},
	"2_0": {
		"player": 0,
		"animal": 1
	},
	"2_2": {
		"player": 0,
		"animal": 5
	},
	"2_4": {
		"player": 0,
		"animal": 3
	},
	"2_6": {
		"player": 0,
		"animal": 8
	},
	"8_6": {
		"player": 1,
		"animal": 7
	},
	"8_0": {
		"player": 1,
		"animal": 6
	},
	"7_5": {
		"player": 1,
		"animal": 4
	},
	"7_1": {
		"player": 1,
		"animal": 2
	},
	"6_6": {
		"player": 1,
		"animal": 1
	},
	"6_4": {
		"player": 1,
		"animal": 5
	},
	"6_2": {
		"player": 1,
		"animal": 3
	},
	"6_0": {
		"player": 1,
		"animal": 8
	}
}
        return  {
                "statusCode": 200,
                "body": game_board,
                "headers": {
                    "Content-Type": "text/plain",
                    "Access-Control-Allow-Origin": "*" # Required for CORS support to work
                }

    }
    
    # if all_keys == "get_temp":
    #     return get_temp()
    # elif all_keys == "code_scope":
    #     return get_access_token_with_code(queryStringParameters)
    # elif "login_to_nest" in keys:
    #     return login_to_nest()
    # elif "refresh_token" in keys:
    #     return get_access_token_with_refresh_token()
    # elif "chart" in keys:
    #     return chart()
    # else:
    #     return show_all_data()
