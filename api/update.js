/**
 * Route: PATCH /posts/{slug}
 */

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const util = require('./util.js');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.POSTS_TABLE;

exports.handler = async (event) => {
    try {
        let post = JSON.parse(event.body).Item;
        post.post_updated_at = new Date().toISOString();

        let data = await dynamodb.update({
            TableName: tableName,
            ExpressionAttributeNames: {
                '#content': 'post_content',
                '#updatedAt': 'post_updated_at',
                '#published': 'published',
                '#createdAt': 'post_created_at'
            },
            ExpressionAttributeValues: {
                ':content': post.post_content,
                ':updatedAt': new Date().toISOString(),
                ':published': post.published,
                ':createdAt': post.post_created_at
            },
            Key: {
                "post_slug": post.post_slug, 
                "post_created_at": post.post_created_at
               }, 
            ReturnValues: "ALL_NEW",
            ConditionExpression: '#createdAt = :createdAt',
            UpdateExpression: "SET #content = :content, #updatedAt = :updatedAt, #published = :published"
        }).promise();

        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(post)
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