import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const haversine = require('haversine');
const ROUND_DISTANCE_FOR_ACCIDENT = 0.2 * 1000; // 200 metros
const ROUND_DISTANCE_FOR_SPEED = 0.2 * 1000; // 200 metros
const DEFAULT_SPEED = 50;

const client = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
    try {
        const { latitude, longitude, time } = event.queryStringParameters;
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        // **Ejecutar todas las consultas en paralelo para mayor eficiencia**
        const [accidentsOnSitu, accidentsTime, designSpeed] = await Promise.all([
            getNumberAccidentsOnSitu(lat, lon),
            getNumberAccidentsTime(lat, lon, time),
            getDesignSpeed(lat, lon)
        ]);

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                accidentsOnSitu, 
                accidentsTime, 
                designSpeed 
            }),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};

// 🚨 **Función 1: Obtener número de accidentes en el sitio usando GSI**
async function getNumberAccidentsOnSitu(latitude, longitude) {
    const command = new QueryCommand({
        TableName: "accidents_quito",
        IndexName: "LocationIndex", // GSI por ubicación (LATITUD_Y, LONGITUD_X)
        KeyConditionExpression: "#lat = :latVal AND #lon = :lonVal",
        ExpressionAttributeNames: {
            "#lat": "LATITUD_Y",
            "#lon": "LONGITUD_X",
        },
        ExpressionAttributeValues: {
            ":latVal": { N: String(latitude) },
            ":lonVal": { N: String(longitude) },
        },
    });

    const response = await client.send(command);

    let count = 0;
    response.Items.forEach((item) => {
        const lat1 = parseFloat(item.LATITUD_Y.N);
        const lon1 = parseFloat(item.LONGITUD_X.N);

        if (haversine({ latitude, longitude }, { latitude: lat1, longitude: lon1 }) <= ROUND_DISTANCE_FOR_ACCIDENT) {
            count++;
        }
    });

    return count;
}

// 🕒 **Función 2: Obtener número de accidentes por hora (ya usa GSI)**
async function getNumberAccidentsTime(latitude, longitude, time) {
    const command = new QueryCommand({
        TableName: "accidentes_hora",
        IndexName: "HourIndex", // GSI por hora
        KeyConditionExpression: "#hour = :hourVal",
        ExpressionAttributeNames: { "#hour": "hour" },
        ExpressionAttributeValues: { ":hourVal": { N: time } },
    });

    const response = await client.send(command);
    return response.Items.length;
}

// 🚦 **Función 3: Obtener la velocidad de diseño usando GSI**
async function getDesignSpeed(latitude, longitude) {
    const command = new QueryCommand({
        TableName: "design_speed",
        IndexName: "LocationSpeedIndex", // GSI por ubicación (latitude, longitude)
        KeyConditionExpression: "#lat = :latVal AND #lon = :lonVal",
        ExpressionAttributeNames: {
            "#lat": "latitude",
            "#lon": "longitude",
        },
        ExpressionAttributeValues: {
            ":latVal": { N: String(latitude) },
            ":lonVal": { N: String(longitude) },
        },
    });

    const response = await client.send(command);

    let speed = DEFAULT_SPEED;
    let minDistance = Number.MAX_VALUE;

    response.Items.forEach((item) => {
        const lat1 = parseFloat(item.latitude.N);
        const lon1 = parseFloat(item.longitude.N);
        const dist = haversine({ latitude, longitude }, { latitude: lat1, longitude: lon1 });

        if (dist <= ROUND_DISTANCE_FOR_SPEED && dist < minDistance) {
            minDistance = dist;
            speed = parseFloat(item.speed.N);
        }
    });

    return speed;
}
