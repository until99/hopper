import { useRef, useEffect } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models, Report } from 'powerbi-client';

function App() {
  const reportRef = useRef<Report | null>(null);

  return (
    <div className="w-screen h-screen bg-slate-900">
      {/* <Home /> */}
      {/* <ReportPage /> */}

      <PowerBIEmbed
        embedConfig={{
          type: 'report',   // Supported types: report, dashboard, tile, visual, qna, paginated report and create
          id: 'ab0c64be-43bc-4335-a318-ce66a98038e9',
          embedUrl: '<Embed Url>',
          accessToken: '<Access Token>',
          tokenType: models.TokenType.Embed, // Use models.TokenType.Aad for SaaS embed
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false
              }
            },
            background: models.BackgroundType.Transparent,
          }
        }}

        eventHandlers={
          new Map([
            ['loaded', function () { console.log('Report loaded'); }],
            ['rendered', function () { console.log('Report rendered'); }],
            ['error', function (event?: any) {
              if (event) console.log(event.detail);
              else console.log('Error occurred with no details');
            }],
            ['visualClicked', () => console.log('visual clicked')],
            ['pageChanged', (event?: any) => {
              if (event) console.log(event);
              else console.log('Page changed with no event details');
            }],
          ])
        }

        cssClassName={"reportClass"}

        getEmbeddedComponent={(embeddedReport) => {
          reportRef.current = embeddedReport as Report;
        }}
      />
    </div>
  )
}

export default App;
