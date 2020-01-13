This repository contains modules for use in building typescript lambdas (Node 12+, TS 3.7+)

#### Notes:

- Allows you to naturally export open api spec, which can be used for many things e.g. swagger.
- The same place you define api structure provides type-safety in your code
- Provides a primitive way to prep lambdas for deployment by
  - using webpack to compile the code into 2 layers. Nice since this lets you peak/tweak via C9 in the AWS console.
    1. Handler
    2. Dependencies
- Generally assumes the lambdas are replying to an API Gateway event.

#### Examples:

Always aspiring to expand usable use-cases and get better coverage of the OpenAPI 3.0.0 Spec.

```
module.exports.handler = new LambdaHandler({
  project: 'test',
  version: '1.0.0',
  method: 'get',
  url: '/users',
  gen: true,
})
  .acceptsStringQueryParam('id')
  .respondsWithJsonObject(200, b => b.withString('message'))
  .setsHeaders([200], {
    'Access-Control-Allow-Origin': '*',
  })
  .processesEventWith((event, context) => {
    return {
      statusCode: 200,
      body: {message: e.queryStringParameters.id},
    };
  });
```

#### AWS Notes

- Tested using a basic AWS architecture
  - API Gateway (using Cognito Authorizor).
  - Cognito User Pool.
  - Lambda, called by API Gateway using the lambda proxy integration.

### MIT Licensed
