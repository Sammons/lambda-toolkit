import { LambdaHandler } from 'lambda-toolkit-utilities';

module.exports.handler = new LambdaHandler({
  project: 'test',
  version: '1.0.0',
  method: 'post',
  url: '/users',
  gen: true,
})
  .allowOrigins([200, 500], '*')
  .acceptsBoolQueryParam('expand')
  .acceptsJsonObject(b => b.withString('echo'))
  .respondsWithJsonObject(200, b => b
    .withString('echo')
    .withBoolean('expand')
    .withArray('values', v => v
      .withItemType('number')))
  .respondsWithJsonObject(500, b => b
    .withString('message'))
  .processesEventWith((e, _) => {
    try {
      return {
        statusCode: 200,
        body: { echo: e.body.echo, values: [1], expand: e.queryStringParameters.expand },
      }
    } catch (e) {
      return {
        statusCode: 500,
        body: { message: 'error' }
      }
    }
  });