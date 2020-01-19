import { LambdaHandler } from 'lambda-toolkit-utilities';

module.exports.handler = new LambdaHandler({
  project: 'test',
  version: '1.0.0',
  method: 'post',
  url: '/users',
  gen: true,
})
  .acceptsJsonObject(b => b.withString('echo'))
  .respondsWithJsonObject(200, b => b
    .withString('message')
    .withArray('values', v => v
      .withItemType('double')))
  .respondsWithJsonObject(500, b => b
    .withString('id').withLong('message'))
  .setsHeaders([200], {
    'Access-Control-Allow-Origin': '*',
  })
  .processesEventWith((e, _) => {
    try {
      return {
        statusCode: 200,
        body: { message: e.body.echo, values: [1] },
      }
    } catch (e) {
      return {
        statusCode: 500,
        body: { id: 'xyz', message: 1 }
      }
    }
  });