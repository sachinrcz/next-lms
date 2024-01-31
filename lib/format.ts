export const formatprice = (price: number) => {
    return new Intl.NumberFormat("en-us", {
        style: "currency",
        currency: "USD"

    }).format(price)
}