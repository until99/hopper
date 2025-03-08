function ReportPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <iframe className="w-full h-full p-5"
        title="TeamsAttendanceReport"
        width={600}
        height={373.5}
        src="https://app.powerbi.com/view?r=eyJrIjoiZDIxYzIyOGEtN2FlMC00YjdmLWE5NzUtZDcxNWQ4OWFmNzI4IiwidCI6IjFiOGFlZDQ0LWE3ZDAtNDA5Yy05Nzk2LWIyNjQ1OTQ5ODZhMCJ9"
        allowFullScreen
      />
    </div>
  )
}

export default ReportPage;