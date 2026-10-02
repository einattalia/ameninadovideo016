export function isAllowedAdmin(userId:string|undefined,allowedId:string|undefined){return Boolean(userId&&allowedId&&userId===allowedId);}
export function validMutation(request:Request){const origin=request.headers.get('origin');return request.headers.get('x-amdv-admin')==='1'&&origin===new URL(request.url).origin;}
export const uploadTypes:Record<string,string>={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif','video/mp4':'mp4','video/webm':'webm'};
export function validUpload(mime:string,size:number){return Boolean(uploadTypes[mime])&&Number.isSafeInteger(size)&&size>0&&size<=25*1024*1024;}
