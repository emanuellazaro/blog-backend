/**
 * Route: GET /posts/{slug}
 */

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const _ = require('underscore');
const util = require('./util.js');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.POSTS_TABLE;

exports.handler = async (event) => {
    try {
        let post_slug = decodeURIComponent(event.pathParameters.slug);
        
        console.log(decodeURIComponent(event.pathParameters.post_created_at));
        let post_created_at = decodeURIComponent(event.pathParameters.post_created_at);
        
        let params = {
            TableName: tableName,
            ProjectionExpression: 'post_slug, post_title, post_created_at, post_content',            
            IndexName: "post_slug-index",
            KeyConditionExpression: "post_slug = :slug",
            ExpressionAttributeValues: {
                ":slug": post_slug
            },
            Limit: 1   
        };

        let data = await dynamodb.query(params).promise();

        if(!_.isEmpty(data.Items)) {
            return {
                statusCode: 200,
                headers: util.getResponseHeaders(),
                body: JSON.stringify(data.Items[0])
            };
        } else {
            return {
                statusCode: 404,
                headers: util.getResponseHeaders()
            };
        }  
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