export type LambdaCognitoApiEvent<
  RequestBody,
  Url,
  RequestQueryParams,
  RequestHeaders
> = {
  body: RequestBody;
  resource: string;
  path: Url;
  queryStringParameters: RequestQueryParams;
  multiValueQueryStringParameters: {} /**TODO */;
  pathParameters: {} /**TODO */;
  stageVariables: {} /** TODO */;
  headers: {
    Accept: string;
    'Accept-Encoding': string;
    'Accept-Language': string;
    'Cache-Control': string;
    'CloudFront-Forwarded-Proto': 'http' | 'https';
    'CloudFront-Is-Desktop-Viewer': boolean;
    'CloudFront-Is-Mobile-Viewer': boolean;
    'CloudFront-Is-SmartTV-Viewer': boolean;
    'CloudFront-Is-Tablet-Viewer': boolean;
    'CloudFront-Viewer-Country': 'US';
    Host: string;
    'Upgrade-Insecure-Requests': string;
    'User-Agent': string;
    Via: string;
    'X-Forwarded-For': string;
    'X-Forwarded-Port': string;
    'X-Forwarded-Proto': 'http' | 'https';
  } & RequestHeaders;
  requestContext: {
    accountId: string;
    resourceId: string;
    stage: string;
    requestId: string;
    requestTime: string;
    requestEpoch: number;
    identity: {
      cognitoIdentityPoolId: string;
      accountId: string;
      cognitoIdentityId: string;
      caller: string;
      accessKoy: string;
      sourceIp: string;
      cognitoAuthenticationType: string;
      cognitoAuthenticationProvider: string;
      userArn: string;
      userAgent: string;
      user: any;
    };
    path: string;
    resourcePath: string;
    httpMethod: string;
    apiId: string;
    protocol: string;
  };
};
