import json
import boto3
from haversine import haversine, Unit

ROUND_DISTANCE_FOR_ACCIDENT = 0.2  # 200 metros
ROUND_DISTANCE_FOR_SPEED = 0.2  # 200 metros
DEFAULT_SPEED = 50

# Inicializa el cliente de DynamoDB
dynamodb = boto3.client('dynamodb', region_name='eu-north-1')

def lambda_handler(event, context):
    try:
        # Obtener los parámetros del evento
        latitude = float(event['queryStringParameters']['latitude'])
        longitude = float(event['queryStringParameters']['longitude'])
        time = event['queryStringParameters']['time']

        # Ejecutar todas las consultas en paralelo
        accidents_on_situ = get_number_accidents_on_situ(latitude, longitude)
        accidents_time = get_number_accidents_time(latitude, longitude, time)
        design_speed = get_design_speed(latitude, longitude)

        return {
            'statusCode': 200,
            'body': json.dumps({
                'accidentsOnSitu': accidents_on_situ,
                'accidentsTime': accidents_time,
                'designSpeed': design_speed
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

# 🚨 Función 1: Obtener número de accidentes en el sitio
def get_number_accidents_on_situ(latitude, longitude):
    response = dynamodb.query(
        TableName="accidents_quito",
        IndexName="LocationIndex",  # Usando el índice secundario global
        KeyConditionExpression="LATITUD_Y = :latitude AND LONGITUD_X = :longitude",
        ExpressionAttributeValues={
            ":latitude": {'N': str(latitude)},
            ":longitude": {'N': str(longitude)}
        }
    )
    count = 0

    for item in response['Items']:
        lat1 = float(item['LATITUD_Y']['N'])
        lon1 = float(item['LONGITUD_X']['N'])
        distance = haversine((latitude, longitude), (lat1, lon1), unit=Unit.METERS)

        if distance <= ROUND_DISTANCE_FOR_ACCIDENT * 1000:  # 200 metros
            count += 1

    return count

# 🕒 Función 2: Obtener número de accidentes por hora
def get_number_accidents_time(latitude, longitude, time):
    response = dynamodb.query(
        TableName="accidentes_hora",
        IndexName="HourIndex",
        KeyConditionExpression="#hour = :hourVal",
        ExpressionAttributeNames={"#hour": "hour"},
        ExpressionAttributeValues={":hourVal": {'N': time}}
    )
    return len(response['Items'])

# 🚦 Función 3: Obtener la velocidad de diseño
def get_design_speed(latitude, longitude):
    response = dynamodb.query(
        TableName="design_speed",
        IndexName="LocationSeepIndex",  # Usando el GSI correcto
        KeyConditionExpression="latitude = :latitude AND longitude = :longitude",
        ExpressionAttributeValues={
            ":latitude": {'N': str(latitude)},
            ":longitude": {'N': str(longitude)}
        }
    )
    speed = DEFAULT_SPEED
    min_distance = float('inf')

    for item in response['Items']:
        lat1 = float(item['latitude']['N'])
        lon1 = float(item['longitude']['N'])
        distance = haversine((latitude, longitude), (lat1, lon1), unit=Unit.METERS)

        if distance <= ROUND_DISTANCE_FOR_SPEED * 1000 and distance < min_distance:
            min_distance = distance
            speed = float(item['speed']['N'])

    return speed
