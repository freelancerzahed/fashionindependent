"use client"

import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react"

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  category?: string
  brand?: string
}

interface CartState {
  items: CartItem[]
  subtotal: number
  total: number
  itemCount: number
}

type CartAction =
  | { type: "INITIALISE"; payload: CartState }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string } // productId
  | { type: "UPDATE_QTY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR" }

export interface CartContextValue {
  state: CartState
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

/* -------------------------------------------------------------------------- */
/*                               FALLBACK STATE                               */
/* -------------------------------------------------------------------------- */

const EMPTY_STATE: CartState = { items: [], subtotal: 0, total: 0, itemCount: 0 }

/* -------------------------------------------------------------------------- */
/*                                  REDUCER                                   */
/* -------------------------------------------------------------------------- */

function calcTotals(items: CartItem[]): CartState {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  return { items, subtotal, total: subtotal, itemCount }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "INITIALISE":
      return action.payload

    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.productId === action.payload.productId)
      const items = existing
        ? state.items.map((i) =>
            i.productId === action.payload.productId ? { ...i, quantity: i.quantity + action.payload.quantity } : i,
          )
        : [...state.items, action.payload]
      return calcTotals(items)
    }

    case "REMOVE_ITEM":
      return calcTotals(state.items.filter((i) => i.productId !== action.payload))

    case "UPDATE_QTY":
      return calcTotals(
        state.items.map((i) =>
          i.productId === action.payload.productId ? { ...i, quantity: action.payload.quantity } : i,
        ),
      )

    case "CLEAR":
      return EMPTY_STATE

    default:
      return state
  }
}

/* -------------------------------------------------------------------------- */
/*                                CONTEXT API                                 */
/* -------------------------------------------------------------------------- */

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, EMPTY_STATE)

  /* ---------------------------- Local-storage IO --------------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem("cart")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed.items)) {
          dispatch({ type: "INITIALISE", payload: calcTotals(parsed.items) })
        }
      }
    } catch {
      /* silent – corrupted storage is ignored */
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem("cart", JSON.stringify(state))
  }, [state])

  /* ------------------------------------------------------------------------ */

  const ctx: CartContextValue = {
    state,
    addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
    removeItem: (productId) => dispatch({ type: "REMOVE_ITEM", payload: productId }),
    updateQuantity: (productId, quantity) => dispatch({ type: "UPDATE_QTY", payload: { productId, quantity } }),
    clearCart: () => dispatch({ type: "CLEAR" }),
  }

  return <CartContext.Provider value={ctx}>{children}</CartContext.Provider>
}

/**
 * Always returns a **safe object** on the server so SSR never crashes.
 * The real provider overwrites it on the client during hydration.
 */
export function useCart(): CartContextValue {
  return (
    useContext(CartContext) || {
      state: EMPTY_STATE,
      addItem: () => {},
      removeItem: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
    }
  )
}
