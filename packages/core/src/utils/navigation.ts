export function throw404Error(): never {
  throw new Response('Not Found', {
    status: 404,
  });
}
