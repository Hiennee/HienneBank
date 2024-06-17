export default function replaceDate(str)
{
    return str.replace("Mon", "Thứ hai,").replace("Tue", "Thứ ba,").replace("Wed", "Thứ tư,")
    .replace("Thu", "Thứ năm,").replace("Fri", "Thứ sáu,").replace("Sat", "Thứ bảy,").replace("Sun", "Chủ nhật,")
    .replace("Jan", "Tháng 1, Ngày").replace("Feb", "Tháng 2, Ngày").replace("Mar", "Tháng 3, Ngày").replace("Apr", "Tháng 4, Ngày")
    .replace("May", "Tháng 5, Ngày").replace("Jun", "Tháng 6, Ngày").replace("Jul", "Tháng 7, Ngày").replace("Aug", "Tháng 8, Ngày")
    .replace("Sep", "Tháng 9, Ngày").replace("Oct", "Tháng 10, Ngày").replace("Nov", "Tháng 11, Ngày").replace("Dec", "Tháng 12, Ngày")
    .replace(" GMT+0700", "")
}