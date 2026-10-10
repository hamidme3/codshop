import { getPayload } from 'payload';

let payloadInstance: any = null;

export async function getPayloadInstance() {
  if (payloadInstance) return payloadInstance;
  
  const configModule = await import('@payload-config');
  const configPromise = configModule.default;
  
  payloadInstance = await getPayload({ config: configPromise });
  return payloadInstance;
}
