import { useEffect, useState } from "react";

export function useGetFeaturedBlock2() {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/block2s?filters[isFeatured][$eq]=true&populate=*`;
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(url)
                const json = await res.json()
                console.log("🔍 Resultado Block1:", json);
                setResult(json.data)
                setLoading(false)
            } catch (error: any) {
                setError(error)
                setLoading(false)
            }
        })()
    }, [url])
    return { result, loading, error }
}
