# dist/lambda/*.js: server/lambda.ts
# 	yarn build:server

# Bundle Lambda contents into a zip for publication
# dist/deploy/lambda/%.zip: dist/lambda/%.js
# 	zip -Xj $@ $<
deployment_bucket := fus-tf-lydia-lambda-bundles
deployment_key := fus-tf-lydia-recipe-book-endpoint.zip
lambda_location := dist/deploy/lambda/lambda.zip
lambda_function_name := rec-tf-recipe-endpoint

# Build the Lambda layer by bundling node_modules into a zip
$(lambda_location): dist/lambda/lambda.js
	zip -Xj $@ $<

# upload lambda
.PHONY: upload_lambda
upload_lambda: 
	aws s3 cp $(lambda_location) "s3://$(deployment_bucket)/$(deployment_key)"

.PHONY: deploy_lambda
deploy_lambda:
	aws lambda \
		update-function-code \
		--function-name $(lambda_function_name) \
		--s3-bucket "$(deployment_bucket)" \
		--s3-key "$(deployment_key)"