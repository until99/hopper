import TableHeader from "./TableHeader"
import TableHead from "./TableHead"
import TableBody from "./TableBody"
import TableFooter from "./TableFooter"

export default function Table() {
  return (
    <>
      <div className="border-solid border-slate-200 border-2 rounded-lg bg-card text-card-foreground">
        <TableHeader />

        <div className="p-0">
          <div className="overflow-x-auto">

            <table className="w-full">
              <TableHead />
              <TableBody />
            </table>
            <TableFooter />
          </div>
        </div>

      </div>
    </>
  )
}