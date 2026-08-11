import {MediaType} from './types';

export function isContentType(value:unknown):value is Exclude<MediaType,'person'>{return value==='movie'||value==='tv'}
export function isPositiveInteger(value:unknown):value is number{return typeof value==='number'&&Number.isInteger(value)&&value>0}
export function isValidRating(value:unknown):value is number{return typeof value==='number'&&Number.isFinite(value)&&value>=1&&value<=10}
export function isNonEmptyString(value:unknown):value is string{return typeof value==='string'&&value.trim().length>0}

export function parseJsonError(error:unknown){
  return error instanceof SyntaxError?'Request body must be valid JSON':'Unexpected server error';
}
