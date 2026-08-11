export type MediaType='movie'|'tv'|'person';
export interface Media {id:number;media_type?:MediaType;title?:string;name?:string;original_name?:string;overview?:string;poster_path?:string|null;backdrop_path?:string|null;profile_path?:string|null;release_date?:string;first_air_date?:string;vote_average?:number;vote_count?:number;genre_ids?:number[];genres?:{id:number;name:string}[];runtime?:number;episode_run_time?:number[];biography?:string;birthday?:string;place_of_birth?:string;known_for_department?:string;known_for?:Media[];}
export interface Credit extends Media {character?:string;job?:string;department?:string;}
export interface Video {id:string;key:string;name:string;site:string;type:string;official?:boolean;}
export interface PageResult<T=Media>{page:number;results:T[];total_pages:number;total_results:number;}
export interface Details extends Media {credits?:{cast:Credit[];crew:Credit[]};videos?:{results:Video[]};recommendations?:PageResult;combined_credits?:{cast:Credit[];crew:Credit[]};images?:{profiles:{file_path:string}[]};}
export interface WatchlistItem {_id:string;tmdbId:number;mediaType:'movie'|'tv';title:string;posterPath:string|null;backdropPath?:string|null;tmdbRating?:number;releaseDate?:string;overview?:string;addedAt:string;}
export interface UserRating {_id?:string;tmdbId:number;mediaType:'movie'|'tv';rating:number;createdAt?:string;updatedAt?:string;}
