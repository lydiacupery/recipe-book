resource "aws_iam_policy" "basic-appsync-execution" {
  name        = "recipe-book-tf-${terraform.workspace}-basic-appsync-execution-policy"
  description = "Allows App Sync functions to execute"
  policy      = data.aws_iam_policy_document.basic-appsync-execution.json
}

data "aws_iam_policy_document" "basic-appsync-execution" {
  statement {
    actions = [
      "lambda:*"
    ]
    resources = [
     aws_lambda_function.recipe-endpoint.arn
    ]
  }
}
