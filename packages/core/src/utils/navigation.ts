export function throwRedirectError(): never {
  throw new Response('Not Found', {
    status: 404,
  });
}
