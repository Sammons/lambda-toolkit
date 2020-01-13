import {LambdaHandler} from '../../lambda-toolkit-utilities';

module.exports.handler = new LambdaHandler({
  project: 'test',
  version: '1.0.0',
  method: 'post',
  url: '/users',
  gen: true,
})
  .acceptsJsonObject(b => b.withString('echo'))
  .respondsWithJsonObject(200, b => b.withString('message'))
  .setsHeaders([200], {
    'Access-Control-Allow-Origin': '*',
  })
  .processesEventWith((e, _) => {
    return {
      statusCode: 200,
      body: {message: e.body.echo},
    };
  });

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
  .processesEventWith((e, _) => {
    return {
      statusCode: 200,
      body: {message: e.queryStringParameters.id},
    };
  });
