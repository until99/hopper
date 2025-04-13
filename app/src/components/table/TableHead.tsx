export default function TableHead() {
  return (
    <thead>
      <tr className="bg-white text-slate-500">
        <th className="text-left p-3 text-sm font-medium text-slate-500">Job Name</th>
        <th className="text-left p-3 text-sm font-medium text-slate-500">Status</th>
        <th className="text-left p-3 text-sm font-medium text-slate-500">Start Time</th>
        <th className="text-left p-3 text-sm font-medium text-slate-500">Duration</th>
        <th className="text-left p-3 text-sm font-medium text-slate-500">Progress</th>
      </tr>
    </thead>
  )
}