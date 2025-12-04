import { LoadingSpinner } from "@/components/ui/spinner";


export default function Loading() {
    // Add fallback UI that will be shown while the route is loading.
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <LoadingSpinner />
        </div>
    )

}