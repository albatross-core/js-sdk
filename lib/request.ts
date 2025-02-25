export const makeRequest = async <A, B extends Record<string, any>>({
  url,
  method = "GET",
  data,
  headers,
}: MakeRequestInputs<B>): Promise<A> => {
  const body = data ? JSON.stringify(data) : undefined;

  const response = await fetch(url, {
    method,
    body,
    headers,
  });

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${
        response.statusText
      } ${await response.text()}`
    );
  }

  return response.json();
};

export interface MakeRequestInputs<B extends Record<string, any>> {
  url: string;
  method?: string;
  data?: B;
  headers: Record<string, string>;
}
