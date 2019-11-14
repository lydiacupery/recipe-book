resource "aws_appsync_graphql_api" "recipeBook" {
  name = "tf_recipe_book_appsync"
  authentication_type = "AWS_IAM"
}

resource "aws_appsync_datasource" "recipeBook" {
  type = "AWS_LAMBDA"
  name = "tf_recipe_book_lamba_datasource"
  lambda_config {
    function_arn = aws_lambda_function.recipe-endpoint.arn
  }
  api_id = aws_appsync_graphql_api.recipeBook.id
  service_role_arn = aws_iam_role.appsync_execution_role.arn
}
