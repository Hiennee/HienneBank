var VNDFormatter = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
})

export default function Format(money)
{
    return VNDFormatter.format(money).slice(1).replace(",", ".") + " đ"
}