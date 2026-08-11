export async function apiRequest<T>(url:string,options?:RequestInit):Promise<T>{
  const response=await fetch(url,{...options,headers:{'Content-Type':'application/json',...options?.headers}});
  const data=await response.json().catch(()=>({error:'Invalid server response'}));
  if(!response.ok)throw new Error(data.error||`Request failed (${response.status})`);
  return data as T;
}
