#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Extract the DATABASE_URL from the environment
DATABASE_URL=$(printenv DATABASE_URL)

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]
then
  echo "Error: DATABASE_URL is not set in the environment"
  exit 1
fi

echo "Extracted DATABASE_URL from the environment"

# Parse the DATABASE_URL into its components
DB_USER=$(echo $DATABASE_URL | awk -F:// '{print $2}' | awk -F: '{print $1}')
DB_PASSWORD=$(echo $DATABASE_URL | awk -F: '{print $3}' | awk -F@ '{print $1}')
DB_HOST=$(echo $DATABASE_URL | awk -F@ '{print $2}' | awk -F/ '{print $1}')
DB_NAME=$(echo $DATABASE_URL | awk -F/ '{print $4}' | awk -F? '{print $1}')

# Set the PGPASSWORD environment variable
export PGPASSWORD=$DB_PASSWORD

# Check if the parsed components are not empty
if [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_HOST" ] || [ -z "$DB_NAME" ]
then
  echo "Error: Failed to parse one or more components from DATABASE_URL"
  exit 1
fi

echo "Parsed DATABASE_URL into its components"

# Run the pg_dump command
echo "Running pg_dump command"
PGPASSWORD=$DB_PASSWORD pg_dump -Fc --no-acl --no-owner -h $DB_HOST -U $DB_USER $DB_NAME > /dumps/dump_$(date +%d-%m-%Y_%H_%M_%S).sql

if [ $? -eq 0 ]
then
  echo "pg_dump command executed successfully"
else
  echo "Error: Failed to execute pg_dump command"
  exit 1
fi