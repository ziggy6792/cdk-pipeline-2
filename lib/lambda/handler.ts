const createResponse = (body: string, statusCode = 200) => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,DELETE',
    },
    statusCode,
    body: JSON.stringify(body, null, 2),
  };
};

exports.handler = async function (event: AWSLambda.APIGatewayEvent) {
  console.log('event bla: ', JSON.stringify(event, null, 2));
  //   console.log(`is prod ${process.env.isProduction}`);

  // return {
  //   statusCode: 200,
  //   headers: { 'Content-Type': 'text/plain' },
  //   body: `hello from lambda your have hit ${event.path}`,
  // };

  return createResponse(`hello from lambda your have hit ${event.path}`);
};
