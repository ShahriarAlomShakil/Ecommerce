"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

const STORAGE_KEY = "glowhaus-cart-items"
const EVENT_NAME = "glowhaus-cart-updated"

export type CartItem = {
	id: string
	quantity: number
}

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

export function useCart() {
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
			return
		}

		writeCart([...current, { id, quantity: Math.max(1, quantity) }])
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
