"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

const STORAGE_KEY = "glowhaus-wishlist"
const EVENT_NAME = "glowhaus-wishlist-updated"

const readWishlist = (): string[] => {
	if (typeof window === "undefined") {
		return []
	}

	try {
		const raw = localStorage.getItem(STORAGE_KEY)

		if (!raw) {
			return []
		}

		const parsed = JSON.parse(raw) as string[]

		if (!Array.isArray(parsed)) {
			return []
		}

		return parsed.filter(Boolean)
	} catch {
		return []
	}
}

const writeWishlist = (items: string[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
	window.dispatchEvent(new Event(EVENT_NAME))
}

export function useWishlist() {
	const [items, setItems] = useState<string[]>([])

	useEffect(() => {
		const sync = () => setItems(readWishlist())

		sync()
		window.addEventListener("storage", sync)
		window.addEventListener(EVENT_NAME, sync)

		return () => {
			window.removeEventListener("storage", sync)
			window.removeEventListener(EVENT_NAME, sync)
		}
	}, [])

	const toggleItem = useCallback((id: string) => {
		const current = readWishlist()
		const hasItem = current.includes(id)

		if (hasItem) {
			writeWishlist(current.filter((entry) => entry !== id))
			return false
		}

		writeWishlist([...current, id])
		return true
	}, [])

	const addItem = useCallback((id: string) => {
		const current = readWishlist()

		if (current.includes(id)) {
			return
		}

		writeWishlist([...current, id])
	}, [])

	const removeItem = useCallback((id: string) => {
		writeWishlist(readWishlist().filter((entry) => entry !== id))
	}, [])

	const clearWishlist = useCallback(() => {
		writeWishlist([])
	}, [])

	const count = useMemo(() => items.length, [items])

	return {
		items,
		count,
		toggleItem,
		addItem,
		removeItem,
		clearWishlist,
		hasItem: (id: string) => items.includes(id),
	}
}
