import { retrieveCart } from "@lib/data/cart"
import SkincareNav from "@modules/layout/components/skincare-nav"

export default async function Nav() {
  const cart = await retrieveCart().catch(() => null)
  const cartCount =
    cart?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) ?? 0

  return <SkincareNav cartCount={cartCount} />
}
