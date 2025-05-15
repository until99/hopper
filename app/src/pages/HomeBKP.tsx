import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Bell, ChartBar, Download, FileText, FunnelSimple, Share, Star } from "@phosphor-icons/react";
import PlaceholderImageCard from "../assets/placeholder-image-card.png";

import Dashboard from "../types/dashboards";
import DashboardList from "../data/dashboards";

export default function Home() {

  const [data, setData_] = useState(DashboardList);

  const columnHelper = createColumnHelper<Dashboard>();

  const columns = [

    columnHelper.accessor("dashboardName", {
      header: "Dashboard",
      cell: (info) => (
        <p className="flex items-center gap-2">
          <span className="p-2">
            {info.row.original.type == "dashboard" ? <ChartBar className="text-blue-600" /> : <FileText className="text-purple-600" />}
          </span>
          <div className="flex flex-col">
            <p>{info.getValue()}</p>
            <span className="font-light text-gray-600">{info.row.original.description}</span>
          </div>
        </p>
      ),
    }),

    columnHelper.accessor("updatedAt", {
      header: "Last Updated",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),

    {
      id: "favorite",
      header: "Favorite",
      cell: (info: { row: { original: Dashboard } }) => (
        info.row.original.isFavorite ? <Star className="text-yellow-500" /> : <Star className="text-gray-300" />
      ),
    },

    {
      id: "actions",
      header: "Actions",
      cell: (info: { row: { original: Dashboard } }) => (
        <div className="flex items-center gap-6">
          <button className="p-3 rounded hover:bg-gray-100 underline cursor-pointer"><Download /></button>
          <button className="p-3 rounded hover:bg-gray-100 underline cursor-pointer"><Share /></button>
        </div>
      ),
    },

  ];

  const table = useReactTable({ columns, data, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="flex flex-col min-h-screen bg-slate-50" >

      <header className="flex items-center justify-end w-full h-fit py-4 px-6 border-b-1 border-gray-200">
        <Bell className="mr-6" />
        <div className="flex items-center hover:bg-gray-100 cursor-pointer rounded-lg p-2">
          <img src="https://placehold.co/600x400" alt="Profile Image" className="rounded-full size-8 object-cover" />
          <div className="flex flex-col ml-6">
            <span className="text-sm font-semibold">John Doe</span>
            <span className="text-xs text-gray-500">Besta Tester</span>
          </div>
        </div>
      </header>

      {/* Page Title */}
      <div className="flex flex-col w-full p-6" >
        <h1 className="text-2xl font-bold">Dashboards</h1>
        <p className="mt-4 text-gray-600">Explore and analyze your business data</p>
      </div >

      <main className="flex pb-6">

        {/* Workspace Navigator */}
        <div className="flex flex-col mx-6 py-6 gap-4 w-sm bg-white rounded-lg border border-gray-200">
          <div className="px-6">
            <h2 className="text-xl font-semibold">Workspaces</h2>
          </div>
          <div className="flex flex-col px-4 gap-1">
            <div className="flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer rounded-lg">
              <p>All Dashboards</p>
              <label className="rounded-full border border-gray-200 px-3 font-bold">6</label>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer rounded-lg">
              <p>Sales</p>
              <label className="rounded-full border border-gray-200 px-3 font-bold">4</label>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer rounded-lg">
              <p>HR</p>
              <label className="rounded-full border border-gray-200 px-3 font-bold">2</label>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full pr-6 gap-6">

          {/* Search and Filter */}
          <div className="flex gap-2 h-12">

            {/* Search Bar */}
            <input type="text" placeholder="Search..." className="flex items-center justify-between w-full p-4 bg-white px-4 rounded-lg" />

            {/* Filter Buttons */}
            <div className="flex items-center justify-between px-8 gap-2 bg-white rounded-lg hover:cursor-pointer">
              <Star className="text-gray-600" />
              <button className="text-black hover:cursor-pointer"> Filter</button>
            </div>
            <div className="flex items-center justify-between px-8 gap-2 bg-white rounded-lg hover:cursor-pointer">
              <FunnelSimple className="text-gray-600" />
              <button className="text-black hover:cursor-pointer"> Sort</button>
            </div>
          </div>

          <div className="flex justify-between items-center h-10">
            {/* Tablist */}
            <div className="flex items-center justify-start p-1 w-fit rounded-md bg-gray-100">
              <div className="flex items-center justify-between py-1.5 px-4 bg-white hover:cursor-pointer rounded-sm">
                <p className="font-medium">Grid</p>
              </div>

              <div className="flex items-center justify-between py-1.5 px-4 hover:cursor-pointer rounded-sm">
                <p className="text-gray-600 font-medium">List</p>
              </div>
            </div>

            {/* Dashboard Count */}
            <p className="text-gray-600">6 dashboards</p>
          </div>

          {/* Dashboard Cards */}
          {/* <div className="grid grid-cols-3 gap-6">
            {DATA.map((dashboard) => (
              <div key={dashboard.id} className="flex flex-col bg-white rounded-lg border border-gray-200 hover:shadow-sm">
                <img className="object-cover w-full h-52 rounded-t-lg" src={dashboard.image} alt={dashboard.dashboardName} />
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{dashboard.dashboardName}</h3>
                    {dashboard.type == "dashboard" ? <ChartBar className="text-blue-600" /> : <FileText className="text-blue-600" />}
                  </div>
                  <p className="mt-2 text-gray-600">{dashboard.description}</p>
                </div>
              </div>
            ))}
          </div> */}

          {/* Cards Table */}
          <table className="rounded-lg border-1 border-gray-200">
            <thead className="rounded-lg bg-gray-100">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="p-2 text-left text-sm font-semibold text-gray-600">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </main >
    </div >
  )
};