export default function MailboxesLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse bg-gray-200 rounded" />
        <div className="h-10 w-40 animate-pulse bg-gray-200 rounded" />
      </div>

      <div className="h-48 w-full animate-pulse bg-gray-200 rounded-lg" />

      <div className="h-64 w-full animate-pulse bg-gray-200 rounded-lg" />
    </div>
  )
}
