#! /bin/bash

echo "Installing serverless"
echo "_______________________________"
npm install -g npm
npm --version
npm install -g serverless
npm install serverless-dynamodb-local serverless-offline serverless-stack-output 

echo "Deploying to $env"
echo "_______________________________"
export SLS_DEBUG=*
mkdir -p .serverless
cp -r $CODEBUILD_SRC_DIR/target/$env/* $PWD/.serverless
serverless deploy --stage $env -r us-east-1 --package /.serverless -v 