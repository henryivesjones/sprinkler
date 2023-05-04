export class SprinklerSecretNotSetError extends Error {
  constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SprinklerSecretNotSetError.prototype);
  }
}

export function getSecret(
  key: string,
  defaultValue?: string
): string | undefined {
  const secretValue = process.env[`SPRINKLER_SECRET_${key.toUpperCase()}`];
  if (secretValue === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new SprinklerSecretNotSetError(key.toUpperCase());
  }
  return secretValue;
}

export function getRequestBody<T = any>(
  asJSON: boolean = false
): T | undefined {
  const rawRequestBody = process.env["SPRINKLER_TASK_INSTANCE_BODY"];
  if (rawRequestBody === undefined) {
    return undefined;
  }
  const parsedRequestBody = JSON.parse(rawRequestBody);
  if (!asJSON) {
    return parsedRequestBody;
  }
  return JSON.parse(parsedRequestBody);
}

export function sendResponse(content: any): void {
  console.log(
    `SPRINKLER*_*RESPONSE*_*START*${JSON.stringify(
      content
    )}*SPRINKLER*_*RESPONSE*_*END`
  );
}
