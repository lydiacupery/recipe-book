locals {
  graphql_endpoint_source_path = "./dummy_lambda/dummy.zip"
}


resource "aws_lambda_function" "recipe-endpoint" {
    function_name = "rec-tf-recipe-endpoint"
    role = aws_iam_role.lambda-execution-role.arn
    runtime       = "nodejs10.x"
    handler       = "lambda.handler"
    memory_size = 3008
    timeout     = 120

    s3_bucket = aws_s3_bucket_object.recipe-book-endpoint-code-bundle.bucket
    s3_key    = aws_s3_bucket_object.recipe-book-endpoint-code-bundle.key
}


# Lambda code
resource "aws_s3_bucket_object" "recipe-book-endpoint-code-bundle" {
  bucket                 = aws_s3_bucket.lambda-bundles.id
  key                    = "fus-tf-lydia-recipe-book-endpoint.zip"
  source                 = local.graphql_endpoint_source_path
  server_side_encryption = "aws:kms"
}