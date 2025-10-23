const RulesModal = ({onClose}) => {
  const [htmlContent, setHtmlContent] = React.useState('')
  
  React.useEffect(() => {
    fetch('rules_content.html')
      .then(response => response.text())
      .then(html => setHtmlContent(html))
      .catch(error => console.error('Error loading rules:', error))
  }, [])
  
  return React.createElement('div', {
      className: 'rules-modal-overlay',
      onClick: onClose
    },
    React.createElement('div', {
      className: 'rules-modal-container',
      onClick: (e) => e.stopPropagation()
    },
      React.createElement('div', {className: 'rules-modal-header'},
        React.createElement('h1', {className: 'rules-modal-title'}, 'GAME RULES'),
        React.createElement('button', {
          className: 'rules-modal-close',
          onClick: onClose
        }, '×')
      ),
      React.createElement('div', {
        className: 'rules-modal-content',
        dangerouslySetInnerHTML: {__html: htmlContent}
      })
    )
  )
}

window.RulesModal = RulesModal
