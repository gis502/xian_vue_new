export interface Point {
    /** 序号 */
    id?: number;           
    /** 经度 */
    lon?: number;        
    /** 纬度 */
    lat?: number;
     /** 空间 */
    geom?: string;    
    /** 灾害类型 */
    disasterType?: string;
}