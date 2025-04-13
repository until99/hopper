import TableWrapper from "../components/table/TableWrapper"
import TitleMainBar from "../components/TitleMainBar"
import Aside from "../layout/Aside"
import Header from "../layout/Header"

export default function Home() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Aside />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            <TitleMainBar />
            <TableWrapper />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-lg bg-card text-card-foreground md:col-span-1 overflow-hidden border-solid border-slate-200 border-2">
                <div className="flex flex-col space-y-1.5 p-6 bg-slate-50 border-solid border-slate-200 border-b-2">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">Dashboards</h3>
                  <p className="text-sm text-muted-foreground">Organized by workspace and group</p>
                </div>
                <div className="p-0">
                  <div className="p-2 max-h-[500px] overflow-y-auto">
                    <ul className="space-y-1">
                      <li>
                        <div className="flex items-center p-2 rounded-md hover:bg-slate-50">
                          <button className="mr-1 p-1 rounded-md hover:bg-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                            </svg>
                          </button>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className="mr-2 text-blue-500">
                            <path d="M245,110.64A16,16,0,0,0,232,104H216V88a16,16,0,0,0-16-16H130.67L102.94,51.2a16.14,16.14,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V208h0a8,8,0,0,0,8,8H211.1a8,8,0,0,0,7.59-5.47l28.49-85.47A16.05,16.05,0,0,0,245,110.64ZM93.34,64,123.2,86.4A8,8,0,0,0,128,88h72v16H69.77a16,16,0,0,0-15.18,10.94L40,158.7V64Zm112,136H43.1l26.67-80H232Z"></path>
                          </svg>
                          <span className="font-medium">Workspace 01</span>
                        </div>
                        <ul className="ml-6 mt-1 space-y-1">
                          <li>
                            <div className="flex items-center p-2 rounded-md hover:bg-slate-50">
                              <button className="mr-1 p-1 rounded-md hover:bg-slate-200">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                  <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z">
                                  </path>
                                </svg>
                              </button>
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className="mr-2 text-green-500">
                                <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
                              </svg>
                              <span className="font-medium">Group 01</span>
                            </div>
                            <ul className="ml-6 mt-1 space-y-1">
                              <li>
                                <button className="flex items-center w-full p-2 rounded-md text-left hover:bg-slate-50">
                                  <span className="text-sm">Sales Overview</span>
                                </button>
                              </li>
                              <li>
                                <button className="flex items-center w-full p-2 rounded-md text-left hover:bg-slate-50">
                                  <span className="text-sm">Customer Analytics</span>
                                </button>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <div className="flex items-center p-2 rounded-md hover:bg-slate-50">
                              <button className="mr-1 p-1 rounded-md hover:bg-slate-200">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                  <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                                </svg>
                              </button>
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className="mr-2 text-green-500">
                                <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
                              </svg>
                              <span className="font-medium">Group 02</span>
                            </div>
                          </li>
                        </ul>
                      </li>

                      <li>
                        <div className="flex items-center p-2 rounded-md hover:bg-slate-50">
                          <button className="mr-1 p-1 rounded-md hover:bg-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z">
                              </path>
                            </svg>
                          </button>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className="mr-2 text-blue-500">
                            <path d="M245,110.64A16,16,0,0,0,232,104H216V88a16,16,0,0,0-16-16H130.67L102.94,51.2a16.14,16.14,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V208h0a8,8,0,0,0,8,8H211.1a8,8,0,0,0,7.59-5.47l28.49-85.47A16.05,16.05,0,0,0,245,110.64ZM93.34,64,123.2,86.4A8,8,0,0,0,128,88h72v16H69.77a16,16,0,0,0-15.18,10.94L40,158.7V64Zm112,136H43.1l26.67-80H232Z"></path>
                          </svg>
                          <span className="font-medium">Workspace 02</span>
                        </div>
                      </li>

                    </ul>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-card text-card-foreground overflow-hidden border-solid border-slate-200 border-2" data-v0-t="card">
                    <div className="flex flex-col space-y-1.5 p-6 bg-slate-50 border-solid border-slate-200 border-b-2">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight">Recent Dashboards</h3>
                      <p className="text-sm text-muted-foreground">Your recently viewed dashboards</p>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2">
                        <li>
                          <button className="flex items-center w-full p-2 rounded-md text-left hover:bg-slate-50">
                            <span className="font-medium">Sales Overview</span>
                            <span className="ml-auto text-xs text-slate-500">Workspace 01 &gt; Group 01</span>
                          </button>
                        </li>
                        <li>
                          <button className="flex items-center w-full p-2 rounded-md text-left hover:bg-slate-50">
                            <span className="font-medium">Customer Analytics</span>
                            <span className="ml-auto text-xs text-slate-500">Workspace 01 &gt; Group 01</span>
                          </button>
                        </li>
                        <li>
                          <button className="flex items-center w-full p-2 rounded-md text-left hover:bg-slate-50">
                            <span className="font-medium">Customer Analytics</span>
                            <span className="ml-auto text-xs text-slate-500">Workspace 01 &gt; Group 02</span>
                          </button>
                        </li>
                        <li>
                          <button className="flex items-center w-full p-2 rounded-md text-left hover:bg-slate-50">
                            <span className="font-medium">Inventory Status</span>
                            <span className="ml-auto text-xs text-slate-500">Workspace 01 &gt; Group 02</span>
                          </button>
                        </li>
                        <li>
                          <button className="flex items-center w-full p-2 rounded-md text-left hover:bg-slate-50">
                            <span className="font-medium">Financial Summary</span>
                            <span className="ml-auto text-xs text-slate-500">Workspace 02 &gt; Group 03</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="rounded-lg bg-card text-card-foreground overflow-hidden border-solid border-slate-200 border-2" data-v0-t="card">
                    <div className="flex flex-col space-y-1.5 p-6 bg-slate-50 border-solid border-slate-200 border-b-2">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight">Featured Dashboards</h3>
                      <p className="text-sm text-muted-foreground">Recommended dashboards for you</p>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2">
                        <li>
                          <button className="flex items-center w-full p-2 rounded-md text-left hover:bg-slate-50">
                            <span className="font-medium">Sales Overview</span>
                            <span className="ml-auto text-xs text-slate-500">Workspace 01 &gt; Group 01</span>
                          </button>
                        </li>
                        <li>
                          <button className="flex items-center w-full p-2 rounded-md text-left hover:bg-slate-50">
                            <span className="font-medium">Customer Analytics</span>
                            <span className="ml-auto text-xs text-slate-500">Workspace 01 &gt; Group 01</span>
                          </button>
                        </li>
                        <li>
                          <button className="flex items-center w-full p-2 rounded-md text-left hover:bg-slate-50">
                            <span className="font-medium">Customer Analytics</span>
                            <span className="ml-auto text-xs text-slate-500">Workspace 01 &gt; Group 02</span>
                          </button>
                        </li>
                        <li>
                          <button className="flex items-center w-full p-2 rounded-md text-left hover:bg-slate-50">
                            <span className="font-medium">Inventory Status</span>
                            <span className="ml-auto text-xs text-slate-500">Workspace 01 &gt; Group 02</span>
                          </button>
                        </li>
                        <li>
                          <button className="flex items-center w-full p-2 rounded-md text-left hover:bg-slate-50">
                            <span className="font-medium">Financial Summary</span>
                            <span className="ml-auto text-xs text-slate-500">Workspace 02 &gt; Group 03</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div >
    </div >
  )
};