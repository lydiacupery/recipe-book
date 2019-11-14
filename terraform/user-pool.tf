resource "aws_cognito_user_pool" "recipe_book_pool" {
  name = "tf-recipe-book-user-pool"
  alias_attributes = ["email"]
  auto_verified_attributes = ["email"]
}

resource "aws_cognito_user_pool_client" "recipe_book_pool_client" {
  name = "tf-recipe-book-user-pool-clinet"
  user_pool_id = aws_cognito_user_pool.recipe_book_pool.id
  generate_secret = "false"
}
