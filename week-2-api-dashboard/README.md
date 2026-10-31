# Stockly – API-Based Product Dashboard

**AUREX Full-Stack Internship · Month 2 · Week 2**

A React dashboard that loads **all of its data from a public REST API** ([DummyJSON](https://dummyjson.com)) instead of hard-coded arrays. It covers `fetch()`, `useEffect`, loading / error / empty states, search, filtering, sorting, pagination and full CRUD (GET / POST / PUT / DELETE).

🔗 **Live demo:** _add your Vercel link here after deploying_

## Screenshots

_Add: product list, search results, empty state, error state, product details, add-product form (with validation errors), mobile view._

## Features

| Feature | How it works |
|---|---|
| **Display records** | `GET /products?limit=12&skip=0` – 12 products per page, `total` from the API drives pagination |
| **Search** | `GET /products/search?q=…` – debounced (400 ms) so typing does not fire a request per letter |
| **Filter** | `GET /products/category/:slug` – category dropdown filled from `GET /products/categories` |
| **Sort** | `sortBy` + `order` query parameters (price, rating, name) |
| **View details** | `GET /products/:id` – gallery, price/discount, stock, reviews. Opens from the list or a direct link |
| **Add** | `POST /products/add` from a validated, controlled form |
| **Update** | `PUT /products/:id` – the same form, pre-filled |
| **Delete** | `DELETE /products/:id` with a confirmation |
| **Loading state** | Skeleton cards (list) and a spinner (details/edit) |
| **Error state** | Message from the API/network + **Try again** button |
| **Empty state** | "No products found" with a **Clear filters** button |
| **Navigation** | Hash routes: `#/`, `#/product/:id`, `#/new`, `#/edit/:id` – back button and shareable links work |
| **Responsive + dark mode** | CSS grid, mobile layout, theme saved in `localStorage` |

> **Important – the demo API only simulates writes.** DummyJSON accepts POST/PUT/DELETE and returns a success response, but it does not store anything. The app therefore remembers your changes in React state for the current visit (`ProductsProvider`). Refreshing the page resets them. This is a limitation of the API, not a bug.
>
> The API also cannot combine *search* and *category*, so typing in the search box switches the category back to "All" (and choosing a category clears the search box).

## Project structure

```
src/
├── api/products.js            all fetch() calls (one request() helper + one function per endpoint)
├── context/
│   ├── productsContext.js     the context object + useProducts() hook
│   └── ProductsProvider.jsx   filters, loading/error status, fetched data, local add/edit/delete
├── hooks/
│   ├── useProduct.js          finds one product (memory first, API second)
│   ├── useHashRoute.js        tiny router built on the URL hash
│   └── useTheme.js            light/dark theme
├── components/                Header, Toolbar, SearchBar, FilterSelect, ProductGrid, ProductCard,
│                              Pagination, ProductForm, Loader, ErrorMessage, EmptyState
├── pages/                     ProductsPage, ProductDetailsPage, ProductFormPage
├── utils/                     format.js (prices, stock), validation.js (form rules)
├── App.jsx                    picks the page from the URL
└── main.jsx
```

## How the data flows

```
User types / picks a filter ─► ProductsProvider updates `filters` state
                                   │
                                   ▼
                    useEffect([filters, reloadKey]) runs
                                   │  fetchProducts(filters, signal)
                                   ▼
                       DummyJSON REST API  ──► JSON response
                                   │
                                   ▼
        setData / setStatus('success' | 'error')  ──►  React re-renders the UI
```

* **`useEffect` + cleanup:** the effect creates an `AbortController` and returns `() => controller.abort()`. If the filters change while a request is still running, the old request is cancelled, so a slow old response can never overwrite a newer one.
* **Lifting state up / Context:** the list page, details page and form page all need the same products. `ProductsProvider` sits above them and shares the data through Context, so no prop-drilling is needed.
* **Derived data:** the list shown on screen = API results + local changes, calculated with `useMemo` – never stored twice.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run lint
```

No environment variables are needed (the API is public and needs no key).

## Deploy (Vercel)

1. Push the repository to GitHub.
2. Vercel → **Add New → Project** → import the repo.
3. **Root Directory:** `week-2-api-dashboard` · **Framework preset:** Vite (build `npm run build`, output `dist`).
4. Deploy, then paste the live URL at the top of this README.

## Technologies

React 19 · Vite · JavaScript (ES modules) · CSS custom properties · ESLint · DummyJSON REST API

## Concepts practised

REST basics (endpoint, method, status code, JSON, query & path parameters) · `fetch()` with error handling · `useState` / `useEffect` / `useMemo` / `useRef` · effect cleanup & request cancellation · debouncing · lifting state up · Context API · controlled forms & validation · loading / error / empty states · responsive layout.
