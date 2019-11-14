
resource "aws_s3_bucket" "test_bucket" {
  bucket = "wild-rides-lydia"
  acl = "private"
  region = "us-east-2"
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "aws_s3_bucket" "lambda-bundles" {
  bucket        = "fus-tf-lydia-lambda-bundles"
  acl           = "private"
  force_destroy = true
  region = "us-east-2"

 

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "aws:kms"
      }
    }
  }

}