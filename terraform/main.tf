provider "aws" {
  region     = "us-east-2"
  access_key = var.aws_access_key_id
  secret_key = var.aws_secret_access_key
}


data "aws_iam_policy_document" "test_policy" {
    statement {
        actions = [
            "s3:GetObject"
        ]
        principals {
          type = "AWS"
          identifiers  = ["*"]
        }
        effect = "Allow"
        resources = ["${aws_s3_bucket.test_bucket.arn}/*"]
    }
}

resource "aws_s3_bucket_policy" "allow_bucket_access" {
  bucket = aws_s3_bucket.test_bucket.id
  policy = data.aws_iam_policy_document.test_policy.json
}

