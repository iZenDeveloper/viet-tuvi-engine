export const vietnamCities = [
    { code: 'vn-hanoi', nameVi: 'Hà Nội', nameEn: 'Hanoi', latitude: 21.0278, longitude: 105.8342, timezoneOffsetMinutes: 420 },
    { code: 'vn-ho-chi-minh', nameVi: 'TP. Hồ Chí Minh', nameEn: 'Ho Chi Minh City', latitude: 10.8231, longitude: 106.6297, timezoneOffsetMinutes: 420 },
    { code: 'vn-da-nang', nameVi: 'Đà Nẵng', nameEn: 'Da Nang', latitude: 16.0544, longitude: 108.2022, timezoneOffsetMinutes: 420 },
    { code: 'vn-hai-phong', nameVi: 'Hải Phòng', nameEn: 'Hai Phong', latitude: 20.8449, longitude: 106.6881, timezoneOffsetMinutes: 420 },
    { code: 'vn-can-tho', nameVi: 'Cần Thơ', nameEn: 'Can Tho', latitude: 10.0452, longitude: 105.7469, timezoneOffsetMinutes: 420 },
    { code: 'vn-hue', nameVi: 'Huế', nameEn: 'Hue', latitude: 16.4637, longitude: 107.5909, timezoneOffsetMinutes: 420 },
    { code: 'vn-nha-trang', nameVi: 'Nha Trang', nameEn: 'Nha Trang', latitude: 12.2388, longitude: 109.1967, timezoneOffsetMinutes: 420 },
    { code: 'vn-da-lat', nameVi: 'Đà Lạt', nameEn: 'Da Lat', latitude: 11.9404, longitude: 108.4583, timezoneOffsetMinutes: 420 },
    { code: 'vn-vung-tau', nameVi: 'Vũng Tàu', nameEn: 'Vung Tau', latitude: 10.4114, longitude: 107.1362, timezoneOffsetMinutes: 420 },
    { code: 'vn-buon-ma-thuot', nameVi: 'Buôn Ma Thuột', nameEn: 'Buon Ma Thuot', latitude: 12.6667, longitude: 108.05, timezoneOffsetMinutes: 420 }
];
const normalizeCity = (value) => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '');
export function listVietnamCities() {
    return vietnamCities.map(city => ({ ...city }));
}
export function findCity(value) {
    if (!value)
        return undefined;
    const key = normalizeCity(value);
    return vietnamCities.find(city => [city.code, city.nameVi, city.nameEn].some(candidate => normalizeCity(candidate) === key)
        || (['tphcm', 'hcmc'].includes(key) && city.code === 'vn-ho-chi-minh'));
}
