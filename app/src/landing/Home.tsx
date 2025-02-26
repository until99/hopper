import { Alien } from "@phosphor-icons/react";

function Home() {
  return (
    <div>
      {/* Navbar */}
      <nav className="bg-blue-400 w-full h-18 mb-5"></nav>

      {/* Cards */}
      <ul>
        <li className="bg-blue-400 w-[300px] h-[150px] mx-5 rounded cursor-pointer">
          <a href="/report" className="flex flex-col justify-center items-center h-full">
            <Alien size={32} />
            <p>Homologação</p>
          </a>
        </li>
      </ul>

    </div >
  )
}

export default Home;