resource "aws_iam_role" "lambda-execution-role" {
  name               = "fus-tf-${terraform.workspace}-lambda-execution-role"
    assume_role_policy = data.aws_iam_policy_document.lambda-assume-role-policy.json
}

resource "aws_iam_role_policy_attachment" "basic-lambda-execution-policy-attachment" {
  role       = aws_iam_role.lambda-execution-role.name
  policy_arn = aws_iam_policy.basic-lambda-execution.arn
}

resource "aws_iam_role" "appsync_execution_role" {
  name = "recipe-book-tf-appsync-execution-role"
  assume_role_policy = data.aws_iam_policy_document.appsync-assume-role-policy.json
}

resource "aws_iam_role_policy_attachment" "appsync_execution_policy_attachement" {
  role = aws_iam_role.appsync_execution_role.name
  policy_arn = aws_iam_policy.basic-appsync-execution.arn
}
