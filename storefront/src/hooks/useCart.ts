"use client"

import {
	createElement,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react"
import toast from "react-hot-toast"

const STORAGE_KEY = "glowhaus-cart-items"
const EVENT_NAME = "glowhaus-cart-updated"

export type CartItem = {
	id: string
	quantity: number
}

type CartContextValue = {
	items: CartItem[]
	count: number
	addItem: (id: string, quantity?: number) => void
	removeItem: (id: string) => void
	updateQuantity: (id: string, quantity: number) => void
	clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const readCart = (): CartItem[] => {
	if (typeof window === "undefined") {
		return []
	}

	try {
		const raw = localStorage.getItem(STORAGE_KEY)

		if (!raw) {
			return []
		}

		const parsed = JSON.parse(raw) as CartItem[]

		if (!Array.isArray(parsed)) {
			return []
		}

		return parsed.filter((item) => item?.id && item.quantity > 0)
	} catch {
		return []
	}
}

const writeCart = (items: CartItem[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
	window.dispatchEvent(new Event(EVENT_NAME))
}

function useCartState(): CartContextValue {
	const [items, setItems] = useState<CartItem[]>([])

	useEffect(() => {
		const sync = () => setItems(readCart())

		sync()
		window.addEventListener("storage", sync)
		window.addEventListener(EVENT_NAME, sync)

		return () => {
			window.removeEventListener("storage", sync)
			window.removeEventListener(EVENT_NAME, sync)
		}
	}, [])

	const addItem = useCallback((id: string, quantity = 1) => {
		const current = readCart()
		const existing = current.find((item) => item.id === id)

		if (existing) {
			const next = current.map((item) =>
				item.id === id
					? { ...item, quantity: Math.max(1, item.quantity + quantity) }
					: item
			)
			writeCart(next)
			toast.success("Cart updated")
			return
		}

		writeCart([...current, { id, quantity: Math.max(1, quantity) }])
		toast.success("Added to cart")
	}, [])

	const removeItem = useCallback((id: string) => {
		writeCart(readCart().filter((item) => item.id !== id))
	}, [])

	const updateQuantity = useCallback((id: string, quantity: number) => {
		if (quantity <= 0) {
			writeCart(readCart().filter((item) => item.id !== id))
			return
		}

		writeCart(
			readCart().map((item) =>
				item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
			)
		)
	}, [])

	const clearCart = useCallback(() => {
		writeCart([])
	}, [])

	const count = useMemo(
		() => items.reduce((sum, item) => sum + item.quantity, 0),
		[items]
	)

	return {
		items,
		count,
		addItem,
		removeItem,
		updateQuantity,
		clearCart,
	}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
	const value = useCartState()

	return createElement(CartContext.Provider, { value }, children)
}

export function useCart() {
	const context = useContext(CartContext)

	if (!context) {
		throw new Error("useCart must be used within CartProvider")
	}

	return context
}
