import Badge from "../Badge";
import ProgressBar from "../ProgressBar";

export default function TableBody() {
  return (
    <tbody>
      <tr className="bg-white hover:bg-slate-50">
        <td className="p-3">Data Warehouse Load</td>
        <td className="p-3">
          <Badge />
        </td>
        <td className="p-3">05:00</td>
        <td className="p-3">32min</td>
        <td className="p-3">
          <ProgressBar />
        </td>
      </tr>
    </tbody>
  )
}