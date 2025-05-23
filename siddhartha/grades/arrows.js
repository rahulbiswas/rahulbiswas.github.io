// Icons
const ArrowUpIcon = () =>
   React.createElement(
      'svg',
      {
         xmlns: 'http://www.w3.org/2000/svg',
         width: '16',
         height: '16',
         viewBox: '0 0 24 24',
         fill: 'none',
         stroke: 'currentColor',
         strokeWidth: '2',
         strokeLinecap: 'round',
         strokeLinejoin: 'round',
      },
      [
         React.createElement('line', {
            x1: '12',
            y1: '19',
            x2: '12',
            y2: '5',
         }),
         React.createElement('polyline', {
            points: '5 12 12 5 19 12',
         })
      ]
   )
const ArrowDownIcon = () =>
   React.createElement(
      'svg',
      {
         xmlns: 'http://www.w3.org/2000/svg',
         width: '16',
         height: '16',
         viewBox: '0 0 24 24',
         fill: 'none',
         stroke: 'currentColor',
         strokeWidth: '2',
         strokeLinecap: 'round',
         strokeLinejoin: 'round',
      },
      [
         React.createElement('line', {
            x1: '12',
            y1: '5',
            x2: '12',
            y2: '19',
         }),
         React.createElement('polyline', {
            points: '19 12 12 19 5 12',
         })
      ]
   )