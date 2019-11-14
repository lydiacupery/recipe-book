# upload schema from template file
data "template_file" "graphql_schema" {
  template = "${file("${path.root}/../schema.graphql")}"
}
resource "null_resource" "upload_graphql_schema" {
  provisioner "local-exec" {
    command = "aws appsync start-schema-creation --region us-east-2 --api-id ${aws_appsync_graphql_api.recipeBook.id} --definition '${data.template_file.graphql_schema.rendered}'"
  }
  # trigger based on changes to the schema
  triggers = {
    file_changes = "${md5(data.template_file.graphql_schema.rendered )}"
  }
  depends_on = ["aws_appsync_graphql_api.recipeBook"]
}