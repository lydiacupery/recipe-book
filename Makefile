dist/lambda/*.js: package.json yarn.lock modules/server/lambda.ts
	yarn build:server

# Bundle Lambda contents into a zip for publication
# dist/deploy/lambda/%.zip: dist/lambda/%.js
# 	zip -Xj $@ $<
deployment_bucket := fus-tf-lydia-lambda-bundles
deployment_key := fus-tf-lydia-recipe-book-endpoint.zip
lambda_location := dist/deploy/lambda/lambda.zip
lambda_function_name := rec-tf-recipe-endpoint

all: $(lambda_location) dist/deploy/shared-node-runtime.zip dist/shared-node-runtime/nodejs/node_modules 
.PHONY: all

all_lambda: upload_lambda deploy_lambda publish_layer
.PHONY: all_lambda

$(lambda_location): dist/lambda/lambda.js
	zip -Xj $@ $<
	
#shared lambda layer
# Build the Lambda layer by bundling node_modules into a zip
dist/deploy/shared-node-runtime.zip: dist/shared-node-runtime/nodejs/node_modules | dist/deploy
	cd dist/shared-node-runtime; \
	zip -Xr ../deploy/shared-node-runtime.zip *

dist/shared-node-runtime/nodejs/node_modules: package.json yarn.lock | dist/shared-node-runtime/nodejs
	cp package.json yarn.lock dist/shared-node-runtime/nodejs/; \
	cd dist/shared-node-runtime/nodejs; \
	yarn install --production=true; \
	rm package.json yarn.lock


.PHONY: publish_layer
publish_layer:
	aws s3 cp dist/deploy/shared-node-runtime.zip "s3://$(deployment_bucket)/rb-tf-shared-node-runtime.zip" \
	&& aws lambda publish-layer-version \
		--layer-name "rb-tf-shared-node-runtime" \
		--content "S3Bucket=$(deployment_bucket),S3Key=rb-tf-shared-node-runtime.zip" \
		--description "Shared Node.js runtime for recipe book" \
		--compatible-runtimes nodejs10.x \
	| jq '.LayerVersionArn' > .aws_shared_layer; \
	if [ -s .aws_shared_layer ]; then exit 0; else exit 1; fi




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
	aws lambda \
		update-function-configuration \
		--function-name $(lambda_function_name) \
		--layers $(shell cat .aws_shared_layer) \
