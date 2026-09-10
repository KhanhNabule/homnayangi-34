export const provinces = [
 'An Giang','Bà Rịa - Vũng Tàu','Bắc Giang','Bắc Kạn','Bạc Liêu','Bắc Ninh','Bến Tre','Bình Định','Bình Dương','Bình Phước','Bình Thuận','Cà Mau','Cần Thơ','Cao Bằng','Đà Nẵng','Đắk Lắk','Đắk Nông','Điện Biên','Đồng Nai','Đồng Tháp','Gia Lai','Hà Giang','Hà Nam','Hà Nội','Hà Tĩnh','Hải Dương','Hải Phòng','Hậu Giang','Hòa Bình','Hưng Yên','Khánh Hòa','Kiên Giang','Kon Tum','Lai Châu','Lâm Đồng','Lạng Sơn','Lào Cai','Long An','Nam Định','Nghệ An','Ninh Bình','Ninh Thuận','Phú Thọ','Phú Yên','Quảng Bình','Quảng Nam','Quảng Ngãi','Quảng Ninh','Quảng Trị','Sóc Trăng','Sơn La','Tây Ninh','Thái Bình','Thái Nguyên','Thanh Hóa','Thừa Thiên Huế','Tiền Giang','TP. Hồ Chí Minh','Trà Vinh','Tuyên Quang','Vĩnh Long','Vĩnh Phúc','Yên Bái',
] as const;
export type Province = typeof provinces[number];
const provinceSet = new Set<string>(provinces);
export function isProvince(value: unknown): value is Province { return typeof value === 'string' && provinceSet.has(value); }

const regionalOrigins: Partial<Record<number, Province>> = {
 0:'TP. Hồ Chí Minh',1:'Nam Định',2:'TP. Hồ Chí Minh',3:'Hà Nội',9:'Quảng Nam',10:'Thừa Thiên Huế',11:'TP. Hồ Chí Minh',12:'Quảng Nam',13:'TP. Hồ Chí Minh',14:'Hà Nội',15:'Hà Nội',19:'Hải Phòng',23:'Hà Nội',43:'TP. Hồ Chí Minh',44:'Bình Dương',48:'TP. Hồ Chí Minh',72:'Hà Nội',73:'Hà Nội',74:'Hà Nội',75:'TP. Hồ Chí Minh',76:'TP. Hồ Chí Minh',77:'An Giang',79:'TP. Hồ Chí Minh',80:'Hà Nội',81:'Nghệ An',83:'TP. Hồ Chí Minh',84:'Bình Định',85:'Khánh Hòa',87:'TP. Hồ Chí Minh',120:'TP. Hồ Chí Minh',122:'TP. Hồ Chí Minh',123:'TP. Hồ Chí Minh',124:'TP. Hồ Chí Minh',125:'TP. Hồ Chí Minh',126:'TP. Hồ Chí Minh',127:'TP. Hồ Chí Minh',
};
export function catalogProvince(image: number): Province | undefined { return regionalOrigins[image]; }
export function matchesProvince(foodProvince: Province | undefined, selected: Province | 'all'): boolean {
 return selected === 'all' || foodProvince === undefined || foodProvince === selected;
}
