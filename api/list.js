/**
 * Route: GET /posts
 */

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const util = require('./util.js');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.POSTS_TABLE;

exports.handler = async (event) => {
    try {
        let params = {
            TableName: tableName,
            ProjectionExpression: 'post_slug, post_title, post_created_at',
            FilterExpression: "published = :unpublished",
            ExpressionAttributeValues: {
                 ":unpublished": true
            },
            ScanIndexForward: false
        };

        let data = await dynamodb.scan(params).promise();

        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(data   )
        };
    } catch (err) {
        console.log("Error", err);
        return {
            statusCode: err.statusCode ? err.statusCode : 500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                error: err.name ? err.name : "Exception",
                message: err.message ? err.message : "Unknown error"
            })
        };
    }
}